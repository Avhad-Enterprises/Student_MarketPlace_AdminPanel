'use client';

import { useRouter } from 'next/navigation';
import { AdminLayout } from '../../components/AdminLayout';
import { AITestReports } from '../../components/AITestReports';
import { PermissionGuard } from '../../components/common/PermissionGuard';

export default function AITestReportsPage() {
    const router = useRouter();

    const handleNavigate = (page: string, id?: string) => {
        if (page === 'issue-detail' && id) {
            router.push(`/ai-test-assistant/reports/issue-detail/${id}`);
            return;
        }

        const routes: Record<string, string> = {
            'ai-test-overview': '/ai-test-assistant/overview',
            'ai-test-library': '/ai-test-assistant/library',
            'ai-test-reports': '/ai-test-assistant/reports',
            'ai-test-scoring': '/ai-test-assistant/scoring',
            'ai-test-plans': '/ai-test-assistant/plans',
        };

        const target = routes[page] || `/ai-test-assistant/${page.replace('ai-test-', '')}`;
        router.push(target);
    };

    return (
        <AdminLayout activePage="ai-test-reports">
            <PermissionGuard module="ai-test-assistant" action="view">
                <AITestReports onNavigate={handleNavigate} />
            </PermissionGuard>
        </AdminLayout>
    );
}
