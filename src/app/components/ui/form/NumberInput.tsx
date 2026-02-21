/**
 * NUMBER INPUT COMPONENT
 * 
 * Enhanced number input with increment/decrement buttons
 * 
 * Features:
 * - Increment/decrement buttons
 * - Min/max constraints
 * - Step value
 * - Decimal precision
 * - Format display (currency, percentage)
 */

import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  format?: 'number' | 'currency' | 'percentage';
  currencySymbol?: string;
  disabled?: boolean;
  helperText?: string;
  error?: string;
}

// ============================================
// COMPONENT
// ============================================

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  label,
  min,
  max,
  step = 1,
  precision = 0,
  format = 'number',
  currencySymbol = '$',
  disabled = false,
  helperText,
  error,
}) => {
  const [localValue, setLocalValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  
  // Update local value when prop value changes
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(formatValue(value));
    }
  }, [value, isFocused]);
  
  // Format value based on format type
  const formatValue = (num: number): string => {
    const fixed = num.toFixed(precision);
    
    switch (format) {
      case 'currency':
        return `${currencySymbol}${fixed}`;
      case 'percentage':
        return `${fixed}%`;
      default:
        return fixed;
    }
  };
  
  // Parse value from string
  const parseValue = (str: string): number => {
    // Remove formatting characters
    const cleaned = str.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Constrain value within min/max bounds
  const constrainValue = (num: number): number => {
    let constrained = num;
    
    if (min !== undefined && constrained < min) {
      constrained = min;
    }
    
    if (max !== undefined && constrained > max) {
      constrained = max;
    }
    
    // Round to precision
    const multiplier = Math.pow(10, precision);
    constrained = Math.round(constrained * multiplier) / multiplier;
    
    return constrained;
  };
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setLocalValue(inputValue);
    
    const parsed = parseValue(inputValue);
    const constrained = constrainValue(parsed);
    
    if (!isNaN(parsed)) {
      onChange(constrained);
    }
  };
  
  // Handle increment
  const handleIncrement = () => {
    const newValue = constrainValue(value + step);
    onChange(newValue);
  };
  
  // Handle decrement
  const handleDecrement = () => {
    const newValue = constrainValue(value - step);
    onChange(newValue);
  };
  
  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    setLocalValue(formatValue(value));
  };
  
  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number when focused
    setLocalValue(value.toFixed(precision));
  };
  
  const canDecrement = min === undefined || value > min;
  const canIncrement = max === undefined || value < max;
  
  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative flex items-center">
        {/* Decrement Button */}
        <button
          onClick={handleDecrement}
          disabled={disabled || !canDecrement}
          className={`
            absolute left-1 z-10 w-9 h-9 rounded-lg
            flex items-center justify-center
            transition-colors
            ${disabled || !canDecrement
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-gray-100 active:bg-gray-200'
            }
          `}
          aria-label="Decrement"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        
        {/* Input */}
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            w-full h-11 px-12 rounded-lg border text-center font-medium
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            transition-all
            ${error 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}
          `}
        />
        
        {/* Increment Button */}
        <button
          onClick={handleIncrement}
          disabled={disabled || !canIncrement}
          className={`
            absolute right-1 z-10 w-9 h-9 rounded-lg
            flex items-center justify-center
            transition-colors
            ${disabled || !canIncrement
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-gray-100 active:bg-gray-200'
            }
          `}
          aria-label="Increment"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
      
      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
      
      {/* Min/Max Info */}
      {(min !== undefined || max !== undefined) && (
        <p className="text-xs text-gray-400">
          {min !== undefined && `Min: ${formatValue(min)}`}
          {min !== undefined && max !== undefined && ' • '}
          {max !== undefined && `Max: ${formatValue(max)}`}
        </p>
      )}
    </div>
  );
};
