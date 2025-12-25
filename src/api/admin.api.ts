import { DashboardStats, Blog, User, BlogStatus } from '@/@types';
import blogsData from './mockData/blogs.json';
import usersData from './mockData/users.json';

const blogs: Blog[] = blogsData.map(blog => ({
  ...blog,
  createdAt: new Date(blog.createdAt),
  updatedAt: new Date(blog.updatedAt),
  publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined,
  status: blog.status as BlogStatus
}));

const users: User[] = usersData.map(user => ({
  ...user,
  joinedAt: new Date(user.joinedAt),
  role: user.role as 'admin' | 'user' | 'visitor',
  socialLinks: user.socialLinks || {}
}));

export const adminApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalUsers = users.length;
        const totalPosts = blogs.length;
        const activeAuthors = new Set(blogs.map(b => b.author.id)).size;
        const pendingPosts = blogs.filter(b => b.status === 'pending').length;
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const postsPerMonth = months.map((month, i) => ({
          month,
          count: Math.floor(Math.random() * 50) + 20
        }));
        
        const userRegistrations = months.map((month, i) => ({
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
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
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
          resolve(userWithoutPassword);
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