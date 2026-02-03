import User from '../models/User.js';

export async function getAllUsers(_, res) {
  try {
    const users = await User.find({ isDel: false }).lean();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}