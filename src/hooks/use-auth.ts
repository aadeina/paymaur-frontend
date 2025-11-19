import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/lib/api/services/auth.service'
import {
  LoginCredentials,
  RegisterData,
  OTPVerification,
  ChangePinData,
} from '@/types'
import { ROUTES, SUCCESS_MESSAGES } from '@/lib/constants'

/**
 * Get locale from pathname
 */
function getLocaleFromPathname(pathname: string): string {
  const match = pathname.match(/^\/(en|fr|ar)/)
  return match ? match[1] : 'en'
}

/**
 * Authentication Hook
 * Provides authentication actions with React Query
 */
export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { login: loginStore, logout: logoutStore, setLoading } = useAuthStore()

  // Get current locale from pathname
  const locale = getLocaleFromPathname(pathname)

  /**
   * Login mutation
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: async (data, variables) => {
      await loginStore(data.user, data.tokens, variables.pin)
      toast.success(SUCCESS_MESSAGES.LOGIN)
      router.push(`/${locale}${ROUTES.DASHBOARD}`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed')
      setLoading(false)
    },
  })

  /**
   * Register mutation
   */
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (_, variables) => {
      toast.success(SUCCESS_MESSAGES.REGISTER)
      router.push(`/${locale}${ROUTES.VERIFY_OTP}?phone=${variables.phone}`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed')
    },
  })

  /**
   * Verify OTP mutation
   */
  const verifyOTPMutation = useMutation({
    mutationFn: (data: OTPVerification) => authService.verifyOTP(data),
    onSuccess: async () => {
      toast.success('Account verified successfully! Please login.')
      router.push(`/${locale}${ROUTES.LOGIN}`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'OTP verification failed')
    },
  })

  /**
   * Logout mutation
   */
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      await logoutStore()
      queryClient.clear()
      router.push(`/${locale}${ROUTES.LOGIN}`)
    },
    onError: (error: any) => {
      console.error('Logout error:', error)
      // Still logout locally even if API call fails
      logoutStore()
      queryClient.clear()
      router.push(`/${locale}${ROUTES.LOGIN}`)
    },
  })

  /**
   * Forgot PIN mutation
   */
  const forgotPinMutation = useMutation({
    mutationFn: (phone: string) => authService.forgotPin(phone),
    onSuccess: (_, phone) => {
      toast.success('OTP sent to your phone')
      router.push(`/${locale}${ROUTES.RESET_PIN}?phone=${phone}`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send OTP')
    },
  })

  /**
   * Reset PIN mutation
   */
  const resetPinMutation = useMutation({
    mutationFn: (data: { phone: string; code: string; newPin: string }) =>
      authService.resetPin(data),
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.PIN_CHANGED)
      router.push(`/${locale}${ROUTES.LOGIN}`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reset PIN')
    },
  })

  /**
   * Change PIN mutation
   */
  const changePinMutation = useMutation({
    mutationFn: (data: ChangePinData) => authService.changePin(data),
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.PIN_CHANGED)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change PIN')
    },
  })

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    verifyOTP: verifyOTPMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPin: forgotPinMutation.mutate,
    resetPin: resetPinMutation.mutate,
    changePin: changePinMutation.mutate,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      verifyOTPMutation.isPending ||
      logoutMutation.isPending ||
      forgotPinMutation.isPending ||
      resetPinMutation.isPending ||
      changePinMutation.isPending,
  }
}
