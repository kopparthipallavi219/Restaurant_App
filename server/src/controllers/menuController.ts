import { Request, Response, NextFunction } from 'express';
import { MenuItem } from '../models/MenuItem';
import { INITIAL_MENU_ITEMS } from '../seed/seedData';
import { AppError } from '../middleware/errorHandler';

export const getMenuItems = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { category, search, veg, chefSpecial, spiceLevel, includeUnavailable, all } = req.query;

    let filter: Record<string, any> = {};
    if (includeUnavailable !== 'true' && all !== 'true') {
      filter.isAvailable = true;
    }

    if (category) {
      filter.categorySlug = category;
    }
    if (veg !== undefined) {
      filter.isVeg = veg === 'true';
    }
    if (chefSpecial !== undefined) {
      filter.isChefSpecial = chefSpecial === 'true';
    }
    if (spiceLevel) {
      filter.spiceLevel = spiceLevel;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    let items = await MenuItem.find(filter).sort({ isChefSpecial: -1, ordersCount: -1 });

    // Fallback if DB empty
    if (items.length === 0 && !search && !category) {
      items = INITIAL_MENU_ITEMS as any;
    }

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (_error) {
    let fallback = INITIAL_MENU_ITEMS;
    const { category, veg } = req.query;
    if (category) {
      fallback = fallback.filter((i) => i.categorySlug === category);
    }
    if (veg !== undefined) {
      fallback = fallback.filter((i) => i.isVeg === (veg === 'true'));
    }
    res.status(200).json({
      success: true,
      count: fallback.length,
      data: fallback,
    });
  }
};

export const getMenuItemBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    let item = await MenuItem.findOne({ slug });

    if (!item) {
      const match = INITIAL_MENU_ITEMS.find((i) => i.slug === slug);
      if (match) {
        res.status(200).json({ success: true, data: match });
        return;
      }
      return next(new AppError('Menu item not found', 404));
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const itemData = req.body;
    if (!itemData.slug) {
      itemData.slug = itemData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const newItem = await MenuItem.create(itemData);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await MenuItem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return next(new AppError('Menu item not found', 404));
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await MenuItem.findByIdAndDelete(id);
    if (!deleted) {
      return next(new AppError('Menu item not found', 404));
    }
    res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
