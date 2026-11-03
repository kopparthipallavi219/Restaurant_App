import { Request, Response, NextFunction } from 'express';
import { Outlet } from '../models/Outlet';
import { INITIAL_OUTLETS } from '../seed/seedData';
import { AppError } from '../middleware/errorHandler';

export const getOutlets = async (
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    let outlets = await Outlet.find({ isActive: true }).sort({ branchName: 1 });

    if (outlets.length === 0) {
      outlets = INITIAL_OUTLETS as any;
    }

    res.status(200).json({
      success: true,
      count: outlets.length,
      data: outlets,
    });
  } catch (_error) {
    res.status(200).json({
      success: true,
      count: INITIAL_OUTLETS.length,
      data: INITIAL_OUTLETS,
    });
  }
};

export const getOutletBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    let outlet = await Outlet.findOne({ slug });

    if (!outlet) {
      const match = INITIAL_OUTLETS.find((o) => o.slug === slug);
      if (match) {
        res.status(200).json({ success: true, data: match });
        return;
      }
      return next(new AppError('Outlet branch not found', 404));
    }

    res.status(200).json({ success: true, data: outlet });
  } catch (error) {
    next(error);
  }
};
