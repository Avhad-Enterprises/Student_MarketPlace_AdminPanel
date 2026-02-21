"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { ForexProviderDetail } from "@/components/ForexProviderDetail";
import { useParams, useRouter } from "next/navigation";

export default function ForexProviderDetailRoute() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <AdminLayout activePage="services-forex" onNavigate={(page) => router.push(`/${page.replace('-', '/')}`)}>
            <ForexProviderDetail providerId={id} />
        </AdminLayout>
    );
}
