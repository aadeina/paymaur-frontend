import apiClient from '../client'
import { API_ENDPOINTS } from '@/lib/constants'
import { WalletBalance, Transaction, PaginatedResponse } from '@/types'

/**
 * Wallet Service - Handles wallet-related API calls
 */
export const walletService = {
  /**
   * Get wallet balance
   * Backend returns: {balance, is_locked} or {data: {balance, is_locked}}
   * Frontend expects: {balance, currency, isLocked}
   */
  async getBalance(): Promise<WalletBalance> {
    const response = await apiClient.get(API_ENDPOINTS.WALLET_BALANCE)
    const data = response.data.data || response.data

    return {
      balance: data.balance || 0,
      currency: data.currency || 'MRU',
      isLocked: data.is_locked || false,
    }
  },

  /**
   * Get recent transactions
   * Uses /transactions/recent/ endpoint
   */
  async getRecentTransactions(): Promise<PaginatedResponse<Transaction>> {
    const response = await apiClient.get(API_ENDPOINTS.TRANSACTION_RECENT)
    const data = response.data.data || response.data

    // Handle both array and paginated responses
    if (Array.isArray(data)) {
      return {
        data: data,
        total: data.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      }
    }

    return {
      data: data.results || data.data || [],
      total: data.count || data.total || 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    }
  },

  /**
   * Get wallet transactions (paginated)
   * Returns paginated transactions or wraps in pagination format
   */
  async getTransactions(params?: {
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Transaction>> {
    const response = await apiClient.get(API_ENDPOINTS.WALLET_TRANSACTIONS, { params })
    const data = response.data.data || response.data

    // Handle both paginated and array responses
    if (Array.isArray(data)) {
      return {
        data: data,
        total: data.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 1,
      }
    }

    // Handle paginated response
    return {
      data: data.results || data.data || [],
      total: data.count || data.total || 0,
      page: data.page || params?.page || 1,
      limit: data.limit || params?.limit || 10,
      totalPages: data.total_pages || data.totalPages || 1,
    }
  },

  /**
   * Lock wallet
   * API Spec: No PIN required
   */
  async lockWallet(): Promise<{ message: string; is_locked: boolean }> {
    const response = await apiClient.post(API_ENDPOINTS.WALLET_LOCK)
    return response.data
  },

  /**
   * Unlock wallet
   * API Spec: No PIN required
   */
  async unlockWallet(): Promise<{ message: string; is_locked: boolean }> {
    const response = await apiClient.post(API_ENDPOINTS.WALLET_UNLOCK)
    return response.data
  },
}
