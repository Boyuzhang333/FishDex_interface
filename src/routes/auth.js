const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readJson, writeJson } = require('../services/storage');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const users = await readJson('users.json');
  const existing = users.find((u) => u.email === email);

  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    email,
    name: name || '',
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeJson('users.json', users);

  const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return res.status(201).json({
    message: 'Registered successfully',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const users = await readJson('users.json');
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return res.json({
    message: 'Logged in successfully',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});

module.exports = router;
