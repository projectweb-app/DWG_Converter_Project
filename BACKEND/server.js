// This is the central file for our backend server.

const express = require('express');
const cors = require('cors');
const path = require('path'); // We need path for Vercel

const apiRoutes = require('./routes/api');
const { startCleanupSchedule } = require('./services/cleanupService');

const app = express();

app.use(cors());

// Tell express where to find static files if needed (for downloads)
// Vercel runs code from a different place, so we need to be explicit
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Hello! The DWG to PDF Converter server is running.');
});

// We don't need app.listen() for Vercel, it handles it automatically.
// Instead, we start the cleanup schedule right away.
startCleanupSchedule();

// Export the app for Vercel to use
module.exports = app;