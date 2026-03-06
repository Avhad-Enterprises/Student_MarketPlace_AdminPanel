import React, { useState } from 'react';
import { Palette, Box, ChevronDown } from 'lucide-react';
import { DefaultsInfoCallout, FieldChangeIndicator, SectionChangesBadge } from './ThemeUIHelpers';
import { ResetButton } from './ThemeTabWrapper';

// ============================================
// DEMO: ENHANCED COLORS TAB WITH PART 6 FEATURES
// ============================================

// Simple Accordion for demo (or import from main file)
const Accordion: React.FC<{ 
  title: string; 
  icon: React.ElementType; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode 
}> = ({ title, icon: Icon, isOpen, onToggle, children }) => (
  <div className="bg-white border-b border-gray-200">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-gray-600" />
        <span className="text-sm font-semibold text-gray-700">{title}</span>
      </div>
      <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && <div className="px-4 py-3">{children}</div>}
  </div>
);

// Color Swatch Component with Change Indicator
const EnhancedColorSwatch: React.FC<{
  label: string;
  color: string;
  usage: string;
  isModified?: boolean;
  onReset?: () => void;
}> = ({ label, color, usage, isModified = false, onReset }) => (
  <div className="py-3 border-b border-gray-100 last:border-0">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
        <div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium text-gray-700">{label}</p>
            {/* 7️⃣ VISUAL CHANGE TRACKING - Field Indicator */}
            <FieldChangeIndicator isModified={isModified} />
          </div>
          <p className="text-xs text-gray-500">{usage}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input 
          type="text" 
          value={color} 
          readOnly
          className="w-24 px-2 py-1 text-xs font-mono border border-gray-200 rounded"
        />
        {isModified && onReset && (
          <button 
            onClick={onReset}
            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  </div>
);

// Enhanced Colors Tab Component (DEMO)
export const EnhancedColorsTabDemo: React.FC<{ 
  accordionStates: Record<string, boolean>; 
  toggleAccordion: (key: string) => void 
}> = ({ accordionStates, toggleAccordion }) => {
  // Track which sections have changes
  const [sectionChanges, setSectionChanges] = useState({
    brand_colors: true, // Has modifications
    neutral_palette: false,
  });

  return (
    <div>
      {/* 5️⃣ DEFAULTS SYSTEM — USER EDUCATION */}
      <DefaultsInfoCallout />

      {/* Brand Colors Card */}
      <Accordion 
        title="Brand Colors"
        icon={Palette} 
        isOpen={accordionStates.brand_colors} 
        onToggle={() => toggleAccordion('brand_colors')}
      >
        <div className="mb-3 pb-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Brand Identity</h4>
              <p className="text-xs text-gray-500">Primary colors representing your brand</p>
            </div>
            {/* 7️⃣ VISUAL CHANGE TRACKING - Section Badge */}
            <SectionChangesBadge hasChanges={sectionChanges.brand_colors} />
          </div>
        </div>
        
        {/* Color swatches with change indicators */}
        <EnhancedColorSwatch 
          label="Primary" 
          color="#0e042f" 
          usage="Used in buttons, links, headers" 
          isModified={true}
          onReset={() => console.log('Reset Primary')}
        />
        <EnhancedColorSwatch 
          label="Secondary" 
          color="#253154" 
          usage="Used in secondary buttons, accents" 
          isModified={false}
        />
        <EnhancedColorSwatch 
          label="Accent" 
          color="#8B5CF6" 
          usage="Used for highlights, CTAs" 
          isModified={true}
          onReset={() => console.log('Reset Accent')}
        />
        
        {/* 6️⃣ RESET TO DEFAULTS — MODELED BEHAVIOR */}
        <ResetButton 
          sectionName="Brand Colors" 
          onReset={() => {
            console.log('Reset Brand Colors section');
            setSectionChanges(prev => ({ ...prev, brand_colors: false }));
          }}
        />
      </Accordion>

      {/* Neutral Palette Card */}
      <Accordion 
        title="Neutral Palette"
        icon={Box} 
        isOpen={accordionStates.neutral_palette} 
        onToggle={() => toggleAccordion('neutral_palette')}
      >
        <div className="mb-3 pb-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Surface & Text Colors</h4>
              <p className="text-xs text-gray-500">Background, text, and UI element colors</p>
            </div>
            <SectionChangesBadge hasChanges={sectionChanges.neutral_palette} />
          </div>
        </div>
        
        <EnhancedColorSwatch label="Background" color="#FFFFFF" usage="Page background" />
        <EnhancedColorSwatch label="Surface" color="#F8FAFC" usage="Cards, panels" />
        <EnhancedColorSwatch 
          label="Border" 
          color="#E2E8F0" 
          usage="Dividers, borders" 
          isModified={false}
        />
        <EnhancedColorSwatch label="Text Primary" color="#1F2937" usage="Main text content" />
        <EnhancedColorSwatch label="Text Secondary" color="#6B7280" usage="Supporting text" />
        
        <ResetButton 
          sectionName="Neutral Palette" 
          onReset={() => {
            console.log('Reset Neutral Palette section');
            setSectionChanges(prev => ({ ...prev, neutral_palette: false }));
          }}
        />
      </Accordion>
    </div>
  );
};
