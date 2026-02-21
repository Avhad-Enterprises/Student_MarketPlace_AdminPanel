/**
 * DIRTY STATE INDICATORS
 * 
 * Visual indicators for unsaved changes across the application.
 * These components show users where they have pending edits.
 * 
 * VARIANTS:
 * - DotIndicator: Small colored dot
 * - UnsavedLabel: "Unsaved" text label
 * - DraftBadge: "Draft" badge
 * - TabIndicator: Dot on tab with optional pulse
 * - HeaderIndicator: Comprehensive header status
 */

import React from 'react';
import { Circle, AlertCircle, Clock, Save } from 'lucide-react';
import { motion } from 'framer-motion';

// ============================================
// DOT INDICATOR
// ============================================

export interface DotIndicatorProps {
  visible?: boolean;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'amber' | 'red' | 'blue' | 'green';
  position?: 'relative' | 'absolute';
  className?: string;
}

export const DotIndicator: React.FC<DotIndicatorProps> = ({
  visible = true,
  pulse = true,
  size = 'sm',
  color = 'amber',
  position = 'relative',
  className = '',
}) => {
  if (!visible) return null;

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const colorClasses = {
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };

  return (
    <span className={`${position} ${className}`}>
      <span className={`block rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}>
        {pulse && (
          <span className={`absolute inset-0 rounded-full ${colorClasses[color]} animate-ping opacity-75`} />
        )}
      </span>
    </span>
  );
};

// ============================================
// UNSAVED LABEL
// ============================================

export interface UnsavedLabelProps {
  visible?: boolean;
  variant?: 'default' | 'subtle' | 'bold';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
  className?: string;
}

export const UnsavedLabel: React.FC<UnsavedLabelProps> = ({
  visible = true,
  variant = 'default',
  size = 'md',
  icon = true,
  className = '',
}) => {
  if (!visible) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const variantClasses = {
    default: 'bg-amber-100 text-amber-700 border border-amber-200',
    subtle: 'bg-gray-100 text-gray-600 border border-gray-200',
    bold: 'bg-amber-500 text-white',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${sizeClasses[size]} ${variantClasses[variant]} ${className}
      `}
    >
      {icon && <AlertCircle className="w-3.5 h-3.5" />}
      Unsaved
    </span>
  );
};

// ============================================
// DRAFT BADGE
// ============================================

