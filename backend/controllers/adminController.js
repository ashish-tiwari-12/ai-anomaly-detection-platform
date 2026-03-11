const User = require('../models/User');
const Log = require('../models/Log');
const Anomaly = require('../models/Anomaly');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block or Unblock a user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot block an admin user' });
      }

      user.isBlocked = !user.isBlocked;
      await user.save();

      await Log.create({
        adminId: req.user._id,
        userId: user._id,
        action: user.isBlocked ? 'USER_BLOCKED' : 'USER_UNBLOCKED',
        details: `Admin ${req.user.name} ${user.isBlocked ? 'blocked' : 'unblocked'} user ${user.name}`
      });

      res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
         return res.status(400).json({ message: 'Cannot delete an admin user' });
      }

      await User.deleteOne({ _id: user._id });
      // optionally delete logs and anomalies linked to user here, or keep for records

      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({}).populate('userId', 'name email').populate('adminId', 'name email').sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get overall stats (total users, anomalies, datasets)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAnomalies = await Anomaly.countDocuments({});
    const totalLogs = await Log.countDocuments({});
    const anomalyRecords = await Anomaly.aggregate([
      { $group: { _id: null, totalPointsAnalysed: { $sum: "$totalPoints" }, totalAnomaliesDetected: { $sum: "$anomaliesDetected" } } }
    ]);

    res.json({
      totalUsers,
      totalAnomalyFiles: totalAnomalies,
      totalLogs,
      anomalyStats: anomalyRecords.length > 0 ? anomalyRecords[0] : { totalPointsAnalysed: 0, totalAnomaliesDetected: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  toggleBlockUser,
  deleteUser,
  getLogs,
  getStats
};
