"use server";

import { redirect } from "next/navigation";

import { deleteSession } from "@/src/lib/auth/session";

export async function logout() {
  await deleteSession();

  redirect("/login");
}
