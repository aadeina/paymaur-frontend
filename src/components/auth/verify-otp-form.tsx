'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { otpSchema, type OTPFormData } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { OTPInput } from './otp-input'
import { ROUTES } from '@/lib/constants'

export function VerifyOTPForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const [otp, setOtp] = useState('')
  const [resendCountdown, setResendCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const { verifyOTP, isLoading } = useAuth()

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  })

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendCountdown])

  // Auto-update form value when OTP changes
  useEffect(() => {
    setValue('code', otp)
  }, [otp, setValue])

  const onSubmit = (data: OTPFormData) => {
    verifyOTP({ phone, code: data.code })
  }

  const handleResend = () => {
    // TODO: Implement resend OTP logic
    console.log('Resending OTP to:', phone)
    setResendCountdown(60)
    setCanResend(false)
    setOtp('')
  }

  const handleBack = () => {
    router.push(ROUTES.REGISTER)
  }

  if (!phone) {
    router.push(ROUTES.REGISTER)
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
        Back to registration
      </button>

      <div className="space-y-4">
        {/* Info Text */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            We've sent a 6-digit code to
          </p>
          <p className="font-semibold">{phone}</p>
        </div>

        {/* OTP Input */}
        <div className="space-y-2">
          <Label className="text-center block">Enter OTP Code</Label>
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

        {/* Resend OTP */}
        <div className="text-center">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-primary hover:underline font-medium"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Resend OTP in {resendCountdown}s
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify & Continue'
        )}
      </Button>

      {/* Help Text */}
      <p className="text-center text-sm text-muted-foreground">
        Didn't receive the code? Check your messages or try resending.
      </p>
    </form>
  )
}
