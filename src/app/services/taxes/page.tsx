"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { TaxesOverviewPage } from "@/components/TaxesOverviewPage";
import { useRouter } from "next/navigation";

export default function TaxesRoute() {
    const router = useRouter();

    return (
        <AdminLayout activePage="services-taxes">
            <TaxesOverviewPage onNavigate={(page) => router.push(page)} />
        </AdminLayout>
    );
}
