import React, { useState, useEffect, useRef } from 'react';
import { useMotionValue, useTransform, motion } from 'framer-motion';
import './EnvelopeScrollRevealMobile.css';

const EnvelopeScrollRevealMobile = () => {
  const sectionRef = useRef(null);
  const [envelopeTopOffset, setEnvelopeTopOffset] = useState(400);
  const [stackHeight, setStackHeight] = useState(600);
  const [viewportHeight, setViewportHeight] = useState(800);
  
  // Use refs for values that need to be read in transforms
  const startingOffsetRef = useRef(0);
  const scrollOffScreenDistanceRef = useRef(1000);
  
  // Update refs when state changes
  useEffect(() => {
    startingOffsetRef.current = stackHeight - envelopeTopOffset;
    scrollOffScreenDistanceRef.current = viewportHeight + 200;
  }, [stackHeight, envelopeTopOffset, viewportHeight]);

  // Content items in order (front to back in z-index)
  const contentItems = [
    { src: '/letter-example/content-business-card..png', alt: 'business card', zIndex: 8 },
    { src: '/letter-example/content-postcard.png', alt: 'postcard', zIndex: 7 },
    { src: '/letter-example/content-letter-01.png', alt: 'letter 01', zIndex: 6 },
    { src: '/letter-example/content-letter-02.png', alt: 'letter 02', zIndex: 5 },
    { src: '/letter-example/content-poem-01.png', alt: 'poem 01', zIndex: 4 },
    { src: '/letter-example/content-poem-02.png', alt: 'poem 02', zIndex: 3 },
    { src: '/letter-example/content-poem-03.png', alt: 'poem 03', zIndex: 2 },
  ];

  const totalItems = contentItems.length;

  // Motion value for scroll progress (0 to 1)
  const scrollProgressMotionValue = useMotionValue(0);
  const smoothProgress = scrollProgressMotionValue;

  // Get viewport height using visualViewport API for mobile
  useEffect(() => {
    const updateViewportHeight = () => {
      if (typeof window !== 'undefined') {
        const height = window.visualViewport?.height || window.innerHeight;
        setViewportHeight(height);
      }
    };
    
    updateViewportHeight();
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
    }
    window.addEventListener('resize', updateViewportHeight);
    
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight);
      }
      window.removeEventListener('resize', updateViewportHeight);
    };
  }, []);

  // Measure front envelope top position and content stack height
  useEffect(() => {
    if (!sectionRef.current) return;

    const measureDimensions = () => {
      const frontEnvelope = sectionRef.current?.querySelector('.envelope-mobile-front');
      const contentStack = sectionRef.current?.querySelector('.envelope-mobile-content-stack');
      
      if (frontEnvelope && contentStack) {
        const envelopeRect = frontEnvelope.getBoundingClientRect();
        const stackRect = contentStack.getBoundingClientRect();
        
        setEnvelopeTopOffset(envelopeRect.height);
        setStackHeight(stackRect.height);
      }
    };

    measureDimensions();
    
    const frontEnvelope = sectionRef.current?.querySelector('.envelope-mobile-front');
    const contentStack = sectionRef.current?.querySelector('.envelope-mobile-content-stack');
    
    let resizeObserver = null;
    if ((frontEnvelope || contentStack) && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        setTimeout(measureDimensions, 10);
      });
      if (frontEnvelope) resizeObserver.observe(frontEnvelope);
      if (contentStack) resizeObserver.observe(contentStack);
    }
    
    window.addEventListener('resize', measureDimensions);
    
    if (frontEnvelope) {
      frontEnvelope.addEventListener('load', measureDimensions);
    }

    const timeouts = [100, 500, 1000].map(delay => 
      setTimeout(measureDimensions, delay)
    );

    return () => {
      if (resizeObserver) {
        if (frontEnvelope) resizeObserver.unobserve(frontEnvelope);
        if (contentStack) resizeObserver.unobserve(contentStack);
      }
      window.removeEventListener('resize', measureDimensions);
      if (frontEnvelope) {
        frontEnvelope.removeEventListener('load', measureDimensions);
      }
      timeouts.forEach(id => clearTimeout(id));
    };
  }, []);

  // Track scroll on the container and update motion value
  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const scrollContainer = section.closest('.paper-trail-page');
    
    if (!scrollContainer) return;
    
    const handleScroll = () => {
      if (!section || !scrollContainer) return;
      
      const containerScrollTop = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;
      const totalScrollHeight = scrollContainer.scrollHeight;
      
      const maxScrollTop = Math.max(0, totalScrollHeight - containerHeight);
      const progress = maxScrollTop > 0
        ? Math.max(0, Math.min(1, containerScrollTop / maxScrollTop))
        : 0;
      
      scrollProgressMotionValue.set(progress);
    };

    // Throttled scroll handler
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    handleScroll();
    setTimeout(() => handleScroll(), 50);
    setTimeout(() => handleScroll(), 200);
    setTimeout(() => handleScroll(), 500);

    return () => {
      scrollContainer.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [scrollProgressMotionValue]);

  // Create transforms for each content item (must be at top level - hooks rule)
  const item0Y = useTransform(smoothProgress, (progress) => {
    const itemSegmentStart = 0 * (1 / totalItems);
    const itemSegmentEnd = 1 * (1 / totalItems);
    const localProgress = progress < itemSegmentStart ? 0 : progress > itemSegmentEnd ? 1 : (progress - itemSegmentStart) / (itemSegmentEnd - itemSegmentStart);
    return startingOffsetRef.current - (localProgress * scrollOffScreenDistanceRef.current);
  });
  
  const item1Y = useTransform(smoothProgress, (progress) => {
    const itemSegmentStart = 1 * (1 / totalItems);
    const itemSegmentEnd = 2 * (1 / totalItems);
    const localProgress = progress < itemSegmentStart ? 0 : progress > itemSegmentEnd ? 1 : (progress - itemSegmentStart) / (itemSegmentEnd - itemSegmentStart);
    return startingOffsetRef.current - (localProgress * scrollOffScreenDistanceRef.current);
  });
  
  const item2Y = useTransform(smoothProgress, (progress) => {
    const itemSegmentStart = 2 * (1 / totalItems);
    const itemSegmentEnd = 3 * (1 / totalItems);
    const localProgress = progress < itemSegmentStart ? 0 : progress > itemSegmentEnd ? 1 : (progress - itemSegmentStart) / (itemSegmentEnd - itemSegmentStart);
    return startingOffsetRef.current - (localProgress * scrollOffScreenDistanceRef.current);
  });
  
  const item3Y = useTransform(smoothProgress, (progress) => {
    const itemSegmentStart = 3 * (1 / totalItems);
    const itemSegmentEnd = 4 * (1 / totalItems);
    const localProgress = progress < itemSegmentStart ? 0 : progress > itemSegmentEnd ? 1 : (progress - itemSegmentStart) / (itemSegmentEnd - itemSegmentStart);
    return startingOffsetRef.current - (localProgress * scrollOffScreenDistanceRef.current);
  });
  
  const item4Y = useTransform(smoothProgress, (progress) => {
    const itemSegmentStart = 4 * (1 / totalItems);
    const itemSegmentEnd = 5 * (1 / totalItems);
    const localProgress = progress < itemSegmentStart ? 0 : progress > itemSegmentEnd ? 1 : (progress - itemSegmentStart) / (itemSegmentEnd - itemSegmentStart);
    return startingOffsetRef.current - (localProgress * scrollOffScreenDistanceRef.current);
  });
  
  const item5Y = useTransform(smoothProgress, (progress) => {
    const itemSegmentStart = 5 * (1 / totalItems);
    const itemSegmentEnd = 6 * (1 / totalItems);
    const localProgress = progress < itemSegmentStart ? 0 : progress > itemSegmentEnd ? 1 : (progress - itemSegmentStart) / (itemSegmentEnd - itemSegmentStart);
    return startingOffsetRef.current - (localProgress * scrollOffScreenDistanceRef.current);
  });
  
  const item6Y = useTransform(smoothProgress, (progress) => {
    const itemSegmentStart = 6 * (1 / totalItems);
    const itemSegmentEnd = 7 * (1 / totalItems);
    const localProgress = progress < itemSegmentStart ? 0 : progress > itemSegmentEnd ? 1 : (progress - itemSegmentStart) / (itemSegmentEnd - itemSegmentStart);
    return startingOffsetRef.current - (localProgress * scrollOffScreenDistanceRef.current);
  });
  
  const itemYTransforms = [item0Y, item1Y, item2Y, item3Y, item4Y, item5Y, item6Y];

  return (
    <section className="envelope-mobile-wrapper" ref={sectionRef}>
      <div className="envelope-mobile-container">
        <div className="envelope-mobile-layers">
          {/* Back envelope - lowest z-index */}
          <img 
            src="/letter-example/envelope-back.png" 
            alt="envelope back" 
            className="envelope-mobile-back"
          />
          
          {/* Content stack - items positioned between front and back */}
          <div className="envelope-mobile-content-stack">
            {contentItems.map((item, index) => {
              const itemY = itemYTransforms[index];
              
              // Scale: business card (index 0) is 70% smaller (30% of original size)
              // Poems (index 4-6) are 20% smaller (80% of original size)
              let baseScale = 1.0;
              if (index === 0) {
                baseScale = 0.3; // Business card: 70% smaller = 30% scale
              } else if (index >= 4 && index <= 6) {
                baseScale = 0.8; // Poems: 20% smaller = 80% scale
              }
              
              return (
                <motion.img
                  key={index}
                  src={item.src}
                  alt={item.alt}
                  className="envelope-mobile-content-item"
                  style={{
                    y: itemY,
                    scale: baseScale,
                    x: '-50%',
                    zIndex: item.zIndex,
                  }}
                />
              );
            })}
          </div>
          
          {/* Front envelope - highest z-index */}
          <img 
            src="/letter-example/envelope-front.png" 
            alt="envelope front" 
            className="envelope-mobile-front"
          />
        </div>
      </div>
      {/* Content mask - hides content below envelope */}
      <div className="envelope-mobile-content-mask" />
    </section>
  );
};

export default EnvelopeScrollRevealMobile;
