import React from 'react';
import { saveAs } from 'file-saver';

const DownloadButton = ({ label, data, filename, fileType = 'text/plain' }) => {
  const handleDownload = () => {
    try {
      let content;
      let finalFilename = filename || `${label.toLowerCase().replace(/\s+/g, '_')}.txt`;
      
      if (typeof data === 'string') {
        content = data;
      } else if (Array.isArray(data)) {
        // Handle email nurture sequence
        content = data.map((email, index) => 
          `Email ${index + 1}:\nSubject: ${email.subject}\n\n${email.body}\n\n${'='.repeat(50)}\n\n`
        ).join('');
        finalFilename = filename || 'email_nurture_sequence.txt';
      } else if (typeof data === 'object') {
        content = JSON.stringify(data, null, 2);
        finalFilename = filename || `${label.toLowerCase().replace(/\s+/g, '_')}.json`;
      } else {
        content = String(data);
      }
      
      const blob = new Blob([content], { type: fileType });
      saveAs(blob, finalFilename);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <button className="download-btn" onClick={handleDownload}>
      📥 {label}
    </button>
  );
};

export default DownloadButton;