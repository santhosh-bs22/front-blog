import { DashboardStats, Blog, User } from '@/@types';

export class AdminService {
  private static instance: AdminService;

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalUsers: 156,
          totalPosts: 423,
          activeAuthors: 89,
          pendingPosts: 12,
          monthlyGrowth: 15.5,
          postsPerMonth: [
            { month: 'Jan', count: 45 }, { month: 'Feb', count: 52 },
            { month: 'Mar', count: 68 }, { month: 'Apr', count: 74 },
            { month: 'May', count: 82 }, { month: 'Jun', count: 95 },
          ],
          userRegistrations: [
            { month: 'Jan', count: 23 }, { month: 'Feb', count: 28 },
            { month: 'Mar', count: 35 }, { month: 'Apr', count: 42 },
            { month: 'May', count: 48 }, { month: 'Jun', count: 56 },
          ],
          topBlogs: [] as Blog[],
        });
      }, 500);
    });
  }

  async updateBlogStatus(blogId: string, status: string): Promise<Blog | null> {
    // Fixed: Added explicit type casting (as Blog[])
    const blogs = this.getFromStorage('blogs', []) as Blog[];
    const blogIndex = blogs.findIndex((b) => b.id === blogId);
    
    if (blogIndex !== -1) {
      blogs[blogIndex].status = status as any;
      this.saveToStorage('blogs', blogs);
      return blogs[blogIndex];
    }
    return null;
  }

  async updateUserRole(userId: string, role: string): Promise<User | null> {
    // Fixed: Added explicit type casting (as User[])
    const users = this.getFromStorage('users', []) as User[];
    const userIndex = users.findIndex((u) => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].role = role as any;
      this.saveToStorage('users', users);
      return users[userIndex];
    }
    return null;
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

export const adminService = AdminService.getInstance();