import { STORAGE_KEYS } from '@/config/constants';

export class StorageService {
  // Generic storage methods
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Auth storage methods
  static getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  static setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  static removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  static getUser(): any | null {
    return this.get(STORAGE_KEYS.USER, null);
  }

  static setUser(user: any): void {
    this.set(STORAGE_KEYS.USER, user);
  }

  static removeUser(): void {
    this.remove(STORAGE_KEYS.USER);
  }

  // Theme storage methods
  static getTheme(): string {
    return this.get(STORAGE_KEYS.THEME, 'system');
  }

  static setTheme(theme: string): void {
    this.set(STORAGE_KEYS.THEME, theme);
  }

  // Blog storage methods
  static getLikedBlogs(): string[] {
    return this.get(STORAGE_KEYS.LIKED_BLOGS, []);
  }

  static setLikedBlogs(blogIds: string[]): void {
    this.set(STORAGE_KEYS.LIKED_BLOGS, blogIds);
  }

  static getBookmarkedBlogs(): string[] {
    return this.get(STORAGE_KEYS.BOOKMARKED_BLOGS, []);
  }

  static setBookmarkedBlogs(blogIds: string[]): void {
    this.set(STORAGE_KEYS.BOOKMARKED_BLOGS, blogIds);
  }

  static getDrafts(): any[] {
    return this.get(STORAGE_KEYS.DRAFTS, []);
  }

  static setDrafts(drafts: any[]): void {
    this.set(STORAGE_KEYS.DRAFTS, drafts);
  }

  // Settings storage methods
  static getSettings(): Record<string, any> {
    return this.get(STORAGE_KEYS.SETTINGS, {});
  }

  static setSettings(settings: Record<string, any>): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  // Session storage methods
  static getSession<T>(key: string, defaultValue: T): T {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  static setSession<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to sessionStorage key "${key}":`, error);
    }
  }

  static removeSession(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }
}