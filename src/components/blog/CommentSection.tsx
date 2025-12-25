import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Heart, MessageCircle, MoreVertical, Send, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Comment } from '@/@types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentSectionProps {
  comments: Comment[];
  blogId: string;
  onAddComment: (content: string) => Promise<void>;
  onLikeComment: (commentId: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  blogId,
  onAddComment,
  onLikeComment,
  onDeleteComment,
}) => {
  const { user } = useAuth();
  const [replyContent, setReplyContent] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    await onAddComment(data.content);
    reset();
  };

  const CommentItem: React.FC<{ comment: Comment; depth?: number }> = ({ 
    comment, 
    depth = 0 
  }) => {
    const [showReplies, setShowReplies] = useState(true);
    const [isReplying, setIsReplying] = useState(false);

    const handleReply = async () => {
      if (replyContent.trim()) {
        // In a real app, this would create a reply
        console.log('Reply:', replyContent);
        setReplyContent('');
        setIsReplying(false);
      }
    };

    return (
      <div className={`${depth > 0 ? 'ml-8 border-l-2 pl-4' : ''}`}>
        <div className="flex items-start space-x-3 p-4 bg-card rounded-lg">
          <div className="flex-shrink-0">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm">{comment.author.username}</h4>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
              
              {(user?.id === comment.author.id || user?.role === 'admin') && onDeleteComment && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDeleteComment(comment.id)}
                    >
                      Delete Comment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            <p className="mt-2 text-sm whitespace-pre-wrap">{comment.content}</p>
            
            <div className="flex items-center space-x-4 mt-3">
              <button
                onClick={() => onLikeComment(comment.id)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <Heart className="h-4 w-4" />
                {comment.likes}
              </button>
              
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                Reply
              </button>
              
              {comment.replies.length > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {showReplies ? 'Hide' : 'Show'} {comment.replies.length} replies
                </button>
              )}
            </div>
            
            {isReplying && (
              <div className="mt-3">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button onClick={handleReply}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {showReplies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      {user ? (
        <div className="bg-card p-4 rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Textarea
              placeholder="Add a comment..."
              {...register('content')}
              className="min-h-[100px] mb-3"
            />
            {errors.content && (
              <p className="text-sm text-red-600 mb-2">{errors.content.message}</p>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-card p-4 rounded-lg text-center">
          <p className="text-muted-foreground">
            Please{' '}
            <a href="/login" className="text-primary hover:underline">
              login
            </a>{' '}
            to comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">
          Comments ({comments.length})
        </h3>
        
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;