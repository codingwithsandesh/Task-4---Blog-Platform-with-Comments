export interface User {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  author_id: number;
  author_name?: string;
  author_bio?: string | null;
  author_email?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  tags: string | null;
  reading_time_minutes: number;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  comments_count?: number;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  author_name: string;
  author_role: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  commentsReceived: number;
  recentPosts: Array<{
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors?: Record<string, string[]>;
}
