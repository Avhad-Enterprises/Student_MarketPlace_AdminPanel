'use client';

import { useRouter } from 'next/navigation';
import { AdminLayout } from '../../components/AdminLayout';
import { AITestLibrary } from '../../components/AITestLibrary';
import { PermissionGuard } from '../../components/common/PermissionGuard';

export default function AITestLibraryPage() {
    const router = useRouter();

    const handleNavigate = (page: string) => {
        if (page.startsWith('library-detail-')) {
            const parts = page.split('-');
            const itemId = parts[parts.length - 1];
            router.push(`/ai-test-assistant/library/library-detail/${itemId}`);
            return;
        }

        // Map internal paths to Next.js routes
        const routes: Record<string, string> = {
            'ai-test-overview': '/ai-test-assistant/overview',
            'ai-test-library': '/ai-test-assistant/library',
            'ai-test-reports': '/ai-test-assistant/reports',
            'ai-test-scoring': '/ai-test-assistant/scoring',
            'ai-test-plans': '/ai-test-assistant/plans',
        };

        const target = routes[page] || `/ai-test-assistant/${page}`;
        router.push(target);
    };

    return (
        <AdminLayout activePage="ai-test-library">
            <PermissionGuard module="ai-test-assistant" action="view">
                <AITestLibrary onNavigate={handleNavigate} />
            </PermissionGuard>
        </AdminLayout>
    );
}
