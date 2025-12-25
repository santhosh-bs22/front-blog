import { STORAGE_KEYS } from '@/config/constants';

export class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic storage methods
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Auth storage
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  getUser(): any | null {
    return this.get(STORAGE_KEYS.USER, null);
  }

  setUser(user: any): void {
    this.set(STORAGE_KEYS.USER, user);
  }

  removeUser(): void {
    this.remove(STORAGE_KEYS.USER);
  }

  // Theme
  getTheme(): string {
    return this.get(STORAGE_KEYS.THEME, 'system');
  }

  setTheme(theme: string): void {
    this.set(STORAGE_KEYS.THEME, theme);
  }

  // Blog storage
  getDrafts(): any[] {
    return this.get(STORAGE_KEYS.DRAFTS, []);
  }

  setDrafts(drafts: any[]): void {
    this.set(STORAGE_KEYS.DRAFTS, drafts);
  }

  getLikedBlogs(): string[] {
    return this.get(STORAGE_KEYS.LIKED_BLOGS, []);
  }

  setLikedBlogs(blogIds: string[]): void {
    this.set(STORAGE_KEYS.LIKED_BLOGS, blogIds);
  }

  getBookmarkedBlogs(): string[] {
    return this.get(STORAGE_KEYS.BOOKMARKED_BLOGS, []);
  }

  setBookmarkedBlogs(blogIds: string[]): void {
    this.set(STORAGE_KEYS.BOOKMARKED_BLOGS, blogIds);
  }

  // Settings
  getSettings(): Record<string, any> {
    return this.get(STORAGE_KEYS.SETTINGS, {});
  }

  setSettings(settings: Record<string, any>): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  // Session storage
  getSession<T>(key: string, defaultValue: T): T {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  setSession<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to sessionStorage key "${key}":`, error);
    }
  }

  removeSession(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }

  // Helper methods
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  getKeys(): string[] {
    return Object.keys(localStorage);
  }

  // Data migration helper
  migrateData(oldKey: string, newKey: string): void {
    const oldData = this.get(oldKey, null);
    if (oldData !== null) {
      this.set(newKey, oldData);
      this.remove(oldKey);
    }
  }
}

export const storageService = StorageService.getInstance();