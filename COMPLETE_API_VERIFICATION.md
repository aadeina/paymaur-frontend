# Complete API Verification Report
**Generated**: 2025-01-17
**Project**: PayMaur Frontend
**Spec Version**: FRONTEND_API_SPEC.json v1.0.0

---

## Executive Summary

This document provides a complete verification of all API service implementations against the FRONTEND_API_SPEC.json specification.

### Overall Status: ⚠️ Mostly Aligned (Some Issues Found)

- ✅ **Auth Service**: 100% Aligned
- ⚠️ **Wallet Service**: Minor endpoint mismatch
- ⚠️ **Profile Service**: Endpoints not in API spec
- ⚠️ **Transfer Service**: Field name mismatch
- ⚠️ **Bills Service**: Field name mismatches
- ✅ **Transactions Service**: Aligned

---

## Detailed Service Verification

### 1. ✅ Auth Service - FULLY ALIGNED

**File**: `src/lib/api/services/auth.service.ts`

| Method | Endpoint | Spec Endpoint | Status | Notes |
|--------|----------|---------------|--------|-------|
| `login()` | `/auth/login/` | `/auth/login/` | ✅ Perfect | Fields: phone, pin |
| `register()` | `/auth/register/` | `/auth/register/` | ✅ Perfect | Fields: phone, username, pin |
| `verifyOTP()` | `/auth/verify-otp/` | `/auth/verify-otp/` | ✅ Perfect | Fields: phone, code |
| `logout()` | `/auth/logout/` | `/auth/logout/` | ✅ Perfect | Requires: refresh token |
| `refreshToken()` | `/auth/token/refresh/` | `/auth/token/refresh/` | ✅ Perfect | - |
| `forgotPin()` | `/auth/pin/forgot/start/` | `/auth/pin/forgot/start/` | ✅ Perfect | Field: phone |
| `verifyForgotPinOTP()` | `/auth/pin/forgot/verify/` | `/auth/pin/forgot/verify/` | ✅ Perfect | Fields: phone, code |
| `resetPin()` | `/auth/pin/reset/` | `/auth/pin/reset/` | ✅ Perfect | Maps newPin→new_pin |
| `changePin()` | `/auth/pin/change/` | `/auth/pin/change/` | ✅ Perfect | Maps currentPin→old_pin, newPin→new_pin |

**Conclusion**: Auth service is perfectly aligned with API spec!

---

### 2. ⚠️ Wallet Service - MINOR ISSUES

**File**: `src/lib/api/services/wallet.service.ts`

#### Issues Found:

**Issue #1: Missing `/wallet/` GET endpoint**
- **Spec Endpoint**: `GET /wallet/` - Get wallet details with balance
- **Current**: Only has `/wallet/balance/` endpoint
- **Impact**: Low - balance endpoint works, but missing full wallet info

**Issue #2: Lock/Unlock endpoints not in spec**
- **Current Implementation**: Has `lockWallet()` and `unlockWallet()` with PIN
- **API Spec**: Has `/wallet/lock/` and `/wallet/unlock/` but NO fields specified (likely no PIN needed)
- **Impact**: Medium - May be sending incorrect payload

**Issue #3: Wrong endpoint for transactions**
- **Current**: Uses `WALLET_TRANSACTIONS` endpoint
- **Should Use**: `/transactions/` endpoint (from Transactions spec)
- **Impact**: Medium - May be using non-existent endpoint

#### Recommendations:

```typescript
// CURRENT (Potentially Wrong)
async lockWallet(pin: string): Promise<{ message: string }> {
  const response = await apiClient.post(API_ENDPOINTS.WALLET_LOCK, { pin })
  return response.data
}

// RECOMMENDED (Per Spec - No fields required)
async lockWallet(): Promise<{ detail: string; is_locked: boolean }> {
  const response = await apiClient.post(API_ENDPOINTS.WALLET_LOCK)
  return response.data
}
```

---

### 3. ⚠️ Profile Service - NOT IN API SPEC

**File**: `src/lib/api/services/profile.service.ts`

#### Issues Found:

**Issue #1: Profile endpoints map differently**
- **Current Endpoint**: `/users/profile/` (GET)
- **Spec Endpoint**: `/users/profile/` ✅ (Exists in spec)
- **Status**: ✅ Correct

**Issue #2: Update profile endpoint**
- **Current**: `PUT /users/profile/update/`
- **Spec**: `PUT /users/profile/update/` ✅ (Exists in spec)
- **Current Fields**: firstName, lastName, email, avatar
- **Spec Fields**: username (only!)
- **Status**: ⚠️ MISMATCH

