import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { PermissionAction, ModulePermission, PermissionMap } from '../types/rbac';

const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

/**
 * Mapping between UI route names and RBAC backend module identifiers.
 */
export const ROUTE_TO_MODULE_MAP: Record<string, string> = {
    "ai-visa-assistant": "ai_visa",
    "ai-test-assistant": "ai_test",
    "sop-assistant": "sop_assistant",
    "online-store": "orders",
    "communications": "communications",
    "enquiries": "enquiries",
    "students": "students",
    "finance": "finance",
    "bookings": "bookings",
    "reports": "reports",
    "settings": "settings",
    "dashboard": "dashboard",
    "universities": "universities",
    "blogs": "blogs",
    "countries": "countries",
    "profile": "profile",
    "services": "services"
};

/**
 * Resolves a UI module/route name to its backend RBAC identifier.
 * Includes validation and logging for unknown modules to prevent silent mismatches.
 * Strictly enforces mapping and avoids silent fallbacks.
 */
export const resolveModule = (module: string): string => {
    if (!module) return 'unknown';

    const mapped = ROUTE_TO_MODULE_MAP[module];
    if (!mapped) {
        // Find if it's already a backend identifier (value in the map)
        const commonIdentifiers = Object.values(ROUTE_TO_MODULE_MAP);
        if (commonIdentifiers.includes(module.toLowerCase())) {
            return module.toLowerCase();
        }

        // CRITICAL WARNING: Non-mapped module detected
        console.error(`[RBAC-SECURITY] UNMAPPED MODULE DETECTED: "${module}". No backend equivalent found. Access will be denied by default.`);
        return `unmapped:${module}`; 
    }
    return mapped;
};

/**
 * Checks if the current user has permission for a specific module and action.
 * @param module - Module name or UI route (e.g., 'students')
 * @param action - Action name (e.g., 'view', 'create', 'edit', 'delete')
 * @returns boolean
 */
export const hasPermission = (module: string, action: PermissionAction): boolean => {
    if (typeof window === 'undefined') return false;

    try {
        const userJson = localStorage.getItem('auth_user');
        if (!userJson) return false;

        const user = JSON.parse(userJson);

        // --- SUPER ADMIN BYPASS ---
        // Super admin bypasses all permission checks for system recovery and full access.
        if (user.role?.is_system || user.role?.name === 'Admin' || user.role?.name === 'Super Admin') {
            return true;
        }

        const permissions: PermissionMap = user.permissions || user.role?.permissions || {};

        // Resolve the module key using the central mapping
        const moduleKey = resolveModule(module);
        const modulePermissions: ModulePermission = permissions[moduleKey];

        if (!modulePermissions) {
            // Log missing module permissions for debugging
            if (!moduleKey.startsWith('unmapped:')) {
                console.warn(`[RBAC] No permission object found for module: "${moduleKey}" (resolved from "${module}")`);
            }
            return false;
        }

        const isAllowed = !!modulePermissions[action];

        if (!isAllowed) {
            // Log unauthorized attempt for auditing (Page/Action level logging)
            console.warn(`[RBAC-AUDIT] Unauthorized access attempt: User="${user.email}", Module="${moduleKey}", Action="${action}"`);
        }

        return isAllowed;
    } catch (error) {
        console.error('[RBAC] Error checking permission:', error);
        return false;
    }
};

/**
 * Checks if the current user has view permission for a specific module.
 */
export const canViewModule = (module: string): boolean => {
    return hasPermission(module, 'view');
};

/**
 * Gets all permissions for the current user.
 */
export const getCurrentUserPermissions = (): PermissionMap => {
    if (typeof window === 'undefined') return {};

    try {
        const userJson = localStorage.getItem('auth_user');
        if (!userJson) return {};

        const user = JSON.parse(userJson);
        return user.permissions || user.role?.permissions || {};
    } catch (e) {
        return {};
    }
};

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
    deleteRole: async (id: string) => {
        const response = await axios.delete(`${API_BASE_URL}/api/roles/${id}`, { headers: getHeaders() });
        return response.data;
    },
    getUsers: async () => {
        const response = await axios.get(`${API_BASE_URL}/api/users`, { headers: getHeaders() });
        return response.data.data;
    },
    createUser: async (data: any) => {
        const response = await axios.post(`${API_BASE_URL}/api/users`, data, { headers: getHeaders() });
        return response.data.data;
    },
    updateUser: async (id: string, data: any) => {
        const response = await axios.put(`${API_BASE_URL}/api/users/${id}`, data, { headers: getHeaders() });
        return response.data.data;
    },
    deleteUser: async (id: string) => {
        const response = await axios.delete(`${API_BASE_URL}/api/users/${id}`, { headers: getHeaders() });
        return response.data;
    },
    resetUserPassword: async (id: string, newPassword: string) => {
        // Uses a dedicated password reset endpoint that handles hashing separately
        const response = await axios.post(`${API_BASE_URL}/api/users/${id}/reset-password`, { password: newPassword }, { headers: getHeaders() });
        return response.data;
    },
};

export default {
    hasPermission,
    canViewModule,
    getCurrentUserPermissions,
    resolveModule,
    ROUTE_TO_MODULE_MAP,
    api: rbacApi,
};
