import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    englishLevel: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    learningGoal: {
      type: String,
      required: true,
      enum: ['IELTS', 'TOEFL', 'Job Interview', 'Daily Communication', 'Business English']
    },
    nativeLanguage: { type: String, required: true, trim: true, maxlength: 60 },
    country: { type: String, required: true, trim: true, maxlength: 60 },
    preferredTime: {
      type: String,
      required: true,
      enum: ['Morning', 'Afternoon', 'Evening', 'Night']
    },
    bio: { type: String, required: true, trim: true, maxlength: 280 }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
