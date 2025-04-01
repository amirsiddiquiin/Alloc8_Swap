import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightElement, label, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-2 text-sm transition-all duration-200 ease-in-out",
              "placeholder:text-gray-400 font-medium",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
              "dark:border-gray-700 dark:bg-gray-800 dark:text-white",
              "dark:focus:border-blue-400 dark:focus:ring-blue-900/30",
              "dark:placeholder:text-gray-500",
              icon ? "pl-10" : "",
              rightElement ? "pr-10" : "",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
