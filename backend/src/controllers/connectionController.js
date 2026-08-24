import mongoose from 'mongoose';
import { Connection } from '../models/Connection.js';
import { User } from '../models/User.js';

export async function createConnection(req, res, next) {
  try {
    const { receiverId } = req.body;
    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: 'A valid receiverId is required.' });
    }
    if (receiverId === req.currentUser._id.toString()) {
      return res.status(400).json({ message: 'You cannot connect with yourself.' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: 'Receiver not found.' });

    const existing = await Connection.findOne({
      $or: [
        { senderId: req.currentUser._id, receiverId },
        { senderId: receiverId, receiverId: req.currentUser._id }
      ]
    });

    if (existing) {
      return res.status(409).json({ message: `Connection already exists with status: ${existing.status}.` });
    }

    const connection = await Connection.create({ senderId: req.currentUser._id, receiverId });
    const populated = await connection.populate([
      { path: 'senderId', select: 'name englishLevel learningGoal country nativeLanguage preferredTime bio' },
      { path: 'receiverId', select: 'name englishLevel learningGoal country nativeLanguage preferredTime bio' }
    ]);

    res.status(201).json({ connection: populated });
  } catch (error) {
    next(error);
  }
}

export async function listConnections(req, res, next) {
  try {
    const connections = await Connection.find({
      $or: [{ senderId: req.currentUser._id }, { receiverId: req.currentUser._id }]
    })
      .populate('senderId', 'name englishLevel learningGoal country nativeLanguage preferredTime bio')
      .populate('receiverId', 'name englishLevel learningGoal country nativeLanguage preferredTime bio')
      .sort({ updatedAt: -1 });

    res.json({ connections });
  } catch (error) {
    next(error);
  }
}

export async function updateConnection(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected.' });
    }

    const connection = await Connection.findById(id);
    if (!connection) return res.status(404).json({ message: 'Connection not found.' });

    if (connection.receiverId.toString() !== req.currentUser._id.toString()) {
      return res.status(403).json({ message: 'Only the receiver can accept or reject this request.' });
    }

    if (connection.status !== 'pending') {
      return res.status(409).json({ message: 'Only pending requests can be updated.' });
    }

    connection.status = status;
    await connection.save();
    const populated = await connection.populate([
      { path: 'senderId', select: 'name englishLevel learningGoal country nativeLanguage preferredTime bio' },
      { path: 'receiverId', select: 'name englishLevel learningGoal country nativeLanguage preferredTime bio' }
    ]);

    res.json({ connection: populated });
  } catch (error) {
    next(error);
  }
}
