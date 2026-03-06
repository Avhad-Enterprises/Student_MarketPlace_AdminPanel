import React, { useState } from 'react';
import {
  X,
  FileText,
  Palette,
  Puzzle,
  Upload,
  Users,
  ChevronDown,
  Monitor,
  Tablet,
  Smartphone,
  Clock,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { RoleBadge } from './Part8CollaborationUI';
import type { ActivityItem, PageVersion, TeamMember } from './types';

// ============================================
// PART 9: ACTIVITY PANEL - HUMAN-READABLE EVENTS
// ============================================

interface ActivityPanelProps {
  onClose: () => void;
  activities: ActivityItem[];
  onViewPageHistory?: () => void;
}

// Activity type to icon mapping
const activityIcons: Record<string, React.ReactNode> = {
  content_updated: <FileText size={16} className="text-blue-600" />,
  theme_changed: <Palette size={16} className="text-purple-600" />,
  app_connected: <Puzzle size={16} className="text-green-600" />,
  app_disconnected: <Puzzle size={16} className="text-gray-600" />,
  page_published: <Upload size={16} className="text-green-600" />,
  team_member_added: <Users size={16} className="text-blue-600" />,
  team_member_removed: <Users size={16} className="text-gray-600" />,
};

type ActivityFilter = 'all' | 'content' | 'theme' | 'apps' | 'publishing' | 'team';

const filterLabels: Record<ActivityFilter, string> = {
  all: 'All activity',
  content: 'Content changes',
  theme: 'Theme changes',
  apps: 'App changes',
  publishing: 'Publishing actions',
  team: 'Team actions'
};

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ onClose, activities, onViewPageHistory }) => {
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Group activities by time period
  const groupedActivities = React.useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups = {
      today: [] as ActivityItem[],
      yesterday: [] as ActivityItem[],
      earlier: [] as ActivityItem[]
    };

    activities.forEach(activity => {
      const activityDate = new Date(activity.timestamp);
      
      if (activityDate >= today) {
        groups.today.push(activity);
      } else if (activityDate >= yesterday) {
        groups.yesterday.push(activity);
      } else {
        groups.earlier.push(activity);
      }
    });

    return groups;
  }, [activities]);

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatAbsoluteTime = (date: Date) => {
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Convert action to human-readable text
  const getActivityDescription = (activity: ActivityItem): string => {
    const action = activity.action;
    
    switch (action) {
      case 'content_updated':
        return `updated the ${activity.target} ${activity.targetType}`;
      case 'theme_changed':
        return `changed ${activity.target}`;
      case 'app_connected':
        return `connected app '${activity.target}'`;
      case 'app_disconnected':
        return `disconnected app '${activity.target}'`;
      case 'page_published':
        return `published the ${activity.page} page`;
      case 'team_member_added':
        return `added ${activity.target} to the team`;
      case 'team_member_removed':
        return `removed ${activity.target} from the team`;
      default:
        return activity.actionLabel || 'made a change';
    }
  };

  // Get role from user name (demo helper)
  const getUserRole = (userName: string): 'owner' | 'admin' | 'editor' | 'viewer' => {
    if (userName.includes('Owner')) return 'owner';
    if (userName.includes('Admin')) return 'admin';
    if (userName.includes('Editor')) return 'editor';
    return 'viewer';
  };

  const ActivityGroup: React.FC<{ title: string; items: ActivityItem[] }> = ({ title, items }) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {items.map((activity) => (
            <div
              key={activity.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <img
                  src={activity.userAvatar}
                  alt={activity.user}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{activity.user}</span>
                    <RoleBadge role={getUserRole(activity.user)} size="sm" />
                  </div>
                  
                  <div className="flex items-start gap-2 mb-2">
                    {activityIcons[activity.action] || <FileText size={16} className="text-gray-600" />}
                    <p className="text-sm text-gray-700">
                      {getActivityDescription(activity)}
                    </p>
                  </div>
                  
                  <div 
                    className="text-xs text-gray-500"
                    title={formatAbsoluteTime(activity.timestamp)}
                  >
                    {formatTime(activity.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-50"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock size={18} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close activity panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Dropdown */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
            >
              {filterLabels[filter]}
              <ChevronDown size={16} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu (UI Only) */}
            {showFilterDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {(Object.keys(filterLabels) as ActivityFilter[]).map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => {
                      setFilter(filterKey);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      filter === filterKey ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {filterLabels[filterKey]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto">
          {activities.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Clock size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No changes recorded yet</h3>
              <p className="text-sm text-gray-600 max-w-sm">
                Activity will appear here as your team edits the site.
              </p>
            </div>
          ) : (
            <>
              <ActivityGroup title="Today" items={groupedActivities.today} />
              <ActivityGroup title="Yesterday" items={groupedActivities.yesterday} />
              <ActivityGroup title="Earlier" items={groupedActivities.earlier} />
            </>
          )}
        </div>

        {/* Footer */}
        {onViewPageHistory && activities.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onViewPageHistory}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <RotateCcw size={16} />
              View version history
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// ============================================
// PAGE HISTORY PANEL - VERSION LIST WITH CLARITY
// ============================================

interface PageHistoryPanelProps {
  onClose: () => void;
  versions: PageVersion[];
  onSelectVersion: (version: PageVersion) => void;
  onRestore: (version: PageVersion) => void;
}

export const PageHistoryPanel: React.FC<PageHistoryPanelProps> = ({
  onClose,
  versions,
  onSelectVersion,
  onRestore
}) => {
  // Get device icon based on changes
  const getDeviceIcon = (version: PageVersion) => {
    // Demo: randomly assign device modes
    const deviceMode = version.versionNumber % 3;
    if (deviceMode === 0) return <Monitor size={14} className="text-gray-500" />;
    if (deviceMode === 1) return <Tablet size={14} className="text-gray-500" />;
    return <Smartphone size={14} className="text-gray-500" />;
  };

  // Get user role from editor name
  const getUserRole = (editorName: string): 'owner' | 'admin' | 'editor' | 'viewer' => {
    if (editorName.includes('Owner')) return 'owner';
    if (editorName.includes('Admin')) return 'admin';
    if (editorName.includes('Editor')) return 'editor';
    return 'viewer';
  };

  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const formatAbsoluteTime = (date: Date) => {
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-50"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <RotateCcw size={18} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Version History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close version history"
          >
            <X size={20} />
          </button>
        </div>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onSelectVersion(version)}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <img
                    src={version.editorAvatar}
                    alt={version.editorName}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Version Label */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        version.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {version.status === 'published' ? <CheckCircle size={12} /> : null}
                        {version.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      {index === 0 && (
                        <span className="text-xs font-medium text-blue-600">Current</span>
                      )}
                    </div>

                    {/* Summary Line */}
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {version.summary}
                    </p>

                    {/* Edited By */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-600">by</span>
                      <span className="text-xs font-medium text-gray-900">{version.editorName}</span>
                      <RoleBadge role={getUserRole(version.editorName)} size="sm" />
                    </div>

                    {/* Metadata Row */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div 
                        className="flex items-center gap-1"
                        title={formatAbsoluteTime(version.timestamp)}
                      >
                        <Clock size={12} />
                        <span>{formatRelativeTime(version.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-1" title="Device mode used">
                        {getDeviceIcon(version)}
                      </div>
                    </div>
                  </div>

                  {/* Restore Button */}
                  {index !== 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore(version);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// VERSION DETAIL MODAL - SUMMARY VIEW
// ============================================

interface VersionDetailModalProps {
  version: PageVersion;
  onClose: () => void;
  onRestore: () => void;
}

export const VersionDetailModal: React.FC<VersionDetailModalProps> = ({
  version,
  onClose,
  onRestore
}) => {
  // Get user role from editor name
  const getUserRole = (editorName: string): 'owner' | 'admin' | 'editor' | 'viewer' => {
    if (editorName.includes('Owner')) return 'owner';
    if (editorName.includes('Admin')) return 'admin';
    if (editorName.includes('Editor')) return 'editor';
    return 'viewer';
  };

  const formatAbsoluteTime = (date: Date) => {
    return date.toLocaleString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Group changes by type
  const changesByType = React.useMemo(() => {
    const groups: Record<string, string[]> = {
      content: [],
      style: [],
      visibility: []
    };

    version.changes.forEach(change => {
      const description = `${change.sectionName || change.target}`;
      if (change.type === 'modified') groups.content.push(description);
      if (change.type === 'style') groups.style.push(description);
      if (change.type === 'visibility') groups.visibility.push(description);
    });

    return groups;
  }, [version.changes]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {version.summary}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">by</span>
                  <span className="text-sm font-medium text-gray-900">{version.editorName}</span>
                  <RoleBadge role={getUserRole(version.editorName)} size="sm" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatAbsoluteTime(version.timestamp)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Summary Card */}
          <div className="px-6 py-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">This version includes:</h3>
            
            <div className="space-y-3">
              {changesByType.content.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileText size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">Content changes</p>
                    <ul className="space-y-1">
                      {changesByType.content.map((item, index) => (
                        <li key={index} className="text-sm text-blue-700">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {changesByType.style.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <Palette size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-900 mb-1">Style updates</p>
                    <ul className="space-y-1">
                      {changesByType.style.map((item, index) => (
                        <li key={index} className="text-sm text-purple-700">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {changesByType.visibility.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <AlertCircle size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">Visibility changes</p>
                    <ul className="space-y-1">
                      {changesByType.visibility.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={onRestore}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Restore this version
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// RESTORE VERSION MODAL - ENHANCED CONTEXT
// ============================================

interface RestoreVersionModalProps {
  version: PageVersion;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RestoreVersionModal: React.FC<RestoreVersionModalProps> = ({
  version,
  onConfirm,
  onCancel
}) => {
  const formatAbsoluteTime = (date: Date) => {
    return date.toLocaleString('en-US', { 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Get user role from editor name
  const getUserRole = (editorName: string): 'owner' | 'admin' | 'editor' | 'viewer' => {
    if (editorName.includes('Owner')) return 'owner';
    if (editorName.includes('Admin')) return 'admin';
    if (editorName.includes('Editor')) return 'editor';
    return 'viewer';
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onCancel}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <RotateCcw size={20} className="text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Restore this version?
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">{version.summary}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>by</span>
                <span className="font-medium text-gray-900">{version.editorName}</span>
                <RoleBadge role={getUserRole(version.editorName)} size="sm" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatAbsoluteTime(version.timestamp)}
              </p>
            </div>

            <p className="text-sm text-gray-700">
              This will replace the current draft with changes made by{' '}
              <span className="font-medium text-gray-900">{version.editorName}</span>{' '}
              ({getUserRole(version.editorName)}) on{' '}
              <span className="font-medium">{formatAbsoluteTime(version.timestamp)}</span>.
            </p>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> You can restore again if needed. Your current draft will be saved in the version history.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Restore version
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
