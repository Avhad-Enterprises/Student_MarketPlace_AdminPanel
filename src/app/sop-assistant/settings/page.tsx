"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { SOPAssistantSettingsPage } from '../../components/SOPAssistantSettingsPage';
import { PermissionGuard } from '../../components/common/PermissionGuard';

export default function SOPAssistantSettings() {
    return (
        <AdminLayout activePage="sop-settings">
            <PermissionGuard module="sop-assistant" action="view">
                <SOPAssistantSettingsPage />
            </PermissionGuard>
        </AdminLayout>
    );
}
