"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { SIMCardsOverviewPage } from '../../components/SIMCardsOverviewPage';

export default function SIMCardsPage() {
    return (
        <AdminLayout>
            <SIMCardsOverviewPage />
        </AdminLayout>
    );
}
