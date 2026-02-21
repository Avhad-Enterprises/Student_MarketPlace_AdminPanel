"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { HousingProviderDetail } from "@/components/HousingProviderDetail";
import { useParams, useRouter } from "next/navigation";

export default function HousingProviderDetailRoute() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <AdminLayout activePage="services-housing" onNavigate={(page) => router.push(`/${page.replace('-', '/')}`)}>
            <HousingProviderDetail providerId={id} />
        </AdminLayout>
    );
}
