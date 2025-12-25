import { DashboardStats, Blog, User, BlogStatus, UserRole } from '@/@types';
import blogsData from './mockData/blogs.json';
import usersData from './mockData/users.json';

// Internal type to handle mock logic with passwords
interface UserWithPassword extends User {
  password?: string;
}

const users: UserWithPassword[] = usersData.map(user => ({
  ...user,
  joinedAt: new Date(user.joinedAt),
  role: user.role as UserRole,
  socialLinks: user.socialLinks || {}
}));

const blogs: Blog[] = blogsData.map(blog => {
  // Find the full user object to satisfy the User interface requirements
  const fullAuthor = users.find(u => u.id === blog.author.id);
  
  return {
    ...blog,
    createdAt: new Date(blog.createdAt),
    updatedAt: new Date(blog.updatedAt),
    publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined,
    status: blog.status as BlogStatus,
    author: (fullAuthor || {
      ...blog.author,
      email: '',
      role: 'user' as UserRole,
      isActive: true,
      isVerified: false,
      joinedAt: new Date(),
      socialLinks: {}
    }) as User
  };
});

export const adminApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalUsers = users.length;
        const totalPosts = blogs.length;
        const activeAuthors = new Set(blogs.map(b => b.author.id)).size;
        const pendingPosts = blogs.filter(b => b.status === 'pending').length;
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        // Removed unused 'i' parameters
        const postsPerMonth = months.map((month) => ({
          month,
          count: Math.floor(Math.random() * 50) + 20
        }));
        
        const userRegistrations = months.map((month) => ({
          month,
          count: Math.floor(Math.random() * 30) + 10
        }));
        
        const topBlogs = [...blogs]
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);
        
        const monthlyGrowth = 12.5; 
        
        resolve({
          totalUsers,
          totalPosts,
          activeAuthors,
          pendingPosts,
          monthlyGrowth,
          postsPerMonth,
          userRegistrations,
          topBlogs
        });
      }, 500);
    });
  },

  getAllUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Exclude passwords when returning the User type
        const usersWithoutPasswords = users.map(({ password, ...user }) => user as User);
        resolve(usersWithoutPasswords);
      }, 300);
    });
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updates };
          const { password, ...userWithoutPassword } = users[userIndex];
          resolve(userWithoutPassword as User);
        }
        resolve(null);
      }, 300);
    });
  },

  deleteUser: async (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          users.splice(userIndex, 1);
          resolve(true);
        }
        resolve(false);
      }, 300);
    });
  },

  getAllBlogs: async (): Promise<Blog[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...blogs]);
      }, 300);
    });
  },

  updateBlogStatus: async (blogId: string, status: string): Promise<Blog | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blogIndex = blogs.findIndex(b => b.id === blogId);
        if (blogIndex !== -1) {
          blogs[blogIndex].status = status as BlogStatus;
          resolve(blogs[blogIndex]);
        }
        resolve(null);
      }, 300);
    });
  },

  featureBlog: async (blogId: string, featured: boolean): Promise<Blog | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blogIndex = blogs.findIndex(b => b.id === blogId);
        if (blogIndex !== -1) {
          blogs[blogIndex].featured = featured;
          resolve(blogs[blogIndex]);
        }
        resolve(null);
      }, 300);
    });
  }
};