import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  // Don't validate here - validation happens in layout.tsx
  // If locale is undefined, use default locale
  const resolvedLocale = locale || 'en'

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  }
})
