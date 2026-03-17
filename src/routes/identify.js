const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const fishNames = [
  'Salmon',
  'Tuna',
  'Trout',
  'Snapper',
  'Cod',
  'Mackerel',
  'Sardine',
];

router.post('/identify', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'image file is required (form-data key: image)' });
  }

  const randomFish = fishNames[Math.floor(Math.random() * fishNames.length)];

  return res.json({
    fish_name: randomFish,
    confidence: `${Math.floor(Math.random() * 20) + 80}%`,
    note: 'Mock response (no AI model used)',
  });
});

module.exports = router;
