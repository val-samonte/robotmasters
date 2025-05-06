import * as React from 'react'
import { Code, CopyPlus, ScrollText, Swords } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavItembox } from './nav-itembox'
import { NavComponents } from './nav-components'
import { NavWallet } from './nav-wallet'

const data = {
  navItembox: [
    {
      title: 'Blueprints',
      icon: ScrollText,
      isActive: true,
      url: '/',
      items: [
        {
          title: 'Integrate',
          url: '/',
        },
      ],
    },
  ],
  navComponents: [
    {
      name: 'Conditions',
      url: '/conditions',
      icon: Code,
    },
    {
      name: 'Actions',
      url: '/actions',
      icon: Swords,
    },
    {
      name: 'Spawns',
      url: '/spawns',
      icon: CopyPlus,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={
                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-none hover:bg-transparent active:bg-transparent'
              }
            >
              <img
                src="/logo-icon.png"
                alt="Robot Masters Logo"
                className="aspect-square size-8 object-cover"
              />
              <div className="grid flex-1 text-left leading-tight">
                <h1 className="text-lg truncate">Robot Masters</h1>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavItembox items={data.navItembox} />
        <NavComponents items={data.navComponents} />
      </SidebarContent>
      <SidebarFooter>
        <NavWallet />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
