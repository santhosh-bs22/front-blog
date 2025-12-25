export const SITE_NAME = 'BlogHub';
export const SITE_DESCRIPTION = 'A platform for developers to share knowledge and connect';
export const SITE_URL = 'http://localhost:3000';
export const SITE_AUTHOR = 'BlogHub Team';
export const SITE_EMAIL = 'contact@bloghub.com';

export const ROLES = {
  VISITOR: 'visitor',
  USER: 'user',
  ADMIN: 'admin'
} as const;

export const BLOG_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  REJECTED: 'rejected'
} as const;

export const CATEGORIES = [
  { id: 'react', name: 'React', icon: '⚛️' },
  { id: 'typescript', name: 'TypeScript', icon: '📘' },
  { id: 'nextjs', name: 'Next.js', icon: '▲' },
  { id: 'uiux', name: 'UI/UX Design', icon: '🎨' },
  { id: 'ai', name: 'AI & ML', icon: '🤖' },
  { id: 'career', name: 'Career', icon: '💼' },
  { id: 'webdev', name: 'Web Development', icon: '🌐' },
  { id: 'devops', name: 'DevOps', icon: '⚙️' },
  { id: 'mobile', name: 'Mobile', icon: '📱' },
  { id: 'database', name: 'Database', icon: '🗄️' }
] as const;

export const TAGS = [
  'react', 'javascript', 'typescript', 'nextjs', 'nodejs',
  'python', 'aws', 'docker', 'kubernetes', 'graphql',
  'mongodb', 'postgresql', 'tailwind', 'css', 'html',
  'frontend', 'backend', 'fullstack', 'devops', 'testing',
  'performance', 'security', 'accessibility', 'seo'
] as const;

export const PAGINATION_LIMITS = [10, 25, 50, 100] as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  TOTAL_PAGES: 1
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  DRAFTS: 'drafts',
  LIKED_BLOGS: 'liked_blogs',
  BOOKMARKED_BLOGS: 'bookmarked_blogs',
  SETTINGS: 'settings'
} as const;

export const API_ENDPOINTS = {
  BLOGS: '/api/blogs',
  USERS: '/api/users',
  AUTH: '/api/auth',
  CATEGORIES: '/api/categories',
  COMMENTS: '/api/comments'
} as const;

export const FORM_VALIDATION = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 6,
  TITLE_MIN: 5,
  TITLE_MAX: 200,
  EXCERPT_MAX: 300,
  CONTENT_MIN: 100,
  TAG_MAX: 20,
  TAGS_MAX_COUNT: 10
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'MMM d, yyyy',
  DATETIME: 'MMM d, yyyy • h:mm a',
  TIME_AGO: 'time-ago'
} as const;