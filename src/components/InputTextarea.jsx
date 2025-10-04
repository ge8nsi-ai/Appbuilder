import React from 'react';

const InputTextarea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  rows = 4 
}) => {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>}
      </label>
      <textarea
        className="form-textarea"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        required={required}
      />
    </div>
  );
};

export default InputTextarea;