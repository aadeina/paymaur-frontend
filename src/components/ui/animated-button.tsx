'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button, ButtonProps } from './button'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: string
  withScale?: boolean
  withRipple?: boolean
}

export function AnimatedButton({
  children,
  isLoading = false,
  loadingText,
  withScale = true,
  withRipple = true,
  className,
  disabled,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={withScale && !disabled ? { scale: 1.02 } : undefined}
      whileTap={withScale && !disabled ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.15 }}
      className="relative inline-block"
    >
      <Button
        className={cn('relative overflow-hidden', className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {withRipple && (
          <span className="absolute inset-0 bg-white/20 rounded-md opacity-0 hover:opacity-100 transition-opacity duration-300" />
        )}
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || 'Loading...'}
          </>
        ) : (
          children
        )}
      </Button>
    </motion.div>
  )
}
