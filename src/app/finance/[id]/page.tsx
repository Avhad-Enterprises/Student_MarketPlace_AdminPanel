"use client";

import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { FinanceInvoiceDetail } from '@/components/FinanceInvoiceDetail';
import { useRouter, useParams } from 'next/navigation';

export default function InvoiceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    return (
        <AdminLayout activePage="finance">
            <FinanceInvoiceDetail 
              invoiceId={id} 
              onBack={() => router.push('/finance')} 
            />
        </AdminLayout>
    );
}
