import { z } from 'zod';
import { FORM_VALIDATION } from '@/config/constants';

export const profileSchema = z.object({
  username: z.string()
    .min(FORM_VALIDATION.USERNAME_MIN, `Username must be at least ${FORM_VALIDATION.USERNAME_MIN} characters`)
    .max(FORM_VALIDATION.USERNAME_MAX, `Username must be less than ${FORM_VALIDATION.USERNAME_MAX} characters`)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  avatar: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  twitter: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  github: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export const userUpdateSchema = z.object({
  username: z.string()
    .min(FORM_VALIDATION.USERNAME_MIN, `Username must be at least ${FORM_VALIDATION.USERNAME_MIN} characters`)
    .max(FORM_VALIDATION.USERNAME_MAX, `Username must be less than ${FORM_VALIDATION.USERNAME_MAX} characters`)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address').optional(),
  role: z.enum(['visitor', 'user', 'admin']).optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;