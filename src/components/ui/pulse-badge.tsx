'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PulseBadgeProps {
  count?: number
  show?: boolean
  color?: 'red' | 'blue' | 'green' | 'yellow'
  className?: string
}

const colorClasses = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
}

export function PulseBadge({
  count,
  show = true,
  color = 'red',
  className,
}: PulseBadgeProps) {
  if (!show) return null

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={cn(
        'absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white text-xs font-bold',
        colorClasses[color],
        count ? 'h-5 w-5 min-w-[20px] px-1' : 'h-3 w-3',
        className
      )}
    >
      {count && count > 0 ? (count > 99 ? '99+' : count) : null}
      <motion.span
        className={cn(
          'absolute inset-0 rounded-full',
          colorClasses[color]
        )}
        initial={{ scale: 1, opacity: 1 }}
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [1, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </motion.div>
  )
}
