const axios = require('axios');
const Anomaly = require('../models/Anomaly');
const Log = require('../models/Log');
const fs = require('fs');
const csv = require('csv-parser');

const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001';

// @desc    Upload dataset and detect anomalies
// @route   POST /api/upload
// @access  Private
const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Remove file after reading
        fs.unlinkSync(req.file.path);

        try {
          // Send to ML service
          const response = await axios.post(`${mlServiceUrl}/predict`, {
            data: results
          });

          const mlResult = response.data.results;
          
          if (mlResult.error) {
            return res.status(400).json({ message: mlResult.error });
          }

          // Save anomaly record
          const anomaly = await Anomaly.create({
            userId: req.user._id,
            datasetName: req.file.originalname,
            totalPoints: mlResult.total_points,
            anomaliesDetected: mlResult.anomalies_detected,
            anomalyDataPoints: mlResult.anomaly_indices,
            algorithmUsed: 'Isolation Forest'
          });

          // Create Log
          await Log.create({
            userId: req.user._id,
            action: 'UPLOAD_DATASET',
            details: `Uploaded ${req.file.originalname} and detected ${mlResult.anomalies_detected} anomalies`
          });

          res.status(201).json({
            message: 'Dataset processed successfully',
            anomaly,
            results: mlResult
          });

        } catch (error) {
          console.error("ML Service Error:", error.message);
          res.status(500).json({ message: 'Error processing dataset with ML service' });
        }
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Detect anomaly for a single real-time data point (or small batch)
// @route   POST /api/anomaly/detect
// @access  Private
const detectLiveAnomaly = async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ message: 'Please provide data array' });
    }

    const response = await axios.post(`${mlServiceUrl}/predict`, { data });
    const mlResult = response.data.results;

    if (mlResult.error) {
      return res.status(400).json({ message: mlResult.error });
    }

    // Save record if anomalies found
    if (mlResult.anomalies_detected > 0) {
      const anomaly = await Anomaly.create({
        userId: req.user._id,
        datasetName: 'Live Data Stream',
        totalPoints: mlResult.total_points,
        anomaliesDetected: mlResult.anomalies_detected,
        anomalyDataPoints: mlResult.anomaly_indices,
        algorithmUsed: 'Isolation Forest'
      });

      await Log.create({
        userId: req.user._id,
        action: 'ANOMALY_DETECTED',
        details: `Live anomaly detected: ${mlResult.anomalies_detected} points`
      });

      return res.status(200).json({
        message: 'Anomaly detected in live data',
        anomaly,
        results: mlResult
      });
    }

    res.status(200).json({
      message: 'No anomalies detected',
      results: mlResult
    });

  } catch (error) {
    console.error("ML Service Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's anomaly history
// @route   GET /api/anomaly/history
// @access  Private
const getAnomalyHistory = async (req, res) => {
  try {
    const anomalies = await Anomaly.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(anomalies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  uploadDataset,
  detectLiveAnomaly,
  getAnomalyHistory
};
