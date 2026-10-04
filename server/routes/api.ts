import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} from '../controllers/postController';
import {
  listComments,
  addComment,
  deleteComment,
} from '../controllers/commentController';
import {
  getProfile,
  updateProfile,
  getDashboard,
  submitContact,
  getHealth,
} from '../controllers/userController';
import { authenticateToken, optionalAuthToken } from '../middleware/auth';

const router = Router();

// Health & System Status
router.get('/health', getHealth);

// Authentication
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/auth/me', authenticateToken, getMe);

// Posts
router.get('/posts', listPosts);
router.get('/posts/:slug', optionalAuthToken, getPost);
router.post('/posts', authenticateToken, createPost);
router.put('/posts/:id', authenticateToken, updatePost);
router.delete('/posts/:id', authenticateToken, deletePost);

// Comments
router.get('/posts/:postId/comments', listComments);
router.post('/posts/:postId/comments', authenticateToken, addComment);
router.delete('/comments/:id', authenticateToken, deleteComment);

// User & Dashboard
router.get('/users/me', authenticateToken, getProfile);
router.patch('/users/me', authenticateToken, updateProfile);
router.get('/users/me/posts', authenticateToken, getMyPosts);
router.get('/users/dashboard', authenticateToken, getDashboard);

// Contact
router.post('/contact', submitContact);

export default router;
