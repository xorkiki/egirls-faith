import React from 'react';
import './Photos.css';
import NotesModal from '../components/NotesModal';
import StripeModal from '../components/StripeModal';
import StripeUSModal from '../components/StripeUSModal';

// Draggable Icon Component
const DraggableIcon = ({ name, initialX, initialY, onOpen, iconSrc }) => {
  const [position, setPosition] = React.useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const wasDraggingRef = React.useRef(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(false);
    wasDraggingRef.current = false;
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (dragStart.x !== 0 || dragStart.y !== 0) {
      const distance = Math.sqrt(
        Math.pow(e.clientX - (dragStart.x + position.x), 2) + 
        Math.pow(e.clientY - (dragStart.y + position.y), 2)
      );
      
      // If we've moved more than 5px, consider it a drag
      if (distance > 5) {
        setIsDragging(true);
        wasDraggingRef.current = true;
      }
    }
    
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart({ x: 0, y: 0 });
  };

  const handleClick = (e) => {
    // Only open if we didn't drag
    if (!wasDraggingRef.current) {
      onOpen(name);
    }
    // Reset the ref
    wasDraggingRef.current = false;
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      setIsDragging(false);
      wasDraggingRef.current = false;
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (dragStart.x !== 0 || dragStart.y !== 0) {
      const distance = Math.sqrt(
        Math.pow(e.touches[0].clientX - (dragStart.x + position.x), 2) + 
        Math.pow(e.touches[0].clientY - (dragStart.y + position.y), 2)
      );
      
      // If we've moved more than 5px, consider it a drag
      if (distance > 5) {
        setIsDragging(true);
        wasDraggingRef.current = true;
      }
    }
    
    if (isDragging) {
      e.preventDefault(); // Prevent default scrolling
      
      requestAnimationFrame(() => {
        setPosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y
        });
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragStart({ x: 0, y: 0 });
  };

  React.useEffect(() => {
    if (dragStart.x !== 0 || dragStart.y !== 0) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragStart, isDragging]);

  return (
    <div
      className="draggable-icon"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img src={iconSrc} alt="icon" className="icon-image" />
      <span className="icon-name">{name}</span>
    </div>
  );
};

const Photos = ({ onClose }) => {
  const [showNotesModal, setShowNotesModal] = React.useState(false);
  const [showStripeModal, setShowStripeModal] = React.useState(false);
  const [showStripeUSModal, setShowStripeUSModal] = React.useState(false);
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

  // Generate random but centered positions for folders with better viewport handling
  const getRandomCenteredPosition = (folderIndex) => {
    // Get current viewport dimensions with fallbacks
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 375;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 667;
    
    // Account for header and footer areas
    const headerHeight = 44; // Header height
    const footerHeight = 80; // Footer height
    const availableHeight = viewportHeight - headerHeight - footerHeight;
    
    // Use the full viewport width for better distribution
    const safeZoneWidth = viewportWidth - 100; // Full width minus margins
    const safeZoneHeight = availableHeight - 100; // Full height minus margins
    
    // Distribute folders across the full width to prevent stacking
    let baseX;
    if (folderIndex === 0) {
      // First folder: left side
      baseX = 100 + (Math.random() * 0.3 * safeZoneWidth);
    } else {
      // Second folder: right side
      baseX = 100 + (0.7 * safeZoneWidth) + (Math.random() * 0.3 * safeZoneWidth);
    }
    
    // Random Y position within available height
    const randomY = headerHeight + 100 + (Math.random() * (safeZoneHeight - 100));
    
    // Ensure folders stay within viewport bounds with better margins
    const folderWidth = 80; // Approximate folder width
    const folderHeight = 100; // Approximate folder height
    
    const maxX = viewportWidth - folderWidth - 50; // 50px margin from right edge
    const maxY = viewportHeight - folderHeight - footerHeight - 50; // 50px margin from bottom
    const minY = headerHeight + 50; // 50px margin below header
    const minX = 50; // 50px margin from left edge
    
    const finalX = Math.max(minX, Math.min(maxX, baseX));
    const finalY = Math.max(minY, Math.min(maxY, randomY));
    
    // Debug: Log the positioning
    console.log(`Folder ${folderIndex} positioning:`, {
      viewportWidth,
      viewportHeight,
      availableHeight,
      baseX,
      randomY,
      finalX,
      finalY,
      minX,
      maxX,
      minY,
      maxY
    });
    
    return {
      x: finalX,
      y: finalY
    };
  };

  // Fallback positions if random positioning fails
  const getFallbackPosition = (index) => {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 375;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 667;
    
    // Account for header and footer areas
    const headerHeight = 44;
    const footerHeight = 80;
    const availableHeight = viewportHeight - headerHeight - footerHeight;
    
    // Simple grid-based fallback positioning within available space
    const gridX = index === 0 ? 0.3 : 0.7; // Left or right side
    const gridY = 0.5; // Middle of available space
    
    return {
      x: Math.max(20, Math.min(viewportWidth - 100, viewportWidth * gridX)),
      y: Math.max(headerHeight + 20, Math.min(viewportHeight - footerHeight - 180, headerHeight + (availableHeight * gridY)))
    };
  };

  // Use state to store positions and update them when viewport changes
  const [iconPositions, setIconPositions] = React.useState(() => {
    // Set default positions first to ensure icons are visible
    const defaultPositions = {
      mailClubAbout: { x: 100, y: 100 },
      mailClubSubscribe: { x: 300, y: 100 },
      mailClubSubscribeIntl: { x: 500, y: 100 }
    };
    
    // Then try to get random positions
    try {
      return {
        mailClubAbout: getRandomCenteredPosition(0), // Left side
        mailClubSubscribe: getRandomCenteredPosition(1), // Center
        mailClubSubscribeIntl: getRandomCenteredPosition(2) // Right side
      };
    } catch (error) {
      console.error('Error getting random positions, using defaults:', error);
      return defaultPositions;
    }
  });

  // Update positions when viewport changes (orientation change, resize, etc.)
  React.useEffect(() => {
    const handleResize = () => {
      // Debug: Log viewport dimensions
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 375;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 667;
      console.log('Viewport dimensions:', { viewportWidth, viewportHeight });
      
      const newPositions = {
        mailClubAbout: getRandomCenteredPosition(0), // Left side
        mailClubSubscribe: getRandomCenteredPosition(1), // Center
        mailClubSubscribeIntl: getRandomCenteredPosition(2) // Right side
      };
      
      // Validate positions are within bounds
      const headerHeight = 44;
      const footerHeight = 80;
      const availableHeight = viewportHeight - headerHeight - footerHeight;
      
      if (newPositions.mailClubAbout.x < 0 || newPositions.mailClubAbout.x > viewportWidth - 100 ||
          newPositions.mailClubAbout.y < 60 || newPositions.mailClubAbout.y > viewportHeight - 180) {
        newPositions.mailClubAbout = getFallbackPosition(0);
      }
      
      if (newPositions.mailClubSubscribe.x < 0 || newPositions.mailClubSubscribe.x > viewportWidth - 100 ||
          newPositions.mailClubSubscribe.y < 60 || newPositions.mailClubSubscribe.y > viewportHeight - 180) {
        newPositions.mailClubSubscribe = getFallbackPosition(1);
      }
      
      if (newPositions.mailClubSubscribeIntl.x < 0 || newPositions.mailClubSubscribeIntl.x > viewportWidth - 100 ||
          newPositions.mailClubSubscribeIntl.y < 60 || newPositions.mailClubSubscribeIntl.y > viewportHeight - 180) {
        newPositions.mailClubSubscribeIntl = getFallbackPosition(2);
      }
      
      setIconPositions(newPositions);
    };

    // Debounce resize events
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="photos-page">
      <div className="about-header">
        <div className="terminal-buttons">
          <div className="terminal-button close" onClick={onClose}>
            <span className="close-icon">×</span>
          </div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
        </div>
        <div className="terminal-title">mail club</div>
      </div>
      <div className="photos-content">
        <DraggableIcon 
          name="mail club about" 
          initialX={iconPositions.mailClubAbout.x} 
          initialY={iconPositions.mailClubAbout.y} 
          onOpen={() => setShowNotesModal(true)}
          iconSrc="/icons/note-icon.png"
        />
        <DraggableIcon 
          name="sign up for monthly mailer (USA)" 
          initialX={iconPositions.mailClubSubscribe.x} 
          initialY={iconPositions.mailClubSubscribe.y} 
          onOpen={() => setShowStripeUSModal(true)}
          iconSrc="/icons/macOSfolder.png"
        />
        <DraggableIcon 
          name="sign up for monthly mailer (International)" 
          initialX={iconPositions.mailClubSubscribeIntl.x} 
          initialY={iconPositions.mailClubSubscribeIntl.y} 
          onOpen={() => setShowStripeModal(true)}
          iconSrc="/icons/macOSfolder.png"
        />
      </div>
      <div className="photos-footer">
        <div className="photos-logo">
          <img src="/egirl_logo.svg" alt="egirls logo" />
        </div>
      </div>
      {showNotesModal && (
        <NotesModal onClose={() => setShowNotesModal(false)} />
      )}
      {showStripeModal && (
        <StripeModal onClose={() => setShowStripeModal(false)} />
      )}
      {showStripeUSModal && (
        <StripeUSModal onClose={() => setShowStripeUSModal(false)} />
      )}
    </div>
  );
};

export default Photos;
