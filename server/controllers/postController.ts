import { Request, Response } from 'express';
import {
  getPosts,
  getPostBySlug,
  getPostById,
  createPost as repoCreatePost,
  updatePost as repoUpdatePost,
  deletePost as repoDeletePost,
} from '../db/repository';
import { createPostSchema, updatePostSchema } from '../validators';

export async function listPosts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 9;
    const search = (req.query.search as string) || '';
    const category = (req.query.category as string) || '';
    const sort = req.query.sort === 'oldest' ? 'oldest' : 'newest';

    const result = await getPosts({
      page,
      limit,
      search,
      category,
      sort,
      status: 'published',
    });

    return res.status(200).json({
      success: true,
      message: 'Articles retrieved successfully',
      data: result.posts,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (err: any) {
    console.error('List posts error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve articles. Please try again later.',
    });
  }
}

export async function getPost(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const currentUserId = req.user?.id;

    const post = await getPostBySlug(slug, currentUserId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'The requested article could not be found or is not publicly published.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Article retrieved successfully',
      data: post,
    });
  } catch (err: any) {
    console.error('Get post error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve article.',
    });
  }
}

export async function createPost(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const parseResult = createPostSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.issues[0]?.message || 'Invalid article details',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { title, slug, excerpt, content, cover_image_url, category, tags, status } = parseResult.data;

    const newPost = await repoCreatePost({
      author_id: req.user.id,
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      category,
      tags,
      status: status || 'published',
    });

    return res.status(201).json({
      success: true,
      message: status === 'draft' ? 'Draft saved successfully' : 'Article published successfully!',
      data: newPost,
    });
  } catch (err: any) {
    console.error('Create post error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to save article. Please try again.',
    });
  }
}

export async function updatePost(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid article ID' });
    }

    const existing = await getPostById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Ownership check: Must be post author or admin
    if (existing.author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this article. Only the author can make changes.',
      });
    }

    const parseResult = updatePostSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.issues[0]?.message || 'Invalid update data',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const updated = await repoUpdatePost(id, parseResult.data);
    return res.status(200).json({
      success: true,
      message: 'Article updated successfully.',
      data: updated,
    });
  } catch (err: any) {
    console.error('Update post error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update article.',
    });
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid article ID' });
    }

    const existing = await getPostById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Ownership check
    if (existing.author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this article.',
      });
    }

    const deleted = await repoDeletePost(id);
    if (!deleted) {
      return res.status(500).json({ success: false, message: 'Failed to delete article' });
    }

    return res.status(200).json({
      success: true,
      message: 'Article and associated comments have been deleted permanently.',
    });
  } catch (err: any) {
    console.error('Delete post error:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the article.',
    });
  }
}

export async function getMyPosts(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const status = (req.query.status as any) || 'all';

    const result = await getPosts({
      page,
      limit,
      authorId: req.user.id,
      status,
      sort: 'newest',
    });

    return res.status(200).json({
      success: true,
      message: 'User articles retrieved',
      data: result.posts,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (err: any) {
    console.error('Get my posts error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your articles.',
    });
  }
}
