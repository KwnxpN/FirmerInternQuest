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

export async function getAllLogs(req, res) {
  const { action } = req.query;
  
  // Validate action query parameter
  if (!isValidAction(action)) {
    return res.status(400).json({ message: 'Invalid action parameter' });
  }

  try {
    // Fetch all logs and populate user details
    const logs = await Log.find(action ? { action } : {}).populate('userId', '_id prefix firstname lastname').lean();

    const result = logs.map(({userId, ...rest}) => ({
      ...rest,
      user: userId,
    }));

    res.status(200).json(result);
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