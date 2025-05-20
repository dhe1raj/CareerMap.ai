
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarUserProfile } from "./SidebarUserProfile";

export default function SidebarLayout() {
  return (
    <Sidebar>
      <SidebarHeader className="py-6 px-3">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarUserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
