import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { auth0 } from "@/lib/auth0";
import { DataTable } from "./data-table";
import { getData } from "./actions";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ExpenseCategoryPage() {
  const session = await auth0.getSession();
  const user = session?.user;
  if (!session) redirect("/auth/login");
  const data = await getData();

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
                  <BreadcrumbLink href="#">
                    Income
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Button variant="outline" size="sm" className="w-fit" asChild>
              <Link href="/income/create">
                <PlusCircle /> Add Income
              </Link>
            </Button>
            <DataTable columns={columns} data={data}/>
        </div>
    </SidebarInset>
  )
}