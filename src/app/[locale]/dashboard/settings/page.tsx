'use client'

import { useState } from 'react'
import { Moon, Sun, Monitor, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTheme } from 'next-themes'
import { SecuritySettings } from '@/components/settings/security-settings'
import { NotificationSettings } from '@/components/settings/notification-settings'
import { PrivacySettings } from '@/components/settings/privacy-settings'
import { LimitSettings } from '@/components/settings/limit-settings'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState('en')

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how PayMaur looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className="w-full"
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className="w-full"
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => setTheme('system')}
                    className="w-full"
                  >
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <Label>Language</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    onClick={() => setLanguage('en')}
                    className="w-full"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    English
                  </Button>
                  <Button
                    variant={language === 'fr' ? 'default' : 'outline'}
                    onClick={() => setLanguage('fr')}
                    className="w-full"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Français
                  </Button>
                  <Button
                    variant={language === 'ar' ? 'default' : 'outline'}
                    onClick={() => setLanguage('ar')}
                    className="w-full"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    العربية
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <Label>Currency</Label>
                <p className="text-sm text-muted-foreground mt-1">MRU (Mauritanian Ouguiya)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <SecuritySettings />
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings />
        </TabsContent>

        {/* Limit Settings */}
        <TabsContent value="limits" className="space-y-6">
          <LimitSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium mb-2">{children}</p>
}
