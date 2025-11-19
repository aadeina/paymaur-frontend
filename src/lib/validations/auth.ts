import { z } from 'zod'
import { VALIDATION } from '../constants'

/**
 * Login Form Schema
 * API Spec: phone (8 digits starting with 2,3,4), pin (4 digits)
 */
export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[234]\d{7}$/, 'Phone must be 8 digits starting with 2, 3, or 4')
    .length(VALIDATION.PHONE_LENGTH, `Phone number must be exactly ${VALIDATION.PHONE_LENGTH} digits`),
  pin: z
    .string()
    .length(VALIDATION.PIN_LENGTH, `PIN must be exactly ${VALIDATION.PIN_LENGTH} digits`)
    .regex(/^\d{4}$/, 'PIN must be 4 digits'),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Register Form Schema
 * API Spec: phone (8 digits starting with 2,3,4), username (max 30), pin (4 digits)
 */
export const registerSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[234]\d{7}$/, 'Phone must be 8 digits starting with 2, 3, or 4')
    .length(VALIDATION.PHONE_LENGTH, `Phone number must be exactly ${VALIDATION.PHONE_LENGTH} digits`),
  username: z
    .string()
    .min(1, 'Username is required')
    .max(30, 'Username cannot exceed 30 characters'),
  pin: z
    .string()
    .length(VALIDATION.PIN_LENGTH, `PIN must be exactly ${VALIDATION.PIN_LENGTH} digits`)
    .regex(/^\d{4}$/, 'PIN must be 4 digits'),
})

export type RegisterFormData = z.infer<typeof registerSchema>

/**
 * OTP Verification Schema
 * API Spec: phone (8 digits), code (6 digits)
 */
export const otpSchema = z.object({
  code: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
})

export type OTPFormData = z.infer<typeof otpSchema>

/**
 * Forgot PIN Schema
 * API Spec: phone (8 digits starting with 2,3,4)
 */
export const forgotPinSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[234]\d{7}$/, 'Phone must be 8 digits starting with 2, 3, or 4')
    .length(VALIDATION.PHONE_LENGTH, `Phone number must be exactly ${VALIDATION.PHONE_LENGTH} digits`),
})

export type ForgotPinFormData = z.infer<typeof forgotPinSchema>

/**
 * Reset PIN Schema
 * API Spec: phone, code (6 digits), new_pin (4 digits)
 */
export const resetPinSchema = z
  .object({
    code: z
      .string()
      .length(6, 'OTP must be 6 digits')
      .regex(/^\d{6}$/, 'OTP must contain only numbers'),
    newPin: z
      .string()
      .length(VALIDATION.PIN_LENGTH, `PIN must be exactly ${VALIDATION.PIN_LENGTH} digits`)
      .regex(/^\d{4}$/, 'PIN must be 4 digits'),
    confirmPin: z.string(),
  })
  .refine((data) => data.newPin === data.confirmPin, {
    message: "PINs don't match",
    path: ['confirmPin'],
  })

export type ResetPinFormData = z.infer<typeof resetPinSchema>

/**
 * Change PIN Schema
 * API Spec: old_pin (4 digits), new_pin (4 digits)
 */
export const changePinSchema = z
  .object({
    currentPin: z
      .string()
      .length(VALIDATION.PIN_LENGTH, `PIN must be exactly ${VALIDATION.PIN_LENGTH} digits`)
      .regex(/^\d{4}$/, 'PIN must be 4 digits'),
    newPin: z
      .string()
      .length(VALIDATION.PIN_LENGTH, `PIN must be exactly ${VALIDATION.PIN_LENGTH} digits`)
      .regex(/^\d{4}$/, 'PIN must be 4 digits'),
    confirmPin: z.string(),
  })
  .refine((data) => data.newPin === data.confirmPin, {
    message: "PINs don't match",
    path: ['confirmPin'],
  })
  .refine((data) => data.currentPin !== data.newPin, {
    message: 'New PIN must be different from current PIN',
    path: ['newPin'],
  })

export type ChangePinFormData = z.infer<typeof changePinSchema>
