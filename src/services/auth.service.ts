import { User, LoginCredentials, RegisterData, AuthResponse } from '@/@types';
import usersData from '@/api/mockData/users.json';

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) AuthService.instance = new AuthService();
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = (usersData as any[]).map(user => ({
          ...user,
          joinedAt: new Date(user.joinedAt)
        })) as (User & { password?: string })[];

        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);

        if (user) {
          const token = btoa(JSON.stringify({ userId: user.id, email: user.email, role: user.role, exp: Date.now() + 86400000 }));
          const { password, ...userWithoutPassword } = user;
          resolve({ success: true, user: userWithoutPassword as User, token });
        } else {
          resolve({ success: false, error: 'Invalid email or password' });
        }
      }, 500);
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = this.getFromStorage('users', usersData) as (User & { password?: string })[];
        if (users.find(u => u.email === data.email)) {
          resolve({ success: false, error: 'User exists' });
          return;
        }

        const newUser: User & { password?: string } = {
          id: Date.now().toString(),
          username: data.username,
          email: data.email,
          password: data.password,
          role: 'user',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
          isActive: true,
          isVerified: false,
          joinedAt: new Date(),
        };

        users.push(newUser);
        this.saveToStorage('users', users);
        const { password, ...userWithoutPassword } = newUser;
        resolve({ success: true, user: userWithoutPassword as User, token: 'mock-token' });
      }, 500);
    });
  }

  async getCurrentUser(): Promise<User | null> {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async logout(): Promise<{ success: boolean }> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  }

  private getFromStorage<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }

  private saveToStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export const authService = AuthService.getInstance();