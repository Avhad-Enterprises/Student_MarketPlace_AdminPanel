import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select option",
  className = "",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    if (onChange) {
      onChange(optionValue);
    }
  };

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || placeholder;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full h-[44px] px-4 bg-white border rounded-xl
          text-sm font-medium text-left
          flex items-center justify-between
          transition-all duration-200
          ${isOpen
            ? 'border-[#7C5CFF] shadow-[0_0_0_3px_rgba(124,92,255,0.1)]'
            : 'border-[#E6E8EF] hover:border-[#7C5CFF]'
          }
          ${!selectedValue ? 'text-gray-400' : 'text-gray-700'}
        `}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          <div className="max-h-[280px] overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-4 py-2.5 text-sm text-left
                  transition-colors duration-150
                  ${selectedValue === option.value
                    ? 'bg-purple-50 text-purple-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
