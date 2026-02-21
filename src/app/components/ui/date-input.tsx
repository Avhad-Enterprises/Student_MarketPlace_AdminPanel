/**
 * NATIVE DATE INPUT COMPONENT SYSTEM
 * 
 * A reusable date input component that uses browser's native date picker
 * while maintaining full visual consistency with the admin dashboard design.
 * 
 * FEATURES:
 * - Native date picker (type="date")
 * - Full visual customization
 * - Label & helper text system
 * - Calendar icon integration
 * - Multiple states (default, hover, focused, error, disabled)
 * - Validation support
 * - Responsive variants
 * - Accessibility compliant
 * 
 * USAGE:
 * 
 * import { DateInput } from '@/components/ui/date-input';
 * 
 * <DateInput
 *   label="Date of Birth"
 *   value={date}
 *   onChange={setDate}
 *   required
 *   helperText="Select your date of birth"
 * />
 */

import React, { forwardRef, useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { cn } from './utils';

// ============================================
// TYPES
// ============================================

export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text displayed above the input */
  label?: string;

  /** Helper text displayed below the input */
  helperText?: string;

  /** Error message (takes precedence over helperText) */
  error?: string;

  /** Show required indicator (*) */
  required?: boolean;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Responsive size (auto-adjusts based on screen) */
  responsive?: boolean;

  /** Show calendar icon */
  showIcon?: boolean;

  /** Custom class for container */
  containerClassName?: string;

  /** Custom class for label */
  labelClassName?: string;

  /** Custom class for helper text */
  helperClassName?: string;

  /** Min date (YYYY-MM-DD format) */
  min?: string;

  /** Max date (YYYY-MM-DD format) */
  max?: string;

  /** Disable future dates */
  disableFuture?: boolean;

  /** Disable past dates */
  disablePast?: boolean;

  /** Custom validation function */
  validate?: (value: string) => string | null;

  /** Callback fired on value change */
  onValueChange?: (value: string) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      size = 'md',
      responsive = false,
      showIcon = true,
      containerClassName,
      labelClassName,
      helperClassName,
      className,
      disabled,
      value,
      onChange,
      onValueChange,
      min,
      max,
      disableFuture,
      disablePast,
      validate,
      id,
      placeholder = 'dd-mm-yyyy',
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `date-input-${Math.random().toString(36).substr(2, 9)}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    // Internal state
    const [isFocused, setIsFocused] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);

    // Determine final error message
    const finalError = error || internalError;
    const hasError = !!finalError;

    // Auto-calculate min/max based on disableFuture/disablePast
    const today = new Date().toISOString().split('T')[0];
    const finalMin = disablePast ? today : min;
    const finalMax = disableFuture ? today : max;

    // Size classes
    const sizeClasses = {
      sm: 'h-10 text-xs px-3',
      md: 'h-12 text-sm px-3.5',
      lg: 'h-14 text-base px-4',
    };

    // Responsive classes
    const responsiveClasses = responsive
      ? 'h-11 md:h-12 lg:h-12 text-sm'
      : sizeClasses[size];

    // Handle change with validation
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Custom validation
      if (validate) {
        const validationError = validate(newValue);
        setInternalError(validationError);
      } else {
        setInternalError(null);
      }

      // Call external handlers
      onChange?.(e);
      onValueChange?.(newValue);
    };

    return (
      <div className={cn('w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-xs font-medium text-gray-600 mb-1.5',
              disabled && 'text-gray-400',
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type="date"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            min={finalMin}
            max={finalMax}
            required={required}
            placeholder={placeholder}
            aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
            aria-invalid={hasError}
            className={cn(
              // Base styles
              'w-full rounded-[10px] border font-medium transition-all outline-none',
              'text-[#0f172b] placeholder:text-gray-400',
              responsiveClasses,

              // Icon padding
              showIcon && 'pr-10',

              // Default state
              !hasError && !isFocused && !disabled && [
                'border-gray-300 bg-white',
                'hover:border-gray-400',
              ],

              // Focused state
              !hasError && isFocused && [
                'border-purple-500 bg-white',
                'ring-2 ring-purple-500/20',
              ],

              // Error state
              hasError && [
                'border-red-500 bg-red-50/50',
                'ring-2 ring-red-500/10',
              ],

              // Disabled state
              disabled && [
                'border-gray-200 bg-gray-50',
                'text-gray-400 cursor-not-allowed',
              ],

              // Custom classes
              className
            )}
            {...props}
          />

          {/* Calendar Icon */}
          {showIcon && (
            <div
              className={cn(
                'absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none',
                'transition-colors duration-200'
              )}
            >
              <Calendar
                className={cn(
                  'w-4 h-4',
                  hasError && 'text-red-500',
                  isFocused && !hasError && 'text-purple-500',
                  !isFocused && !hasError && 'text-gray-500',
                  disabled && 'text-gray-400'
                )}
              />
            </div>
          )}
        </div>

        {/* Helper / Error Text */}
        {(helperText || hasError) && (
          <div className="mt-1.5 flex items-start gap-1.5">
            {hasError && (
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <p
              id={hasError ? errorId : helperId}
              className={cn(
                'text-[11px]',
                hasError ? 'text-red-500 font-medium' : 'text-gray-500',
                helperClassName
              )}
            >
              {hasError ? finalError : helperText}
            </p>
          </div>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

// ============================================
// PRESET VARIANTS
// ============================================

/** Date input for forms with standard styling */
export const FormDateInput = forwardRef<HTMLInputElement, DateInputProps>((props, ref) => (
  <DateInput ref={ref} size="md" {...props} />
));
FormDateInput.displayName = 'FormDateInput';

/** Compact date input for filters and toolbars */
export const CompactDateInput = forwardRef<HTMLInputElement, DateInputProps>((props, ref) => (
  <DateInput ref={ref} size="sm" showIcon={true} {...props} />
));
CompactDateInput.displayName = 'CompactDateInput';

/** Large date input for emphasis */
export const LargeDateInput = forwardRef<HTMLInputElement, DateInputProps>((props, ref) => (
  <DateInput ref={ref} size="lg" {...props} />
));
LargeDateInput.displayName = 'LargeDateInput';

/** Responsive date input that adapts to screen size */
export const ResponsiveDateInput = forwardRef<HTMLInputElement, DateInputProps>((props, ref) => (
  <DateInput ref={ref} responsive={true} {...props} />
));
ResponsiveDateInput.displayName = 'ResponsiveDateInput';

// ============================================
// DATE RANGE COMPONENT
// ============================================

export interface DateRangeInputProps {
  /** Start date label */
  startLabel?: string;

  /** End date label */
  endLabel?: string;

  /** Start date value */
  startValue?: string;

  /** End date value */
  endValue?: string;

  /** Callback for start date change */
  onStartChange?: (value: string) => void;

  /** Callback for end date change */
  onEndChange?: (value: string) => void;

  /** Show as inline (side by side) */
  inline?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Error message */
  error?: string;

  /** Helper text */
  helperText?: string;
}

export const DateRangeInput: React.FC<DateRangeInputProps> = ({
  startLabel = 'Start Date',
  endLabel = 'End Date',
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  inline = true,
  disabled = false,
  size = 'md',
  error,
  helperText,
}) => {
  const [internalError, setInternalError] = useState<string | null>(null);

  // Validate date range
  const validateRange = (start: string, end: string) => {
    if (start && end && start > end) {
      setInternalError('End date must be after start date');
    } else {
      setInternalError(null);
    }
  };

  const handleStartChange = (value: string) => {
    onStartChange?.(value);
    if (endValue) {
      validateRange(value, endValue);
    }
  };

  const handleEndChange = (value: string) => {
    onEndChange?.(value);
    if (startValue) {
      validateRange(startValue, value);
    }
  };

  const finalError = error || internalError;

  return (
    <div className="w-full">
      <div className={cn('flex gap-4', !inline && 'flex-col')}>
        <DateInput
          label={startLabel}
          value={startValue}
          onValueChange={handleStartChange}
          disabled={disabled}
          size={size}
          max={endValue} // Can't select start after end
          error={finalError || undefined}
        />
        <DateInput
          label={endLabel}
          value={endValue}
          onValueChange={handleEndChange}
          disabled={disabled}
          size={size}
          min={startValue} // Can't select end before start
          error={finalError || undefined}
        />
      </div>
      {helperText && !finalError && (
        <p className="mt-1.5 text-[11px] text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/** Format date to YYYY-MM-DD for input value */
export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/** Parse date from input value (YYYY-MM-DD) to Date object */
export const parseDateFromInput = (value: string): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

/** Format date for display (DD/MM/YYYY) */
export const formatDateForDisplay = (value: string): string => {
  if (!value) return '';
  const date = parseDateFromInput(value);
  if (!date) return value;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/** Get today's date in YYYY-MM-DD format */
export const getTodayDateString = (): string => {
  return formatDateForInput(new Date());
};

/** Calculate date offset (e.g., 30 days ago, 7 days from now) */
export const getDateOffset = (days: number, fromDate?: Date): string => {
  const date = fromDate || new Date();
  date.setDate(date.getDate() + days);
  return formatDateForInput(date);
};

// ============================================
// VALIDATION HELPERS
// ============================================

/** Validate date is not in the future */
export const validateNotFuture = (value: string): string | null => {
  if (!value) return null;
  const date = parseDateFromInput(value);
  if (!date) return 'Invalid date';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date > today) {
    return 'Date cannot be in the future';
  }
  return null;
};

/** Validate date is not in the past */
export const validateNotPast = (value: string): string | null => {
  if (!value) return null;
  const date = parseDateFromInput(value);
  if (!date) return 'Invalid date';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    return 'Date cannot be in the past';
  }
  return null;
};

/** Validate minimum age */
export const validateMinAge = (minAge: number) => (value: string): string | null => {
  if (!value) return null;
  const date = parseDateFromInput(value);
  if (!date) return 'Invalid date';

  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) ? age - 1 : age;

  if (actualAge < minAge) {
    return `Must be at least ${minAge} years old`;
  }
  return null;
};

/** Validate date is within range */
export const validateDateRange = (min: string, max: string) => (value: string): string | null => {
  if (!value) return null;

  if (min && value < min) {
    return `Date must be after ${formatDateForDisplay(min)}`;
  }

  if (max && value > max) {
    return `Date must be before ${formatDateForDisplay(max)}`;
  }

  return null;
};
