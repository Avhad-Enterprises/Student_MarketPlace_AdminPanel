"use client";

import { AdminLayout } from "@/components/AdminLayout";
import BlogsOverviewPage from "@/components/BlogsOverviewPage";
import { useRouter } from "next/navigation";

export default function BlogsPage() {
    const router = useRouter();

    return (
        <AdminLayout activePage="blogs">
            <BlogsOverviewPage onNavigate={(page: string) => router.push(page)} />
        </AdminLayout>
    );
}
