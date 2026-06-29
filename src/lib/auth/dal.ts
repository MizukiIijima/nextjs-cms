import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { getSession } from "@/src/lib/auth/session";

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return {
    isAuthenticated: true as const,
    user: session.user,
  };
});
