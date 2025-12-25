import React from 'react';
import { useParams} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Mail } from 'lucide-react';
import { userApi } from '@/api/user.api';
import { blogApi } from '@/api/blog.api';
import BlogCard from '@/components/blog/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/formatters';

const AuthorProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  
  const { data: author, isLoading: authorLoading } = useQuery({
    queryKey: ['author', userId],
    queryFn: () => userApi.getUserById(userId!),
    enabled: !!userId,
  });

  const { data: blogs } = useQuery({
    queryKey: ['author-blogs', userId],
    queryFn: () => blogApi.getBlogs({ authorId: userId } as any), // Fix QueryParams
    enabled: !!userId,
  });

  if (authorLoading) return <Skeleton className="h-64 w-full" />;
  if (!author) return <div className="text-center py-20">Author not found</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <img src={author.avatar} alt="" className="w-32 h-32 rounded-full shadow-lg" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{author.username}</h1>
            <p className="text-muted-foreground mb-4">{author.bio}</p>
            <div className="flex gap-4 justify-center md:justify-start text-sm text-muted-foreground">
              <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Joined {formatDate(author.joinedAt || new Date())}</span>
              <span className="flex items-center"><Mail className="h-4 w-4 mr-1" /> {author.email}</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs?.data?.map(blog => <BlogCard key={blog.id} blog={blog} />)}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfilePage;