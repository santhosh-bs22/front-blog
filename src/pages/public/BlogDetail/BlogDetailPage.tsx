import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Clock,
  Calendar,
  Eye,
  Heart,
  Bookmark,
  Share2,
  Edit,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { blogApi } from '@/api/blog.api';
import { useAuth } from '@/contexts/AuthContext';
import BlogCard from '@/components/blog/BlogCard';
import CommentSection from '@/components/blog/CommentSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogApi.getBlogBySlug(slug!),
    enabled: !!slug,
  });

  const { data: relatedBlogs } = useQuery({
    queryKey: ['related-blogs', blog?.category],
    queryFn: () => blogApi.getBlogsByCategory(blog?.category || ''),
    enabled: !!blog?.category,
  });

  const likeMutation = useMutation({
    mutationFn: () => blogApi.likeBlog(blog!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', slug] });
      setIsLiked(true);
      toast.success('Blog liked!');
    },
  });

  useEffect(() => {
    if (blog && user) {
      const likedBlogs = getLocalStorage('liked_blogs', []);
      const bookmarkedBlogs = getLocalStorage('bookmarked_blogs', []);
      setIsLiked(likedBlogs.includes(blog.id));
      setIsBookmarked(bookmarkedBlogs.includes(blog.id));
    }
  }, [blog, user]);

  const handleLike = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    likeMutation.mutate();
    
    const likedBlogs = getLocalStorage('liked_blogs', []);
    if (!likedBlogs.includes(blog!.id)) {
      setLocalStorage('liked_blogs', [...likedBlogs, blog!.id]);
    }
  };

  const handleBookmark = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const bookmarkedBlogs = getLocalStorage('bookmarked_blogs', []);
    if (isBookmarked) {
      const updated = bookmarkedBlogs.filter((id: string) => id !== blog!.id);
      setLocalStorage('bookmarked_blogs', updated);
      setIsBookmarked(false);
      toast.info('Removed from bookmarks');
    } else {
      setLocalStorage('bookmarked_blogs', [...bookmarkedBlogs, blog!.id]);
      setIsBookmarked(true);
      toast.success('Added to bookmarks');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      // In a real app, you would call delete API
      toast.success('Blog deleted successfully');
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  const isAuthor = user?.id === blog.author.id;
  const canEdit = isAuthor || user?.role === 'admin';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="capitalize">{blog.category}</Badge>
              {blog.featured && (
                <Badge variant="default">Featured</Badge>
              )}
              {blog.status === 'pending' && (
                <Badge variant="secondary">Pending Review</Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {blog.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              {blog.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={blog.author.avatar}
                    alt={blog.author.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{blog.author.username}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {blog.readingTime} min read
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {blog.views} views
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {blog.likes}
                </Button>

                <Button
                  variant={isBookmarked ? "default" : "outline"}
                  size="sm"
                  onClick={handleBookmark}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>

                {canEdit && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/blog/edit/${blog.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto rounded-xl mb-8"
            />
          )}

          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Tags */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-12" />

          {/* Author Bio */}
          <div className="bg-card rounded-xl p-6 mb-12">
            <h3 className="text-xl font-bold mb-4">About the Author</h3>
            <div className="flex items-start space-x-4">
              <img
                src={blog.author.avatar}
                alt={blog.author.username}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h4 className="font-bold text-lg">{blog.author.username}</h4>
                <p className="text-muted-foreground mt-2">
                  {blog.author.bio || 'No bio available'}
                </p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection
            comments={[]} // In a real app, fetch comments
            blogId={blog.id}
            onAddComment={async (content) => {
              console.log('Adding comment:', content);
              // In a real app, call API to add comment
            }}
            onLikeComment={async (commentId) => {
              console.log('Liking comment:', commentId);
              // In a real app, call API to like comment
            }}
          />

          {/* Related Blogs */}
          {relatedBlogs && relatedBlogs.length > 0 && (
            <>
              <Separator className="my-12" />
              <div>
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedBlogs
                    .filter(b => b.id !== blog.id)
                    .slice(0, 2)
                    .map((relatedBlog) => (
                      <BlogCard key={relatedBlog.id} blog={relatedBlog} />
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;