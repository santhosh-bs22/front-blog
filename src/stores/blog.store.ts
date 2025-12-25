import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Blog } from '@/@types';

interface BlogState {
  drafts: Blog[];
  likedBlogs: string[];
  bookmarkedBlogs: string[];
  viewedBlogs: string[];
  
  // Draft actions
  saveDraft: (draft: Blog) => void;
  updateDraft: (id: string, updates: Partial<Blog>) => void;
  deleteDraft: (id: string) => void;
  getDraft: (id: string) => Blog | undefined;
  
  // Like actions
  likeBlog: (blogId: string) => void;
  unlikeBlog: (blogId: string) => void;
  isLiked: (blogId: string) => boolean;
  
  // Bookmark actions
  bookmarkBlog: (blogId: string) => void;
  unbookmarkBlog: (blogId: string) => void;
  isBookmarked: (blogId: string) => boolean;
  
  // View actions
  addView: (blogId: string) => void;
  hasViewed: (blogId: string) => boolean;
  
  // Clear all
  clearAll: () => void;
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set, get) => ({
      drafts: [],
      likedBlogs: [],
      bookmarkedBlogs: [],
      viewedBlogs: [],

      saveDraft: (draft: Blog) => {
        set((state) => {
          const existingIndex = state.drafts.findIndex(d => d.id === draft.id);
          if (existingIndex !== -1) {
            const updated = [...state.drafts];
            updated[existingIndex] = draft;
            return { drafts: updated };
          }
          return { drafts: [...state.drafts, draft] };
        });
      },

      updateDraft: (id: string, updates: Partial<Blog>) => {
        set((state) => ({
          drafts: state.drafts.map(draft =>
            draft.id === id
              ? { ...draft, ...updates, updatedAt: new Date() }
              : draft
          )
        }));
      },

      deleteDraft: (id: string) => {
        set((state) => ({
          drafts: state.drafts.filter(draft => draft.id !== id)
        }));
      },

      getDraft: (id: string) => {
        return get().drafts.find(draft => draft.id === id);
      },

      likeBlog: (blogId: string) => {
        set((state) => ({
          likedBlogs: [...state.likedBlogs, blogId]
        }));
      },

      unlikeBlog: (blogId: string) => {
        set((state) => ({
          likedBlogs: state.likedBlogs.filter(id => id !== blogId)
        }));
      },

      isLiked: (blogId: string) => {
        return get().likedBlogs.includes(blogId);
      },

      bookmarkBlog: (blogId: string) => {
        set((state) => ({
          bookmarkedBlogs: [...state.bookmarkedBlogs, blogId]
        }));
      },

      unbookmarkBlog: (blogId: string) => {
        set((state) => ({
          bookmarkedBlogs: state.bookmarkedBlogs.filter(id => id !== blogId)
        }));
      },

      isBookmarked: (blogId: string) => {
        return get().bookmarkedBlogs.includes(blogId);
      },

      addView: (blogId: string) => {
        set((state) => {
          if (!state.viewedBlogs.includes(blogId)) {
            return { viewedBlogs: [...state.viewedBlogs, blogId] };
          }
          return state;
        });
      },

      hasViewed: (blogId: string) => {
        return get().viewedBlogs.includes(blogId);
      },

      clearAll: () => {
        set({
          drafts: [],
          likedBlogs: [],
          bookmarkedBlogs: [],
          viewedBlogs: []
        });
      }
    }),
    {
      name: 'blog-storage'
    }
  )
);