"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { VisaOverviewPage } from "@/components/VisaOverviewPage";
import { useRouter } from "next/navigation";

export default function VisaRoute() {
    const router = useRouter();

    return (
        <AdminLayout activePage="services-visa" onNavigate={(page) => router.push(`/${page.replace('-', '/')}`)}>
            <VisaOverviewPage />
        </AdminLayout>
    );
}
