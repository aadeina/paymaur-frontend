'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Filter, ArrowUpRight, ArrowDownLeft, Receipt, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TransactionFilters } from '@/components/transactions/transaction-filters'
import { transactionsService } from '@/lib/api/services/transactions.service'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TransactionFilters as Filters, Transaction } from '@/types'
import { QUERY_KEYS } from '@/lib/constants'

function TransactionIcon({ type }: { type: Transaction['type'] }) {
  switch (type) {
    case 'transfer':
      return <ArrowUpRight className="h-5 w-5 text-red-500" />
    case 'cash_in':
      return <ArrowDownLeft className="h-5 w-5 text-green-500" />
    case 'bill_payment':
      return <Receipt className="h-5 w-5 text-blue-500" />
    default:
      return <ArrowUpRight className="h-5 w-5" />
  }
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  // Map backend status values to display properties
  const statusConfig: Record<string, { style: string; icon: typeof CheckCircle; label: string }> = {
    // Backend values (uppercase)
    SUCCESS: {
      style: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      icon: CheckCircle,
      label: 'Success',
    },
    PENDING: {
      style: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      icon: Clock,
      label: 'Pending',
    },
    FAILED: {
      style: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      icon: XCircle,
      label: 'Failed',
    },
    CANCELLED: {
      style: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
      icon: XCircle,
      label: 'Cancelled',
    },
    // Frontend values (lowercase) for backwards compatibility
    completed: {
      style: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      icon: CheckCircle,
      label: 'Completed',
    },
    pending: {
      style: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      icon: Clock,
      label: 'Pending',
    },
    failed: {
      style: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      icon: XCircle,
      label: 'Failed',
    },
    cancelled: {
      style: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
      icon: XCircle,
      label: 'Cancelled',
    },
  }

  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${config.style}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
}

export default function TransactionsPage() {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 20,
  })

  const { data: rawData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, filters],
    queryFn: () => transactionsService.getTransactions(filters),
  })

  // Handle both array response and paginated response from backend
  const data = rawData ? (
    Array.isArray(rawData)
      ? { data: rawData, total: rawData.length, totalPages: 1 }
      : rawData
  ) : undefined

  const handleExport = async () => {
    try {
      const blob = await transactionsService.exportTransactions(filters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const clearFilters = () => {
    setFilters({ page: 1, limit: 20 })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <TransactionFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClear={clearFilters}
            />
          </div>
        )}

        {/* Transactions List */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg border animate-pulse">
                      <div className="h-12 w-12 bg-muted rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                      <div className="h-6 bg-muted rounded w-24" />
                    </div>
                  ))}
                </div>
              ) : !data || data.data.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Receipt className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium">No transactions found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your filters or make your first transaction
                  </p>
                  <Button className="mt-4" onClick={() => router.push('/dashboard/transfer')}>
                    Send Money
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.data.map((transaction) => {
                    const isIncoming = transaction.type === 'cash_in'

                    return (
                      <button
                        key={transaction.id}
                        onClick={() => router.push(`/dashboard/transactions/${transaction.id}`)}
                        className="w-full flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors text-left"
                      >
                        {/* Icon */}
                        <div className="flex-shrink-0 h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                          <TransactionIcon type={transaction.type} />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-muted-foreground">
                              {formatDate(transaction.createdAt)}
                            </p>
                            {transaction.reference && (
                              <>
                                <span className="text-muted-foreground">•</span>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {transaction.reference}
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Amount & Status */}
                        <div className="text-right space-y-2">
                          <p className={`font-semibold text-lg ${
                            isIncoming ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {isIncoming ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          <StatusBadge status={transaction.status} />
                        </div>
                      </button>
                    )
                  })}

                  {/* Pagination */}
                  {data.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Showing {((filters.page || 1) - 1) * (filters.limit || 20) + 1} to{' '}
                        {Math.min((filters.page || 1) * (filters.limit || 20), data.total)} of {data.total} transactions
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={(filters.page || 1) === 1}
                          onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={(filters.page || 1) === data.totalPages}
                          onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
