// This file now handles both uploading AND starting the conversion.
const { convertDwgToPdf } = require('../services/conversionService');

const uploadAndConvertFiles = async (req, res) => {
  // 1. Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  try {
    // 2. Start the conversion process for every uploaded file
    // 'req.files' is an array of uploaded file objects
    const conversionPromises = req.files.map(file => {
      // For each file, we call our conversion service.
      // This returns a "Promise" (a placeholder for a future result).
      return convertDwgToPdf(file.filename); 
    });

    // 3. Wait for ALL conversions to complete
    // Promise.all() is a special function that waits for every promise in an array to finish.
    const conversionResults = await Promise.all(conversionPromises);

    // 4. Prepare the final response
    // We want to send back a list of objects, each containing the original
    // DWG name and the new PDF name, so the frontend knows which is which.
    const responseData = req.files.map((file, index) => {
        return {
            originalName: file.originalname, // The name the user sees (e.g., 'my-house-plan.dwg')
            dwgFile: file.filename,          // The unique name on the server (e.g., 'uuid-my-house-plan.dwg')
            pdfFile: conversionResults[index] // The resulting PDF name (e.g., 'uuid-my-house-plan.pdf')
        };
    });

    // 5. Send a success response back to the user
    res.status(200).json({
      message: 'Files uploaded and converted successfully!',
      data: responseData,
    });

  } catch (error) {
    // If anything goes wrong during conversion
    console.error('An error occurred during file conversion:', error);
    res.status(500).json({ message: 'An error occurred during file conversion.' });
  }
};

module.exports = {
  // We rename the function to be more descriptive
  uploadAndConvertFiles,
};