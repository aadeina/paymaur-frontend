import { Metadata } from 'next'
import { ForgotPinForm } from '@/components/auth/forgot-pin-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Forgot PIN - PayMaur',
  description: 'Reset your PayMaur PIN',
}

export default function ForgotPinPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">PayMaur</h1>
          <p className="text-muted-foreground">Reset Your PIN</p>
        </div>

        {/* Forgot PIN Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Forgot PIN?</CardTitle>
            <CardDescription>
              Don't worry, we'll help you reset it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPinForm />
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
