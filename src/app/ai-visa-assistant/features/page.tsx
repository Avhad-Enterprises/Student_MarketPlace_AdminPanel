"use client";

import React, { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { FeaturesManager } from '../../components/FeaturesManager';
import { FeatureDetail } from '../../components/FeatureDetail';
import { PermissionGuard } from '../../components/common/PermissionGuard';

export default function AIFeaturesPage() {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

    const handleNavigate = React.useCallback((page: string, featureId?: string) => {
        console.log('[DEBUG_NAV] handleNavigate received:', { page, featureId });

        if (page === 'feature-detail' && featureId) {
            console.log('Setting selectedFeatureId:', featureId);
            setSelectedFeatureId(featureId);
            setView('detail');
        } else if (page === 'list') {
            console.log('Navigating back to list');
            setView('list');
            setSelectedFeatureId(null);
        }
    }, []);

    return (
        <AdminLayout activePage="ai-features">
            <PermissionGuard module="ai-visa-assistant" action="view">
                {view === 'list' ? (
                    <FeaturesManager onNavigate={handleNavigate} />
                ) : (
                    <FeatureDetail
                        key={selectedFeatureId || 'loading'}
                        featureId={selectedFeatureId || ''}
                        onBack={() => handleNavigate('list')}
                    />
                )}
            </PermissionGuard>
        </AdminLayout>
    );
}
