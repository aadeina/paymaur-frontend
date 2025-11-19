'use client'

import { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [otpValues, setOtpValues] = useState<string[]>(
    value.split('').concat(Array(length).fill('')).slice(0, length)
  )

  const handleChange = (index: number, val: string) => {
    // Only allow digits
    if (val && !/^\d$/.test(val)) return

    const newOtpValues = [...otpValues]
    newOtpValues[index] = val
    setOtpValues(newOtpValues)
    onChange(newOtpValues.join(''))

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length)

    // Only allow digits
    if (!/^\d+$/.test(pastedData)) return

    const newOtpValues = pastedData.split('').concat(Array(length).fill('')).slice(0, length)
    setOtpValues(newOtpValues)
    onChange(newOtpValues.join(''))

    // Focus last filled input or last input
    const lastFilledIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[lastFilledIndex]?.focus()
  }

  const handleFocus = (index: number) => {
    // Select input content on focus
    inputRefs.current[index]?.select()
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otpValues[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={cn(
            'w-12 h-12 text-center text-lg font-semibold',
            error && 'border-destructive',
            disabled && 'opacity-50'
          )}
          autoComplete="off"
        />
      ))}
    </div>
  )
}
