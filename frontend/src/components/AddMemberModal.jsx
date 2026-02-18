import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';

export default function AddMemberModal({ isOpen, onClose, onAdd, functionOptions, roleOptions }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    function: '',
    role: ''
  });
  
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ fullName: '', email: '', function: '', role: '' });
      setEmailError(false);
    }
  }, [isOpen]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, email: val });
    if (val.length > 0) setEmailError(!validateEmail(val));
    else setEmailError(false);
  };

  const isFormValid = formData.fullName.trim() && formData.email.trim() && !emailError && formData.function && formData.role;

  const handleSubmit = () => {
    if (isFormValid) {
      // CORRECTED: Keys must match Java field names "function" and "role"
      onAdd({
        fullName: formData.fullName,
        email: formData.email,
        function: formData.function,
        role: formData.role
      });
    }
  };

  const fOpts = functionOptions || [
    { label: "Marketing & Sales", value: "MARKETING_SALES" },
    { label: "Product", value: "PRODUCT" },
    { label: "Engineering", value: "ENGINEERING" },
    { label: "IT", value: "IT" },
  ];
  
  const rOpts = roleOptions || [
    { label: "Admin", value: "ADMIN" },
    { label: "Contributor", value: "CONTRIBUTOR" },
  ];

  if (!isOpen) return null;

  return (
    <div className="overlay open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Add Team Member</div>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="field">
          <label htmlFor="mName">Name</label>
          <input 
            type="text" 
            id="mName" 
            placeholder="Full name"
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
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
          <Dropdown 
            variant="form"
            placeholder="Select Function"
            options={fOpts}
            value={formData.function}
            onChange={(val) => setFormData({...formData, function: val})}
          />
        </div>

        <div className="field">
          <label>Role</label>
          <Dropdown 
            variant="form"
            placeholder="Select Role"
            options={rOpts}
            value={formData.role}
            onChange={(val) => setFormData({...formData, role: val})}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-add" disabled={!isFormValid} onClick={handleSubmit}>Add to Team</button>
        </div>
      </div>
    </div>
  );
}