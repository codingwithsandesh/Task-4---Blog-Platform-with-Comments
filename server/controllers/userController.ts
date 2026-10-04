import { Request, Response } from 'express';
import { findUserById, updateUser, getDashboardStats, toSafeUser, getDatabaseStatus } from '../db/repository';
import { updateProfileSchema } from '../validators';
import { z } from 'zod';

export async function getProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved',
      data: toSafeUser(user),
    });
  } catch (err: any) {
    console.error('Get profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load profile' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.issues[0]?.message || 'Invalid profile information',
      });
    }

    const updated = await updateUser(req.user.id, parseResult.data);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: toSafeUser(updated),
    });
  } catch (err: any) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
}

export async function getDashboard(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const stats = await getDashboardStats(req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved',
      data: stats,
    });
  } catch (err: any) {
    console.error('Get dashboard error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load dashboard data' });
  }
}

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
});

export async function submitContact(req: Request, res: Response) {
  try {
    const parseResult = contactSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.issues[0]?.message || 'Invalid contact form details',
      });
    }

    // In a production setup, this sends via SendGrid, SES, or Resend.
    // For this full-stack deployment, we log the verified inquiry and return a successful confirmation.
    console.log('[BlogSphere Contact Inquiry Received]:', {
      ...parseResult.data,
      received_at: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you for reaching out. Your inquiry has been received and our editorial board will reply shortly.',
    });
  } catch (err: any) {
    console.error('Contact submit error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit inquiry' });
  }
}

export async function getHealth(req: Request, res: Response) {
  const dbStatus = getDatabaseStatus();
  return res.status(200).json({
    success: true,
    message: 'BlogSphere API operational',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
}
