import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { billsService } from '@/lib/api/services/bills.service'
import { BillPaymentData } from '@/types'
import { QUERY_KEYS, SUCCESS_MESSAGES } from '@/lib/constants'

/**
 * Bills Hook
 * Provides bill payment actions with React Query
 */
export function useBills() {
  const queryClient = useQueryClient()

  /**
   * Get bill categories query
   */
  const categoriesQuery = useQuery({
    queryKey: [QUERY_KEYS.BILLS, 'categories'],
    queryFn: () => billsService.getCategories(),
    staleTime: Infinity, // Categories rarely change
  })

  /**
   * Get bill providers query
   */
  const useProviders = (categoryId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.BILLS, 'providers', categoryId],
      queryFn: () => billsService.getProviders(categoryId),
      staleTime: 300000, // 5 minutes
    })
  }

  /**
   * Pay bill mutation
   */
  const payBillMutation = useMutation({
    mutationFn: (data: BillPaymentData) => billsService.payBill(data),
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.BILL_PAYMENT)
      // Invalidate wallet and transaction queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Bill payment failed')
    },
  })

  /**
   * Get saved billers query
   */
  const savedBillersQuery = useQuery({
    queryKey: [QUERY_KEYS.BILLS, 'saved'],
    queryFn: () => billsService.getSavedBillers(),
    staleTime: 60000, // 1 minute
  })

  /**
   * Save biller mutation
   */
  const saveBillerMutation = useMutation({
    mutationFn: (data: { providerId: string; accountNumber: string; nickname?: string }) =>
      billsService.saveBiller(data),
    onSuccess: () => {
      toast.success('Biller saved successfully')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLS, 'saved'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save biller')
    },
  })

  /**
   * Delete biller mutation
   */
  const deleteBillerMutation = useMutation({
    mutationFn: (id: string) => billsService.deleteBiller(id),
    onSuccess: () => {
      toast.success('Biller deleted successfully')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BILLS, 'saved'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete biller')
    },
  })

  /**
   * Bill history query
   */
  const useBillHistory = (params?: { page?: number; limit?: number; categoryId?: string }) => {
    return useQuery({
      queryKey: [QUERY_KEYS.BILLS, 'history', params],
      queryFn: () => billsService.getHistory(params),
      staleTime: 30000, // 30 seconds
    })
  }

  return {
    categories: categoriesQuery.data,
    isLoadingCategories: categoriesQuery.isLoading,
    useProviders,
    payBill: payBillMutation.mutate,
    isPaying: payBillMutation.isPending,
    savedBillers: savedBillersQuery.data,
    isLoadingSavedBillers: savedBillersQuery.isLoading,
    saveBiller: saveBillerMutation.mutate,
    deleteBiller: deleteBillerMutation.mutate,
    useBillHistory,
  }
}
