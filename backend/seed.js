import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './src/config/db.js';
import { User } from './src/models/User.js';
import { Connection } from './src/models/Connection.js';

const users = [
  {
    name: 'Bhavesh Choudhari',
    englishLevel: 'Intermediate',
    learningGoal: 'IELTS',
    nativeLanguage: 'Marathi',
    country: 'India',
    preferredTime: 'Evening',
    bio: 'Preparing for interviews and improving fluency through practical conversations.'
  },
  {
    name: 'Rahul Sharma',
    englishLevel: 'Intermediate',
    learningGoal: 'IELTS',
    nativeLanguage: 'Hindi',
    country: 'India',
    preferredTime: 'Evening',
    bio: 'IELTS candidate who enjoys structured discussion and vocabulary practice.'
  },
  {
    name: 'Priya Patil',
    englishLevel: 'Intermediate',
    learningGoal: 'IELTS',
    nativeLanguage: 'Marathi',
    country: 'India',
    preferredTime: 'Evening',
    bio: 'Working on speaking confidence and everyday English fluency.'
  },
  {
    name: 'Aarav Mehta',
    englishLevel: 'Advanced',
    learningGoal: 'Job Interview',
    nativeLanguage: 'Hindi',
    country: 'India',
    preferredTime: 'Evening',
    bio: 'Software professional interested in mock interviews and professional English.'
  },
  {
    name: 'Sneha Kulkarni',
    englishLevel: 'Intermediate',
    learningGoal: 'Daily Communication',
    nativeLanguage: 'Marathi',
    country: 'India',
    preferredTime: 'Morning',
    bio: 'Focused on speaking naturally in day-to-day situations.'
  },
  {
    name: 'Emily Carter',
    englishLevel: 'Advanced',
    learningGoal: 'TOEFL',
    nativeLanguage: 'English',
    country: 'United States',
    preferredTime: 'Night',
    bio: 'Interested in language exchange and helping learners practice conversation.'
  },
  {
    name: 'Daniel Kim',
    englishLevel: 'Beginner',
    learningGoal: 'Business English',
    nativeLanguage: 'Korean',
    country: 'South Korea',
    preferredTime: 'Morning',
    bio: 'Building confidence for meetings and business conversations.'
  },
  {
    name: 'Ananya Deshmukh',
    englishLevel: 'Intermediate',
    learningGoal: 'Job Interview',
    nativeLanguage: 'Marathi',
    country: 'India',
    preferredTime: 'Evening',
    bio: 'Practicing HR questions, self-introductions, and professional vocabulary.'
  }
];

try {
  await connectDB();
  await Connection.deleteMany({});
  await User.deleteMany({});
  const created = await User.insertMany(users);
  console.log(`Seeded ${created.length} users.`);
  console.log('Demo user IDs:');
  for (const user of created) console.log(`${user.name}: ${user._id}`);
} finally {
  await mongoose.connection.close();
}
