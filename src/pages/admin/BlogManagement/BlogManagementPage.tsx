import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, Check, X } from 'lucide-react';
import { adminApi } from '@/api/admin.api';
import { Blog, BlogStatus } from '@/@types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const BlogManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BlogStatus | 'all'>('all');

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: adminApi.getAllBlogs,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BlogStatus }) =>
      adminApi.updateBlogStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog status updated');
    },
  });

  const featureMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      adminApi.featureBlog(id, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog featured status updated');
    },
  });

  const filteredBlogs = blogs?.filter((blog) => {
    const matchesSearch = search === '' || 
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.author.username.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: BlogStatus) => {
    const variants: Record<BlogStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'outline',
      pending: 'secondary',
      published: 'default',
      rejected: 'destructive',
    };
    
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const handleApprove = (blog: Blog) => {
    updateStatusMutation.mutate({ id: blog.id, status: 'published' });
  };

  const handleReject = (blog: Blog) => {
    updateStatusMutation.mutate({ id: blog.id, status: 'rejected' });
  };

  const handleToggleFeature = (blog: Blog) => {
    featureMutation.mutate({ id: blog.id, featured: !blog.featured });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-64"></div>
        <div className="h-96 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage all blog posts, review submissions, and moderate content
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search blogs by title or author..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg">
          <div className="text-2xl font-bold">{blogs?.length || 0}</div>
          <div className="text-sm text-muted-foreground">Total Blogs</div>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <div className="text-2xl font-bold">
            {blogs?.filter(b => b.status === 'pending').length || 0}
          </div>
          <div className="text-sm text-muted-foreground">Pending Review</div>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <div className="text-2xl font-bold">
            {blogs?.filter(b => b.featured).length || 0}
          </div>
          <div className="text-sm text-muted-foreground">Featured</div>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <div className="text-2xl font-bold">
            {blogs?.filter(b => b.status === 'published').length || 0}
          </div>
          <div className="text-sm text-muted-foreground">Published</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBlogs?.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">
                  <div className="max-w-xs truncate">{blog.title}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <img
                      src={blog.author.avatar}
                      alt={blog.author.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{blog.author.username}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {blog.category}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(blog.status)}</TableCell>
                <TableCell>{blog.likes}</TableCell>
                <TableCell>{blog.views}</TableCell>
                <TableCell>
                  {blog.featured ? (
                    <Badge variant="default">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {blog.status === 'pending' && (
                        <>
                          <DropdownMenuItem onClick={() => handleApprove(blog)}>
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReject(blog)}>
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => handleToggleFeature(blog)}>
                        {blog.featured ? 'Remove from' : 'Add to'} Featured
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredBlogs?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blogs found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagementPage;