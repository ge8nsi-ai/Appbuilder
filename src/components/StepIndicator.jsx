import React from 'react'
import { Check, Sparkles, Zap, Rocket, Target } from 'lucide-react'
import { cn } from '../utils/index.js'

const stepIcons = {
  1: Sparkles,
  2: Target,
  3: Zap,
  4: Rocket,
  5: Check
}

const StepIndicator = ({ 
  steps, 
  currentStep, 
  completedSteps = [] 
}) => {
  return (
    <div className="relative">
      {/* Background line */}
      <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full"></div>
      
      {/* Progress line */}
      <div 
        className="absolute top-8 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
        style={{ 
          width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
        }}
      ></div>

      <div className="step-indicator relative z-10">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = completedSteps.includes(stepNumber)
          const isCurrent = stepNumber === currentStep
          const isPending = stepNumber > currentStep && !isCompleted
          const Icon = stepIcons[stepNumber] || Check

          return (
            <div key={stepNumber} className="flex flex-col items-center group">
              <div
                className={cn(
                  'step relative z-20 group-hover:scale-110 transition-all duration-300',
                  {
                    'active pulse-glow': isCurrent,
                    'completed': isCompleted,
                    'pending': isPending
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="h-6 w-6" />
                ) : isCurrent ? (
                  <Icon className="h-6 w-6" />
                ) : (
                  <span className="text-lg font-bold">{stepNumber}</span>
                )}
                
                {/* Ripple effect for current step */}
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></div>
                )}
              </div>
              
              <div className="mt-4 text-center">
                <span className={cn(
                  'text-sm font-semibold transition-all duration-300',
                  {
                    'text-blue-600': isCurrent,
                    'text-green-600': isCompleted,
                    'text-slate-400': isPending
                  }
                )}>
                  {step}
                </span>
                
                {/* Step description */}
                <div className="mt-1 text-xs text-slate-500 max-w-24">
                  {stepNumber === 1 && 'Enter keywords'}
                  {stepNumber === 2 && 'Choose concept'}
                  {stepNumber === 3 && 'Generate content'}
                  {stepNumber === 4 && 'Publish course'}
                  {stepNumber === 5 && 'Launch assets'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StepIndicator