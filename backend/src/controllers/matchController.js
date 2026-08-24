import { User } from '../models/User.js';
import { calculateMatchScore, getExcludedUserIds } from '../services/matchingService.js';

export async function getMatches(req, res, next) {
  try {
    const { englishLevel, learningGoal, country } = req.query;
    const excludedIds = await getExcludedUserIds(req.currentUser._id);
    const query = { _id: { $ne: req.currentUser._id, $nin: excludedIds } };

    if (englishLevel) query.englishLevel = englishLevel;
    if (learningGoal) query.learningGoal = learningGoal;
    if (country) query.country = new RegExp(`^${String(country).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');

    const users = await User.find(query);
    const matches = users
      .map((candidate) => ({
        user: candidate,
        score: calculateMatchScore(req.currentUser, candidate)
      }))
      .sort((a, b) => b.score - a.score || a.user.name.localeCompare(b.user.name))
      .slice(0, 5);

    res.json({ matches });
  } catch (error) {
    next(error);
  }
}
