"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  ArrowUpRight,
  AudioWaveform,
  BanknoteArrowUp,
  BookOpen,
  Command,
  GalleryVerticalEnd,
  LayoutDashboardIcon,
  PiggyBank,
  Target,
  TrendingDown,
  WalletMinimal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
  ],
  navMaster: [
    {
      title: "Wallet Management",
      url: "/wallet-management",
      icon: WalletMinimal,
    },
    {
      title: "Expense Category",
      url: "/expense-category",
      icon: BookOpen,
    },
  ],
  navTransaction: [
    {
      title: "Expense",
      url: "/expense",
      icon: TrendingDown
    },
    {
      title: "Income",
      url: "/income",
      icon: BanknoteArrowUp
    },
    {
      title: "Financial Goals",
      url: "/financial-goals",
      icon: PiggyBank
    },
    {
      title: "Habit Tracker",
      url: "/habits",
      icon: Target
    }
  ]
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string
    email: string
    avatar: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  const navItems = data.navMain.map((item) => ({
    ...item,
    isActive: pathname === item.url || pathname.startsWith(`${item.url}/`),
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <SidebarGroup>
          <SidebarGroupLabel>Master</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMaster.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Transaction</SidebarGroupLabel>
          <SidebarMenu>
            {data.navTransaction.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ?? data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
