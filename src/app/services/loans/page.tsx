"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { LoansOverviewPage } from '../../components/LoansOverviewPage';

export default function LoansPage() {
    return (
        <AdminLayout>
            <LoansOverviewPage />
        </AdminLayout>
    );
}
