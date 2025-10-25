import React from 'react';
import './Photos.css';
import NotesModal from '../components/NotesModal';
import MobileNotesPage from '../components/MobileNotesPage';

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
  const [showMobileNotes, setShowMobileNotes] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768;
      console.log('Mobile detection:', isMobileDevice, 'Width:', window.innerWidth);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Helper function to check if two positions overlap
  const checkOverlap = (pos1, pos2, minDistance = 120) => {
    const distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    return distance < minDistance;
  };

  // Helper function to generate mobile-specific positions (centered vertically, evenly spaced)
  const generateMobilePosition = (index, viewportWidth, viewportHeight, headerHeight, footerHeight) => {
    const iconWidth = 80;
    const iconHeight = 100;
    const totalIcons = 4;
    
    // Center the icons vertically in the available space
    const availableHeight = viewportHeight - headerHeight - footerHeight;
    const startY = headerHeight + (availableHeight - (totalIcons * 120)) / 2; // 120px spacing between icons
    
    // Center horizontally
    const centerX = (viewportWidth - iconWidth) / 2;
    
    return {
      x: centerX,
      y: startY + (index * 120) // 120px spacing between icons
    };
  };

  // Helper function to generate random position that doesn't overlap with existing positions
  const generateNonOverlappingPosition = (existingPositions, viewportWidth, viewportHeight, headerHeight, footerHeight) => {
    const maxAttempts = 50;
    const iconWidth = 80;
    const iconHeight = 100;
    const minDistance = 120;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = Math.max(20, Math.random() * (viewportWidth - iconWidth - 20));
      const y = Math.max(headerHeight + 20, Math.random() * (viewportHeight - footerHeight - iconHeight - 20));
      
      const newPos = { x, y };
      let hasOverlap = false;
      
      for (const existingPos of existingPositions) {
        if (checkOverlap(newPos, existingPos, minDistance)) {
          hasOverlap = true;
          break;
        }
      }
      
      if (!hasOverlap) {
        return newPos;
      }
    }
    
    // Fallback: return a position that might overlap but is at least visible
    return {
      x: Math.max(20, Math.random() * (viewportWidth - iconWidth - 20)),
      y: Math.max(headerHeight + 20, Math.random() * (viewportHeight - footerHeight - iconHeight - 20))
    };
  };

  // Use state to store positions and update them when viewport changes
  const [iconPositions, setIconPositions] = React.useState(() => {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1200;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;
    const headerHeight = 44;
    const footerHeight = 80;
    const isMobileDevice = viewportWidth <= 768;
    
    const positions = [];
    const iconNames = ['mailClubAbout', 'mailClubSubscribe', 'mailClubSubscribeIntl', 'mailClubManage'];
    
    if (isMobileDevice) {
      // Use mobile-specific positioning (centered, evenly spaced)
      for (let i = 0; i < iconNames.length; i++) {
        const position = generateMobilePosition(i, viewportWidth, viewportHeight, headerHeight, footerHeight);
        positions.push(position);
      }
    } else {
      // Generate non-overlapping positions for each icon (desktop)
      for (const iconName of iconNames) {
        const position = generateNonOverlappingPosition(positions, viewportWidth, viewportHeight, headerHeight, footerHeight);
        positions.push(position);
      }
    }
    
    return {
      mailClubAbout: positions[0],
      mailClubSubscribe: positions[1],
      mailClubSubscribeIntl: positions[2],
      mailClubManage: positions[3]
    };
  });

  // Update positions when viewport changes (orientation change, resize, etc.)
  React.useEffect(() => {
    const handleResize = () => {
      // Debug: Log viewport dimensions
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 375;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 667;
      const isMobileDevice = viewportWidth <= 768;
      console.log('Viewport dimensions:', { viewportWidth, viewportHeight, isMobileDevice });
      
      const headerHeight = 44;
      const footerHeight = 80;
      
      const positions = [];
      const iconNames = ['mailClubAbout', 'mailClubSubscribe', 'mailClubSubscribeIntl', 'mailClubManage'];
      
      if (isMobileDevice) {
        // Use mobile-specific positioning (centered, evenly spaced)
        for (let i = 0; i < iconNames.length; i++) {
          const position = generateMobilePosition(i, viewportWidth, viewportHeight, headerHeight, footerHeight);
          positions.push(position);
        }
      } else {
        // Generate non-overlapping positions for each icon (desktop)
        for (const iconName of iconNames) {
          const position = generateNonOverlappingPosition(positions, viewportWidth, viewportHeight, headerHeight, footerHeight);
          positions.push(position);
        }
      }
      
      const newPositions = {
        mailClubAbout: positions[0],
        mailClubSubscribe: positions[1],
        mailClubSubscribeIntl: positions[2],
        mailClubManage: positions[3]
      };
      
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
          name="about" 
          initialX={iconPositions.mailClubAbout.x} 
          initialY={iconPositions.mailClubAbout.y} 
          onOpen={() => {
            console.log('About icon clicked, isMobile:', isMobile);
            if (isMobile) {
              setShowMobileNotes(true);
            } else {
              setShowNotesModal(true);
            }
          }}
          iconSrc="/icons/note-icon.png"
        />
        <DraggableIcon 
          name="join monthly mail (USA)" 
          initialX={iconPositions.mailClubSubscribe.x} 
          initialY={iconPositions.mailClubSubscribe.y} 
          onOpen={() => window.open('https://buy.stripe.com/fZu6oH0ug5Nidw7bkpgYU02', '_blank')}
          iconSrc="/icons/mail-icon.png"
        />
        <DraggableIcon 
          name="join monthly mail (intl.)" 
          initialX={iconPositions.mailClubSubscribeIntl.x} 
          initialY={iconPositions.mailClubSubscribeIntl.y} 
          onOpen={() => window.open('https://buy.stripe.com/5kQ14n90Mb7C0Jl1JPgYU01', '_blank')}
          iconSrc="/icons/mail-icon.png"
        />
        <DraggableIcon 
          name="manage subscription" 
          initialX={iconPositions.mailClubManage.x} 
          initialY={iconPositions.mailClubManage.y} 
          onOpen={() => window.open('https://billing.stripe.com/p/login/5kQcN5dh25NigIjaglgYU00', '_blank')}
          iconSrc="/icons/setting-icon.png"
        />
      </div>
      <div className="photos-footer">
        <div className="photos-logo">
          <img src="/egirl_logo.svg" alt="egirls logo" />
        </div>
      </div>
      {showMobileNotes && (
        <MobileNotesPage onClose={() => setShowMobileNotes(false)} />
      )}
      {showNotesModal && (
        <NotesModal onClose={() => setShowNotesModal(false)} />
      )}
    </div>
  );
};

export default Photos;
