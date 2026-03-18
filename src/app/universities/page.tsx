"use client";

export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import { AdminLayout } from "@/components/AdminLayout";
import { UniversitiesOverviewPage } from "@/components/UniversitiesOverviewPage";

export default function UniversitiesPage() {
  return (
    <AdminLayout activePage="universities-list">
      <Suspense fallback={<div>Loading Universities...</div>}>
        <UniversitiesOverviewPage />
      </Suspense>
    </AdminLayout>
  );
}
