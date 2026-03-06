'use client';

import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    RefreshCw,
    Download,
    Upload,
    Plus,
    MoreHorizontal,
    Filter,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Search,
    Archive,
    Edit,
    Check,
    Columns,
    BookOpen,
    CheckCircle,
    FileText,
    Clock,
    Calendar as CalendarPlus,
    Eye,
    Copy,
    TrendingUp,
    TrendingDown,
    Headphones,
    PenTool,
    Mic,
    Target
} from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";
import { SlickStyles } from './SlickStyles';
import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { CustomSelect } from './common/CustomSelect';

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

// --- METRIC CARD WITH INLINE EXPANSION ---
interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    bgClass: string;
    colorClass: string;
    tooltip: string;
    isActive?: boolean;
    isCompressed?: boolean;
    onClick?: () => void;
    expandedContent?: {
        trend: {
            direction: 'up' | 'down';
            value: string;
            label: string;
        };
        microInsights?: {
            label: string;
            value: string;
        }[];
        breakdowns: {
            label: string;
            items: {
                name: string;
                count: number;
                color: string;
            }[];
        }[];
    };
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    icon: Icon,
    bgClass,
    colorClass,
    tooltip,
    isActive = false,
    isCompressed = false,
    onClick,
    expandedContent
}) => {
    // Compressed state (when another card is expanded)
    if (isCompressed) {
        return (
            <div
                onClick={onClick}
                className="bg-white p-3 rounded-2xl shadow-md flex flex-col items-center justify-center h-[130px] relative overflow-hidden group transition-all duration-300 ease-in-out border-2 border-transparent hover:shadow-lg hover:border-purple-200 cursor-pointer"
            >
                <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center mb-2 flex-shrink-0`}>
                    <Icon size={20} strokeWidth={1.5} />
                </div>
                <p className="text-[20px] font-bold text-[#253154] leading-none">{value}</p>
                <span className="text-[10px] text-gray-500 font-medium mt-1.5 text-center leading-tight px-1">{title}</span>
            </div>
        );
    }

    // Expanded state (with border highlight, same size as normal)
    if (isActive) {
        return (
            <div
                onClick={onClick}
                className="bg-white p-5 rounded-2xl shadow-lg relative overflow-hidden transition-[border-color,box-shadow] duration-300 ease-in-out border-2 border-[#e9d4ff] cursor-pointer h-[130px] flex-shrink-0"
            >
                {expandedContent ? (
                    // With data - show insights
                    <div className="flex gap-4 h-full">
                        {/* Left Column: Metric Summary */}
                        <div className="flex flex-col justify-between flex-shrink-0 min-w-0" style={{ width: '180px' }}>
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <span className="text-[#253154] font-medium text-[14px]">{title}</span>
                                <TooltipProvider delayDuration={200}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-4 h-4 rounded-full border border-current text-[9px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors flex-shrink-0"
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

                            {/* Icon + Value */}
                            <div className="flex items-end gap-2.5">
                                <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center flex-shrink-0`}>
                                    <Icon size={22} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-[26px] font-bold text-[#253154] leading-none">{value}</p>
                                </div>
                            </div>
                        </div>

                        {/* Vertical Divider */}
                        <div className="w-px bg-gray-200 flex-shrink-0" />

                        {/* Middle Column: Insights & Breakdowns */}
                        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                            {/* Trend Indicator */}
                            <div className={`inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${expandedContent.trend.direction === 'up'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-blue-50 text-blue-700'
                                }`}>
                                {expandedContent.trend.direction === 'up' ? (
                                    <TrendingUp size={12} strokeWidth={2.5} />
                                ) : (
                                    <TrendingDown size={12} strokeWidth={2.5} />
                                )}
                                <span className="font-bold">{expandedContent.trend.value}</span>
                                <span className="opacity-75">{expandedContent.trend.label}</span>
                            </div>

                            {/* Micro Insights */}
                            {expandedContent.microInsights && (
                                <div className="space-y-1">
                                    {expandedContent.microInsights.map((insight, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                                {insight.label}:
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-medium px-1">
                                                {insight.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Breakdown Chips */}
                            <div className="space-y-2">
                                {expandedContent.breakdowns.map((breakdown, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                            {breakdown.label}:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5 min-w-0">
                                            {breakdown.items.slice(0, 3).map((item, itemIdx) => (
                                                <div
                                                    key={itemIdx}
                                                    className={`${item.color} px-2 py-0.5 rounded text-[10px] font-medium inline-flex items-center gap-1 border border-current border-opacity-10 whitespace-nowrap`}
                                                >
                                                    <span>{item.name}</span>
                                                    <span className="font-bold">·</span>
                                                    <span className="font-bold">{item.count}</span>
                                                </div>
                                            ))}
                                            {breakdown.items.length > 3 && (
                                                <div className="text-[10px] text-gray-500 font-medium px-1">
                                                    +{breakdown.items.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Actions */}
                        <div className="flex flex-col gap-2 justify-center flex-shrink-0 min-w-0" style={{ width: '140px' }}>
                            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0c4a] transition-colors text-[11px] font-medium">
                                <Eye size={13} />
                                View Items
                            </button>
                            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-[#253154] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-[11px] font-medium">
                                <Download size={13} />
                                Export
                            </button>
                        </div>
                    </div>
                ) : (
                    // Without data - show standard card
                    <>
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
                        <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 pointer-events-none">
                            <Icon size={80} />
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Normal state
    return (
        <div
            onClick={onClick}
            className="bg-white p-5 rounded-2xl shadow-md relative overflow-hidden group transition-all duration-300 ease-in-out h-[130px] border-2 border-transparent hover:shadow-lg hover:border-purple-200 cursor-pointer"
        >
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
            <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 pointer-events-none">
                <Icon size={80} />
            </div>
        </div>
    );
};

// --- Types ---
type LibraryItem = {
    id: string;
    title: string;
    exam: string;
    difficulty?: string;
    topic?: string;
    type?: string;
    transcript?: boolean;
    sectionsIncluded?: string[];
    duration?: string;
    status: 'Published' | 'Draft' | 'In Review' | 'Archived';
    lastUpdated: string;
    usage30d: number;
};

type TabType = 'Reading' | 'Listening' | 'Writing' | 'Speaking' | 'Mock Tests';

interface AITestLibraryProps {
    onNavigate: (page: string) => void;
}

export const AITestLibrary: React.FC<AITestLibraryProps> = ({ onNavigate }) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('Reading');

    const handleMetricClick = (metricTitle: string) => {
        if (activeFilter === metricTitle) {
            setActiveFilter(null);
        } else {
            setActiveFilter(metricTitle);
        }
    };

    // Navigate to detail page
    const handleNavigateToDetail = (itemId: string, itemType: TabType) => {
        const typeSlug = itemType.toLowerCase().replace(/ /g, '-');
        onNavigate(`library-detail-${typeSlug}-${itemId}`);
    };

    // Metrics data
    const metrics = [
        {
            title: 'Total Items',
            value: '465',
            icon: BookOpen,
            bgClass: 'bg-purple-50',
            colorClass: 'text-purple-600',
            tooltip: 'Total number of test items in the library'
        },
        {
            title: 'Published',
            value: '420',
            icon: CheckCircle,
            bgClass: 'bg-green-50',
            colorClass: 'text-green-600',
            tooltip: 'Items available to students'
        },
        {
            title: 'Draft',
            value: '37',
            icon: FileText,
            bgClass: 'bg-orange-50',
            colorClass: 'text-orange-600',
            tooltip: 'Items in draft status'
        },
        {
            title: 'Archived',
            value: '8',
            icon: Archive,
            bgClass: 'bg-red-50',
            colorClass: 'text-red-700',
            tooltip: 'Archived items'
        },
        {
            title: 'Recently Added',
            value: '23',
            icon: CalendarPlus,
            bgClass: 'bg-blue-50',
            colorClass: 'text-blue-600',
            tooltip: 'Items added in the last 30 days'
        },
    ];

    // Mock library data
    const getMockData = (): LibraryItem[] => {
        switch (activeTab) {
            case 'Reading':
                return [
                    { id: 'R001', title: 'Academic Reading - Climate Change Impact', exam: 'IELTS Academic', difficulty: 'Hard', topic: 'Environment', status: 'Published', lastUpdated: '2024-02-15', usage30d: 234 },
                    { id: 'R002', title: 'General Training - Workplace Communication', exam: 'IELTS General', difficulty: 'Medium', topic: 'Work', status: 'Published', lastUpdated: '2024-02-14', usage30d: 189 },
                    { id: 'R003', title: 'Academic Reading - Artificial Intelligence Ethics', exam: 'IELTS Academic', difficulty: 'Hard', topic: 'Technology', status: 'Published', lastUpdated: '2024-02-13', usage30d: 267 },
                    { id: 'R004', title: 'TOEFL Reading - Ancient Civilizations', exam: 'TOEFL', difficulty: 'Medium', topic: 'History', status: 'Published', lastUpdated: '2024-02-12', usage30d: 156 },
                    { id: 'R005', title: 'Academic Reading - Medical Breakthroughs', exam: 'IELTS Academic', difficulty: 'Hard', topic: 'Health', status: 'Draft', lastUpdated: '2024-02-11', usage30d: 0 },
                    { id: 'R006', title: 'General Training - Community Services', exam: 'IELTS General', difficulty: 'Easy', topic: 'Society', status: 'Published', lastUpdated: '2024-02-10', usage30d: 198 },
                    { id: 'R007', title: 'Academic Reading - Space Exploration', exam: 'IELTS Academic', difficulty: 'Medium', topic: 'Science', status: 'In Review', lastUpdated: '2024-02-09', usage30d: 112 },
                    { id: 'R008', title: 'TOEFL Reading - Economic Systems', exam: 'TOEFL', difficulty: 'Hard', topic: 'Economics', status: 'Published', lastUpdated: '2024-02-08', usage30d: 143 },
                ];
            case 'Listening':
                return [
                    { id: 'L001', title: 'Academic Lecture - Renewable Energy', exam: 'IELTS Academic', difficulty: 'Medium', topic: 'Science', transcript: true, status: 'Published', lastUpdated: '2024-02-15', usage30d: 287 },
                    { id: 'L002', title: 'General Conversation - Job Interview', exam: 'IELTS General', difficulty: 'Easy', topic: 'Work', transcript: true, status: 'Published', lastUpdated: '2024-02-14', usage30d: 312 },
                    { id: 'L003', title: 'Academic Discussion - Climate Policy', exam: 'IELTS Academic', difficulty: 'Hard', topic: 'Environment', transcript: true, status: 'Published', lastUpdated: '2024-02-13', usage30d: 198 },
                    { id: 'L004', title: 'TOEFL Lecture - Art History', exam: 'TOEFL', difficulty: 'Medium', topic: 'Arts', transcript: false, status: 'Draft', lastUpdated: '2024-02-12', usage30d: 0 },
                ];
            case 'Writing':
                return [
                    { id: 'W001', title: 'Task 2 - Technology Impact on Society', type: 'Task 2', exam: 'IELTS Academic', status: 'Published', lastUpdated: '2024-02-15', usage30d: 412 },
                    { id: 'W002', title: 'Task 1 - Data Analysis Chart', type: 'Task 1', exam: 'IELTS Academic', status: 'Published', lastUpdated: '2024-02-14', usage30d: 298 },
                    { id: 'W003', title: 'SOP - Computer Science Masters', type: 'SOP', exam: 'Visa', status: 'Published', lastUpdated: '2024-02-13', usage30d: 156 },
                ];
            case 'Speaking':
                return [
                    { id: 'SP001', title: 'Part 1 - Personal Information', type: 'Part 1', exam: 'IELTS Academic', topic: 'Introduction', status: 'Published', lastUpdated: '2024-02-15', usage30d: 456 },
                    { id: 'SP002', title: 'Part 2 - Describe a Memorable Event', type: 'Part 2', exam: 'IELTS Academic', topic: 'Experience', status: 'Published', lastUpdated: '2024-02-14', usage30d: 389 },
                ];
            case 'Mock Tests':
                return [
                    { id: 'MT001', title: 'IELTS Academic Full Mock Test - Series 1', exam: 'IELTS Academic', sectionsIncluded: ['R', 'L', 'W', 'S'], duration: '2h 45m', status: 'Published', lastUpdated: '2024-02-15', usage30d: 189 },
                    { id: 'MT002', title: 'IELTS General Training Mock Test - Series 1', exam: 'IELTS General', sectionsIncluded: ['R', 'L', 'W', 'S'], duration: '2h 45m', status: 'Published', lastUpdated: '2024-02-14', usage30d: 156 },
                ];
            default:
                return [];
        }
    };

    const mockData = getMockData();
    const totalPages = Math.ceil(mockData.length / rowsPerPage);
    const displayedItems = mockData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const toggleItemSelection = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleAllItems = () => {
        if (selectedItems.length === mockData.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(mockData.map(s => s.id));
        }
    };

    const allSelected = selectedItems.length === mockData.length && mockData.length > 0;
    const someSelected = selectedItems.length > 0 && selectedItems.length < mockData.length;

    const getStatusConfig = (status: LibraryItem['status']) => {
        switch (status) {
            case 'Published': return { label: 'Published', bgColor: 'bg-green-50', textColor: 'text-green-700' };
            case 'Draft': return { label: 'Draft', bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
            case 'In Review': return { label: 'In Review', bgColor: 'bg-blue-50', textColor: 'text-blue-700' };
            case 'Archived': return { label: 'Archived', bgColor: 'bg-red-50', textColor: 'text-red-700' };
            default: return { label: status, bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
        }
    };

    const handleViewItem = (id: string) => {
        setOpenActionMenuId(null);
        handleNavigateToDetail(id, activeTab);
    };

    const handleEditItem = (id: string) => {
        setOpenActionMenuId(null);
        handleNavigateToDetail(id, activeTab);
    };

    const handleDuplicate = (id: string) => {
        setOpenActionMenuId(null);
        toast.success(`Duplicated item: ${id}`);
    };

    const handleArchiveItem = (id: string) => {
        setOpenActionMenuId(null);
        if (window.confirm('Are you sure you want to archive this item?')) {
            toast.success(`Archived item: ${id}`);
        }
    };

    // Carousel settings for mobile
    const slickSettings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 1.2,
        slidesToScroll: 1,
        arrows: false,
        swipeToSlide: true,
    };

    const exportColumns: ExportColumn[] = [
        { id: 'id', label: 'Item ID' },
        { id: 'title', label: 'Title' },
        { id: 'exam', label: 'Exam' },
        { id: 'status', label: 'Status' },
        { id: 'lastUpdated', label: 'Last Updated' },
        { id: 'usage30d', label: 'Usage (30d)' },
    ];

    const importFields: ImportField[] = [
        { id: 'id', label: 'Item ID', required: true, type: 'text' },
        { id: 'title', label: 'Title', required: true, type: 'text' },
        { id: 'exam', label: 'Exam', required: true, type: 'text' },
        { id: 'status', label: 'Status', required: true, type: 'text' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#faf7ff] via-white to-[#f8faff] px-8 py-6">
            <SlickStyles />

            <div className="max-w-[1920px] mx-auto">
                {/* Header Section */}
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
                                selected={dateRange ?? undefined}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                className="rounded-xl border-0"
                            />
                        </PopoverContent>
                    </Popover>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowExportDialog(true)}
                            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Download size={18} className="text-[#253154]" />
                            <span className="text-sm text-[#253154] font-medium">Export</span>
                        </button>
                        <button
                            onClick={() => setShowImportDialog(true)}
                            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Upload size={18} className="text-[#253154]" />
                            <span className="text-sm text-[#253154] font-medium">Import</span>
                        </button>
                        <button
                            onClick={() => toast.success('Create Item clicked')}
                            className="flex items-center gap-2 px-5 py-3 bg-[#0e042f] rounded-xl hover:bg-[#1a0c4a] transition-colors shadow-lg"
                        >
                            <Plus size={18} className="text-white" />
                            <span className="text-sm text-white font-medium">Create Item</span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
                    {(['Reading', 'Listening', 'Writing', 'Speaking', 'Mock Tests'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setCurrentPage(1);
                                setSelectedItems([]);
                            }}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                ? 'border-[#0e042f] text-[#0e042f]'
                                : 'border-transparent text-gray-600 hover:text-[#253154] hover:border-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Metrics Section - Desktop Flex Layout with Inline Expansion */}
                <div className="hidden lg:flex gap-4 mb-8">
                    {metrics.map((metric, index) => {
                        const isActive = activeFilter === metric.title;
                        const hasActiveFilter = activeFilter && activeFilter !== 'Total Items';
                        const isCompressed = hasActiveFilter && !isActive;

                        return (
                            <div
                                key={index}
                                className="flex-1 transition-all duration-300 ease-in-out"
                            >
                                <MetricCard
                                    {...metric}
                                    isActive={isActive}
                                    isCompressed={!!isCompressed}
                                    onClick={() => handleMetricClick(metric.title)}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Metrics Section - Mobile Carousel */}
                <div className="block lg:hidden mb-6 -mx-4">
                    <Slider {...slickSettings}>
                        {metrics.map((metric, index) => (
                            <div key={index} className="px-2 py-2">
                                <MetricCard
                                    {...metric}
                                    isActive={activeFilter === metric.title}
                                    onClick={() => handleMetricClick(metric.title)}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-xl">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253154]" />
                        <input
                            type="text"
                            placeholder="Search by title, topic, exam..."
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
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Item ID</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Title</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Exam</span>
                                    </th>
                                    {activeTab === 'Reading' && (
                                        <>
                                            <th className="px-6 py-4 text-left">
                                                <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Difficulty</span>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Topic</span>
                                            </th>
                                        </>
                                    )}
                                    {activeTab === 'Listening' && (
                                        <>
                                            <th className="px-6 py-4 text-left">
                                                <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Topic</span>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Transcript</span>
                                            </th>
                                        </>
                                    )}
                                    {activeTab === 'Writing' && (
                                        <th className="px-6 py-4 text-left">
                                            <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Type</span>
                                        </th>
                                    )}
                                    {activeTab === 'Speaking' && (
                                        <>
                                            <th className="px-6 py-4 text-left">
                                                <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Type</span>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Topic</span>
                                            </th>
                                        </>
                                    )}
                                    {activeTab === 'Mock Tests' && (
                                        <>
                                            <th className="px-6 py-4 text-left">
                                                <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Sections</span>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Duration</span>
                                            </th>
                                        </>
                                    )}
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Status</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Last Updated</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Usage (30d)</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedItems.map((item) => {
                                    const statusConfig = getStatusConfig(item.status);

                                    return (
                                        <tr
                                            key={item.id}
                                            onClick={() => handleEditItem(item.id)}
                                            className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                        >
                                            <td
                                                className="px-6 py-4"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <CustomCheckbox
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => toggleItemSelection(item.id)}
                                                    ariaLabel={`Select ${item.title}`}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-[#253154]">{item.id}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-[#253154]">
                                                    {item.title}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{item.exam}</span>
                                            </td>
                                            {activeTab === 'Reading' && (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">{item.difficulty}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">{item.topic}</span>
                                                    </td>
                                                </>
                                            )}
                                            {activeTab === 'Listening' && (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">{item.topic}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium ${item.transcript ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                                                            }`}>
                                                            {item.transcript ? 'Yes' : 'No'}
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                            {activeTab === 'Writing' && (
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-600">{item.type}</span>
                                                </td>
                                            )}
                                            {activeTab === 'Speaking' && (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">{item.type}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">{item.topic}</span>
                                                    </td>
                                                </>
                                            )}
                                            {activeTab === 'Mock Tests' && (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-1">
                                                            {item.sectionsIncluded?.map((section) => (
                                                                <span key={section} className="inline-flex px-2 py-1 rounded bg-purple-50 text-purple-700 text-xs font-medium">
                                                                    {section}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">{item.duration}</span>
                                                    </td>
                                                </>
                                            )}
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                                    {statusConfig.label}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{item.lastUpdated}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-[#253154]">{item.usage30d}</span>
                                            </td>
                                            <td
                                                className="px-6 py-4"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Popover open={openActionMenuId === item.id} onOpenChange={(open) => setOpenActionMenuId(open ? item.id : null)}>
                                                    <PopoverTrigger asChild>
                                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                            <MoreHorizontal size={18} className="text-gray-600" />
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-56 p-2 bg-white" align="end">
                                                        <div className="flex flex-col gap-1">
                                                            <button
                                                                onClick={() => handleViewItem(item.id)}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                            >
                                                                <Eye size={16} />
                                                                <span>View</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditItem(item.id)}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                            >
                                                                <Edit size={16} />
                                                                <span>Edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDuplicate(item.id)}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                            >
                                                                <Copy size={16} />
                                                                <span>Duplicate</span>
                                                            </button>
                                                            <div className="h-px bg-gray-200 my-1" />
                                                            <button
                                                                onClick={() => handleArchiveItem(item.id)}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                                            >
                                                                <Archive size={16} />
                                                                <span>Archive</span>
                                                            </button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </td>
                                        </tr>
                                    );
                                })}
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

            {/* Export Dialog */}
            <ExportDialog
                open={showExportDialog}
                onOpenChange={setShowExportDialog}
                moduleName="Library Items"
                totalCount={mockData.length}
                columns={exportColumns}
                supportsDateRange={true}
                onExport={async (options) => {
                    toast.success(`Exporting ${options.scope} items...`);
                }}
            />

            {/* Import Dialog */}
            <ImportDialog
                open={showImportDialog}
                onOpenChange={setShowImportDialog}
                moduleName="Library Items"
                fields={importFields}
                onImport={async (data) => {
                    toast.success(`Importing ${data.length} items...`);
                }}
            />
        </div>
    );
};
