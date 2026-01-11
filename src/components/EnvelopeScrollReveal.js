import React, { useState, useEffect, useRef } from 'react';
import './EnvelopeScrollReveal.css';

const EnvelopeScrollReveal = () => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animationFrameRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [envelopeTopOffset, setEnvelopeTopOffset] = useState(400); // Default envelope height estimate
  const [stackHeight, setStackHeight] = useState(600); // Content stack height (varies by screen size)

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

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Measure front envelope top position and content stack height to align content items
  useEffect(() => {
    if (!sectionRef.current) return;

    const measureDimensions = () => {
      const frontEnvelope = sectionRef.current?.querySelector('.envelope-front');
      const contentStack = sectionRef.current?.querySelector('.content-stack');
      
      if (frontEnvelope && contentStack) {
        // Both front envelope and content stack use bottom: 0, so they share the same reference point
        const envelopeRect = frontEnvelope.getBoundingClientRect();
        const stackRect = contentStack.getBoundingClientRect();
        
        // Calculate envelope height (distance from envelope bottom to envelope top)
        const envelopeHeight = envelopeRect.height;
        
        // Measure actual content stack height (varies by screen size due to CSS media queries)
        const actualStackHeight = stackRect.height;
        
        // Since both use bottom: 0, envelope top is at envelopeHeight pixels from the stack bottom
        setEnvelopeTopOffset(envelopeHeight);
        setStackHeight(actualStackHeight);
      }
    };

    measureDimensions();
    
    // Use ResizeObserver for more accurate measurement on size changes
    const frontEnvelope = sectionRef.current?.querySelector('.envelope-front');
    const contentStack = sectionRef.current?.querySelector('.content-stack');
    
    let resizeObserver = null;
    if ((frontEnvelope || contentStack) && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        // Small delay to ensure CSS has updated
        setTimeout(measureDimensions, 10);
      });
      if (frontEnvelope) resizeObserver.observe(frontEnvelope);
      if (contentStack) resizeObserver.observe(contentStack);
    }
    
    window.addEventListener('resize', measureDimensions);
    
    // Also measure after image loads
    if (frontEnvelope) {
      frontEnvelope.addEventListener('load', measureDimensions);
    }

    // Measure after delays to catch late-loading images
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

  // Handle scroll progress with smooth interpolation
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const section = sectionRef.current;
    const scrollContainer = section.closest('.paper-trail-page');
    
    const SMOOTHING_FACTOR = 0.02; // Much lower for very smooth animation
    
    const handleScroll = () => {
      if (!section || !scrollContainer) return;
      
      const containerScrollTop = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;
      const totalScrollHeight = scrollContainer.scrollHeight;
      
      const maxScrollTop = Math.max(0, totalScrollHeight - containerHeight);
      const animationCompleteAt = maxScrollTop * 1.0; // Use full scroll distance
      const rawProgress = animationCompleteAt > 0
        ? Math.max(0, Math.min(1, containerScrollTop / animationCompleteAt))
        : 0;
      
      // Apply ease-out for consistent speed (faster at beginning, slower at end)
      // This prevents acceleration at the end and makes the beginning faster
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3); // Ease-out cubic
      
      targetProgressRef.current = easedProgress;
    };

    // Smooth interpolation loop
    const animate = () => {
      const currentProgress = currentProgressRef.current;
      const targetProgress = targetProgressRef.current;
      const difference = targetProgress - currentProgress;
      
      if (Math.abs(difference) > 0.0001) {
        const newProgress = currentProgress + (difference * SMOOTHING_FACTOR);
        currentProgressRef.current = newProgress;
        setScrollProgress(newProgress);
      } else {
        currentProgressRef.current = targetProgress;
        setScrollProgress(targetProgress);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Scroll handler
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

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('resize', handleScroll, { passive: true });

    // Remove wheel event handler - let normal scrolling work everywhere

    // Initial calculation
    handleScroll();
    setTimeout(() => handleScroll(), 50);
    setTimeout(() => handleScroll(), 200);
    setTimeout(() => handleScroll(), 500);

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', onScroll);
      }
      window.removeEventListener('resize', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion]);

  // Calculate item transform based on scroll progress
  const getItemTransform = (index, progress) => {
    const itemSegmentStart = index * (1 / totalItems);
    const itemSegmentEnd = (index + 1) * (1 / totalItems);
    
    const isActive = progress >= itemSegmentStart && progress < itemSegmentEnd;
    const isPrevious = progress >= itemSegmentEnd;
    const isUpcoming = progress < itemSegmentStart;
    
    const localProgress = isActive 
      ? (progress - itemSegmentStart) / (1 / totalItems)
      : isPrevious ? 1 : 0;
    
    // Items start with their top aligned to front envelope top
    // Content stack has variable height (stackHeight), items use top: 0 (top of stack = stackHeight from bottom)
    // Envelope top is at envelopeTopOffset from bottom
    // To align item top with envelope top: translate down by (stackHeight - envelopeTopOffset)
    const startingOffset = stackHeight - envelopeTopOffset; // Translate down to align tops
    
    // Items scroll upward until they're completely off screen behind header
    // Calculate distance needed: from envelope top to top of viewport (y=0) plus buffer
    // Envelope container is at bottom: calc(50vh - 230px), so envelope top is roughly at viewport center
    // Use viewport height as scroll distance to ensure items scroll completely off screen
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const scrollOffScreenDistance = viewportHeight + 200; // Enough distance to scroll completely off screen
    
    const translateY = startingOffset - (localProgress * scrollOffScreenDistance);
    
    // Scale: business card (index 0) is 70% smaller (30% of original size)
    // Poems (index 4-6) are 20% smaller (80% of original size)
    // All items stay at base scale - no scaling animation
    let baseScale = 1.0;
    if (index === 0) {
      baseScale = 0.3; // Business card: 70% smaller = 30% scale
    } else if (index >= 4 && index <= 6) {
      baseScale = 0.8; // Poems: 20% smaller = 80% scale
    }
    
    // No scaling animation - items stay at base scale
    const scale = baseScale;
    
    // Opacity: always fully opaque, no fading
    const opacity = 1.0;
    
    return {
      transform: `translateX(-50%) translateY(${translateY}px) scale(${scale})`,
      opacity,
      zIndex: contentItems[index].zIndex,
    };
  };

  // Reduced motion fallback
  if (prefersReducedMotion) {
    return (
      <section className="envelope-scroll-section reduced-motion" ref={sectionRef}>
        <div className="envelope-container">
          <div className="envelope-layers">
            <img 
              src="/letter-example/envelope-back.png" 
              alt="envelope back" 
              className="envelope-back"
            />
            <div className="content-stack-static">
              {contentItems.map((item, index) => (
                <img
                  key={index}
                  src={item.src}
                  alt={item.alt}
                  className="content-item-static"
                />
              ))}
            </div>
            <img 
              src="/letter-example/envelope-front.png" 
              alt="envelope front" 
              className="envelope-front"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="envelope-scroll-section" ref={sectionRef}>
      <div className="envelope-container">
        <div className="envelope-layers">
          {/* Back envelope - lowest z-index */}
          <img 
            src="/letter-example/envelope-back.png" 
            alt="envelope back" 
            className="envelope-back"
          />
          
          {/* Content stack - items positioned between front and back */}
          <div className="content-stack">
            {contentItems.map((item, index) => {
              const style = getItemTransform(index, scrollProgress);
              return (
                <img
                  key={index}
                  src={item.src}
                  alt={item.alt}
                  className="content-item"
                  style={style}
                />
              );
            })}
          </div>
          
          {/* Front envelope - highest z-index */}
          <img 
            src="/letter-example/envelope-front.png" 
            alt="envelope front" 
            className="envelope-front"
          />
        </div>
      </div>
      {/* Content mask - hides content below envelope */}
      <div className="envelope-content-mask" />
    </section>
  );
};

export default EnvelopeScrollReveal;
