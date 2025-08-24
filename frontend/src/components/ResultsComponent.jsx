import React from 'react';
import axios from 'axios';
import './ResultsComponent.css';

// This component receives the list of files and the API URL from its parent
const ResultsComponent = ({ files, apiUrl }) => {
  
  // --- DOWNLOAD LOGIC ---

  // 1. Handles downloading a single PDF file
  const handleSingleDownload = (pdfFilename) => {
    // We can simply construct the URL and open it. The browser will handle the download.
    window.open(`${apiUrl}/download/${pdfFilename}`, '_blank');
  };

  // 2. Handles downloading all files as a single ZIP
  const handleBatchDownload = async () => {
    try {
      // Get just the list of PDF filenames to send to the backend
      const pdfFiles = files.map(file => file.pdfFile);
      
      const response = await axios.post(`${apiUrl}/download-batch`, 
        { files: pdfFiles }, // The JSON payload
        { responseType: 'blob' } // IMPORTANT: tells axios to expect binary file data
      );

      // Create a URL from the blob data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted_files.zip'); // The filename for the download
      document.body.appendChild(link);
      link.click();

      // Clean up by revoking the object URL
      window.URL.revokeObjectURL(url);
      link.remove();

    } catch (error) {
      console.error('Error downloading batch files:', error);
      alert('Could not download the zip file. Please try again.');
    }
  };


  // --- JSX STRUCTURE ---
  return (
    <div className="results-container">
      <h2>Conversion Results</h2>
      <button 
        className="download-all-button" 
        onClick={handleBatchDownload}
      >
        Download All (.zip)
      </button>
      <ul className="results-list">
        {files.map((file, index) => (
          <li key={index} className="result-item">
            <div className="file-info">
              <span className="original-name">{file.originalName}</span>
              <span className="arrow">→</span>
              <span className="pdf-name">{file.pdfFile}</span>
            </div>
            <button 
              className="download-button"
              onClick={() => handleSingleDownload(file.pdfFile)}
            >
              Download PDF
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsComponent;