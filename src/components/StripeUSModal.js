import React, { useEffect, useRef } from 'react';
import './StripeUSModal.css';

const StripeUSModal = ({ onClose }) => {
  const modalRef = useRef(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    // Load Stripe script if not already loaded
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      script.onload = () => {
        // Add a small delay to ensure the button renders
        setTimeout(() => setIsLoading(false), 1000);
      };
      document.head.appendChild(script);
    } else {
      // If Stripe is already loaded, just wait a bit for the button to render
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, []);

  return (
    <div className="stripe-us-modal-overlay" onClick={onClose}>
      <div className="stripe-us-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        {/* Title Bar */}
        <div className="stripe-us-title-bar">
          <div className="stripe-us-traffic-lights">
            <div className="traffic-light red" onClick={onClose}></div>
            <div className="traffic-light yellow"></div>
            <div className="traffic-light green"></div>
          </div>
          <div className="stripe-us-title">USA Subscription</div>
        </div>

        {/* Modal Content */}
        <div className="stripe-us-content">
          {isLoading ? (
            <div className="stripe-us-loading">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading payment options...</div>
            </div>
          ) : (
            <div className="stripe-us-buy-button-container">
              <stripe-buy-button
                buy-button-id="buy_btn_1SLsieFzEDOY92kDPPU9FBDz"
                publishable-key="pk_live_51SAZ4dFzEDOY92kDe1tp7AXtl50qMgxC8Jr0O4W5OEgZvFynm7eooUhKrTtqS0wa3GCNaEglo3FvorWrWrU7pvTu002umIcQ4n"
              >
              </stripe-buy-button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StripeUSModal;
