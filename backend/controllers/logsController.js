import Log from '../models/Log.js';

export async function getAllLogs(req, res) {
  try {
    // Fetch all logs and populate user details
    const logs = await Log.find().populate('userId', 'username firstname lastname');
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

export async function createLog(req, res) {
  try {
    const newLog = new Log(req.body);
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}