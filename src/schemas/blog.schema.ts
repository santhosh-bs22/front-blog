import { z } from 'zod';
import { FORM_VALIDATION } from '@/config/constants';

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
  featured: z.boolean().default(false),
});

export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment is too long'),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export type BlogFormData = z.infer<typeof blogSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;