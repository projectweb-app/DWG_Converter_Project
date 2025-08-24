// This controller handles the logic for downloading files.
const path = require('path');
const fs = require('fs'); // Node.js File System module, to check if a file exists
const archiver = require('archiver'); // The tool we installed to create zip files

// --- Logic for downloading a SINGLE file ---
const downloadSingleFile = (req, res) => {
  // The filename is passed as part of the URL (e.g., /api/download/my-file.pdf)
  // req.params.filename captures 'my-file.pdf'
  const filename = req.params.filename;
  
  // Construct the full path to the file to ensure we look in the correct folder
  // __dirname gives us the path of the current directory ('/controllers')
  // '../uploads/' goes up one level and then into the 'uploads' folder
  const filePath = path.join(__dirname, '../uploads/', filename);

  // Security Check: Make sure the file actually exists before trying to send it
  if (fs.existsSync(filePath)) {
    // If it exists, the res.download() function from Express handles everything for us.
    // It sets the correct headers to tell the browser to download the file.
    res.download(filePath);
  } else {
    // If the file doesn't exist, send a 404 "Not Found" error
    res.status(404).send({ message: 'File not found.' });
  }
};

// --- Logic for downloading MULTIPLE files as a ZIP ---
const downloadBatchFiles = (req, res) => {
    // The frontend will send a POST request with a JSON body like:
    // { "files": ["file1.pdf", "file2.pdf"] }
    const { files } = req.body;

    if (!files || files.length === 0) {
        return res.status(400).send({ message: 'No files specified for download.' });
    }

    // Set the headers to tell the browser a zip file is coming
    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="converted_files.zip"`
    });

    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level
    });

    // Pipe the zip archive data directly to the response
    archive.pipe(res);

    // Add each requested file to the zip archive
    files.forEach(filename => {
        const filePath = path.join(__dirname, '../uploads/', filename);
        if (fs.existsSync(filePath)) {
            // The first argument is the file path on the server.
            // The second argument is how the file will be named inside the zip.
            archive.file(filePath, { name: filename });
        }
    });

    // Finalize the archive (no more files can be added)
    archive.finalize();
};


module.exports = {
  downloadSingleFile,
  downloadBatchFiles,
};