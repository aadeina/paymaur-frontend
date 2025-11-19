/**
 * User Types
 * Backend returns: id, username, phone, is_verified
 */
export interface User {
  id: string
  username: string
  phone: string
  isVerified: boolean
  // Optional fields that may come from profile
  firstName?: string
  lastName?: string
  email?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface LoginCredentials {
  phone: string
  pin: string
}

export interface RegisterData {
  phone: string
  username: string
  pin: string
}

export interface OTPVerification {
  phone: string
  code: string
}

/**
 * Wallet Types
 */
export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  isLocked: boolean
  lastTransaction?: string
  createdAt: string
  updatedAt: string
}

export interface WalletBalance {
  balance: number
  currency: string
  isLocked: boolean
}

/**
 * Transaction Types
 */
export interface Transaction {
  id: string
  type: 'transfer' | 'bill_payment' | 'cash_in' | 'cash_out' | 'refund'
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  amount: number
  fee: number
  currency: string
  description: string
  reference: string
  sender?: {
    id: string
    name: string
    phone: string
  }
  recipient?: {
    id: string
    name: string
    phone: string
  }
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface TransactionFilters {
  type?: string
  status?: string
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Transfer Types
 */
/**
 * Transfer Data
 * API Spec: Either recipient_username OR recipient_phone required (not both)
 * Note: pin field removed - not in API spec
 */
export interface TransferData {
  recipient_username?: string
  recipient_phone?: string
  amount: number
  note?: string
}

export interface TransferRecipient {
  id: string
  name: string
  phone: string
  avatar?: string
  isFavorite?: boolean
}

export interface FeeCalculation {
  amount: number
  fee: number
  total: number
}

/**
 * Bill Payment Types
 */
export interface BillCategory {
  id: string
  name: string
  icon: string
  providersCount: number
}

export interface BillProvider {
  id: string
  name: string
  categoryId: string
  logo?: string
  description?: string
}

/**
 * Bill Payment Data
 * API Spec: category, provider_name, account_number, customer_name, amount required
 * Note: pin field removed - not in API spec
 */
export interface BillPaymentData {
  category: 'ELECTRICITY' | 'WATER' | 'INTERNET' | 'TV' | 'OTHER'
  provider_name: string
  account_number: string
  customer_name: string
  amount: number
  idempotency_key?: string
}

export interface SavedBiller {
  id: string
  providerId: string
  providerName: string
  accountNumber: string
  nickname?: string
  categoryId: string
}

/**
 * Profile Types
 */
export interface ProfileUpdateData {
  firstName?: string
  lastName?: string
  email?: string
  avatar?: string
}

export interface ChangePinData {
  currentPin: string
  newPin: string
  confirmPin: string
}

/**
 * Settings Types
 */
export interface Settings {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    transactionAlerts: boolean
    promotions: boolean
  }
  security: {
    biometricEnabled: boolean
    twoFactorEnabled: boolean
    sessionTimeout: number
  }
  privacy: {
    showBalance: boolean
    showTransactionHistory: boolean
    allowContactsSearch: boolean
  }
  preferences: {
    language: 'en' | 'fr' | 'ar'
    theme: 'light' | 'dark' | 'system'
    currency: string
  }
  limits: {
    dailyTransferLimit: number
    singleTransferLimit: number
  }
}

/**
 * API Error Types
 */
export interface APIError {
  message: string
  code?: string
  field?: string
  details?: Record<string, any>
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: APIError
  message?: string
}

/**
 * Component Props Types
 */
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface FormState {
  isLoading: boolean
  error: string | null
  success: boolean
}

/**
 * Chart Data Types
 */
export interface ChartDataPoint {
  name: string
  value: number
  date?: string
}

export interface SpendingByCategory {
  category: string
  amount: number
  percentage: number
  color: string
}

/**
 * Notification Types
 */
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}
