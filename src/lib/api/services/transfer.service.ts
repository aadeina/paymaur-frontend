import apiClient from '../client'
import { API_ENDPOINTS } from '@/lib/constants'
import {
  TransferData,
  Transaction,
  TransferRecipient,
  FeeCalculation,
  PaginatedResponse,
} from '@/types'

/**
 * Transfer Service - Handles money transfer API calls
 */
export const transferService = {
  /**
   * Send money to another user
   */
  async sendMoney(data: TransferData | { recipientPhone: string; amount: number; note?: string; pin?: string }): Promise<Transaction> {
    // Transform camelCase form data to snake_case backend format
    const payload = {
      recipient_phone: 'recipientPhone' in data ? data.recipientPhone : data.recipient_phone,
      amount: data.amount,
      note: data.note,
    }
    const response = await apiClient.post(API_ENDPOINTS.TRANSFER_SEND, payload)
    return response.data
  },

  /**
   * Get transfer history
   */
  async getHistory(params?: {
    page?: number
    limit?: number
    type?: 'sent' | 'received'
  }): Promise<PaginatedResponse<Transaction>> {
    // Use TRANSFERS_SENT or TRANSFERS_RECEIVED based on type, or all TRANSFERS
    let endpoint = API_ENDPOINTS.TRANSFERS
    if (params?.type === 'sent') {
      endpoint = API_ENDPOINTS.TRANSFERS_SENT
    } else if (params?.type === 'received') {
      endpoint = API_ENDPOINTS.TRANSFERS_RECEIVED
    }
    const response = await apiClient.get(endpoint, { params })
    return response.data
  },

  /**
   * Get transfer details
   */
  async getDetails(id: string): Promise<Transaction> {
    const response = await apiClient.get(`${API_ENDPOINTS.TRANSFER_DETAILS}${id}/`)
    return response.data
  },

  /**
   * Search for recipients (uses user search endpoint)
   */
  async searchRecipients(query: string): Promise<TransferRecipient[]> {
    const response = await apiClient.get(API_ENDPOINTS.SEARCH_USERS, {
      params: { q: query },
    })
    return response.data
  },

  /**
   * Get recent recipients
   */
  async getRecentRecipients(): Promise<TransferRecipient[]> {
    // Use recent transfers to get recipients
    const response = await apiClient.get(API_ENDPOINTS.TRANSFERS_SENT)

    // Transform transfer data to recipient format
    // Backend returns transactions with receiver_name, receiver_phone, etc.
    const transfers = response.data
    if (!Array.isArray(transfers)) {
      return []
    }

    // Extract unique recipients from transfers
    const recipientMap = new Map<string, TransferRecipient>()
    for (const transfer of transfers) {
      const recipientId = transfer.receiver_id || transfer.receiver || transfer.id
      const recipientPhone = transfer.receiver_phone || transfer.recipient_phone || transfer.phone || ''
      const recipientName = transfer.receiver_name || transfer.recipient_name || transfer.receiver_full_name || recipientPhone

      if (recipientPhone && !recipientMap.has(recipientPhone)) {
        recipientMap.set(recipientPhone, {
          id: recipientId,
          name: recipientName,
          phone: recipientPhone,
          avatar: transfer.receiver_avatar || transfer.avatar,
          isFavorite: transfer.is_favorite || false,
        })
      }
    }

    return Array.from(recipientMap.values())
  },

  /**
   * Calculate transfer fee
   * API Spec: operation (not transaction_type), amount
   */
  async calculateFee(amount: number): Promise<FeeCalculation> {
    const response = await apiClient.post(API_ENDPOINTS.CALCULATE_FEE, {
      operation: 'TRANSFER',
      amount
    })
    return response.data
  },
}
