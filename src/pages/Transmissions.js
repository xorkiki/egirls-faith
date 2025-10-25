import React from 'react';
import './Transmissions.css';

const Transmissions = ({ onClose }) => {
  // Add ESC key functionality to close the page
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [onClose]);

  // Load Typeform script dynamically
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = '//embed.typeform.com/next/embed.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="transmissions-page">
      <div className="transmissions-header">
        <div className="terminal-buttons">
          <div className="terminal-button close" onClick={onClose}>
            <span className="close-icon">×</span>
          </div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
        </div>
        <div className="terminal-title">transmissions</div>
      </div>
      <div className="transmissions-content">
        <div data-tf-live="01K8CGV3WZY3FE33QA6DDSAFME"></div>
      </div>
      <div className="transmissions-footer">
        <div className="transmissions-logo">
          {window.innerWidth >= 412 && (
            <img src="/egirl_logo.svg" alt="egirls logo" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Transmissions;
