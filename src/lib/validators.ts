import { z } from 'zod';
import { FORM_VALIDATION } from '@/config/constants';

// Auth validators
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(FORM_VALIDATION.PASSWORD_MIN, `Password must be at least ${FORM_VALIDATION.PASSWORD_MIN} characters`)
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
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export const newPasswordSchema = z.object({
  password: z.string()
    .min(FORM_VALIDATION.PASSWORD_MIN, `Password must be at least ${FORM_VALIDATION.PASSWORD_MIN} characters`)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Blog validators
export const blogSchema = z.object({
  title: z.string()
    .min(FORM_VALIDATION.TITLE_MIN, `Title must be at least ${FORM_VALIDATION.TITLE_MIN} characters`)
    .max(FORM_VALIDATION.TITLE_MAX, `Title must be less than ${FORM_VALIDATION.TITLE_MAX} characters`),
  excerpt: z.string()
    .max(FORM_VALIDATION.EXCERPT_MAX, `Excerpt must be less than ${FORM_VALIDATION.EXCERPT_MAX} characters`)
    .optional()
    .or(z.literal('')),
  content: z.string()
    .min(FORM_VALIDATION.CONTENT_MIN, `Content must be at least ${FORM_VALIDATION.CONTENT_MIN} characters`),
  category: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string())
    .max(FORM_VALIDATION.TAGS_MAX_COUNT, `Maximum ${FORM_VALIDATION.TAGS_MAX_COUNT} tags allowed`),
  coverImage: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  status: z.enum(['draft', 'pending', 'published']),
  featured: z.boolean().default(false)
});

export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment is too long')
});

// User validators
export const profileSchema = z.object({
  username: z.string()
    .min(FORM_VALIDATION.USERNAME_MIN, `Username must be at least ${FORM_VALIDATION.USERNAME_MIN} characters`)
    .max(FORM_VALIDATION.USERNAME_MAX, `Username must be less than ${FORM_VALIDATION.USERNAME_MAX} characters`)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  avatar: z.string().url('Please enter a valid URL').optional().or(z.literal(''))
});

// Category validators
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional().or(z.literal('')),
  isActive: z.boolean().default(true)
});

// Tag validators
export const tagSchema = z.object({
  name: z.string()
    .min(1, 'Tag name is required')
    .max(FORM_VALIDATION.TAG_MAX, `Tag name must be less than ${FORM_VALIDATION.TAG_MAX} characters`)
    .regex(/^[a-zA-Z0-9-]+$/, 'Tag can only contain letters, numbers, and hyphens')
});

// Helper functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < FORM_VALIDATION.PASSWORD_MIN) {
    errors.push(`Password must be at least ${FORM_VALIDATION.PASSWORD_MIN} characters`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateUsername = (username: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (username.length < FORM_VALIDATION.USERNAME_MIN) {
    errors.push(`Username must be at least ${FORM_VALIDATION.USERNAME_MIN} characters`);
  }
  if (username.length > FORM_VALIDATION.USERNAME_MAX) {
    errors.push(`Username must be less than ${FORM_VALIDATION.USERNAME_MAX} characters`);
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Sanitization functions
export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization (in a real app, use DOMPurify or similar)
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/"/g, '&quot;') // Escape quotes
    .replace(/'/g, '&#x27;'); // Escape apostrophes
};