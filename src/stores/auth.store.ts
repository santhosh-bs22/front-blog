import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthUser } from '@/@types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const mockUser: AuthUser = {
            id: '1',
            username: email.split('@')[0],
            email,
            role: email.includes('admin') ? 'admin' : 'user',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            bio: '',
            socialLinks: {},
            isActive: true,
            isVerified: true,
            joinedAt: new Date(),
            token: 'mock-jwt-token'
          };

          set({
            user: mockUser,
            token: 'mock-jwt-token',
            isLoading: false
          });

          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      register: async (username: string, email: string, password: string): Promise<boolean> => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newUser: AuthUser = {
            id: Date.now().toString(),
            username,
            email,
            role: 'user',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            bio: '',
            socialLinks: {},
            isActive: true,
            isVerified: false,
            joinedAt: new Date(),
            token: 'mock-jwt-token'
          };

          set({
            user: newUser,
            token: 'mock-jwt-token',
            isLoading: false
          });

          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null
        });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates }
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token
      })
    }
  )
);