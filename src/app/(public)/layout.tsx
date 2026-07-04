import type { Metadata } from "next";
import Header from "@/src/components/Header";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "zimamemo",
    template: "%s - zimamemo",
  },
  description: "zimamemo - 仕事や学習を通して学んだことをまとめる技術ブログです。",
  applicationName: "zimamemo",
  openGraph: {
    siteName: "zimamemo",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-screen bg-white">
        <div className="min-h-screen">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
