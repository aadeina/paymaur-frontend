import { Metadata } from 'next'
import { ResetPinForm } from '@/components/auth/reset-pin-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Reset PIN - PayMaur',
  description: 'Create a new PIN for your account',
}

function ResetPinContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">PayMaur</h1>
          <p className="text-muted-foreground">Create New PIN</p>
        </div>

        {/* Reset PIN Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Reset PIN</CardTitle>
            <CardDescription>
              Enter the OTP and create your new PIN
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPinForm />
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

export default function ResetPinPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPinContent />
    </Suspense>
  )
}
