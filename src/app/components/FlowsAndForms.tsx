'use client';

/**
 * FLOWS & FORMS LISTING PAGE
 * 
 * AI Visa Assistant → Flows & Forms
 * 
 * ✅ REFACTORED TO MATCH STUDENTS LISTING EXACTLY
 * - Same layout wrapper
 * - Same header structure
 * - Same metrics cards component
 * - Same search bar
 * - Same table structure
 * - Same pagination component
 */

import React, { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    RefreshCw,
    Eye,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    XCircle,
    TrendingUp,
    ArrowUpDown,
    GripVertical,
    Copy,
    Power,
    FileJson,
    Loader2,
    MessageSquare,
    Check,
    Edit,
    ChevronLeft,
    ChevronRight,
    Columns,
} from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CustomSelect } from './common/CustomSelect';

interface FlowsAndFormsProps {
    onNavigate: (page: string, flowId?: string) => void;
}

interface Flow {
    id: string;
    order: number;
    name: string;
    type: 'information' | 'assessment' | 'generator' | 'hybrid';
    linkedFeature: string;
    steps: number;
    status: 'active' | 'draft' | 'disabled';
    usage30d: number;
    lastUpdated: string;
}

const mockFlows: Flow[] = [
    {
        id: 'flow-001',
        order: 1,
        name: 'Visa Eligibility Check – Canada SDS',
        type: 'assessment',
        linkedFeature: 'Eligibility Check',
        steps: 8,
        status: 'draft',
        usage30d: 0,
        lastUpdated: 'Feb 17, 2026',
    },
    {
        id: 'flow-002',
        order: 2,
        name: 'Document Checklist Generator',
        type: 'generator',
        linkedFeature: 'Document Guide',
        steps: 12,
        status: 'active',
        usage30d: 892,
        lastUpdated: 'Feb 14, 2026',
    },
    {
        id: 'flow-003',
        order: 3,
        name: 'SOP Writing Guide',
        type: 'information',
        linkedFeature: 'SOP Assistant',
        steps: 6,
        status: 'active',
        usage30d: 567,
        lastUpdated: 'Feb 12, 2026',
    },
    {
        id: 'flow-004',
        order: 4,
        name: 'Financial Assessment Flow',
        type: 'hybrid',
        linkedFeature: 'Financial Planning',
        steps: 10,
        status: 'draft',
        usage30d: 0,
        lastUpdated: 'Feb 10, 2026',
    },
    {
        id: 'flow-005',
        order: 5,
        name: 'University Recommendation',
        type: 'assessment',
        linkedFeature: 'University Matcher',
        steps: 15,
        status: 'disabled',
        usage30d: 0,
        lastUpdated: 'Jan 28, 2026',
    },
];

// --- CustomCheckbox Component (Same as Students) ---
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

// --- MetricCard Component (Same as Students) ---
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

