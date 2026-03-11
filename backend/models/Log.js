const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String, // e.g., 'LOGIN', 'REGISTER', 'UPLOAD_DATASET', 'ANOMALY_DETECTED', 'USER_BLOCKED'
    required: true,
  },
  details: {
    type: String,
  }
}, {
  timestamps: true,
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
