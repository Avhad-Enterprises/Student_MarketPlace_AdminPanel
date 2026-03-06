/**
 * PART 8: COLLABORATION & ACCESS CONTROL - UI STATE MODELING
 * 
 * Visual representation of:
 * - Role-based permissions
 * - Section locking
 * - Active editor presence
 * - Edit conflicts
 * - Team collaboration
 * 
 * No backend logic. UI/UX clarity only.
 */

import React from 'react';
import {
  Lock,
  Shield,
  Crown,
  Edit3,
  Eye,
  Users,
  AlertCircle,
  Info,
  X,
  ChevronDown
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

// ============================================
// TYPES
// ============================================

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status?: 'active' | 'pending';
}

// ============================================
// 1️⃣ ROLE BADGE COMPONENT
// ============================================

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'sm' }) => {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return {
          label: 'Owner',
          icon: Crown,
          bg: 'bg-purple-100',
          text: 'text-purple-700',
          border: 'border-purple-200'
        };
      case 'admin':
        return {
          label: 'Admin',
          icon: Shield,
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-200'
        };
      case 'editor':
        return {
          label: 'Editor',
          icon: Edit3,
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-200'
        };
      case 'viewer':
        return {
          label: 'Viewer',
          icon: Eye,
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          border: 'border-gray-200'
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 10 : 12;
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';
  const padding = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 ${padding} ${config.bg} ${config.text} ${textSize} font-semibold rounded border ${config.border}`}
    >
      <Icon size={iconSize} />
      {config.label}
    </span>
  );
};

// ============================================
// 2️⃣ LOCKED SECTION INDICATOR
// ============================================

interface LockedSectionIndicatorProps {
  lockedBy: TeamMember;
  size?: 'sm' | 'md';
}

export const LockedSectionIndicator: React.FC<LockedSectionIndicatorProps> = ({ 
  lockedBy,
  size = 'sm' 
}) => {
  const iconSize = size === 'sm' ? 10 : 14;
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 text-orange-700 ${textSize} font-medium rounded border border-orange-200 cursor-help`}>
          <Lock size={iconSize} />
          <span>{lockedBy.name}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>This section is being edited by {lockedBy.name} ({lockedBy.role})</p>
      </TooltipContent>
    </Tooltip>
  );
};

// ============================================
// 3️⃣ ACTIVE EDITOR BANNER
// ============================================

interface ActiveEditorBannerProps {
  editor: TeamMember;
}

