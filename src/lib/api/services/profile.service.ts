import apiClient from '../client'
import { API_ENDPOINTS } from '@/lib/constants'
import { User, ProfileUpdateData, Settings } from '@/types'

/**
 * Profile Service - Handles user profile API calls
 */
export const profileService = {
  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get(API_ENDPOINTS.PROFILE)
    return response.data
  },

  /**
   * Update profile
   */
  async updateProfile(data: ProfileUpdateData): Promise<User> {
    const response = await apiClient.put(API_ENDPOINTS.UPDATE_PROFILE, data)
    return response.data
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await apiClient.post(API_ENDPOINTS.UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  /**
   * Get user settings
   */
  async getSettings(): Promise<Settings> {
    const response = await apiClient.get(API_ENDPOINTS.SETTINGS)
    return response.data
  },

  /**
   * Update settings
   */
  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    const response = await apiClient.put(API_ENDPOINTS.UPDATE_SETTINGS, data)
    return response.data
  },
}
