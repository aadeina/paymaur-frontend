import { z } from 'zod'
import { VALIDATION } from '../constants'

/**
 * Transfer Form Schema
 */
export const transferSchema = z.object({
  recipientPhone: z
    .string()
    .min(1, 'Recipient phone number is required')
    .regex(/^[0-9+\s-()]+$/, 'Invalid phone number format')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length >= VALIDATION.PHONE_LENGTH, {
      message: `Phone number must be at least ${VALIDATION.PHONE_LENGTH} digits`,
    }),
  amount: z
    .number()
    .min(VALIDATION.MIN_TRANSFER_AMOUNT, `Minimum transfer amount is ${VALIDATION.MIN_TRANSFER_AMOUNT}`)
    .max(VALIDATION.MAX_TRANSFER_AMOUNT, `Maximum transfer amount is ${VALIDATION.MAX_TRANSFER_AMOUNT}`),
  note: z.string().max(200, 'Note must not exceed 200 characters').optional(),
  pin: z
    .string()
    .min(VALIDATION.PIN_LENGTH, `PIN must be at least ${VALIDATION.PIN_LENGTH} digits`)
    .regex(/^\d+$/, 'PIN must contain only numbers'),
})

export type TransferFormData = z.infer<typeof transferSchema>

/**
 * Recipient Search Schema
 */
export const recipientSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
})

export type RecipientSearchData = z.infer<typeof recipientSearchSchema>
