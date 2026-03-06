"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { AssistantSetup } from '../../components/AssistantSetup';

export default function AISetupPage() {
    return (
        <AdminLayout activePage="ai-setup">
            <AssistantSetup />
        </AdminLayout>
    );
}
