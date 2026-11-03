import { Router } from 'express';
import { getOutlets, getOutletBySlug } from '../controllers/outletController';

const router = Router();

router.get('/', getOutlets);
router.get('/:slug', getOutletBySlug);

export default router;
