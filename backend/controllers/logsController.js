import Log from '../models/Log.js';
import mongoose from 'mongoose';

const VALID_ACTIONS = [
  'labOrder',
  'labResult',
  'receive',
  'accept',
  'approve',
  'reapprove',
  'unapprove',
  'unreceive',
  'rerun',
  'save',
  'listTransactions',
  'getTransaction',
  'analyzerResult',
  'analyzerRequest',
];

function isValidAction(action) {
  return !action || VALID_ACTIONS.includes(action);
}

function isValidDate(dateString) {
  if (!dateString) return true;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// Validate for mongoose ObjectId
function isValidObjectId(id) {
  if (!id) return true;
  return mongoose.Types.ObjectId.isValid(id);
}

function isValidResponseTime(value) {
  if (!value) return true;
  if (isNaN(value)) return false; // Not a number
  return Number(value) >= 0; // Non-negative
}

// Build query object for mongodb logs based on filters
function buildQuery({ action, startDate, endDate, userId, statusCode, minResponseTime, maxResponseTime, labNumber }) {
  const query = {};

  // Action filtering
  if (action) {
    query.action = action;
  }

  // Timestamp filtering
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  } 
  else {
    // Default to today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    query.timestamp = {
      $gte: todayStart,
      $lte: todayEnd,
    };
  }

  if (userId) {
    query.userId = userId;
  }

  if (statusCode) {
    query['response.statusCode'] = String(statusCode);
  }

  // Response time filtering
  if (minResponseTime || maxResponseTime) {
    query['response.timeMs'] = {};
    if (minResponseTime) query['response.timeMs'].$gte = Number(minResponseTime);
    if (maxResponseTime) query['response.timeMs'].$lte = Number(maxResponseTime);
  }
  else {
    query['response.timeMs'] = {};
    query['response.timeMs'].$gte = 0;
    query['response.timeMs'].$lte = 999999;
  }

  if (labNumber) {
    // Case-insensitive partial match for any labnumber in the array
    query.labnumber = { $regex: labNumber, $options: 'i' };
  }

  return query;
}

// Get all logs
export async function getAllLogs(req, res) {
  const { action, startDate, endDate, userId, statusCode, minResponseTime, maxResponseTime, labNumber } = req.query;

  // Validate query parameters
  if (!isValidAction(action)) {
    return res.status(400).json({ message: 'Invalid action parameter' });
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }

  if (!isValidResponseTime(minResponseTime) || !isValidResponseTime(maxResponseTime)) {
    return res.status(400).json({ message: 'Invalid response time value' });
  }

  // Fetch logs
  try {
    const query = buildQuery({ action, startDate, endDate, userId, statusCode, minResponseTime, maxResponseTime, labNumber });

    console.log('Query:', JSON.stringify(query, null, 2)); // Add this

    // Fetch all logs and populate user details
    const logs = await Log.find(query).populate('userId', '_id prefix firstname lastname').lean();

    const result = logs.map(({userId, ...rest}) => ({
      ...rest,
      user: userId,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}