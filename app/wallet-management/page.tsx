"use server"

import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { columns, WalletManagement } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { CircleAlertIcon, PlusCircle } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import z from "zod";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/client";
import { revalidatePath } from "next/cache";
import { create } from "domain";

async function getData(): Promise<WalletManagement[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      name: 'Mandiri',
      initial_balance: 1000000,
      status: "Active",
    },
    // ...
  ]
}

async function createWallet(formData: FormData) {
  const name = formData.get("name") as string
  const initial_balance = formData.get("initial_balance") as string

  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    initial_balance: z.string().min(1, "Initial balance is required")
  })

  const parsed = schema.safeParse({name, initial_balance})
  if (!parsed.success) {

  }

  await prisma.walletManagements.create({
    data: {
      name: parsed.data.name,
      initial_balance: new Decimal(parsed.data.initial_balance),
      status: "Active"
    }
  })

  revalidatePath("/wallet-management")
}

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
                  <form action={createWallet}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
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
                      <FieldGroup>
                        <Field>
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" placeholder="Mandiri" />
                        </Field>
                        <Field>
                          <Label htmlFor="initial-balance">Initial Balance</Label>
                          <Input id="initial-balance" name="initial-balance" placeholder="Rp. 100.000" />
                        </Field>
                      </FieldGroup>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
                <DataTable columns={columns} data={data}/>
            </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}
