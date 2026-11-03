import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { INITIAL_CATEGORIES } from '../seed/seedData';

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 });
    
    // Fallback memory data if DB is empty or disconnected
    if (categories.length === 0) {
      categories = INITIAL_CATEGORIES as any;
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    // Graceful fallback to initial seed data
    res.status(200).json({
      success: true,
      count: INITIAL_CATEGORIES.length,
      data: INITIAL_CATEGORIES,
    });
  }
};
