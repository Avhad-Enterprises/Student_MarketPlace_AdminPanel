"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { VisaProviderDetail } from "@/components/VisaProviderDetail";
import { useParams, useRouter } from "next/navigation";

export default function VisaProviderDetailRoute() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <AdminLayout activePage="services-visa" onNavigate={(page) => router.push(`/${page.replace('-', '/')}`)}>
            <VisaProviderDetail providerId={id} />
        </AdminLayout>
    );
}
