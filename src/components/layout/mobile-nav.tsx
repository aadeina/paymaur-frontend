'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wallet, ArrowLeftRight, Receipt, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

const navigation = [
  { name: 'Home', href: ROUTES.DASHBOARD, icon: Home },
  { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { name: 'Transfer', href: '/dashboard/transfer', icon: ArrowLeftRight },
  { name: 'Bills', href: '/dashboard/bills', icon: Receipt },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
      <div className="flex items-center justify-around">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 min-w-[80px] transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-6 w-6', isActive && 'fill-current')} />
              <span className="mt-1 text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
