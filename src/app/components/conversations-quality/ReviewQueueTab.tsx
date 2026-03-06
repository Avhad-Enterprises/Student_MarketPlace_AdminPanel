'use client';

/**
 * REVIEW QUEUE TAB
 * 
 * Shows only conversations that need review
 * Same table structure as All Conversations
 */

import React, { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    ArrowUpDown,
    Eye,
    MoreHorizontal,
    CheckCircle2,
    AlertTriangle,
    Check,
    ChevronLeft,
    ChevronRight,
    Columns,
    MessageSquare,
    Clock,
    Users,
    Flag,
} from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CustomSelect } from '../common/CustomSelect';

interface ReviewQueueTabProps {
    onNavigate: (page: string, conversationId?: string) => void;
}

interface ReviewItem {
    id: string;
    student: string;
    issueType: string;
    confidence: number;
    rating: number | null;
    status: 'needs-review';
    assignedReviewer: string | null;
    flaggedAt: string;
}

const mockReviewQueue: ReviewItem[] = [
    {
        id: 'C-10236',
        student: 'Sarah Mitchell',
        issueType: 'Low Confidence',
        confidence: 56,
        rating: 2,
        status: 'needs-review',
        assignedReviewer: null,
        flaggedAt: '5 hours ago',
    },
    {
        id: 'C-10238',
        student: 'Li Wei',
        issueType: 'Escalated',
        confidence: 48,
        rating: 1,
        status: 'needs-review',
        assignedReviewer: 'Admin User',
        flaggedAt: '3 hours ago',
    },
    {
        id: 'C-10243',
        student: 'Chen Wang',
        issueType: 'Guardrail Triggered',
        confidence: 58,
        rating: 2,
        status: 'needs-review',
        assignedReviewer: null,
        flaggedAt: '4 hours ago',
    },
];

// --- CustomCheckbox Component ---
interface CustomCheckboxProps {
    checked: boolean;
    partial?: boolean;
    onChange: (checked: boolean) => void;
    ariaLabel?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    checked,
    partial = false,
    onChange,
    ariaLabel
}) => {
    return (
        <div
            role="checkbox"
            aria-checked={checked}
            aria-label={ariaLabel}
            onClick={() => onChange(!checked)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${checked || partial
                    ? 'bg-[#0e042f] border-[#0e042f]'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}
        >
            {checked && (
                <Check size={14} className="text-white" strokeWidth={3} />
            )}
            {partial && !checked && (
                <div className="w-2.5 h-0.5 bg-white rounded-full" />
            )}
        </div>
    );
};

// --- MetricCard Component ---
interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    bgClass: string;
    colorClass: string;
    tooltip: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    icon: Icon,
    bgClass,
    colorClass,
    tooltip
}) => {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between h-[130px] relative overflow-hidden group transition-all duration-300 ease-in-out border-2 border-transparent hover:shadow-lg hover:border-purple-200">
            <div className="flex items-center justify-between">
                <span className="text-[#253154] font-medium text-[15px]">{title}</span>
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors flex-shrink-0"
                            >
                                i
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2">
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex items-end gap-3 mt-2">
                <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} strokeWidth={1.5} />
                </div>
                <div>
                    <p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p>
                </div>
            </div>

            <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <Icon size={80} />
            </div>
        </div>
    );
};

