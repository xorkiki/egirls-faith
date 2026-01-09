import React from 'react';
import './PaperTrail.css';

const PaperTrail = ({ onClose }) => {
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

  return (
    <div className="paper-trail-page">
      <div className="paper-trail-header">
        <div className="terminal-buttons">
          <div className="terminal-button close" onClick={onClose}>
            <span className="close-icon">×</span>
          </div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
        </div>
        <div className="terminal-title">paper trail</div>
      </div>
      <div className="paper-trail-content">
      </div>
      <div className="paper-trail-footer">
        <div className="paper-trail-logo">
          <img src="/egirl_logo.svg" alt="egirls logo" />
        </div>
      </div>
    </div>
  );
};

export default PaperTrail;
