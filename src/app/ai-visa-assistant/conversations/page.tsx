"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { ConversationsQuality } from '../../components/ConversationsQuality';

export default function AIConversationsPage() {
    const handleNavigate = (page: string, id?: string) => {
        console.log(`Navigating to ${page} ${id ? `with id: ${id}` : ''}`);
        // Add navigation logic if needed or when detail page is ready
    };

    return (
        <AdminLayout activePage="ai-conversations">
            <ConversationsQuality onNavigate={handleNavigate} />
        </AdminLayout>
    );
}
