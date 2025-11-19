'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Card } from './card'
import { cn } from '@/lib/utils'

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverScale?: number
  hoverLift?: boolean
  delay?: number
}

export function AnimatedCard({
  children,
  hoverScale = 1.02,
  hoverLift = true,
  delay = 0,
  className,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={
        hoverLift
          ? {
              scale: hoverScale,
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              transition: { duration: 0.2 },
            }
          : undefined
      }
    >
      <Card className={cn('transition-all', className)} {...props}>
        {children}
      </Card>
    </motion.div>
  )
}
