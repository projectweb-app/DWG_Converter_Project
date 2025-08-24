import React, { useRef } from 'react'; // useState is no longer needed here
import axios from 'axios';
import './UploadComponent.css';

// This component now receives all state and functions from its parent (App.jsx)
const UploadComponent = ({ apiUrl, setUploadStatus, setErrorMessage, setConvertedFiles, uploadStatus, errorMessage }) => {
  
  const fileInputRef = useRef(null);
  // isDragOver can remain a local state as it doesn't affect other components
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleFiles = async (files) => {
    const filesArray = Array.from(files);
    if (filesArray.length === 0) return;

    setUploadStatus('uploading');
    setErrorMessage('');
    setConvertedFiles([]);

    const formData = new FormData();
    filesArray.forEach(file => {
      formData.append('dwgFiles', file);
    });

    try {
      const response = await axios.post(`${apiUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setConvertedFiles(response.data.data);
      setUploadStatus('success'); // Parent's state is updated
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An unknown error occurred.');
      setUploadStatus('error'); // Parent's state is updated
    }
  };

  // --- ALL EVENT HANDLERS AND RENDER LOGIC REMAIN THE SAME ---
  const onBrowseButtonClick = () => fileInputRef.current.click();
  const onFileSelectChange = (event) => handleFiles(event.target.files);
  const onDragOver = (event) => { event.preventDefault(); setIsDragOver(true); };
  const onDragLeave = (event) => { event.preventDefault(); setIsDragOver(false); };
  const onDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    handleFiles(event.dataTransfer.files);
  };

  const renderContent = () => {
    switch (uploadStatus) {
      case 'uploading': return <p className="status-text">Uploading and Converting...</p>;
      case 'error': return <p className="status-text error">{errorMessage}</p>;
      case 'idle':
      default:
        return (
          <>
            <img src="/upload-icon.svg" alt="Upload Icon" className="upload-icon" />
            <p className="upload-title">Drag & Drop files here</p>
            <p className="subtitle">or</p>
            <button className="browse-button" onClick={onBrowseButtonClick}>Browse Files</button>
            <p className="upload-hint">Maximum 20 files. DWG format only.</p>
          </>
        );
    }
  };

  return (
    <div className="upload-container">
      <div 
        className={`upload-box ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
      >
        <input 
          type="file" multiple hidden ref={fileInputRef} onChange={onFileSelectChange}
          accept=".dwg" disabled={uploadStatus === 'uploading'}
        />
        {renderContent()}
      </div>
    </div>
  );
};

export default UploadComponent;