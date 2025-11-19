import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { APP_CONFIG, API_ENDPOINTS } from '../constants'
import { getToken, setTokens, clearTokens } from './token-manager'

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * Request interceptor - Add auth token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken('access')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      })
    }

    return config
  },
  (error: AxiosError) => {
    console.error('❌ [Request Error]', error)
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - Handle responses and errors
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [API Response] ${response.config.url}`, response.data)
    }

    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Log error in development (only if there's actual error data)
    if (process.env.NODE_ENV === 'development' && error.response) {
      console.error('❌ [API Error]', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.response?.data?.detail || error.message,
        data: error.response?.data,
      })
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = getToken('refresh')

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Try to refresh the token
        const response = await axios.post(
          `${APP_CONFIG.API_URL}${API_ENDPOINTS.REFRESH_TOKEN}`,
          { refreshToken }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data

        // Save new tokens
        setTokens(accessToken, newRefreshToken)

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        clearTokens()

        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }

        return Promise.reject(refreshError)
      }
    }

    // Handle specific error status codes
    if (error.response) {
      const { status, data } = error.response
      const errorData = data as { message?: string; errors?: unknown; details?: unknown }

      switch (status) {
        case 400:
          // Bad Request - Validation error
          return Promise.reject({
            message: errorData.message || 'Invalid request. Please check your input.',
            code: 'BAD_REQUEST',
            details: errorData.errors || errorData.details,
          })

        case 403:
          // Forbidden
          return Promise.reject({
            message: errorData.message || 'You do not have permission to perform this action.',
            code: 'FORBIDDEN',
          })

        case 404:
          // Not Found
          return Promise.reject({
            message: errorData.message || 'The requested resource was not found.',
            code: 'NOT_FOUND',
          })

        case 429:
          // Too Many Requests
          return Promise.reject({
            message: errorData.message || 'Too many requests. Please try again later.',
            code: 'RATE_LIMIT',
          })

        case 500:
        case 502:
        case 503:
          // Server Error
          return Promise.reject({
            message: 'Server error. Please try again later.',
            code: 'SERVER_ERROR',
          })

        default:
          return Promise.reject({
            message: errorData.message || 'An unexpected error occurred.',
            code: 'UNKNOWN_ERROR',
          })
      }
    }

    // Network error or timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Request timeout. Please check your connection and try again.',
        code: 'TIMEOUT',
      })
    }

    if (error.message === 'Network Error') {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      })
    }

    // Generic error
    return Promise.reject({
      message: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
    })
  }
)

export default apiClient
