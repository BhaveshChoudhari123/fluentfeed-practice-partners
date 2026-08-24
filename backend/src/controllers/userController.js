import { User } from '../models/User.js';

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listUsers(req, res, next) {
  try {
    const { englishLevel, learningGoal, country, search } = req.query;

    const query = {};

    if (englishLevel) {
      query.englishLevel = englishLevel;
    }

    if (learningGoal) {
      query.learningGoal = learningGoal;
    }

    if (country) {
      query.country = new RegExp(`^${escapeRegex(country)}$`, 'i');
    }

    if (search) {
      query.name = new RegExp(escapeRegex(search), 'i');
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ users });
  } catch (error) {
    next(error);
  }
}