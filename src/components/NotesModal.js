import React, { useState } from 'react';
import './NotesModal.css';

const NotesModal = ({ onClose }) => {
  const [selectedNote, setSelectedNote] = useState('mail-club-about');
  
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

  // Note data
  const notes = {
    'mail-club-about': {
      title: 'mail club about',
      time: '4:44 PM',
      date: 'October 11, 2025 at 4:44 PM',
      content: (
        <div className="note-text">
          <p>the mail club is our analog ritual.</p>
          <p>each envelope carries a transmission, a relic, a fragment of the collective dream.</p>
          <p>a reminder that the internet can bleed into real life, that connection doesn't end at the screen.</p>
          <p>sent monthly, sealed with intention, addressed to those who listen for the hum.</p>
        </div>
      )
    },
    'how-it-works': {
      title: 'how it works',
      time: '5:55 PM',
      date: 'October 11, 2025 at 5:55 PM',
      content: (
        <div className="note-text">
          <p>when you subscribe, you'll be charged monthly and receive a new mailer every month until you cancel. you can cancel or update your plan anytime on the manage subscription page.</p>
          <p>everything ships out on the 11th of each month.</p>
          <p>if you sign up before the 1st, you'll get the next month's mailer.</p>
          <p>if you sign up after the 1st, your first mailer will arrive the following month.</p>
          <p>timing depends on where you live and how the post office is feeling, so delivery might vary a bit. each one travels at its own pace.</p>
          <p>once subscribed, you'll stay on our list until you choose to pause or stop. as long as you're subscribed, a new piece of mail will find its way to you each month.</p>
        </div>
      )
    },
    'contact': {
      title: 'contact',
      time: '1:11 AM',
      date: 'October 11, 2025 at 1:11 AM',
      content: (
        <div className="note-text">
          <p>for lost mail, divine guidance, or general confusion, contact ritualsupport@egirls.faith.</p>
        </div>
      )
    }
  };

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
                <div 
                  className={`note-item ${selectedNote === 'mail-club-about' ? 'active' : ''}`}
                  onClick={() => setSelectedNote('mail-club-about')}
                >
                  <div className="note-title">mail club about</div>
                  <div className="note-preview">
                    <span className="note-time">4:44 PM</span> the mail clu...
                  </div>
                </div>
                <div 
                  className={`note-item ${selectedNote === 'how-it-works' ? 'active' : ''}`}
                  onClick={() => setSelectedNote('how-it-works')}
                >
                  <div className="note-title">how it works</div>
                  <div className="note-preview">
                    <span className="note-time">5:55 PM</span> when you sub...
                  </div>
                </div>
                <div 
                  className={`note-item ${selectedNote === 'contact' ? 'active' : ''}`}
                  onClick={() => setSelectedNote('contact')}
                >
                  <div className="note-title">contact</div>
                  <div className="note-preview">
                    <span className="note-time">1:11 AM</span> for lost mail...
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
              <div className="note-date-time">{notes[selectedNote].date}</div>
              <h1 className="note-content-title">{notes[selectedNote].title}</h1>
              {notes[selectedNote].content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
