import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username })
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive || user.isDel) {
      return res.status(403).json({ message: 'User is inactive or deleted' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
        { userId: user._id, username: user.username, level: user.level },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
        success: true,
        message: 'Login successful',
        user: { ...user.toObject(), password: undefined }
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function logout(req, res) {
  res.clearCookie('token'), {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  };
  res.json({ success: true, message: 'Logout successful' });
}

export async function me(req, res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized: No user data found' });
        }

        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}