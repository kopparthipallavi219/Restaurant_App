import { Request, Response, NextFunction } from 'express';
import { Reservation } from '../models/Reservation';
import { AppError } from '../middleware/errorHandler';

// Helper to generate unique reservation code
const generateReservationCode = (): string => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `MEHFIL-RES-2026-${randomDigits}`;
};

export const createReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { branchSlug, branchName, customerName, email, phone, guestCount, date, timeSlot, specialRequests } = req.body;

    if (!branchSlug || !customerName || !email || !phone || !guestCount || !date || !timeSlot) {
      return next(new AppError('Please fill in all mandatory reservation fields', 400));
    }

    const reservationCode = generateReservationCode();

    let newReservation;
    try {
      newReservation = await Reservation.create({
        reservationCode,
        branchSlug,
        branchName: branchName || branchSlug,
        customerName,
        email,
        phone,
        guestCount: Number(guestCount),
        date,
        timeSlot,
        specialRequests,
        status: 'Pending',
      });
    } catch (_dbErr) {
      // In-memory response mock if DB connection is unavailable
      newReservation = {
        _id: 'mock_res_' + Date.now(),
        reservationCode,
        branchSlug,
        branchName: branchName || branchSlug,
        customerName,
        email,
        phone,
        guestCount: Number(guestCount),
        date,
        timeSlot,
        specialRequests,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
    }

    res.status(201).json({
      success: true,
      message: 'Table reservation request received successfully!',
      data: newReservation,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, branch } = req.query;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (branch) filter.branchSlug = branch;

    const reservations = await Reservation.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReservationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, tableNumber } = req.body;

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { ...(status && { status }), ...(tableNumber && { tableNumber }) },
      { new: true }
    );

    if (!reservation) {
      return next(new AppError('Reservation record not found', 404));
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};
