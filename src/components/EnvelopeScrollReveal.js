import React, { useState, useEffect, useRef } from 'react';
import './EnvelopeScrollReveal.css';

const EnvelopeScrollReveal = () => {
  const sectionRef = useRef(null);
  const maskRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgressRef = useRef(0); // Target progress from scroll input
  const currentProgressRef = useRef(0); // Current progress for interpolation
  const animationFrameRef = useRef(null); // RAF reference for cleanup
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [frontEnvelopeTop, setFrontEnvelopeTop] = useState(-150); // Default fallback, will be measured
  // Mask uses bottom: 0 positioning, so we only track height (not top)
  const [maskHeight, setMaskHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight * 0.4; // 40% of viewport height as initial default
    }
    return 400;
  });

  // Content items in reveal order (top to bottom)
  // Poems come out last, so they're at the end of the array
  const contentItems = [
    { src: '/letter-example/content-business-card..png', alt: 'business card' },
    { src: '/letter-example/content-postcard.png', alt: 'postcard' },
    { src: '/letter-example/content-letter-01.png', alt: 'letter 01' },
    { src: '/letter-example/content-letter-02.png', alt: 'letter 02' },
    { src: '/letter-example/content-poem-01.png', alt: 'poem 01' },
    { src: '/letter-example/content-poem-02.png', alt: 'poem 02' },
    { src: '/letter-example/content-poem-03.png', alt: 'poem 03' },
  ];

  const totalItems = contentItems.length;
  
  // Configuration
  const config = {
    itemsPerSegment: 1 / totalItems, // Each item gets equal scroll segment
    envelopeOffsetY: 0.15, // Envelope sits slightly below center for reveal space
    itemSpacing: 70, // Vertical spacing between items when fully revealed (px)
    maxRevealDistance: 400, // Max distance items travel upward (px)
    initialOffset: 40, // Starting position inside envelope (px from center)
    mobileScale: 0.85, // Scale down envelope on mobile
    activeScale: 1.08, // Scale up active item slightly
    previousScale: 0.85, // Scale down previous items
    previousOpacity: 0.5, // Opacity for previous items
  };

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Measure front envelope's actual top position to align content
  useEffect(() => {
    if (!sectionRef.current) return;

    const measureEnvelopeTop = () => {
      const frontEnvelope = sectionRef.current?.querySelector('.envelope-front');
      const contentStack = sectionRef.current?.querySelector('.content-stack');
      
      if (frontEnvelope && contentStack) {
        // Both front envelope and content stack are absolutely positioned with bottom: 0
        // They share the same parent (.envelope-layers), so bottom: 0 means the same reference point
        // Measure where the front envelope's top is, relative to where content items' bottom: 0 would be
        
        const frontRect = frontEnvelope.getBoundingClientRect();
        const stackRect = contentStack.getBoundingClientRect();
        
        // Content stack has bottom: 0, so stackRect.bottom is where content items' bottom would be
        // Front envelope also has bottom: 0, so frontRect.bottom should align with stackRect.bottom
        // The front envelope's top is at frontRect.top
        // So front envelope top is (stackRect.bottom - frontRect.top) pixels above the content stack bottom
        
        // Calculate front envelope's top position relative to content stack's bottom: 0
        const frontTopFromStackBottom = stackRect.bottom - frontRect.top;
        
        // Convert to negative value for translateY (above the bottom = negative translateY)
        const envelopeTopFromBottom = -frontTopFromStackBottom;
        
        console.log('Front envelope top measurement:', {
          frontTop: frontRect.top,
          stackBottom: stackRect.bottom,
          frontHeight: frontRect.height,
          frontTopFromStackBottom,
          envelopeTopFromBottom
        });
        
        setFrontEnvelopeTop(envelopeTopFromBottom);
      }
    };

    // Comprehensive inspection function for debugging
    const inspectMaskElement = () => {
      const maskElement = maskRef.current;
      if (!maskElement) {
        console.error('STEP 1: Mask element not found in DOM');
        return;
      }

      // STEP 1: Check if element exists and has size
      const maskRect = maskElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(maskElement);
      
      console.group('STEP 1: Mask Element Inspection');
      console.log('Element exists:', !!maskElement);
      console.log('Computed styles:', {
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity,
        position: computedStyle.position,
        top: computedStyle.top,
        left: computedStyle.left,
        right: computedStyle.right,
        bottom: computedStyle.bottom,
        width: computedStyle.width,
        height: computedStyle.height,
        zIndex: computedStyle.zIndex,
        transform: computedStyle.transform,
        background: computedStyle.background,
        backgroundColor: computedStyle.backgroundColor
      });
      console.log('Bounding rect:', {
        top: maskRect.top,
        left: maskRect.left,
        right: maskRect.right,
        bottom: maskRect.bottom,
        width: maskRect.width,
        height: maskRect.height
      });
      
      if (maskRect.height === 0 || maskRect.width === 0 || isNaN(maskRect.height) || isNaN(maskRect.width)) {
        console.error('❌ Mask has zero or invalid size!', {
          height: maskRect.height,
          width: maskRect.width,
          computedHeight: computedStyle.height,
          computedWidth: computedStyle.width,
          inlineStyle: maskElement.style.cssText
        });
      } else {
        console.log('✅ Mask has valid size');
      }
      console.groupEnd();

      // STEP 2: Check clipping by walking up ancestor tree
      console.group('STEP 2: Clipping Inspection');
      let current = maskElement.parentElement;
      let depth = 0;
      const maxDepth = 10;
      
      while (current && depth < maxDepth) {
        const style = window.getComputedStyle(current);
        const rect = current.getBoundingClientRect();
        const hasClipping = 
          style.overflow !== 'visible' ||
          style.overflowX !== 'visible' ||
          style.overflowY !== 'visible' ||
          style.clipPath !== 'none' ||
          style.clip !== 'auto' ||
          style.mask !== 'none' ||
          style.contain?.includes('layout') ||
          style.contain?.includes('paint');
        
        console.log(`Ancestor ${depth} (${current.className || current.tagName}):`, {
          overflow: style.overflow,
          overflowX: style.overflowX,
          overflowY: style.overflowY,
          clipPath: style.clipPath,
          clip: style.clip,
          mask: style.mask,
          contain: style.contain,
          position: style.position,
          transform: style.transform,
          height: style.height,
          maxHeight: style.maxHeight,
          boundingRect: {
            top: rect.top,
            bottom: rect.bottom,
            height: rect.height
          },
          hasClipping: hasClipping ? '⚠️ YES' : '✅ NO'
        });
        
        if (hasClipping) {
          console.warn(`⚠️ Ancestor ${depth} (${current.className || current.tagName}) has clipping!`);
        }
        
        if (current === document.body || current === document.documentElement) {
          break;
        }
        current = current.parentElement;
        depth++;
      }
      console.groupEnd();

      // STEP 3: Check stacking context
      console.group('STEP 3: Stacking Context Inspection');
      current = maskElement.parentElement;
      depth = 0;
      while (current && depth < maxDepth) {
        const style = window.getComputedStyle(current);
        const createsStackingContext = 
          style.position !== 'static' ||
          style.zIndex !== 'auto' ||
          style.transform !== 'none' ||
          style.filter !== 'none' ||
          style.opacity !== '1' ||
          style.isolation === 'isolate' ||
          style.willChange?.includes('transform') ||
          style.willChange?.includes('opacity') ||
          style.mixBlendMode !== 'normal';
        
        console.log(`Stacking context ${depth} (${current.className || current.tagName}):`, {
          position: style.position,
          zIndex: style.zIndex,
          transform: style.transform,
          filter: style.filter,
          opacity: style.opacity,
          isolation: style.isolation,
          willChange: style.willChange,
          mixBlendMode: style.mixBlendMode,
          createsStackingContext: createsStackingContext ? '⚠️ YES' : '✅ NO'
        });
        
        if (current === document.body || current === document.documentElement) {
          break;
        }
        current = current.parentElement;
        depth++;
      }
      
      // Check what's in front of the mask
      const maskZ = parseInt(computedStyle.zIndex) || 0;
      const allElements = document.elementsFromPoint(
        maskRect.left + maskRect.width / 2,
        maskRect.top + maskRect.height / 2
      );
      const elementsAbove = allElements.filter((el, idx) => {
        if (idx === 0) return false; // First is the topmost
        const elStyle = window.getComputedStyle(el);
        const elZ = parseInt(elStyle.zIndex) || 0;
        return elZ > maskZ && el !== maskElement;
      });
      
      console.log('Elements above mask at center point:', elementsAbove.map(el => ({
        tag: el.tagName,
        class: el.className,
        zIndex: window.getComputedStyle(el).zIndex
      })));
      console.groupEnd();
    };

    // Measure bottom content mask position - anchor at current top edge, extend to viewport bottom
    const measureMaskPosition = () => {
      const frontEnvelope = sectionRef.current?.querySelector('.envelope-front');
      const envelopeLayers = sectionRef.current?.querySelector('.envelope-layers');
      const maskElement = maskRef.current;
      const envelopeContainer = sectionRef.current?.querySelector('.envelope-reveal-container');
      
      if (frontEnvelope && envelopeLayers && envelopeContainer) {
        const frontRect = frontEnvelope.getBoundingClientRect();
        const layersRect = envelopeLayers.getBoundingClientRect();
        const containerRect = envelopeContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight; // Use viewport, not document!
        
        // Mask is fixed relative to viewport, bottom edge pinned to viewport bottom
        // frontRect.bottom is in viewport coordinates (front envelope bottom)
        // Mask top should be slightly above envelope front bottom (e.g., 20px above)
        // Height = viewport bottom (viewportHeight) - (envelope front bottom - small offset)
        const offsetAboveEnvelope = 20; // Mask top sits 20px above envelope front bottom
        const maskTopInViewport = frontRect.bottom - offsetAboveEnvelope;
        
        // Height needed: from mask top to viewport bottom
        // Since mask uses bottom: 0, height extends upward from bottom
        // Height = viewportHeight - maskTopInViewport
        const heightFromTopToBottom = viewportHeight - maskTopInViewport;
        
        // Always set values - mask is fixed relative to viewport with bottom: 0
        if (maskTopInViewport >= 0 && heightFromTopToBottom > 0) {
          // Only set height - mask uses bottom: 0 in CSS
          setMaskHeight(heightFromTopToBottom);
          
          // Run comprehensive inspection after setting values
          setTimeout(() => {
            inspectMaskElement();
          }, 0);
        } else {
          // Fallback: mask extends from slightly above envelope front bottom to viewport bottom
          const fallbackOffset = 20;
          const fallbackTop = Math.max(0, frontRect.bottom - fallbackOffset);
          const fallbackHeight = Math.max(300, viewportHeight - fallbackTop); // At least 300px tall
          setMaskHeight(fallbackHeight);
          
          console.warn('Mask position calculation failed, using fallback:', {
            fallbackTop,
            fallbackHeight,
            frontRect,
            viewportHeight
          });
          
          setTimeout(() => {
            inspectMaskElement();
          }, 0);
        }
      } else {
        // If elements not found yet, set a reasonable default that will be updated when measurement runs
        const defaultHeight = window.innerHeight * 0.4; // 40% of viewport height as fallback
        setMaskHeight(Math.max(300, defaultHeight));
        
        console.warn('Front envelope or layers not found, using default mask height:', {
          defaultHeight,
          hasFrontEnvelope: !!frontEnvelope,
          hasLayers: !!envelopeLayers
        });
      }
    };

    // Measure after images load
    measureEnvelopeTop();
    measureMaskPosition();
    
    // Run inspection on initial load
    setTimeout(() => {
      inspectMaskElement();
    }, 500);
    
    window.addEventListener('resize', () => {
      measureEnvelopeTop();
      measureMaskPosition();
      // Re-inspect after resize
      setTimeout(() => {
        inspectMaskElement();
      }, 100);
    });
    
    // Measure when front envelope image loads
    const frontEnvelope = sectionRef.current?.querySelector('.envelope-front');
    if (frontEnvelope) {
      frontEnvelope.addEventListener('load', () => {
        measureEnvelopeTop();
        measureMaskPosition();
      });
    }
    
    // Also measure after delays to catch late-loading images
    const timeoutIds = [
      setTimeout(() => {
        measureEnvelopeTop();
        measureMaskPosition();
      }, 100),
      setTimeout(() => {
        measureEnvelopeTop();
        measureMaskPosition();
      }, 500),
      setTimeout(() => {
        measureEnvelopeTop();
        measureMaskPosition();
      }, 1000),
    ];

    return () => {
      window.removeEventListener('resize', measureEnvelopeTop);
      if (frontEnvelope) {
        frontEnvelope.removeEventListener('load', measureEnvelopeTop);
      }
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  // Handle scroll progress with smooth interpolation
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const section = sectionRef.current;
    
    // Find the scrollable parent (paper-trail-page)
    const scrollContainer = section.closest('.paper-trail-page');
    
    // Smooth interpolation factor - lower values (0.05-0.1) = smoother, more weighted feel
    // Higher values (0.2-0.3) = more responsive, less lag
    // Tune this value to adjust smoothness: lower = smoother but more lag, higher = more responsive
    const SMOOTHING_FACTOR = 0.08;
    
    const handleScroll = () => {
      if (!section || !scrollContainer) return;
      
      const containerScrollTop = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;
      const totalScrollHeight = scrollContainer.scrollHeight;
      
      // Calculate scroll progress - consistent, slow, linear scroll
      const maxScrollTop = Math.max(0, totalScrollHeight - containerHeight);
      
      // Slow down animation by using a larger completion threshold
      // Animation completes at 85% of scroll distance for slower, more consistent speed
      const animationCompleteAt = maxScrollTop * 0.85;
      const targetProgress = animationCompleteAt > 0
        ? Math.max(0, Math.min(1, containerScrollTop / animationCompleteAt))
        : 0;
      
      // Store target progress - smooth interpolation happens in RAF loop
      targetProgressRef.current = targetProgress;
    };

    // Smooth interpolation loop - interpolates current progress toward target progress
    const animate = () => {
      const currentProgress = currentProgressRef.current;
      const targetProgress = targetProgressRef.current;
      
      // Calculate difference between current and target
      const difference = targetProgress - currentProgress;
      
      // If difference is significant, interpolate smoothly
      if (Math.abs(difference) > 0.0001) {
        // Linear interpolation (lerp): current + (target - current) * factor
        const newProgress = currentProgress + (difference * SMOOTHING_FACTOR);
        currentProgressRef.current = newProgress;
        setScrollProgress(newProgress);
      } else {
        // Snap to target when very close (prevents infinite tiny updates)
        currentProgressRef.current = targetProgress;
        setScrollProgress(targetProgress);
      }
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Optimized scroll handler - use RAF throttling to prevent glitches
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
    
    // Listen for wheel events to ensure scroll works when hovering over envelope/content
    const handleWheel = (e) => {
      if (!scrollContainer || !section) return;
      
      // Check if wheel event is over the envelope area
      const envelopeContainer = section.querySelector('.envelope-reveal-container');
      if (envelopeContainer) {
        const rect = envelopeContainer.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        // If mouse is over the envelope area, manually scroll the container
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          e.preventDefault();
          e.stopPropagation();
          // Use smooth scroll for less glitchy behavior
          scrollContainer.scrollTop += e.deltaY * 0.5; // Slower scroll for consistency
          onScroll(); // Trigger scroll handler immediately
        }
      }
    };
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    // Initial calculation - run multiple times to ensure it catches up
    handleScroll();
    setTimeout(() => {
      handleScroll();
    }, 50);
    setTimeout(() => {
      handleScroll();
    }, 200);
    setTimeout(() => {
      handleScroll();
    }, 500); // Additional delay to catch up after images load

    // Start smooth interpolation animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', onScroll);
      }
      window.removeEventListener('resize', handleScroll);
      document.removeEventListener('wheel', handleWheel, { capture: true });
      ticking = false;
      // Cancel animation frame on cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion]);

  // Calculate item transform based on scroll progress
  const getItemTransform = (index, progress) => {
    const itemSegmentStart = index * config.itemsPerSegment;
    const itemSegmentEnd = (index + 1) * config.itemsPerSegment;
    
    // Determine if item is active, previous, or upcoming
    const isActive = progress >= itemSegmentStart && progress < itemSegmentEnd;
    const isPrevious = progress >= itemSegmentEnd;
    const isUpcoming = progress < itemSegmentStart;
    
    // Calculate local progress within this item's segment (0-1)
    const localProgress = isActive 
      ? (progress - itemSegmentStart) / config.itemsPerSegment
      : isPrevious ? 1 : 0;
    
    // Linear progress for consistent, slow scroll speed throughout
    // No easing - linear interpolation for uniform speed
    const easedProgress = localProgress;
    
    // Base vertical position calculation:
    // Items are positioned from bottom: 0 with transform: translate3d(-50%, Y, 0)
    // Negative translateY moves UP, positive moves DOWN (from bottom: 0)
    // Front envelope top is ~150px above the container bottom
    // On initial load (progress = 0), content should NOT go above the front envelope top
    // Content should be positioned INSIDE the envelope, with tops at or below the front envelope top
    
    // Content positioning logic:
    // Items are positioned from bottom: 0 with transform-origin: center bottom
    // translateY moves items up (negative) or down (positive) from the bottom
    // Front envelope top is approximately 150px above the container bottom
    // On initial load (progress = 0), content should NOT go above the front envelope top
    
    // The front envelope has z-index 20, so it will visually cover content below it
    // But to ensure proper behavior, we position content so it starts INSIDE the envelope
    // Content should only move above the front envelope when scrolling (progress > 0)
    
    // Position items so their TOP edge aligns with the FRONT envelope TOP on initial load
    // Front envelope top is measured relative to content stack bottom: 0 (negative value, e.g., -150px)
    // But now content items use top: 0 positioning, so we need to convert this
    
    // With top: 0 and transform-origin: center top:
    // - Items naturally have top at 0 (relative to content stack top)
    // - Front envelope top is at envelopeTopLine relative to content stack bottom
    // - Content stack has height ~450px, so envelope top at -150px from bottom = ~300px from top
    // - We need to position item top at the same position as front envelope top
    
    // Get content stack height - use viewport height directly for consistency
    // The stack has height: 100vh, so we use window.innerHeight directly
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const stackHeight = viewportHeight; // Stack is 100vh, so height = viewport height
    
    // Convert envelopeTopLine from bottom-relative to top-relative
    // envelopeTopLine is negative (e.g., -150px from bottom)
    // Top position = stackHeight + envelopeTopLine (e.g., 800 + (-150) = 650px from top)
    const envelopeTopLine = (frontEnvelopeTop && frontEnvelopeTop < 0) ? frontEnvelopeTop : -150;
    const envelopeTopFromTop = stackHeight + envelopeTopLine;
    
    // Position items so their top aligns with front envelope top
    // With top: 0, translateY moves from top, so translateY = envelopeTopFromTop - 0 = envelopeTopFromTop
    const startOffset = envelopeTopFromTop;
    
    // When scrolling (progress > 0), items move UP above the front envelope
    // End position: items scroll off screen behind header
    const headerHeight = 48;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const scrollOffScreenDistance = screenHeight + headerHeight + 200;
    const endOffset = startOffset - scrollOffScreenDistance; // Move up (more negative)
    
    // Linear interpolation: when progress=0, items are at startOffset (at envelope top)
    // When progress=1, items are at endOffset (scrolled off screen)
    const baseOffset = startOffset + (endOffset - startOffset) * easedProgress;
    
    // Previous items stack above as they're revealed
    const itemsAbove = isPrevious ? (index + 1) : 0;
    const stackSpacing = isPrevious ? itemsAbove * config.itemSpacing : 0;
    
    // Final translateY: base position adjusted for stacking
    const translateY = baseOffset - stackSpacing;
    
    // Rotation: subtle rotation for realism, more for poems
    let rotation = 0;
    if (isActive || isPrevious) {
      if (index >= 4 && index <= 6) { // Poems (now at indices 4-6)
        rotation = (index % 2 === 0 ? -1 : 1) * (8 * (1 - localProgress));
      } else if (index === 1) { // Postcard
        rotation = 4 * (1 - localProgress);
      } else { // Business card and letters stay straighter
        rotation = (index % 2 === 0 ? -1 : 1) * (2 * (1 - localProgress));
      }
    }
    
    // Scale
    // Business card (index 0) is 60% smaller (40% of original size)
    // Postcard (index 1) stays at 100%
    // Letters 01 and 02 (index 2-3) are slightly less wide than postcard but wider than poems (85% scale)
    // Poems (index 4-6) are 30% smaller (70% of original size)
    let baseScale = 1.0;
    if (index === 0) {
      baseScale = 0.4; // Business card: 60% smaller = 40% scale
    } else if (index >= 2 && index <= 3) {
      baseScale = 0.85; // Letters 01 and 02: 15% smaller = 85% scale (slightly less than postcard, wider than poems)
    } else if (index >= 4 && index <= 6) {
      baseScale = 0.7; // Poems: 30% smaller = 70% scale
    }
    
    let scale = baseScale;
    if (isActive) {
      scale = baseScale * (1 + (config.activeScale - 1) * easedProgress);
    } else if (isPrevious) {
      scale = baseScale * config.previousScale;
    }
    
    // Opacity - no transparency, always fully opaque
    const opacity = 1;
    
    // Transform: translate from bottom, rotate, scale
    // Z-index hierarchy (within content-stack's stacking context):
    // - Content-stack: z-index 5 (between back:1 and front:20)
    // - Items inside stack relative to each other (z-index 1-7, first item highest)
    // - Envelope back: z-index 1 (below content)
    // - Envelope front: z-index 20 (above content)
    // - Header: z-index 1000 (top)
    
    // Content items stack within the content-stack container
    // First item (index 0) should be on top, so highest z-index
    const itemZIndex = 1 + (totalItems - index); // Range: 1-7 for 7 items
    
    return {
      transform: `translate3d(-50%, ${translateY}px, 0) rotate(${rotation}deg) scale(${scale})`,
      opacity,
      zIndex: itemZIndex,
    };
  };

  // Reduced motion fallback: static layout
  if (prefersReducedMotion) {
    return (
      <section className="envelope-scroll-section reduced-motion" ref={sectionRef}>
        <div className="envelope-reveal-container">
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
      <div className="envelope-reveal-container">
        <div className="envelope-layers">
          {/* Layer 1: Envelope Back */}
          <img 
            src="/letter-example/envelope-back.png" 
            alt="envelope back" 
            className="envelope-back"
            onError={(e) => console.error('Failed to load envelope-back:', e.target.src)}
            onLoad={() => console.log('Envelope back loaded')}
          />
          
          {/* Layer 2: Content Stack */}
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
                  onError={(e) => console.error('Failed to load content item:', item.src, e)}
                />
              );
            })}
          </div>
          
          {/* Layer 3: Envelope Front (overlay) */}
          <img 
            src="/letter-example/envelope-front.png" 
            alt="envelope front" 
            className="envelope-front"
            onError={(e) => console.error('Failed to load envelope-front:', e.target.src)}
            onLoad={() => console.log('Envelope front loaded')}
          />
        </div>
      </div>
      
      {/* Layer 4: Bottom Mask - moved outside transformed container to use viewport-relative fixed positioning */}
      {/* Only this element is moved; envelope remains unchanged */}
      {/* Uses bottom: 0 positioning so height extends upward from viewport bottom */}
      <div 
        ref={maskRef}
        className="bottom-content-mask" 
        style={{ 
          bottom: '0px',
          height: `${maskHeight}px`,
          display: 'block',
          visibility: 'visible',
          opacity: 1
        }}
      ></div>
    </section>
  );
};

export default EnvelopeScrollReveal;
