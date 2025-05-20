
import { ReactNode } from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SidebarNavItemProps {
  path: string;
  icon: ReactNode;
  label: string;
}

export function SidebarNavItem({ path, icon, label }: SidebarNavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton className="bg-gradient-to-r from-brand-400 to-brand-500 text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:from-brand-400/90 hover:to-brand-500/90 transition-all duration-300" asChild>
        <a href={path}>
          {icon}
          <span>{label}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

interface SidebarNavProps {
  items: {
    path: string;
    icon: ReactNode;
    label: string;
  }[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarNavItem
          key={item.path}
          path={item.path}
          icon={item.icon}
          label={item.label}
        />
      ))}
    </SidebarMenu>
  );
}
