'use client';

/**
 * AI TEST ASSISTANT - REPORTS PAGE
 * 
 * Investigation page for system issues and quality monitoring.
 * Matches Students listing page structure exactly.
 */

import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    AlertCircle,
    Info,
    Filter,
    Search,
    Download,
    RefreshCw,
    Eye,
    CheckCircle2,
    XCircle,
    Clock,
    Calendar as CalendarIcon,
    Mic,
    FileText,
    Headphones,
    Zap,
    ChevronDown,
    Check,
    MoreHorizontal,
    UserPlus,
    ArrowUpDown,
    Columns,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { CustomSelect } from './common/CustomSelect';
import { toast } from 'sonner';

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
            {/* Top row */}
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

            {/* Bottom row */}
            <div className="flex items-end gap-3 mt-2">
                <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} strokeWidth={1.5} />
                </div>
                <div>
                    <p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p>
                </div>
            </div>

            {/* Decorative background */}
            <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <Icon size={80} />
            </div>
        </div>
    );
};

interface AITestReportsProps {
    initialFilter?: string;
    onNavigate?: (page: string, issueId?: string) => void;
}

interface IssueLog {
    id: string;
    type: string;
    severity: 'critical' | 'warning' | 'info';
    student: string;
    studentId: string;
    skill: string;
    examType: string;
    timestamp: string;
    description: string;
    status: 'open' | 'investigating' | 'resolved';
    assignedTo?: string;
}

