import React, { useState, useRef, useEffect } from 'react';

export default function Dropdown({ variant = 'form', placeholder, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking anywhere else on the page
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  // Handle selecting an option
  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false); // Close immediately upon selection
  };

  // Handle clearing the filter when the 'multiply' icon is clicked
  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className={`dropdown-container ${variant}`} ref={dropdownRef}>
      <div 
        className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        
        {/* Render 16x16 multiply icon if selected, else render the 10x5 chevron */}
        {value && variant === 'filter' ? (
          <svg onClick={handleClear} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, cursor: 'pointer' }}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
            <polyline points="1 1 5 5 9 1"></polyline>
          </svg>
        )}
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <div 
              key={opt.value} 
              className={`dropdown-item ${value === opt.value ? 'selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}