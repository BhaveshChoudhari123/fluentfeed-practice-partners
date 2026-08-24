import mongoose from 'mongoose';
import { User } from '../models/User.js';

export async function requireCurrentUser(req, res, next) {
  try {
    const userId = req.header('X-User-Id');
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'X-User-Id header is required.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Current user not found.' });

    req.currentUser = user;
    next();
  } catch (error) {
    next(error);
  }
}
