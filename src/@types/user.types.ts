export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  website?: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  joinedAt: Date;
  lastLogin?: Date;
}

export interface AuthUser extends User {
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}