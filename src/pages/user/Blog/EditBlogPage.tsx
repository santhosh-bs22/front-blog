import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { blogSchema } from '@/schemas/blog.schema';
import { useAuth } from '@/contexts/AuthContext';
import { blogApi } from '@/api/blog.api';
import RichTextEditor from '@/components/blog/RichTextEditor';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type BlogFormData = z.infer<typeof blogSchema>;

const EditBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogApi.getBlogById(id!),
    enabled: !!id,
  });

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      coverImage: '',
      status: 'draft',
      featured: false,
    },
  });

  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        category: blog.category,
        tags: blog.tags,
        coverImage: blog.coverImage || '',
        // Fixed: Explicitly handle 'rejected' status if present in mock data
        status: blog.status === 'rejected' ? 'draft' : blog.status,
        featured: blog.featured,
      });
      setSelectedTags(blog.tags);
    }
  }, [blog, form]);

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BlogFormData> }) =>
      blogApi.updateBlog(id, {
        ...updates,
        tags: selectedTags,
        updatedAt: new Date()
      }),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog updated successfully!');
      navigate(form.getValues('status') === 'published' ? `/blog/${updatedBlog?.slug}` : '/dashboard/drafts');
    },
    onError: () => {
      toast.error('Failed to update blog');
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    if (!user || !blog) return;
    updateMutation.mutate({ id: blog.id, updates: data });
  };

  const handleSaveDraft = () => {
    form.setValue('status', 'draft');
    form.handleSubmit(onSubmit)();
  };

  const handlePublish = () => {
    form.setValue('status', 'published');
    form.handleSubmit(onSubmit)();
  };

  if (isLoading) return <div className="container mx-auto p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Edit Blog</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><Input {...field} /></FormItem>
            )} />
            <FormField control={form.control} name="excerpt" render={({ field }) => (
              <FormItem><FormLabel>Excerpt</FormLabel><Textarea {...field} /></FormItem>
            )} />
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <RichTextEditor content={field.value} onChange={field.onChange} />
              </FormItem>
            )} />
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
              <Button type="button" onClick={handlePublish}>Update Blog</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditBlogPage;