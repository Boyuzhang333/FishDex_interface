const express = require('express');
const authRoutes = require('./routes/auth');
const identifyRoutes = require('./routes/identify');
const catchRoutes = require('./routes/catches');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'FishDex API is running' });
});

app.use(authRoutes);
app.use(identifyRoutes);
app.use(catchRoutes);

app.use((err, req, res, next) => {
  if (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
  return next();
});

app.listen(PORT, () => {
  console.log(`FishDex API running on port ${PORT}`);
});
