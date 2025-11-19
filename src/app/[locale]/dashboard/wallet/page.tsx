'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, RefreshCw, Lock, Unlock, ArrowUpRight, ArrowDownLeft, Send, Plus, History } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { walletService } from '@/lib/api/services/wallet.service'
import { useWalletStore } from '@/store/wallet.store'
import { formatCurrency, formatDate } from '@/lib/utils'
import { QUERY_KEYS } from '@/lib/constants'

export default function WalletPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { showBalance, toggleShowBalance } = useWalletStore()
  const [isLocking, setIsLocking] = useState(false)

  // Fetch wallet balance
  const { data: balance, isLoading: isLoadingBalance, refetch: refreshBalance } = useQuery({
    queryKey: [QUERY_KEYS.WALLET],
    queryFn: () => walletService.getBalance(),
  })

  // Fetch wallet transactions
  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
    queryKey: [QUERY_KEYS.WALLET, 'transactions'],
    queryFn: () => walletService.getTransactions({ page: 1, limit: 10 }),
  })

  // Lock wallet mutation
  const lockMutation = useMutation({
    mutationFn: () => walletService.lockWallet(),
    onSuccess: () => {
      toast.success('Wallet locked successfully')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to lock wallet')
    },
  })

  // Unlock wallet mutation
  const unlockMutation = useMutation({
    mutationFn: () => walletService.unlockWallet(),
    onSuccess: () => {
      toast.success('Wallet unlocked successfully')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to unlock wallet')
    },
  })

  const walletBalance = balance?.balance || 0
  const isLocked = balance?.isLocked || false
  const transactions = transactionsData?.data || []

  const handleToggleLock = () => {
    setIsLocking(true)
    if (isLocked) {
      unlockMutation.mutate(undefined, {
        onSettled: () => setIsLocking(false),
      })
    } else {
      lockMutation.mutate(undefined, {
        onSettled: () => setIsLocking(false),
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">My Wallet</h1>
        <p className="text-muted-foreground mt-1">
          Manage your wallet balance and transactions
        </p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Balance Display */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Balance</p>
                <div className="flex items-center gap-3 mt-2">
                  {showBalance ? (
                    <h2 className="text-4xl font-bold">
                      {isLoadingBalance ? '...' : formatCurrency(walletBalance)}
                    </h2>
                  ) : (
                    <h2 className="text-4xl font-bold">******</h2>
                  )}
                </div>
              </div>

              {/* Lock Status */}
              <div className="flex flex-col items-end gap-2">
                {isLocked ? (
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Locked</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                    <Unlock className="h-4 w-4" />
                    <span className="text-sm">Active</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleShowBalance}
                className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
              >
                {showBalance ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide Balance
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show Balance
                  </>
                )}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => refreshBalance()}
                disabled={isLoadingBalance}
                className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleToggleLock}
                disabled={isLocking}
                className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
              >
                {isLocked ? (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Unlock Wallet
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Lock Wallet
                  </>
                )}
              </Button>
            </div>

            {/* Wallet Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-sm opacity-75">Currency</p>
                <p className="font-semibold">{balance?.currency || 'MRU'}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Status</p>
                <p className="font-semibold">{isLocked ? 'Locked' : 'Active'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={() => router.push('/dashboard/transfer')}
        >
          <Send className="h-6 w-6" />
          <span>Send Money</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={() => router.push('/dashboard/transfer/history')}
        >
          <History className="h-6 w-6" />
          <span>Transfer History</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={() => router.push('/dashboard/transactions')}
        >
          <ArrowUpRight className="h-6 w-6" />
          <span>Transactions</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2"
          disabled
        >
          <Plus className="h-6 w-6" />
          <span>Top Up</span>
        </Button>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest wallet activity</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/transactions')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border animate-pulse">
                  <div className="h-10 w-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                  <div className="h-5 bg-muted rounded w-20" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions yet</p>
              <Button
                className="mt-4"
                onClick={() => router.push('/dashboard/transfer')}
              >
                Make Your First Transfer
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction: any) => {
                const isIncoming = transaction.type === 'TOPUP' || transaction.type === 'cash_in' || transaction.type === 'TRANSFER_IN'
                const amount = parseFloat(String(transaction.amount)) || 0

                return (
                  <button
                    key={transaction.id}
                    onClick={() => router.push(`/dashboard/transactions/${transaction.id}`)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                      {isIncoming ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {transaction.description || transaction.type || 'Transaction'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.created_at || transaction.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isIncoming ? 'text-green-500' : 'text-red-500'}`}>
                        {isIncoming ? '+' : '-'}{formatCurrency(amount)}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
