import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/app-sidebar";
import { Toaster } from "./components/ui/sonner";
import { Outlet } from "react-router-dom";

export default function Layout() {
  if (!("go" in window)) location.replace("/");
  return (
    <div className="min-h-screen dark text-neutral-200 min-w-screen bg-neutral-950">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full mx-4">
          <SidebarTrigger />
          <Outlet />
          <Toaster />
        </main>
      </SidebarProvider>
    </div>
  );
}
