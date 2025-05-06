import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar'
import { DropdownMenuContent } from './ui/dropdown-menu'
import { ArrowLeftRight, ChevronsUpDown, LogIn, LogOut } from 'lucide-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useUserWallet } from '@/atoms/userWalletAtom'
import { trimAddress } from '@/utils/trimAddress'

export function NavWallet() {
  const { isMobile } = useSidebar()
  const wallet = useUserWallet()
  const { setVisible } = useWalletModal()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {wallet?.publicKey ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {trimAddress(wallet.publicKey.toBase58())}
                  </span>
                  {/* <span className="truncate text-xs">SOL 0.1232</span> */}
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setVisible(true)
                  }}
                >
                  <ArrowLeftRight />
                  Switch Wallet
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => wallet.disconnect()}>
                <LogOut />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SidebarMenuButton
            onClick={() => {
              setVisible(true)
            }}
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Connect</span>
            </div>
            <LogIn className="ml-auto size-4" />
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
