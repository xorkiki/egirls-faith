import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const backgroundRef = useRef(null);
  const fadeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Apply zoom effect based on scroll position
      if (backgroundRef.current) {
        const scale = 1 + (scrollTop * 0.005);
        backgroundRef.current.style.transform = `scale(${scale})`;
      }

      // Apply fade to black effect as you zoom in
      if (fadeRef.current) {
        const fadeProgress = Math.min(scrollTop / (window.innerHeight * 0.8), 1);
        fadeRef.current.style.opacity = fadeProgress;
      }

      // Navigate to terminal when scroll reaches a certain point
      if (scrollTop >= window.innerHeight * 0.8) {
        navigate('/terminal');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  return (
    <div className="landing-page">
      <div className="background-container">
        <div 
          className="background-image" 
          ref={backgroundRef}
          style={{
            backgroundImage: 'url(/hero.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="fade-overlay" ref={fadeRef}></div>
      </div>
    </div>
  );
};

export default LandingPage;
