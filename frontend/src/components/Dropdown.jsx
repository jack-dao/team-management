import React, { useState, useRef, useEffect } from 'react';

export default function Dropdown({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  variant = 'form' // 'form' (modal) or 'filter' (table header)
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const selectedOption = options.find(o => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div 
      className={`dropdown-container ${variant}`} 
      ref={wrapperRef}
    >
      <div 
        className={`dropdown-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        <svg 
          width="13" 
          height="13" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          viewBox="0 0 24 24"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          {variant === 'filter' && (
            <div className="dropdown-item" onClick={() => handleSelect('')}>
              All
            </div>
          )}
          {options.map((option) => (
            <div 
              key={option.value} 
              className={`dropdown-item ${option.value === value ? 'selected' : ''}`} 
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}