import React from 'react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search by Name or Email Address" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
    </div>
  );
}