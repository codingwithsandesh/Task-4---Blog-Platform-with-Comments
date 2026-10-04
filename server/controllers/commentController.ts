import { Request, Response } from 'express';
import { getComments, createComment as repoCreateComment, getCommentById, deleteComment as repoDeleteComment, getPostById } from '../db/repository';
import { createCommentSchema } from '../validators';

export async function listComments(req: Request, res: Response) {
  try {
    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid article ID' });
    }

    const comments = await getComments(postId);
    return res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: comments,
    });
  } catch (err: any) {
    console.error('List comments error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve comments.',
    });
  }
}

export async function addComment(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Please log in to leave a comment.' });
    }

    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid article ID' });
    }

    // Verify post exists and is published (or belongs to author)
    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    if (post.status === 'draft' && post.author_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Cannot comment on an unpublished draft.' });
    }

    const parseResult = createCommentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.issues[0]?.message || 'Invalid comment content',
      });
    }

    const comment = await repoCreateComment({
      postId,
      userId: req.user.id,
      content: parseResult.data.content,
    });

    return res.status(201).json({
      success: true,
      message: 'Comment posted successfully.',
      data: comment,
    });
  } catch (err: any) {
    console.error('Add comment error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to publish comment. Please try again.',
    });
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid comment ID' });
    }

    const comment = await getCommentById(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Ownership check: must be comment author or admin
    if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment.',
      });
    }

    const success = await repoDeleteComment(id);
    if (!success) {
      return res.status(500).json({ success: false, message: 'Failed to delete comment' });
    }

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully.',
    });
  } catch (err: any) {
    console.error('Delete comment error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete comment.',
    });
  }
}
