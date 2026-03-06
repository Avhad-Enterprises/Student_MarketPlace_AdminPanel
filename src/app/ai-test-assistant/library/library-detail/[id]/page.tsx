'use client';

import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '../../../../components/AdminLayout';
import { LibraryItemDetail } from '../../../../components/LibraryItemDetail';
import { toast } from 'sonner';

export default function LibraryItemDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const handleSave = (item: any) => {
        toast.success(`Library item ${item.id} saved successfully`);
    };

    return (
        <AdminLayout activePage="ai-test-library">
            <LibraryItemDetail
                itemId={id}
                onBack={() => router.push('/ai-test-assistant/library')}
                onSave={handleSave}
            />
        </AdminLayout>
    );
}
