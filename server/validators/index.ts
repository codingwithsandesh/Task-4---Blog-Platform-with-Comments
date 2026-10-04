import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.confirmPassword !== undefined && data.confirmPassword !== data.password) {
    return false;
  }
  return true;
}, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createPostSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(255, 'Title cannot exceed 255 characters'),
  slug: z.string().trim().max(255).optional(),
  excerpt: z.string().trim().min(10, 'Excerpt must be at least 10 characters').max(500, 'Excerpt cannot exceed 500 characters'),
  content: z.string().trim().min(20, 'Article content must be at least 20 characters'),
  cover_image_url: z.string().trim().max(1024).nullable().optional(),
  category: z.string().trim().min(2, 'Category is required').max(100),
  tags: z.string().trim().max(255).nullable().optional(),
  status: z.enum(['draft', 'published']).default('published'),
});

export const updatePostSchema = createPostSchema.partial();

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, 'Comment must be at least 2 characters')
    .max(1500, 'Comment cannot exceed 1500 characters'),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100).optional(),
  bio: z.string().trim().max(1000, 'Bio cannot exceed 1000 characters').nullable().optional(),
});
