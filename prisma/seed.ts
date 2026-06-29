import "dotenv/config";

import { hash, type Options } from "@node-rs/argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URLが設定されていません");
}

// ここってPrismaClientをインポートするじゃだめなの？
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const PASSWORD_HASH_OPTIONS = {
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
} satisfies Options;

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAILとADMIN_PASSWORDを設定してください");
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORDは12文字以上にしてください");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    console.log("管理者アカウントはすでに存在します");
    return;
  }

  const passwordHash = await hash(password, PASSWORD_HASH_OPTIONS);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
