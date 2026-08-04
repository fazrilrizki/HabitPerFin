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
      <div className="flex flex-col w-full min-h-screen max-w-full">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <footer className="py-4 text-center text-sm text-muted-foreground border-t">
          Built by <a href="https://fazrilrizki.vercel.app/about-me" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Fazril Rizki</a>
        </footer>
      </div>
    </SidebarProvider>
  );
}
