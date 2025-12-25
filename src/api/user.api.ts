// src/api/user.api.ts
import { User, UserRole } from '@/@types';
import usersData from './mockData/users.json';

interface UserWithPassword extends User {
  password?: string;
}

const users: UserWithPassword[] = usersData.map(user => ({
  ...user,
  joinedAt: new Date(user.joinedAt),
  role: user.role as UserRole
}));

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const usersWithoutPasswords = users.map(({ password, ...user }) => user as User);
        resolve(usersWithoutPasswords);
      }, 300);
    });
  },

  getUserById: async (id: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = users.find(u => u.id === id);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          resolve(userWithoutPassword as User);
        }
        resolve(null);
      }, 200);
    });
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updates };
          const { password, ...userWithoutPassword } = users[userIndex];
          resolve(userWithoutPassword as User);
        }
        resolve(null);
      }, 300);
    });
  },

  getCurrentUserStats: async (_userId: string) => { // Added underscore to show intentionally unused
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalPosts: 12,
          totalLikes: 245,
          totalComments: 56,
          totalViews: 1234,
          draftCount: 2,
          publishedCount: 10
        });
      }, 300);
    });
  },

  getAuthorPosts: async (_authorId: string) => { // Added underscore
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: 'Sample Blog Post',
            status: 'published',
            createdAt: new Date(),
            views: 123,
            likes: 45,
            comments: 12
          }
        ]);
      }, 300);
    });
  }
};