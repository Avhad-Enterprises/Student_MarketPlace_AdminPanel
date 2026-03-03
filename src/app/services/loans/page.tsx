"use client";

import { useRouter } from 'next/navigation';
import { AdminLayout } from '../../components/AdminLayout';
import { LoansOverviewPage } from '../../components/LoansOverviewPage';

export default function LoansPage() {
    const router = useRouter();

    return (
        <AdminLayout activePage="services-loans">
            <LoansOverviewPage onNavigate={(page) => router.push(page)} />
        </AdminLayout>
    );
}
