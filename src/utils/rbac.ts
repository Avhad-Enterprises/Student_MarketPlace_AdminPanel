/**
 * ROLE-BASED ACCESS CONTROL (RBAC) UTILITIES
 * Centralized permission management for Build Credit module
 */

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'VIEWER';

export interface Permission {
  canView: boolean;
  canEdit: boolean;
  canEditFinancialTerms: boolean;
  canEditProviderKeys: boolean;
  canPublish: boolean;
  canArchive: boolean;
  canDelete: boolean;
  canSync: boolean;
  canEditOperations: boolean;
  canForceOverride: boolean;
  canViewLogs: boolean;
  canExportLogs: boolean;
}

/**
 * Get permissions for a given role
 */
export const getPermissions = (role: UserRole): Permission => {
  switch (role) {
    case 'SUPER_ADMIN':
      return {
        canView: true,
        canEdit: true,
        canEditFinancialTerms: true,
        canEditProviderKeys: true,
        canPublish: true,
        canArchive: true,
        canDelete: true,
        canSync: true,
        canEditOperations: true,
        canForceOverride: true,
        canViewLogs: true,
        canExportLogs: true,
      };

    case 'ADMIN':
      return {
        canView: true,
        canEdit: true,
        canEditFinancialTerms: true,
        canEditProviderKeys: false, // Cannot change sensitive provider keys
        canPublish: true,
        canArchive: true,
        canDelete: false,
        canSync: true,
        canEditOperations: true,
        canForceOverride: false,
        canViewLogs: true,
        canExportLogs: true,
      };

    case 'MANAGER':
      return {
        canView: true,
        canEdit: true,
        canEditFinancialTerms: false, // Cannot edit financial terms
        canEditProviderKeys: false,
        canPublish: false,
        canArchive: false,
        canDelete: false,
        canSync: false,
        canEditOperations: false,
        canForceOverride: false,
        canViewLogs: true,
        canExportLogs: false,
      };

    case 'VIEWER':
      return {
        canView: true,
        canEdit: false,
        canEditFinancialTerms: false,
        canEditProviderKeys: false,
        canPublish: false,
        canArchive: false,
        canDelete: false,
        canSync: false,
        canEditOperations: false,
        canForceOverride: false,
        canViewLogs: true,
        canExportLogs: false,
      };

    default:
      // Default to viewer permissions
      return getPermissions('VIEWER');
  }
};

/**
 * Check if role has specific permission
 */
export const hasPermission = (role: UserRole, permission: keyof Permission): boolean => {
  const permissions = getPermissions(role);
  return permissions[permission];
};

/**
 * Get user-friendly role label
 */
export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    VIEWER: 'Viewer',
  };
  return labels[role] || role;
};

/**
 * Get role badge color
 */
export const getRoleBadgeColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    SUPER_ADMIN: 'bg-purple-100 text-purple-700 border-purple-300',
    ADMIN: 'bg-blue-100 text-blue-700 border-blue-300',
    MANAGER: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    VIEWER: 'bg-gray-100 text-gray-700 border-gray-300',
  };
  return colors[role] || colors.VIEWER;
};

/**
 * Permission error messages
 */
export const getPermissionErrorMessage = (permission: keyof Permission): string => {
  const messages: Record<keyof Permission, string> = {
    canView: 'You do not have permission to view this section',
    canEdit: 'You do not have permission to edit this section',
    canEditFinancialTerms: 'Only Admins and Super Admins can edit financial terms',
    canEditProviderKeys: 'Only Super Admins can edit provider keys',
    canPublish: 'You do not have permission to publish changes',
    canArchive: 'Only Admins and Super Admins can archive programs',
    canDelete: 'Only Super Admins can delete programs',
    canSync: 'You do not have permission to sync with provider',
    canEditOperations: 'Only Admins and Super Admins can edit operations settings',
    canForceOverride: 'Only Super Admins can force override',
    canViewLogs: 'You do not have permission to view logs',
    canExportLogs: 'You do not have permission to export logs',
  };
  return messages[permission] || 'Permission denied';
};
