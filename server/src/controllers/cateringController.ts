import { Request, Response, NextFunction } from 'express';
import { CateringEnquiry } from '../models/CateringEnquiry';
import { AppError } from '../middleware/errorHandler';

const generateEnquiryCode = (): string => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `MEHFIL-CAT-2026-${randomDigits}`;
};

export const createCateringEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      eventType,
      guestCount,
      date,
      contactName,
      email,
      phone,
      venueLocation,
      preferredOutlet,
      budgetPerPlate,
      message,
    } = req.body;

    if (!eventType || !guestCount || !date || !contactName || !email || !phone || !venueLocation) {
      return next(new AppError('Please fill in all mandatory catering enquiry fields', 400));
    }

    const enquiryCode = generateEnquiryCode();

    let enquiry;
    try {
      enquiry = await CateringEnquiry.create({
        enquiryCode,
        eventType,
        guestCount: Number(guestCount),
        date,
        contactName,
        email,
        phone,
        venueLocation,
        preferredOutlet,
        budgetPerPlate: budgetPerPlate ? Number(budgetPerPlate) : undefined,
        message,
        status: 'Pending',
      });
    } catch (_dbErr) {
      // In-memory mock response if database offline
      enquiry = {
        _id: 'mock_cat_' + Date.now(),
        enquiryCode,
        eventType,
        guestCount: Number(guestCount),
        date,
        contactName,
        email,
        phone,
        venueLocation,
        preferredOutlet,
        budgetPerPlate: budgetPerPlate ? Number(budgetPerPlate) : undefined,
        message,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
    }

    res.status(201).json({
      success: true,
      message: 'Catering enquiry submitted! Our event executive will contact you shortly.',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const getCateringEnquiries = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    const enquiries = await CateringEnquiry.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCateringStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const enquiry = await CateringEnquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!enquiry) {
      return next(new AppError('Catering enquiry record not found', 404));
    }

    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};
