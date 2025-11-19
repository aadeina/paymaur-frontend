import { Metadata } from 'next'
import { VerifyOTPForm } from '@/components/auth/verify-otp-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Verify OTP - PayMaur',
  description: 'Verify your phone number with OTP',
}

function VerifyOTPContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">PayMaur</h1>
          <p className="text-muted-foreground">Verify Your Account</p>
        </div>

        {/* OTP Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Verify OTP</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to your phone number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VerifyOTPForm />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>© 2024 PayMaur. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  )
}
