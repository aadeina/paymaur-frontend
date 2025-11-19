import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n/config'

/**
 * Root Home Page
 * Redirects to the default locale
 */
export default function HomePage() {
  redirect(`/${defaultLocale}`)
}
