'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/lib/constants'

export function LoginForm() {
  const [showPin, setShowPin] = useState(false)
  const { login, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="36600100"
            inputMode="numeric"
            maxLength={8}
            {...register('phone')}
            disabled={isLoading}
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            8 digits starting with 2, 3, or 4
          </p>
        </div>

        {/* PIN */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="pin">4-Digit PIN</Label>
            <Link
              href={ROUTES.FORGOT_PIN}
              className="text-sm text-primary hover:underline"
            >
              Forgot PIN?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="pin"
              type={showPin ? 'text' : 'password'}
              placeholder="••••"
              inputMode="numeric"
              maxLength={4}
              {...register('pin')}
              disabled={isLoading}
              className={errors.pin ? 'border-destructive pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.pin && (
            <p className="text-sm text-destructive">{errors.pin.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </Button>

      {/* Register Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link href={ROUTES.REGISTER} className="text-primary hover:underline font-medium">
          Register
        </Link>
      </div>
    </form>
  )
}
