import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthTokens } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { setTokens, clearTokens, storePinHash, clearPinHash } from '@/lib/api/token-manager'
import { authService } from '@/lib/api/services/auth.service'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  biometricEnabled: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens) => void
  login: (user: User, tokens: AuthTokens, pin?: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  enableBiometric: (pin: string) => Promise<void>
  disableBiometric: () => void
  setLoading: (isLoading: boolean) => void
}

/**
 * Auth Store
 * Manages authentication state
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      biometricEnabled: false,

      // Actions
      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },

      setTokens: (tokens) => {
        setTokens(tokens.accessToken, tokens.refreshToken)
      },

      login: async (user, tokens, pin) => {
        // Save tokens
        setTokens(tokens.accessToken, tokens.refreshToken)

        // Save PIN hash for biometric if provided
        if (pin) {
          const crypto = await import('@/lib/api/token-manager')
          const hash = await crypto.hashPin(pin)
          storePinHash(hash)
        }

        // Update state
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: async () => {
        try {
          // Call logout API
          await authService.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          // Clear tokens and state regardless of API response
          clearTokens()
          clearPinHash()

          set({
            user: null,
            isAuthenticated: false,
            biometricEnabled: false,
          })
        }
      },

      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } })
        }
      },

      enableBiometric: async (pin) => {
        const crypto = await import('@/lib/api/token-manager')
        const hash = await crypto.hashPin(pin)
        storePinHash(hash)
        set({ biometricEnabled: true })
      },

      disableBiometric: () => {
        clearPinHash()
        set({ biometricEnabled: false })
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },
    }),
    {
      name: STORAGE_KEYS.USER_DATA,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        biometricEnabled: state.biometricEnabled,
      }),
    }
  )
)
