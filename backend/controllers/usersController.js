import User from '../models/User.js';

export async function getAllUsers(_, res) {
  try {
    const users = await User.find({ isDel: false }).select('-password').lean();
    res.status(200).json(
      { success: true, count: users.length, data: users }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
}