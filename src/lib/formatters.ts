import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return format(date, 'MMM d, yyyy');
};

export const formatDateTime = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return format(date, 'MMM d, yyyy • h:mm a');
};

export const formatTimeAgo = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) {
    return 'Less than a minute read';
  }
  if (minutes === 1) {
    return '1 minute read';
  }
  return `${minutes} minute read`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const generateExcerpt = (content: string, maxLength: number = 150): string => {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // Truncate and add ellipsis
  return truncateText(plainText, maxLength);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};