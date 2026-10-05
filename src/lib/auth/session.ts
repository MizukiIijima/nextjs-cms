import "server-only";

import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function deleteSession() {
  await auth.api.signOut({ headers: await headers() });
}
