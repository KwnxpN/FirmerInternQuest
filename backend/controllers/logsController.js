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

// ------ Query Builders ------

function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

function buildSingleOrInQuery(value, transform = (v) => v) {
  const values = toArray(value).map(transform);
  return values.length === 1 ? values[0] : { $in: values };
}

function buildTimestampQuery(startDate, endDate) {
  if (startDate || endDate) {
    const query = {};
    if (startDate) query.$gte = new Date(startDate);
    if (endDate) query.$lte = new Date(endDate);
    return query;
  }

  // Default to today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return { $gte: todayStart, $lte: todayEnd };
}

function buildRangeQuery(min, max) {
  const query = {};
  query.$gte = Number(min || 0);
  query.$lte = Number(max || 999999);
  return query;
}

function buildLabNumberQuery(labNumber) {
  const labNumbers = toArray(labNumber);

  if (labNumbers.length === 1) {
    return { labnumber: { $regex: labNumbers[0], $options: 'i' } };
  }

  return {
    $or: labNumbers.map((ln) => ({
      labnumber: { $regex: ln, $options: 'i' },
    })),
  };
}

function buildQuery(filters) {
  const {
    action,
    startDate,
    endDate,
    userId,
    statusCode,
    minResponseTime,
    maxResponseTime,
    labNumber,
  } = filters;

  const query = {
    timestamp: buildTimestampQuery(startDate, endDate),
  };

  if (action) {
    query.action = buildSingleOrInQuery(action);
  }

  if (userId) {
    query.userId = buildSingleOrInQuery(userId);
  }

  if (statusCode) {
    query['response.statusCode'] = buildSingleOrInQuery(statusCode, Number);
  }

  const responseTimeQuery = buildRangeQuery(minResponseTime, maxResponseTime);
  if (responseTimeQuery !== null) {
    query['response.timeMs'] = responseTimeQuery;
  }

  if (labNumber) {
    Object.assign(query, buildLabNumberQuery(labNumber));
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

// ------ Transform Logs Response ------

function transformLogResponse(log) {
  const { userId, ...rest } = log;
  return { ...rest, user: userId };
}

// ------ Controllers ------

export async function getAllLogs(req, res) {
  const validationError = validateQueryParams(req.query);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const query = buildQuery(req.query);
    console.log('Log Query:', query);

    const logs = await Log.find(query)
      .populate('userId', '_id prefix firstname lastname')
      .lean();

    const result = logs.map(transformLogResponse);

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
}