"use client";

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { InsuranceOverviewPage } from '@/components/InsuranceOverviewPage';

export default function InsurancePage() {
    return (
        <AdminLayout>
            <InsuranceOverviewPage />
        </AdminLayout>
    );
}
