"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { BanksOverviewPage } from "@/components/BanksOverviewPage";
import { useRouter } from "next/navigation";

export default function BanksRoute() {
    const router = useRouter();

    return (
        <AdminLayout activePage="services-banks">
            <BanksOverviewPage onNavigate={(page) => router.push(page)} />
        </AdminLayout>
    );
}
