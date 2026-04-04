"use client";

import { AdminLayout } from "@/components/AdminLayout";
import BlogsOverviewPage from "@/components/BlogsOverviewPage";
import { useRouter } from "next/navigation";
import { PermissionGuard } from "@/app/components/common/PermissionGuard";

export default function BlogsPage() {
    const router = useRouter();

    return (
        <AdminLayout activePage="blogs">
            <PermissionGuard module="blogs" action="view">
                <BlogsOverviewPage onNavigate={(page: string) => router.push(page)} />
            </PermissionGuard>
        </AdminLayout>
    );
}
