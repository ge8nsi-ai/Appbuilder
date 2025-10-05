import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../utils/index.js'

const StepIndicator = ({ 
  steps, 
  currentStep, 
  completedSteps = [] 
}) => {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = completedSteps.includes(stepNumber)
        const isCurrent = stepNumber === currentStep
        const isPending = stepNumber > currentStep && !isCompleted

        return (
          <div key={stepNumber} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'step',
                  {
                    'active': isCurrent,
                    'completed': isCompleted,
                    'pending': isPending
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              <span className={cn(
                'mt-2 text-xs font-medium text-center max-w-20',
                {
                  'text-whop-600': isCurrent || isCompleted,
                  'text-gray-400': isPending
                }
              )}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-4',
                {
                  'bg-whop-600': isCompleted,
                  'bg-gray-200': !isCompleted
                }
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default StepIndicator