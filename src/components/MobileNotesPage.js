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
      preview: 'the internet is fleeting. the mail is forever.',
      content: (
        <div className="mobile-note-text">
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
      shortDate: '10/11/2025',
      preview: 'the protocol when you subscribe. you enter the cycle.',
      content: (
        <div className="mobile-note-text">
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
      shortDate: '10/11/2025',
      preview: 'for lost transmissions or general system errors contact ritualsupport@egirls.faith.',
      content: (
        <div className="mobile-note-text">
          <p>for lost transmissions or general system errors contact ritualsupport@egirls.faith.</p>
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
