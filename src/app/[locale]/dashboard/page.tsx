'use client'

import { BalanceCard } from '@/components/dashboard/balance-card'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { useAuthStore } from '@/store/auth.store'

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.username || 'User'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your account today
        </p>
      </div>

      {/* Balance Card */}
      <BalanceCard />

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Actions & Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <RecentTransactions />
      </div>
    </div>
  )
}
