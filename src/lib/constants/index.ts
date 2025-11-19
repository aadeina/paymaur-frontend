/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  VERIFY_OTP: '/auth/verify-otp/',
  LOGOUT: '/auth/logout/',
  REFRESH_TOKEN: '/auth/token/refresh/',
  FORGOT_PIN: '/auth/pin/forgot/start/',
  FORGOT_PIN_VERIFY: '/auth/pin/forgot/verify/',
  RESET_PIN: '/auth/pin/reset/',
  CHANGE_PIN: '/auth/pin/change/',

  // Users
  PROFILE: '/users/profile/',
  UPDATE_PROFILE: '/users/profile/update/',
  SEARCH_USERS: '/users/search/',
  GET_USER_BY_USERNAME: '/users/username/',

  // Wallet
  WALLET: '/wallet/',
  WALLET_BALANCE: '/wallet/balance/',
  WALLET_LOCK: '/wallet/lock/',
  WALLET_UNLOCK: '/wallet/unlock/',
  WALLET_TRANSACTIONS: '/transactions/',

  // Transfers
  TRANSFER_SEND: '/transfers/send/',
  TRANSFERS: '/transfers/',
  TRANSFERS_SENT: '/transfers/sent/',
  TRANSFERS_RECEIVED: '/transfers/received/',
  TRANSFER_DETAILS: '/transfers/',
  TRANSFER_STATS: '/transfers/stats/',

  // Bill Payments
  PAY_BILL: '/bills/pay/',
  BILLS: '/bills/',
  BILL_DETAILS: '/bills/',
  BILL_STATS: '/bills/stats/',
  BILL_RECENT: '/bills/recent/',

  // Transactions
  TRANSACTIONS: '/transactions/',
  TRANSACTION_DETAILS: '/transactions/',
  TRANSACTION_STATS: '/transactions/stats/',
  TRANSACTION_RECENT: '/transactions/recent/',

  // Fees
  FEE_RULES: '/fees/rules/',
  CALCULATE_FEE: '/fees/calculate/',
  MY_FEES: '/fees/my-fees/',

  // Settings (kept for frontend use)
  SETTINGS: '/settings',
  UPDATE_SETTINGS: '/settings/update',
  NOTIFICATION_PREFERENCES: '/settings/notifications',
} as const

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  PIN_HASH: 'pin_hash',
  REMEMBER_ME: 'remember_me',
} as const

/**
 * Transaction Types
 */
export const TRANSACTION_TYPES = {
  TRANSFER: 'transfer',
  BILL_PAYMENT: 'bill_payment',
  CASH_IN: 'cash_in',
  CASH_OUT: 'cash_out',
  REFUND: 'refund',
} as const

/**
 * Transaction Status
 */
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const

/**
 * Bill Categories
 */
export const BILL_CATEGORIES = [
  { id: 'electricity', name: 'Electricity', icon: 'Zap' },
  { id: 'water', name: 'Water', icon: 'Droplets' },
  { id: 'internet', name: 'Internet', icon: 'Wifi' },
  { id: 'tv', name: 'TV', icon: 'Tv' },
  { id: 'phone', name: 'Phone', icon: 'Phone' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal' },
] as const

/**
 * App Routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_OTP: '/auth/verify-otp',
  FORGOT_PIN: '/auth/forgot-pin',
  RESET_PIN: '/auth/reset-pin',

  DASHBOARD: '/dashboard',
  WALLET: '/dashboard/wallet',
  TRANSACTIONS: '/dashboard/transactions',

  TRANSFER: '/dashboard/transfer',
  TRANSFER_HISTORY: '/dashboard/transfer/history',

  BILLS: '/dashboard/bills',
  BILL_HISTORY: '/dashboard/bills/history',

  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
} as const

/**
 * Query Keys for React Query
 */
export const QUERY_KEYS = {
  USER: 'user',
  WALLET: 'wallet',
  TRANSACTIONS: 'transactions',
  TRANSFERS: 'transfers',
  BILLS: 'bills',
  PROFILE: 'profile',
  SETTINGS: 'settings',
} as const

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  INSUFFICIENT_BALANCE: 'Insufficient balance.',
  INVALID_PIN: 'Invalid PIN. Please try again.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
} as const

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  TRANSFER: 'Transfer completed successfully!',
  BILL_PAYMENT: 'Bill payment successful!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  SETTINGS_UPDATE: 'Settings updated successfully!',
  PIN_CHANGED: 'PIN changed successfully!',
} as const

/**
 * Validation Rules
 */
export const VALIDATION = {
  PIN_LENGTH: 4,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  PHONE_LENGTH: 8,
  MIN_TRANSFER_AMOUNT: 100,
  MAX_TRANSFER_AMOUNT: 1000000,
} as const

/**
 * App Configuration
 */
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'PayMaur',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
  SESSION_TIMEOUT: Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT) || 900000, // 15 minutes
  TOKEN_REFRESH_INTERVAL: Number(process.env.NEXT_PUBLIC_TOKEN_REFRESH_INTERVAL) || 840000, // 14 minutes
} as const
