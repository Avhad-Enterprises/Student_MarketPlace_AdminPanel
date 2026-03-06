/**
 * PART 10: SYSTEM FEEDBACK & VISUAL STATE MANAGEMENT
 * 
 * Enterprise-grade visual feedback system ensuring users always know:
 * - "Is everything okay?"
 * - "What's happening right now?"
 * - "Do I need to take action?"
 * - "Can I safely continue working?"
 * 
 * Calm, non-alarming, predictable, professional feedback.
 */

import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  WifiOff,
  RotateCcw,
  X,
  Info,
  Eye,
  Clock,
  ChevronRight,
  Wifi,
  Activity,
  Loader2
} from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type SystemHealthState = 'operational' | 'saving' | 'warning' | 'offline' | 'blocking-error';

export interface SaveState {
  status: 'saving' | 'saved' | 'failed';
  message?: string;
  lastSaveTime?: Date;
  canRetry?: boolean;
}

export interface PublishReadinessCheck {
  id: string;
  label: string;
  status: 'complete' | 'warning' | 'error';
  message?: string;
}

// ============================================
// 1️⃣ ENHANCED SYSTEM HEALTH INDICATOR
// ============================================

export const EnhancedSystemHealthIndicator: React.FC<{
  health: SystemHealthState;
  lastSaveTime: Date;
  onTriggerSave?: () => void;
  onViewDetails?: () => void;
  onResolveIssue?: () => void;
  isOffline?: boolean;
  onSimulateOffline?: () => void;
  onSimulateOnline?: () => void;
}> = ({ 
  health, 
  lastSaveTime, 
  onTriggerSave,
  onViewDetails,
  onResolveIssue,
  isOffline = false,
  onSimulateOffline,
  onSimulateOnline
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getIcon = () => {
    switch (health) {
      case 'operational':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'saving':
        return <Loader2 size={18} className="text-blue-600 animate-spin" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-yellow-600" />;
      case 'blocking-error':
        return <AlertCircle size={18} className="text-red-600" />;
      case 'offline':
        return <WifiOff size={18} className="text-gray-500" />;
    }
  };

  const getStatusConfig = () => {
    switch (health) {
      case 'operational':
        return {
          title: 'All systems operational',
          subtitle: 'Your changes are saving normally.',
          color: 'text-green-900',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'saving':
        return {
          title: 'Saving changes…',
          subtitle: 'This may take a few seconds.',
          color: 'text-blue-900',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'warning':
        return {
          title: 'Some features may be unavailable',
          subtitle: 'App connection issue detected',
          color: 'text-yellow-900',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          hasAction: true,
          actionLabel: 'View details',
          onAction: onViewDetails
        };
      case 'blocking-error':
        return {
          title: 'Action required',
          subtitle: 'Publishing is temporarily disabled.',
          color: 'text-red-900',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          hasAction: true,
          actionLabel: 'Resolve issue',
          onAction: onResolveIssue
        };
      case 'offline':
        return {
          title: 'You\'re offline',
          subtitle: 'Changes will sync when connection is restored.',
          color: 'text-gray-900',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
        title={config.title}
      >
        {getIcon()}
        {health === 'saving' && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Enhanced Status Menu */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className={`${config.bgColor} border-b ${config.borderColor} px-4 py-3`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${config.color}`}>
                    {config.title}
                  </p>
                  <p className={`text-xs mt-0.5 ${config.color} opacity-75`}>
                    {config.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              {config.hasAction && config.onAction && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    config.onAction?.();
                    setShowMenu(false);
                  }}
                  className={`mt-3 w-full px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    health === 'blocking-error'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  {config.actionLabel}
                </button>
              )}
            </div>

            {/* Status Details */}
            <div className="p-4 space-y-3">
              {health === 'operational' && (
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      Last saved
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatTimeAgo(lastSaveTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Activity size={14} className="text-gray-400" />
                      Auto-save
                    </span>
                    <span className="font-medium text-green-700">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Wifi size={14} className="text-gray-400" />
                      Connection
                    </span>
                    <span className="font-medium text-green-700">Stable</span>
                  </div>
                </div>
              )}

              {health === 'saving' && (
                <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-md">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Syncing your changes to the server…</span>
                </div>
              )}

              {health === 'offline' && (
                <div className="text-xs text-gray-600 space-y-2">
                  <p className="bg-gray-50 px-3 py-2 rounded-md">
                    Your work is being saved locally and will sync automatically when your connection is restored.
                  </p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <WifiOff size={14} />
                    <span>No internet connection</span>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Controls */}
            {(onTriggerSave || onSimulateOffline || onSimulateOnline) && (
              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                <p className="text-[10px] text-gray-500 uppercase font-semibold mb-2">
                  Demo Controls
                </p>
                <div className="space-y-1.5">
                  {onTriggerSave && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerSave();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-md bg-blue-100 hover:bg-blue-200 text-xs font-medium text-blue-900 transition-colors"
                    >
                      Trigger Save
                    </button>
                  )}
                  {!isOffline && onSimulateOffline && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSimulateOffline();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 text-xs font-medium text-gray-900 transition-colors"
                    >
                      Simulate Offline
                    </button>
                  )}
                  {isOffline && onSimulateOnline && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSimulateOnline();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-md bg-green-100 hover:bg-green-200 text-xs font-medium text-green-900 transition-colors"
                    >
                      Go Back Online
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================
// 2️⃣ SAVE FAILED BANNER (Enhanced)
// ============================================

export const SaveFailedBanner: React.FC<{
  onRetry: () => void;
  onDismiss: () => void;
}> = ({ onRetry, onDismiss }) => (
  <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
    <div className="bg-yellow-50 border-2 border-yellow-200 px-5 py-4 rounded-xl shadow-2xl flex items-start gap-3 max-w-[420px]">
      <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-sm text-yellow-900">
          We couldn&apos;t save your latest changes
        </p>
        <p className="text-xs text-yellow-800 mt-1">
          Please check your connection. Your work is not lost.
        </p>
        <button
          onClick={onRetry}
          className="mt-3 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
        >
          <RotateCcw size={12} />
          Retry now
        </button>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 hover:bg-yellow-100 rounded transition-colors"
      >
        <X size={16} className="text-yellow-600" />
      </button>
    </div>
  </div>
);

// ============================================
// 3️⃣ BLOCKING ERROR BANNER (Enhanced)
// ============================================

export const EnhancedBlockingErrorBanner: React.FC<{
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
}> = ({ title, message, actionLabel, onAction, onDismiss }) => (
  <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5">
    <div className="bg-red-50 border-2 border-red-200 px-6 py-4 rounded-xl shadow-2xl flex items-start gap-4 min-w-[500px] max-w-[600px]">
      <AlertCircle size={22} className="text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-sm text-red-900">{title}</p>
        <p className="text-sm text-red-700 mt-1.5 leading-relaxed">{message}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5"
          >
            {actionLabel}
            <ChevronRight size={14} />
          </button>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="p-1.5 hover:bg-red-100 rounded transition-colors"
      >
        <X size={16} className="text-red-600" />
      </button>
    </div>
  </div>
);

// ============================================
// 4️⃣ NON-BLOCKING WARNING (Inline)
// ============================================

export const InlineWarning: React.FC<{
  message: string;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}> = ({ message, onDismiss, icon }) => (
  <div className="bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg flex items-start gap-3">
    <div className="text-yellow-600 flex-shrink-0 mt-0.5">
      {icon || <Info size={16} />}
    </div>
    <p className="text-xs text-yellow-900 flex-1 leading-relaxed">{message}</p>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="p-0.5 hover:bg-yellow-100 rounded transition-colors"
      >
        <X size={14} className="text-yellow-600" />
      </button>
    )}
  </div>
);

// ============================================
// 5️⃣ ENHANCED PREVIEW MODE FEEDBACK
// ============================================

export const EnhancedPreviewModeBanner: React.FC<{
  onBackToDraft: () => void;
  onPublish?: () => void;
}> = ({ onBackToDraft, onPublish }) => (
  <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 px-6 py-3.5 shadow-lg">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="bg-blue-500/30 p-2 rounded-lg">
          <Eye size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm flex items-center gap-2">
            Preview Mode
            <span className="bg-blue-500/40 px-2 py-0.5 rounded text-[10px] font-medium">
              READ-ONLY
            </span>
          </p>
          <p className="text-blue-100 text-xs mt-0.5">
            Changes here do not affect the live site.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {onPublish && (
          <button
            onClick={onPublish}
            className="px-4 py-2 bg-white text-blue-700 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-colors"
          >
            Publish Changes
          </button>
        )}
        <button
          onClick={onBackToDraft}
          className="px-4 py-2 bg-blue-500/20 text-white font-medium text-sm rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-400/30"
        >
          Back to Draft
        </button>
      </div>
    </div>
  </div>
);

// ============================================
// 6️⃣ PUBLISH READINESS CHECK
// ============================================

export const PublishReadinessChecklist: React.FC<{
  checks: PublishReadinessCheck[];
  onDismiss: () => void;
}> = ({ checks, onDismiss }) => {
  const hasErrors = checks.some(c => c.status === 'error');
  const hasWarnings = checks.some(c => c.status === 'warning');
  const allComplete = checks.every(c => c.status === 'complete');

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-sm text-gray-900">Publish Readiness</h4>
          <p className="text-xs text-gray-600 mt-0.5">
            {allComplete && 'All checks passed'}
            {hasErrors && 'Action required before publishing'}
            {!hasErrors && hasWarnings && 'Ready to publish with warnings'}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X size={14} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-2">
        {checks.map((check) => (
          <div
            key={check.id}
            className="flex items-start gap-2 text-xs"
          >
            <div className="mt-0.5">
              {check.status === 'complete' && (
                <CheckCircle size={14} className="text-green-600" />
              )}
              {check.status === 'warning' && (
                <AlertTriangle size={14} className="text-yellow-600" />
              )}
              {check.status === 'error' && (
                <AlertCircle size={14} className="text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${
                check.status === 'complete' ? 'text-gray-900' :
                check.status === 'warning' ? 'text-yellow-900' :
                'text-red-900'
              }`}>
                {check.label}
              </p>
              {check.message && (
                <p className={`mt-0.5 ${
                  check.status === 'complete' ? 'text-gray-600' :
                  check.status === 'warning' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                  {check.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 7️⃣ OFFLINE MODE BANNER (Enhanced)
// ============================================

export const EnhancedOfflineBanner: React.FC<{
  onDismiss?: () => void;
}> = ({ onDismiss }) => (
  <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 shadow-lg">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <WifiOff size={18} className="text-gray-400" />
        <div>
          <p className="text-white font-semibold text-sm">You&apos;re offline</p>
          <p className="text-gray-300 text-xs">
            Changes will sync once connection is restored.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-gray-700 px-3 py-1.5 rounded-md">
          <p className="text-xs text-gray-300">
            Publishing and app connections are disabled
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>
    </div>
  </div>
);

// ============================================
// 8️⃣ SKELETON LOADERS
// ============================================

export const PanelLoadingSkeleton: React.FC = () => (
  <div className="p-4 space-y-3 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-2 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const ActivityLoadingSkeleton: React.FC = () => (
  <div className="p-4 space-y-4 animate-pulse">
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-2 bg-gray-100 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const HistoryLoadingSkeleton: React.FC = () => (
  <div className="p-4 space-y-3 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="border border-gray-200 rounded-lg p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-2 bg-gray-100 rounded w-16" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-100 rounded w-full" />
          <div className="h-2 bg-gray-100 rounded w-4/5" />
        </div>
      </div>
    ))}
  </div>
);

// ============================================
// 9️⃣ AUTO-SAVE INDICATOR (Subtle Corner)
// ============================================

export const AutoSaveIndicator: React.FC<{
  status: 'saving' | 'saved' | 'failed';
  lastSaveTime?: Date;
}> = ({ status, lastSaveTime }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (status === 'saving' || status === 'failed') {
      setShow(true);
    } else if (status === 'saved') {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!show) return null;

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="fixed bottom-4 left-4 z-30 animate-in slide-in-from-left-5">
      <div className={`px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-medium ${
        status === 'saving' ? 'bg-blue-600 text-white' :
        status === 'saved' ? 'bg-green-600 text-white' :
        'bg-red-600 text-white'
      }`}>
        {status === 'saving' && (
          <>
            <Loader2 size={12} className="animate-spin" />
            <span>Saving…</span>
          </>
        )}
        {status === 'saved' && lastSaveTime && (
          <>
            <CheckCircle size={12} />
            <span>Saved {formatTimeAgo(lastSaveTime)}</span>
          </>
        )}
        {status === 'failed' && (
          <>
            <AlertCircle size={12} />
            <span>Save failed</span>
          </>
        )}
      </div>
    </div>
  );
};
