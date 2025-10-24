import React from 'react';
import './NotesModal.css';

const NotesModal = ({ onClose }) => {
  // Add ESC key functionality to close the modal
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [onClose]);

  return (
    <div className="notes-modal-overlay" onClick={onClose}>
      <div className="notes-modal" onClick={(e) => e.stopPropagation()}>
        {/* Title Bar */}
        <div className="notes-title-bar">
          <div className="notes-traffic-lights">
            <div className="traffic-light red" onClick={onClose}></div>
            <div className="traffic-light yellow"></div>
            <div className="traffic-light green"></div>
          </div>
          <div className="notes-title"></div>
        </div>

        {/* Main Content */}
        <div className="notes-content">
          {/* Left Pane - Notes List */}
          <div className="notes-sidebar">
            <div className="notes-list">
              <div className="notes-section">
                <h3 className="notes-section-title">Today</h3>
                <div className="note-item active">
                  <div className="note-title">mail club about</div>
                  <div className="note-preview">
                    <span className="note-time">4:44 PM</span> the mail clu...
                  </div>
                </div>
              </div>
              
              <div className="notes-section">
                <h3 className="notes-section-title">Previous 30 Days</h3>
              </div>
            </div>
          </div>

          {/* Right Pane - Note Content */}
          <div className="notes-main">
            <div className="note-content">
              <div className="note-date-time">October 15, 2025 at 4:44 PM</div>
              <h1 className="note-content-title">mail club about</h1>
              <div className="note-text">
                <p>the mail club is our analog ritual.</p>
                <p>each envelope carries a transmission, a relic, a fragment of the collective dream.</p>
                <p>a reminder that the internet can bleed into real life, that connection doesn't end at the screen.</p>
                <p>sent monthly, sealed with intention, addressed to those who listen for the hum.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
