'use client'

import { motion } from 'framer-motion'

interface ScaleInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  initialScale?: number
  className?: string
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.4,
  initialScale = 0.8,
  className,
}: ScaleInProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: initialScale,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScaleOnHoverProps {
  children: React.ReactNode
  scale?: number
  className?: string
}

export function ScaleOnHover({
  children,
  scale = 1.05,
  className,
}: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.95 }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
