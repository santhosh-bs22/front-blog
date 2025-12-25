import { User } from '@/@types';
import usersData from './mockData/users.json';

const users: User[] = usersData.map(user => ({
  ...user,
  joinedAt: new Date(user.joinedAt)
}));

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
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
          resolve(userWithoutPassword);
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
          resolve(userWithoutPassword);
        }
        resolve(null);
      }, 300);
    });
  },

  getCurrentUserStats: async (userId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock stats
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

  getAuthorPosts: async (authorId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock posts
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