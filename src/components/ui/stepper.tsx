import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepperProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function Stepper({ currentStep, totalSteps, className }: StepperProps) {
  return (
    <div className={cn('flex items-center justify-between w-full', className)}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1
        const isActive = step === currentStep
        const isCompleted = step < currentStep

        return (
          <React.Fragment key={step}>
            <div className='flex flex-col items-center flex-1'>
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/30 bg-background text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className='h-5 w-5' />
                ) : (
                  <span className='text-sm font-semibold'>{step}</span>
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
                  isActive || isCompleted
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                Step {step}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  'h-0.5 flex-1 mx-2 transition-colors',
                  isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

