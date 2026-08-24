import { PRACTICE_TOPICS } from '../utils/constants.js';
import { Connection } from '../models/Connection.js';

export async function getMission(req, res, next) {
  try {
    const connections = await Connection.find({
      status: 'accepted',
      $or: [{ senderId: req.currentUser._id }, { receiverId: req.currentUser._id }]
    });

    if (!connections.length) {
      return res.status(404).json({ message: 'Connect with a practice partner to unlock a mission.' });
    }

    const topic = PRACTICE_TOPICS[Math.floor(Math.random() * PRACTICE_TOPICS.length)];
    res.json({
      topic,
      durationMinutes: 5,
      instructions: 'Discuss the topic with your practice partner and try to use at least three new vocabulary words.'
    });
  } catch (error) {
    next(error);
  }
}
