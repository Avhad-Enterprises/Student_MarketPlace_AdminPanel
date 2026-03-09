"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { SOPAssistantSettingsPage } from '../../components/SOPAssistantSettingsPage';

export default function SOPAssistantSettings() {
    return (
        <AdminLayout activePage="sop-settings">
            <SOPAssistantSettingsPage />
        </AdminLayout>
    );
}
