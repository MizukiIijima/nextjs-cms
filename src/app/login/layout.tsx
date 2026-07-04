import type { Metadata } from "next";
import { redirect } from "next/navigation";

import "@/src/app/globals.css";
import { getSession } from "@/src/lib/auth/session";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: "ログイン画面",
  robots: {
    index: false,
    follow: false,
  },
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
