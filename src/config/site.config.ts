import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_EMAIL } from './constants';

export const siteConfig = {
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  email: SITE_EMAIL,
  
  // SEO
  ogImage: `${SITE_URL}/og-image.png`,
  
  // Social Links
  socialLinks: {
    twitter: 'https://twitter.com/bloghub',
    github: 'https://github.com/bloghub',
    linkedin: 'https://linkedin.com/company/bloghub',
    discord: 'https://discord.gg/bloghub'
  },
  
  // Navigation
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Blogs',
      href: '/blogs',
    },
    {
      title: 'Categories',
      href: '/categories',
    },
    {
      title: 'About',
      href: '/about',
    },
    {
      title: 'Contact',
      href: '/contact',
    },
  ],
  
  // Footer Navigation
  footerNav: [
    {
      title: 'Company',
      items: [
        { title: 'About', href: '/about' },
        { title: 'Team', href: '/team' },
        { title: 'Careers', href: '/careers' },
        { title: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Legal',
      items: [
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Terms of Service', href: '/terms' },
        { title: 'Cookie Policy', href: '/cookies' }
      ]
    },
    {
      title: 'Resources',
      items: [
        { title: 'Documentation', href: '/docs' },
        { title: 'API Reference', href: '/api' },
        { title: 'Community', href: '/community' },
        { title: 'Support', href: '/support' }
      ]
    }
  ],
  
  // Features
  features: [
    {
      title: 'Write & Share',
      description: 'Create and share your knowledge with the community',
      icon: '✍️'
    },
    {
      title: 'Learn & Grow',
      description: 'Discover new insights and improve your skills',
      icon: '📚'
    },
    {
      title: 'Connect & Network',
      description: 'Connect with like-minded developers and creators',
      icon: '🤝'
    },
    {
      title: 'Open Source',
      description: 'Built with and for the open source community',
      icon: '🔓'
    }
  ],
  
  // Demo Accounts
  demoAccounts: {
    user: {
      email: 'john@example.com',
      password: 'password123'
    },
    admin: {
      email: 'admin@example.com',
      password: 'admin123'
    }
  }
} as const;