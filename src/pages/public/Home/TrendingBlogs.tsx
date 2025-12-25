import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { blogApi } from '@/api/blog.api';
import BlogCard from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const TrendingBlogs: React.FC = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['trending-blogs'],
    queryFn: () => blogApi.getBlogs({ limit: 3, sortBy: 'views', sortOrder: 'desc' }),
  });

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">🔥 Trending Now</h2>
              <p className="text-muted-foreground mt-1">
                Most popular articles this week
              </p>
            </div>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/blogs?sort=trending">
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs?.data?.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingBlogs;