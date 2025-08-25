const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// IMPORTANT: Double-check this path on your server by running 'which ODAFileConverter'
const ODA_CONVERTER_PATH = '/usr/bin/ODAFileConverter';

const convertDwgToPdf = (inputFile) => {
  return new Promise((resolve, reject) => {
    // Defines where the uploaded files are and where the converted files will go.
    const inputDir = path.dirname(inputFile);
    const outputDir = path.join(inputDir, 'converted'); // We'll create a sub-folder for PDFs
    const outputFileName = `${path.basename(inputFile, path.extname(inputFile))}.pdf`;
    const outputFile = path.join(outputDir, outputFileName);

    // Create the 'converted' subdirectory if it doesn't already exist.
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // This is the exact command we will run in the server's terminal.
    // Format: Converter "InputFolder" "OutputFolder" "OutputType" "OutputVersion" "Recurse" "Audit" "InputFile"
    const command = `"${ODA_CONVERTER_PATH}" "${inputDir}" "${outputDir}" "PDF" "V1.5" "0" "1" "${path.basename(inputFile)}"`;

    console.log(`[CONVERTER] Preparing to convert: ${path.basename(inputFile)}`);
    console.log(`[CONVERTER] Executing command: ${command}`);

    // Node.js executes the command line tool.
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`[CONVERTER] Execution Error: ${error.message}`);
        return reject(new Error('Failed to execute the conversion command.'));
      }

      // Check if the output file was actually created.
      if (!fs.existsSync(outputFile)) {
          console.error(`[CONVERTER] Process Error: Conversion failed. Output file not found.`);
          console.error(`[CONVERTER] Stderr: ${stderr}`);
          return reject(new Error('Conversion process failed to create a PDF file.'));
      }
      
      console.log(`[CONVERTER] Success: Successfully created ${outputFileName}`);
      console.log(`[CONVERTER] Stdout: ${stdout}`);

      // The promise resolves, returning just the name of the new PDF file.
      resolve(outputFileName);
    });
  });
};

module.exports = {
  convertDwgToPdf,
};