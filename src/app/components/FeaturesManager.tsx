'use client';

/**
 * AI VISA ASSISTANT - FEATURES MANAGER (LISTING PAGE)
 * 
 * REUSES EXACT DESIGN SYSTEM COMPONENTS FROM:
 * - Bookings: MetricCard, StatusBadge, FilterBar, Table
 * - Students: Checkbox, Layout Grid
 * 
 * NO CUSTOM COMPONENTS - 100% DESIGN SYSTEM REUSE
 */

import React, { useState, useEffect } from 'react';
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
    Check,
    Columns,
    Clock,
    CheckCircle,
    XCircle,
    Users,
    Sparkles,
    TrendingUp,
    Eye,
    GripVertical,
    Pencil,
    Trash2,
} from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";
import { SlickStyles } from './ui/SlickStyles';
import { aiFeatureService, AiFeature } from '@/services/aiFeatureService';

// ============================================================================
// EXACT COMPONENTS FROM DESIGN SYSTEM (Bookings/Students)
// ============================================================================

// CustomCheckbox - EXACT from Bookings
interface CustomCheckboxProps {
    checked: boolean;
    partial?: boolean;
    onChange: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, partial = false, onChange }) => (
    <div
        onClick={onChange}
        className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'
            }`}
    >
        {checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}
        {partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}
    </div>
);

// StatusBadge - EXACT from Bookings
interface StatusBadgeProps {
    status: 'active' | 'disabled';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const config = {
        active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Active' },
        disabled: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', label: 'Disabled' }
    }[status];

    return (
        <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
            {config.label}
        </span>
    );
};

// MetricCard - EXACT from Bookings
interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    bgClass: string;
    colorClass: string;
    tooltip: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => (
    <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
        <div className="flex items-center justify-between">
            <span className="text-[#253154] font-medium text-[15px]">{title}</span>
            <TooltipProvider delayDuration={200}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors">i</div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2"><p>{tooltip}</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <div className="flex items-end gap-3 mt-2">
            <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}>
                <Icon size={22} strokeWidth={1.5} />
            </div>
            <div><p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p></div>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500"><Icon size={80} /></div>
    </div>
);

// ============================================================================
// FEATURES MANAGER COMPONENT
// ============================================================================

interface FeaturesManagerProps {
    onNavigate: (page: string, featureId?: string) => void;
}

export const FeaturesManager: React.FC<FeaturesManagerProps> = ({ onNavigate }) => {
    const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) });
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectAllStore, setSelectAllStore] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(['order', 'name', 'status', 'linkedFlow', 'starterPrompt', 'usage', 'updated']);
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [reorderMode, setReorderMode] = useState(false);

    const [features, setFeatures] = useState<AiFeature[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const data = await aiFeatureService.getAllFeatures();
                setFeatures(data);
            } catch (error) {
                console.error('Error fetching features:', error);
                toast.error('Failed to load features');
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeatures();
    }, []);

    // EXACT metrics structure from Bookings
    const metrics = [
        { title: 'Total Features', value: features.length.toString(), icon: Sparkles, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total number of AI features available' },
        { title: 'Active Features', value: features.filter(f => f.status === 'active').length.toString(), icon: CheckCircle, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Features currently visible to students' },
        { title: 'Disabled Features', value: features.filter(f => f.status === 'disabled').length.toString(), icon: XCircle, bgClass: 'bg-gray-50', colorClass: 'text-gray-600', tooltip: 'Features currently hidden from students' },
        { title: 'Most Used', value: features.length > 0 ? (Math.max(...features.map(f => f.usage_30d || 0)) / 1000).toFixed(1) + 'K' : '0', icon: TrendingUp, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Most popular feature usage count' }
    ];

    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            const data = await aiFeatureService.getAllFeatures();
            setFeatures(data);
            toast.success("Data refreshed");
        } catch (error) {
            toast.error("Failed to refresh data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteFeature = async (e: React.MouseEvent, featureId: string, featureName: string) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${featureName}"? This action cannot be undone.`)) {
            try {
                await aiFeatureService.deleteFeature(featureId);
                toast.success(`Feature "${featureName}" deleted successfully`);
                handleRefresh();
            } catch (error) {
                console.error('Error deleting feature:', error);
                toast.error('Failed to delete feature');
            }
        }
    };

    const handleSelectAll = () => {
        if (selectedFeatures.length === features.length) {
            setSelectedFeatures([]);
            setSelectAllStore(false);
        } else {
            setSelectedFeatures(features.map(f => f.feature_id));
            setSelectAllStore(false);
        }
    };

    const handleToggleFeature = (featureId: string) => {
        setSelectedFeatures(prev => prev.includes(featureId) ? prev.filter(id => id !== featureId) : [...prev, featureId]);
    };

    const handleClearSelection = () => {
        setSelectedFeatures([]);
        setSelectAllStore(false);
    };

    const slickSettings = {
        dots: false, infinite: false, speed: 500, slidesToShow: 4, slidesToScroll: 1, arrows: true,
        responsive: [
            { breakpoint: 1536, settings: { slidesToShow: 4 } },
            { breakpoint: 1280, settings: { slidesToShow: 3 } },
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } }
        ]
    };

    return (
        <div className="w-full px-4 sm:px-8 lg:px-10 py-6 md:py-10 bg-gray-50 min-h-screen">
            <SlickStyles />
            <div className="max-w-[1600px] mx-auto">

                {/* Desktop Action Bar - EXACT from Bookings */}
                <div className="hidden md:flex justify-between items-center gap-4 mb-8">
                    <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                                    <CalendarIcon size={20} className="text-[#253154]" />
                                    <span className="font-medium text-[#253154] text-[14px]">
                                        {date?.from && date?.to ? `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}` : 'Select date range'}
                                    </span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
                            </PopoverContent>
                        </Popover>
                        <div className="w-px h-4 bg-gray-200 mx-2" />
                        <button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500">
                            <RefreshCw size={20} className="text-[#253154]" />
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setReorderMode(!reorderMode)}
                            className={`flex items-center gap-2 px-6 h-[50px] rounded-xl border shadow-sm text-[16px] font-medium transition-colors ${reorderMode
                                ? 'bg-[#0e042f] text-white border-[#0e042f] hover:bg-[#1a0c4a]'
                                : 'bg-white text-[#253154] border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <GripVertical size={20} strokeWidth={1.5} />
                            {reorderMode ? 'Exit Reorder' : 'Reorder Mode'}
                        </button>
                        <button className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium">
                            <Download size={20} strokeWidth={1.5} />Export
                        </button>
                        <button
                            onClick={() => onNavigate('feature-detail', 'new')}
                            className="flex items-center gap-2 bg-[#253154] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a2340] transition-all text-[16px] font-bold"
                        >
                            <Plus size={20} strokeWidth={2.5} />
                            Add Feature
                        </button>
                    </div>
                </div>

                {/* Mobile Action Bar - EXACT from Bookings */}
                <div className="flex md:hidden flex-col gap-4 mb-6">
                    <div className="w-full h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-between px-5">
                        <div className="flex items-center gap-3">
                            <CalendarIcon size={18} className="text-[#253154]" />
                            <span className="text-sm font-medium text-[#253154]">{date?.from && date?.to ? `${format(date.from, 'd MMM')} - ${format(date.to, 'd MMM')}` : 'Select range'}</span>
                        </div>
                        <button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-full transition-colors active:rotate-180 active:duration-500">
                            <RefreshCw size={18} className="text-[#253154]" />
                        </button>
                    </div>
                </div>

                {/* Metric Cards - EXACT grid from Bookings */}
                <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {metrics.map((metric, index) => <MetricCard key={index} {...metric} />)}
                </div>

                <div className="block lg:hidden mb-14 -mx-4">
                    <Slider {...slickSettings}>
                        {metrics.map((metric, index) => (
                            <div key={index} className="px-2 py-2"><MetricCard {...metric} /></div>
                        ))}
                    </Slider>
                </div>

                {/* Filter Bar - EXACT from Bookings */}
                <div className="hidden md:flex justify-between items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
                        <input type="text" placeholder="Search features..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" />
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <button onClick={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); setShowColumnMenu(false); }} className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                            <Filter size={20} strokeWidth={1.5} />
                        </button>
                        <button onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); setShowColumnMenu(false); }} className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                            <ArrowUpDown size={20} strokeWidth={1.5} />
                        </button>
                        <button onClick={() => { setShowColumnMenu(!showColumnMenu); setShowFilterMenu(false); setShowSortMenu(false); }} className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                            <Columns size={20} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                <div className="flex md:hidden mb-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
                        <input type="text" placeholder="Search features..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-sm font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" />
                    </div>
                </div>

                {/* Selection Banner - EXACT from Bookings */}
                {selectedFeatures.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-[#253154]">{selectedFeatures.length} selected</span>
                        </div>
                        <button onClick={handleClearSelection} className="text-sm text-gray-600 hover:text-gray-700">Clear selection</button>
                    </div>
                )}

                {/* Table - EXACT structure from Bookings */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="w-12 px-6 py-4 text-left">
                                        <CustomCheckbox checked={selectedFeatures.length === features.length} partial={selectedFeatures.length > 0 && selectedFeatures.length < features.length} onChange={handleSelectAll} />
                                    </th>
                                    {visibleColumns.includes('order') && <th className="w-24 px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Order</th>}
                                    {visibleColumns.includes('name') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Feature Name</th>}
                                    {visibleColumns.includes('status') && <th className="w-32 px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>}
                                    {visibleColumns.includes('linkedFlow') && <th className="w-48 px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Linked Flow</th>}
                                    {visibleColumns.includes('starterPrompt') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Starter Prompt</th>}
                                    {visibleColumns.includes('usage') && <th className="w-32 px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Usage (30d)</th>}
                                    {visibleColumns.includes('updated') && <th className="w-40 px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Last Updated</th>}
                                    <th className="w-28 px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {features.map((feature) => (
                                    <tr
                                        key={feature.feature_id}
                                        onClick={() => {
                                            console.log('Row clicked for feature:', feature.feature_id);
                                            onNavigate('feature-detail', feature.feature_id);
                                        }}
                                        className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                                            <CustomCheckbox checked={selectedFeatures.includes(feature.feature_id)} onChange={() => handleToggleFeature(feature.feature_id)} />
                                        </td>
                                        {visibleColumns.includes('order') && (
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    {reorderMode && <GripVertical size={16} className="text-gray-400 cursor-move" />}
                                                    <span className="font-bold text-[#253154] text-[14px]">{feature.order}</span>
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.includes('name') && (
                                            <td className="px-6 py-5">
                                                <span className="font-bold text-[#253154] text-[14px]">{feature.name}</span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('status') && (
                                            <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                                                <StatusBadge status={feature.status} />
                                            </td>
                                        )}
                                        {visibleColumns.includes('linkedFlow') && (
                                            <td className="px-6 py-5">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toast.info(`View Flow: ${feature.linked_flow}`);
                                                    }}
                                                    className="inline-flex items-center px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[12px] font-medium rounded-lg border border-blue-100 transition-colors max-w-full"
                                                >
                                                    <span className="truncate">{feature.linked_flow}</span>
                                                </button>
                                            </td>
                                        )}
                                        {visibleColumns.includes('starterPrompt') && (
                                            <td className="px-6 py-5">
                                                <p className="text-gray-700 text-[14px] truncate">{feature.starter_prompt}</p>
                                            </td>
                                        )}
                                        {visibleColumns.includes('usage') && (
                                            <td className="px-6 py-5">
                                                <span className="text-gray-900 font-semibold text-[14px]">{(feature.usage_30d || 0).toLocaleString()}</span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('updated') && (
                                            <td className="px-6 py-5">
                                                <span className="text-gray-500 text-[13px] whitespace-nowrap">{feature.updated_at ? new Date(feature.updated_at).toLocaleString() : 'N/A'}</span>
                                            </td>
                                        )}
                                        <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center gap-1">
                                                <TooltipProvider delayDuration={200}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    console.log('[DEBUG_UI] Edit button clicked for:', feature.feature_id);
                                                                    if (typeof window !== 'undefined') {
                                                                        window.alert(`[Child Trace] Clicked Edit for ID: ${feature.feature_id}`);
                                                                    }
                                                                    onNavigate('feature-detail', feature.feature_id);
                                                                }}
                                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                                            >
                                                                <Pencil size={16} className="text-gray-600 group-hover:text-blue-600" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-[#0e042f] text-white text-[10px] px-2 py-1">Edit Feature</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider delayDuration={200}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={(e) => handleDeleteFeature(e, feature.feature_id, feature.name)}
                                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                                            >
                                                                <Trash2 size={16} className="text-gray-600 group-hover:text-red-600" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-[#0e042f] text-white text-[10px] px-2 py-1">Delete Feature</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
};
