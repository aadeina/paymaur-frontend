import { toast as sonnerToast } from 'sonner'
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react'
import { createElement } from 'react'

export const toast = {
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
      icon: createElement(CheckCircle2, { className: 'h-5 w-5' }),
    })
  },

  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
      icon: createElement(XCircle, { className: 'h-5 w-5' }),
    })
  },

  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
      icon: createElement(AlertCircle, { className: 'h-5 w-5' }),
    })
  },

  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
      icon: createElement(Info, { className: 'h-5 w-5' }),
    })
  },

  loading: (message: string, description?: string) => {
    return sonnerToast.loading(message, {
      description,
      icon: createElement(Loader2, { className: 'h-5 w-5 animate-spin' }),
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: options.error,
    })
  },

  custom: (message: string, options?: any) => {
    return sonnerToast(message, options)
  },

  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId)
  },
}
