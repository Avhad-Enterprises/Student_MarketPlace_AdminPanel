'use client';

import React from 'react';
import { AIVisaAssistantSettings } from '@/app/components/AIVisaAssistantSettings';
import { AdminLayout } from '@/app/components/AdminLayout';

export default function AIVisaSettingsPage() {
    return (
        <AdminLayout activePage="ai-setup">
            <AIVisaAssistantSettings />
        </AdminLayout>
    );
}
