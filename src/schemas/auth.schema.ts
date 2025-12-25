import { z } from 'zod';
import { FORM_VALIDATION } from '@/config/constants';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(FORM_VALIDATION.PASSWORD_MIN, `Password must be at least ${FORM_VALIDATION.PASSWORD_MIN} characters`),
  rememberMe: z.boolean().default(false),
});

export const registerSchema = z.object({
  username: z.string()
    .min(FORM_VALIDATION.USERNAME_MIN, `Username must be at least ${FORM_VALIDATION.USERNAME_MIN} characters`)
    .max(FORM_VALIDATION.USERNAME_MAX, `Username must be less than ${FORM_VALIDATION.USERNAME_MAX} characters`)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(FORM_VALIDATION.PASSWORD_MIN, `Password must be at least ${FORM_VALIDATION.PASSWORD_MIN} characters`)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const newPasswordSchema = z.object({
  password: z.string()
    .min(FORM_VALIDATION.PASSWORD_MIN, `Password must be at least ${FORM_VALIDATION.PASSWORD_MIN} characters`)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;