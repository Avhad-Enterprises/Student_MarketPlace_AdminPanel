"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { AssistantSetup } from '../../components/AssistantSetup';
import { PermissionGuard } from '../../components/common/PermissionGuard';

export default function AISetupPage() {
    return (
        <AdminLayout activePage="ai-setup">
            <PermissionGuard module="ai-visa-assistant" action="view">
                <AssistantSetup />
            </PermissionGuard>
        </AdminLayout>
    );
}
