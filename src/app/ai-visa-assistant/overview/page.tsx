'use client';

import React from 'react';
import { AIVisaOverview } from '@/app/components/AIVisaOverview';
import { AdminLayout } from '@/app/components/AdminLayout';

export default function AIVisaOverviewPage() {
    return (
        <AdminLayout activePage="ai-overview">
            <AIVisaOverview />
        </AdminLayout>
    );
}
