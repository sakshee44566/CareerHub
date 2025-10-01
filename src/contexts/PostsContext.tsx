import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BlogPost } from '@/types/blog';
import { postsApi } from '@/services/api';

interface PostsContextType {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (post: Omit<BlogPost, 'id' | 'publishedAt'>) => Promise<void>;
  updatePost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPostById: (id: string) => BlogPost | undefined;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};

interface PostsProviderProps {
  children: ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await postsApi.getAll();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (post: Omit<BlogPost, 'id' | 'publishedAt'>) => {
    try {
      setError(null);
      const newPost = await postsApi.create(post);
      setPosts(prev => [newPost, ...prev]);
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
      throw err;
    }
  };

  const updatePost = async (id: string, post: Partial<BlogPost>) => {
    try {
      setError(null);
      const updatedPost = await postsApi.update(id, post);
      setPosts(prev => prev.map(p => p.id === id ? updatedPost : p));
    } catch (err) {
      setError('Failed to update post');
      console.error('Error updating post:', err);
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      setError(null);
      await postsApi.delete(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete post');
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  const getPostById = (id: string) => {
    return posts.find(post => post.id === id);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const value: PostsContextType = {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    getPostById,
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};


