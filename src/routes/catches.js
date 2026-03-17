const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');
const { readJson, writeJson } = require('../services/storage');

const router = express.Router();

router.post('/catches', authMiddleware, async (req, res) => {
  const {
    image_url,
    fish_type,
    date,
    location,
    size,
    weather,
    note,
    privacy_level,
  } = req.body;

  if (!fish_type || !date || !location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return res.status(400).json({
      message: 'fish_type, date, and location {lat,lng} are required',
    });
  }

  const catches = await readJson('catches.json');

  const newCatch = {
    id: uuidv4(),
    user_id: req.user.userId,
    image_url: image_url || '',
    fish_type,
    date,
    location,
    size: size || '',
    weather: weather || '',
    note: note || '',
    privacy_level: privacy_level || 'private',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  catches.push(newCatch);
  await writeJson('catches.json', catches);

  return res.status(201).json(newCatch);
});

router.get('/catches', authMiddleware, async (req, res) => {
  const catches = await readJson('catches.json');
  const userCatches = catches.filter((item) => item.user_id === req.user.userId);
  return res.json(userCatches);
});

router.put('/catches/:id', authMiddleware, async (req, res) => {
  const catches = await readJson('catches.json');
  const catchIndex = catches.findIndex(
    (item) => item.id === req.params.id && item.user_id === req.user.userId,
  );

  if (catchIndex === -1) {
    return res.status(404).json({ message: 'Catch not found' });
  }

  const allowedFields = [
    'image_url',
    'fish_type',
    'date',
    'location',
    'size',
    'weather',
    'note',
    'privacy_level',
  ];

  const currentCatch = catches[catchIndex];
  const updates = req.body;

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      currentCatch[field] = updates[field];
    }
  });

  currentCatch.updatedAt = new Date().toISOString();
  catches[catchIndex] = currentCatch;

  await writeJson('catches.json', catches);

  return res.json(currentCatch);
});

module.exports = router;
