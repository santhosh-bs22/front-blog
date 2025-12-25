import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { blogApi } from '@/api/blog.api';
import BlogCard from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const LatestPosts: React.FC = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['latest-blogs'],
    queryFn: () => blogApi.getBlogs({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' }),
  });

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">🆕 Latest Posts</h2>
              <p className="text-muted-foreground mt-1">
                Fresh content from our community
              </p>
            </div>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/blogs">
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {blogs?.data?.map((blog) => (
              <BlogCard key={blog.id} blog={blog} variant="compact" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestPosts;