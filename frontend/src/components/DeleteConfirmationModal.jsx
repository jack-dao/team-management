import React from 'react';

const CORAL = '#FF6663';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(180,188,200,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#F9FAFF',
          borderRadius: '10px',
          padding: '32px',
          width: '100%',
          maxWidth: '520px',
          height: '283px', // Exact Figma height
          boxSizing: 'border-box',
          boxShadow: '0 12px 48px rgba(0,0,0,0.10)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px', // Exact Figma gap
        }}
      >
        {/* Back button */}
        <button
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#040820',
            padding: 0, margin: 0,
            fontFamily: '"Open Sans", sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '120%',
            letterSpacing: '-0.011em', // -1.1%
            textAlign: 'center',
          }}
        >
          {/* 24x24 Arrow Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 1 }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>

        {/* Title */}
        <h2 style={{
          fontFamily: '"Open Sans", sans-serif',
          fontWeight: 700,
          fontSize: '30px',
          lineHeight: '120%',
          letterSpacing: '0%',
          textAlign: 'center',
          color: '#040820',
          margin: 0, // Margin removed to rely strictly on container gap: 12px
        }}>
          Delete Member?
        </h2>

        {/* Body text */}
        <p style={{
          fontFamily: '"Open Sans", sans-serif',
          fontWeight: 400,
          fontStyle: 'normal',
          fontSize: '14px',
          lineHeight: '120%',
          letterSpacing: '0%',
          textAlign: 'center',
          color: '#040820',
          margin: 0, // Margin removed to rely strictly on container gap: 12px
        }}>
          This will permanently remove this team member.<br />This action cannot be undone.
        </p>

        {/* Actions - Pushed to the bottom */}
        <div style={{ display: 'flex', gap: '20px', marginTop: 'auto' }}>
          {/* Cancel */}
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              border: `2.5px solid ${CORAL}`,
              borderRadius: '14px',
              background: 'transparent',
              color: CORAL,
              fontWeight: 700,
              fontSize: '17px',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,102,99,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Cancel
          </button>

          {/* Delete */}
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '14px',
              border: 'none',
              borderRadius: '14px',
              background: CORAL,
              color: '#fff',
              fontWeight: 700,
              fontSize: '17px',
              cursor: 'pointer',
              transition: 'filter 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.92)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'none'}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}