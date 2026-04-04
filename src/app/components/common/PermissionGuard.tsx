"use client";

import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import { PermissionAction } from '@/types/rbac';
import { UnauthorizedPage } from './UnauthorizedPage';

interface PermissionGuardProps {
    module: string;
    action?: PermissionAction;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * A wrapper component that only renders children if the current user has the required permission.
 * Automatically handles unauthorized UI for top-level view checks.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    module,
    action = 'view',
    children,
    fallback
}) => {
    const { hasPermission, isLoading } = usePermission(module, action);

    if (isLoading) return null; // Or a skeleton/spinner if needed

    if (!hasPermission) {
        // Log unauthorized attempt for auditing
        console.warn(`[RBAC] Unauthorized access attempt: Module="${module}", Action="${action}"`);
        
        // If a specific fallback is provided (e.g. for action-level buttons), use it.
        // Otherwise, if it's a view-level check, show the full UnauthorizedPage.
        if (fallback !== undefined) {
            return <>{fallback}</>;
        }
        
        if (action === 'view') {
            return <UnauthorizedPage />;
        }
        
        return null;
    };

    return <>{children}</>;
};

export default PermissionGuard;
