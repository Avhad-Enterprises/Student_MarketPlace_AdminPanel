"use client";

export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import { AdminLayout } from "@/components/AdminLayout";
import { UniversitiesOverviewPage } from "@/components/UniversitiesOverviewPage";
import { PermissionGuard } from "@/app/components/common/PermissionGuard";

export default function UniversitiesPage() {
  return (
    <AdminLayout activePage="universities-list">
      <PermissionGuard module="universities" action="view">
        <Suspense fallback={<div>Loading Universities...</div>}>
          <UniversitiesOverviewPage />
        </Suspense>
      </PermissionGuard>
    </AdminLayout>
  );
}
