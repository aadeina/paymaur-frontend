'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  QrCode,
  Plus,
  History,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const actions = [
  {
    name: 'Send Money',
    icon: ArrowUpRight,
    href: '/dashboard/transfer',
    color: 'bg-blue-500',
  },
  {
    name: 'Request',
    icon: ArrowDownLeft,
    href: '/dashboard/request',
    color: 'bg-green-500',
  },
  {
    name: 'Pay Bills',
    icon: Receipt,
    href: '/dashboard/bills',
    color: 'bg-purple-500',
  },
  {
    name: 'QR Scan',
    icon: QrCode,
    href: '/dashboard/qr-scan',
    color: 'bg-orange-500',
  },
  {
    name: 'Top Up',
    icon: Plus,
    href: '/dashboard/top-up',
    color: 'bg-pink-500',
  },
  {
    name: 'History',
    icon: History,
    href: '/dashboard/transactions',
    color: 'bg-indigo-500',
  },
]

export function QuickActions() {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {actions.map((action) => (
            <button
              key={action.name}
              onClick={() => router.push(action.href)}
              className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-accent transition-colors"
            >
              <div className={`${action.color} p-3 rounded-full text-white`}>
                <action.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-center">{action.name}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
