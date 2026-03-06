"use client";

import React from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { SettingsOverviewPage } from '../components/SettingsOverviewPage';

export default function SettingsPage() {
    return (
        <AdminLayout activePage="settings">
            <SettingsOverviewPage />
        </AdminLayout>
    );
}
