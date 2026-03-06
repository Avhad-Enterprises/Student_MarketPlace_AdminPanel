import React from 'react';
import { Info, AlertCircle, Circle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

// ============================================
// PART 6: UI HELPER COMPONENTS
// ============================================

// 5️⃣ DEFAULTS SYSTEM — USER EDUCATION
// Info Callout for Theme Tabs
export const DefaultsInfoCallout: React.FC = () => (
  <div className="mx-4 mt-4 mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-start gap-2">
      <Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>Default values are system-defined starting points.</strong> They cannot be edited directly but can be overridden by your custom values.
        </p>
      </div>
    </div>
  </div>
);

// 7️⃣ VISUAL CHANGE TRACKING SYSTEM
// Field Change Indicator (Dot)
export const FieldChangeIndicator: React.FC<{ isModified?: boolean }> = ({ isModified = false }) => {
  if (!isModified) return null;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex">
          <Circle size={6} className="text-orange-500 fill-orange-500 ml-1" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        Modified from default
      </TooltipContent>
    </Tooltip>
  );
};

// Section Changes Badge
export const SectionChangesBadge: React.FC<{ hasChanges?: boolean }> = ({ hasChanges = false }) => {
  if (!hasChanges) return null;
  
  return (
    <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">
      CHANGES MADE
    </span>
  );
};

// 8️⃣ PRESET + MANUAL EDIT INTERACTION
// Preset Override Warning
export const PresetOverrideWarning: React.FC = () => (
  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
    <div className="flex items-start gap-1.5">
      <AlertCircle size={12} className="text-yellow-600 flex-shrink-0 mt-0.5" />
      <p className="text-[10px] text-yellow-800 leading-relaxed">
        This change will override the preset value
      </p>
    </div>
  </div>
);

// Default Label Tooltip
export const DefaultLabel: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-1">
    <span className="text-xs font-medium text-gray-700">{label}</span>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex">
          <Info size={12} className="text-gray-400" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        Defaults cannot be edited. They can be overridden.
      </TooltipContent>
    </Tooltip>
  </div>
);

// Modified Preset Badge
export const ModifiedPresetBadge: React.FC = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full">
        <Circle size={6} className="fill-yellow-600" />
        MODIFIED
      </div>
    </TooltipTrigger>
    <TooltipContent side="top">
      Preset applied, but individual values changed
    </TooltipContent>
  </Tooltip>
);

// Applied Preset Badge
export const AppliedPresetBadge: React.FC = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
        APPLIED
      </span>
    </TooltipTrigger>
    <TooltipContent side="top">
      Currently active preset
    </TooltipContent>
  </Tooltip>
);

// System Default Badge
export const SystemDefaultBadge: React.FC = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
        DEFAULT
      </span>
    </TooltipTrigger>
    <TooltipContent side="top">
      System default preset
    </TooltipContent>
  </Tooltip>
);

// Custom Preset Badge
export const CustomPresetBadge: React.FC = () => (
  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">
    CUSTOM
  </span>
);
