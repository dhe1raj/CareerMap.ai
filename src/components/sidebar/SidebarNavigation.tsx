
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./SidebarNav";
import { navigationItems } from "./navigationItems";
import { aboutItems } from "./aboutItems";

export function SidebarNavigation() {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarNav items={navigationItems} />
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>About</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarNav items={aboutItems} />
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
