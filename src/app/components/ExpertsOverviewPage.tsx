import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal,
    Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check,
    User, Mail, Briefcase, Star, Clock, Trash2, Edit3, UserCircle, Ban, CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Calendar as CalendarComponent } from "@/app/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { expertService, Expert, ExpertFormData } from '@/services/expertService';
import { ExpertModal } from './ExpertModal';
import { ExportDialog, ExportOptions } from './common/ExportDialog';
import { ImportDialog, ImportField, ImportMode } from './common/ImportDialog';
import { toast } from 'sonner';

interface CustomCheckboxProps {
    checked: boolean;
    partial?: boolean;
    onChange: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, partial = false, onChange }) => (
    <div
        onClick={(e) => {
            e.stopPropagation();
            onChange();
        }}
        className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'
            }`}
    >
        {checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}
        {partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}
    </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const s = status?.toLowerCase() || 'active';
    const config: any = {
        'active': { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', label: 'Active' },
        'inactive': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'Inactive' },
        'on-leave': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', label: 'On Leave' },
    }[s] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', label: status };

    return (
        <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
            {config.label}
        </span>
    );
};

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; bgClass: string; colorClass: string }> = ({ title, value, icon: Icon, bgClass, colorClass }) => (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all group flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl ${bgClass} ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon size={28} />
        </div>
        <div>
            <div className="text-[32px] font-bold text-[#0f172b] leading-none mb-1">{value}</div>
            <div className="text-[14px] font-medium text-gray-400 capitalize">{title}</div>
        </div>
    </div>
);

interface ExpertsOverviewPageProps {
    onNavigate?: (page: string, id?: string) => void;
}

export const ExpertsOverviewPage: React.FC<ExpertsOverviewPageProps> = ({ onNavigate }) => {
    // State
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [specializationFilter, setSpecializationFilter] = useState<string[]>([]);
    const [date, setDate] = useState<DateRange | undefined>();
    const [sortConfig, setSortConfig] = useState<{ key: keyof Expert; direction: 'asc' | 'desc' } | null>(null);
    const [selectedExperts, setSelectedExperts] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [expertModalOpen, setExpertModalOpen] = useState(false);
    const [selectedExpertForEdit, setSelectedExpertForEdit] = useState<Expert | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(['expertId', 'fullName', 'email', 'specialization', 'experience', 'rating', 'status']);

    // Fetch Data
    const fetchExperts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await expertService.getAllExperts(1, 1000, ''); // Fetch all for frontend filtering
            setExperts(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch experts');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExperts();
    }, [fetchExperts]);

    const handleRefresh = () => {
        fetchExperts();
        toast.success('Experts refreshed');
    };

    // Filter and Sort Logic
    const filteredExperts = useMemo(() => {
        let result = [...experts];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(e =>
                e.full_name.toLowerCase().includes(term) ||
                e.email.toLowerCase().includes(term) ||
                e.expert_id.toLowerCase().includes(term) ||
                (e.specialization || '').toLowerCase().includes(term)
            );
        }

        if (statusFilter.length > 0) {
            result = result.filter(e => statusFilter.includes(e.status.toLowerCase()));
        }

        if (specializationFilter.length > 0) {
            result = result.filter(e => specializationFilter.includes((e.specialization || '').toLowerCase()));
        }

        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue === undefined || bValue === undefined) return 0;
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [experts, searchTerm, statusFilter, specializationFilter, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(filteredExperts.length / rowsPerPage);
    const paginatedExperts = filteredExperts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Handlers
    const handleAddExpert = () => {
        setSelectedExpertForEdit(null);
        setExpertModalOpen(true);
    };

    const handleEditExpert = (expert: Expert) => {
        setSelectedExpertForEdit(expert);
        setExpertModalOpen(true);
    };

    const handleDeleteExpert = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this expert?')) {
            try {
                await expertService.deleteExpert(id);
                toast.success('Expert deleted');
                fetchExperts();
            } catch (error) {
                toast.error('Failed to delete expert');
            }
        }
    };

    const handleSaveExpert = async (data: ExpertFormData) => {
        if (selectedExpertForEdit) {
            await expertService.updateExpert(selectedExpertForEdit.id, data);
        } else {
            await expertService.createExpert(data);
        }
        fetchExperts();
    };

    const toggleSort = (key: keyof Expert) => {
        setSortConfig(current => {
            if (current?.key === key && current.direction === 'asc') {
                return { key, direction: 'desc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedExperts(paginatedExperts.map(e => e.id));
        } else {
            setSelectedExperts([]);
        }
    };

    const handleSelectExpert = (checked: boolean, id: number) => {
        if (checked) {
            setSelectedExperts(prev => [...prev, id]);
        } else {
            setSelectedExperts(prev => prev.filter(eid => eid !== id));
        }
    };

    // UI Constants
    const columns = [
        { id: 'expertId', label: 'Expert ID', key: 'expert_id' },
        { id: 'fullName', label: 'Full Name', key: 'full_name' },
        { id: 'email', label: 'Email', key: 'email' },
        { id: 'specialization', label: 'Specialization', key: 'specialization' },
        { id: 'experience', label: 'Experience', key: 'experience_years' },
        { id: 'rating', label: 'Rating', key: 'rating' },
        { id: 'status', label: 'Status', key: 'status' }
    ];

    const specializationOptions = Array.from(new Set(experts.map(e => (e.specialization || 'Unassigned').toLowerCase()))).filter(Boolean);

    return (
        <div className="w-full px-4 sm:px-8 lg:px-10 py-6 md:py-10 bg-gray-50 min-h-screen">
            <div className="max-w-[1600px] mx-auto">
                {/* Metrics Grid */}
                <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <MetricCard
                        title="Total Experts"
                        value={experts.length}
                        icon={User}
                        bgClass="bg-blue-50"
                        colorClass="text-blue-600"
                    />
                    <MetricCard
                        title="Active Experts"
                        value={experts.filter(e => e.status === 'active').length}
                        icon={CheckCircle}
                        bgClass="bg-emerald-50"
                        colorClass="text-emerald-600"
                    />
                    <MetricCard
                        title="Specializations"
                        value={new Set(experts.map(e => e.specialization)).size}
                        icon={Briefcase}
                        bgClass="bg-purple-50"
                        colorClass="text-purple-600"
                    />
                    <MetricCard
                        title="Avg Rating"
                        value={experts.length > 0 ? (experts.reduce((acc, curr) => acc + (curr.rating || 0), 0) / experts.length).toFixed(1) : 0}
                        icon={Star}
                        bgClass="bg-amber-50"
                        colorClass="text-amber-600"
                    />
                </div>

                {/* Header Section */}
                <div className="flex justify-between items-center gap-4 mb-8">
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
                        <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium">
                            <Download size={20} strokeWidth={1.5} />Export
                        </button>
                        <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium">
                            <Upload size={20} strokeWidth={1.5} />Import
                        </button>
                        <button onClick={handleAddExpert} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium">
                            <Plus size={20} strokeWidth={1.5} />Add Expert
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
                        <input
                            type="text"
                            placeholder="Search experts by name, email or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {/* Filter Popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className={`h-[50px] min-w-[50px] bg-white border ${statusFilter.length > 0 || specializationFilter.length > 0 ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-200'} rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center relative`}>
                                    <Filter size={20} strokeWidth={1.5} />
                                    {(statusFilter.length > 0 || specializationFilter.length > 0) && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                                            {statusFilter.length + specializationFilter.length}
                                        </span>
                                    )}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            <span>Status</span>
                                            {(statusFilter.length > 0 || specializationFilter.length > 0) && (
                                                <button onClick={() => { setStatusFilter([]); setSpecializationFilter([]); }} className="text-purple-600 hover:text-purple-700 capitalize text-[10px] font-bold">Clear All</button>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            {['active', 'inactive', 'on-leave'].map((opt) => (
                                                <div key={opt} className="flex items-center justify-between">
                                                    <label className="text-[14px] text-[#253154] capitalize">{opt.replace('-', ' ')}</label>
                                                    <CustomCheckbox
                                                        checked={statusFilter.includes(opt)}
                                                        onChange={() => setStatusFilter(prev => prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt])}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Specialization</h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar-light pr-2">
                                            {specializationOptions.map((opt) => (
                                                <div key={opt} className="flex items-center justify-between">
                                                    <label className="text-[14px] text-[#253154] capitalize">{opt}</label>
                                                    <CustomCheckbox
                                                        checked={specializationFilter.includes(opt)}
                                                        onChange={() => setSpecializationFilter(prev => prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt])}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Sort Popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                                    <ArrowUpDown size={20} strokeWidth={1.5} />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2 rounded-2xl shadow-xl border-gray-100" align="end">
                                <div className="space-y-1">
                                    {columns.map((col) => (
                                        <button
                                            key={col.id}
                                            onClick={() => toggleSort(col.key as keyof Expert)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${sortConfig?.key === col.key ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {col.label}
                                            {sortConfig?.key === col.key && (sortConfig.direction === 'asc' ? <ChevronDown size={14} className="rotate-180" /> : <ChevronDown size={14} />)}
                                        </button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Columns Popover */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className={`h-[50px] min-w-[50px] bg-white border ${visibleColumns.length < columns.length ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-200'} rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center`}>
                                    <Clock size={20} strokeWidth={1.5} />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Show Columns</h4>
                                <div className="space-y-2">
                                    {columns.map((col) => (
                                        <div key={col.id} className="flex items-center justify-between">
                                            <label className="text-[14px] text-[#253154]">{col.label}</label>
                                            <CustomCheckbox
                                                checked={visibleColumns.includes(col.id)}
                                                onChange={() => setVisibleColumns(prev => prev.includes(col.id) ? prev.filter(i => i !== col.id) : [...prev, col.id])}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Table Content */}
                <div className="bg-white rounded-[32px] shadow-xl shadow-indigo-900/5 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar-light">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="py-5 px-6 w-12 text-center items-center">
                                        <div className="flex justify-center">
                                            <CustomCheckbox
                                                checked={selectedExperts.length === paginatedExperts.length && paginatedExperts.length > 0}
                                                partial={selectedExperts.length > 0 && selectedExperts.length < paginatedExperts.length}
                                                onChange={() => handleSelectAll(selectedExperts.length !== paginatedExperts.length)}
                                            />
                                        </div>
                                    </th>
                                    {columns.filter(c => visibleColumns.includes(c.id)).map(col => (
                                        <th key={col.id} className="py-5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort(col.key as keyof Expert)}>
                                                {col.label}
                                                <ArrowUpDown size={14} className="text-gray-300" />
                                            </div>
                                        </th>
                                    ))}
                                    <th className="py-5 px-6 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedExperts.map((expert) => (
                                    <tr key={expert.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center">
                                                <CustomCheckbox
                                                    checked={selectedExperts.includes(expert.id)}
                                                    onChange={() => handleSelectExpert(!selectedExperts.includes(expert.id), expert.id)}
                                                />
                                            </div>
                                        </td>
                                        {visibleColumns.includes('expertId') && (
                                            <td className="py-4 px-4 text-sm font-medium text-indigo-600">{expert.expert_id}</td>
                                        )}
                                        {visibleColumns.includes('fullName') && (
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                                                        {expert.avatar_url ? <img src={expert.avatar_url} alt="" className="w-full h-full object-cover" /> : expert.full_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-[#0f172b]">{expert.full_name}</div>
                                                        <div className="text-xs text-gray-500">{expert.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.includes('email') && (
                                            <td className="py-4 px-4 text-sm text-gray-600">{expert.email}</td>
                                        )}
                                        {visibleColumns.includes('specialization') && (
                                            <td className="py-4 px-4">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[12px] font-bold border border-indigo-100">
                                                    {expert.specialization || 'General'}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('experience') && (
                                            <td className="py-4 px-4 text-sm text-gray-600 font-medium">{expert.experience_years} years</td>
                                        )}
                                        {visibleColumns.includes('rating') && (
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                                    <span className="text-sm font-bold text-[#0f172b]">{expert.rating || 'N/A'}</span>
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.includes('status') && (
                                            <td className="py-4 px-4">
                                                <StatusBadge status={expert.status} />
                                            </td>
                                        )}
                                        <td className="py-4 px-6 text-right">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-40 p-1" align="end">
                                                    <button
                                                        onClick={() => handleEditExpert(expert)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                                                    >
                                                        <Edit3 size={16} /> Edit Profile
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteExpert(expert.id)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} /> Remove Expert
                                                    </button>
                                                </PopoverContent>
                                            </Popover>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedExperts.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={visibleColumns.length + 2} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                    <Search size={32} className="text-gray-300" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-[#0f172b]">No experts found</h3>
                                                    <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                Showing {Math.min(filteredExperts.length, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(filteredExperts.length, currentPage * rowsPerPage)} of {filteredExperts.length} experts
                            </span>
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                                <span className="text-sm text-gray-500">Rows per page:</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="text-sm font-bold text-[#0f172b] outline-none bg-transparent"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-[#253154] hover:bg-gray-50 disabled:opacity-50 transition-all font-bold"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum = i + 1;
                                    if (totalPages > 5 && currentPage > 3) {
                                        pageNum = currentPage - 3 + i + 1;
                                        if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${currentPage === pageNum ? 'bg-[#0e042f] text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-[#253154] hover:bg-gray-50 disabled:opacity-50 transition-all font-bold"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ExportDialog
                open={showExportDialog}
                onOpenChange={setShowExportDialog}
                moduleName="Experts"
                totalCount={experts.length}
                onExport={async (options: ExportOptions) => { toast.success(`Exporting as ${options.format}...`); }}
            />

            <ImportDialog
                open={showImportDialog}
                onOpenChange={setShowImportDialog}
                moduleName="Experts"
                fields={[
                    { id: 'full_name', label: 'Full Name', required: true, type: 'text' },
                    { id: 'email', label: 'Email', required: true, type: 'text' },
                    { id: 'specialization', label: 'Specialization', required: false, type: 'text' }
                ]}
                onImport={async (data: any[], mode: ImportMode) => { toast.success(`Importing ${data.length} experts using ${mode} mode...`); }}
            />

            <ExpertModal
                isOpen={expertModalOpen}
                onClose={() => setExpertModalOpen(false)}
                expert={selectedExpertForEdit}
                onSave={handleSaveExpert}
            />
        </div>
    );
};