export const ReviewQueueTab: React.FC<ReviewQueueTabProps> = ({ onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const metrics = [
        {
            title: 'Pending Review',
            value: mockReviewQueue.length.toString(),
            icon: Clock,
            bgClass: 'bg-amber-50',
            colorClass: 'text-amber-600',
            tooltip: 'Conversations awaiting review'
        },
        {
            title: 'Unassigned',
            value: mockReviewQueue.filter(i => !i.assignedReviewer).length.toString(),
            icon: Users,
            bgClass: 'bg-red-50',
            colorClass: 'text-red-600',
            tooltip: 'Items without assigned reviewer'
        },
        {
            title: 'Assigned',
            value: mockReviewQueue.filter(i => i.assignedReviewer).length.toString(),
            icon: CheckCircle2,
            bgClass: 'bg-green-50',
            colorClass: 'text-green-600',
            tooltip: 'Items with assigned reviewer'
        },
    ];

    const getIssueTypeBadge = (type: string) => {
        const configs: Record<string, { bgColor: string; textColor: string }> = {
            'Low Confidence': { bgColor: 'bg-red-50', textColor: 'text-red-700' },
            'Escalated': { bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
            'Guardrail Triggered': { bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
        };
        const config = configs[type] || { bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
        return (
            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                {type}
            </div>
        );
    };

    const getConfidenceBadge = (confidence: number) => {
        let bgColor = 'bg-red-50';
        let textColor = 'text-red-700';
        if (confidence >= 70) {
            bgColor = 'bg-amber-50';
            textColor = 'text-amber-700';
        }
        return (
            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold ${bgColor} ${textColor}`}>
                {confidence}%
            </div>
        );
    };

    const toggleItemSelection = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleAllItems = () => {
        if (selectedItems.length === mockReviewQueue.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(mockReviewQueue.map(i => i.id));
        }
    };

    const allSelected = selectedItems.length === mockReviewQueue.length && mockReviewQueue.length > 0;
    const someSelected = selectedItems.length > 0 && selectedItems.length < mockReviewQueue.length;

    // Filter and pagination
    const filteredItems = mockReviewQueue.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        return (
            item.id.toLowerCase().includes(searchLower) ||
            item.student.toLowerCase().includes(searchLower) ||
            item.issueType.toLowerCase().includes(searchLower)
        );
    });

    const totalPages = Math.ceil(filteredItems.length / (rowsPerPage || 1));
    const displayedItems = filteredItems.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Bulk actions
    const handleBulkAssignReviewer = () => {
        if (selectedItems.length === 0) {
            toast.error('Please select items first');
            return;
        }
        toast.success(`Assigned ${selectedItems.length} items to reviewer`);
        setSelectedItems([]);
    };

    const handleBulkMarkReviewed = () => {
        if (selectedItems.length === 0) {
            toast.error('Please select items first');
            return;
        }
        toast.success(`Marked ${selectedItems.length} items as reviewed`);
        setSelectedItems([]);
    };

    return (
        <div className="px-8 py-6">
            <div className="max-w-[1920px] mx-auto">
                {/* Metrics Section */}
                <div className="hidden lg:flex gap-4 mb-8">
                    {metrics.map((metric, index) => (
                        <div key={index} className="flex-1">
                            <MetricCard {...metric} />
                        </div>
                    ))}
                </div>

                {/* Bulk Actions Bar */}
                {selectedItems.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-900">
                            {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                        </span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBulkAssignReviewer}
                                className="px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors"
                            >
                                Bulk Assign Reviewer
                            </button>
                            <button
                                onClick={handleBulkMarkReviewed}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                                Bulk Mark Reviewed
                            </button>
                        </div>
                    </div>
                )}

                {/* Search and Filter Bar */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
                    <div className="relative flex-1 max-w-xl">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253154]" />
                        <input
                            type="text"
                            placeholder="Search by student, issue type, conversation ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-0 shadow-sm focus:ring-2 focus:ring-purple-100 outline-none text-[#253154] placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                            <Filter size={20} className="text-[#253154]" />
                        </button>
                        <button className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                            <ArrowUpDown size={20} className="text-[#253154]" />
                        </button>
                        <button className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                            <Columns size={20} className="text-[#253154]" />
                        </button>
                        <button className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                            <MoreHorizontal size={20} className="text-[#253154]" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white sticky top-0 z-10">
                                <tr className="border-b border-gray-200">
                                    <th className="px-6 py-4 text-left">
                                        <CustomCheckbox
                                            checked={allSelected}
                                            partial={someSelected}
                                            onChange={toggleAllItems}
                                            ariaLabel="Select all items"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Conversation ID</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Student</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Issue Type</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Confidence</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Rating</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Status</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Assigned Reviewer</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Flagged</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedItems.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => onNavigate('conversation-detail', item.id)}
                                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                    >
                                        <td
                                            className="px-6 py-4"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <CustomCheckbox
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleItemSelection(item.id)}
                                                ariaLabel={`Select ${item.id}`}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-[#253154]">{item.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-[#253154]">{item.student}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getIssueTypeBadge(item.issueType)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getConfidenceBadge(item.confidence)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{item.rating || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700">
                                                Needs Review
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{item.assignedReviewer || 'Unassigned'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{item.flaggedAt}</span>
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => onNavigate('conversation-detail', item.id)}
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

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Rows per page:</span>
                            <CustomSelect
                                value={rowsPerPage.toString()}
                                onChange={(value) => {
                                    setRowsPerPage(Number(value));
                                    setCurrentPage(1);
                                }}
                                options={[
                                    { value: '10', label: '10' },
                                    { value: '25', label: '25' },
                                    { value: '50', label: '50' },
                                    { value: '100', label: '100' },
                                ]}
                                className="w-20"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={20} className="text-[#253154]" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={20} className="text-[#253154]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
