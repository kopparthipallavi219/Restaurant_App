import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [env.CORS_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Too many requests from this IP, please try again later.' },
  },
});
app.use('/api', limiter);

// Logging and Body parsing
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

import categoryRoutes from './routes/categoryRoutes';
import menuRoutes from './routes/menuRoutes';
import outletRoutes from './routes/outletRoutes';
import reservationRoutes from './routes/reservationRoutes';
import orderRoutes from './routes/orderRoutes';
import cateringRoutes from './routes/cateringRoutes';
import adminRoutes from './routes/adminRoutes';
import feedbackRoutes from './routes/feedbackRoutes';

// Base API Healthcheck route
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    brand: 'Mehfil Restaurant - Hyderabadi Culinary Institution',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/outlets', outletRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/catering', cateringRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

// Centralized error handling
app.use(errorHandler);

export default app;
