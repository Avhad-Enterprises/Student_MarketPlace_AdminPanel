import React from 'react';
import { Circle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

// ============================================
// 9️⃣ VISUAL CHANGE INDICATORS (GLOBAL)
// ============================================

/**
 * Small dot indicator for unpublished changes
 * Can be placed next to section names, theme button, page names, etc.
 */
export const UnpublishedChangeDot: React.FC<{ 
  show?: boolean;
  position?: 'left' | 'right';
}> = ({ show = false, position = 'left' }) => {
  if (!show) return null;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`inline-flex ${position === 'left' ? 'mr-1.5' : 'ml-1.5'}`}>
          <Circle 
            size={6} 
            className="text-orange-500 fill-orange-500 cursor-help" 
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        Unpublished changes
      </TooltipContent>
    </Tooltip>
  );
};

/**
 * Modified Section Indicator (for left sidebar)
 * Shows a dot before the section name
 */
export const ModifiedSectionIndicator: React.FC<{
  hasChanges?: boolean;
}> = ({ hasChanges = false }) => {
  return <UnpublishedChangeDot show={hasChanges} position="left" />;
};

/**
 * Modified Theme Indicator (for Theme button)
 * Shows a dot on the theme settings button
 */
export const ModifiedThemeIndicator: React.FC<{
  hasChanges?: boolean;
}> = ({ hasChanges = false }) => {
  return <UnpublishedChangeDot show={hasChanges} position="right" />;
};

/**
 * Modified Page Indicator (for page selector/dropdown)
 * Shows a dot next to the page name
 */
export const ModifiedPageIndicator: React.FC<{
  hasChanges?: boolean;
}> = ({ hasChanges = false }) => {
  return <UnpublishedChangeDot show={hasChanges} position="right" />;
};

/**
 * Change Summary Badge
 * Shows number of unpublished changes (optional, more detailed)
 */
export const UnpublishedChangesBadge: React.FC<{
  count: number;
  show?: boolean;
}> = ({ count, show = true }) => {
  if (!show || count === 0) return null;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full cursor-help">
          <Circle size={4} className="fill-orange-600" />
          {count} {count === 1 ? 'change' : 'changes'}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">
        {count} unpublished {count === 1 ? 'change' : 'changes'}
      </TooltipContent>
    </Tooltip>
  );
};

/**
 * Demo usage in Section Row Component:
 * 
 * <div className="flex items-center gap-2">
 *   <ModifiedSectionIndicator hasChanges={section.hasUnpublishedChanges} />
 *   <span>{section.name}</span>
 * </div>
 */

/**
 * Demo usage in Theme Button:
 * 
 * <button>
 *   <Settings size={18} />
 *   <span>Theme</span>
 *   <ModifiedThemeIndicator hasChanges={themeHasChanges} />
 * </button>
 */

/**
 * Demo usage in Page Selector:
 * 
 * <select>
 *   <option>
 *     Home Page
 *     {homePageHasChanges && ' •'}
 *   </option>
 * </select>
 * 
 * Or with explicit component:
 * 
 * <div className="flex items-center gap-2">
 *   <span>Home Page</span>
 *   <ModifiedPageIndicator hasChanges={homePageHasChanges} />
 * </div>
 */
