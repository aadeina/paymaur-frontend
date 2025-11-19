'use client'

import { motion } from 'framer-motion'
import { LoadingSpinner } from './loading-spinner'

interface PageLoaderProps {
  message?: string
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 p-8 rounded-lg bg-card shadow-lg"
      >
        <LoadingSpinner size="lg" variant="spinner" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </motion.div>
    </div>
  )
}

export function SectionLoader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <LoadingSpinner size="lg" variant="dots" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}

export function InlineLoader({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="inline-flex items-center gap-2">
      <LoadingSpinner size={size} variant="spinner" />
    </div>
  )
}
