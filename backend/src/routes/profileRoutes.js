import { Router } from 'express';
import { createProfile, getProfile, updateProfile } from '../controllers/profileController.js';
import { requireCurrentUser } from '../middleware/currentUser.js';

const router = Router();
router.post('/', createProfile);
router.get('/', requireCurrentUser, getProfile);
router.put('/', requireCurrentUser, updateProfile);
export default router;
