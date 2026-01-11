import React, { useState, useEffect } from 'react';
// TEMPORARY TEST: Replaced EnvelopeScrollReveal with test placeholder
// import EnvelopeScrollReveal from '../components/EnvelopeScrollReveal';
import EnvelopeTestPlaceholder from '../components/EnvelopeTestPlaceholder';
import './PaperTrail.css';

const PaperTrail = ({ onClose }) => {
  const [isReady, setIsReady] = useState(false);

  // Preload image helper - returns Promise that resolves on load or error (never hangs)
  const preloadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve on error too, so it never hangs
      img.src = src;
    });
  };

  // Preload critical images for initial view
  useEffect(() => {
    // Critical images that must load before showing the page:
    // 1. envelope-front.png - visible immediately
    // 2. envelope-back.png - visible immediately
    // Content images can load normally as they're hidden until scroll
    const criticalImages = [
      '/letter-example/envelope-front.png',
      '/letter-example/envelope-back.png',
    ];

    // Preload all critical images, then set ready
    Promise.all(criticalImages.map(preloadImage)).then(() => {
      // Small delay to ensure smooth transition
      requestAnimationFrame(() => {
        setIsReady(true);
      });
    });
  }, []);

  // Add ESC key functionality to close the page
  useEffect(() => {
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
        <div className="terminal-title">inside the envelope</div>
      </div>
      
      {/* Placeholder while loading - matches page background, no layout shift */}
      {!isReady && (
        <div className="paper-trail-placeholder" />
      )}
      
      {/* Main content - fades in when ready */}
      <div className={`paper-trail-content-wrapper ${isReady ? 'paper-trail-ready' : ''}`}>
        {/* TEMPORARY TEST: Using test placeholder instead of EnvelopeScrollReveal */}
        <EnvelopeTestPlaceholder />
        {/* <EnvelopeScrollReveal /> */}
        <div className="paper-trail-description">
          from the november edition, a small window into what arrives each month.
        </div>
        <div className="paper-trail-footer">
          <div className="paper-trail-logo">
            <img src="/egirl_logo.svg" alt="egirls logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperTrail;
