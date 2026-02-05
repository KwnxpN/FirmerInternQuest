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

  pagination(page, limit) {
    if (!page && !limit) return true;
    const p = Number(page);
    const l = Number(limit);
    return (
      (!page || (Number.isInteger(p) && p > 0)) &&
      (!limit || (Number.isInteger(l) && l > 0))
    );
  },

  sort(sortBy, sortOrder) {
    if (!sortBy && !sortOrder) return true;
    const validFields = ['timestamp', 'action', 'timeMs'];
    const validOrders = ['asc', 'desc'];

    if (sortBy && !validFields.includes(sortBy)) return false;
    if (sortOrder && !validOrders.includes(sortOrder)) return false;
    return true;
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

function buildPagination(page, limit) {
  const p = page ? Number(page) : 1;
  const l = limit ? Number(limit) : 50;
  const skip = (p - 1) * l;
  return { page: p, limit: l, skip };
}

function buildSort(sortBy, sortOrder) {
  if (sortBy) {
    const order = sortOrder === 'desc' ? -1 : 1;
    if (sortBy === 'timeMs') {
      return { 'response.timeMs': order };
    }
    if (sortBy === 'action') {
      return { actionSortIndex: order };
    }
    return { [sortBy]: order };
  }
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
    page,
    limit,
    sortBy,
    sortOrder,
  } = filters;

  const query = {
    timestamp: buildTimestampQuery(startDate, endDate),
  };

  const pagination = buildPagination(page, limit);

  const sort = buildSort(sortBy, sortOrder);

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

  return { query, pagination, sort };
}

// ------ Validate Request Query ------

function validateQueryParams(query) {
  const { action, startDate, endDate, userId, minResponseTime, maxResponseTime, page, limit, sortBy, sortOrder } =
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

  if (!validators.pagination(page, limit)) {
    return 'Invalid pagination parameters';
  }

  if (!validators.sort(sortBy, sortOrder)) {
    return 'Invalid sorting parameters';
  }

  return null;
}

// ------ Controllers ------

export async function getAllLogs(req, res) {
  const validationError = validateQueryParams(req.query);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const { query, pagination, sort } = buildQuery(req.query);
    console.log('Log Query:', query);
    console.log('Pagination:', pagination);
    console.log('Sort:', sort);

    const pipeline = [
      { $match: query },
      {
        $addFields: {
          actionSortIndex: { $indexOfArray: [VALID_ACTIONS, '$action'] },
        },
      },
      ...(sort ? [{ $sort: sort }] : []),
      { $skip: pagination.skip },
      { $limit: pagination.limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
          pipeline: [{ $project: { _id: 1, prefix: 1, firstname: 1, lastname: 1 } }],
        }, // Populate user details
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: { actionSortIndex: 0 } }, // Remove the temporary sort field
    ];

    const logs = await Log.aggregate(pipeline);

    return res.status(200).json(logs);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: error.message });
  }
}