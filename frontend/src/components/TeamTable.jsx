import React, { useState, useEffect, useRef } from 'react';

export default function TeamTable({ members, onDelete, onEdit }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const formatEnum = (str) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  if (!members || members.length === 0) {
    return (
      <div className="table-wrap">
        <div className="table-head">
          <span>Name</span>
          <span>Function</span>
          <span>Role</span>
          <span></span>
        </div>
        <div className="empty-state">No team members found.</div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <div className="table-head">
        <span>Name</span>
        <span>Function</span>
        <span>Role</span>
        <span></span>
      </div>
      
      {members.map((member) => (
        <div 
          key={member.id} 
          className={`table-row ${openMenuId === member.id ? 'row-active' : ''}`}
        >
          <div className="member-name">
            <div className="avatar">
               {/* Person Icon */}
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                 <circle cx="12" cy="7" r="4"></circle>
               </svg>
            </div>
            {member.fullName}
          </div>
          
          <div>
            <span className="badge badge-func">{formatEnum(member.function)}</span>
          </div>

          <div>
             <span className={`badge badge-${member.role ? member.role.toLowerCase() : ''}`}>
               {formatEnum(member.role)}
             </span>
          </div>

          <div style={{ position: 'relative' }}>
            <button 
              className={`menu-btn ${openMenuId === member.id ? 'active' : ''}`}
              onClick={(e) => handleMenuClick(member.id, e)}
            >
              {/* Vertical Three Dots */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {openMenuId === member.id && (
              <div className="action-menu" ref={menuRef}>
                <div 
                  className="action-item" 
                  onClick={() => { 
                    if (onEdit) onEdit(member); 
                    setOpenMenuId(null); 
                  }}
                >
                  Edit
                </div>
                <div 
                  className="action-item delete" 
                  onClick={() => { 
                    onDelete(member.id); 
                    setOpenMenuId(null); 
                  }}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}