**Issue #3: Settings endpoints not in main spec**
- **Current**: Has `/settings` and `/settings/update` endpoints
- **Spec**: ❌ Not defined in FRONTEND_API_SPEC.json
- **Status**: ⚠️ Using non-spec endpoints

**Issue #4: Upload avatar endpoint**
- **Current**: Has `uploadAvatar()` method
- **Spec**: ❌ No avatar upload endpoint in spec
- **Status**: ⚠️ Feature not in spec

#### Recommendations:

```typescript
// UPDATE THIS - Per Spec, only username can be updated
async updateProfile(data: { username: string }): Promise<{ username: string }> {
  const response = await apiClient.put(API_ENDPOINTS.UPDATE_PROFILE, data)
  return response.data
}
```

---

### 4. ⚠️ Transfer Service - FIELD NAME MISMATCHES

**File**: `src/lib/api/services/transfer.service.ts`

#### Issues Found:

**Issue #1: SendMoney payload mismatch**
- **Current Interface (TransferData)**:
  ```typescript
  {
    recipientPhone: string
    amount: number
    note?: string
    pin: string
  }
  ```
- **API Spec Fields**:
  ```json
  {
    "recipient_username": "optional",
    "recipient_phone": "optional (one required)",
    "amount": "required",
    "note": "optional"
  }
  ```
- **Issues**:
  - ❌ Frontend uses `recipientPhone` (camelCase)
  - ✅ Spec uses `recipient_phone` (snake_case)
  - ❌ Frontend sends `pin` field - **NOT IN SPEC!**
  - ❌ Missing `recipient_username` option

**Issue #2: Calculate fee payload wrong**
- **Current**:
  ```typescript
  {
    transaction_type: 'TRANSFER',
    amount: number
  }
  ```
- **API Spec Fields**:
  ```json
  {
    "operation": "TRANSFER",
    "amount": "required"
  }
  ```
- **Issue**: Uses `transaction_type` instead of `operation`

#### Critical Fixes Needed:

```typescript
// FIX #1: Update TransferData interface
export interface TransferData {
  recipient_username?: string  // ✅ Add snake_case
  recipient_phone?: string     // ✅ Fix to snake_case
  amount: number
  note?: string
  // ❌ REMOVE pin field - not in spec!
}

// FIX #2: Update sendMoney to transform data
async sendMoney(data: TransferData): Promise<Transaction> {
  const payload: any = {
    amount: data.amount,
    note: data.note,
  }

  // API requires either username OR phone
  if (data.recipient_username) {
    payload.recipient_username = data.recipient_username
  } else if (data.recipient_phone) {
    payload.recipient_phone = data.recipient_phone
  }

  const response = await apiClient.post(API_ENDPOINTS.TRANSFER_SEND, payload)
  return response.data
}

// FIX #3: Fix calculateFee
async calculateFee(amount: number): Promise<FeeCalculation> {
  const response = await apiClient.post(API_ENDPOINTS.CALCULATE_FEE, {
    operation: 'TRANSFER',  // ✅ Changed from transaction_type
    amount
  })
  return response.data
}
```

---

### 5. ⚠️ Bills Service - FIELD NAME MISMATCHES

**File**: `src/lib/api/services/bills.service.ts`

#### Issues Found:

**Issue #1: BillPaymentData interface mismatch**
- **Current Interface**:
  ```typescript
  {
    providerId: string
    accountNumber: string
    amount: number
    pin: string
  }
  ```
- **API Spec Fields**:
  ```json
  {
    "category": "required (ELECTRICITY, WATER, etc.)",
    "provider_name": "required",
    "account_number": "required",
    "customer_name": "required",
    "amount": "required",
    "idempotency_key": "optional (auto-generated)"
  }
  ```
- **Major Issues**:
  - ❌ Missing `category` field (REQUIRED!)
  - ❌ Uses `providerId` instead of `provider_name`
  - ❌ Uses camelCase `accountNumber` instead of `account_number`
  - ❌ Missing `customer_name` field (REQUIRED!)
  - ❌ Sends `pin` field - **NOT IN SPEC!**
  - ❌ Missing `idempotency_key` for duplicate prevention

#### Critical Fixes Needed:

