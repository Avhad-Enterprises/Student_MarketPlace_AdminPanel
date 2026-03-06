"use client";

import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { ChevronLeft } from 'lucide-react';
import CommunicationsOverviewPage from '../components/CommunicationsOverviewPage';

export default function CommunicationsPage() {
    const [view, setView] = useState('overview');
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

    const handleNavigate = (page: string) => {
        setView(page);
    };

    const handleEditCampaign = (id: string) => {
        setSelectedCampaignId(id);
    };

    return (
        <AdminLayout activePage="communications">
            {view === 'overview' ? (
                <CommunicationsOverviewPage
                    onNavigate={handleNavigate}
                    onEditCampaign={handleEditCampaign}
                />
            ) : (
                <div className="py-6 px-10">
                    <button
                        onClick={() => setView('overview')}
                        className="mb-6 flex items-center gap-2 text-indigo-600 font-medium hover:underline"
                    >
                        <ChevronLeft size={20} /> Back to Overview
                    </button>
                    <div className="bg-white rounded-[32px] p-12 border border-gray-100 shadow-xl text-center">
                        <h2 className="text-2xl font-bold text-[#0e042f] mb-3">
                            {view === 'create-message' ? 'Create New Message' : 'Edit Message Details'}
                        </h2>
                        <p className="text-gray-500">
                            {view === 'create-message'
                                ? 'This feature is coming soon. You will be able to compose emails and SMS here.'
                                : `Viewing details for log ID: ${selectedCampaignId}. Component under development.`}
                        </p>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
