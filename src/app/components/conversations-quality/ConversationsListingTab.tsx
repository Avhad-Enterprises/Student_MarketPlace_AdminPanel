'use client';

/**
 * ALL CONVERSATIONS TAB - LISTING PAGE
 * 
 * MATCHES STUDENTS LISTING STRUCTURE 1:1
 * - Same header with date range + actions
 * - Same metric cards
 * - Same search + filter row
 * - Same table structure
 * - Same pagination
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
    Clock,
    Star,
    ThumbsUp,
    ThumbsDown,
    Check,
    ChevronLeft,
    ChevronRight,
    Columns,
    MessageSquare,
    Users,
    TrendingUp,
    Calendar as CalendarIcon,
    RefreshCw,
    Flag,
    Tag,
    FileDown,
    AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { CustomSelect } from '../common/CustomSelect';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface ConversationsListingTabProps {
    onNavigate: (page: string, conversationId?: string) => void;
}

interface Conversation {
    id: string;
    student: string;
    country: string;
    topic: string;
    featureUsed: string;
    status: 'resolved' | 'open' | 'escalated';
    rating: number | null;
    confidence: number;
    messages: number;
    lastActive: string;
}

const mockConversations: Conversation[] = [
    {
        id: 'C-10234',
        student: 'Priya Sharma',
        country: 'India',
        topic: 'Visa requirements for Canada SDS',
        featureUsed: 'Eligibility Check',
        status: 'resolved',
        rating: 5,
        confidence: 94,
        messages: 8,
        lastActive: '2 hours ago',
    },
    {
        id: 'C-10235',
        student: 'Raj Kumar',
        country: 'India',
        topic: 'SOP review for UK universities',
        featureUsed: 'SOP Assistant',
        status: 'open',
        rating: null,
        confidence: 87,
        messages: 4,
        lastActive: '30 mins ago',
    },
    {
        id: 'C-10236',
        student: 'Sarah Mitchell',
        country: 'USA',
        topic: 'Scholarship options in Germany',
        featureUsed: 'University Matcher',
        status: 'escalated',
        rating: 2,
        confidence: 56,
        messages: 15,
        lastActive: '5 hours ago',
    },
    {
        id: 'C-10237',
        student: 'Ahmed Ali',
        country: 'Pakistan',
        topic: 'Document checklist for F-1 USA',
        featureUsed: 'Document Guide',
        status: 'resolved',
        rating: 4,
        confidence: 91,
        messages: 12,
        lastActive: '1 day ago',
    },
    {
        id: 'C-10238',
        student: 'Li Wei',
        country: 'China',
        topic: 'Financial requirements Australia',
        featureUsed: 'Financial Planning',
        status: 'escalated',
        rating: 1,
        confidence: 48,
        messages: 20,
        lastActive: '3 hours ago',
    },
    {
        id: 'C-10239',
        student: 'Maria Garcia',
        country: 'Spain',
        topic: 'Student visa eligibility UK',
        featureUsed: 'Eligibility Check',
        status: 'open',
        rating: null,
        confidence: 78,
        messages: 6,
        lastActive: '10 mins ago',
    },
    {
        id: 'C-10240',
        student: 'John Smith',
        country: 'Nigeria',
        topic: 'Post-study work visa Canada',
        featureUsed: 'Document Guide',
        status: 'resolved',
        rating: 5,
        confidence: 96,
        messages: 9,
        lastActive: '2 days ago',
    },
    {
        id: 'C-10241',
        student: 'Fatima Hassan',
        country: 'UAE',
        topic: 'SOP structure for Masters',
        featureUsed: 'SOP Assistant',
        status: 'open',
        rating: null,
        confidence: 82,
        messages: 7,
        lastActive: '1 hour ago',
    },
    {
        id: 'C-10242',
        student: 'Vikram Singh',
        country: 'India',
        topic: 'Gap year explanation tips',
        featureUsed: 'SOP Assistant',
        status: 'resolved',
        rating: 4,
        confidence: 89,
        messages: 11,
        lastActive: '6 hours ago',
    },
    {
        id: 'C-10243',
        student: 'Chen Wang',
        country: 'China',
        topic: 'University ranking comparison',
        featureUsed: 'University Matcher',
        status: 'escalated',
        rating: 2,
        confidence: 58,
        messages: 13,
        lastActive: '4 hours ago',
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

export const ConversationsListingTab: React.FC<ConversationsListingTabProps> = ({ onNavigate }) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(2024, 0, 1),
        to: new Date(2024, 11, 31),
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

    // Metric calculations
    const totalConversations = mockConversations.length;
    const activeStudents = new Set(mockConversations.map(c => c.student)).size;
    const validRatings = mockConversations.filter(c => c.rating !== null);
    const avgRating = validRatings.length > 0
        ? validRatings.reduce((sum, c) => sum + (c.rating || 0), 0) / validRatings.length
        : 0;
    const escalations = mockConversations.filter(c => c.status === 'escalated').length;
    const lowConfidenceRate = totalConversations > 0
        ? (mockConversations.filter(c => c.confidence < 70).length / totalConversations * 100).toFixed(1)
        : '0.0';

    const metrics = [
        {
            title: 'Total Conversations',
            value: totalConversations.toString(),
            icon: MessageSquare,
            bgClass: 'bg-blue-50',
            colorClass: 'text-blue-600',
            tooltip: 'Total number of AI conversations with students'
        },
        {
            title: 'Active Students',
            value: activeStudents.toString(),
            icon: Users,
            bgClass: 'bg-green-50',
            colorClass: 'text-green-600',
            tooltip: 'Number of unique students who engaged'
        },
        {
            title: 'Avg Rating',
            value: avgRating.toFixed(1),
            icon: Star,
            bgClass: 'bg-amber-50',
            colorClass: 'text-amber-600',
            tooltip: 'Average user rating across all conversations'
        },
        {
            title: 'Escalations',
            value: escalations.toString(),
            icon: AlertTriangle,
            bgClass: 'bg-red-50',
            colorClass: 'text-red-600',
            tooltip: 'Conversations requiring human intervention'
        },
        {
            title: 'Low Confidence Rate',
            value: `${lowConfidenceRate}%`,
            icon: TrendingUp,
            bgClass: 'bg-purple-50',
            colorClass: 'text-purple-600',
            tooltip: 'Percentage of conversations with confidence below 70%'
        }
    ];

    const getStatusBadge = (status: string) => {
        const configs: Record<string, { label: string; bgColor: string; textColor: string }> = {
            resolved: { label: 'Resolved', bgColor: 'bg-green-50', textColor: 'text-green-700' },
            open: { label: 'Open', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
            escalated: { label: 'Escalated', bgColor: 'bg-red-50', textColor: 'text-red-700' },
        };
        const config = configs[status] || configs.open;
        return (
            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                {config.label}
            </div>
        );
    };

    const getConfidenceBadge = (confidence: number) => {
        let bgColor = 'bg-green-50';
        let textColor = 'text-green-700';
        if (confidence < 70) {
            bgColor = 'bg-red-50';
            textColor = 'text-red-700';
        } else if (confidence < 85) {
            bgColor = 'bg-amber-50';
            textColor = 'text-amber-700';
        }
        return (
            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold ${bgColor} ${textColor}`}>
                {confidence}%
            </div>
        );
    };

    const getRatingDisplay = (rating: number | null) => {
        if (rating === null) {
            return <span className="text-sm text-gray-400">Not rated</span>;
        }
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                    />
                ))}
                <span className="text-sm font-medium text-gray-700 ml-1">{rating}.0</span>
            </div>
        );
    };

    const getFeatureBadge = (feature: string) => {
        return (
            <div className="inline-flex px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                {feature}
            </div>
        );
    };

    const toggleConversationSelection = (id: string) => {
        setSelectedConversations(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleAllConversations = () => {
        if (selectedConversations.length === mockConversations.length) {
            setSelectedConversations([]);
        } else {
            setSelectedConversations(mockConversations.map(c => c.id));
        }
    };

    const allSelected = selectedConversations.length === mockConversations.length && mockConversations.length > 0;
    const someSelected = selectedConversations.length > 0 && selectedConversations.length < mockConversations.length;

    // Filter and pagination
    const filteredConversations = mockConversations.filter(conv => {
        const searchLower = searchQuery.toLowerCase();
        return (
            conv.id.toLowerCase().includes(searchLower) ||
            conv.student.toLowerCase().includes(searchLower) ||
            conv.topic.toLowerCase().includes(searchLower) ||
            conv.featureUsed.toLowerCase().includes(searchLower)
        );
    });

    const totalPages = Math.ceil(filteredConversations.length / (rowsPerPage || 1));
    const displayedConversations = filteredConversations.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Action handlers
    const handleViewConversation = (conversationId: string) => {
        setOpenActionMenuId(null);
        onNavigate('conversation-detail', conversationId);
    };

    const handleMarkReviewed = (conversationId: string) => {
        setOpenActionMenuId(null);
        toast.success('Conversation marked as reviewed');
    };

    const handleAddTag = (conversationId: string) => {
        setOpenActionMenuId(null);
        toast.success('Tag added to conversation');
    };

    const handleFlagIssue = (conversationId: string) => {
        setOpenActionMenuId(null);
        toast.success('Issue flagged for review');
    };

    const handleExportConversation = (conversationId: string) => {
        setOpenActionMenuId(null);
        toast.success('Conversation exported');
    };

    return (
        <div className="px-8 py-6">
            <div className="max-w-[1920px] mx-auto">
                {/* Header Section - MATCHES STUDENTS */}
                <div className="flex items-center justify-between mb-6">
                    {/* Date Range Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                                <CalendarIcon size={18} className="text-[#253154]" />
                                <span className="text-sm text-[#253154] font-medium">
                                    {dateRange?.from && dateRange?.to
                                        ? `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
                                        : 'Last 30 days'}
                                </span>
                                <div className="h-4 w-px bg-gray-200 mx-1" />
                                <RefreshCw size={18} className="text-[#253154]" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white" align="start">
                            <CalendarComponent
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                className="rounded-xl border-0"
                            />
                        </PopoverContent>
                    </Popover>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => toast.info('Export functionality')}
                            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Download size={18} className="text-[#253154]" />
                            <span className="text-sm text-[#253154] font-medium">Export</span>
                        </button>
                        <button
                            onClick={() => toast.info('Error logs viewer')}
                            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <AlertCircle size={18} className="text-[#253154]" />
                            <span className="text-sm text-[#253154] font-medium">View Error Logs</span>
                        </button>
                    </div>
                </div>

                {/* Metrics Section - MATCHES STUDENTS */}
                <div className="hidden lg:flex gap-4 mb-8">
                    {metrics.map((metric, index) => (
                        <div key={index} className="flex-1">
                            <MetricCard {...metric} />
                        </div>
                    ))}
                </div>

                {/* Search and Filter Bar - MATCHES STUDENTS */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
                    <div className="relative flex-1 max-w-xl">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253154]" />
                        <input
                            type="text"
                            placeholder="Search by student, topic, feature, conversation ID..."
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

                {/* Table - Desktop - MATCHES STUDENTS */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white sticky top-0 z-10">
                                <tr className="border-b border-gray-200">
                                    <th className="px-6 py-4 text-left">
                                        <CustomCheckbox
                                            checked={allSelected}
                                            partial={someSelected}
                                            onChange={toggleAllConversations}
                                            ariaLabel="Select all conversations"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Conversation ID</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Student</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Country</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Topic</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Feature Used</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Status</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Rating</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Confidence</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Messages</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Last Active</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedConversations.map((conversation) => {
                                    return (
                                        <tr
                                            key={conversation.id}
                                            onClick={() => onNavigate('conversation-detail', conversation.id)}
                                            className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                        >
                                            <td
                                                className="px-6 py-4"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <CustomCheckbox
                                                    checked={selectedConversations.includes(conversation.id)}
                                                    onChange={() => toggleConversationSelection(conversation.id)}
                                                    ariaLabel={`Select ${conversation.id}`}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-[#253154]">{conversation.id}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-[#253154]">
                                                    {conversation.student}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{conversation.country}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{conversation.topic}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getFeatureBadge(conversation.featureUsed)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(conversation.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getRatingDisplay(conversation.rating)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getConfidenceBadge(conversation.confidence)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-[#253154]">{conversation.messages}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{conversation.lastActive}</span>
                                            </td>
                                            <td
                                                className="px-6 py-4"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewConversation(conversation.id)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="View conversation"
                                                    >
                                                        <Eye size={16} className="text-gray-600" />
                                                    </button>
                                                    <Popover open={openActionMenuId === conversation.id} onOpenChange={(open) => setOpenActionMenuId(open ? conversation.id : null)}>
                                                        <PopoverTrigger asChild>
                                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <MoreHorizontal size={18} className="text-gray-600" />
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-56 p-2 bg-white" align="end">
                                                            <div className="flex flex-col gap-1">
                                                                <button
                                                                    onClick={() => handleViewConversation(conversation.id)}
                                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                                >
                                                                    <Eye size={16} />
                                                                    <span>View Conversation</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleMarkReviewed(conversation.id)}
                                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                                >
                                                                    <CheckCircle2 size={16} />
                                                                    <span>Mark as Reviewed</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAddTag(conversation.id)}
                                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                                >
                                                                    <Tag size={16} />
                                                                    <span>Add Tag</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleFlagIssue(conversation.id)}
                                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                                >
                                                                    <Flag size={16} />
                                                                    <span>Flag Issue</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleExportConversation(conversation.id)}
                                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                                >
                                                                    <FileDown size={16} />
                                                                    <span>Export Conversation</span>
                                                                </button>
                                                                {conversation.status === 'escalated' && (
                                                                    <>
                                                                        <div className="h-px bg-gray-200 my-1" />
                                                                        <button
                                                                            onClick={() => toast.info('Escalation notes')}
                                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                                                        >
                                                                            <AlertTriangle size={16} />
                                                                            <span>View Escalation Notes</span>
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination - MATCHES STUDENTS */}
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
