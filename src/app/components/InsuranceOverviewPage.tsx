import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, ArrowDown, Search, Copy, Printer, Archive, Edit, Check, Columns, Eye, Power, Globe, Users, Shield, FileCheck, MapPin, TrendingUp, X } from 'lucide-react';
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { AddInsuranceDialog } from './common/AddInsuranceDialog';
import { getAllInsurance, getInsuranceMetrics, createInsurance, updateInsurance, deleteInsurance, Insurance as InsuranceType } from '@/app/services/insuranceService';

interface CustomCheckboxProps { checked: boolean; partial?: boolean; onChange: () => void; }
const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, partial = false, onChange }) => {
  return (<div onClick={onChange} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
    {checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}
    {partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}
  </div>);
};

interface StatusBadgeProps { status: 'active' | 'inactive'; }
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = { 'active': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Active' }, 'inactive': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', label: 'Inactive' } };
  const config = statusConfig[status];
  return (<span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>{config.label}</span>);
};

interface MetricCardProps { title: string; value: string; icon: React.ElementType; bgClass: string; colorClass: string; tooltip: string; }
const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => {
  return (<div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
    <div className="flex items-center justify-between"><span className="text-[#253154] font-medium text-[15px]">{title}</span>
      <TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors">i</div></TooltipTrigger>
        <TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2"><p>{tooltip}</p></TooltipContent></Tooltip></TooltipProvider></div>
    <div className="flex items-end gap-3 mt-2"><div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}><Icon size={22} strokeWidth={1.5} /></div>
      <div><p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p></div></div>
    <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500"><Icon size={80} /></div>
  </div>);
};

interface MobileInsuranceCardProps {
  insurance: InsuranceType;
  isSelected: boolean;
  onToggleSelect: () => void;
  onNavigate?: (page: string) => void;
  onEdit?: (insurance: InsuranceType) => void;
  onDelete?: (id: number | string) => void;
  onToggleStatus?: (insurance: InsuranceType) => void;
  onCopyId?: (id: string) => void;
}

