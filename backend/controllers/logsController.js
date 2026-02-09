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
  if (sortBy && sortBy !== '') {
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

function buildQuery(filters, user) {
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

  if (user && user.level === 'user') {
    query.userId = new mongoose.Types.ObjectId(user.userId);
  } else if (userId) {
    query.userId = buildSingleOrInQuery(userId, (id) => new mongoose.Types.ObjectId(id));
  }

  if (statusCode) {
    query['response.statusCode'] = buildSingleOrInQuery(statusCode);
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

// ------ Helper Functions ------

async function fetchLogsData(queryParams, currentUser, isExport = false) {
  const validationError = validateQueryParams(queryParams);
  if (validationError) throw new Error(validationError);

  const { query, pagination, sort } = buildQuery(queryParams, currentUser);

  // Define the data pipeline stages
  const dataStages = [
    {
      $addFields: {
        actionSortIndex: { $indexOfArray: [VALID_ACTIONS, "$action"] },
      },
    },
  ];

  if (sort) dataStages.push({ $sort: sort });

  // Apply pagination only if not exporting
  if (!isExport) {
    dataStages.push({ $skip: pagination.skip });
    dataStages.push({ $limit: pagination.limit });
  }

  dataStages.push({ $project: { actionSortIndex: 0, userId: 0, "user.password": 0 } });

  const pipeline = [
    { $match: query },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: false } },
    { $match: { "user.isDel": false } },
    {
      $facet: {
        data: dataStages, // Use the dynamically built stages
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await Log.aggregate(pipeline);
  return {
    logs: result[0].data,
    totalCount: result[0].totalCount[0]?.count ?? 0,
    paginationConfig: pagination,
  };
}

// ------ Controllers ------

export async function getAllLogs(req, res) {
  try {
    const { logs, totalCount, paginationConfig } = await fetchLogsData(req.query, req.user);

    return res.status(200).json({
      success: true,
      count: logs.length,
      totalCount,
      data: logs,
      pagination: {
        page: paginationConfig.page,
        limit: paginationConfig.limit,
        totalPages: totalCount ? Math.ceil(totalCount / paginationConfig.limit) : 1,
        hasNext: paginationConfig.page * paginationConfig.limit < totalCount,
        hasPrev: paginationConfig.page > 1,
      },
    });
  } catch (error) {
    const status = error.message.includes('Invalid') ? 400 : 500;
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export async function generate(req, res) {
  try {
    const { logs, totalCount } = await fetchLogsData(req.query, req.user, true);
    res.json({ success: true, totalCount, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}