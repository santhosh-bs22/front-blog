// src/api/admin.api.ts
import { DashboardStats, Blog, User, BlogStatus, UserRole } from '@/@types';
import blogsData from './mockData/blogs.json';
import usersData from './mockData/users.json';

// Local type for mock DB handling
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
  // Find the full author object from users to fix compatibility errors
  const fullAuthor = users.find(u => u.id === blog.author.id) || (blog.author as User);
  
  return {
    ...blog,
    createdAt: new Date(blog.createdAt),
    updatedAt: new Date(blog.updatedAt),
    publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined,
    status: blog.status as BlogStatus,
    author: fullAuthor as User
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
        const postsPerMonth = months.map((month) => ({ // Removed unused 'i'
          month,
          count: Math.floor(Math.random() * 50) + 20
        }));
        
        const userRegistrations = months.map((month) => ({ // Removed unused 'i'
          month,
          count: Math.floor(Math.random() * 30) + 10
        }));
        
        const topBlogs = [...blogs]
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);
        
        const monthlyGrowth = ((postsPerMonth[5].count - postsPerMonth[0].count) / postsPerMonth[0].count) * 100;
        
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
        // Correctly casting after removing password
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

  // ... rest of the file
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
  // ...
};