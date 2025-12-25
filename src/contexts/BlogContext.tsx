import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Blog } from '@/@types';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

interface BlogContextType {
  likedBlogs: string[];
  bookmarkedBlogs: string[];
  drafts: Blog[];
  likeBlog: (blogId: string) => void;
  unlikeBlog: (blogId: string) => void;
  bookmarkBlog: (blogId: string) => void;
  unbookmarkBlog: (blogId: string) => void;
  saveDraft: (draft: Blog) => void;
  updateDraft: (id: string, draft: Partial<Blog>) => void;
  deleteDraft: (id: string) => void;
  getDraft: (id: string) => Blog | undefined;
  isLiked: (blogId: string) => boolean;
  isBookmarked: (blogId: string) => boolean;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [likedBlogs, setLikedBlogs] = useState<string[]>(() => 
    getLocalStorage('liked_blogs', [])
  );
  
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<string[]>(() => 
    getLocalStorage('bookmarked_blogs', [])
  );
  
  const [drafts, setDrafts] = useState<Blog[]>(() => 
    getLocalStorage('blog_drafts', [])
  );

  // Sync with localStorage
  useEffect(() => {
    setLocalStorage('liked_blogs', likedBlogs);
  }, [likedBlogs]);

  useEffect(() => {
    setLocalStorage('bookmarked_blogs', bookmarkedBlogs);
  }, [bookmarkedBlogs]);

  useEffect(() => {
    setLocalStorage('blog_drafts', drafts);
  }, [drafts]);

  const likeBlog = (blogId: string) => {
    setLikedBlogs(prev => [...prev, blogId]);
  };

  const unlikeBlog = (blogId: string) => {
    setLikedBlogs(prev => prev.filter(id => id !== blogId));
  };

  const bookmarkBlog = (blogId: string) => {
    setBookmarkedBlogs(prev => [...prev, blogId]);
  };

  const unbookmarkBlog = (blogId: string) => {
    setBookmarkedBlogs(prev => prev.filter(id => id !== blogId));
  };

  const saveDraft = (draft: Blog) => {
    setDrafts(prev => {
      const existingIndex = prev.findIndex(d => d.id === draft.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = draft;
        return updated;
      }
      return [...prev, draft];
    });
  };

  const updateDraft = (id: string, updates: Partial<Blog>) => {
    setDrafts(prev => 
      prev.map(draft => 
        draft.id === id ? { ...draft, ...updates, updatedAt: new Date() } : draft
      )
    );
  };

  const deleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(draft => draft.id !== id));
  };

  const getDraft = (id: string) => {
    return drafts.find(draft => draft.id === id);
  };

  const isLiked = (blogId: string) => {
    return likedBlogs.includes(blogId);
  };

  const isBookmarked = (blogId: string) => {
    return bookmarkedBlogs.includes(blogId);
  };

  return (
    <BlogContext.Provider
      value={{
        likedBlogs,
        bookmarkedBlogs,
        drafts,
        likeBlog,
        unlikeBlog,
        bookmarkBlog,
        unbookmarkBlog,
        saveDraft,
        updateDraft,
        deleteDraft,
        getDraft,
        isLiked,
        isBookmarked
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};