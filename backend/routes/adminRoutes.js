const express = require('express');
const router = express.Router();
const {
  getUsers,
  toggleBlockUser,
  deleteUser,
  getLogs,
  getStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id/block').put(protect, admin, toggleBlockUser);
router.route('/users/:id').delete(protect, admin, deleteUser);

router.route('/logs').get(protect, admin, getLogs);
router.route('/stats').get(protect, admin, getStats);

module.exports = router;
