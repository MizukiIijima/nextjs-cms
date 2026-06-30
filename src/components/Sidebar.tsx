'use client';

import { logout } from "@/src/app/(admin)/dashboard/actions";
import SidebarLink from "./SidebarLink";
import {
  FileText,
  FolderTree,
  Images,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Tags,
  UserPen,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "ダッシュボード", Icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "記事一覧", Icon: FileText },
  { href: "/dashboard/categories", label: "カテゴリ一覧", Icon: FolderTree },
  { href: "/dashboard/tags", label: "タグ一覧", Icon: Tags },
  { href: "/dashboard/profile", label: "プロフィール編集", Icon: UserPen },
  { href: "/dashboard/medias", label: "メディア管理", Icon: Images },
  { href: "/dashboard/comments", label: "コメント管理", Icon: MessageCircle },
];

export default function Sidebar() {
  return (
    <nav aria-label="管理メニュー" className="bg-sidebar w-50 shrink-0 py-8 px-4">
      <ul className="space-y-4">
        {navItems.map(({ href, label, Icon }) => (
          <li key={href}>
            <SidebarLink 
              href={href} 
              style="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors" 
              Icon={Icon} 
              label={label}
            />
          </li>
        ))}
        <li>
          <form action={logout}>
            <button
              className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              type="submit"
            >
              <LogOut
                aria-hidden="true"
                className="size-5 shrink-0 text-white/70 group-hover:text-white/80"
                strokeWidth={1.9}
              />
              <span>ログアウト</span>
            </button>
          </form>
        </li> 
      </ul>
    </nav>
  );
}
