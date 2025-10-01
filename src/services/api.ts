import axios from 'axios';
import { BlogPost } from '@/types/blog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Posts API
export const postsApi = {
  // Get all posts
  getAll: async (): Promise<BlogPost[]> => {
    const response = await api.get('/posts');
    return response.data;
  },

  // Get post by ID
  getById: async (id: string): Promise<BlogPost> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create new post
  create: async (post: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<BlogPost> => {
    const response = await api.post('/posts', post);
    return response.data;
  },

  // Update post
  update: async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await api.put(`/posts/${id}`, post);
    return response.data;
  },

  // Delete post
  delete: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

// Contact API
export const contactApi = {
  // Send contact message
  sendMessage: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> => {
    await api.post('/contact', data);
  },

  // Subscribe to newsletter
  subscribe: async (email: string): Promise<void> => {
    await api.post('/subscribe', { email });
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<{ token: string }> => {
    const res = await api.post('/auth/login', { username, password });
    return res.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('admin_token');
  }
};

export default api;


