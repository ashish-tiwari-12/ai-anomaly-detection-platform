const express = require('express');
const router = express.Router();
const {
  detectLiveAnomaly,
  getAnomalyHistory
} = require('../controllers/anomalyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/detect').post(protect, detectLiveAnomaly);
router.route('/history').get(protect, getAnomalyHistory);

module.exports = router;
