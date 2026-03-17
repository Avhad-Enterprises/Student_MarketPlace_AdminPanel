"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { CountryForm } from '@/components/CountryForm';

export default function AddCountryPage() {
    return (
        <AdminLayout activePage="countries-list">
            <CountryForm />
        </AdminLayout>
    );
}
