import React from 'react';
import './EnvelopeTestPlaceholder.css';

/**
 * TEST COMPONENT - Simple placeholder to test positioning
 * This replaces EnvelopeScrollReveal temporarily to isolate positioning issues
 * 
 * Expected position: Just above .paper-trail-description (which is at top: calc(50% + 250px))
 * The envelope should sit just above this text, so roughly at top: 50% or slightly above
 */
const EnvelopeTestPlaceholder = () => {
  return (
    <div className="envelope-test-container">
      <div className="envelope-test-box">
        TEST BOX
      </div>
    </div>
  );
};

export default EnvelopeTestPlaceholder;
