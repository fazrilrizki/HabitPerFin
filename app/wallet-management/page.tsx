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
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getData, createWallet } from "./actions";

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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-fit">
                      <PlusCircle /> Add Wallet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Add wallet</DialogTitle>
                      <DialogDescription>
                        Add or create your wallet here. Click save when you&apos;re
                        done.
                      </DialogDescription>
                    </DialogHeader>
                    <form action={createWallet}>
                      <FieldGroup>
                        <Field>
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" placeholder="Mandiri" />
                        </Field>
                        <Field>
                          <Label htmlFor="initial_balance">Initial Balance</Label>
                          <Input id="initial_balance" name="initial_balance" placeholder="1000000" />
                        </Field>
                      </FieldGroup>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <DataTable columns={columns} data={data}/>
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
