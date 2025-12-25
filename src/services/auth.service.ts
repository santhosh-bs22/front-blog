import { User, LoginCredentials, RegisterData, AuthResponse } from '@/@types';
import usersData from '@/api/mockData/users.json';

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const users: User[] = usersData.map(user => ({
          ...user,
          joinedAt: new Date(user.joinedAt)
        }));

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
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users: User[] = this.getFromStorage('users', usersData);

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
        this.saveToStorage('users', users);

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
  }

  async logout(): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        resolve({ success: true });
      }, 200);
    });
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          try {
            const tokenData = JSON.parse(atob(token));
            if (tokenData.exp > Date.now()) {
              resolve(JSON.parse(storedUser));
            } else {
              // Token expired
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              resolve(null);
            }
          } catch (error) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }, 200);
    });
  }

  async validateToken(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const tokenData = JSON.parse(atob(token));
          resolve(tokenData.exp > Date.now());
        } catch (error) {
          resolve(false);
        }
      }, 100);
    });
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

export const authService = AuthService.getInstance();