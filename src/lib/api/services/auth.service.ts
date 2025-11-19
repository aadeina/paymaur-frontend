import apiClient from '../client'
import { API_ENDPOINTS } from '@/lib/constants'
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  OTPVerification,
  ChangePinData,
} from '@/types'

/**
 * Auth Service - Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Login with phone and PIN
   * Transforms backend response to match frontend AuthResponse type
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials)

    // Backend returns: {success, message, data: {access, refresh, user}}
    // User object: {id, username, phone, is_verified}
    // Frontend expects: {user, tokens: {accessToken, refreshToken}}
    const backendData = response.data.data || response.data
    const backendUser = backendData.user

    return {
      user: {
        id: backendUser.id,
        username: backendUser.username,
        phone: backendUser.phone,
        isVerified: backendUser.is_verified,
      },
      tokens: {
        accessToken: backendData.access,
        refreshToken: backendData.refresh,
      },
    }
  },

  /**
   * Register new user
   * API Spec: phone, username, pin
   */
  async register(data: RegisterData): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, {
      phone: data.phone,
      username: data.username,
      pin: data.pin,
    })
    return response.data
  },

  /**
   * Verify OTP
   */
  async verifyOTP(data: OTPVerification): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(API_ENDPOINTS.VERIFY_OTP, data)
    return response.data
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.LOGOUT)
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken })
    return response.data
  },

  /**
   * Request PIN reset (sends OTP)
   */
  async forgotPin(phone: string): Promise<{ message: string }> {
    const response = await apiClient.post(API_ENDPOINTS.FORGOT_PIN, { phone })
    return response.data
  },

  /**
   * Verify forgot PIN OTP
   */
  async verifyForgotPinOTP(data: { phone: string; code: string }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(API_ENDPOINTS.FORGOT_PIN_VERIFY, data)
    return response.data
  },

  /**
   * Reset PIN with verified OTP
   */
  async resetPin(data: { phone: string; code: string; newPin: string }): Promise<{ message: string }> {
    const response = await apiClient.post(API_ENDPOINTS.RESET_PIN, {
      phone: data.phone,
      code: data.code,
      new_pin: data.newPin,
    })
    return response.data
  },

  /**
   * Change PIN (requires current PIN)
   */
  async changePin(data: ChangePinData): Promise<{ message: string }> {
    const response = await apiClient.post(API_ENDPOINTS.CHANGE_PIN, {
      old_pin: data.currentPin,
      new_pin: data.newPin,
    })
    return response.data
  },
}
