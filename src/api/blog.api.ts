import { Blog, PaginatedResponse, QueryParams, BlogStatus } from '@/@types';
import blogsData from './mockData/blogs.json';

const blogs: Blog[] = blogsData.map(blog => ({
  ...blog,
  createdAt: new Date(blog.createdAt),
  updatedAt: new Date(blog.updatedAt),
  publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined,
  status: blog.status as BlogStatus,
  readingTime: blog.readingTime || 5
}));

export const blogApi = {
  getBlogs: async (params: QueryParams = {}): Promise<PaginatedResponse<Blog>> => {
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
        let filteredBlogs = [...blogs];
        
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
  },

  getBlogById: async (id: string): Promise<Blog | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blog = blogs.find(b => b.id === id);
        if (blog) {
          blog.views += 1;
        }
        resolve(blog || null);
      }, 200);
    });
  },

  getBlogBySlug: async (slug: string): Promise<Blog | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blog = blogs.find(b => b.slug === slug);
        if (blog) {
          blog.views += 1;
        }
        resolve(blog || null);
      }, 200);
    });
  },

  createBlog: async (blogData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBlog: Blog = {
          ...blogData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          likes: 0,
          comments: 0,
          views: 0,
          readingTime: Math.ceil(blogData.content.length / 1000)
        };
        
        blogs.unshift(newBlog);
        resolve(newBlog);
      }, 500);
    });
  },

  updateBlog: async (id: string, updates: Partial<Blog>): Promise<Blog | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = blogs.findIndex(b => b.id === id);
        if (index !== -1) {
          blogs[index] = {
            ...blogs[index],
            ...updates,
            updatedAt: new Date()
          };
          resolve(blogs[index]);
        }
        resolve(null);
      }, 500);
    });
  },

  deleteBlog: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = blogs.findIndex(b => b.id === id);
        if (index !== -1) {
          blogs.splice(index, 1);
          resolve(true);
        }
        resolve(false);
      }, 300);
    });
  },

  likeBlog: async (id: string): Promise<Blog | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blog = blogs.find(b => b.id === id);
        if (blog) {
          blog.likes += 1;
          resolve(blog);
        }
        resolve(null);
      }, 200);
    });
  },

  getFeaturedBlogs: async (): Promise<Blog[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const featured = blogs
          .filter(b => b.featured && b.status === 'published')
          .slice(0, 5);
        resolve(featured);
      }, 200);
    });
  },

  getBlogsByCategory: async (category: string): Promise<Blog[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categoryBlogs = blogs
          .filter(b => b.category === category && b.status === 'published')
          .slice(0, 10);
        resolve(categoryBlogs);
      }, 200);
    });
  }
};