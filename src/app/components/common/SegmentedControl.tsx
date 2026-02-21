import React, { useState } from 'react';

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  defaultValue,
  onChange,
  name
}) => {
  const [selected, setSelected] = useState(defaultValue || options[0]?.value || "");

  const handleSelect = (value: string) => {
    setSelected(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleSelect(option.value)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${selected === option.value
              ? 'bg-white text-gray-900 shadow-sm font-semibold'
              : 'bg-transparent text-gray-600 hover:text-gray-900'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