const MobileInsuranceCard: React.FC<MobileInsuranceCardProps> = ({
  insurance,
  isSelected,
  onToggleSelect,
  onNavigate,
  onEdit,
  onDelete,
  onToggleStatus,
  onCopyId
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 ${isSelected ? 'border-purple-600 shadow-md ring-1 ring-purple-600/10' : 'border-gray-100 shadow-sm'}`}>
      <div className="p-4" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}>
              <CustomCheckbox checked={isSelected} onChange={() => { }} />
            </div>
            <div>
              <h3 className="text-[#253154] font-bold text-[15px]">{insurance.policy_name}</h3>
              <p className="text-gray-500 text-[12px]">{insurance.provider_name}</p>
            </div>
          </div>
          <StatusBadge status={insurance.status} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Coverage</p>
            <p className="text-[#253154] font-medium text-[13px]">{insurance.coverage_type}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Countries</p>
            <p className="text-[#253154] font-medium text-[13px]">{insurance.countries_covered} Covered</p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-dashed border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Reference ID</p>
              <div className="text-sm font-bold text-gray-700">{insurance.insurance_id}</div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Duration</p>
              <div className="text-sm text-gray-700 font-medium">{insurance.duration}</div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Visa Compliant</p>
              <div className="text-sm text-gray-700 font-medium">{insurance.visa_compliant ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Mandatory</p>
              <div className="text-sm text-gray-700 font-medium">{insurance.mandatory ? 'Yes' : 'No'}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => onNavigate?.('insurance-provider-detail')}
              className="flex items-center justify-center gap-2 h-10 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0c4a] transition-colors font-medium text-xs whitespace-nowrap"
            >
              <Eye size={14} /> View Details
            </button>
            <button
              onClick={() => onEdit?.(insurance)}
              className="flex items-center justify-center gap-2 h-10 bg-gray-50 text-[#253154] border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors font-medium text-xs whitespace-nowrap"
            >
              <Edit size={14} /> Edit
            </button>
            <button
              onClick={() => onToggleStatus?.(insurance)}
              className="flex items-center justify-center gap-2 h-10 bg-gray-50 text-[#253154] border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors font-medium text-xs whitespace-nowrap"
            >
              <Power size={14} /> {insurance.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => onCopyId?.(insurance.insurance_id)}
              className="flex items-center justify-center gap-2 h-10 bg-gray-50 text-[#253154] border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors font-medium text-xs whitespace-nowrap"
            >
              <Copy size={14} /> Copy ID
            </button>
          </div>
          <button
            onClick={() => onDelete?.(insurance.id)}
            className="w-full h-10 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium text-xs border border-red-100 flex items-center justify-center gap-2"
          >
            <Archive size={14} /> Delete Policy
          </button>
        </div>
      )}
    </div>
  );
};

export const InsuranceOverviewPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search' | 'filter' | 'sort'>('none');
  const [selectedInsurance, setSelectedInsurance] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'provider', 'policy', 'coverage', 'countries', 'status', 'visible']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<InsuranceType | null>(null);

  const [insurances, setInsurances] = useState<InsuranceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [coverageFilter, setCoverageFilter] = useState('All Types');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [openRowMenuId, setOpenRowMenuId] = useState<number | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllInsurance({
        page: currentPage,
        limit: rowsPerPage,
        search: debouncedSearchQuery,
        status: statusFilter,
        coverage_type: coverageFilter,
        sort: sortBy,
        order: sortOrder
      });

      setInsurances(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotalCount(result.pagination.total);

      const metrics = await getInsuranceMetrics();
      setMetricsData(metrics);
    } catch (error) {
      console.error("Error fetching insurance data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, debouncedSearchQuery, statusFilter, coverageFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const metrics = [
    { title: 'Insurance Providers', value: metricsData?.totalProviders?.toString() || '0', icon: Shield, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total insurance provider partners' },
    { title: 'Active Policies', value: metricsData?.activePolicies?.toString() || '0', icon: FileCheck, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Currently active insurance policies' },
    { title: 'Mandatory Countries', value: metricsData?.mandatoryCountries?.toString() || '0', icon: MapPin, bgClass: 'bg-red-50', colorClass: 'text-red-600', tooltip: 'Countries requiring mandatory insurance' },
    { title: 'Most Popular Coverage', value: metricsData?.mostChosenType || 'N/A', icon: TrendingUp, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Most popular policy type among students' }
  ];

  const handleRefresh = () => {
    fetchData();
    toast.success("Refreshing data...");
  };

  const handleToggleInsurance = (id: string) => {
    setSelectedInsurance(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedInsurance.length === insurances.length) {
      setSelectedInsurance([]);
      setSelectAllStore(false);
    } else {
      setSelectedInsurance(insurances.map(i => i.id.toString()));
      setSelectAllStore(false);
    }
  };

  const handleClearSelection = () => { setSelectedInsurance([]); setSelectAllStore(false); };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedInsurance(insurances.map(i => i.id.toString()));
  };

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => prev.includes(columnKey) ? prev.filter(k => k !== columnKey) : [...prev, columnKey]);
  };

  const handleSaveInsurance = async (data: any) => {
    try {
      if (editingInsurance) {
        await updateInsurance(editingInsurance.id, data);
      } else {
        await createInsurance(data);
      }
      fetchData();
    } catch (error) {
      throw error;
    }
  };

  const handleEditInsurance = (insurance: InsuranceType) => {
    setEditingInsurance(insurance);
    setShowAddDialog(true);
    setOpenRowMenuId(null);
  };

  const handleDeleteInsurance = async (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await deleteInsurance(id);
        toast.success("Policy deleted successfully");
        fetchData();
        setOpenRowMenuId(null);
      } catch (error) {
        toast.error("Failed to delete policy");
      }
    }
  };

  const handleToggleStatus = async (insurance: InsuranceType) => {
    try {
      const newStatus = insurance.status === 'active' ? 'inactive' : 'active';
      await updateInsurance(insurance.id, { status: newStatus });
      toast.success(`Policy status updated to ${newStatus}`);
      fetchData();
      setOpenRowMenuId(null);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Reference ID copied to clipboard");
    setOpenRowMenuId(null);
  };

  const slickSettings = { dots: true, infinite: false, speed: 500, slidesToShow: 1.1, slidesToScroll: 1, arrows: false, centerMode: true, centerPadding: '20px' };

  const exportColumns: ExportColumn[] = [
    { id: 'referenceId', label: 'Reference ID', defaultSelected: true }, { id: 'providerName', label: 'Provider Name', defaultSelected: true },
    { id: 'policyName', label: 'Policy Name', defaultSelected: true }, { id: 'coverageType', label: 'Coverage Type', defaultSelected: true },
    { id: 'countries', label: 'Country Availability', defaultSelected: true }, { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'duration', label: 'Duration', defaultSelected: false }, { id: 'visaCompliant', label: 'Visa Compliant', defaultSelected: false },
    { id: 'mandatory', label: 'Mandatory', defaultSelected: false }, { id: 'studentVisible', label: 'Student Visibility', defaultSelected: false }
  ];

  const importFields: ImportField[] = [
    { id: 'referenceId', label: 'Reference ID', required: false, type: 'text' }, { id: 'providerName', label: 'Provider Name', required: true, type: 'text' },
    { id: 'policyName', label: 'Policy Name', required: true, type: 'text' }, { id: 'coverageType', label: 'Coverage Type', required: true, type: 'select', options: ['Comprehensive', 'Medical Only', 'Basic'] },
    { id: 'countries', label: 'Country Availability', required: true, type: 'text' }, { id: 'status', label: 'Status', required: false, type: 'select', options: ['Active', 'Inactive'] },
    { id: 'visaCompliant', label: 'Visa Compliant', required: false, type: 'select', options: ['Yes', 'No'] }, { id: 'studentVisible', label: 'Student Visibility', required: false, type: 'select', options: ['Yes', 'No'] }
  ];

  const handleExport = async (options: any) => { console.log('Exporting:', options); toast.success(`Exporting ${options.scope} insurance records as ${options.format.toUpperCase()}`); await new Promise(resolve => setTimeout(resolve, 2000)); };
  const handleImport = async (data: any[], mode: any) => { console.log('Importing:', data, 'Mode:', mode); toast.success(`Successfully imported ${data.length} insurance records`); };

  return (
    <TooltipProvider><div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">

      {/* Desktop Action Bar - Same as Banks */}
      <div className="hidden md:flex justify-between items-center gap-4 mb-8">
        <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
          <Popover><PopoverTrigger asChild><button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <CalendarIcon size={20} className="text-[#253154]" /><span className="font-medium text-[#253154] text-[14px]">{date?.from && date?.to ? `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}` : 'Select date range'}</span>
          </button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><CalendarComponent initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} /></PopoverContent></Popover>
          <div className="w-px h-4 bg-gray-200 mx-2" /><button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500"><RefreshCw size={20} className="text-[#253154]" /></button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Download size={20} strokeWidth={1.5} />Export</button>
          <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Upload size={20} strokeWidth={1.5} />Import</button>
          <button onClick={() => { setEditingInsurance(null); setShowAddDialog(true); }} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"><Plus size={20} strokeWidth={1.5} />Add Insurance</button>
        </div>
      </div>

      {/* Metrics - Desktop */}
      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">{metrics.map((metric, idx) => <MetricCard key={idx} {...metric} />)}</div>

      {/* Metrics - Mobile */}
      <div className="block lg:hidden mb-14 -mx-4"><Slider {...slickSettings}>{metrics.map((metric, idx) => <div key={idx} className="px-2 py-2"><MetricCard {...metric} /></div>)}</Slider></div>

      {/* Search Bar - Desktop (same pattern) */}
      <div className="hidden md:flex justify-between items-center gap-4 mb-6">
        <div className="relative flex-1"><Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
          <input
            type="text"
            placeholder="Search by provider name, policy name, reference ID"
            className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <button className={`h-[50px] min-w-[50px] bg-white border ${statusFilter !== 'All' || coverageFilter !== 'All Types' ? 'border-purple-600 ring-1 ring-purple-600' : 'border-gray-200'} rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-2 px-4`}>
                <Filter size={20} strokeWidth={1.5} />
                {(statusFilter !== 'All' || coverageFilter !== 'All Types') && <span className="text-sm font-bold">Filters Active</span>}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="font-bold text-[#253154]">Filters</h4>
                  <button onClick={() => { setStatusFilter('All'); setCoverageFilter('All Types'); }} className="text-xs text-purple-600 font-bold hover:underline">Reset All</button>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-11 rounded-xl border-gray-100 bg-gray-50/50">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Coverage Type</Label>
                  <Select value={coverageFilter} onValueChange={setCoverageFilter}>
                    <SelectTrigger className="h-11 rounded-xl border-gray-100 bg-gray-50/50">
                      <SelectValue placeholder="Select Coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Types">All Types</SelectItem>
                      <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                      <SelectItem value="Medical Only">Medical Only</SelectItem>
                      <SelectItem value="Travel Only">Travel Only</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center px-4 gap-2">
                <ArrowUpDown size={20} strokeWidth={1.5} />
                <span className="text-sm font-medium">Sort</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 rounded-2xl shadow-xl border-gray-100" align="end">
              {[
                { label: 'Popularity', value: 'popularity' },
                { label: 'Policy Name', value: 'policy_name' },
                { label: 'Countries Covered', value: 'countries_covered' },
                { label: 'Last Updated', value: 'updated_at' },
                { label: 'Creation Date', value: 'created_at' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (sortBy === option.value) {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy(option.value);
                      setSortOrder('desc');
                    }
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-left text-sm flex items-center justify-between transition-colors ${sortBy === option.value ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {option.label}
                  {sortBy === option.value && (
                    sortOrder === 'asc' ? <ChevronDown size={14} className="rotate-180" /> : <ChevronDown size={14} />
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <Popover open={showColumnMenu} onOpenChange={setShowColumnMenu}>
            <PopoverTrigger asChild>
              <button className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center">
                <Columns size={20} strokeWidth={1.5} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
              <h4 className="font-bold text-[#253154] mb-3">Show Columns</h4>
              <div className="space-y-2">
                {[
                  { key: 'id', label: 'Reference ID' },
                  { key: 'provider', label: 'Provider' },
                  { key: 'policy', label: 'Policy Name' },
                  { key: 'coverage', label: 'Coverage Type' },
                  { key: 'countries', label: 'Countries' },
                  { key: 'status', label: 'Status' },
                  { key: 'visible', label: 'Visibility' }
                ].map((col) => (
                  <label key={col.key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <CustomCheckbox
                      checked={visibleColumns.includes(col.key)}
                      onChange={() => handleToggleColumn(col.key)}
                    />
                    <span className="text-sm font-medium text-gray-700">{col.label}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center">
            <MoreHorizontal size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Selection Banner */}
      {selectedInsurance.length > 0 && (
        <div className="bg-purple-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm border-b border-purple-100 mb-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="text-purple-900 font-medium">{selectedInsurance.length} insurance polic{selectedInsurance.length !== 1 ? 'ies' : 'y'} selected</span>
            {selectedInsurance.length === insurances.length && !selectAllStore && (<><span className="text-purple-700">•</span><button onClick={handleSelectAllStore} className="text-purple-700 font-bold hover:underline">Select all {totalCount} policies</button></>)}
          </div>
          <div className="flex items-center gap-3">
            <button className="text-purple-700 font-bold hover:underline">Enable/Disable</button>
            <button className="text-purple-700 font-bold hover:underline">Update Countries</button>
            <button onClick={handleClearSelection} className="text-purple-700 font-bold hover:underline">Clear</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100">
              <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12"><CustomCheckbox checked={selectedInsurance.length === insurances.length} partial={selectedInsurance.length > 0 && selectedInsurance.length < insurances.length} onChange={handleSelectAll} /></th>
              {visibleColumns.includes('id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Reference ID</th>}
              {visibleColumns.includes('provider') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Provider</th>}
              {visibleColumns.includes('policy') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Policy Name</th>}
              {visibleColumns.includes('coverage') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Coverage Type</th>}
              {visibleColumns.includes('countries') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Countries</th>}
              {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Status</th>}
              {visibleColumns.includes('visible') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visible</th>}
              <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <RefreshCw size={40} className="animate-spin opacity-20" />
                      <p className="text-sm font-medium">Loading insurance data...</p>
                    </div>
                  </td>
                </tr>
              ) : insurances.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <Shield size={40} className="opacity-20" />
                      <p className="text-sm font-medium">No results found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                insurances.map((ins) => (
                  <tr
                    key={ins.id}
                    onClick={() => onNavigate?.('insurance-provider-detail')}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors group ${selectedInsurance.includes(ins.id.toString()) ? 'bg-purple-50/30' : ''}`}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox checked={selectedInsurance.includes(ins.id.toString())} onChange={() => handleToggleInsurance(ins.id.toString())} />
                    </td>
                    {visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{ins.insurance_id}</td>}
                    {visibleColumns.includes('provider') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ins.provider_name}</td>}
                    {visibleColumns.includes('policy') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ins.policy_name}</td>}
                    {visibleColumns.includes('coverage') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ins.coverage_type}</td>}
                    {visibleColumns.includes('countries') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ins.countries_covered}</td>}
                    {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={ins.status} /></td>}
                    {visibleColumns.includes('visible') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ins.student_visible ? 'Yes' : 'No'}</td>}
                    <td className="relative px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenRowMenuId(openRowMenuId === ins.id ? null : ins.id)}
                        className={`p-1.5 rounded-lg transition-colors ${openRowMenuId === ins.id ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-400'}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openRowMenuId === ins.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setOpenRowMenuId(null)} />
                          <div className="absolute right-[80px] top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-100 z-30 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate?.('insurance-provider-detail');
                                setOpenRowMenuId(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2"
                            >
                              <Eye size={16} />View Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditInsurance(ins);
                              }}
                              className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2"
                            >
                              <Edit size={16} />Edit Insurance
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(ins);
                              }}
                              className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2"
                            >
                              <Power size={16} />{ins.status === 'active' ? 'Deactivate' : 'Activate'} Policy
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyId(ins.insurance_id);
                              }}
                              className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2"
                            >
                              <Copy size={16} />Copy Reference ID
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteInsurance(ins.id);
                              }}
                              className="w-full px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-red-600 text-left flex items-center gap-2"
                            >
                              <Archive size={16} />Delete Policy
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-3 p-4">
          {loading ? (
            <div className="py-10 flex flex-col items-center gap-3 text-gray-400">
              <RefreshCw size={32} className="animate-spin opacity-20" />
              <p className="text-xs font-medium">Loading...</p>
            </div>
          ) : insurances.length === 0 ? (
            <div className="py-10 flex flex-col items-center gap-3 text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
              <Shield size={32} className="opacity-20" />
              <p className="text-xs font-medium">No results found</p>
            </div>
          ) : (
            insurances.map((ins) => (
              <MobileInsuranceCard
                key={ins.id}
                insurance={ins}
                isSelected={selectedInsurance.includes(ins.id.toString())}
                onToggleSelect={() => handleToggleInsurance(ins.id.toString())}
                onNavigate={onNavigate}
                onEdit={handleEditInsurance}
                onDelete={handleDeleteInsurance}
                onToggleStatus={handleToggleStatus}
                onCopyId={handleCopyId}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 rounded-tr-[30px] shadow-[0px_-5px_25px_rgba(0,0,0,0.03)] relative z-20 border-t border-gray-50">
          <div className="flex items-center gap-2"><span className="text-gray-500 text-sm font-medium">Rows per page:</span>
            <Popover open={showRowsMenu} onOpenChange={setShowRowsMenu}>
              <PopoverTrigger asChild>
                <button className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
                  {rowsPerPage}<ChevronDown size={14} className="text-gray-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-24 p-1 rounded-xl shadow-xl border-gray-100" align="center">
                {[10, 20, 50, 100].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setRowsPerPage(num);
                      setCurrentPage(1);
                      setShowRowsMenu(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${rowsPerPage === num ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {num}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium hidden sm:inline">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <ChevronLeft size={18} strokeWidth={2} className="text-gray-500" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <ChevronRight size={18} strokeWidth={2} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menus */}
      {activeMobileMenu === 'search' && (
        <div className="fixed inset-0 z-50 bg-[#0e042f]/90 backdrop-blur-sm animate-in fade-in duration-300 flex flex-col p-6 md:hidden">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-white text-2xl font-bold">Search</h2>
            <button onClick={() => setActiveMobileMenu('none')} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="relative">
            <Search size={22} className="absolute inset-y-0 left-4 my-auto text-white/40" />
            <input
              autoFocus
              type="text"
              placeholder="Policy, Provider, ID..."
              className="w-full h-16 bg-white/10 border-none rounded-2xl pl-14 pr-4 text-white text-xl font-medium outline-none focus:ring-2 focus:ring-purple-400/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <p className="text-white/40 w-full text-xs font-bold uppercase tracking-widest mb-2">Popular Searches</p>
            {['Allianz', 'Comprehensive', 'Medical', 'INS-34'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/80 text-sm hover:bg-white/10"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeMobileMenu === 'filter' && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setActiveMobileMenu('none')} />
          <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] p-6 pb-10 animate-in slide-in-from-bottom duration-300 md:hidden">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#253154]">Active Filters</h2>
              <button
                onClick={() => { setStatusFilter('All'); setCoverageFilter('All Types'); setActiveMobileMenu('none'); }}
                className="text-sm font-bold text-purple-600 hover:bg-purple-50 px-3 py-1 rounded-lg"
              >
                Reset
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Power size={14} />Status</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['All', 'active', 'inactive'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`h-12 rounded-xl text-sm font-bold transition-all ${statusFilter === status ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Shield size={14} />Coverage</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['All Types', 'Comprehensive', 'Medical Only', 'Travel Only', 'Basic'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setCoverageFilter(type)}
                      className={`h-12 rounded-xl text-sm font-bold transition-all px-4 truncate ${coverageFilter === type ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveMobileMenu('none')}
              className="w-full h-16 bg-[#0e042f] text-white rounded-2xl mt-10 font-bold shadow-xl shadow-purple-900/20 active:scale-[0.98] transition-all"
            >
              Apply Changes
            </button>
          </div>
        </>
      )}

      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-[#0e042f] p-2 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
        <button onClick={() => setActiveMobileMenu('search')} className="flex items-center gap-2 text-white/90 font-bold text-xs bg-white/10 px-4 py-3 rounded-xl hover:bg-white/20 transition-colors">
          <Search size={16} /> Search
        </button>
        <div className="w-px h-4 bg-white/20 mx-1" />
        <button onClick={() => setActiveMobileMenu('filter')} className="flex items-center gap-2 text-white/90 font-bold text-xs bg-white/10 px-4 py-3 rounded-xl hover:bg-white/20 transition-colors relative">
          <Filter size={16} /> Filter
          {(statusFilter !== 'All' || coverageFilter !== 'All Types') && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#09031d] shadow-lg" />}
        </button>
      </div>
    </div>

      <AddInsuranceDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSave={handleSaveInsurance} initialData={editingInsurance} mode={editingInsurance ? 'edit' : 'add'} />
      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Insurance" totalCount={totalCount} selectedCount={selectedInsurance.length} columns={exportColumns} supportsDateRange={false} onExport={handleExport} />
      <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Insurance" fields={importFields} onImport={handleImport} templateUrl="/templates/insurance-import-template.xlsx" allowUpdate={true} />
    </TooltipProvider>
  );
};