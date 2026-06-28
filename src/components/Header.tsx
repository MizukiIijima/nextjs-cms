import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-slate-200/90 bg-white">
      <div className="mx-auto flex h-18 w-full max-w-268 items-center justify-center px-5 sm:px-8 lg:px-0">
        <Link
          href="/"
          aria-label="トップ"
          className="relative block h-6 w-32 shrink-0 overflow-hidden sm:h-7 sm:w-44"
        >
          <Image
            src="/logo.webp"
            alt="ZIMAMEMO Logo"
            fill
            sizes="(max-width: 639px) 128px, 176px"
            priority
            className="object-cover"
          />
        </Link>
      </div>
    </header>
  );
}
