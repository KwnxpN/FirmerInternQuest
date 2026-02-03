import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    labnumber: [{
        type: String
    }],
    timestamp: {
        type: Date,
        required: true,
    },
    request: {
        method: String,
        endpoint: String
    },
    response: {
        statusCode: String,
        message: String,
        timeMs: Number
    },
    action: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Indexes for efficient querying
logSchema.index({ labnumber: 1 });
logSchema.index({ timestamp: 1 });
logSchema.index({ action: 1 });
logSchema.index({ 'response.statusCode': 1 });
logSchema.index({ 'response.timeMs': 1 });
logSchema.index({ userId: 1 });

export default mongoose.model('Log', logSchema);