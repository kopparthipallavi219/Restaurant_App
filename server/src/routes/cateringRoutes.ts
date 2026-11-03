import { Router } from 'express';
import { createCateringEnquiry } from '../controllers/cateringController';

const router = Router();

router.post('/', createCateringEnquiry);

export default router;
