'use client';

/**
 * CONVERSATIONS & QUALITY - MAIN PAGE WITH TABS
 * 
 * AI Visa Assistant → Conversations & Quality
 * 
 * Tabs:
 * - All Conversations (main listing)
 * - Review Queue
 * - Feedback & Tags
 * 
 * MATCHES STUDENTS LISTING STRUCTURE 1:1
 */

import React, { useState } from 'react';
import { ConversationsListingTab } from './conversations-quality/ConversationsListingTab';
import { ReviewQueueTab } from './conversations-quality/ReviewQueueTab';
import { FeedbackTagsTab } from './conversations-quality/FeedbackTagsTab';

interface ConversationsQualityProps {
    onNavigate: (page: string, conversationId?: string) => void;
}

type TabType = 'all' | 'queue' | 'feedback';

export const ConversationsQuality: React.FC<ConversationsQualityProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<TabType>('all');

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#faf7ff] via-white to-[#f8faff]">
            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-[1920px] mx-auto px-8">
                    <div className="flex items-center gap-6 pt-6">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all'
                                    ? 'border-[#0e042f] text-[#0e042f]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            All Conversations
                        </button>
                        <button
                            onClick={() => setActiveTab('queue')}
                            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'queue'
                                    ? 'border-[#0e042f] text-[#0e042f]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Review Queue
                        </button>
                        <button
                            onClick={() => setActiveTab('feedback')}
                            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'feedback'
                                    ? 'border-[#0e042f] text-[#0e042f]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Feedback & Tags
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === 'all' && <ConversationsListingTab onNavigate={onNavigate} />}
                {activeTab === 'queue' && <ReviewQueueTab onNavigate={onNavigate} />}
                {activeTab === 'feedback' && <FeedbackTagsTab onNavigate={onNavigate} />}
            </div>
        </div>
    );
};
