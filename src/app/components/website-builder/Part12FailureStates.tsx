/**
 * PART 12: EXTENSION & INTEGRATION UI FOUNDATION
 * Failure States - Safe degradation when apps fail or disconnect
 * 
 * This ensures:
 * - App errors never crash the editor
 * - App sections collapse automatically
 * - Core editor always remains usable
 * - Clear communication of failure states
 */

import React from 'react';
import { 
  AlertCircle, 
  WifiOff, 
  RefreshCw, 
  ChevronDown, 
  Info,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AppExtension } from './Part12ExtensionZones';

// ============================================
// TYPES
// ============================================

export type FailureType = 
  | 'connection-lost'
  | 'timeout'
  | 'partial-data'
  | 'rate-limit'
  | 'unauthorized'
  | 'unknown';

export interface AppFailureStateProps {
  app: AppExtension;
  failureType: FailureType;
  onRetry?: () => void;
  onDismiss?: () => void;
  canRetry?: boolean;
}

// ============================================
// APP FAILURE STATE (Main Component)
// ============================================

export const AppFailureState: React.FC<AppFailureStateProps> = ({
  app,
  failureType,
  onRetry,
  onDismiss,
  canRetry = true
}) => {
  const config = getFailureConfig(failureType);

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      {/* Header with app info */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
          <app.icon className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">{app.name}</span>
            <Badge variant="secondary" className="text-xs">
              {config.badge}
            </Badge>
          </div>
          <p className="text-xs text-gray-600">{config.message}</p>
        </div>
        <config.icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {canRetry && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="flex-1"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="flex-1"
          >
            Dismiss
          </Button>
        )}
      </div>

      {/* Technical details (collapsible) */}
      {config.details && (
        <details className="mt-3 text-xs">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <ChevronDown className="w-3 h-3" />
            Technical Details
          </summary>
          <div className="mt-2 p-2 bg-white rounded border border-gray-200 font-mono text-gray-600">
            {config.details}
          </div>
        </details>
      )}
    </div>
  );
};

// ============================================
// COLLAPSED APP SECTION (Auto-collapsed on failure)
// ============================================

export const CollapsedAppSection: React.FC<{
  app: AppExtension;
  reason: string;
  onExpand?: () => void;
}> = ({ app, reason, onExpand }) => {
  return (
    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <app.icon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{app.name}</span>
          <Badge variant="secondary" className="text-xs">Collapsed</Badge>
        </div>
        {onExpand && (
          <Button variant="ghost" size="sm" onClick={onExpand}>
            Show Details
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1 ml-6">{reason}</p>
    </div>
  );
};

// ============================================
// INLINE APP ERROR (Non-blocking)
// ============================================

export const InlineAppError: React.FC<{
  message: string;
  severity?: 'info' | 'warning' | 'error';
  onDismiss?: () => void;
}> = ({ message, severity = 'warning', onDismiss }) => {
  const config = {
    info: {
      icon: Info,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200'
    },
    error: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200'
    }
  };

  const { icon: Icon, color, bg, border } = config[severity];

  return (
    <div className={`flex items-start gap-2 p-2 rounded-lg border ${bg} ${border}`}>
      <Icon className={`w-4 h-4 ${color} mt-0.5 flex-shrink-0`} />
      <p className={`text-xs ${color} flex-1`}>{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`${color} hover:opacity-70 flex-shrink-0`}
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// ============================================
// PARTIAL DATA WARNING
// ============================================

export const PartialDataWarning: React.FC<{
  appName: string;
  loadedItems: number;
  totalItems: number;
  onRetry?: () => void;
}> = ({ appName, loadedItems, totalItems, onRetry }) => {
  const percentage = Math.round((loadedItems / totalItems) * 100);

  return (
    <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
      <div className="flex items-start gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="text-sm font-medium text-orange-900">
            Partial Data Loaded
          </div>
          <p className="text-xs text-orange-700 mt-0.5">
            {appName} loaded {loadedItems} of {totalItems} items ({percentage}%)
          </p>
        </div>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="w-full"
        >
          <RefreshCw className="w-3 h-3 mr-2" />
          Reload Missing Data
        </Button>
      )}
    </div>
  );
};

// ============================================
// CONNECTION LOST BANNER
// ============================================

export const ConnectionLostBanner: React.FC<{
  appName: string;
  onReconnect?: () => void;
  onDismiss?: () => void;
}> = ({ appName, onReconnect, onDismiss }) => {
  return (
    <div className="p-3 border border-red-200 rounded-lg bg-red-50 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-red-600 flex-shrink-0" />
        <div>
          <div className="text-sm font-medium text-red-900">{appName} Disconnected</div>
          <p className="text-xs text-red-700">Connection lost. App features unavailable.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {onReconnect && (
          <Button variant="outline" size="sm" onClick={onReconnect}>
            Reconnect
          </Button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 hover:text-red-800"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// SILENT FAILURE INDICATOR
// (Subtle indication of degraded functionality)
// ============================================

export const SilentFailureIndicator: React.FC<{
  tooltip: string;
}> = ({ tooltip }) => {
  return (
    <div 
      className="inline-flex items-center gap-1 text-xs text-gray-400"
      title={tooltip}
    >
      <AlertCircle className="w-3 h-3" />
      <span>Limited</span>
    </div>
  );
};

// ============================================
// HELPER: GET FAILURE CONFIGURATION
// ============================================

function getFailureConfig(type: FailureType) {
  const configs = {
    'connection-lost': {
      icon: WifiOff,
      iconColor: 'text-red-500',
      badge: 'Offline',
      message: 'Connection to the app has been lost. Some features may be unavailable.',
      details: 'ERR_CONNECTION_LOST: Unable to reach app servers'
    },
    'timeout': {
      icon: AlertCircle,
      iconColor: 'text-orange-500',
      badge: 'Timeout',
      message: 'The app took too long to respond. It may be experiencing issues.',
      details: 'ERR_TIMEOUT: Request exceeded 30s limit'
    },
    'partial-data': {
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
      badge: 'Partial',
      message: 'Some data could not be loaded. The app may be partially functional.',
      details: null
    },
    'rate-limit': {
      icon: AlertCircle,
      iconColor: 'text-orange-500',
      badge: 'Rate Limited',
      message: 'Too many requests to the app. Please wait before trying again.',
      details: 'ERR_RATE_LIMIT: 60 requests/min exceeded'
    },
    'unauthorized': {
      icon: XCircle,
      iconColor: 'text-red-500',
      badge: 'Unauthorized',
      message: 'Your access to this app has been revoked. Contact your administrator.',
      details: 'ERR_UNAUTHORIZED: Invalid or expired credentials'
    },
    'unknown': {
      icon: AlertCircle,
      iconColor: 'text-gray-500',
      badge: 'Error',
      message: 'An unexpected error occurred. The app may not function correctly.',
      details: 'ERR_UNKNOWN: See browser console for details'
    }
  };

  return configs[type] || configs.unknown;
}

// ============================================
// APP ERROR BOUNDARY WRAPPER
// (React Error Boundary for app components)
// ============================================

interface AppErrorBoundaryProps {
  app: AppExtension;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`App ${this.props.app.name} crashed:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <CollapsedAppSection
          app={this.props.app}
          reason="App encountered an error and was automatically collapsed to protect the editor."
          onExpand={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}
