'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Fingerprint, Lock, Loader2, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { changePinSchema, type ChangePinFormData } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/use-auth'
import { useAuthStore } from '@/store/auth.store'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function SecuritySettings() {
  const [showChangePin, setShowChangePin] = useState(false)
  const [showPins, setShowPins] = useState({ current: false, new: false, confirm: false })
  const { changePin, isLoading } = useAuth()
  const { biometricEnabled, enableBiometric, disableBiometric } = useAuthStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePinFormData>({
    resolver: zodResolver(changePinSchema),
  })

  const onSubmit = (data: ChangePinFormData) => {
    changePin(data)
    setShowChangePin(false)
    reset()
  }

  const handleBiometricToggle = async () => {
    if (biometricEnabled) {
      disableBiometric()
      toast.success('Biometric authentication disabled')
    } else {
      // In a real app, this would prompt for biometric
      const pin = prompt('Enter your PIN to enable biometric authentication:')
      if (pin) {
        await enableBiometric(pin)
        toast.success('Biometric authentication enabled')
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Change PIN */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Change PIN</p>
                <p className="text-sm text-muted-foreground">
                  Update your transaction PIN
                </p>
              </div>
            </div>
            <Button onClick={() => setShowChangePin(true)}>
              Change
            </Button>
          </div>

          <Separator />

          {/* Biometric Authentication */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Fingerprint className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Biometric Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Use fingerprint or face recognition to login
                </p>
              </div>
            </div>
            <Button
              variant={biometricEnabled ? 'destructive' : 'default'}
              onClick={handleBiometricToggle}
            >
              {biometricEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>

          <Separator />

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security with 2FA
                </p>
              </div>
            </div>
            <Button variant="outline">
              Setup
            </Button>
          </div>

          <Separator />

          {/* Session Management */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Active Sessions</p>
              <p className="text-sm text-muted-foreground">
                Manage devices where you're logged in
              </p>
            </div>
            <Button variant="outline">
              View
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change PIN Dialog */}
      <Dialog open={showChangePin} onOpenChange={setShowChangePin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change PIN</DialogTitle>
            <DialogDescription>
              Enter your current PIN and choose a new one
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPin">Current PIN</Label>
              <div className="relative">
                <Input
                  id="currentPin"
                  type={showPins.current ? 'text' : 'password'}
                  maxLength={6}
                  {...register('currentPin')}
                  disabled={isLoading}
                  className={errors.currentPin ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPins({ ...showPins, current: !showPins.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPins.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPin && (
                <p className="text-sm text-destructive">{errors.currentPin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPin">New PIN</Label>
              <div className="relative">
                <Input
                  id="newPin"
                  type={showPins.new ? 'text' : 'password'}
                  maxLength={6}
                  {...register('newPin')}
                  disabled={isLoading}
                  className={errors.newPin ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPins({ ...showPins, new: !showPins.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPins.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPin && (
                <p className="text-sm text-destructive">{errors.newPin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPin">Confirm New PIN</Label>
              <div className="relative">
                <Input
                  id="confirmPin"
                  type={showPins.confirm ? 'text' : 'password'}
                  maxLength={6}
                  {...register('confirmPin')}
                  disabled={isLoading}
                  className={errors.confirmPin ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPins({ ...showPins, confirm: !showPins.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPins.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPin && (
                <p className="text-sm text-destructive">{errors.confirmPin.message}</p>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowChangePin(false)
                  reset()
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  'Change PIN'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
