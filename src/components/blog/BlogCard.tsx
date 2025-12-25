import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Heart, MessageCircle, Eye } from 'lucide-react';
import { Blog } from '@/@types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface BlogCardProps {
  blog: Blog;
  variant?: 'default' | 'compact' | 'featured';
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, variant = 'default' }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (variant === 'compact') {
    return (
      <Link to={`/blog/${blog.slug}`}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              {blog.coverImage && (
                <div className="flex-shrink-0">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold line-clamp-2 mb-2">{blog.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {blog.excerpt}
                </p>
                <div className="flex items-center text-xs text-muted-foreground space-x-4">
                  <span>{blog.author.username}</span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(blog.createdAt)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {blog.readingTime} min read
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link to={`/blog/${blog.slug}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {blog.featured && (
            <Badge className="absolute top-3 left-3 bg-primary">
              Featured
            </Badge>
          )}
        </div>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="capitalize">
              {blog.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(blog.createdAt)}
            </span>
          </div>
          <h3 className="text-xl font-bold line-clamp-2">{blog.title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {blog.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={blog.author.avatar}
                alt={blog.author.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{blog.author.username}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {blog.readingTime} min
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              {blog.likes}
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              {blog.comments}
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              {blog.views}
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;