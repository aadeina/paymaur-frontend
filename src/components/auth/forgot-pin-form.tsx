'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { forgotPinSchema, type ForgotPinFormData } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/lib/constants'

export function ForgotPinForm() {
  const { forgotPin, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPinFormData>({
    resolver: zodResolver(forgotPinSchema),
  })

  const onSubmit = (data: ForgotPinFormData) => {
    forgotPin(data.phone)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Back Button */}
      <Link
        href={ROUTES.LOGIN}
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Link>

      <div className="space-y-4">
        {/* Info Text */}
        <div className="text-center space-y-2 pb-4">
          <p className="text-sm text-muted-foreground">
            Enter your phone number and we'll send you an OTP to reset your PIN
          </p>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="22 12 34 56"
            {...register('phone')}
            disabled={isLoading}
            className={errors.phone ? 'border-destructive' : ''}
            autoFocus
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending OTP...
          </>
        ) : (
          'Send OTP'
        )}
      </Button>

      {/* Login Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Remember your PIN? </span>
        <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-medium">
          Login
        </Link>
      </div>
    </form>
  )
}
