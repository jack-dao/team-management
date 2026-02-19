import React from 'react';

export default function ErrorDialog({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="error-overlay">
      <div className="error-dialog">
        <div className="error-icon-badge">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#FF6663" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <div className="error-text-content">
          <h2 className="error-title">
            Something Went Wrong
          </h2>
          <p className="error-message">
            We encountered an unexpected issue while processing your request. Please try again or contact <span className="error-email">support@complama.com</span>.
          </p>
        </div>

        <button className="btn-primary error-btn" onClick={onClose}>
          Back to Home
        </button>
      </div>
    </div>
  );
}