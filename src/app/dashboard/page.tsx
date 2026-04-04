"use client";

import { AdminLayout } from "@/app/components/AdminLayout";
import { AdminDashboardPage } from "@/app/components/AdminDashboardPage";
import { useRouter } from "next/navigation";
import { PermissionGuard } from "@/app/components/common/PermissionGuard";

export default function DashboardRoute() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        router.push("/login");
    };

    return (
        <AdminLayout activePage="dashboard" onLogout={handleLogout}>
            <PermissionGuard module="dashboard" action="view">
                <AdminDashboardPage />
            </PermissionGuard>
        </AdminLayout>
    );
}