export const FlowsAndForms: React.FC<FlowsAndFormsProps> = ({ onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFlows, setSelectedFlows] = useState<string[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

    // Metric calculations
    const totalFlows = mockFlows.length;
    const activeFlows = mockFlows.filter(f => f.status === 'active').length;
    const draftFlows = mockFlows.filter(f => f.status === 'draft').length;
    const mostUsedFlow = mockFlows.sort((a, b) => b.usage30d - a.usage30d)[0];

    const metrics = [
        {
            title: 'Total Flows',
            value: totalFlows.toString(),
            icon: MessageSquare,
            bgClass: 'bg-purple-50',
            colorClass: 'text-purple-600',
            tooltip: 'Total number of conversation flows and forms configured'
        },
        {
            title: 'Active Flows',
            value: activeFlows.toString(),
            icon: CheckCircle2,
            bgClass: 'bg-green-50',
            colorClass: 'text-green-600',
            tooltip: 'Flows currently active and available to users'
        },
        {
            title: 'Draft Flows',
            value: draftFlows.toString(),
            icon: Clock,
            bgClass: 'bg-amber-50',
            colorClass: 'text-amber-600',
            tooltip: 'Flows in development, not yet published'
        },
        {
            title: 'Most Used Flow',
            value: `${mostUsedFlow?.usage30d || 0}`,
            icon: TrendingUp,
            bgClass: 'bg-blue-50',
            colorClass: 'text-blue-600',
            tooltip: `${mostUsedFlow?.name || 'N/A'} (30 days)`
        }
    ];

    const getFlowTypeBadge = (type: string) => {
        const configs = {
            information: { label: 'Information', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
            assessment: { label: 'Assessment', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
            generator: { label: 'Generator', bgColor: 'bg-teal-50', textColor: 'text-teal-700' },
            hybrid: { label: 'Hybrid', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700' },
        };
        const config = configs[type as keyof typeof configs];
        return (
            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                {config.label}
            </div>
        );
    };

    const getStatusBadge = (status: string) => {
        const configs = {
            active: { label: 'Active', bgColor: 'bg-green-50', textColor: 'text-green-700' },
            draft: { label: 'Draft', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
            disabled: { label: 'Disabled', bgColor: 'bg-gray-50', textColor: 'text-gray-700' },
        };
        const config = configs[status as keyof typeof configs];
        return (
            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                {config.label}
            </div>
        );
    };

    const toggleFlowSelection = (id: string) => {
        setSelectedFlows(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleAllFlows = () => {
        if (selectedFlows.length === mockFlows.length) {
            setSelectedFlows([]);
        } else {
            setSelectedFlows(mockFlows.map(f => f.id));
        }
    };

    const allSelected = selectedFlows.length === mockFlows.length && mockFlows.length > 0;
    const someSelected = selectedFlows.length > 0 && selectedFlows.length < mockFlows.length;

    // Filter and pagination
    const filteredFlows = mockFlows.filter(flow => {
        const searchLower = searchQuery.toLowerCase();
        return (
            flow.name.toLowerCase().includes(searchLower) ||
            flow.linkedFeature.toLowerCase().includes(searchLower)
        );
    });

    const totalPages = Math.ceil(filteredFlows.length / rowsPerPage);
    const displayedFlows = filteredFlows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Action handlers
    const handleViewFlow = (flowId: string) => {
        setOpenActionMenuId(null);
        onNavigate('flow-detail', flowId);
    };

    const handleEditFlow = (flowId: string) => {
        setOpenActionMenuId(null);
        onNavigate('flow-detail', flowId);
    };

    const handleDuplicate = (flow: Flow) => {
        setOpenActionMenuId(null);
        toast.success(`Flow "${flow.name}" duplicated as draft`);
    };

    const handleToggleStatus = (flow: Flow) => {
        setOpenActionMenuId(null);
        if (flow.status === 'active') {
            toast.success(`Flow "${flow.name}" disabled`);
        } else if (flow.status === 'disabled') {
            toast.success(`Flow "${flow.name}" enabled`);
        } else {
            toast.info('Publish the flow from the detail page to activate it');
        }
    };

    const handleExportJSON = (flow: Flow) => {
        setOpenActionMenuId(null);
        toast.success('Flow exported as JSON');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#faf7ff] via-white to-[#f8faff] px-8 py-6">
            <div className="max-w-[1920px] mx-auto">
                {/* Header Section - MATCHES STUDENTS EXACTLY */}
                <div className="flex items-center justify-between mb-6">
                    {/* Left side - Placeholder for consistency */}
                    <div className="w-[200px]"></div>

                    {/* Action Buttons - MATCHES STUDENTS */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => toast.info('Export functionality')}
                            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Download size={18} className="text-[#253154]" />
                            <span className="text-sm text-[#253154] font-medium">Export</span>
                        </button>
                        <button
                            onClick={() => toast.info('Reorder mode')}
                            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <ArrowUpDown size={18} className="text-[#253154]" />
                            <span className="text-sm text-[#253154] font-medium">Reorder Mode</span>
                        </button>
                    </div>
                </div>

                {/* Metrics Section - MATCHES STUDENTS EXACTLY */}
                <div className="hidden lg:flex gap-4 mb-8">
                    {metrics.map((metric, index) => (
                        <div key={index} className="flex-1">
                            <MetricCard {...metric} />
                        </div>
                    ))}
                </div>

                {/* Search and Filter Bar - MATCHES STUDENTS EXACTLY */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-xl">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253154]" />
                        <input
                            type="text"
                            placeholder="Search by name, linked feature..."
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

                {/* Table - Desktop - MATCHES STUDENTS EXACTLY */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white sticky top-0 z-10">
                                <tr className="border-b border-gray-200">
                                    <th className="px-6 py-4 text-left">
                                        <CustomCheckbox
                                            checked={allSelected}
                                            partial={someSelected}
                                            onChange={toggleAllFlows}
                                            ariaLabel="Select all flows"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Order</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Flow Name</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Flow Type</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Linked Feature</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Steps</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Status</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Usage (30D)</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Last Updated</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedFlows.map((flow) => {
                                    return (
                                        <tr
                                            key={flow.id}
                                            onClick={() => onNavigate('flow-detail', flow.id)}
                                            className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                        >
                                            <td
                                                className="px-6 py-4"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <CustomCheckbox
                                                    checked={selectedFlows.includes(flow.id)}
                                                    onChange={() => toggleFlowSelection(flow.id)}
                                                    ariaLabel={`Select ${flow.name}`}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <GripVertical size={16} className="text-gray-400" />
                                                    <span className="text-sm font-medium text-[#253154]">{flow.order}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-[#253154]">
                                                    {flow.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getFlowTypeBadge(flow.type)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{flow.linkedFeature}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-[#253154]">{flow.steps}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(flow.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-[#253154]">
                                                    {flow.usage30d > 0 ? flow.usage30d.toLocaleString() : '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{flow.lastUpdated}</span>
                                            </td>
                                            <td
                                                className="px-6 py-4"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Popover open={openActionMenuId === flow.id} onOpenChange={(open) => setOpenActionMenuId(open ? flow.id : null)}>
                                                    <PopoverTrigger asChild>
                                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                            <MoreHorizontal size={18} className="text-gray-600" />
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-56 p-2 bg-white" align="end">
                                                        <div className="flex flex-col gap-1">
                                                            <button
                                                                onClick={() => handleViewFlow(flow.id)}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                            >
                                                                <Eye size={16} />
                                                                <span>View Flow</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditFlow(flow.id)}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                            >
                                                                <Edit size={16} />
                                                                <span>Edit Flow</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDuplicate(flow)}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                            >
                                                                <Copy size={16} />
                                                                <span>Duplicate</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleExportJSON(flow)}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                            >
                                                                <FileJson size={16} />
                                                                <span>Export JSON</span>
                                                            </button>
                                                            <div className="h-px bg-gray-200 my-1" />
                                                            <button
                                                                onClick={() => handleToggleStatus(flow)}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-[#253154] hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                            >
                                                                <Power size={16} />
                                                                <span>{flow.status === 'disabled' ? 'Enable' : 'Disable'}</span>
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

                    {/* Pagination - MATCHES STUDENTS EXACTLY */}
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
