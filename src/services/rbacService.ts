// RBAC Service - Role-Based Access Control for Finance/Invoice operations
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export type UserRole = 'Admin' | 'Finance Manager' | 'Finance Staff' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Permission {
  // Invoice Creation & Editing
  canCreateInvoice: boolean;
  canEditDraftInvoice: boolean;
  canEditIssuedInvoice: boolean; // Limited fields only
  canDeleteInvoice: boolean;
  
  // Invoice Workflow
  canIssueInvoice: boolean;
  canApproveInvoice: boolean;
  canRejectInvoice: boolean;
  canCancelInvoice: boolean;
  
  // Payment Operations
  canRecordPayment: boolean;
  canOverridePaymentStatus: boolean;
  canProcessRefund: boolean;
  
  // Sharing & Communication
  canShareInvoice: boolean;
  canSendInvoiceEmail: boolean;
  canGeneratePaymentLink: boolean;
  
  // Reporting & Analytics
  canViewAllInvoices: boolean;
  canViewOwnInvoices: boolean;
  canExportInvoices: boolean;
  canViewFinancialReports: boolean;
  
  // System Operations
  canViewAuditLogs: boolean;
  canManageSettings: boolean;
  canBypassApproval: boolean;
}

// Role-based permission matrix
const ROLE_PERMISSIONS: Record<UserRole, Permission> = {
  'Admin': {
    canCreateInvoice: true,
    canEditDraftInvoice: true,
    canEditIssuedInvoice: true,
    canDeleteInvoice: true,
    canIssueInvoice: true,
    canApproveInvoice: true,
    canRejectInvoice: true,
    canCancelInvoice: true,
    canRecordPayment: true,
    canOverridePaymentStatus: true,
    canProcessRefund: true,
    canShareInvoice: true,
    canSendInvoiceEmail: true,
    canGeneratePaymentLink: true,
    canViewAllInvoices: true,
    canViewOwnInvoices: true,
    canExportInvoices: true,
    canViewFinancialReports: true,
    canViewAuditLogs: true,
    canManageSettings: true,
    canBypassApproval: true,
  },
  'Finance Manager': {
    canCreateInvoice: true,
    canEditDraftInvoice: true,
    canEditIssuedInvoice: true, // Limited fields
    canDeleteInvoice: true,
    canIssueInvoice: true,
    canApproveInvoice: true,
    canRejectInvoice: true,
    canCancelInvoice: true,
    canRecordPayment: true,
    canOverridePaymentStatus: true,
    canProcessRefund: true,
    canShareInvoice: true,
    canSendInvoiceEmail: true,
    canGeneratePaymentLink: true,
    canViewAllInvoices: true,
    canViewOwnInvoices: true,
    canExportInvoices: true,
    canViewFinancialReports: true,
    canViewAuditLogs: true,
    canManageSettings: false,
    canBypassApproval: false,
  },
  'Finance Staff': {
    canCreateInvoice: true,
    canEditDraftInvoice: true,
    canEditIssuedInvoice: false,
    canDeleteInvoice: false,
    canIssueInvoice: true,
    canApproveInvoice: false,
    canRejectInvoice: false,
    canCancelInvoice: false,
    canRecordPayment: false,
    canOverridePaymentStatus: false,
    canProcessRefund: false,
    canShareInvoice: true,
    canSendInvoiceEmail: true,
    canGeneratePaymentLink: true,
    canViewAllInvoices: true,
    canViewOwnInvoices: true,
    canExportInvoices: true,
    canViewFinancialReports: false,
    canViewAuditLogs: false,
    canManageSettings: false,
    canBypassApproval: false,
  },
  'Viewer': {
    canCreateInvoice: false,
    canEditDraftInvoice: false,
    canEditIssuedInvoice: false,
    canDeleteInvoice: false,
    canIssueInvoice: false,
    canApproveInvoice: false,
    canRejectInvoice: false,
    canCancelInvoice: false,
    canRecordPayment: false,
    canOverridePaymentStatus: false,
    canProcessRefund: false,
    canShareInvoice: false,
    canSendInvoiceEmail: false,
    canGeneratePaymentLink: false,
    canViewAllInvoices: true,
    canViewOwnInvoices: true,
    canExportInvoices: false,
    canViewFinancialReports: false,
    canViewAuditLogs: false,
    canManageSettings: false,
    canBypassApproval: false,
  },
};

// Mock current user - In production, this would come from auth context
let currentUser: User = {
  id: 'user-001',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'Admin',
};

// Get current user
export const getCurrentUser = (): User => {
  return currentUser;
};

// Set current user (for demo/testing)
export const setCurrentUser = (user: User): void => {
  currentUser = user;
};

// Get permissions for a role
export const getPermissionsForRole = (role: UserRole): Permission => {
  return ROLE_PERMISSIONS[role];
};

// Get permissions for current user
export const getCurrentUserPermissions = (): Permission => {
  return getPermissionsForRole(currentUser.role);
};

// Check if current user has specific permission
export const hasPermission = (permission: keyof Permission): boolean => {
  const permissions = getCurrentUserPermissions();
  return permissions[permission];
};

// Check multiple permissions (ALL must be true)
export const hasAllPermissions = (permissions: (keyof Permission)[]): boolean => {
  return permissions.every(p => hasPermission(p));
};

