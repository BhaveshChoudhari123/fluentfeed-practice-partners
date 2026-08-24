import { Router } from 'express';
import { getMission } from '../controllers/missionController.js';
import { requireCurrentUser } from '../middleware/currentUser.js';

const router = Router();
router.get('/', requireCurrentUser, getMission);
export default router;
