import React from 'react';

export default function TeamTable({ members, onDelete }) {
  
  // Format enum values from backend (e.g., MARKETING_SALES -> Marketing & Sales)
  const formatFunction = (func) => {
    if (!func) return '';
    if (func === 'MARKETING_SALES') return 'Marketing & Sales';
    return func.charAt(0) + func.slice(1).toLowerCase();
  };

  const formatRole = (role) => {
    if (!role) return '';
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  // Badge class logic
  const getRoleBadgeClass = (role) => {
    return role === 'ADMIN' ? 'badge-admin' : 'badge-contributor';
  };

  return (
    <div className="table-wrap">
      <div className="table-head">
        <span>Name</span>
        <span>Function</span>
        <span>Role</span>
        <span></span>
      </div>

      {!members || members.length === 0 ? (
        <div className="empty-state">
          Add your first team member to get started and start collaborating.
        </div>
      ) : (
        <div id="tableBody">
          {members.map((m, i) => (
            <div 
              className="table-row" 
              key={m.id} 
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="member-name">
                <div className="avatar">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                {m.fullName}
              </div>
              
              <div>
                <span className="badge badge-func">{formatFunction(m.function)}</span>
              </div>
              
              <div>
                <span className={`badge ${getRoleBadgeClass(m.role)}`}>
                  {formatRole(m.role)}
                </span>
              </div>
              
              <div>
                <button className="menu-btn" onClick={() => onDelete(m.id)}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="5" cy="12" r="1.5"/>
                    <circle cx="12" cy="12" r="1.5"/>
                    <circle cx="19" cy="12" r="1.5"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}