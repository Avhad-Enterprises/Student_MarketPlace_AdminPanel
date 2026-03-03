"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { HousingOverviewPage } from "@/components/HousingOverviewPage";
import { useRouter } from "next/navigation";

export default function HousingRoute() {
    const router = useRouter();

    return (
        <AdminLayout activePage="services-housing">
            <HousingOverviewPage onNavigate={(page) => router.push(page)} />
        </AdminLayout>
    );
}
