'use client'

import { Eye, EyeOff, RefreshCw, Lock, Unlock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWalletStore } from '@/store/wallet.store'
import { useWallet } from '@/hooks/use-wallet'
import { formatCurrency } from '@/lib/utils'

export function BalanceCard() {
  const { showBalance, toggleShowBalance } = useWalletStore()
  const { balance, isLoadingBalance, refreshBalance } = useWallet()

  const walletBalance = balance?.balance || 0
  const isLocked = balance?.isLocked || false

  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Balance</p>
              <div className="flex items-center gap-3 mt-2">
                {showBalance ? (
                  <h2 className="text-4xl font-bold">
                    {isLoadingBalance ? '...' : formatCurrency(walletBalance)}
                  </h2>
                ) : (
                  <h2 className="text-4xl font-bold">••••••</h2>
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
          <div className="flex items-center gap-2">
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
              onClick={refreshBalance}
              disabled={isLoadingBalance}
              className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
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
  )
}
