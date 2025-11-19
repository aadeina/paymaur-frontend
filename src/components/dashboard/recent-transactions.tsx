'use client'

import { ArrowUpRight, ArrowDownLeft, Receipt } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/hooks/use-wallet'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Transaction } from '@/types'

function TransactionIcon({ type }: { type: Transaction['type'] }) {
  switch (type) {
    case 'transfer':
      return <ArrowUpRight className="h-5 w-5 text-destructive" />
    case 'cash_in':
      return <ArrowDownLeft className="h-5 w-5 text-green-500" />
    case 'bill_payment':
      return <Receipt className="h-5 w-5 text-blue-500" />
    default:
      return <ArrowUpRight className="h-5 w-5" />
  }
}

function TransactionStatus({ status }: { status: Transaction['status'] }) {
  const colors = {
    completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
  }

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export function RecentTransactions() {
  const { transactions, isLoadingTransactions } = useWallet()

  const recentTransactions = transactions?.data?.slice(0, 5) || []

  if (isLoadingTransactions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-10 w-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="h-4 bg-muted rounded w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/transactions">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions yet</p>
            <p className="text-sm mt-2">Your transactions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                {/* Icon */}
                <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                  <TransactionIcon type={transaction.type} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>

                {/* Amount & Status */}
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'cash_in' ? 'text-green-500' : 'text-destructive'
                  }`}>
                    {transaction.type === 'cash_in' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <div className="mt-1">
                    <TransactionStatus status={transaction.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
