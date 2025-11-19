import apiClient from '../client'
import { API_ENDPOINTS } from '@/lib/constants'
import { Transaction, TransactionFilters, PaginatedResponse } from '@/types'

/**
 * Transactions Service - Handles transaction-related API calls
 */
export const transactionsService = {
  /**
   * Get all transactions with filters
   */
  async getTransactions(filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
    const response = await apiClient.get(API_ENDPOINTS.TRANSACTIONS, {
      params: filters,
    })
    return response.data
  },

  /**
   * Get transaction details
   */
  async getDetails(id: string): Promise<Transaction> {
    const response = await apiClient.get(`${API_ENDPOINTS.TRANSACTION_DETAILS}${id}/`)
    return response.data
  },

  /**
   * Get transaction receipt (PDF/Image)
   */
  async getReceipt(id: string): Promise<Blob> {
    // Backend doesn't have receipt endpoint - would need to generate client-side
    throw new Error('Receipt generation not implemented on backend')
  },

  /**
   * Export transactions (CSV)
   */
  async exportTransactions(filters?: TransactionFilters): Promise<Blob> {
    // Backend doesn't have export endpoint - would need to generate client-side
    throw new Error('Transaction export not implemented on backend')
  },
}
