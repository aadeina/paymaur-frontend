import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { locales, isRtlLocale, type Locale } from '@/i18n/config'
import { Inter } from 'next/font/google'
import { Providers } from '@/lib/providers'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial']
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Await params before accessing its properties
  const { locale } = await params

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  // Load messages directly
  let messages
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  // Determine if locale is RTL
  const isRtl = isRtlLocale(locale as Locale)

  return (
    <div lang={locale} dir={isRtl ? 'rtl' : 'ltr'} className={cn(inter.className, isRtl && 'rtl', 'min-h-screen')}>
      <NextIntlClientProvider messages={messages}>
        <Providers>{children}</Providers>
      </NextIntlClientProvider>
    </div>
  )
}
