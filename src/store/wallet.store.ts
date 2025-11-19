import { create } from 'zustand'
import { WalletBalance } from '@/types'

interface WalletState {
  balance: number
  currency: string
  isLocked: boolean
  showBalance: boolean
  isLoading: boolean
}

interface WalletActions {
  setBalance: (balance: WalletBalance) => void
  toggleShowBalance: () => void
  setLocked: (isLocked: boolean) => void
  setLoading: (isLoading: boolean) => void
  reset: () => void
}

const initialState: WalletState = {
  balance: 0,
  currency: 'MRU',
  isLocked: false,
  showBalance: true,
  isLoading: false,
}

/**
 * Wallet Store
 * Manages wallet state
 */
export const useWalletStore = create<WalletState & WalletActions>((set) => ({
  ...initialState,

  setBalance: (walletBalance) => {
    set({
      balance: walletBalance.balance,
      currency: walletBalance.currency,
      isLocked: walletBalance.isLocked,
    })
  },

  toggleShowBalance: () => {
    set((state) => ({ showBalance: !state.showBalance }))
  },

  setLocked: (isLocked) => {
    set({ isLocked })
  },

  setLoading: (isLoading) => {
    set({ isLoading })
  },

  reset: () => {
    set(initialState)
  },
}))
