import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
  autoFocus?: boolean;
  showLoginPrompt?: boolean;
  onLoginClick?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  placeholder = 'Write a comment...',
  buttonText = 'Post Comment',
  autoFocus = false,
  showLoginPrompt = true,
  onLoginClick
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const handleFormSubmit = async (data: CommentFormData) => {
    if (!user && showLoginPrompt) {
      if (onLoginClick) {
        onLoginClick();
      }
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit(data.content);
      reset();
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user && showLoginPrompt) {
    return (
      <div className="bg-card p-4 rounded-lg text-center">
        <p className="text-muted-foreground mb-3">
          Please login to comment
        </p>
        <Button onClick={onLoginClick}>
          Login to Comment
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-start space-x-3">
        <img
          src={user?.avatar}
          alt={user?.username}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <Textarea
            placeholder={placeholder}
            className="min-h-[100px]"
            autoFocus={autoFocus}
            {...register('content')}
          />
          {errors.content && (
            <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
          )}
          
          <div className="flex justify-end mt-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                'Posting...'
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {buttonText}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;