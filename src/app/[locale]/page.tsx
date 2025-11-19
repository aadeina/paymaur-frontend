'use client'

import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Home() {
  const t = useTranslations('common')
  const tAuth = useTranslations('auth')
  const tDashboard = useTranslations('dashboard')

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">{t('appName')}</h1>
          <LanguageSwitcher />
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            {t('welcome')} {t('appName')}!
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {tAuth('loginSubtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/login">{tAuth('login')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/register">{tAuth('register')}</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>{tDashboard('sendMoney')}</CardTitle>
              <CardDescription>
                Transfer money instantly to anyone, anywhere in Mauritania
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full">
                {t('next')} →
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{tDashboard('payBills')}</CardTitle>
              <CardDescription>
                Pay your bills quickly and securely with PayMaur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full">
                {t('next')} →
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{tDashboard('buyAirtime')}</CardTitle>
              <CardDescription>
                Top up your mobile phone with ease
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full">
                {t('next')} →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Language Demo Section */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Multi-Language Support</CardTitle>
            <CardDescription>
              PayMaur supports English, French, and Arabic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Common Terms:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• {t('loading')}</li>
                  <li>• {t('success')}</li>
                  <li>• {t('error')}</li>
                  <li>• {t('save')}</li>
                  <li>• {t('cancel')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Auth Terms:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• {tAuth('phone')}</li>
                  <li>• {tAuth('pin')}</li>
                  <li>• {tAuth('email')}</li>
                  <li>• {tAuth('forgotPin')}</li>
                  <li>• {tAuth('resetPin')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
