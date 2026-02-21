/**
 * SEARCH INPUT COMPONENT
 * 
 * Standardized search input for all overview pages
 * 
 * Features:
 * - Search icon prefix
 * - Clear button
 * - Loading indicator
 * - Debounced input (300ms)
 * - Recent searches (optional)
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Loader2, Clock } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  debounce?: number;
  showRecent?: boolean;
  disabled?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const SearchInput: React.FC<SearchInputProps> = ({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder = 'Search...',
  loading = false,
  debounce = 300,
  showRecent = false,
  disabled = false,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(controlledValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Update local value when controlled value changes
  useEffect(() => {
    if (controlledValue !== undefined) {
      setLocalValue(controlledValue);
    }
  }, [controlledValue]);
  
  // Debounced onChange
  const debouncedOnChange = useCallback((value: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      onChange(value);
      if (onSearch) {
        onSearch(value);
      }
    }, debounce);
  }, [onChange, onSearch, debounce]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    debouncedOnChange(value);
  };
  
  // Handle clear
  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (onSearch) {
      onSearch('');
    }
    inputRef.current?.focus();
  };
  
  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  const showClearButton = localValue.length > 0 && !loading;
  
  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <Search 
        size={20} 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" 
      />
      
      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full h-[50px] bg-white rounded-xl border shadow-sm
          pl-12 pr-12 text-base font-medium text-gray-700
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
          transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isFocused ? 'border-purple-300' : 'border-gray-200'}
        `}
      />
      
      {/* Right Side Icons */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {loading && (
          <Loader2 size={20} className="text-purple-600 animate-spin" />
        )}
        
        {showClearButton && (
          <button
            onClick={handleClear}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};
