import React, { useState, useEffect, useRef } from 'react';

export default function TeamTable({ members, onDelete, onEdit, query, filterFunction, filterRole }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

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

  // Determine the exact empty state message
  if (!members || members.length === 0) {
    let emptyMsg = "Add your first team member to get started and start collaborating.";
    if (query) {
      emptyMsg = "No team members match your search";
    } else if (filterFunction || filterRole) {
      emptyMsg = "No team members match the selected filters";
    }

    return (
      <div className="table-wrap">
        <div className="table-head">
          <span></span> {/* Empty Avatar Header */}
          <span>Name</span>
          <span>Function</span>
          <span>Role</span>
          <span></span> {/* Empty Actions Header */}
        </div>
        <div className="empty-state">{emptyMsg}</div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <div className="table-head">
        <span></span>
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
          {/* Column 1: Avatar */}
          <div className="cell-avatar">
            <div className="avatar">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                 <circle cx="12" cy="7" r="4"></circle>
               </svg>
            </div>
          </div>
          
          {/* Column 2: Name */}
          <div className="cell-name">
            {member.fullName}
          </div>
          
          {/* Column 3: Function */}
          <div className="cell-function">
            <span className="badge badge-func">{formatEnum(member.function)}</span>
          </div>

          {/* Column 4: Role */}
          <div className="cell-role">
             <span className={`badge badge-${member.role ? member.role.toLowerCase() : ''}`}>
               {formatEnum(member.role)}
             </span>
          </div>

          {/* Column 5: Actions */}
          <div className="cell-actions" style={{ position: 'relative' }}>
            <button 
              className={`menu-btn ${openMenuId === member.id ? 'active' : ''}`}
              onClick={(e) => handleMenuClick(member.id, e)}
            >
              {/* more-vertical-1 icon 20x20 */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#040820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="19" r="2" />
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