export type EnglishLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type LearningGoal = 'IELTS' | 'TOEFL' | 'Job Interview' | 'Daily Communication' | 'Business English';
export type PreferredTime = 'Morning' | 'Afternoon' | 'Evening' | 'Night';
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';

export interface User {
  _id: string;
  name: string;
  englishLevel: EnglishLevel;
  learningGoal: LearningGoal;
  nativeLanguage: string;
  country: string;
  preferredTime: PreferredTime;
  bio: string;
}

export interface Match {
  user: User;
  score: number;
}

export interface Connection {
  _id: string;
  senderId: User;
  receiverId: User;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Mission {
  topic: string;
  durationMinutes: number;
  instructions: string;
}

export interface ProfileForm {
  name: string;
  englishLevel: EnglishLevel;
  learningGoal: LearningGoal;
  nativeLanguage: string;
  country: string;
  preferredTime: PreferredTime;
  bio: string;
}
