import type { Metadata } from "next";

import "@/src/app/globals.css";

export const metadata: Metadata = {
  title: "ログイン画面",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}