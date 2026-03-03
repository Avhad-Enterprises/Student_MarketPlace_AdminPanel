"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminDashboardPage } from "@/components/AdminDashboardPage";
import { useRouter } from "next/navigation";

export default function DashboardRoute() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        router.push("/login");
    };

    return (
        <AdminLayout activePage="dashboard" onLogout={handleLogout}>
            <AdminDashboardPage />
        </AdminLayout>
    );
}
