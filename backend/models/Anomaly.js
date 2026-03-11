const mongoose = require('mongoose');

const anomalySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  datasetName: {
    type: String,
    required: true,
  },
  totalPoints: {
    type: Number,
    required: true,
  },
  anomaliesDetected: {
    type: Number,
    required: true,
  },
  anomalyDataPoints: {
    type: Array, // Array of indices or data objects that were marked as anomalous
    required: true,
  },
  algorithmUsed: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const Anomaly = mongoose.model('Anomaly', anomalySchema);

module.exports = Anomaly;
