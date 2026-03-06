'use client';

import React from 'react';
import { SOPAssistantOverviewPage } from '../../components/SOPAssistantOverviewPage';
import { AdminLayout } from '../../components/AdminLayout';

export default function SOPOverviewPage() {
    return (
        <AdminLayout activePage="sop-overview">
            <SOPAssistantOverviewPage />
        </AdminLayout>
    );
}
