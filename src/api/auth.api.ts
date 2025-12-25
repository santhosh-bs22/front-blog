import { User, LoginCredentials, RegisterData, AuthResponse } from '@/@types';
import usersData from './mockData/users.json';

const users: User[] = usersData.map(user => ({
  ...user,
  joinedAt: new Date(user.joinedAt)
}));

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = users.find(u => 
          u.email === credentials.email && 
          u.password === credentials.password
        );
        
        if (user) {
          // Create mock token
          const token = btoa(JSON.stringify({
            userId: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
          }));
          
          // Remove password before sending response
          const { password, ...userWithoutPassword } = user;
          
          resolve({
            success: true,
            user: userWithoutPassword,
            token
          });
        } else {
          resolve({
            success: false,
            error: 'Invalid email or password'
          });
        }
      }, 500);
    });
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = users.find(u => u.email === data.email);
        
        if (existingUser) {
          resolve({
            success: false,
            error: 'User with this email already exists'
          });
          return;
        }
        
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          username: data.username,
          email: data.email,
          password: data.password,
          role: 'user',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
          bio: '',
          socialLinks: {},
          isActive: true,
          isVerified: false,
          joinedAt: new Date()
        };
        
        users.push(newUser);
        
        // Create mock token
        const token = btoa(JSON.stringify({
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role,
          exp: Date.now() + 24 * 60 * 60 * 1000
        }));
        
        const { password, ...userWithoutPassword } = newUser;
        
        resolve({
          success: true,
          user: userWithoutPassword,
          token
        });
      }, 500);
    });
  },

  logout: async (): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 200);
    });
  },

  getCurrentUser: async (): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          resolve(null);
          return;
        }
        
        try {
          const decoded = JSON.parse(atob(token));
          const user = users.find(u => u.id === decoded.userId);
          
          if (user) {
            const { password, ...userWithoutPassword } = user;
            resolve(userWithoutPassword);
          } else {
            resolve(null);
          }
        } catch (error) {
          resolve(null);
        }
      }, 200);
    });
  }
};