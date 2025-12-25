import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Heart, 
  MessageCircle, 
  Eye, 
  FileText, 
  TrendingUp,
  Calendar,
  PlusCircle,
  User as UserIcon // Renamed to avoid conflict with User type
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/api/user.api';
import { blogApi } from '@/api/blog.api';
import BlogCard from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/lib/formatters';
import {  Blog } from '@/@types'; // Added missing type imports

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Fixed: Cast response to any or a specific interface to handle mock stats properties
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      const data = await userApi.getCurrentUserStats(user?.id || '');
      return data as any; 
    },
    enabled: !!user?.id,
  });

  // Fixed: Cast query parameters to any to resolve 'authorId' existence error
  const { data: blogs, isLoading: blogsLoading } = useQuery({
    queryKey: ['user-blogs', user?.id],
    queryFn: () => blogApi.getBlogs({ authorId: user?.id } as any),
    enabled: !!user?.id,
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['user-activity', user?.id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        { action: 'Published a new blog', date: '2 hours ago', type: 'publish' },
        { action: 'Received 5 likes on your blog', date: '1 day ago', type: 'like' },
        { action: 'Commented on "React Best Practices"', date: '2 days ago', type: 'comment' },
        { action: 'Updated your profile', date: '3 days ago', type: 'update' },
      ];
    },
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view dashboard</h1>
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
    );
  }

  // Fixed: Safe property access using optional chaining for mock stats
  const statCards = [
    { title: 'Total Posts', value: stats?.totalPosts || 0, icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Total Likes', value: stats?.totalLikes || 0, icon: Heart, color: 'bg-red-500' },
    { title: 'Comments', value: stats?.totalComments || 0, icon: MessageCircle, color: 'bg-green-500' },
    { title: 'Total Views', value: formatNumber(stats?.totalViews || 0), icon: Eye, color: 'bg-purple-500' },
    { title: 'Drafts', value: stats?.draftCount || 0, icon: FileText, color: 'bg-yellow-500' },
    { title: 'Published', value: stats?.publishedCount || 0, icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  const publishedBlogs = blogs?.data?.filter((blog: Blog) => blog.status === 'published') || [];
  const draftBlogs = blogs?.data?.filter((blog: Blog) => blog.status === 'draft') || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening with your account.
            </p>
          </div>
          <Button asChild className="flex items-center gap-2">
            <Link to="/blog/create">
              <PlusCircle className="h-4 w-4" />
              Create New Blog
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statsLoading ? (
            [...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))
          ) : (
            statCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-full ${stat.color}/10`}>
                      <stat.icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Published Blogs</h2>
              <Button variant="ghost" asChild>
                <Link to="/dashboard/blogs">View All</Link>
              </Button>
            </div>

            {blogsLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : publishedBlogs.length > 0 ? (
              <div className="space-y-4">
                {publishedBlogs.slice(0, 3).map((blog: Blog) => (
                  <BlogCard key={blog.id} blog={blog} variant="compact" />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No published blogs yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start writing and share your knowledge with the community.
                </p>
                <Button asChild>
                  <Link to="/blog/create">Create Your First Blog</Link>
                </Button>
              </Card>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Drafts</h2>
                <Button variant="ghost" asChild>
                  <Link to="/dashboard/drafts">View All</Link>
                </Button>
              </div>

              {draftBlogs.length > 0 ? (
                <div className="space-y-3">
                  {draftBlogs.slice(0, 3).map((blog: Blog) => (
                    <Card key={blog.id} className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{blog.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Last edited {new Date(blog.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/blog/edit/${blog.id}`}>Edit</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-8">
                  <p className="text-muted-foreground">No drafts saved</p>
                </Card>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <Card>
              <CardContent className="p-6">
                {recentActivity ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Calendar className="inline-block h-3 w-3 mr-1" />
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-12 rounded" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/profile/edit">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/dashboard/drafts">
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Drafts
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/blogs">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Explore Blogs
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;