export const AITestReports: React.FC<AITestReportsProps> = ({ initialFilter, onNavigate }) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(2024, 0, 1),
        to: new Date(2024, 11, 31),
    });

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
    const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Scroll to issue logs on mount if filter is applied
    useEffect(() => {
        if (initialFilter && initialFilter !== 'all') {
            setTimeout(() => {
                const issueLogsSection = document.getElementById('issue-logs-section');
                if (issueLogsSection) {
                    issueLogsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }
    }, [initialFilter]);

    // Mock data - Issue logs
    const issueLogsData: IssueLog[] = [
        {
            id: 'ISS-001',
            type: 'transcription',
            severity: 'critical',
            student: 'John Smith',
            studentId: 'STU-1234',
            skill: 'Speaking',
            examType: 'IELTS Academic',
            timestamp: '2024-02-17 14:23:45',
            description: 'Audio transcription failed with error code 503',
            status: 'open',
        },
        {
            id: 'ISS-002',
            type: 'transcription',
            severity: 'critical',
            student: 'Emma Wilson',
            studentId: 'STU-2345',
            skill: 'Speaking',
            examType: 'IELTS Academic',
            timestamp: '2024-02-17 13:45:12',
            description: 'Unable to process audio file - format not supported',
            status: 'investigating',
            assignedTo: 'Tech Team',
        },
        {
            id: 'ISS-003',
            type: 'evaluation-failure',
            severity: 'warning',
            student: 'Michael Chen',
            studentId: 'STU-3456',
            skill: 'Writing',
            examType: 'TOEFL',
            timestamp: '2024-02-17 12:15:30',
            description: 'Writing evaluation timed out after 30 seconds',
            status: 'resolved',
            assignedTo: 'AI Team',
        },
        {
            id: 'ISS-004',
            type: 'audio-error',
            severity: 'warning',
            student: 'Sarah Johnson',
            studentId: 'STU-4567',
            skill: 'Listening',
            examType: 'IELTS General',
            timestamp: '2024-02-17 11:30:00',
            description: 'Audio playback failed - network timeout',
            status: 'open',
        },
        {
            id: 'ISS-005',
            type: 'performance-warning',
            severity: 'info',
            student: 'David Lee',
            studentId: 'STU-5678',
            skill: 'Reading',
            examType: 'IELTS Academic',
            timestamp: '2024-02-17 10:45:20',
            description: 'Response time exceeded 5 seconds',
            status: 'investigating',
            assignedTo: 'DevOps',
        },
        {
            id: 'ISS-006',
            type: 'transcription',
            severity: 'critical',
            student: 'Lisa Anderson',
            studentId: 'STU-6789',
            skill: 'Speaking',
            examType: 'IELTS Academic',
            timestamp: '2024-02-17 09:20:15',
            description: 'Transcription quality below 60% accuracy',
            status: 'open',
        },
        {
            id: 'ISS-007',
            type: 'evaluation-failure',
            severity: 'warning',
            student: 'James Brown',
            studentId: 'STU-7890',
            skill: 'Writing',
            examType: 'IELTS Academic',
            timestamp: '2024-02-17 08:10:45',
            description: 'AI evaluation service unavailable',
            status: 'resolved',
            assignedTo: 'AI Team',
        },
        {
            id: 'ISS-008',
            type: 'audio-error',
            severity: 'warning',
            student: 'Maria Garcia',
            studentId: 'STU-8901',
            skill: 'Listening',
            examType: 'TOEFL',
            timestamp: '2024-02-16 18:55:30',
            description: 'Audio file corrupted or incomplete',
            status: 'open',
        },
    ];

    // Filter and search logic
    const filteredIssues = issueLogsData.filter((issue) => {
        const matchesSearch =
            searchQuery === '' ||
            issue.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredIssues.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayedIssues = filteredIssues.slice(startIndex, endIndex);

    // Summary stats
    const totalIssues = issueLogsData.length;
    const criticalIssues = issueLogsData.filter((i) => i.severity === 'critical').length;
    const openIssues = issueLogsData.filter((i) => i.status === 'open').length;
    const resolvedToday = issueLogsData.filter((i) => i.status === 'resolved').length;

    // Selection handlers
    const toggleIssueSelection = (id: string) => {
        setSelectedIssues(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAllIssues = () => {
        if (selectedIssues.length === displayedIssues.length) {
            setSelectedIssues([]);
        } else {
            setSelectedIssues(displayedIssues.map(i => i.id));
        }
    };

    const allSelected = displayedIssues.length > 0 && selectedIssues.length === displayedIssues.length;
    const someSelected = selectedIssues.length > 0 && selectedIssues.length < displayedIssues.length;

    // Action handlers
    const handleViewIssue = (issueId: string) => {
        setOpenActionMenuId(null);
        if (onNavigate) {
            onNavigate('issue-detail', issueId);
        }
    };

    const handleAssignIssue = (issueId: string) => {
        setOpenActionMenuId(null);
        toast.success(`Assigned issue ${issueId}`);
    };

    const handleResolveIssue = (issueId: string) => {
        setOpenActionMenuId(null);
        toast.success(`Marked issue ${issueId} as resolved`);
    };

    const getSeverityBadge = (severity: string) => {
        const configs = {
            critical: { label: 'Critical', bgColor: 'bg-red-50', textColor: 'text-red-700' },
            warning: { label: 'Warning', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
            info: { label: 'Info', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
        };
        const config = configs[severity as keyof typeof configs];
        return (
            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                {config.label}
            </div>
        );
    };

    const getStatusBadge = (status: string) => {
        const configs = {
            open: { label: 'Open', bgColor: 'bg-red-50', textColor: 'text-red-700' },
            investigating: { label: 'Investigating', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
            resolved: { label: 'Resolved', bgColor: 'bg-green-50', textColor: 'text-green-700' },
        };
        const config = configs[status as keyof typeof configs];
        return (
            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                {config.label}
            </div>
        );
    };

    const getIssueTypeLabel = (type: string) => {
        const labels: { [key: string]: string } = {
            transcription: 'Transcription',
            'evaluation-failure': 'Evaluation Failure',
            'audio-error': 'Audio Error',
            'performance-warning': 'Performance Warning',
        };
        return labels[type] || type;
    };

    const getIssueTypeIcon = (type: string) => {
        switch (type) {
            case 'transcription':
                return <Mic size={16} className="text-red-600" />;
            case 'evaluation-failure':
                return <FileText size={16} className="text-amber-600" />;
            case 'audio-error':
                return <Headphones size={16} className="text-amber-600" />;
            case 'performance-warning':
                return <Zap size={16} className="text-blue-600" />;
            default:
                return <AlertCircle size={16} className="text-gray-600" />;
        }
    };

    // Metrics data
    const metrics = [
        {
            title: 'Total Issues',
            value: totalIssues.toString(),
            icon: AlertCircle,
            bgClass: 'bg-blue-50',
            colorClass: 'text-blue-600',
            tooltip: 'Total issues reported in the last 7 days',
        },
        {
            title: 'Critical Issues',
            value: criticalIssues.toString(),
            icon: AlertTriangle,
            bgClass: 'bg-red-50',
            colorClass: 'text-red-600',
            tooltip: 'Issues requiring immediate attention',
        },
        {
            title: 'Open Issues',
            value: openIssues.toString(),
            icon: XCircle,
            bgClass: 'bg-amber-50',
            colorClass: 'text-amber-600',
            tooltip: 'Issues pending investigation',
        },
        {
            title: 'Resolved Today',
            value: resolvedToday.toString(),
            icon: CheckCircle2,
            bgClass: 'bg-green-50',
            colorClass: 'text-green-600',
            tooltip: 'Issues successfully resolved today',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#faf7ff] via-white to-[#f8faff] px-8 py-6">
            <div className="max-w-[1920px] mx-auto">
                {/* Header Section - Date Range + Action Buttons */}
                <div className="flex items-center justify-between mb-6">
                    {/* Date Range Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                                <CalendarIcon size={18} className="text-[#253154]" />
                                <span className="text-sm text-[#253154] font-medium">
                                    {dateRange?.from && dateRange?.to
                                        ? `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
                                        : 'Select date range'}
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
                            onClick={() => toast.success('Exporting issues...')}
                            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Download size={18} className="text-[#253154]" />
                            <span className="text-sm text-[#253154] font-medium">Export</span>
                        </button>
                    </div>
                </div>

                {/* KPI Cards Row */}
                <div className="hidden lg:flex gap-4 mb-8">
                    {metrics.map((metric, index) => (
                        <div key={index} className="flex-1">
                            <MetricCard {...metric} />
                        </div>
                    ))}
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-xl">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253154]" />
                        <input
                            type="text"
                            placeholder="Search by student name, ID, or description"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-0 shadow-sm focus:ring-2 focus:ring-purple-100 outline-none text-[#253154] placeholder:text-gray-400"
                        />
                    </div>

                    {/* Filter Buttons */}
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

                {/* Table - Desktop */}
                <div id="issue-logs-section" className="hidden lg:block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white sticky top-0 z-10">
                                <tr className="border-b border-gray-200">
                                    <th className="px-6 py-4 text-left">
                                        <CustomCheckbox
                                            checked={allSelected}
                                            partial={someSelected}
                                            onChange={toggleAllIssues}
                                            ariaLabel="Select all issues"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Issue ID</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Type</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Severity</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Student</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Skill</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Description</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Status</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedIssues.map((issue) => (
                                    <tr
                                        key={issue.id}
                                        onClick={() => handleViewIssue(issue.id)}
                                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                    >
                                        <td
                                            className="px-6 py-4"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <CustomCheckbox
                                                checked={selectedIssues.includes(issue.id)}
                                                onChange={() => toggleIssueSelection(issue.id)}
                                                ariaLabel={`Select issue ${issue.id}`}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-[#253154]">{issue.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getIssueTypeIcon(issue.type)}
                                                <span className="text-sm text-gray-600">{getIssueTypeLabel(issue.type)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getSeverityBadge(issue.severity)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-[#253154]">
                                                {issue.student}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{issue.skill}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <p className="text-sm text-gray-600 truncate">{issue.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(issue.status)}
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Popover open={openActionMenuId === issue.id} onOpenChange={(open) => setOpenActionMenuId(open ? issue.id : null)}>
                                                <PopoverTrigger asChild>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <MoreHorizontal size={18} className="text-gray-600" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-56 p-2 bg-white" align="end">
                                                    <div className="flex flex-col gap-1">
                                                        <button
                                                            onClick={() => handleViewIssue(issue.id)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                        >
                                                            <Eye size={16} />
                                                            <span>View Issue</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleAssignIssue(issue.id)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                        >
                                                            <UserPlus size={16} />
                                                            <span>Assign</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleResolveIssue(issue.id)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                        >
                                                            <CheckCircle2 size={16} />
                                                            <span>Mark Resolved</span>
                                                        </button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
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
