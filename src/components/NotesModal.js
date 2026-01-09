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
          <p>the internet is fleeting. the mail is forever.</p>
          <p>this is our analog ritual. a way to drag the digital into the physical.</p>
          <p>every month. a sealed envelope arrives at your door. inside is a curated drop of analog artifacts. essays. visual manifestos. and erratic art that documents the chaos of being alive online.</p>
          <p>we pull the rawest parts of the feed and send them through the veins of the postal system directly to you.</p>
          <p>it is a time capsule of the now. a sanctuary you can touch.</p>
          <p>hold the glitch in your hands.</p>
        </div>
      )
    },
    'how-it-works': {
      title: 'how it works',
      time: '5:55 PM',
      date: 'October 11, 2025 at 5:55 PM',
      content: (
        <div className="note-text">
          <p><strong>the protocol</strong> when you subscribe. you enter the cycle. you will be charged monthly and receive a new artifact every month until you choose to disconnect. you can cancel or update your plan anytime in the portal.</p>
          <p><strong>the timeline</strong> everything ships at the end of each month.</p>
          <p>if you sign up before the 15th. you secure this month's drop. if you sign up after the 15th. your first transmission will arrive the following month.</p>
          <p>the delivery timing depends on where you live and the mood of the post office. delivery varies. each one travels at its own analog pace.</p>
          <p>once subscribed. a new piece of mail will find its way to you each month. untracked. but always on the way.</p>
        </div>
      )
    },
    'contact': {
      title: 'contact',
      time: '1:11 AM',
      date: 'October 11, 2025 at 1:11 AM',
      content: (
        <div className="note-text">
          <p>for lost transmissions or general system errors contact ritualsupport@egirls.faith.</p>
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
                    <span className="note-time">4:44 PM</span> the internet is fleeting...
                  </div>
                </div>
                <div 
                  className={`note-item ${selectedNote === 'how-it-works' ? 'active' : ''}`}
                  onClick={() => setSelectedNote('how-it-works')}
                >
                  <div className="note-title">how it works</div>
                  <div className="note-preview">
                    <span className="note-time">5:55 PM</span> the protocol...
                  </div>
                </div>
                <div 
                  className={`note-item ${selectedNote === 'contact' ? 'active' : ''}`}
                  onClick={() => setSelectedNote('contact')}
                >
                  <div className="note-title">contact</div>
                  <div className="note-preview">
                    <span className="note-time">1:11 AM</span> for lost transmissions...
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
