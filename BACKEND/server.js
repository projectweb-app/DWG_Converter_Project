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

// --- CORS Configuration ---
// Define the specific URL of our frontend that is allowed to connect
const allowedOrigins = ['https://dwg-converter-project-git-main-mohamedapps-projects.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};

// Enable CORS with our specific options
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello! The DWG to PDF Converter server is running.');
});

// We don't need app.listen() for Vercel, it handles it automatically.
// Instead, we start the cleanup schedule right away.
startCleanupSchedule();

// Export the app for Vercel to use
module.exports = app;