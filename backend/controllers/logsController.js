import Log from '../models/Log.js';
import mongoose from 'mongoose';

// ------ Constants ------

const VALID_ACTIONS = Object.freeze([
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
]);

// ------ Validators ------

const validators = {
  action(action) {
    if (!action) return true;
    const actions = Array.isArray(action) ? action : [action];
    return actions.every((a) => VALID_ACTIONS.includes(a));
  },

  date(dateString) {
    if (!dateString) return true;
    return !isNaN(new Date(dateString).getTime());
  },

  objectId(id) {
    if (!id) return true;
    const ids = Array.isArray(id) ? id : [id];
    return ids.every((i) => mongoose.Types.ObjectId.isValid(i));
  },

  responseTime(value) {
    if (!value) return true;
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  },
};

// Build query object for mongodb logs based on filters
function buildQuery({ action, startDate, endDate, userId, statusCode, minResponseTime, maxResponseTime, labNumber }) {
  const query = {};

  // Action filtering
  if (action) {
    const actions = Array.isArray(action) ? action : [action];
    query.action = actions.length === 1 ? actions[0] : { $in: actions };
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

  // Handle single or multiple userIds
  if (userId) {
    const userIds = Array.isArray(userId) ? userId : [userId];
    query.userId = userIds.length === 1 ? userIds[0] : { $in: userIds };
  }

  if (statusCode) {
    const statusCodes = Array.isArray(statusCode) ? statusCode : [statusCode];
    query['response.statusCode'] = statusCodes.length === 1 ? Number(statusCodes[0]) : { $in: statusCodes.map(Number) };
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

  // Handle single or multiple labNumbers (case-insensitive partial match)
  if (labNumber) {
    const labNumbers = Array.isArray(labNumber) ? labNumber : [labNumber];
    if (labNumbers.length === 1) {
      query.labnumber = { $regex: labNumbers[0], $options: 'i' };
    } else {
      query.$or = labNumbers.map((ln) => ({
        labnumber: { $regex: ln, $options: 'i' },
      }));
    }
  }

  return query;
}

// ------ Validate Request Query ------

function validateQueryParams(query) {
  const { action, startDate, endDate, userId, minResponseTime, maxResponseTime } =
    query;

  if (!validators.action(action)) {
    return 'Invalid action parameter';
  }

  if (!validators.date(startDate) || !validators.date(endDate)) {
    return 'Invalid date format';
  }

  if (!validators.objectId(userId)) {
    return 'Invalid userId format';
  }

  if (
    !validators.responseTime(minResponseTime) ||
    !validators.responseTime(maxResponseTime)
  ) {
    return 'Invalid response time value';
  }

  return null;
}

// Get all logs
export async function getAllLogs(req, res) {
  const validationError = validateQueryParams(req.query);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  // Fetch logs
  try {
    const query = buildQuery(req.query);

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