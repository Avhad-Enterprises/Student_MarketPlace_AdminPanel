'use client';

/**
 * FEEDBACK & TAGS TAB
 * 
 * Analytics-lite dashboard showing:
 * - Feedback distribution
 * - Top complaint tags
 * - Most problematic features
 * - Low confidence responses table
 */

import React from 'react';
import {
    ThumbsUp,
    ThumbsDown,
    AlertTriangle,
    TrendingDown,
    Eye,
} from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackTagsTabProps {
    onNavigate: (page: string, conversationId?: string) => void;
}

export const FeedbackTagsTab: React.FC<FeedbackTagsTabProps> = ({ onNavigate }) => {
    const feedbackDistribution = [
        { type: 'Positive', count: 678, percentage: 67.8, color: 'bg-green-500' },
        { type: 'Neutral', count: 256, percentage: 25.6, color: 'bg-blue-500' },
        { type: 'Negative', count: 66, percentage: 6.6, color: 'bg-red-500' },
    ];

    const topComplaintTags = [
        { tag: 'Slow Response', count: 28, color: 'bg-red-50 text-red-700 border-red-200' },
        { tag: 'Incomplete Answer', count: 19, color: 'bg-orange-50 text-orange-700 border-orange-200' },
        { tag: 'Outdated Data', count: 12, color: 'bg-amber-50 text-amber-700 border-amber-200' },
        { tag: 'Wrong Intent', count: 7, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    ];

    const problematicFeatures = [
        { feature: 'Financial Planning', issues: 15, avgConfidence: 62 },
        { feature: 'University Matcher', issues: 8, avgConfidence: 71 },
        { feature: 'Document Guide', issues: 4, avgConfidence: 78 },
    ];

    const lowConfidenceConversations = [
        { id: 'C-10236', student: 'Sarah Mitchell', feature: 'University Matcher', confidence: 56, rating: 2 },
        { id: 'C-10238', student: 'Li Wei', feature: 'Financial Planning', confidence: 48, rating: 1 },
        { id: 'C-10243', student: 'Chen Wang', feature: 'University Matcher', confidence: 58, rating: 2 },
    ];

    return (
        <div className="px-8 py-6">
            <div className="max-w-[1920px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Feedback Distribution */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-[#253154] mb-6">Feedback Distribution</h3>
                        <div className="space-y-4">
                            {feedbackDistribution.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-700">{item.type}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">{item.count}</span>
                                            <span className="text-sm font-bold text-[#253154]">{item.percentage}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`${item.color} h-3 rounded-full transition-all`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Complaint Tags */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-[#253154] mb-6">Top Complaint Tags</h3>
                        <div className="space-y-3">
                            {topComplaintTags.map((complaint, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${complaint.color}`}>
                                        {complaint.tag}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#253154]">{complaint.count} reports</span>
                                        <button
                                            onClick={() => toast.info(`Viewing ${complaint.tag} conversations`)}
                                            className="p-1.5 hover:bg-white rounded-lg transition-colors"
                                        >
                                            <Eye size={16} className="text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Most Problematic Features */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
                    <h3 className="text-lg font-bold text-[#253154] mb-6 flex items-center gap-2">
                        <AlertTriangle size={20} />
                        Most Problematic Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {problematicFeatures.map((item, idx) => (
                            <div key={idx} className="flex flex-col justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                                <div className="mb-4">
                                    <p className="font-semibold text-[#253154]">{item.feature}</p>
                                    <p className="text-sm text-gray-600 mt-1">{item.issues} issues reported</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500">Avg Confidence</p>
                                        <p className="text-lg font-bold text-red-600">{item.avgConfidence}%</p>
                                    </div>
                                    <button
                                        onClick={() => toast.info(`Viewing ${item.feature} issues`)}
                                        className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                                    >
                                        Review Issues
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Confidence Responses Table */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                        <h3 className="text-lg font-bold text-[#253154] flex items-center gap-2">
                            <TrendingDown size={20} />
                            Low Confidence Responses
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white sticky top-0 z-10">
                                <tr className="border-b border-gray-200">
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Conversation ID</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Student</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Feature</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Confidence</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Rating</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowConfidenceConversations.map((conv) => (
                                    <tr
                                        key={conv.id}
                                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-[#253154]">{conv.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-[#253154]">{conv.student}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{conv.feature}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700">
                                                {conv.confidence}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                {conv.rating && (
                                                    <>
                                                        <ThumbsDown size={14} className="text-red-500" />
                                                        <span className="text-sm font-medium text-gray-700">{conv.rating}.0</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => onNavigate('conversation-detail', conv.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <Eye size={16} className="text-gray-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
