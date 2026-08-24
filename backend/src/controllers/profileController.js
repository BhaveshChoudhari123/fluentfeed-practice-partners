import { User } from '../models/User.js';

export async function getProfile(req, res, next) {
  try {
    res.json({ user: req.currentUser });
  } catch (error) {
    next(error);
  }
}

export async function createProfile(req, res, next) {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.currentUser._id, req.body, {
      new: true,
      runValidators: true
    });
    res.json({ user });
  } catch (error) {
    next(error);
  }
}
