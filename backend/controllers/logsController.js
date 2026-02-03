import Log from '../models/Log.js';

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

// Build query object for mongodb logs based on filters
function buildQuery({ action, startDate, endDate }) {
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

  if (!startDate && !endDate) {
    query.timestamp = {};
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    query.timestamp.$gte = todayStart; // Start of today
    query.timestamp.$lte = todayEnd; // End of today
  }

  return query;
}

// Get all logs
export async function getAllLogs(req, res) {
  const { action, startDate, endDate } = req.query;

  // Validate query parameters
  if (!isValidAction(action)) {
    return res.status(400).json({ message: 'Invalid action parameter' });
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  // Fetch logs
  try {
    const query = buildQuery({ action, startDate, endDate });

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