"use client";

import React, { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { FeaturesManager } from '../../components/FeaturesManager';
import { FeatureDetail } from '../../components/FeatureDetail';

export default function AIFeaturesPage() {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

    const handleNavigate = (page: string, featureId?: string) => {
        if (page === 'feature-detail' && featureId) {
            setSelectedFeatureId(featureId);
            setView('detail');
        } else if (page === 'list') {
            setView('list');
            setSelectedFeatureId(null);
        }
    };

    return (
        <AdminLayout activePage="ai-features">
            {view === 'list' ? (
                <FeaturesManager onNavigate={handleNavigate} />
            ) : (
                <FeatureDetail
                    featureId={selectedFeatureId || 'feat-001'}
                    onBack={() => setView('list')}
                />
            )}
        </AdminLayout>
    );
}
