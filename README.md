# PayMaur Frontend - Mobile Money & Digital Wallet

A modern, secure fintech application built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features Implemented

### ✅ Phase 1: Project Setup & Configuration
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand (auth, wallet, UI stores)
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

### ✅ Phase 2: Authentication System (In Progress)
- **Auth Pages**: Login, Register
- **Auth Components**: LoginForm, RegisterForm
- **Auth Store**: Zustand store for auth state
- **Token Management**: Secure token storage and refresh
- **API Services**: Complete auth service layer
- **Validation**: Zod schemas for all auth forms
- **Security**: PIN hashing, token expiration handling

### 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-otp/
│   │   ├── forgot-pin/
│   │   └── reset-pin/
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── transfers/        # Transfer components
│   ├── bills/            # Bill payment components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
│   ├── use-auth.ts      # Authentication hook
│   ├── use-wallet.ts    # Wallet hook
│   ├── use-transfer.ts  # Transfer hook
│   └── use-bills.ts     # Bills hook
├── lib/                  # Utility libraries
│   ├── api/             # API client and services
│   │   ├── client.ts    # Axios client with interceptors
│   │   ├── token-manager.ts  # Token management
│   │   └── services/    # API service layer
│   ├── constants/       # App constants
│   ├── utils.ts         # Utility functions
│   └── validations/     # Zod validation schemas
├── store/               # Zustand stores
│   ├── auth.store.ts   # Authentication state
│   ├── wallet.store.ts # Wallet state
│   └── ui.store.ts     # UI state (theme, language)
├── styles/             # Global styles
│   └── globals.css     # Tailwind + custom styles
└── types/              # TypeScript type definitions
    └── index.ts        # All type definitions
```

## 🔐 Security Features

1. **Token Management**
   - Secure token storage
   - Automatic token refresh
   - Token expiration handling
   - Axios interceptors for auth

2. **PIN Security**
   - PIN hashing (SHA-256)
   - Secure storage for biometric auth
   - PIN validation with Zod

3. **Request Security**
   - CSRF protection
   - XSS prevention
   - Input sanitization
   - Security headers

4. **Middleware**
   - Route protection
   - Auth verification
   - Redirect logic

## 📦 Dependencies

### Core
- `next`: 15.0.3 - React framework
- `react`: 18.3.1 - UI library
- `typescript`: 5.6.3 - Type safety

### State & Data
- `zustand`: 5.0.1 - State management
- `@tanstack/react-query`: 5.59.20 - Data fetching
- `axios`: 1.7.7 - HTTP client

### Forms & Validation
- `react-hook-form`: 7.53.0 - Form handling
- `@hookform/resolvers`: 3.9.0 - Form validation
- `zod`: 3.23.8 - Schema validation

### UI Components
- `tailwindcss`: 3.4.14 - Utility-first CSS
- `lucide-react`: 0.454.0 - Icons
- `sonner`: 1.7.1 - Toast notifications
- `next-themes`: 0.4.3 - Theme management
- `framer-motion`: 11.11.11 - Animations
- Various Radix UI components

## 🛠️ Development

### Prerequisites
- Node.js 18+ (Currently: v22.21.1)
- npm 10+

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_APP_NAME=PayMaur
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_BIOMETRIC=true
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_SESSION_TIMEOUT=900000
NEXT_PUBLIC_TOKEN_REFRESH_INTERVAL=840000
```

### Running Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

### Linting & Type Checking
```bash
npm run lint
npm run type-check
```

## 📖 API Integration

The app integrates with a backend API (assumed at `http://localhost:8000/api`).

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh
- `POST /auth/forgot-pin` - Request PIN reset
- `POST /auth/reset-pin` - Reset PIN
- `POST /auth/change-pin` - Change PIN

### Wallet Endpoints
- `GET /wallet/balance` - Get wallet balance
- `GET /wallet/transactions` - Get transactions
- `POST /wallet/lock` - Lock wallet
- `POST /wallet/unlock` - Unlock wallet

### Transfer Endpoints
- `POST /transfers` - Send money
- `GET /transfers/history` - Transfer history
- `GET /transfers/recipients/search` - Search recipients
- `GET /transfers/recipients/recent` - Recent recipients
- `POST /transfers/calculate-fee` - Calculate fee

### Bill Payment Endpoints
- `GET /bills/categories` - Bill categories
- `GET /bills/providers` - Bill providers
- `POST /bills/pay` - Pay bill
- `GET /bills/history` - Payment history
- `GET /bills/saved` - Saved billers

## 🎨 UI Components

Built with shadcn/ui for consistency and accessibility:

- ✅ Button
- ✅ Input
- ✅ Label
- ✅ Card
- ✅ Dialog
- 🚧 More components (Select, Dropdown, Avatar, etc.)

## 🚀 Next Steps

### Phase 2 Completion (In Progress)
- [ ] OTP verification page
- [ ] Forgot PIN page
- [ ] Reset PIN page
- [ ] Biometric authentication UI

### Phase 3: Wallet & Dashboard (Next)
- [ ] Dashboard layout
- [ ] Wallet balance display
- [ ] Recent transactions widget
- [ ] Quick actions menu
- [ ] Statistics charts

### Phase 4: Money Transfers
- [ ] Transfer form
- [ ] Recipient search
- [ ] Fee calculation UI
- [ ] Transfer confirmation
- [ ] Transfer history

## 📝 Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting configured
- **Prettier**: Code formatting configured
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Comprehensive error handling
- **Security**: Security best practices implemented

## 🤝 Contributing

This is a fintech application. Follow these guidelines:
1. Never commit sensitive data
2. Follow security best practices
3. Test thoroughly before committing
4. Document all major changes
5. Use TypeScript strictly

## 📄 License

© 2024 PayMaur. All rights reserved.