// Check multiple permissions (ANY can be true)
export const hasAnyPermission = (permissions: (keyof Permission)[]): boolean => {
  return permissions.some(p => hasPermission(p));
};

// Validation helpers for UI
export const canPerformAction = (action: string): boolean => {
  const actionPermissionMap: Record<string, keyof Permission> = {
    'create-invoice': 'canCreateInvoice',
    'edit-draft': 'canEditDraftInvoice',
    'edit-issued': 'canEditIssuedInvoice',
    'delete-invoice': 'canDeleteInvoice',
    'issue-invoice': 'canIssueInvoice',
    'approve-invoice': 'canApproveInvoice',
    'reject-invoice': 'canRejectInvoice',
    'cancel-invoice': 'canCancelInvoice',
    'record-payment': 'canRecordPayment',
    'override-status': 'canOverridePaymentStatus',
    'process-refund': 'canProcessRefund',
    'share-invoice': 'canShareInvoice',
    'send-email': 'canSendInvoiceEmail',
    'view-logs': 'canViewAuditLogs',
  };
  
  const permission = actionPermissionMap[action];
  return permission ? hasPermission(permission) : false;
};

// Get user role badge color
export const getRoleBadgeColor = (role: UserRole): string => {
  const colorMap: Record<UserRole, string> = {
    'Admin': 'bg-purple-100 text-purple-700',
    'Finance Manager': 'bg-blue-100 text-blue-700',
    'Finance Staff': 'bg-green-100 text-green-700',
    'Viewer': 'bg-gray-100 text-gray-700',
  };
  return colorMap[role];
};

// Audit log: Record permission-based action
export const logPermissionAction = (
  action: string,
  resource: string,
  resourceId: string,
  success: boolean,
  details?: any
): void => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId: currentUser.id,
    userName: currentUser.name,
    userRole: currentUser.role,
    action,
    resource,
    resourceId,
    success,
    details,
  };
  
  // Store in localStorage or send to backend
  const logs = JSON.parse(localStorage.getItem('rbac_audit_logs') || '[]');
  logs.push(logEntry);
  localStorage.setItem('rbac_audit_logs', JSON.stringify(logs));
  
  console.log('[RBAC Audit]', logEntry);
};

// Get all RBAC audit logs
export const getAuditLogs = (): any[] => {
  return JSON.parse(localStorage.getItem('rbac_audit_logs') || '[]');
};

// Mock users for demo/testing
export const MOCK_USERS: User[] = [
  { id: 'user-001', name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
  { id: 'user-002', name: 'John Smith', email: 'john.smith@example.com', role: 'Finance Manager' },
  { id: 'user-003', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Finance Staff' },
  { id: 'user-004', name: 'Mike Davis', email: 'mike.d@example.com', role: 'Viewer' },
];

// Get all users (for admin panel)
export const getAllUsers = (): User[] => {
  return MOCK_USERS;
};

// Permission descriptions (for UI tooltips)
export const PERMISSION_DESCRIPTIONS: Record<keyof Permission, string> = {
  canCreateInvoice: 'Create new invoices and payment requests',
  canEditDraftInvoice: 'Edit invoices in draft status',
  canEditIssuedInvoice: 'Edit issued invoices (limited fields)',
  canDeleteInvoice: 'Delete invoices from the system',
  canIssueInvoice: 'Issue invoices to students',
  canApproveInvoice: 'Approve invoices pending approval',
  canRejectInvoice: 'Reject invoices pending approval',
  canCancelInvoice: 'Cancel issued invoices',
  canRecordPayment: 'Record manual payments',
  canOverridePaymentStatus: 'Override payment status manually',
  canProcessRefund: 'Process refunds for paid invoices',
  canShareInvoice: 'Share invoices with students',
  canSendInvoiceEmail: 'Send invoice emails',
  canGeneratePaymentLink: 'Generate payment links',
  canViewAllInvoices: 'View all invoices in the system',
  canViewOwnInvoices: 'View only own created invoices',
  canExportInvoices: 'Export invoice data',
  canViewFinancialReports: 'View financial reports and analytics',
  canViewAuditLogs: 'View audit logs and history',
  canManageSettings: 'Manage system settings',
  canBypassApproval: 'Bypass approval requirements',
};

// API Services
export const rbacApi = {
  getRoles: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/roles`, { headers: getHeaders() });
    return response.data.data;
  },
  createRole: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/api/roles`, data, { headers: getHeaders() });
    return response.data.data;
  },
  updateRole: async (id: string, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/api/roles/${id}`, data, { headers: getHeaders() });
    return response.data.data;
  },
  getUsers: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/users`, { headers: getHeaders() });
    return response.data.data;
  },
  updateUser: async (id: string, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/api/users/${id}`, data, { headers: getHeaders() });
    return response.data.data;
  },
  createUser: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/api/users`, data, { headers: getHeaders() });
    return response.data.data;
  },
  deleteUser: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/api/users/${id}`, { headers: getHeaders() });
    return response.data;
  },
  deleteRole: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/api/roles/${id}`, { headers: getHeaders() });
    return response.data;
  }
};

export default {
  getCurrentUser,
  setCurrentUser,
  getPermissionsForRole,
  getCurrentUserPermissions,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  canPerformAction,
  getRoleBadgeColor,
  logPermissionAction,
  getAuditLogs,
  getAllUsers,
  PERMISSION_DESCRIPTIONS,
  MOCK_USERS,
  api: rbacApi,
};
