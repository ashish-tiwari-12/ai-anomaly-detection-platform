const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { uploadDataset } = require('../controllers/anomalyController');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists (Removed for Vercel/Serverless compatibility)
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)){
//     fs.mkdirSync(uploadDir);
// }

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /csv|json/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Dataset only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', protect, upload.single('dataset'), uploadDataset);

module.exports = router;
