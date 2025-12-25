import { z } from 'zod';

export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment is too long'),
  blogId: z.string().optional(),
  parentId: z.string().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment is too long'),
  status: z.enum(['pending', 'approved', 'spam']).optional(),
});

export type CommentFormData = z.infer<typeof commentSchema>;
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;