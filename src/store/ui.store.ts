import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'fr' | 'ar'
  sidebarOpen: boolean
  isMobile: boolean
}

interface UIActions {
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLanguage: (language: 'en' | 'fr' | 'ar') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setIsMobile: (isMobile: boolean) => void
}

/**
 * UI Store
 * Manages UI state (theme, language, sidebar, etc.)
 */
export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      // State
      theme: 'system',
      language: 'en',
      sidebarOpen: true,
      isMobile: false,

      // Actions
      setTheme: (theme) => {
        set({ theme })

        // Update document class
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement
          root.classList.remove('light', 'dark')

          if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
            root.classList.add(systemTheme)
          } else {
            root.classList.add(theme)
          }
        }
      },

      setLanguage: (language) => {
        set({ language })

        // Update document lang and dir attributes
        if (typeof window !== 'undefined') {
          document.documentElement.lang = language
          document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
        }
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open })
      },

      setIsMobile: (isMobile) => {
        set({ isMobile })
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
)
