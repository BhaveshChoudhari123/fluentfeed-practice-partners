import { Connection } from '../models/Connection.js';
import { MATCH_WEIGHTS } from '../utils/constants.js';

export function calculateMatchScore(currentUser, candidate) {
  let score = 0;
  if (currentUser.learningGoal === candidate.learningGoal) score += MATCH_WEIGHTS.learningGoal;
  if (currentUser.englishLevel === candidate.englishLevel) score += MATCH_WEIGHTS.englishLevel;
  if (currentUser.preferredTime === candidate.preferredTime) score += MATCH_WEIGHTS.preferredTime;
  if (currentUser.country.toLowerCase() === candidate.country.toLowerCase()) score += MATCH_WEIGHTS.country;
  if (currentUser.nativeLanguage.toLowerCase() === candidate.nativeLanguage.toLowerCase()) score += MATCH_WEIGHTS.nativeLanguage;
  return score;
}

export async function getExcludedUserIds(currentUserId) {
  const connections = await Connection.find({
    $or: [{ senderId: currentUserId }, { receiverId: currentUserId }]
  }).select('senderId receiverId status');

  const ids = new Set();
  for (const connection of connections) {
    const otherId = connection.senderId.toString() === currentUserId.toString()
      ? connection.receiverId.toString()
      : connection.senderId.toString();

    if (connection.status === 'pending' || connection.status === 'accepted') {
      ids.add(otherId);
    }
  }
  return [...ids];
}
