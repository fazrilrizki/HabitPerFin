import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getData } from "./actions";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function TransferBalancePage() {
    const session = await auth0.getSession();
    if (!session) redirect("/auth/login");
    
    return (
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
                                <BreadcrumbLink href="/transfer-balance">
                                    Transfer Balance
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="container flex flex-1 flex-col gap-4 md:min-h-min p-4">
                    <div className="flex items-center justify-between w-full mb-2">
                        <h1 className="text-xl font-bold">Transfer Balance</h1>
                    </div>
                    <DataTable 
                        columns={columns} 
                        data={await getData()}
                        actionButton={
                            <Button variant="default" size="sm" className="h-8" asChild>
                                <Link href="/transfer-balance/create">
                                    <PlusCircle className="w-4 h-4 mr-2"/> Add Transfer
                                </Link>
                            </Button>
                        }
                    />
                </div>
            </div>
        </SidebarInset>
    )
}