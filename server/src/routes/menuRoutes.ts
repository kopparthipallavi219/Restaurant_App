import { Router } from 'express';
import { getMenuItems, getMenuItemBySlug } from '../controllers/menuController';

const router = Router();

router.get('/', getMenuItems);
router.get('/:slug', getMenuItemBySlug);

export default router;
