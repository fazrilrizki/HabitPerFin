import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getData } from "./actions";
import { AddWalletDialog } from "./add-wallet-dialog";

export default async function Page() {
  const session = await auth0.getSession();
  const user = session?.user;
  if (!session) redirect("/auth/login");
  const data = await getData();

  return (
    <SidebarProvider>
      <AppSidebar user={{
          name: user?.nickname ?? "",
          email: user?.email ?? "",
          avatar: user?.picture ?? "",
        }} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Wallet Management
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="container flex flex-1 flex-col gap-4 rounded-xl bg-muted/50 md:min-h-min p-4">
                <AddWalletDialog />
                <DataTable columns={columns} data={data}/>
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
