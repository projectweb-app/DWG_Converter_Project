// This service handles the logic for automatically deleting old files.
const fs = require('fs'); // Node.js File System module
const path = require('path'); // Node.js Path module
const schedule = require('node-schedule'); // The scheduling tool

// --- Configuration ---
const UPLOADS_DIR = path.join(__dirname, '../uploads');
// Define how old a file must be to be deleted (in milliseconds)
// For example, 1 hour = 60 minutes * 60 seconds * 1000 milliseconds
const MAX_FILE_AGE = 60 * 60 * 1000; 

// --- The Cleanup Function ---
const cleanupOldFiles = () => {
  console.log('Running scheduled cleanup job...');

  // 1. Read all the files in the uploads directory
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory for cleanup:', err);
      return;
    }

    // If there are no files, we're done.
    if (files.length === 0) {
        console.log('Cleanup: No files to check.');
        return;
    }

    // 2. Loop through each file
    files.forEach(file => {
      const filePath = path.join(UPLOADS_DIR, file);

      // 3. Get file details, specifically its creation time
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for file ${file}:`, err);
          return;
        }

        const fileAge = Date.now() - stats.mtime.getTime(); // Age of the file in milliseconds

        // 4. Check if the file is older than our max age
        if (fileAge > MAX_FILE_AGE) {
          // 5. If it is, delete it
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting old file ${file}:`, err);
            } else {
              console.log(`Successfully deleted old file: ${file}`);
            }
          });
        }
      });
    });
  });
};

// --- The Scheduling Function ---
const startCleanupSchedule = () => {
  // This uses "cron-style" scheduling. The string '0 * * * *' means
  // "run at the 0th minute of every hour".
  // So, this job will run at 1:00, 2:00, 3:00, etc.
  schedule.scheduleJob('0 * * * *', cleanupOldFiles);

  console.log('File cleanup job has been scheduled to run every hour.');
};

// Make the scheduling function available to our main server file
module.exports = {
  startCleanupSchedule,
};