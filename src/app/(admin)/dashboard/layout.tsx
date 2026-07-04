import type { Metadata } from "next";
import { verifySession } from "@/src/lib/auth/dal";
import "@/src/app/globals.css";
import Sidebar from "@/src/components/Sidebar";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL || "http://localhost:3000",
  ),
  title: "zimamemo - 管理画面",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await verifySession();
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="">
        <div className="flex min-h-screen">
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
