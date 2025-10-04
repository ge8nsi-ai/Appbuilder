import React from 'react';

const Alert = ({ type = 'info', message, children }) => {
  return (
    <div className={`alert alert-${type}`}>
      {message && <div>{message}</div>}
      {children}
    </div>
  );
};

export default Alert;