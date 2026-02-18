import React from 'react';
import './InputField.css';

export default function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error = '',
  disabled = false,
  onBlur
}) {
  const hasError = Boolean(error);

  const wrapperStyle = {
    width: 480,
    display: 'flex',
    flexDirection: 'column'
  };

  const labelStyle = {
    fontSize: 14,
    fontWeight: 700,
    color: hasError ? '#FF6663' : '#040820',
    marginBottom: 10
  };

  const inputStyle = {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 25,
    paddingRight: 20,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: hasError ? '#FF6663' : '#7F818F',
    borderRadius: 40,
    fontSize: 14,
    color: hasError ? '#FF6663' : (value ? '#040820' : '#7F818F'),
    backgroundColor: '#F9FAFF',
    outline: 'none',
    boxSizing: 'border-box',
    opacity: disabled ? 0.6 : 1
  };

  const errorStyle = {
    marginTop: 8,
    fontSize: 14,
    color: '#FF6663'
  };

  const inputClassName = hasError ? 'tmInput tmInputError' : 'tmInput';

  return (
    <div style={wrapperStyle}>
      <label style={labelStyle} htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        className={inputClassName}
        style={inputStyle}
      />

      {hasError ? <div style={errorStyle}>{error}</div> : null}
    </div>
  );
}
