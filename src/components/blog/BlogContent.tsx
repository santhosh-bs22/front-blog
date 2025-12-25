import React from 'react';
import { Blog } from '@/@types';
import { format } from 'date-fns';
import { Calendar, Clock, Eye, User } from 'lucide-react';

interface BlogContentProps {
  blog: Blog;
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
}

const BlogContent: React.FC<BlogContentProps> = ({ 
  blog
}) => {
  return (
    <article className="prose prose-lg max-w-none">
      {/* Blog Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            {blog.category}
          </span>
          {blog.featured && (
            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-sm">
              Featured
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{blog.author.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{blog.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{blog.views} views</span>
          </div>
        </div>
        
        {blog.excerpt && (
          <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4 py-2">
            {blog.excerpt}
          </p>
        )}
      </header>
      
      {/* Cover Image */}
      {blog.coverImage && (
        <div className="mb-8">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-auto rounded-xl"
          />
          {blog.coverImage.includes('unsplash') && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Photo from Unsplash
            </p>
          )}
        </div>
      )}
      
      {/* Blog Content */}
      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      
      {/* Tags */}
      {blog.tags.length > 0 && (
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Author Bio */}
      <div className="mt-8 pt-8 border-t">
        <div className="flex items-start gap-4">
          <img
            src={blog.author.avatar}
            alt={blog.author.username}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-xl font-semibold">About {blog.author.username}</h3>
            {blog.author.bio ? (
              <p className="text-muted-foreground mt-2">{blog.author.bio}</p>
            ) : (
              <p className="text-muted-foreground mt-2 italic">
                No bio available
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogContent;