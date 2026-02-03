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

export default mongoose.model('Log', logSchema);