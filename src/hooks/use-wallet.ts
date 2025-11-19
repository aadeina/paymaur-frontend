import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useWalletStore } from '@/store/wallet.store'
import { walletService } from '@/lib/api/services/wallet.service'
import { QUERY_KEYS } from '@/lib/constants'

/**
 * Wallet Hook
 * Provides wallet actions with React Query
 */
export function useWallet() {
  const queryClient = useQueryClient()
  const { setBalance, setLocked } = useWalletStore()

  /**
   * Get wallet balance query
   */
  const balanceQuery = useQuery({
    queryKey: [QUERY_KEYS.WALLET, 'balance'],
    queryFn: async () => {
      const data = await walletService.getBalance()
      setBalance(data)
      return data
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  })

  /**
   * Get recent transactions query
   * Uses /transactions/recent/ endpoint
   */
  const transactionsQuery = useQuery({
    queryKey: [QUERY_KEYS.WALLET, 'transactions'],
    queryFn: () => walletService.getRecentTransactions(),
    staleTime: 30000,
  })

  /**
   * Lock wallet mutation
   */
  const lockWalletMutation = useMutation({
    mutationFn: () => walletService.lockWallet(),
    onSuccess: () => {
      setLocked(true)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] })
      toast.success('Wallet locked successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to lock wallet')
    },
  })

  /**
   * Unlock wallet mutation
   */
  const unlockWalletMutation = useMutation({
    mutationFn: () => walletService.unlockWallet(),
    onSuccess: () => {
      setLocked(false)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] })
      toast.success('Wallet unlocked successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to unlock wallet')
    },
  })

  /**
   * Refresh balance
   */
  const refreshBalance = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET, 'balance'] })
  }

  return {
    balance: balanceQuery.data,
    isLoadingBalance: balanceQuery.isLoading,
    transactions: transactionsQuery.data,
    isLoadingTransactions: transactionsQuery.isLoading,
    lockWallet: () => lockWalletMutation.mutate(),
    unlockWallet: () => unlockWalletMutation.mutate(),
    refreshBalance,
    isLocking: lockWalletMutation.isPending,
    isUnlocking: unlockWalletMutation.isPending,
  }
}
