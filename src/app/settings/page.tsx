"use client";

import React from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { SettingsOverviewPage } from '../components/SettingsOverviewPage';
import { PermissionGuard } from '../components/common/PermissionGuard';

export default function SettingsPage() {
    return (
        <AdminLayout activePage="settings">
            <PermissionGuard module="settings" action="view">
                <SettingsOverviewPage />
            </PermissionGuard>
        </AdminLayout>
    );
}
