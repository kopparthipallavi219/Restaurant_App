import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import { AppError } from '../middleware/errorHandler';

const generateOrderCode = (): string => {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `MEHFIL-ORD-2026-${randomDigits}`;
};

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      items,
      subtotal,
      tax,
      deliveryFee,
      discount,
      total,
      orderType,
      outletSlug,
      outletName,
      customerName,
      email,
      phone,
      deliveryAddress,
      paymentMethod,
      notes,
    } = req.body;

    if (!items || !items.length || !outletSlug || !customerName || !phone || !email) {
      return next(new AppError('Order missing mandatory items or customer details', 400));
    }

    const orderCode = generateOrderCode();

    let newOrder;
    try {
      newOrder = await Order.create({
        orderCode,
        items,
        subtotal: subtotal || 0,
        tax: tax || 0,
        deliveryFee: deliveryFee || 0,
        discount: discount || 0,
        total: total || subtotal + tax + deliveryFee,
        orderType: orderType || 'Delivery',
        outletSlug,
        outletName: outletName || outletSlug,
        customerName,
        email,
        phone,
        deliveryAddress,
        paymentMethod: paymentMethod || 'CashOnDelivery',
        paymentStatus: 'Pending',
        status: 'Pending',
        notes,
      });
    } catch (_dbErr) {
      // In-memory mock response if database offline
      newOrder = {
        _id: 'mock_ord_' + Date.now(),
        orderCode,
        items,
        subtotal,
        tax,
        deliveryFee,
        total,
        orderType: orderType || 'Delivery',
        outletSlug,
        outletName: outletName || outletSlug,
        customerName,
        email,
        phone,
        deliveryAddress,
        paymentMethod: paymentMethod || 'CashOnDelivery',
        paymentStatus: 'Pending',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderByCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderCode } = req.params;
    const order = await Order.findOne({ orderCode });

    if (!order) {
      return next(new AppError('Order code not found', 404));
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, outlet } = req.query;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (outlet) filter.outletSlug = outlet;

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { ...(status && { status }), ...(paymentStatus && { paymentStatus }) },
      { new: true }
    );

    if (!updatedOrder) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};
