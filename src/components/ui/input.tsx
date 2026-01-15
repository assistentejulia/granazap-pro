import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className={cn(
        "relative flex w-full items-center rounded-xl bg-secondary/50 border border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all min-h-[48px]",
        className
      )}>
        {startIcon && (
          <div className="pl-3 md:pl-4 flex items-center justify-center text-muted-foreground">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex w-full flex-1 bg-transparent py-3 md:py-3 pl-3 pr-3 md:pr-4 text-base md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
            !startIcon && "pl-3 md:pl-4"
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <div className="pr-3 md:pr-4 flex items-center justify-center text-muted-foreground">
            {endIcon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
