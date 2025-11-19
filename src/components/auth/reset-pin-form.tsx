'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { resetPinSchema, type ResetPinFormData } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OTPInput } from './otp-input'
import { ROUTES } from '@/lib/constants'

export function ResetPinForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const [otp, setOtp] = useState('')
  const [showNewPin, setShowNewPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)
  const { resetPin, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPinFormData>({
    resolver: zodResolver(resetPinSchema),
  })

  // Auto-update form value when OTP changes
  useEffect(() => {
    setValue('code', otp)
  }, [otp, setValue])

  const onSubmit = (data: ResetPinFormData) => {
    resetPin({ phone, code: data.code, newPin: data.newPin })
  }

  const handleBack = () => {
    router.push(ROUTES.FORGOT_PIN)
  }

  if (!phone) {
    router.push(ROUTES.FORGOT_PIN)
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </button>

      <div className="space-y-4">
        {/* Info Text */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Enter the OTP sent to {phone} and create a new PIN
          </p>
        </div>

        {/* OTP Input */}
        <div className="space-y-2">
          <Label className="text-center block">OTP Code</Label>
          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            error={!!errors.code}
          />
          {errors.code && (
            <p className="text-sm text-destructive text-center">{errors.code.message}</p>
          )}
        </div>

        {/* New PIN */}
        <div className="space-y-2">
          <Label htmlFor="newPin">New PIN</Label>
          <div className="relative">
            <Input
              id="newPin"
              type={showNewPin ? 'text' : 'password'}
              placeholder="Enter new PIN"
              maxLength={6}
              {...register('newPin')}
              disabled={isLoading}
              className={errors.newPin ? 'border-destructive pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowNewPin(!showNewPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showNewPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPin && (
            <p className="text-sm text-destructive">{errors.newPin.message}</p>
          )}
        </div>

        {/* Confirm PIN */}
        <div className="space-y-2">
          <Label htmlFor="confirmPin">Confirm New PIN</Label>
          <div className="relative">
            <Input
              id="confirmPin"
              type={showConfirmPin ? 'text' : 'password'}
              placeholder="Confirm new PIN"
              maxLength={6}
              {...register('confirmPin')}
              disabled={isLoading}
              className={errors.confirmPin ? 'border-destructive pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPin(!showConfirmPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPin && (
            <p className="text-sm text-destructive">{errors.confirmPin.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting PIN...
          </>
        ) : (
          'Reset PIN'
        )}
      </Button>
    </form>
  )
}
