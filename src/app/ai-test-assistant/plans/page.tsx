'use client';

import { useRouter } from 'next/navigation';
import { AdminLayout } from '../../components/AdminLayout';
import { AITestPlans } from '../../components/AITestPlans';
import { PermissionGuard } from '../../components/common/PermissionGuard';

export default function AITestPlansPage() {
    const router = useRouter();

    const handleNavigate = (page: string) => {
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
        <AdminLayout activePage="ai-test-plans">
            <PermissionGuard module="ai-test-assistant" action="view">
                <AITestPlans onNavigate={handleNavigate} />
            </PermissionGuard>
        </AdminLayout>
    );
}
