import "dotenv/config";

import assert from "node:assert/strict";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import { hash, verify } from "@node-rs/argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { Client } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";

// Run real migrations and the application's auth handler in a disposable schema.
// Never use the application's public schema or real administrator credentials.
test("Better Auth migration and authentication", async (t) => {
  const connectionString = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
  assert.ok(connectionString, "DATABASE_URL または TEST_DATABASE_URL が必要です");
  if (!process.env.TEST_DATABASE_URL) {
    assert.ok(
      ["localhost", "127.0.0.1", "[::1]"].includes(new URL(connectionString).hostname),
      "リモート DB を使う場合は専用の TEST_DATABASE_URL を指定してください",
    );
  }

  const schema = `auth_test_${randomUUID().replaceAll("-", "")}`;
  const sql = new Client({ connectionString, connectionTimeoutMillis: 5000 });
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }, { schema }),
  });
  const email = "admin@example.test";
  const password = "existing-admin-password";
  const passwordHash = await hash(password, {
    memoryCost: 19_456, timeCost: 2, parallelism: 1, outputLen: 32,
  });
  const legacyToken = randomBytes(32).toString("base64url");
  let createdSchema = false;

  await sql.connect();
  try {
    await sql.query(`CREATE SCHEMA "${schema}"`);
    createdSchema = true;
    await sql.query(`SET search_path TO "${schema}"`);

    const migrationRoot = new URL("../prisma/migrations/", import.meta.url);
    const migrations = (await readdir(migrationRoot, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    for (const migration of migrations) {
      if (migration === "20261005120000_migrate_to_better_auth") {
        await sql.query(
          'INSERT INTO "User" ("id", "email", "passwordHash", "updatedAt") VALUES (42, $1, $2, NOW())',
          [email, passwordHash],
        );
        await sql.query(
          'INSERT INTO "AdminSession" ("id", "tokenHash", "userId", "expiresAt") VALUES ($1, $2, 42, NOW() + INTERVAL \'7 days\')',
          [randomUUID(), createHash("sha256").update(legacyToken).digest("hex")],
        );
        await sql.query(
          'INSERT INTO "Post" ("title", "slug", "content", "updatedAt") VALUES (\'Existing post\', \'existing-post\', \'Keep this content\', NOW())',
        );
      }
      await sql.query(await readFile(new URL(`${migration}/migration.sql`, migrationRoot), "utf8"));
    }

    process.env.BETTER_AUTH_URL = "http://localhost:3000";
    process.env.BETTER_AUTH_SECRET = randomBytes(32).toString("base64url");
    // The app reuses this instance in development/test, so it queries only our schema.
    (globalThis as typeof globalThis & { prisma?: PrismaClient }).prisma = prisma;
    const { auth } = await import("../src/lib/auth");

    function request(path: string, options: {
      body?: Record<string, unknown>;
      cookie?: string;
      ip?: string;
      origin?: string;
    } = {}) {
      return auth.handler(new Request(`http://localhost:3000/api/auth${path}`, {
        method: options.body ? "POST" : "GET",
        headers: {
          "content-type": "application/json",
          origin: options.origin ?? "http://localhost:3000",
          "x-forwarded-for": options.ip ?? "192.0.2.1",
          ...(options.cookie ? { cookie: options.cookie } : {}),
        },
        ...(options.body ? { body: JSON.stringify(options.body) } : {}),
      }));
    }

    async function signIn(ip: string) {
      const response = await request("/sign-in/email", { body: { email, password }, ip });
      assert.equal(response.status, 200);
      const cookies = response.headers.getSetCookie();
      assert.ok(cookies.some((cookie) => cookie.includes("HttpOnly") && cookie.includes("SameSite=Lax")));
      return cookies.map((cookie) => cookie.split(";")[0]).join("; ");
    }

    await t.test("preserves existing IDs, password hashes and content", async () => {
      const user = await prisma.user.findUniqueOrThrow({ where: { id: 42 }, include: { accounts: true } });
      assert.equal(user.email, email);
      assert.equal(user.accounts[0].accountId, "42");
      assert.equal(user.accounts[0].providerId, "credential");
      assert.equal(user.accounts[0].password, passwordHash);
      assert.ok(await verify(user.accounts[0].password!, password));
      assert.equal((await prisma.post.findUniqueOrThrow({ where: { slug: "existing-post" } })).content, "Keep this content");
    });

    await t.test("blocks public registration", async () => {
      const response = await request("/sign-up/email", {
        body: { name: "Uninvited", email: "uninvited@example.test", password },
      });
      assert.equal(response.status, 400);
      assert.equal((await response.json()).code, "EMAIL_PASSWORD_SIGN_UP_DISABLED");
      assert.equal(await prisma.user.count(), 1);
    });

    await t.test("rejects wrong passwords and unknown accounts equally", async () => {
      for (const body of [{ email, password: "wrong-password" }, { email: "unknown@example.test", password }]) {
        const response = await request("/sign-in/email", { body, ip: "192.0.2.2" });
        assert.equal(response.status, 401);
        assert.equal((await response.json()).code, "INVALID_EMAIL_OR_PASSWORD");
      }
    });

    await t.test("accepts the old password and revokes sessions on logout", async () => {
      const cookie = await signIn("192.0.2.3");
      const sessionResponse = await request("/get-session", { cookie });
      const session = await sessionResponse.json();
      assert.equal(session.user.id, "42");
      assert.equal(session.user.email, email);
      assert.ok(new Date(session.session.expiresAt).getTime() > Date.now() + 6 * 24 * 60 * 60 * 1000);
      const logout = await request("/sign-out", { body: {}, cookie });
      assert.equal(logout.status, 200);
      assert.ok(logout.headers.getSetCookie().some((value) => value.includes("Max-Age=0")));
      assert.equal(await (await request("/get-session", { cookie })).json(), null);
      assert.equal(await prisma.session.count(), 0);
    });

    await t.test("rejects legacy, forged and expired sessions", async () => {
      for (const cookie of [`admin_session=${legacyToken}`, "better-auth.session_token=forged"]) {
        assert.equal(await (await request("/get-session", { cookie })).json(), null);
      }
      const cookie = await signIn("192.0.2.4");
      await prisma.session.updateMany({ data: { expiresAt: new Date(Date.now() - 1000) } });
      assert.equal(await (await request("/get-session", { cookie })).json(), null);
    });

    await t.test("rejects requests from an untrusted origin", async () => {
      const response = await request("/sign-in/email", {
        body: { email, password }, ip: "192.0.2.5", origin: "https://untrusted.example",
      });
      assert.equal(response.status, 403);
    });

    await t.test("limits concurrent direct login requests using the database", async () => {
      const responses = await Promise.all(Array.from({ length: 8 }, () => request("/sign-in/email", {
        body: { email, password: "wrong-password" }, ip: "192.0.2.6",
      })));
      assert.equal(responses.filter((r) => r.status === 401).length, 5);
      assert.equal(responses.filter((r) => r.status === 429).length, 3);
      assert.ok(Number(responses.find((r) => r.status === 429)!.headers.get("x-retry-after")) > 0);
      assert.ok(await prisma.rateLimit.count() > 0);
    });
  } finally {
    await prisma.$disconnect();
    delete (globalThis as typeof globalThis & { prisma?: PrismaClient }).prisma;
    if (createdSchema && /^auth_test_[a-f0-9]{32}$/.test(schema)) {
      await sql.query("ROLLBACK");
      await sql.query(`DROP SCHEMA "${schema}" CASCADE`);
    }
    await sql.end();
  }
});
