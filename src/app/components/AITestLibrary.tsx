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
    ChevronDown,
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
    Trash2,
    Headphones,
    PenTool,
    Mic,
    Target
} from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { toast } from "sonner";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";
import { SlickStyles } from './SlickStyles';
import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { CustomSelect } from './common/CustomSelect';
import {
    getAllLibraryItems,
    createLibraryItem,
    updateLibraryItem,
    deleteLibraryItem,
    LibraryItem as APILibraryItem
} from '../services/libraryItemService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

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
    const [libraryItems, setLibraryItems] = useState<APILibraryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<APILibraryItem | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Table Features State
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof APILibraryItem; direction: 'asc' | 'desc' } | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('All Status');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('All Difficulty');
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        'item_id', 'title', 'exam', 'difficulty', 'topic', 'status', 'updated_at', 'usage_30d'
    ]);

    // Fetch data from API
    const fetchLibraryItems = async () => {
        setIsLoading(true);
        try {
            const data = await getAllLibraryItems();
            setLibraryItems(data);
        } catch (error) {
            toast.error("Failed to load library items");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        setIsMounted(true);
        fetchLibraryItems();
    }, []);

    if (!isMounted) return null;

    const handleMetricClick = (metricTitle: string) => {
        if (activeFilter === metricTitle) {
            setActiveFilter(null);
        } else {
            setActiveFilter(metricTitle);
        }
    };

    const handleSort = (key: keyof APILibraryItem) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader = ({ label, sortKey, className }: { label: string, sortKey: keyof APILibraryItem, className?: string }) => {
        if (!visibleColumns.includes(sortKey as string)) return null;

        const isSorted = sortConfig?.key === sortKey;

        return (
            <th className={`px-6 py-4 text-left ${className}`}>
                <button
                    onClick={() => handleSort(sortKey)}
                    className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-[#253154] transition-colors group"
                >
                    {label}
                    <div className={`p-0.5 rounded transition-colors ${isSorted ? 'bg-purple-50 text-purple-600' : 'text-gray-300 group-hover:text-gray-400'}`}>
                        {isSorted ? (
                            sortConfig.direction === 'asc' ? <TrendingUp size={10} /> : <TrendingDown size={10} />
                        ) : (
                            <ArrowUpDown size={10} />
                        )}
                    </div>
                </button>
            </th>
        );
    };

    // Navigate to detail page
    const handleNavigateToDetail = (itemId: string, itemType: TabType) => {
        const typeSlug = itemType.toLowerCase().replace(/ /g, '-');
        onNavigate(`library-detail-${typeSlug}-${itemId}`);
    };

    // CRUD Handlers
    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            if (editingItem.id) {
                await updateLibraryItem(editingItem.id, editingItem);
                toast.success("Item updated successfully");
            } else {
                await createLibraryItem(editingItem);
                toast.success("Item created successfully");
            }
            setIsFormOpen(false);
            fetchLibraryItems();
        } catch (error) {
            toast.error("Failed to save item");
        }
    };

    const handleArchiveItem = async (id: string | number) => {
        if (window.confirm('Are you sure you want to archive this item?')) {
            try {
                const item = libraryItems.find(i => i.id === id || i.item_id === id);
                if (item && item.id) {
                    await updateLibraryItem(item.id, { status: 'Archived' });
                    toast.success("Item archived successfully");
                    fetchLibraryItems();
                }
            } catch (error) {
                toast.error("Failed to archive item");
            }
        }
    };

    const handleDeleteItem = async (id: string | number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const item = libraryItems.find(i => i.id === id || i.item_id === id);
                if (item && item.id) {
                    await deleteLibraryItem(item.id);
                    toast.success("Item deleted successfully");
                    fetchLibraryItems();
                }
            } catch (error) {
                toast.error("Failed to delete item");
            }
        }
    };

    const openCreateForm = () => {
        const typePrefix = activeTab === 'Reading' ? 'R' : activeTab === 'Listening' ? 'L' : activeTab === 'Writing' ? 'W' : activeTab === 'Speaking' ? 'SP' : 'MT';
        const newId = `${typePrefix}${Math.floor(1000 + Math.random() * 9000)}`;

        setEditingItem({
            item_id: newId,
            title: '',
            exam: 'IELTS Academic',
            status: 'Draft',
            usage_30d: 0,
            difficulty: 'Medium',
            topic: '',
            type: activeTab === 'Writing' ? 'Task 2' : '',
            transcript: false,
            sections_included: [],
            duration: ''
        } as any);
        setIsFormOpen(true);
    };

    const openEditForm = (item: APILibraryItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    // Metrics calculations
    const totalItems = libraryItems.length;
    const publishedCount = libraryItems.filter(item => item.status === 'Published').length;
    const draftCount = libraryItems.filter(item => item.status === 'Draft').length;
    const archivedCount = libraryItems.filter(item => item.status === 'Archived').length;
    const recentlyAddedCount = libraryItems.filter(item => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const updatedDate = new Date(item.updated_at || '');
        return updatedDate >= thirtyDaysAgo;
    }).length;

    // Metrics data
    const metrics = [
        {
            title: 'Total Items',
            value: totalItems.toString(),
            icon: BookOpen,
            bgClass: 'bg-purple-50',
            colorClass: 'text-purple-600',
            tooltip: 'Total number of test items in the library'
        },
        {
            title: 'Published',
            value: publishedCount.toString(),
            icon: CheckCircle,
            bgClass: 'bg-green-50',
            colorClass: 'text-green-600',
            tooltip: 'Items available to students'
        },
        {
            title: 'Draft',
            value: draftCount.toString(),
            icon: FileText,
            bgClass: 'bg-orange-50',
            colorClass: 'text-orange-600',
            tooltip: 'Items in draft status'
        },
        {
            title: 'Archived',
            value: archivedCount.toString(),
            icon: Archive,
            bgClass: 'bg-red-50',
            colorClass: 'text-red-700',
            tooltip: 'Archived items'
        },
        {
            title: 'Recently Added',
            value: recentlyAddedCount.toString(),
            icon: CalendarPlus,
            bgClass: 'bg-blue-50',
            colorClass: 'text-blue-600',
            tooltip: 'Items added in the last 30 days'
        },
    ];

    // Library data filtered by active tab, search, and dropdowns
    const filteredData = libraryItems
        .filter(item => {
            // Tab Filter (Always applied)
            const matchesTab =
                (activeTab === 'Mock Tests' && (item.type === 'Mock Test' || item.item_id?.startsWith('MT'))) ||
                (activeTab === 'Reading' && item.item_id?.startsWith('R')) ||
                (activeTab === 'Listening' && item.item_id?.startsWith('L')) ||
                (activeTab === 'Writing' && item.item_id?.startsWith('W')) ||
                (activeTab === 'Speaking' && item.item_id?.startsWith('SP'));

            if (!matchesTab) return false;

            // Search Filter
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                (item.title?.toLowerCase() || '').includes(searchLower) ||
                (item.item_id?.toLowerCase() || '').includes(searchLower) ||
                (item.topic?.toLowerCase() || '').includes(searchLower) ||
                (item.exam?.toLowerCase() || '').includes(searchLower);

            if (!matchesSearch) return false;

            // Status Filter
            if (statusFilter !== 'All Status' && item.status !== statusFilter) return false;

            // Difficulty Filter
            if (difficultyFilter !== 'All Difficulty' && item.difficulty !== difficultyFilter) return false;

            // Metric Filter
            if (activeFilter === 'Published' && item.status !== 'Published') return false;
            if (activeFilter === 'Draft' && item.status !== 'Draft') return false;
            if (activeFilter === 'Archived' && item.status !== 'Archived') return false;
            if (activeFilter === 'Recently Added') {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const updatedDate = new Date(item.updated_at || '');
                if (updatedDate < thirtyDaysAgo) return false;
            }

            return true;
        })
        .sort((a: any, b: any) => {
            if (!sortConfig) return 0;
            const { key, direction } = sortConfig;
            const valA = a[key] ?? '';
            const valB = b[key] ?? '';

            if (valA === valB) return 0;
            const comparison = valA < valB ? -1 : 1;
            return direction === 'asc' ? comparison : -comparison;
        });

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const displayedItems = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const toggleItemSelection = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleAllItems = () => {
        if (selectedItems.length === filteredData.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredData.map(s => s.id?.toString() || ''));
        }
    };

    const allSelected = selectedItems.length === filteredData.length && filteredData.length > 0;
    const someSelected = selectedItems.length > 0 && selectedItems.length < filteredData.length;

    const getStatusConfig = (status: LibraryItem['status']) => {
        switch (status) {
            case 'Published': return { label: 'Published', bgColor: 'bg-green-50', textColor: 'text-green-700' };
            case 'Draft': return { label: 'Draft', bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
            case 'In Review': return { label: 'In Review', bgColor: 'bg-blue-50', textColor: 'text-blue-700' };
            case 'Archived': return { label: 'Archived', bgColor: 'bg-red-50', textColor: 'text-red-700' };
            default: return { label: status, bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
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
                            onClick={openCreateForm}
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-0 shadow-sm focus:ring-2 focus:ring-purple-100 outline-none text-[#253154] placeholder:text-gray-400"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Filter Popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className={`p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 ${statusFilter !== 'All Status' || difficultyFilter !== 'All Difficulty' ? 'bg-purple-50 border-purple-200' : ''}`}>
                                    <Filter size={20} className="text-[#253154]" />
                                    {(statusFilter !== 'All Status' || difficultyFilter !== 'All Difficulty') && (
                                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                    )}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[280px] p-4 bg-white rounded-xl shadow-xl border border-gray-100" align="end">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">Status</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['All Status', 'Published', 'Draft', 'In Review', 'Archived'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setStatusFilter(s)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">Difficulty</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['All Difficulty', 'Low', 'Medium', 'High'].map((d) => (
                                                <button
                                                    key={d}
                                                    onClick={() => setDifficultyFilter(d)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${difficultyFilter === d ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setStatusFilter('All Status');
                                            setDifficultyFilter('All Difficulty');
                                        }}
                                        className="w-full mt-2 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg uppercase transition-all"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Sort Menu */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className={`h-[50px] min-w-[150px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-between px-4 ${sortConfig ? 'ring-2 ring-purple-100' : ''}`}>
                                    <div className="flex items-center gap-2">
                                        <ArrowUpDown size={20} strokeWidth={1.5} />
                                        <span className="font-medium text-[14px]">Sort</span>
                                    </div>
                                    <ChevronDown size={16} />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[180px] p-2 bg-white rounded-xl shadow-xl border border-gray-100" align="end">
                                <div className="space-y-1">
                                    {[
                                        { key: 'title', label: 'Title' },
                                        { key: 'item_id', label: 'Item ID' },
                                        { key: 'exam', label: 'Exam' },
                                        { key: 'status', label: 'Status' },
                                        { key: 'usage_30d', label: 'Usage' },
                                        { key: 'updated_at', label: 'Updated' }
                                    ].map((s) => (
                                        <button
                                            key={s.key}
                                            onClick={() => handleSort(s.key as keyof APILibraryItem)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${sortConfig?.key === s.key ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {s.label}
                                            {sortConfig?.key === s.key && (
                                                <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Column Visibility Popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="h-[50px] w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                                    <Columns size={20} strokeWidth={1.5} />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-2 bg-white rounded-xl shadow-xl border border-gray-100" align="end">
                                <div className="p-2">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase mb-3">Visible Columns</p>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'item_id', label: 'Item ID' },
                                            { id: 'title', label: 'Title' },
                                            { id: 'exam', label: 'Exam' },
                                            { id: 'difficulty', label: 'Difficulty' },
                                            { id: 'topic', label: 'Topic' },
                                            { id: 'status', label: 'Status' },
                                            { id: 'updated_at', label: 'Last Updated' },
                                            { id: 'usage_30d', label: 'Usage (30d)' },
                                        ].map(col => (
                                            <div
                                                key={col.id}
                                                onClick={() => {
                                                    setVisibleColumns(prev =>
                                                        prev.includes(col.id) ? prev.filter(c => c !== col.id) : [...prev, col.id]
                                                    );
                                                }}
                                                className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer group transition-all"
                                            >
                                                <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${visibleColumns.includes(col.id) ? 'bg-purple-600 border-purple-600' : 'border-gray-300 group-hover:border-purple-400'}`}>
                                                    {visibleColumns.includes(col.id) && <Check size={10} className="text-white" strokeWidth={4} />}
                                                </div>
                                                <span className={`text-[13px] font-medium transition-colors ${visibleColumns.includes(col.id) ? 'text-gray-900' : 'text-gray-400'}`}>{col.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Table - Desktop */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white sticky top-0 z-10">
                                <tr className="border-b border-gray-200">
                                    <th className="px-6 py-4 text-left w-12">
                                        <CustomCheckbox
                                            checked={allSelected}
                                            partial={someSelected}
                                            onChange={toggleAllItems}
                                            ariaLabel="Select all items"
                                        />
                                    </th>
                                    <SortableHeader label="Item ID" sortKey="item_id" />
                                    <SortableHeader label="Title" sortKey="title" />
                                    <SortableHeader label="Exam" sortKey="exam" />

                                    {activeTab === 'Reading' && (
                                        <>
                                            <SortableHeader label="Difficulty" sortKey="difficulty" />
                                            <SortableHeader label="Topic" sortKey="topic" />
                                        </>
                                    )}
                                    {activeTab === 'Listening' && (
                                        <>
                                            <SortableHeader label="Topic" sortKey="topic" />
                                            {visibleColumns.includes('transcript') && (
                                                <th className="px-6 py-4 text-left">
                                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Transcript</span>
                                                </th>
                                            )}
                                        </>
                                    )}
                                    {activeTab === 'Writing' && (
                                        <SortableHeader label="Type" sortKey="type" />
                                    )}
                                    {activeTab === 'Speaking' && (
                                        <>
                                            <SortableHeader label="Type" sortKey="type" />
                                            <SortableHeader label="Topic" sortKey="topic" />
                                        </>
                                    )}
                                    {activeTab === 'Mock Tests' && (
                                        <>
                                            <th className="px-6 py-4 text-left">
                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sections</span>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                                            </th>
                                        </>
                                    )}

                                    <SortableHeader label="Status" sortKey="status" />
                                    <SortableHeader label="Last Updated" sortKey="updated_at" />
                                    <SortableHeader label="Usage (30d)" sortKey="usage_30d" />

                                    <th className="px-6 py-4 text-left">
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={10} className="px-6 py-10 text-center text-gray-500">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-[#253154] border-t-transparent rounded-full animate-spin" />
                                                Loading library items...
                                            </div>
                                        </td>
                                    </tr>
                                ) : displayedItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="px-6 py-10 text-center text-gray-500">
                                            No library items found.
                                        </td>
                                    </tr>
                                ) : (
                                    displayedItems.map((item) => {
                                        const statusConfig = getStatusConfig(item.status);
                                        const itemId = item.id || item.item_id;

                                        return (
                                            <tr
                                                key={itemId}
                                                onClick={() => openEditForm(item)}
                                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                            >
                                                <td
                                                    className="px-6 py-4"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <CustomCheckbox
                                                        checked={selectedItems.includes(item.id?.toString() || item.item_id)}
                                                        onChange={() => toggleItemSelection(item.id?.toString() || item.item_id)}
                                                        ariaLabel={`Select ${item.title}`}
                                                    />
                                                </td>
                                                {visibleColumns.includes('item_id') && (
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-medium text-[#253154]">{item.item_id || item.id}</span>
                                                    </td>
                                                )}
                                                {visibleColumns.includes('title') && (
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-medium text-[#253154]">
                                                            {item.title}
                                                        </span>
                                                    </td>
                                                )}
                                                {visibleColumns.includes('exam') && (
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">{item.exam}</span>
                                                    </td>
                                                )}

                                                {activeTab === 'Reading' && (
                                                    <>
                                                        {visibleColumns.includes('difficulty') && (
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm text-gray-600">{item.difficulty}</span>
                                                            </td>
                                                        )}
                                                        {visibleColumns.includes('topic') && (
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm text-gray-600">{item.topic}</span>
                                                            </td>
                                                        )}
                                                    </>
                                                )}
                                                {activeTab === 'Listening' && (
                                                    <>
                                                        {visibleColumns.includes('topic') && (
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm text-gray-600">{item.topic}</span>
                                                            </td>
                                                        )}
                                                        {visibleColumns.includes('transcript') && (
                                                            <td className="px-6 py-4">
                                                                <div className={`p-1 rounded-full w-fit ${item.transcript ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                                    {item.transcript ? <CheckCircle size={14} /> : <Clock size={14} />}
                                                                </div>
                                                            </td>
                                                        )}
                                                    </>
                                                )}
                                                {activeTab === 'Writing' && visibleColumns.includes('type') && (
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">{item.type}</span>
                                                    </td>
                                                )}
                                                {activeTab === 'Speaking' && (
                                                    <>
                                                        {visibleColumns.includes('type') && (
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm text-gray-600">{item.type}</span>
                                                            </td>
                                                        )}
                                                        {visibleColumns.includes('topic') && (
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm text-gray-600">{item.topic}</span>
                                                            </td>
                                                        )}
                                                    </>
                                                )}
                                                {activeTab === 'Mock Tests' && (
                                                    <>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {((item.sections_included as string[]) || []).map((section, idx) => (
                                                                    <span key={idx} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600">
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

                                                {visibleColumns.includes('status') && (
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                                            {statusConfig.label}
                                                        </span>
                                                    </td>
                                                )}
                                                {visibleColumns.includes('updated_at') && (
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">
                                                            {item.updated_at ? format(new Date(item.updated_at), 'MMM dd, yyyy') : '-'}
                                                        </span>
                                                    </td>
                                                )}
                                                {visibleColumns.includes('usage_30d') && (
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-medium text-[#253154]">{item.usage_30d || 0}</span>
                                                    </td>
                                                )}
                                                <td
                                                    className="px-6 py-4"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        <TooltipProvider delayDuration={200}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={() => handleNavigateToDetail(item.item_id, activeTab)}
                                                                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                                                    >
                                                                        <Eye size={16} className="text-gray-500 group-hover:text-blue-600" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent className="bg-[#0e042f] text-white text-[10px] px-2 py-1">View Item</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        <TooltipProvider delayDuration={200}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={() => openEditForm(item)}
                                                                        className="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
                                                                    >
                                                                        <Edit size={16} className="text-gray-500 group-hover:text-purple-600" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent className="bg-[#0e042f] text-white text-[10px] px-2 py-1">Edit Item</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        <TooltipProvider delayDuration={200}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={() => handleArchiveItem(itemId)}
                                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                                                    >
                                                                        <Trash2 size={16} className="text-gray-500 group-hover:text-red-600" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent className="bg-[#0e042f] text-white text-[10px] px-2 py-1">Archive Item</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
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
                totalCount={filteredData.length}
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

            {/* Item Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[600px] bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-[#253154]">
                            {editingItem?.id ? 'Edit Library Item' : 'Create New Library Item'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveItem} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="item_id">Item ID</Label>
                                <Input
                                    id="item_id"
                                    value={editingItem?.item_id || ''}
                                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, item_id: e.target.value } : null)}
                                    placeholder="e.g. R101"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="exam">Exam</Label>
                                <CustomSelect
                                    value={editingItem?.exam || 'IELTS Academic'}
                                    onChange={(val) => setEditingItem(prev => prev ? { ...prev, exam: val } : null)}
                                    options={[
                                        { value: 'IELTS Academic', label: 'IELTS Academic' },
                                        { value: 'IELTS General', label: 'IELTS General' },
                                        { value: 'TOEFL', label: 'TOEFL' },
                                        { value: 'PTE', label: 'PTE' },
                                        { value: 'Visa', label: 'Visa' },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={editingItem?.title || ''}
                                onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                                placeholder="Enter item title"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <CustomSelect
                                    value={editingItem?.status || 'Draft'}
                                    onChange={(val: any) => setEditingItem(prev => prev ? { ...prev, status: val } : null)}
                                    options={[
                                        { value: 'Draft', label: 'Draft' },
                                        { value: 'In Review', label: 'In Review' },
                                        { value: 'Published', label: 'Published' },
                                        { value: 'Archived', label: 'Archived' },
                                    ]}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="difficulty">Difficulty</Label>
                                <CustomSelect
                                    value={editingItem?.difficulty || 'Medium'}
                                    onChange={(val) => setEditingItem(prev => prev ? { ...prev, difficulty: val } : null)}
                                    options={[
                                        { value: 'Easy', label: 'Easy' },
                                        { value: 'Medium', label: 'Medium' },
                                        { value: 'Hard', label: 'Hard' },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="topic">Topic</Label>
                                <Input
                                    id="topic"
                                    value={editingItem?.topic || ''}
                                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, topic: e.target.value } : null)}
                                    placeholder="e.g. Science, Health"
                                />
                            </div>
                            {activeTab === 'Writing' || activeTab === 'Speaking' ? (
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Input
                                        id="type"
                                        value={editingItem?.type || ''}
                                        onChange={(e) => setEditingItem(prev => prev ? { ...prev, type: e.target.value } : null)}
                                        placeholder="e.g. Task 2, Part 1"
                                    />
                                </div>
                            ) : null}
                        </div>

                        {activeTab === 'Listening' && (
                            <div className="flex items-center space-x-2 py-2">
                                <Checkbox
                                    id="transcript"
                                    checked={editingItem?.transcript || false}
                                    onCheckedChange={(checked) => setEditingItem(prev => prev ? { ...prev, transcript: !!checked } : null)}
                                />
                                <Label htmlFor="transcript" className="font-normal">Include Transcript</Label>
                            </div>
                        )}

                        <DialogFooter className="pt-4">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-[#0e042f] hover:bg-[#1a0c4a] rounded-lg transition-colors"
                            >
                                {editingItem?.id ? 'Update Item' : 'Create Item'}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
