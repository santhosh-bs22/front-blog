import React, {} from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { blogSchema } from '@/schemas/blog.schema';
import { useAuth } from '@/contexts/AuthContext';
import { blogApi } from '@/api/blog.api';
import RichTextEditor from '@/components/blog/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Form , FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { toast } from 'sonner';
import { generateSlug } from '@/lib/utils';

type BlogFormData = z.infer<typeof blogSchema>;

const CreateBlogPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: { title: '', excerpt: '', content: '', category: '', tags: [], coverImage: '', status: 'draft' },
  });

  const createMutation = useMutation({
    mutationFn: blogApi.createBlog,
    onSuccess: (blog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog created!');
      navigate(blog.status === 'published' ? `/blog/${blog.slug}` : '/dashboard/drafts');
    },
  });

  const onSubmit = (data: BlogFormData) => {
    if (!user) return;
    const blogData = {
      ...data,
      excerpt: data.excerpt || '', // Fix excerpt error
      slug: generateSlug(data.title),
      readingTime: Math.ceil(data.content.length / 1000),
      author: { id: user.id, username: user.username, avatar: user.avatar || '', email: user.email || '', role: user.role || 'user', isActive: true, isVerified: true, joinedAt: new Date() },
      likes: 0, comments: 0, views: 0,
    };
    createMutation.mutate(blogData as any);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Create New Blog</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Title</FormLabel><Input {...field} /></FormItem>
          )} />
          <FormField control={form.control} name="excerpt" render={({ field }) => (
            <FormItem><FormLabel>Excerpt</FormLabel><Textarea {...field} /></FormItem>
          )} />
          <FormField control={form.control} name="content" render={({ field }) => (
            <FormItem><FormLabel>Content</FormLabel><RichTextEditor content={field.value} onChange={field.onChange} /></FormItem>
          )} />
          <Button type="submit" disabled={createMutation.isPending}><Send className="mr-2 h-4 w-4" /> Publish</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateBlogPage;