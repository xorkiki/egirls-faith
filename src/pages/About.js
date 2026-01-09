import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = ({ onClose }) => {
  const navigate = useNavigate();

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

  const handleJoinNetwork = (e) => {
    e.preventDefault();
    navigate('/mailclub');
  };

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
        <h1 className="about-headline">A NEW MEDIA EXPERIMENT FOR THE TERMINALLY ONLINE.</h1>
        
        <h2 className="about-section-title">what is egirls?</h2>
        <p>
          egirls is an experimental publication exploring the chaos of existence in the digital age.
        </p>
        <p>
          we believe the internet is real but it should not stay behind glass. we are here to close the gap between the url and the irl. we are a living archive and a bridge between worlds. we are a network for the messy. the raw. and the glitch-prone.
        </p>

        <h2 className="about-section-title">the transmission (monthly editions)</h2>
        <p>
          we do not just scroll. we summon. every month we release a physical edition. a curated drop of analog artifacts sent through the veins of the postal system directly to your door.
        </p>
        <p>
          these are not monthly letter publications. they are time capsules of the current moment. inside you will find essays on digital philosophy. reflections on being a woman in the digital age. visual manifestos. and art that embodies what it means to be a messy human in a polished algorithmic world.
        </p>
        <p>
          from the revival of smudgecore to the spirituality of the server room. we document the culture as it happens.
        </p>

        <h2 className="about-section-title">the philosophy</h2>
        <p>
          we are entering the era of the error. perfection is dead. the clean girl was a cage. egirls is the key to the breakout. we celebrate the beauty of the breakdown. the smeared makeup. the chaotic existence. the unfiltered feed.
        </p>
        <p>
          we are building a sanctuary for those who feel the hum of the electric current within. a place where you can be chaotic. tender. and real.
        </p>
        <p>
          <a href="/mailclub" onClick={handleJoinNetwork} className="about-link">join the network</a>. subscribe to the transmission. receive the sacrament. be the glitch.
        </p>
      </div>
      <div className="about-footer">
        <div className="about-logo">
          <img src="/egirl_logo.svg" alt="egirls logo" />
        </div>
      </div>
    </div>
  );
};

export default About;
