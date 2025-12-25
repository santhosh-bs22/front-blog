import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Mail, Globe, Twitter, Github, Linkedin, BookOpen, Heart, MessageCircle } from 'lucide-react';
import { userApi } from '@/api/user.api';
import { blogApi } from '@/api/blog.api';
import BlogCard from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/formatters';

const AuthorProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  
  const { data: author, isLoading: authorLoading } = useQuery({
    queryKey: ['author', userId],
    queryFn: () => userApi.getUserById(userId!),
    enabled: !!userId,
  });

  const { data: authorPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['author-posts', userId],
    queryFn: () => userApi.getAuthorPosts(userId!),
    enabled: !!userId,
  });

  const { data: blogs } = useQuery({
    queryKey: ['author-blogs', userId],
    queryFn: () => blogApi.getBlogs({ authorId: userId }),
    enabled: !!userId,
  });

  if (authorLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Author not found</h1>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const stats = [
    { label: 'Posts', value: authorPosts?.length || 0, icon: BookOpen },
    { label: 'Total Likes', value: 245, icon: Heart },
    { label: 'Comments', value: 56, icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src={author.avatar}
                alt={author.username}
                className="w-32 h-32 rounded-full border-4 border-background shadow-lg"
              />
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{author.username}</h1>
                {author.bio && (
                  <p className="text-lg text-muted-foreground mb-4">{author.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {formatDate(author.joinedAt)}
                  </div>
                  
                  {author.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2" />
                      {author.email}
                    </div>
                  )}
                </div>
                
                {/* Social Links */}
                <div className="flex items-center justify-center md:justify-start gap-3">
                  {author.socialLinks?.twitter && (
                    <a
                      href={author.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  
                  {author.socialLinks?.github && (
                    <a
                      href={author.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  
                  {author.socialLinks?.linkedin && (
                    <a
                      href={author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  
                  {author.website && (
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-card p-6 rounded-xl border text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Author's Blogs */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
            
            {postsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-[300px] rounded-xl" />
                ))}
              </div>
            ) : blogs?.data && blogs.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.data.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground">
                  {author.username} hasn't published any posts yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfilePage;