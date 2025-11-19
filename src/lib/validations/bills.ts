import { z } from 'zod'
import { VALIDATION } from '../constants'

/**
 * Bill Payment Form Schema
 */
export const billPaymentSchema = z.object({
  providerId: z.string().min(1, 'Provider is required'),
  accountNumber: z
    .string()
    .min(1, 'Account number is required')
    .max(50, 'Account number is too long')
    .regex(/^[a-zA-Z0-9-]+$/, 'Invalid account number format'),
  amount: z
    .number()
    .min(100, 'Minimum payment amount is 100')
    .max(VALIDATION.MAX_TRANSFER_AMOUNT, `Maximum payment amount is ${VALIDATION.MAX_TRANSFER_AMOUNT}`),
  pin: z
    .string()
    .min(VALIDATION.MIN_PIN_LENGTH, `PIN must be at least ${VALIDATION.MIN_PIN_LENGTH} digits`)
    .regex(/^\d+$/, 'PIN must contain only numbers'),
})

export type BillPaymentFormData = z.infer<typeof billPaymentSchema>

/**
 * Save Biller Schema
 */
export const saveBillerSchema = z.object({
  providerId: z.string().min(1, 'Provider is required'),
  accountNumber: z
    .string()
    .min(1, 'Account number is required')
    .max(50, 'Account number is too long'),
  nickname: z.string().max(50, 'Nickname is too long').optional(),
})

export type SaveBillerFormData = z.infer<typeof saveBillerSchema>