export interface DraftBadgeProps {
  visible?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export const DraftBadge: React.FC<DraftBadgeProps> = ({
  visible = true,
  variant = 'primary',
  size = 'md',
  pulse = false,
  className = '',
}) => {
  if (!visible) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const variantClasses = {
    primary: 'bg-blue-100 text-blue-700 border border-blue-200',
    secondary: 'bg-purple-100 text-purple-700 border border-purple-200',
    outline: 'bg-white text-gray-700 border-2 border-gray-300',
  };

  return (
    <span className="relative inline-block">
      {pulse && (
        <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25" />
      )}
      <span
        className={`
          inline-flex items-center gap-1.5 rounded-full font-semibold
          ${sizeClasses[size]} ${variantClasses[variant]} ${className}
        `}
      >
        <Circle className="w-2 h-2 fill-current" />
        DRAFT
      </span>
    </span>
  );
};

// ============================================
// TAB INDICATOR
// ============================================

export interface TabIndicatorProps {
  label: string;
  hasDirtyChanges?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const TabIndicator: React.FC<TabIndicatorProps> = ({
  label,
  hasDirtyChanges = false,
  isActive = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all
        ${isActive
          ? 'bg-[#0e042f] text-white shadow-lg shadow-purple-900/20'
          : 'text-gray-700 hover:bg-gray-100'
        }
        ${className}
      `}
    >
      <span className="flex items-center gap-2">
        {label}
        {hasDirtyChanges && (
          <DotIndicator
            size="sm"
            color="amber"
            pulse={true}
            position="relative"
          />
        )}
      </span>
    </button>
  );
};

// ============================================
// HEADER INDICATOR
// ============================================

export interface HeaderIndicatorProps {
  hasDirtyChanges?: boolean;
  lastSavedTime?: Date;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  isDraftMode?: boolean;
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

export const HeaderIndicator: React.FC<HeaderIndicatorProps> = ({
  hasDirtyChanges = false,
  lastSavedTime,
  saveStatus = 'idle',
  isDraftMode = false,
  variant = 'full',
  className = '',
}) => {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Minimal variant - just a dot
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {hasDirtyChanges && <DotIndicator size="sm" color="amber" pulse={true} />}
        {isDraftMode && <DraftBadge size="sm" />}
      </div>
    );
  }

  // Compact variant - icon + short text
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {saveStatus === 'saving' && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Clock className="w-3.5 h-3.5" />
            </motion.div>
            Saving...
          </div>
        )}

        {saveStatus === 'saved' && !hasDirtyChanges && (
          <div className="flex items-center gap-1.5 text-xs text-green-600">
            <Save className="w-3.5 h-3.5" />
            Saved
          </div>
        )}

        {hasDirtyChanges && (
          <>
            <DotIndicator size="sm" color="amber" pulse={true} />
            <span className="text-xs text-amber-600 font-medium">Unsaved</span>
          </>
        )}

        {isDraftMode && <DraftBadge size="sm" />}
      </div>
    );
  }

  // Full variant - complete status display
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Save Status */}
      {saveStatus === 'saving' && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Clock className="w-4 h-4 text-blue-600" />
          </motion.div>
          <span className="text-sm font-medium text-blue-700">Saving changes...</span>
        </div>
      )}

      {saveStatus === 'saved' && !hasDirtyChanges && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
          <Save className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            All changes saved
            {lastSavedTime && (
              <span className="text-green-600 ml-1">• {getTimeAgo(lastSavedTime)}</span>
            )}
          </span>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm font-medium text-red-700">Failed to save</span>
        </div>
      )}

      {/* Unsaved Changes */}
      {hasDirtyChanges && saveStatus !== 'saving' && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
          <DotIndicator size="sm" color="amber" pulse={true} position="relative" />
          <span className="text-sm font-medium text-amber-700">
            Unsaved changes
            {lastSavedTime && (
              <span className="text-amber-600 ml-1">• Last saved {getTimeAgo(lastSavedTime)}</span>
            )}
          </span>
        </div>
      )}

      {/* Draft Mode Badge */}
      {isDraftMode && <DraftBadge variant="secondary" />}
    </div>
  );
};

// ============================================
// SECTION INDICATOR
// ============================================

export interface SectionIndicatorProps {
  sectionName: string;
  hasDirtyChanges?: boolean;
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const SectionIndicator: React.FC<SectionIndicatorProps> = ({
  sectionName,
  hasDirtyChanges = false,
  isCollapsed = false,
  onToggle,
  className = '',
}) => {
  return (
    <div
      className={`
        flex items-center justify-between p-3 rounded-lg border
        ${hasDirtyChanges ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900">{sectionName}</span>
        {hasDirtyChanges && (
          <>
            <DotIndicator size="sm" color="amber" pulse={true} />
            <UnsavedLabel size="sm" icon={false} />
          </>
        )}
      </div>
      {onToggle && (
        <button
          onClick={onToggle}
          className="text-xs text-gray-500 hover:text-gray-700 font-medium"
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
      )}
    </div>
  );
};

// ============================================
// NAVIGATION GUARD WRAPPER
// ============================================

export interface NavigationGuardProps {
  children: React.ReactNode;
  hasDirtyChanges?: boolean;
  onNavigate: () => void;
  className?: string;
}

/**
 * Wraps navigation elements (buttons, links) to check for dirty state before navigating
 */
export const NavigationGuard: React.FC<NavigationGuardProps> = ({
  children,
  hasDirtyChanges = false,
  onNavigate,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (hasDirtyChanges) {
      e.preventDefault();
      e.stopPropagation();
      // This should trigger the UnsavedChangesModal via context
      onNavigate();
    } else {
      onNavigate();
    }
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};
