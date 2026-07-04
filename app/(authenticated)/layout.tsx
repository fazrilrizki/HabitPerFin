import { SidebarProvider } from "@/components/ui/sidebar";
import { auth0 } from "@/lib/auth0";
import { AppSidebar } from "@/components/app-sidebar";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  const user = session?.user;
  
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={{
          name: user?.nickname ?? "",
          email: user?.email ?? "",
          avatar: user?.picture ?? "",
      }} />
      {children}
    </SidebarProvider>
  );
}
