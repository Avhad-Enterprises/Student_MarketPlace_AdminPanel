/**
 * COLOR PICKER COMPONENT
 * 
 * Branded replacement for native <input type="color">
 * 
 * Features:
 * - Brand color presets
 * - Recent colors (localStorage)
 * - Hex/RGB input
 * - Opacity slider
 * - Gradient selector (optional)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ChevronDown, Check, Droplet } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  presets?: string[];
  showRecent?: boolean;
  showOpacity?: boolean;
  showGradient?: boolean;
  disabled?: boolean;
}

// ============================================
// BRAND COLOR PRESETS
// ============================================

const DEFAULT_PRESETS = [
  '#8b5cf6', // Purple primary
  '#253154', // Dark purple
  '#0e042f', // Darkest purple
  '#a78bfa', // Light purple
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Orange
  '#ef4444', // Red
];

// ============================================
// COLOR UTILITIES
// ============================================

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

const isValidHex = (hex: string): boolean => {
  return /^#?([a-f\d]{6})$/i.test(hex);
};

// ============================================
// RECENT COLORS STORAGE
// ============================================

const STORAGE_KEY = 'color-picker-recent';
const MAX_RECENT = 8;

const getRecentColors = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addRecentColor = (color: string) => {
  try {
    const recent = getRecentColors();
    const filtered = recent.filter(c => c.toLowerCase() !== color.toLowerCase());
    const updated = [color, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
};

// ============================================
// COMPONENT
// ============================================

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  presets = DEFAULT_PRESETS,
  showRecent = true,
  showOpacity = false,
  showGradient = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [opacity, setOpacity] = useState(100);

  // Load recent colors
  useEffect(() => {
    if (showRecent) {
      setRecentColors(getRecentColors());
    }
  }, [showRecent]);

  // Update hex input when value changes
  useEffect(() => {
    setHexInput(value);
  }, [value]);

  // Handle color change
  const handleColorChange = useCallback((newColor: string) => {
    onChange(newColor);
    if (showRecent) {
      addRecentColor(newColor);
      setRecentColors(getRecentColors());
    }
  }, [onChange, showRecent]);

  // Handle hex input change
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setHexInput(input);

    // Validate and update if valid
    if (isValidHex(input)) {
      const normalized = input.startsWith('#') ? input : `#${input}`;
      handleColorChange(normalized);
    }
  };

  // Handle native color picker change
  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleColorChange(e.target.value);
  };

  // RGB values
  const rgb = hexToRgb(value);

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}

      {/* Color Display & Picker */}
      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full flex items-center gap-3 px-4 h-12 rounded-lg border border-gray-300
            hover:border-purple-400 transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {/* Color Swatch */}
          <div
            className="w-8 h-8 rounded border-2 border-gray-200 flex-shrink-0"
            style={{ backgroundColor: value }}
          />

          {/* Hex Value */}
          <span className="flex-1 text-left font-mono text-sm text-gray-700">
            {value.toUpperCase()}
          </span>

          {/* Icon */}
          <Palette className="w-5 h-5 text-gray-400" />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-4 space-y-4"
            >
              {/* Native Color Picker (Hidden) */}
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer">
                  <div
                    className="w-full h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-purple-400 transition-colors"
                    style={{ backgroundColor: value }}
                  />
                  <input
                    type="color"
                    value={value}
                    onChange={handleNativePickerChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>

                {/* Hex Input */}
                <input
                  type="text"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  placeholder="#000000"
                  className="flex-1 px-3 h-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                />
              </div>

              {/* RGB Display */}
              {rgb && (
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                  <span>RGB({rgb.r}, {rgb.g}, {rgb.b})</span>
                </div>
              )}

              {/* Opacity Slider */}
              {showOpacity && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-700">
                      Opacity
                    </label>
                    <span className="text-xs font-medium text-gray-900">
                      {opacity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              )}

              {/* Presets */}
              {presets.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">
                    Brand Colors
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handleColorChange(preset)}
                        className={`
                          w-full aspect-square rounded border-2 transition-all
                          hover:scale-110
                          ${preset.toLowerCase() === value.toLowerCase()
                            ? 'border-purple-600 ring-2 ring-purple-200'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                        style={{ backgroundColor: preset }}
                        title={preset}
                      >
                        {preset.toLowerCase() === value.toLowerCase() && (
                          <Check className="w-3 h-3 text-white mx-auto drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Colors */}
              {showRecent && recentColors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">
                    Recent Colors
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {recentColors.map((recent, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorChange(recent)}
                        className={`
                          w-full aspect-square rounded border-2 transition-all
                          hover:scale-110
                          ${recent.toLowerCase() === value.toLowerCase()
                            ? 'border-purple-600 ring-2 ring-purple-200'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                        style={{ backgroundColor: recent }}
                        title={recent}
                      >
                        {recent.toLowerCase() === value.toLowerCase() && (
                          <Check className="w-3 h-3 text-white mx-auto drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
