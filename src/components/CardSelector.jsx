import React from 'react';

const CardSelector = ({ 
  label, 
  options, 
  selectedValue, 
  onSelect, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <div className="loading">
          <div className="spinner"></div>
          <span>Generating course concepts...</span>
        </div>
      </div>
    );
  }

  if (!options || options.length === 0) {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <div className="alert alert-info">
          No course concepts available. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="card-selector">
        {options.map((option, index) => (
          <div
            key={index}
            className={`card ${selectedValue === index ? 'selected' : ''}`}
            onClick={() => onSelect(index)}
          >
            <h3 className="card-title">{option.course_name}</h3>
            <p className="card-description">{option.core_promise}</p>
            <div className="card-meta">
              <span className="card-audience">{option.target_audience}</span>
              <span className="card-price">${option.price_usd}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSelector;