import { Router } from 'express';
import { getMatches } from '../controllers/matchController.js';
import { requireCurrentUser } from '../middleware/currentUser.js';

const router = Router();
router.get('/', requireCurrentUser, getMatches);
export default router;
