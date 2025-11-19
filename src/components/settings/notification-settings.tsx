'use client'

import { useState } from 'react'
import { Bell, Mail, Smartphone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    transactionAlerts: true,
    promotions: false,
    securityAlerts: true,
    monthlyReport: true,
  })

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Channels */}
        <div>
          <h3 className="font-medium mb-4">Notification Channels</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="email">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <Switch
                id="email"
                checked={notifications.email}
                onCheckedChange={() => handleToggle('email')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="sms">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via SMS
                  </p>
                </div>
              </div>
              <Switch
                id="sms"
                checked={notifications.sms}
                onCheckedChange={() => handleToggle('sms')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="push">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications on this device
                  </p>
                </div>
              </div>
              <Switch
                id="push"
                checked={notifications.push}
                onCheckedChange={() => handleToggle('push')}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Types */}
        <div>
          <h3 className="font-medium mb-4">Notification Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="transactionAlerts">Transaction Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified of all transactions
                </p>
              </div>
              <Switch
                id="transactionAlerts"
                checked={notifications.transactionAlerts}
                onCheckedChange={() => handleToggle('transactionAlerts')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="securityAlerts">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Important security notifications
                </p>
              </div>
              <Switch
                id="securityAlerts"
                checked={notifications.securityAlerts}
                onCheckedChange={() => handleToggle('securityAlerts')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="monthlyReport">Monthly Report</Label>
                <p className="text-sm text-muted-foreground">
                  Monthly summary of your activity
                </p>
              </div>
              <Switch
                id="monthlyReport"
                checked={notifications.monthlyReport}
                onCheckedChange={() => handleToggle('monthlyReport')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="promotions">Promotions & News</Label>
                <p className="text-sm text-muted-foreground">
                  Special offers and product updates
                </p>
              </div>
              <Switch
                id="promotions"
                checked={notifications.promotions}
                onCheckedChange={() => handleToggle('promotions')}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
