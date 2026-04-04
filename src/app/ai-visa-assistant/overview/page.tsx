'use client';

import React from 'react';
import { AIVisaOverview } from '@/app/components/AIVisaOverview';
import { AdminLayout } from '@/app/components/AdminLayout';
import { PermissionGuard } from '@/app/components/common/PermissionGuard';

export default function AIVisaOverviewPage() {
    return (
        <AdminLayout activePage="ai-overview">
            <PermissionGuard module="ai-visa-assistant" action="view">
                <AIVisaOverview />
            </PermissionGuard>
        </AdminLayout>
    );
}
