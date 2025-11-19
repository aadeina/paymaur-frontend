import { STORAGE_KEYS } from '../constants'

/**
 * Get token from localStorage
 */
export function getToken(type: 'access' | 'refresh'): string | null {
  if (typeof window === 'undefined') return null

  const key = type === 'access' ? STORAGE_KEYS.ACCESS_TOKEN : STORAGE_KEYS.REFRESH_TOKEN

  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error('Error getting token:', error)
    return null
  }
}

/**
 * Set tokens in localStorage and cookies (for middleware auth)
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return

  try {
    // Store in localStorage for API client
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)

    // Also set as cookies for middleware authentication
    // Using secure flags for production
    const isSecure = window.location.protocol === 'https:'
    const cookieOptions = `path=/; ${isSecure ? 'secure;' : ''} samesite=lax; max-age=86400`
    document.cookie = `access_token=${accessToken}; ${cookieOptions}`
    document.cookie = `refresh_token=${refreshToken}; ${cookieOptions}`
  } catch (error) {
    console.error('Error setting tokens:', error)
  }
}

/**
 * Clear all tokens from localStorage and cookies
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return

  try {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)

    // Clear cookies by setting expired date
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  } catch (error) {
    console.error('Error clearing tokens:', error)
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken('access')
}

/**
 * Hash PIN for secure storage (biometric)
 */
export async function hashPin(pin: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    // Fallback for environments without crypto API
    return btoa(pin)
  }

  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(pin)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  } catch (error) {
    console.error('Error hashing PIN:', error)
    return btoa(pin) // Fallback
  }
}

/**
 * Store hashed PIN for biometric auth
 */
export function storePinHash(hash: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEYS.PIN_HASH, hash)
  } catch (error) {
    console.error('Error storing PIN hash:', error)
  }
}

/**
 * Get stored PIN hash
 */
export function getPinHash(): string | null {
  if (typeof window === 'undefined') return null

  try {
    return localStorage.getItem(STORAGE_KEYS.PIN_HASH)
  } catch (error) {
    console.error('Error getting PIN hash:', error)
    return null
  }
}

/**
 * Clear PIN hash
 */
export function clearPinHash(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEYS.PIN_HASH)
  } catch (error) {
    console.error('Error clearing PIN hash:', error)
  }
}

/**
 * Verify PIN against stored hash
 */
export async function verifyPin(pin: string): Promise<boolean> {
  const storedHash = getPinHash()
  if (!storedHash) return false

  const pinHash = await hashPin(pin)
  return pinHash === storedHash
}
