"use client";

import React, { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { FlowsAndForms } from '../../components/FlowsAndForms';
import { FlowDetail } from '../../components/FlowDetail';
import { PermissionGuard } from '../../components/common/PermissionGuard';

export default function AIFlowsPage() {
    const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
    const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

    const handleNavigate = (page: string, flowId?: string) => {
        if (page === 'flow-detail' && flowId) {
            setSelectedFlowId(flowId);
            setCurrentView('detail');
        }
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedFlowId(null);
    };

    return (
        <AdminLayout activePage="ai-flows">
            <PermissionGuard module="ai-visa-assistant" action="view">
                {currentView === 'list' ? (
                    <FlowsAndForms onNavigate={handleNavigate} />
                ) : (
                    selectedFlowId && <FlowDetail onBack={handleBackToList} flowId={selectedFlowId} />
                )}
            </PermissionGuard>
        </AdminLayout>
    );
}
