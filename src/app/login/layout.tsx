import type { Metadata } from "next";
import { redirect } from "next/navigation";

import "@/src/app/globals.css";
import { getSession } from "@/src/lib/auth/session";

export const metadata: Metadata = {
  title: "ログイン画面",
};

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}