```typescript
// FIX: Update BillPaymentData interface
export interface BillPaymentData {
  category: 'ELECTRICITY' | 'WATER' | 'INTERNET' | 'TV' | 'OTHER'
  provider_name: string
  account_number: string
  customer_name: string
  amount: number
  idempotency_key?: string  // Auto-generated UUID
}

// FIX: Update payBill method
async payBill(data: BillPaymentData): Promise<Transaction> {
  // Generate idempotency key if not provided
  const payload = {
    ...data,
    idempotency_key: data.idempotency_key || crypto.randomUUID(),
  }

  const response = await apiClient.post(API_ENDPOINTS.PAY_BILL, payload)
  return response.data
}
```

---

### 6. ✅ Transactions Service - ALIGNED

**File**: `src/lib/api/services/transactions.service.ts`

| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| `getTransactions()` | `/transactions/` | ✅ Correct | Supports type/status filters |
| `getDetails()` | `/transactions/{id}/` | ✅ Correct | Dynamic ID param |

**Note**: Receipt and export methods are marked as not implemented, which matches reality.

---

## Summary of Critical Issues

### 🔴 HIGH PRIORITY FIXES NEEDED:

1. **Transfer Service**:
   - ❌ Remove `pin` field from TransferData (not in spec)
   - ❌ Change `recipientPhone` to `recipient_phone` (snake_case)
   - ❌ Add `recipient_username` option
   - ❌ Fix `calculateFee` to use `operation` instead of `transaction_type`

2. **Bills Service**:
   - ❌ Add `category` field (REQUIRED by spec!)
   - ❌ Add `customer_name` field (REQUIRED by spec!)
   - ❌ Change `providerId` to `provider_name`
   - ❌ Change `accountNumber` to `account_number` (snake_case)
   - ❌ Remove `pin` field (not in spec)
   - ❌ Add `idempotency_key` for duplicate prevention

3. **Profile Service**:
   - ⚠️ Update profile only supports `username`, not firstName/lastName/email

### 🟡 MEDIUM PRIORITY:

4. **Wallet Service**:
   - ⚠️ Verify lock/unlock don't need PIN parameter
   - ⚠️ Add full `/wallet/` GET endpoint

### 🟢 LOW PRIORITY:

5. **Settings Service**:
   - ℹ️ Settings endpoints not in spec (may be frontend-only feature)

---

## Testing Checklist

Before deploying, test these critical flows:

### Transfer Flow ❌ WILL FAIL
- [ ] Send transfer with phone number
- [ ] Send transfer with username
- [ ] Calculate fee before transfer
- **Expected Issues**:
  - Backend will reject `pin` field
  - Backend expects `recipient_phone` not `recipientPhone`
  - Fee calculation will fail with `transaction_type` field

### Bill Payment Flow ❌ WILL FAIL
- [ ] Pay electricity bill
- [ ] Pay water bill
- **Expected Issues**:
  - Backend will reject - missing `category` (REQUIRED!)
  - Backend will reject - missing `customer_name` (REQUIRED!)
  - Field names don't match (camelCase vs snake_case)

### Authentication Flow ✅ SHOULD WORK
- [x] Register new user
- [x] Verify OTP
- [x] Login
- [x] Change PIN
- [x] Reset PIN

### Wallet Flow ⚠️ MAY HAVE ISSUES
- [ ] Get balance
- [ ] Lock wallet
- [ ] Unlock wallet

---

## Recommended Next Steps

1. **Immediate**: Fix Transfer and Bills services (critical for functionality)
2. **Short-term**: Update type definitions to match spec exactly
3. **Medium-term**: Add comprehensive integration tests
4. **Long-term**: Set up API contract testing

---

## Files Requiring Updates

### Critical Updates:
1. `src/types/index.ts` - Update TransferData and BillPaymentData interfaces
2. `src/lib/api/services/transfer.service.ts` - Fix field names and remove pin
3. `src/lib/api/services/bills.service.ts` - Add missing fields, fix field names
4. `src/components/transfers/transfer-form.tsx` - Update form fields
5. `src/components/bills/bill-payment-form.tsx` - Add category and customer_name fields

### Optional Updates:
6. `src/lib/api/services/wallet.service.ts` - Verify lock/unlock parameters
7. `src/lib/api/services/profile.service.ts` - Simplify to username only

---

## Conclusion

**Current State**: 2 out of 6 services are fully spec-compliant.

**Action Required**: Critical fixes needed for Transfer and Bills services before production deployment. These services will fail when integrated with the actual Django backend.

**Estimated Fix Time**: 2-4 hours for critical fixes

**Risk Level**: 🔴 HIGH - Transfer and Bill Payment features will not work without fixes
