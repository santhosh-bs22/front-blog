// Define UserRole before using it
export type UserRole = 'visitor' | 'user' | 'admin';

// Define User interface before Blog
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  joinedAt: Date;
  lastLogin?: Date;
}

export type BlogStatus = 'draft' | 'published' | 'pending' | 'rejected';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: User;
  category: string;
  tags: string[];
  status: BlogStatus;
  featured: boolean;
  likes: number;
  comments: number;
  views: number;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Comment {
  id: string;
  blogId: string;
  author: User;
  content: string;
  likes: number;
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  isActive: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  activeAuthors: number;
  pendingPosts: number;
  monthlyGrowth: number;
  postsPerMonth: { month: string; count: number }[];
  userRegistrations: { month: string; count: number }[];
  topBlogs: Blog[];
}