'use client'

import { Bell, Eye, EyeOff, Menu, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth.store'
import { useWalletStore } from '@/store/wallet.store'
import { useWallet } from '@/hooks/use-wallet'
import { formatCurrency } from '@/lib/utils'
import { useUIStore } from '@/store/ui.store'

export function Header() {
  const { user } = useAuthStore()
  const { showBalance, toggleShowBalance } = useWalletStore()
  const { balance, isLoadingBalance, refreshBalance } = useWallet()
  const { toggleSidebar } = useUIStore()

  // Get initials from username (first 2 characters) or fallback to 'U'
  const userInitials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U'

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Menu button (mobile) + Balance */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <div className="flex items-center gap-2">
                {showBalance ? (
                  <p className="text-2xl font-bold">
                    {isLoadingBalance
                      ? '...'
                      : formatCurrency(balance?.balance || 0)}
                  </p>
                ) : (
                  <p className="text-2xl font-bold">••••••</p>
                )}
                <button
                  onClick={toggleShowBalance}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showBalance ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={refreshBalance}
                  disabled={isLoadingBalance}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  <RefreshCw
                    className={cn('h-4 w-4', isLoadingBalance && 'animate-spin')}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.phone}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
