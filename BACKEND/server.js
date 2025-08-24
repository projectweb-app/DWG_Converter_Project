// This is the central file for our backend server.

// 1. Import the tools we need
const express = require('express');
const cors = require('cors');

// Import our router
const apiRoutes = require('./routes/api');

// --- NEW: Import our cleanup service ---
const { startCleanupSchedule } = require('./services/cleanupService');

// 2. Initialize our application
const app = express();
const PORT = 5000;

// 3. Apply Middleware (Helpers)
app.use(cors()); // Use the CORS helper to avoid cross-origin errors

// Tell our app to use the routes defined in './routes/api.js'
app.use('/api', apiRoutes);

// 4. Define a basic "route" or URL for testing
app.get('/', (req, res) => {
  res.send('Hello! The DWG to PDF Converter server is running.');
});

// 5. Start the server and listen for requests
app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
  
  // --- NEW: Start the automated cleanup schedule ---
  startCleanupSchedule();
});