# Internationalization (i18n) Guide

PayMaur supports multiple languages using `next-intl` for Next.js 15 App Router.

## Supported Languages

- **English** (en) - Default
- **French** (fr)
- **Arabic** (ar) - RTL support

## Directory Structure

```
src/i18n/
├── config.ts          # Locale configuration
├── request.ts         # next-intl configuration
├── messages/
│   ├── en.json       # English translations
│   ├── fr.json       # French translations
│   └── ar.json       # Arabic translations
└── README.md         # This file
```

## Usage

### In Server Components

```tsx
import { useTranslations } from 'next-intl'

export default function MyComponent() {
  const t = useTranslations('common')

  return <h1>{t('welcome')}</h1>
}
```

### In Client Components

```tsx
'use client'

import { useTranslations } from 'next-intl'

export default function MyComponent() {
  const t = useTranslations('auth')

  return <button>{t('login')}</button>
}
```

### Using the Language Switcher

```tsx
import { LanguageSwitcher } from '@/components/language-switcher'

export default function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  )
}
```

## Translation Namespaces

Translations are organized into namespaces:

- `common` - General UI text (welcome, loading, buttons, etc.)
- `auth` - Authentication related (login, register, PIN, OTP, etc.)
- `dashboard` - Dashboard and wallet (balance, transactions, quick actions, etc.)
- `transfer` - Money transfer (send, recipient, amount, fees, etc.)
- `transactions` - Transaction history and details
- `profile` - User profile and account info
- `settings` - Application settings
- `empty` - Empty state messages
- `validation` - Form validation messages
- `errors` - Error messages

## Adding New Translations

1. Add the key to all three language files:

```json
// en.json
{
  "common": {
    "newKey": "New English Text"
  }
}

// fr.json
{
  "common": {
    "newKey": "Nouveau texte français"
  }
}

// ar.json
{
  "common": {
    "newKey": "نص عربي جديد"
  }
}
```

2. Use it in your component:

```tsx
const t = useTranslations('common')
return <p>{t('newKey')}</p>
```

## RTL (Right-to-Left) Support

Arabic automatically gets RTL layout through:

1. `dir="rtl"` on the `<html>` tag
2. CSS rules in `globals.css`:

```css
[dir='rtl'] {
  direction: rtl;
  text-align: right;
}
```

## URL Structure

All routes are prefixed with the locale:

- `/en/dashboard` - English dashboard
- `/fr/dashboard` - French dashboard
- `/ar/dashboard` - Arabic dashboard

The middleware automatically handles locale detection and redirection.

## Locale Detection

The middleware detects the locale from:

1. URL path (`/en/`, `/fr/`, `/ar/`)
2. Falls back to default locale (`en`) if not specified

## Best Practices

1. **Always use translation keys** - Never hardcode text
2. **Keep keys descriptive** - Use clear, semantic names
3. **Group by feature** - Use namespaces to organize translations
4. **Use interpolation** for dynamic values:

```tsx
// Translation file
{
  "transfer": {
    "minAmount": "Minimum amount is {min}"
  }
}

// Component
t('transfer.minAmount', { min: formatCurrency(100) })
```

5. **Test all languages** - Ensure UI works with longer text (French) and RTL (Arabic)

## TypeScript Support

The locales are fully typed:

```typescript
import { Locale } from '@/i18n/config'

const locale: Locale = 'en' // Type-safe
```

## Adding a New Language

1. Add the locale to `config.ts`:

```typescript
export const locales = ['en', 'fr', 'ar', 'es'] as const
export const localeNames: Record<Locale, string> = {
  // ...
  es: 'Español',
}
```

2. Create the message file: `messages/es.json`

3. Add to RTL list if needed (in `config.ts`):

```typescript
export const rtlLocales: Locale[] = ['ar', 'he']
```

4. Update middleware if needed (usually automatic)

## Common Issues

### Text not translating

- Check the namespace name matches the file structure
- Verify the key exists in all language files
- Ensure component is inside `NextIntlClientProvider`

### RTL layout issues

- Add specific RTL CSS rules in `globals.css`
- Use logical properties (e.g., `margin-inline-start` instead of `margin-left`)
- Test with Arabic locale

### TypeScript errors

- Run `npm run type-check` to find issues
- Ensure all translation files have matching keys
- Check that locale types are imported from `@/i18n/config`

## Performance

- Translations are loaded per route (code splitting)
- Only the active locale's messages are loaded
- Messages are cached by Next.js

## Testing

To test a specific language:

1. Navigate to `/{locale}/` (e.g., `/fr/`, `/ar/`)
2. Use the language switcher in the UI
3. Check that all text is translated
4. Verify RTL layout for Arabic

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Arabic Typography Best Practices](https://www.w3.org/International/articles/typography/Arabic)
