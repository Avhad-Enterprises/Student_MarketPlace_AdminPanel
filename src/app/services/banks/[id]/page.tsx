"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { BankProviderDetail } from "@/components/BankProviderDetail";
import { useParams, useRouter } from "next/navigation";

export default function BankProviderDetailRoute() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <AdminLayout activePage="services-banks" onNavigate={(page) => router.push(`/${page.replace('-', '/')}`)}>
            <BankProviderDetail providerId={id} />
        </AdminLayout>
    );
}
