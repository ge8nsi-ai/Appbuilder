import React from 'react'
import { cn } from '../../utils/index.js'

const Input = React.forwardRef(({ 
  className, 
  type = 'text', 
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'input-field',
        error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input