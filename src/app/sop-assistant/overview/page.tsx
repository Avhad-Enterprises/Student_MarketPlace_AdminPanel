'use client';

import React from 'react';
import { SOPAssistantOverviewPage } from '../../components/SOPAssistantOverviewPage';
import { AdminLayout } from '../../components/AdminLayout';
import { PermissionGuard } from '../../components/common/PermissionGuard';

export default function SOPOverviewPage() {
    return (
        <AdminLayout activePage="sop-overview">
            <PermissionGuard module="sop-assistant" action="view">
                <SOPAssistantOverviewPage />
            </PermissionGuard>
        </AdminLayout>
    );
}
