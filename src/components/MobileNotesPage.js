import React, { useState } from 'react';
import './MobileNotesPage.css';

const MobileNotesPage = ({ onClose }) => {
  console.log('MobileNotesPage rendered');
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'note'
  const [selectedNote, setSelectedNote] = useState(null);
  
  // Add ESC key functionality to close the page
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (currentView === 'note') {
          setCurrentView('list');
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [onClose, currentView]);

  // Note data
  const notes = {
    'mail-club-about': {
      title: 'mail club about',
      time: '4:44 PM',
      date: 'October 11, 2025 at 4:44 PM',
      shortDate: '10/11/2025',
      preview: 'the mail club is our analog ritual.',
      content: (
        <div className="mobile-note-text">
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
      shortDate: '10/11/2025',
      preview: 'when you subscribe, you\'ll be charged monthly and receive a new mailer every month until you cancel.',
      content: (
        <div className="mobile-note-text">
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
      shortDate: '10/11/2025',
      preview: 'for lost mail, divine guidance, or general confusion, contact ritualsupport@egirls.faith.',
      content: (
        <div className="mobile-note-text">
          <p>for lost mail, divine guidance, or general confusion, contact ritualsupport@egirls.faith.</p>
        </div>
      )
    }
  };

  const handleNoteClick = (noteId) => {
    setSelectedNote(noteId);
    setCurrentView('note');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedNote(null);
  };

  const handleBackToMailClub = () => {
    onClose();
  };

  if (currentView === 'note' && selectedNote) {
    const note = notes[selectedNote];
    return (
      <div className="mobile-notes-page">
        <div className="mobile-notes-title-bar">
          <button className="mobile-back-arrow" onClick={handleBackToList}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="mobile-note-content">
          <div className="mobile-note-date">{note.date}</div>
          <h1 className="mobile-note-title">{note.title}</h1>
          <div className="mobile-note-body">
            {note.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-notes-page">
      <div className="mobile-notes-title-bar mobile-notes-list-title-bar">
        <div className="mobile-traffic-lights">
          <div className="mobile-traffic-light mobile-traffic-light-close" onClick={handleBackToMailClub}></div>
          <div className="mobile-traffic-light mobile-traffic-light-minimize"></div>
          <div className="mobile-traffic-light mobile-traffic-light-maximize"></div>
        </div>
      </div>
      <div className="mobile-notes-list">
        {Object.entries(notes).map(([noteId, note]) => (
          <div 
            key={noteId} 
            className="mobile-note-item"
            onClick={() => handleNoteClick(noteId)}
          >
            <div className="mobile-note-item-header">
              <h3 className="mobile-note-item-title">{note.title}</h3>
            </div>
            <div className="mobile-note-item-preview">
              <span className="mobile-note-date">{note.shortDate}</span> {note.preview}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileNotesPage;
