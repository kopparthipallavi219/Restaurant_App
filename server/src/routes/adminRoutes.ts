import { Router } from 'express';
import { adminLogin, getDashboardStats, getAuditLogs } from '../controllers/authController';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController';
import { getReservations, updateReservationStatus } from '../controllers/reservationController';
import { getOrders, updateOrderStatus } from '../controllers/orderController';
import { getCateringEnquiries, updateCateringStatus } from '../controllers/cateringController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Admin Authentication Public Route
router.post('/auth/login', adminLogin);

// Protected Admin Routes (require valid JWT token)
router.use(authenticateToken);

// Dashboard & Security
router.get('/dashboard/stats', getDashboardStats);
router.get('/audit-logs', getAuditLogs);

// Menu CRUD
router.get('/menu', getMenuItems);
router.post('/menu', createMenuItem);
router.patch('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Reservations Manager
router.get('/reservations', getReservations);
router.patch('/reservations/:id', updateReservationStatus);

// Orders Manager
router.get('/orders', getOrders);
router.patch('/orders/:id', updateOrderStatus);

// Catering Lead Manager
router.get('/catering', getCateringEnquiries);
router.patch('/catering/:id', updateCateringStatus);

export default router;
