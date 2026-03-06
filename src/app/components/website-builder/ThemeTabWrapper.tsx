import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { DefaultsInfoCallout } from './ThemeUIHelpers';
import { ResetToDefaultsModal } from './PresetModals';

// ============================================
// PART 6: THEME TAB WRAPPER WITH DEFAULTS EDUCATION
// ============================================

interface ThemeTabWrapperProps {
  children: React.ReactNode;
  sectionName: string;
  onReset?: () => void;
}

export const ThemeTabWrapper: React.FC<ThemeTabWrapperProps> = ({ 
  children, 
  sectionName,
  onReset 
}) => {
  const [showResetModal, setShowResetModal] = useState(false);

  const handleReset = () => {
    onReset?.();
    setShowResetModal(false);
  };

  return (
    <div>
      {/* 5️⃣ DEFAULTS SYSTEM — USER EDUCATION */}
      <DefaultsInfoCallout />

      {/* Tab Content */}
      {children}

      {/* 6️⃣ RESET TO DEFAULTS — MODELED BEHAVIOR */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => setShowResetModal(true)}
              className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} />
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            Resets all values in this section only
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <ResetToDefaultsModal
          sectionName={sectionName}
          onClose={() => setShowResetModal(false)}
          onConfirm={handleReset}
        />
      )}
    </div>
  );
};

// Enhanced Reset Button Component (for individual sections within tabs)
export const ResetButton: React.FC<{ 
  sectionName: string;
  onReset?: () => void;
}> = ({ sectionName, onReset }) => {
  const [showResetModal, setShowResetModal] = useState(false);

  const handleReset = () => {
    onReset?.();
    setShowResetModal(false);
  };

  return (
    <>
      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => setShowResetModal(true)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium"
            >
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            Resets all values in this section only
          </TooltipContent>
        </Tooltip>
      </div>

      {showResetModal && (
        <ResetToDefaultsModal
          sectionName={sectionName}
          onClose={() => setShowResetModal(false)}
          onConfirm={handleReset}
        />
      )}
    </>
  );
};
