'use client';

import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '../../../../components/AdminLayout';
import { IssueDetail } from '../../../../components/IssueDetail';
import { toast } from 'sonner';

export default function IssueDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const handleUpdateStatus = (issueId: string, status: string) => {
        toast.success(`Status updated for ${issueId} to ${status}`);
    };

    return (
        <AdminLayout activePage="ai-test-reports">
            <IssueDetail
                issueId={id}
                onBack={() => router.push('/ai-test-assistant/reports')}
                onUpdateStatus={handleUpdateStatus}
            />
        </AdminLayout>
    );
}
