import { Router } from 'express';
import { createConnection, listConnections, updateConnection } from '../controllers/connectionController.js';
import { requireCurrentUser } from '../middleware/currentUser.js';

const router = Router();
router.post('/', requireCurrentUser, createConnection);
router.get('/', requireCurrentUser, listConnections);
router.put('/:id', requireCurrentUser, updateConnection);
export default router;
