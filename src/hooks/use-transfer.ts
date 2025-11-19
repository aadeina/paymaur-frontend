import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { transferService } from '@/lib/api/services/transfer.service'
import { TransferData } from '@/types'
import { QUERY_KEYS, SUCCESS_MESSAGES } from '@/lib/constants'

/**
 * Transfer Hook
 * Provides money transfer actions with React Query
 */
export function useTransfer() {
  const queryClient = useQueryClient()

  /**
   * Send money mutation
   */
  const sendMoneyMutation = useMutation({
    mutationFn: (data: TransferData) => transferService.sendMoney(data),
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.TRANSFER)
      // Invalidate wallet and transaction queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSFERS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Transfer failed')
    },
  })

  /**
   * Calculate fee query
   */
  const useFeeCalculation = (amount: number) => {
    return useQuery({
      queryKey: [QUERY_KEYS.TRANSFERS, 'fee', amount],
      queryFn: () => transferService.calculateFee(amount),
      enabled: amount > 0,
      staleTime: 300000, // 5 minutes
    })
  }

  /**
   * Search recipients query
   */
  const useRecipientSearch = (query: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.TRANSFERS, 'recipients', 'search', query],
      queryFn: () => transferService.searchRecipients(query),
      enabled: query.length >= 3,
      staleTime: 60000, // 1 minute
    })
  }

  /**
   * Recent recipients query
   */
  const recentRecipientsQuery = useQuery({
    queryKey: [QUERY_KEYS.TRANSFERS, 'recipients', 'recent'],
    queryFn: () => transferService.getRecentRecipients(),
    staleTime: 300000, // 5 minutes
  })

  /**
   * Transfer history query
   */
  const useTransferHistory = (params?: { page?: number; limit?: number; type?: 'sent' | 'received' }) => {
    return useQuery({
      queryKey: [QUERY_KEYS.TRANSFERS, 'history', params],
      queryFn: () => transferService.getHistory(params),
      staleTime: 30000, // 30 seconds
    })
  }

  return {
    sendMoney: sendMoneyMutation.mutate,
    isSending: sendMoneyMutation.isPending,
    useFeeCalculation,
    useRecipientSearch,
    recentRecipients: recentRecipientsQuery.data,
    isLoadingRecentRecipients: recentRecipientsQuery.isLoading,
    useTransferHistory,
  }
}
