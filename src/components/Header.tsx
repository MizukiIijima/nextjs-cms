import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/", label: "記事" },
  { href: "/categories", label: "カテゴリ" },
  { href: "/tags", label: "タグ" },
] as const;

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-268 items-center justify-between px-5 sm:px-8 lg:px-0">
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

        <nav aria-label="メインナビゲーション">
          <ul className="flex items-center gap-1 sm:gap-3">
            {navItems.map((item) => (
              <li
                key={item.href}
                className={item.href === "/" ? "hidden sm:block" : undefined}
              >
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
