import React from 'react';

const StepIndicator = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="step-nav">
      <div className="step-indicator">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={`step-dot ${
                step < currentStep ? 'completed' : 
                step === currentStep ? 'active' : ''
              }`}
            />
            {index < steps.length - 1 && (
              <div
                className={`step-line ${
                  step < currentStep ? 'completed' : ''
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;