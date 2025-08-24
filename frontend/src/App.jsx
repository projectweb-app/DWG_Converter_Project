import React, { useState } from 'react';
import './App.css';
import UploadComponent from './components/UploadComponent';
import ResultsComponent from './components/ResultsComponent';
import AdsenseComponent from './components/AdsenseComponent'; // 1. IMPORT

const API_URL = 'http://localhost:5000/api';
// 2. GET THE PUBLISHER ID FROM THE .ENV FILE
const ADSENSE_PUBLISHER_ID = import.meta.env.VITE_ADSENSE_PUBLISHER_ID;

function App() {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [convertedFiles, setConvertedFiles] = useState([]);

  const handleReset = () => {
    setUploadStatus('idle');
    setConvertedFiles([]);
    setErrorMessage('');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>DWG to PDF Converter</h1>
        <p>Fast, secure, and high-quality conversions.</p>
      </header>

      {/* --- AD PLACEMENT 1: LEADERBOARD AD --- */}
      {ADSENSE_PUBLISHER_ID && (
        <AdsenseComponent
          adClient={ADSENSE_PUBLISHER_ID}
          adSlot="YOUR_LEADERBOARD_AD_SLOT_ID" // Replace with your actual Ad Slot ID
        />
      )}
      
      <main>
        {convertedFiles.length === 0 ? (
          <UploadComponent 
            apiUrl={API_URL}
            setUploadStatus={setUploadStatus}
            setErrorMessage={setErrorMessage}
            setConvertedFiles={setConvertedFiles}
            uploadStatus={uploadStatus}
            errorMessage={errorMessage}
          />
        ) : (
          <>
            <ResultsComponent files={convertedFiles} apiUrl={API_URL} />
            <button className="convert-more-button" onClick={handleReset}>
              Convert More Files
            </button>
          </>
        )}
      </main>

      {/* --- AD PLACEMENT 2: IN-CONTENT AD --- */}
      {ADSENSE_PUBLISHER_ID && (
         <AdsenseComponent
          adClient={ADSENSE_PUBLISHER_ID}
          adSlot="YOUR_IN_CONTENT_AD_SLOT_ID" // Replace with your actual Ad Slot ID
        />
      )}

      <footer className="app-footer">
        {/* We can add a simple footer here */}
        <p>&copy; 2025 DWG to PDF Converter. All files are deleted after 1 hour.</p>
      </footer>
    </div>
  );
}

export default App;