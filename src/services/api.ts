import { ApiResponse, Post, Comment, User, DashboardStats } from '../types';

const TOKEN_KEY = 'blogsphere_auth_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'same-origin',
  });

  let data: any;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error(`Server returned status ${response.status}`);
  }

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg) as any;
    error.status = response.status;
    error.errors = data?.errors;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  async register(body: { name: string; email: string; password: string; confirmPassword?: string }) {
    const res = await request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (res.data?.token) setStoredToken(res.data.token);
    return res;
  },

  async login(body: { email: string; password: string }) {
    const res = await request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (res.data?.token) setStoredToken(res.data.token);
    return res;
  },

  async logout() {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      setStoredToken(null);
    }
  },

  async getMe() {
    return request<{ user: User }>('/api/auth/me');
  },

  // Posts
  async getPosts(params: { page?: number; limit?: number; search?: string; category?: string; sort?: string } = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.category && params.category !== 'All') searchParams.set('category', params.category);
    if (params.sort) searchParams.set('sort', params.sort);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<Post[]>(`/api/posts${query}`);
  },

  async getPostBySlug(slug: string) {
    return request<Post>(`/api/posts/${slug}`);
  },

  async createPost(postData: Partial<Post>) {
    return request<Post>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  async updatePost(id: number, postData: Partial<Post>) {
    return request<Post>(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  async deletePost(id: number) {
    return request<{ success: boolean }>(`/api/posts/${id}`, {
      method: 'DELETE',
    });
  },

  async getMyPosts(params: { page?: number; limit?: number; status?: string } = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.status) searchParams.set('status', params.status);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<Post[]>(`/api/users/me/posts${query}`);
  },

  // Comments
  async getComments(postId: number) {
    return request<Comment[]>(`/api/posts/${postId}/comments`);
  },

  async addComment(postId: number, content: string) {
    return request<Comment>(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  async deleteComment(commentId: number) {
    return request<{ success: boolean }>(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  // User Profile & Dashboard
  async getProfile() {
    return request<User>('/api/users/me');
  },

  async updateProfile(data: { name?: string; bio?: string | null }) {
    return request<User>('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getDashboard() {
    return request<DashboardStats>('/api/users/dashboard');
  },

  async submitContact(data: { name: string; email: string; subject: string; message: string }) {
    return request<{ success: boolean }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getHealth() {
    return request<{ database: { isUsingMySQL: boolean; engine: string; databaseName: string } }>('/api/health');
  },
};
