import React, { useState, useEffect, useRef } from 'react';

export default function AddMemberModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    function: '',
    role: ''
  });
  
  const [emailError, setEmailError] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleWrapRef = useRef(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ fullName: '', email: '', function: '', role: '' });
      setEmailError(false);
      setRoleDropdownOpen(false);
    }
  }, [isOpen]);

  // Click outside to close custom dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (roleWrapRef.current && !roleWrapRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, email: val });
    if (val.length > 0) {
      setEmailError(!validateEmail(val));
    } else {
      setEmailError(false);
    }
  };

  const isFormValid = 
    formData.fullName.trim() !== '' &&
    formData.email.trim() !== '' &&
    !emailError &&
    formData.function !== '' &&
    formData.role !== '';

  const handleSubmit = () => {
    if (isFormValid) {
      onAdd(formData);
    }
  };

  // Helper to display Role text properly
  const getRoleDisplay = () => {
    if (!formData.role) return 'Select Role';
    return formData.role.charAt(0) + formData.role.slice(1).toLowerCase();
  };

  if (!isOpen) return null;

  return (
    <div className="overlay open" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Add Team Member</div>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="field">
          <label htmlFor="mName">Name</label>
          <input 
            type="text" 
            id="mName" 
            placeholder="Full name"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>

        <div className="field">
          <label htmlFor="mEmail" className={emailError ? 'error-label' : ''}>Email Address</label>
          <input 
            type="email" 
            id="mEmail" 
            placeholder="email@company.com" 
            className={emailError ? 'error' : ''}
            value={formData.email}
            onChange={handleEmailChange}
          />
          {emailError && <div className="error-msg">Please enter a valid email address.</div>}
        </div>

        <div className="field">
          <label>Function</label>
          <div className="select-wrap">
            <select 
              id="mFunction" 
              value={formData.function}
              onChange={(e) => setFormData({...formData, function: e.target.value})}
            >
              <option value="" disabled>Select Function</option>
              <option value="MARKETING_SALES">Marketing & Sales</option>
              <option value="PRODUCT">Product</option>
              <option value="IT">IT</option>
              <option value="ENGINEERING">Engineering</option>
              {/* Added consistent backend ENUM values */}
            </select>
          </div>
        </div>

        <div className="field">
          <label>Role</label>
          <div className="custom-select-wrap" ref={roleWrapRef}>
            <div 
              className={`custom-select-trigger ${!formData.role ? 'placeholder' : ''} ${roleDropdownOpen ? 'open' : ''}`} 
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            >
              <span>{getRoleDisplay()}</span>
              <span className="chevron">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </div>
            
            {roleDropdownOpen && (
              <div className="custom-dropdown open">
                <div 
                  className={`dropdown-option ${formData.role === 'ADMIN' ? 'selected' : ''}`} 
                  onClick={() => { setFormData({...formData, role: 'ADMIN'}); setRoleDropdownOpen(false); }}
                >
                  Admin
                </div>
                <div 
                  className={`dropdown-option ${formData.role === 'CONTRIBUTOR' ? 'selected' : ''}`} 
                  onClick={() => { setFormData({...formData, role: 'CONTRIBUTOR'}); setRoleDropdownOpen(false); }}
                >
                  Contributor
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button 
            className="btn-add" 
            id="addBtn" 
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            Add to Team
          </button>
        </div>
      </div>
    </div>
  );
}