'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";

type LinkProps = {
  href: string;
  style: string;
  Icon: LucideIcon;
  label: string;
};

export default function SidebarLink({ href, style, Icon, label }: LinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`group ${style} ${
        isActive
          ? "bg-white text-slate-950 shadow-sm hover:bg-white hover:text-slate-950"
          : "text-white/85 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon
        aria-hidden="true"
        className={`size-5 shrink-0 ${
          isActive ? "text-slate-800" : "text-white/70 group-hover:text-white/80"
        }`}
        strokeWidth={1.9}
      />
      <span>{label}</span>
    </Link>
  );
}
