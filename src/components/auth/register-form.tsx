'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/lib/constants'

export function RegisterForm() {
  const [showPin, setShowPin] = useState(false)
  const { register: registerUser, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data)
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
            Enter your Mauritanian phone number (8 digits)
          </p>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="john_doe"
            {...register('username')}
            disabled={isLoading}
            className={errors.username ? 'border-destructive' : ''}
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Choose a unique username
          </p>
        </div>

        {/* PIN */}
        <div className="space-y-2">
          <Label htmlFor="pin">Create 4-Digit PIN</Label>
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
          <p className="text-xs text-muted-foreground">
            Create a 4-digit PIN for secure login
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      {/* Login Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-medium">
          Login
        </Link>
      </div>
    </form>
  )
}
