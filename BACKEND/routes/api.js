const express = require('express');
const router = express.Router();

// Import the upload controller
const { uploadAndConvertFiles } = require('../controllers/uploadController');

// --- NEW: Import the download controller ---
const { downloadSingleFile, downloadBatchFiles } = require('../controllers/downloadController');

// Import the file handler service
const { upload } = require('../services/fileHandler');

// --- Route for Uploading and Converting ---
router.post('/upload', upload.array('dwgFiles', 20), uploadAndConvertFiles);

// --- NEW: Route for downloading a single file ---
// The ':filename' is a URL parameter. Express will capture whatever text
// comes after /download/ and make it available in req.params.filename.
router.get('/download/:filename', downloadSingleFile);

// --- NEW: Route for downloading multiple files as a zip ---
// We also need to tell express to parse JSON request bodies for this route.
router.post('/download-batch', express.json(), downloadBatchFiles);


module.exports = router;