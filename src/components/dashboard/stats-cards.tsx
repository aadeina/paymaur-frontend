'use client'

import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Receipt, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { transactionsService } from '@/lib/api/services/transactions.service'
import { QUERY_KEYS } from '@/lib/constants'

interface StatCard {
  title: string
  value: number | string
  change: number
  trend: string
  icon: React.ElementType
  color: string
  isCurrency: boolean
}

export function StatsCards() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, 'analytics'],
    queryFn: () => transactionsService.getAnalytics(),
    staleTime: 60000, // 1 minute
  })

  // Transform analytics data to stats format
  const stats: StatCard[] = analytics ? [
    {
      title: 'Total Sent',
      value: parseFloat(analytics.total_sent.amount) || 0,
      change: analytics.total_sent.change_percent,
      trend: analytics.total_sent.trend,
      icon: ArrowUpRight,
      color: 'text-red-500',
      isCurrency: true,
    },
    {
      title: 'Total Received',
      value: parseFloat(analytics.total_received.amount) || 0,
      change: analytics.total_received.change_percent,
      trend: analytics.total_received.trend,
      icon: ArrowDownLeft,
      color: 'text-green-500',
      isCurrency: true,
    },
    {
      title: 'Bills Paid',
      value: parseFloat(analytics.bills_paid.amount) || 0,
      change: analytics.bills_paid.change_percent,
      trend: analytics.bills_paid.trend,
      icon: Receipt,
      color: 'text-blue-500',
      isCurrency: true,
    },
    {
      title: 'Transactions',
      value: analytics.transactions.count,
      change: analytics.transactions.change_percent,
      trend: analytics.transactions.trend,
      icon: Activity,
      color: 'text-purple-500',
      isCurrency: false,
    },
  ] : []

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Unable to load stats</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const isPositive = stat.trend === 'up' || stat.change > 0
        const isNeutral = stat.trend === 'neutral' || stat.change === 0

        return (
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
                      {stat.isCurrency
                        ? formatCurrency(stat.value as number)
                        : stat.value}
                    </p>
                  </div>
                </div>
              </div>

              {/* Change Indicator */}
              <div className="mt-4 flex items-center gap-1">
                {isNeutral ? (
                  <span className="text-sm text-muted-foreground">No change</span>
                ) : (
                  <>
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        isPositive ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {stat.change}%
                    </span>
                    <span className="text-sm text-muted-foreground">from last month</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
