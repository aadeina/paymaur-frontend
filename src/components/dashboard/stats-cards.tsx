'use client'

import { TrendingUp, TrendingDown, ArrowUpRight, Receipt } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface StatCard {
  title: string
  value: number
  change: number
  icon: React.ElementType
  color: string
}

const stats: StatCard[] = [
  {
    title: 'Total Sent',
    value: 45000,
    change: 12.5,
    icon: ArrowUpRight,
    color: 'text-red-500',
  },
  {
    title: 'Total Received',
    value: 78000,
    change: 8.2,
    icon: TrendingUp,
    color: 'text-green-500',
  },
  {
    title: 'Bills Paid',
    value: 12500,
    change: -3.1,
    icon: Receipt,
    color: 'text-blue-500',
  },
  {
    title: 'Transactions',
    value: 156,
    change: 24.3,
    icon: TrendingUp,
    color: 'text-purple-500',
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">
                    {typeof stat.value === 'number' && stat.value > 999
                      ? formatCurrency(stat.value)
                      : stat.value}
                  </p>
                </div>
              </div>
            </div>

            {/* Change Indicator */}
            <div className="mt-4 flex items-center gap-1">
              {stat.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  stat.change > 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.change > 0 ? '+' : ''}
                {stat.change}%
              </span>
              <span className="text-sm text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
