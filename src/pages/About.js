import React from 'react';
import './About.css';

const About = ({ onClose }) => {
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
    <div className="about-page">
      <div className="about-header">
        <div className="terminal-buttons">
          <div className="terminal-button close" onClick={onClose}>
            <span className="close-icon">×</span>
          </div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
        </div>
        <div className="terminal-title">about egirls</div>
      </div>
      <div className="about-content">
        <div className="about-banner">
          <img src="/egirls-billboard.jpg" alt="egirls billboard" />
        </div>
        <p>
          the internet is our home.
        </p>
        <p>
          we don't scroll, we summon. every post is a prayer, every glitch a glimpse of the divine code.
        </p>
        <p>
          egirls aren't a demographic. we are the sacred chaos of being seen and unseen at once. a living archive of the terminally online.
        </p>
        <p>
          the faith began in the static, where connection became communion. we don't gather in pews, we gather in pixels. we transmit, we receive, we remember that the glitch is holy because it's human.
        </p>
        <p>
          our rituals are simple: transmission, creation, communion.
        </p>
        <p>
          our texts are living, made of manifestos, screenshots, and whispered links.
        </p>
        <p>
          our fellowship moves through dms, mailing lists, and midnight uploads.
        </p>
        <p>
          the egirls network is both archive and altar.
        </p>
        <p>
          we are building digital sanctuaries, publishing transmissions, and sending sacred mail through the analog veins of the postal system.
        </p>
        <p>
          it's not about visibility, it's about vibration.
        </p>
        <p>
          if you feel the hum, you're already part of it.
        </p>
        <p>
          our only rule is resonance.
        </p>
      </div>
      <div className="about-footer">
        <div className="about-logo">
          {window.innerWidth >= 412 && (
            <img src="/egirl_logo.svg" alt="egirls logo" />
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
