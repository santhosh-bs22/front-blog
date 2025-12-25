import { Blog, Comment, PaginatedResponse, QueryParams } from '@/@types';
import blogsData from '@/api/mockData/blogs.json';
import commentsData from '@/api/mockData/comments.json';

export class BlogService {
  private static instance: BlogService;

  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  async getBlogs(params: QueryParams = {}): Promise<PaginatedResponse<Blog>> {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    return new Promise((resolve) => {
      setTimeout(() => {
        const blogs: Blog[] = this.getFromStorage('blogs', blogsData).map(blog => ({
          ...blog,
          createdAt: new Date(blog.createdAt),
          updatedAt: new Date(blog.updatedAt),
          publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined
        }));

        let filteredBlogs = [...blogs];

        // Apply filters
        if (search) {
          filteredBlogs = filteredBlogs.filter(blog =>
            blog.title.toLowerCase().includes(search.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(search.toLowerCase()) ||
            blog.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
          );
        }

        if (category) {
          filteredBlogs = filteredBlogs.filter(blog => blog.category === category);
        }

        if (status) {
          filteredBlogs = filteredBlogs.filter(blog => blog.status === status);
        }

        // Apply sorting
        filteredBlogs.sort((a, b) => {
          const aValue = a[sortBy as keyof Blog];
          const bValue = b[sortBy as keyof Blog];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          if (aValue instanceof Date && bValue instanceof Date) {
            return sortOrder === 'asc'
              ? aValue.getTime() - bValue.getTime()
              : bValue.getTime() - aValue.getTime();
          }

          return 0;
        });

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

        resolve({
          data: paginatedBlogs,
          total: filteredBlogs.length,
          page,
          limit,
          totalPages: Math.ceil(filteredBlogs.length / limit)
        });
      }, 300);
    });
  }

  async getBlogById(id: string): Promise<Blog | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blogs: Blog[] = this.getFromStorage('blogs', blogsData).map(blog => ({
          ...blog,
          createdAt: new Date(blog.createdAt),
          updatedAt: new Date(blog.updatedAt)
        }));

        const blog = blogs.find(b => b.id === id);
        if (blog) {
          // Increment views
          blog.views += 1;
          this.saveBlog(blog);
        }
        resolve(blog || null);
      }, 200);
    });
  }

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blogs: Blog[] = this.getFromStorage('blogs', blogsData).map(blog => ({
          ...blog,
          createdAt: new Date(blog.createdAt),
          updatedAt: new Date(blog.updatedAt)
        }));

        const blog = blogs.find(b => b.slug === slug);
        if (blog) {
          blog.views += 1;
          this.saveBlog(blog);
        }
        resolve(blog || null);
      }, 200);
    });
  }

  async createBlog(blogData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blogs: Blog[] = this.getFromStorage('blogs', blogsData);

        const newBlog: Blog = {
          ...blogData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          likes: blogData.likes || 0,
          comments: blogData.comments || 0,
          views: blogData.views || 0,
          readingTime: blogData.readingTime || Math.ceil(blogData.content.length / 1000)
        };

        blogs.unshift(newBlog);
        this.saveToStorage('blogs', blogs);
        resolve(newBlog);
      }, 500);
    });
  }

  async updateBlog(id: string, updates: Partial<Blog>): Promise<Blog | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blogs: Blog[] = this.getFromStorage('blogs', blogsData);
        const index = blogs.findIndex(b => b.id === id);
        
        if (index !== -1) {
          blogs[index] = {
            ...blogs[index],
            ...updates,
            updatedAt: new Date()
          };
          this.saveToStorage('blogs', blogs);
          resolve(blogs[index]);
        }
        resolve(null);
      }, 500);
    });
  }

  async deleteBlog(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blogs: Blog[] = this.getFromStorage('blogs', blogsData);
        const index = blogs.findIndex(b => b.id === id);
        
        if (index !== -1) {
          blogs.splice(index, 1);
          this.saveToStorage('blogs', blogs);
          resolve(true);
        }
        resolve(false);
      }, 300);
    });
  }

  async likeBlog(id: string): Promise<Blog | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blogs: Blog[] = this.getFromStorage('blogs', blogsData);
        const blog = blogs.find(b => b.id === id);
        
        if (blog) {
          blog.likes += 1;
          this.saveToStorage('blogs', blogs);
          resolve(blog);
        }
        resolve(null);
      }, 200);
    });
  }

  async getComments(blogId: string): Promise<Comment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comments: Comment[] = this.getFromStorage('comments', commentsData)
          .filter(comment => comment.blogId === blogId)
          .map(comment => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
            updatedAt: new Date(comment.updatedAt),
            replies: comment.replies.map(reply => ({
              ...reply,
              createdAt: new Date(reply.createdAt),
              updatedAt: new Date(reply.updatedAt)
            }))
          }));
        resolve(comments);
      }, 300);
    });
  }

  async addComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comments: Comment[] = this.getFromStorage('comments', commentsData);

        const newComment: Comment = {
          ...commentData,
          id: Date.now().toString(),
          likes: 0,
          replies: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        comments.push(newComment);
        this.saveToStorage('comments', comments);
        resolve(newComment);
      }, 300);
    });
  }

  private saveBlog(blog: Blog): void {
    const blogs: Blog[] = this.getFromStorage('blogs', blogsData);
    const index = blogs.findIndex(b => b.id === blog.id);
    
    if (index !== -1) {
      blogs[index] = blog;
      this.saveToStorage('blogs', blogs);
    }
  }

  private getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  private saveToStorage(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
}

export const blogService = BlogService.getInstance();