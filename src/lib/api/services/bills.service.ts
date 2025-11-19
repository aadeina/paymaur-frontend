import apiClient from '../client'
import { API_ENDPOINTS } from '@/lib/constants'
import {
  BillCategory,
  BillProvider,
  BillPaymentData,
  SavedBiller,
  Transaction,
  PaginatedResponse,
} from '@/types'

/**
 * Bills Service - Handles bill payment API calls
 */
export const billsService = {
  /**
   * Get all bill categories
   */
  async getCategories(): Promise<BillCategory[]> {
    // Return predefined categories - backend doesn't have this endpoint
    return [
      { id: 'ELECTRICITY', name: 'Electricity', icon: 'Zap' },
      { id: 'WATER', name: 'Water', icon: 'Droplets' },
      { id: 'INTERNET', name: 'Internet', icon: 'Wifi' },
      { id: 'TV', name: 'TV/Cable', icon: 'Tv' },
      { id: 'PHONE', name: 'Phone', icon: 'Phone' },
      { id: 'OTHER', name: 'Other', icon: 'MoreHorizontal' },
    ] as BillCategory[]
  },

  /**
   * Get providers for a category
   */
  async getProviders(categoryId?: string): Promise<BillProvider[]> {
    // Return predefined providers - backend doesn't have this endpoint
    return [
      { id: 'SOMELEC', name: 'SOMELEC', category: 'ELECTRICITY' },
      { id: 'SNDE', name: 'SNDE', category: 'WATER' },
      { id: 'MAURITEL', name: 'MAURITEL', category: 'PHONE' },
      { id: 'MATTEL', name: 'MATTEL', category: 'PHONE' },
      { id: 'CHINGUITEL', name: 'CHINGUITEL', category: 'PHONE' },
    ].filter(p => !categoryId || p.category === categoryId) as BillProvider[]
  },

  /**
   * Pay a bill
   * API Spec: Requires category, provider_name, account_number, customer_name, amount
   * Idempotency key auto-generated if not provided
   */
  async payBill(data: BillPaymentData): Promise<Transaction> {
    // Generate idempotency key if not provided (prevents duplicate payments)
    const payload = {
      ...data,
      idempotency_key: data.idempotency_key || crypto.randomUUID(),
    }

    const response = await apiClient.post(API_ENDPOINTS.PAY_BILL, payload)
    return response.data
  },

  /**
   * Get bill payment history
   */
  async getHistory(params?: {
    page?: number
    limit?: number
    categoryId?: string
  }): Promise<PaginatedResponse<Transaction>> {
    const response = await apiClient.get(API_ENDPOINTS.BILLS, { params })
    return response.data
  },

  /**
   * Get saved billers
   */
  async getSavedBillers(): Promise<SavedBiller[]> {
    // Backend doesn't have this endpoint - return empty array
    return []
  },

  /**
   * Save a biller
   */
  async saveBiller(data: {
    providerId: string
    accountNumber: string
    nickname?: string
  }): Promise<SavedBiller> {
    // Backend doesn't have this endpoint - return mock data
    return {
      id: Date.now().toString(),
      ...data,
    } as SavedBiller
  },

  /**
   * Delete a saved biller
   */
  async deleteBiller(id: string): Promise<{ message: string }> {
    // Backend doesn't have this endpoint - return success message
    return { message: 'Biller deleted successfully' }
  },
}