export const ActiveEditorBanner: React.FC<ActiveEditorBannerProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 flex-1">
        <Info size={16} className="text-blue-600 flex-shrink-0" />
        <div className="flex items-center gap-2 flex-wrap">
          <img
            src={editor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${editor.name}`}
            alt={editor.name}
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
          />
          <span className="text-sm text-blue-900">
            <strong>{editor.name}</strong> is currently editing this section
          </span>
          <RoleBadge role={editor.role} size="sm" />
        </div>
      </div>
    </div>
  );
};

// ============================================
// 4️⃣ EDIT CONFLICT WARNING
// ============================================

interface EditConflictWarningProps {
  lockedBy: TeamMember;
  onDismiss: () => void;
}

export const EditConflictWarning: React.FC<EditConflictWarningProps> = ({ 
  lockedBy,
  onDismiss 
}) => {
  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg">
      <AlertCircle size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-orange-900 mb-1">
          This section is locked to prevent conflicts
        </p>
        <p className="text-xs text-orange-700 mb-2">
          {lockedBy.name} ({lockedBy.role}) is currently editing this section. Wait for them to finish or contact them directly.
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              disabled
              className="px-3 py-1.5 bg-gray-200 text-gray-400 text-xs font-medium rounded cursor-not-allowed"
            >
              Request Access
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coming soon: Request edit access from current editor</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 hover:bg-orange-100 rounded transition-colors flex-shrink-0"
      >
        <X size={14} className="text-orange-600" />
      </button>
    </div>
  );
};

// ============================================
// 5️⃣ LOCKED PAGE BANNER (Enhanced)
// ============================================

interface LockedPageBannerProps {
  lockedBy: TeamMember;
}

export const LockedPageBanner: React.FC<LockedPageBannerProps> = ({ lockedBy }) => {
  return (
    <div className="bg-orange-50 border-b border-orange-200 px-6 py-4">
      <div className="flex items-center justify-center gap-3 max-w-3xl mx-auto">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
          <Lock size={20} className="text-orange-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-base font-semibold text-orange-900">
              This page is locked to prevent simultaneous edits
            </p>
          </div>
          <p className="text-sm text-orange-700">
            {lockedBy.name} ({lockedBy.role}) is currently editing this page. Try again later or contact an Admin to request access.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 6️⃣ READ-ONLY MODE OVERLAY
// ============================================

interface ReadOnlyModeOverlayProps {
  reason?: string;
}

export const ReadOnlyModeOverlay: React.FC<ReadOnlyModeOverlayProps> = ({ 
  reason = "View-only access. You don&apos;t have permission to make changes." 
}) => {
  return (
    <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-[0.5px] z-10 cursor-not-allowed group">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute inset-0" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{reason}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

// ============================================
// 7️⃣ PERMISSION DENIED TOOLTIP WRAPPER
// ============================================

interface PermissionTooltipProps {
  allowed: boolean;
  reason?: string;
  children: React.ReactNode;
}

export const PermissionTooltip: React.FC<PermissionTooltipProps> = ({ 
  allowed,
  reason = "You don&apos;t have permission to perform this action",
  children 
}) => {
  if (allowed) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex">
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{reason}</p>
      </TooltipContent>
    </Tooltip>
  );
};

// ============================================
// 8️⃣ ENHANCED TEAM MODAL
// ============================================

interface EnhancedTeamModalProps {
  currentUser: TeamMember;
  teamMembers: TeamMember[];
  onClose: () => void;
  onRoleChange?: (userId: string, newRole: UserRole) => void;
}

export const EnhancedTeamModal: React.FC<EnhancedTeamModalProps> = ({
  currentUser,
  teamMembers,
  onClose,
  onRoleChange
}) => {
  const canChangeRoles = currentUser.role === 'owner';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-[700px] max-h-[600px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#253154]">Team & Access</h2>
              <p className="text-xs text-gray-500">Manage team members and permissions</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[480px]">
          {/* Role Info Banner */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-semibold mb-1">Role Permissions</p>
                <ul className="space-y-1 text-blue-700">
                  <li><strong>Owner:</strong> Full access, manage team, change all settings</li>
                  <li><strong>Admin:</strong> Publish changes, edit all content and theme</li>
                  <li><strong>Editor:</strong> Edit content and sections, cannot publish</li>
                  <li><strong>Viewer:</strong> View-only access, cannot make changes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#253154] mb-3">
              Team Members ({teamMembers.length})
            </h3>

            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                {/* Avatar */}
                <img
                  src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                  alt={member.name}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {member.name}
                      {member.id === currentUser.id && (
                        <span className="ml-1 text-xs text-gray-500 font-normal">(You)</span>
                      )}
                    </p>
                    {member.status === 'pending' && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-semibold">
                        PENDING
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{member.email}</p>
                </div>

                {/* Role Dropdown */}
                <div className="flex items-center gap-2">
                  <PermissionTooltip
                    allowed={canChangeRoles}
                    reason="Only Owners can change roles"
                  >
                    <div className="relative">
                      <button
                        disabled={!canChangeRoles}
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors
                          ${canChangeRoles 
                            ? 'bg-white border-gray-300 hover:border-gray-400 cursor-pointer' 
                            : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                          }
                        `}
                      >
                        <RoleBadge role={member.role} size="sm" />
                        {canChangeRoles && <ChevronDown size={14} className="text-gray-500" />}
                      </button>
                    </div>
                  </PermissionTooltip>
                </div>
              </div>
            ))}
          </div>

          {/* Access Control Notice */}
          {!canChangeRoles && (
            <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Lock size={14} className="text-gray-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  You&apos;re signed in as <strong>{currentUser.role}</strong>. Only Owners can manage team roles and permissions.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Changes take effect immediately
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-colors text-sm font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 9️⃣ VERSION HISTORY ENTRY WITH ROLE
// ============================================

interface VersionHistoryEntryProps {
  version: {
    id: string;
    label: string;
    timestamp: string;
    editedBy: TeamMember;
    isPublished: boolean;
    isCurrent: boolean;
  };
  onRestore?: () => void;
  onPreview?: () => void;
}

export const VersionHistoryEntryWithRole: React.FC<VersionHistoryEntryProps> = ({
  version,
  onRestore,
  onPreview
}) => {
  return (
    <div className={`p-4 border rounded-lg ${version.isCurrent ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {version.isCurrent && (
            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded uppercase">
              Current
            </span>
          )}
          {version.isPublished ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 text-[10px] font-bold rounded uppercase">
                  Published
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>This version was published and visible to visitors</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-bold rounded uppercase">
              Draft
            </span>
          )}
          <span className="text-xs text-gray-500">{version.timestamp}</span>
        </div>
      </div>

      {/* Version Info */}
      <p className="text-sm font-medium text-gray-900 mb-2">{version.label}</p>

      {/* Editor Info with Role */}
      <div className="flex items-center gap-2 mb-3">
        <img
          src={version.editedBy.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${version.editedBy.name}`}
          alt={version.editedBy.name}
          className="w-5 h-5 rounded-full border border-gray-300"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <span className="text-xs text-gray-600">{version.editedBy.name}</span>
              <RoleBadge role={version.editedBy.role} size="sm" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Changes made by {version.editedBy.name} ({version.editedBy.role})</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Actions */}
      {!version.isCurrent && (
        <div className="flex gap-2">
          <button
            onClick={onPreview}
            className="flex-1 px-3 py-1.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
          >
            Preview Version
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onRestore}
                className="flex-1 px-3 py-1.5 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-colors text-xs font-medium"
              >
                Restore as Draft
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Restoring creates a new draft based on this version</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

// ============================================
// 🔟 ROLE-BASED PUBLISH BUTTON
// ============================================

interface RoleBasedPublishButtonProps {
  currentUserRole: UserRole;
  onClick: () => void;
  hasUnpublishedChanges?: boolean;
}

export const RoleBasedPublishButton: React.FC<RoleBasedPublishButtonProps> = ({
  currentUserRole,
  onClick,
  hasUnpublishedChanges = true
}) => {
  const canPublish = currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <PermissionTooltip
      allowed={canPublish}
      reason="Only Owners or Admins can publish changes"
    >
      <button
        onClick={canPublish ? onClick : undefined}
        disabled={!canPublish}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium
          ${canPublish
            ? hasUnpublishedChanges
              ? 'bg-[#0e042f] text-white hover:bg-[#1a0a4a] shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-default'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
          }
        `}
      >
        <Shield size={16} />
        Publish
      </button>
    </PermissionTooltip>
  );
};

// ============================================
// VIEWER ROLE BANNER
// ============================================

export const ViewerRoleBanner: React.FC = () => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-2.5">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-gray-600" />
          <p className="text-sm text-gray-800">
            <strong>View-only mode:</strong> You can browse but cannot make changes.
          </p>
        </div>
        <RoleBadge role="viewer" size="md" />
      </div>
    </div>
  );
};
