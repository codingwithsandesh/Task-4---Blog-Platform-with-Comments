import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser, findUserById, toSafeUser } from '../db/repository';
import { generateToken } from '../middleware/auth';
import { registerSchema, loginSchema } from '../validators';

const COOKIE_NAME = 'blogsphere_token';
const IS_PROD = process.env.NODE_ENV === 'production';

export async function register(req: Request, res: Response) {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.issues[0]?.message || 'Invalid registration data',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { name, email, password } = parseResult.data;

    // Check duplicate email
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
      });
    }

    // Hash password with salt rounds (10)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user in database
    const newUser = await createUser({
      name,
      email,
      password_hash,
      role: 'user',
    });

    const safeUser = toSafeUser(newUser);
    const token = generateToken(safeUser);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully. Welcome to BlogSphere!',
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during registration. Please try again.',
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.issues[0]?.message || 'Invalid login details',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parseResult.data;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password combination.',
      });
    }

    // Verify bcrypt password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password combination.',
      });
    }

    const safeUser = toSafeUser(user);
    const token = generateToken(safeUser);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back!',
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during login. Please try again.',
    });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
  });
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}

export async function getMe(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }

  const user = await findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User account not found',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Profile retrieved',
    data: {
      user: toSafeUser(user),
    },
  });
}
