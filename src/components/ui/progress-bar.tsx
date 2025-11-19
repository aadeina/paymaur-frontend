'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

const variantClasses = {
  default: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
}

export function ProgressBar({
  progress,
  showPercentage = false,
  size = 'md',
  variant = 'default',
  className,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full rounded-full bg-muted overflow-hidden', sizeClasses[size])}>
        <motion.div
          className={cn('h-full rounded-full', variantClasses[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  )
}

export function IndeterminateProgressBar({
  size = 'md',
  variant = 'default',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}) {
  return (
    <div className={cn('w-full rounded-full bg-muted overflow-hidden', sizeClasses[size], className)}>
      <motion.div
        className={cn('h-full rounded-full', variantClasses[variant])}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ width: '50%' }}
      />
    </div>
  )
}
