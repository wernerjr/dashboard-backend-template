import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError, asyncHandler } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

export class UserController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role = 'USER' } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  });

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { name, email, currentPassword, newPassword } = req.body;

    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { 
          email,
          NOT: {
            id: userId
          }
        },
      });

      if (existingUser) {
        throw new AppError(400, 'Email already in use');
      }
      updateData.email = email;
    }

    if (currentPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        throw new AppError(401, 'Current password is incorrect');
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });
  });

  listUsers = asyncHandler(async (req: Request, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
      throw new AppError(403, 'Forbidden: Admin access required');
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        users
      }
    });
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
      throw new AppError(403, 'Forbidden: Admin access required');
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      data: {
        message: 'User deleted successfully'
      }
    });
  });
} 