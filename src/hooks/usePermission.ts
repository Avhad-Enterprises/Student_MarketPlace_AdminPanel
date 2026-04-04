import { useState, useEffect } from 'react';
import rbacService from '../services/rbacService';
import { PermissionAction } from '../types/rbac';

/**
 * Hook to check if the current user has permission for a specific module and action.
 * Also handles re-evaluating when localStorage changes (e.g. on login/logout).
 */
export const usePermission = (module: string, action: PermissionAction = 'view') => {
    const [hasPerm, setHasPerm] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const check = () => {
            const result = rbacService.hasPermission(module, action);
            setHasPerm(result);
            setIsLoading(false);
        };

        check();

        // Optional: Listen for storage events to update when user logs in/out in another tab
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'auth_user') {
                check();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Custom event for same-tab updates if needed
        window.addEventListener('auth_state_changed', check);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth_state_changed', check);
        };
    }, [module, action]);

    return { hasPermission: hasPerm, isLoading };
};
