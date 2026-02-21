"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { ForexOverviewPage } from "@/components/ForexOverviewPage";
import { useRouter } from "next/navigation";

export default function ForexRoute() {
    const router = useRouter();

    return (
        <AdminLayout activePage="services-forex" onNavigate={(page) => router.push(`/${page.replace('-', '/')}`)}>
            <ForexOverviewPage />
        </AdminLayout>
    );
}
