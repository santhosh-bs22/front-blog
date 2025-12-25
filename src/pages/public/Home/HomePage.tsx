import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  BookOpen,
  ChevronRight 
} from 'lucide-react';
import { blogApi } from '@/api/blog.api';
import BlogCard from '@/components/blog/BlogCard';
import StatsCard from '@/components/admin/StatsCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const HomePage: React.FC = () => {
  const { data: featuredBlogs, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-blogs'],
    queryFn: blogApi.getFeaturedBlogs,
  });

  const { data: latestBlogs, isLoading: latestLoading } = useQuery({
    queryKey: ['latest-blogs'],
    queryFn: () => blogApi.getBlogs({ limit: 6, sortBy: 'createdAt' }),
  });

  const categories = [
    { name: 'React', count: 24, icon: '⚛️' },
    { name: 'TypeScript', count: 18, icon: '📘' },
    { name: 'Next.js', count: 15, icon: '▲' },
    { name: 'UI/UX', count: 32, icon: '🎨' },
    { name: 'AI/ML', count: 21, icon: '🤖' },
    { name: 'Career', count: 28, icon: '💼' },
  ];

  const stats = [
    { title: 'Total Posts', value: '1,234', icon: BookOpen, trend: 12.5 },
    { title: 'Active Users', value: '5,678', icon: Users, trend: 8.2 },
    { title: 'Avg. Read Time', value: '5 min', icon: Clock },
    { title: 'Weekly Growth', value: '+24%', icon: TrendingUp, trend: 24 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Share Your{' '}
              <span className="text-primary">Thoughts</span>
              <br />
              With The World
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A platform for developers, designers, and thinkers to share insights,
              tutorials, and stories. Join our community of creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/register">Start Writing</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/blogs">Explore Blogs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">🔥 Trending Now</h2>
              <p className="text-muted-foreground mt-2">
                Most popular articles this week
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/blogs?sort=trending">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[400px] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBlogs?.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            🏷️ Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/blogs?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <div className="bg-card p-6 rounded-xl border hover:border-primary hover:shadow-lg transition-all duration-300 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} posts
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">🆕 Latest Posts</h2>
              <p className="text-muted-foreground mt-2">
                Fresh content from our community
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/blogs">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {latestLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {latestBlogs?.data?.map((blog) => (
                <BlogCard key={blog.id} blog={blog} variant="compact" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of writers who are sharing their knowledge and
            experiences with our global community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;