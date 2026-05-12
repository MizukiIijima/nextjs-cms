'use client';

import SidebarLink from "./SidebarLink";
import {
  FileText,
  FolderTree,
  Images,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Tags,
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
  { href: "/dashboard/medias", label: "メディア管理", Icon: Images },
  { href: "/dashboard/comments", label: "コメント管理", Icon: MessageCircle },
  { href: "/dashboard/logout", label: "ログアウト", Icon: LogOut },
];

export default function Sidebar() {
  return (
    <nav aria-label="管理メニュー" className="bg-sidebar w-[200px] shrink-0 py-8 px-4">
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
      </ul>
    </nav>
  );
}
