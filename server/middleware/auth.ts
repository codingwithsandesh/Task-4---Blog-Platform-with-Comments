import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById, toSafeUser } from '../db/repository';
import { SafeUser } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'blogsphere_secure_jwt_secret_key_change_in_production_min_32';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}

export function generateToken(user: SafeUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.blogsphere_token) {
      token = req.cookies.blogsphere_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to continue.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or session has expired.',
      });
    }

    req.user = toSafeUser(user);
    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session. Please sign in again.',
    });
  }
}

export async function optionalAuthToken(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.blogsphere_token) {
      token = req.cookies.blogsphere_token;
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
      const user = await findUserById(decoded.id);
      if (user) {
        req.user = toSafeUser(user);
      }
    }
  } catch {
    // Ignore invalid tokens for optional auth
  }
  next();
}
