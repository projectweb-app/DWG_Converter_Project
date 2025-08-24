// This service handles the business logic of converting a DWG file to a PDF.
const path = require('path'); // A built-in Node.js tool

/**
 * Simulates the conversion of a DWG file to PDF.
 * In a real application, this function would call a command-line tool.
 * @param {string} originalFilename - The full filename of the uploaded DWG file (e.g., 'uuid-drawing.dwg').
 * @returns {Promise<string>} A promise that resolves with the new PDF filename.
 */
const convertDwgToPdf = (originalFilename) => {
  return new Promise((resolve, reject) => {
    console.log(`Starting conversion for: ${originalFilename}...`);

    // Get the file name without the extension (e.g., 'uuid-drawing')
    const baseFilename = path.parse(originalFilename).name;
    const pdfFilename = `${baseFilename}.pdf`;

    // --- SIMULATION ---
    // We use setTimeout to pretend the conversion takes 3 seconds.
    // In a real app, you would replace this with your conversion command.
    setTimeout(() => {
      console.log(`Successfully converted ${originalFilename} to ${pdfFilename}`);
      
      // The promise "resolves", meaning it finished successfully and is returning the result.
      resolve(pdfFilename);
    }, 3000); // 3000 milliseconds = 3 seconds
  });
};

// Make the function available to other files
module.exports = {
  convertDwgToPdf,
};