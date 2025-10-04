import React from 'react';
import App from '../App';

// Mock WhopProvider for development - will be replaced with real @whop/react in production
const WhopProvider = ({ children }) => {
  return <>{children}</>;
};

const WhopAppWrapper = () => {
  return (
    <WhopProvider>
      <App />
    </WhopProvider>
  );
};

export default WhopAppWrapper;