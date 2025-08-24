// This file configures our file upload helper (multer).
const multer = require('multer');
const path = require('path'); // A built-in Node.js tool for working with file paths
const { v4: uuidv4 } = require('uuid'); // Import the UUID tool for generating unique names

// Configure the storage engine for multer
const storage = multer.diskStorage({
  // 1. Set the destination for where files should be saved
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder we created
  },

  // 2. Set the filename for how files should be named
  filename: (req, file, cb) => {
    // To avoid two users uploading a 'drawing.dwg' file and overwriting each other,
    // we will give each file a unique name.
    // Example: a-unique-id-12345-drawing.dwg
    const uniquePrefix = uuidv4();
    const originalName = file.originalname;
    const newFilename = `${uniquePrefix}-${originalName}`;
    cb(null, newFilename);
  },
});

// Create the multer instance with our configuration
const upload = multer({ storage: storage });

// Make the configured 'upload' object available to other files
module.exports = { upload };