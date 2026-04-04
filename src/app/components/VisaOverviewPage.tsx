import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal,
  Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search,
  Check, Columns, Eye, EyeOff, Globe, FileText, Award, TrendingUp,
  X, Trash2, Edit, Copy, Power, Shield, Zap, Briefcase
} from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { AddVisaDialog } from './common/AddVisaDialog';
import * as visaService from '@/app/services/visaService';
import { Visa } from '@/app/services/visaService';
import { PermissionGuard } from './common/PermissionGuard';

// --- Components ---

interface CustomCheckboxProps { checked: boolean; partial?: boolean; onChange: () => void; }
const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, partial = false, onChange }) => (
  <div onClick={onChange} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
    {checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}
    {partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}
  </div>
);

interface StatusBadgeProps { status: 'active' | 'inactive'; }
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    'active': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Active' },
    'inactive': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', label: 'Inactive' }
  }[status];
  return (<span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>{config.label}</span>);
};

interface MetricCardProps { title: string; value: string; icon: React.ElementType; bgClass: string; colorClass: string; tooltip: string; }
const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[200px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
    <div className="flex items-center justify-between">
      <span className="text-[#253154] font-medium text-[15px]">{title}</span>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors text-gray-400">i</div>
          </TooltipTrigger>
          <TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2 border-none">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div className="flex items-end gap-3 mt-2">
      <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}>
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p>
      </div>
    </div>
    <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500">
      <Icon size={80} />
    </div>
  </div>
);

interface MobileVisaCardProps {
  visa: Visa;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: (visa: Visa) => void;
  onDelete: (id: number) => void;
  onNavigate?: (page: string) => void;
}

const MobileVisaCard: React.FC<MobileVisaCardProps> = ({ visa, isSelected, onToggleSelect, onEdit, onDelete, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border transition-all ${isSelected ? 'border-purple-200 shadow-md ring-1 ring-purple-100' : 'border-gray-100 shadow-sm'}`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-3">
          <CustomCheckbox checked={isSelected} onChange={onToggleSelect} />
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{visa.visa_id}</div>
            <div className="font-bold text-[#253154] leading-tight">{visa.visa_type}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={visa.status} />
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-2">
        <div>
          <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Category</div>
          <div className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            {visa.category === 'Study' ? <Award size={14} className="text-blue-500" /> : <Briefcase size={14} className="text-purple-500" />}
            {visa.category}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Countries</div>
          <div className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Globe size={14} className="text-green-500" />
            {visa.countries_covered} Countries
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Difficulty</div>
          <div className="text-sm font-medium text-gray-700">{visa.processing_difficulty}</div>
        </div>
        <div>
          <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Visible</div>
          <div className="text-sm font-medium text-gray-700">{visa.student_visible ? 'Yes' : 'No'}</div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-3 pb-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(visa); }}
              className="w-full h-10 bg-white border border-gray-100 text-[#253154] rounded-xl hover:bg-gray-50 transition-colors font-medium text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Edit size={14} /> Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate?.(`/services/visa/${visa.id}`); }}
              className="w-full h-10 bg-purple-50 text-purple-600 border border-purple-100 rounded-xl hover:bg-purple-100 transition-colors font-medium text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Eye size={14} /> View
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(visa.id); }}
              className="w-full h-10 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors font-medium text-xs flex items-center justify-center gap-2"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---

export const VisaOverviewPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  // State
  const [visas, setVisas] = useState<Visa[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', order: 'desc' });

  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [selectedVisas, setSelectedVisas] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'type', 'category', 'countries', 'status', 'difficulty', 'visible']);

  // UI State
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showRowsMenu, setShowRowsMenu] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [editingVisa, setEditingVisa] = useState<Visa | null>(null);
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'search' | 'filter' | 'sort'>('none');

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Data fetching
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await visaService.getAllVisas({
        page: currentPage,
        limit: rowsPerPage,
        search: debouncedSearch,
        status: statusFilter,
        category: categoryFilter,
        sort: sortConfig.field,
        order: sortConfig.order
      });

      if (response.success) {
        setVisas(response.data);
        setTotalCount(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
      }

      const metricsData = await visaService.getVisaMetrics();
      if (metricsData) setMetrics(metricsData);
    } catch (error) {
      toast.error("Failed to load visa data");
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, debouncedSearch, statusFilter, categoryFilter, sortConfig]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers
  const handleAddVisa = () => {
    setDialogMode('add');
    setEditingVisa(null);
    setShowAddDialog(true);
  };

  const handleEditVisa = (visa: Visa) => {
    setDialogMode('edit');
    setEditingVisa(visa);
    setShowAddDialog(true);
  };

  const handleSaveVisa = async (data: any) => {
    if (dialogMode === 'add') {
      await visaService.createVisa(data);
    } else if (editingVisa) {
      await visaService.updateVisa(editingVisa.id, data);
    }
    fetchData();
  };

  const handleDeleteVisa = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this visa type?")) {
      try {
        await visaService.deleteVisa(id);
        toast.success("Visa type deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete visa type");
      }
    }
  };

  const handleToggleStatus = async (visa: Visa) => {
    try {
      const newStatus = visa.status === 'active' ? 'inactive' : 'active';
      await visaService.updateVisa(visa.id, { status: newStatus });
      toast.success(`Visa ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID copied to clipboard");
  };

  const handleToggleSelect = (id: string) => {
    setSelectedVisas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  // UI Config
  const metricConfigs = [
    { title: 'Visa Types Supported', value: metrics?.totalVisaTypes || '0', icon: FileText, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total visa types available in system' },
    { title: 'Active Visa Rules', value: metrics?.activeVisaRules || '0', icon: Award, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Currently active visa processing rules' },
    { title: 'Countries Enabled', value: metrics?.countriesEnabled || '0', icon: Globe, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Countries with visa pathways enabled' },
    { title: 'High Approval Pathways', value: metrics?.highApprovalPathways || '0', icon: TrendingUp, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Visa pathways with high approval rates' }
  ];

  const allColumns = [
    { key: 'id', label: 'Reference ID' }, { key: 'type', label: 'Visa Type' }, { key: 'category', label: 'Category' }, { key: 'countries', label: 'Countries' },
    { key: 'status', label: 'Status' }, { key: 'difficulty', label: 'Difficulty' }, { key: 'workRights', label: 'Work Rights' }, { key: 'visible', label: 'Visible' }, { key: 'popularity', label: 'Popularity' }
  ];

  const exportColumns: ExportColumn[] = [
    { id: 'id', label: 'Database ID', defaultSelected: false },
    { id: 'visa_id', label: 'Reference ID', defaultSelected: true }, { id: 'visa_type', label: 'Visa Type', defaultSelected: true },
    { id: 'category', label: 'Category', defaultSelected: true }, { id: 'countries_covered', label: 'Countries', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true }, { id: 'processing_difficulty', label: 'Processing Difficulty', defaultSelected: false }
  ];


  const importFields: ImportField[] = [
    { id: 'id', label: 'Database ID (For Updates)', required: false, type: 'text' },
    { id: 'visa_type', label: 'Visa Type', required: true, type: 'text' },
    { id: 'category', label: 'Category', required: true, type: 'select', options: ['Study', 'Work', 'Dependent', 'Visitor'] },
    { id: 'countries_covered', label: 'Countries', required: true, type: 'text' },
    { id: 'status', label: 'Status', required: false, type: 'select', options: ['Active', 'Inactive'] },
    { id: 'processing_difficulty', label: 'Processing Difficulty', required: false, type: 'select', options: ['Low', 'Medium', 'High'] }
  ];


  const handleExport = async (options: any) => {
    console.log('Exporting with options:', options);

    try {
      if (options.format === 'pdf') {
        let dataToExport: any[] = [];

        // 1. Determine Scope and Fetch Data
        if (options.scope === 'all') {
          toast.info("Fetching all data for PDF export...");
          const response = await visaService.getAllVisas({ limit: 10000 });
          dataToExport = response.data || [];
        } else if (options.scope === 'current') {
          dataToExport = [...visas];
        } else if (options.scope === 'selected') {
          if (selectedVisas.length === 0) {
            toast.error("No items selected");
            return;
          }
          dataToExport = visas.filter(v => selectedVisas.includes(v.id.toString()));
        }

        // 2. Filter by Date Range (if applicable)
        if (options.dateRange?.from && options.dateRange?.to) {
          const fromDate = new Date(options.dateRange.from);
          const toDate = new Date(options.dateRange.to);
          toDate.setHours(23, 59, 59, 999);

          dataToExport = dataToExport.filter(item => {
            const itemDateStr = item.created_at || item.updated_at;
            if (!itemDateStr) return true;
            const itemDate = new Date(itemDateStr);
            return itemDate >= fromDate && itemDate <= toDate;
          });
        }

        if (dataToExport.length === 0) {
          toast.warning("No data available to export after filtering");
          return;
        }

        // 3. Prepare data for PDF based on selected columns
        const exportData = dataToExport.map(item => {
          const row: any = {};
          const isSelected = (id: string) => options.selectedColumns.includes(id);

          if (isSelected('id')) row['Database ID'] = item.id;
          if (isSelected('visa_id')) row['Reference ID'] = item.visa_id;
          if (isSelected('visa_type')) row['Visa Type'] = item.visa_type;
          if (isSelected('category')) row['Category'] = item.category;
          if (isSelected('countries_covered')) row['Countries'] = item.countries_covered;
          if (isSelected('status')) row['Status'] = item.status;
          if (isSelected('processing_difficulty')) row['Difficulty'] = item.processing_difficulty;

          return row;
        });

        const headers = Object.keys(exportData[0] || {});
        if (headers.length === 0) {
          toast.error("No columns selected for PDF");
          return;
        }

        // 4. Generate Print Window
        const dateStr = format(new Date(), 'yyyy-MM-dd');
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          toast.error("Please allow popups to export PDF");
          return;
        }

        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Visa Export ${dateStr}</title>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; }
                header { margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
                h1 { color: #0e042f; margin: 0; font-size: 24px; }
                .meta { margin-top: 10px; color: #64748b; font-size: 13px; display: flex; gap: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background-color: #f8fafc; color: #475569; font-weight: bold; text-align: left; padding: 12px 15px; border: 1px solid #e2e8f0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
                td { padding: 10px 15px; border: 1px solid #e2e8f0; font-size: 13px; }
                tr:nth-child(even) { background-color: #fcfcfd; }
                .status-active { color: #15803d; font-weight: bold; }
                .status-inactive { color: #94a3b8; }
              </style>
            </head>
            <body>
              <header>
                <h1>Visa Records Export</h1>
                <div class="meta">
                  <span><strong>Generated:</strong> ${new Date().toLocaleString()}</span>
                  <span><strong>Scope:</strong> ${options.scope}</span>
                  <span><strong>Records:</strong> ${exportData.length}</span>
                </div>
              </header>
              <table>
                <thead>
                  <tr>
                    ${headers.map(h => `<th>${h}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${exportData.map(row => `
                    <tr>
                      ${headers.map(h => {
          const val = row[h] !== undefined ? row[h] : '';
          let className = '';
          if (h === 'Status') className = val === 'active' ? 'status-active' : 'status-inactive';
          return `<td class="${className}">${val}</td>`;
        }).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          setShowExportDialog(false);
        }, 500);

        toast.success(`Generated PDF report for ${exportData.length} records`);
      } else {
        // Handle CSV, JSON, XLSX via backend
        await visaService.exportVisas(options);
        toast.success(`Visa records exported successfully`);
        setShowExportDialog(false);
      }
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.message || "Failed to export visa records");
    }
  };
  const handleImport = async (data: any[], mode: any) => {
    console.log('Importing data:', data, 'mode:', mode);
    let successCount = 0;
    let failCount = 0;

    const loadingToast = toast.loading(`Importing visas (0/${data.length})...`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const payload = {
          visa_type: row.visa_type,
          category: row.category,
          countries_covered: Number(row.countries_covered) || 0,
          status: (row.status || 'Active').toLowerCase() as 'active' | 'inactive',
          processing_difficulty: row.processing_difficulty || 'Medium',
          student_visible: true // default
        };

        if (mode === 'update' && row.id) {
          await visaService.updateVisa(row.id, payload);
        } else {
          await visaService.createVisa(payload);
        }
        successCount++;
      } catch (error) {
        console.error(`Failed to import row ${i + 1}:`, error);
        failCount++;
      }
      toast.loading(`Importing visas (${successCount + failCount}/${data.length})...`, { id: loadingToast });
    }

    toast.dismiss(loadingToast);
    if (successCount > 0) {
      toast.success(`Import complete! ${successCount} successful, ${failCount} failed.`);
    } else {
      toast.error(`Import failed! All ${failCount} rows failed.`);
    }

    setShowImportDialog(false);
    fetchData();
  };


  return (
    <TooltipProvider>
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light scroll-smooth bg-[#fcfcfd]">
        {/* Header - Desktop Only */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-[#0e042f]">Visa Management</h1>
            <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors text-gray-500">
                    <CalendarIcon size={18} />
                    <span className="font-medium text-[14px]">{date?.from && date?.to ? `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}` : 'Select period'}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none" align="start">
                  <CalendarComponent initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
                </PopoverContent>
              </Popover>
              <div className="w-px h-4 bg-gray-200 mx-2" />
              <button onClick={() => fetchData()} className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500 text-gray-400">
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PermissionGuard module="services" action="export">
              <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium">
                <Download size={20} strokeWidth={1.5} />Export
              </button>
            </PermissionGuard>
            <PermissionGuard module="services" action="create">
              <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium">
                <Upload size={20} strokeWidth={1.5} />Import
              </button>
            </PermissionGuard>
            <PermissionGuard module="services" action="create">
              <button onClick={handleAddVisa} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/10 hover:bg-[#1a0c4a] transition-all hover:scale-[1.02] active:scale-[0.98] text-[16px] font-medium">
                <Plus size={20} strokeWidth={1.5} />Add Visa Type
              </button>
            </PermissionGuard>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metricConfigs.map((m, i) => <MetricCard key={i} {...m} />)}
        </div>
        <div className="block lg:hidden mb-14 -mx-4">
          <Slider dots infinite={false} speed={500} slidesToShow={1.1} slidesToScroll={1} arrows={false} centerMode centerPadding='20px'>
            {metricConfigs.map((m, i) => <div key={i} className="px-2 py-2"><MetricCard {...m} /></div>)}
          </Slider>
        </div>

        {/* Filters/Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 sticky top-0 md:relative bg-[#fcfcfd]/80 backdrop-blur-md md:backdrop-blur-none z-30 pt-4 md:pt-0">
          <div className="relative flex-1 w-full">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
            <input
              type="text"
              placeholder="Search visa types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-[50px] min-w-[120px] bg-white border-none shadow-sm rounded-xl px-4 font-medium text-gray-600 focus:ring-2 focus:ring-purple-200">
                <div className="flex items-center gap-2"><Filter size={16} /> <SelectValue placeholder="Status" /></div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-[50px] min-w-[160px] bg-white border-none shadow-sm rounded-xl px-4 font-medium text-gray-600 focus:ring-2 focus:ring-purple-200">
                <div className="flex items-center gap-2"><Award size={16} /> <SelectValue placeholder="Category" /></div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Study">Study</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Dependent">Dependent</SelectItem>
                <SelectItem value="Visitor">Visitor</SelectItem>
              </SelectContent>
            </Select>

            <Popover open={showColumnMenu} onOpenChange={setShowColumnMenu}>
              <PopoverTrigger asChild>
                <button className="w-[50px] h-[50px] shrink-0 bg-white border-none rounded-xl text-gray-500 hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center">
                  <Columns size={20} strokeWidth={1.5} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 rounded-2xl shadow-xl border-gray-100" align="end">
                <div className="p-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-2">Visible Columns</div>
                {allColumns.map(col => (
                  <button key={col.key} onClick={() => setVisibleColumns(prev => prev.includes(col.key) ? prev.filter(c => c !== col.key) : [...prev, col.key])} className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors text-sm font-medium text-gray-600">
                    {col.label} {visibleColumns.includes(col.key) && <Check size={16} className="text-purple-600" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            <button onClick={fetchData} className="w-[50px] h-[50px] shrink-0 bg-white border-none rounded-xl text-gray-500 hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center md:hidden">
              <RefreshCw size={20} strokeWidth={1.5} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Selection Banner */}
        {selectedVisas.length > 0 && (
          <div className="bg-[#0e042f] px-6 py-4 flex items-center justify-between text-sm shadow-xl animate-in slide-in-from-top-4 duration-300 rounded-2xl mb-6 ring-2 ring-purple-500/20">
            <div className="flex items-center gap-4">
              <span className="text-white font-bold">{selectedVisas.length} visa types selected</span>
              <div className="w-px h-4 bg-white/20" />
              <button onClick={() => setSelectedVisas([])} className="text-gray-300 hover:text-white transition-colors underline underline-offset-4">Clear selection</button>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-9 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-bold flex items-center gap-2">
                <Trash2 size={16} /> Delete Selected
              </button>
              <button className="h-9 px-4 bg-white text-[#0e042f] hover:bg-gray-100 rounded-lg transition-colors font-bold flex items-center gap-2">
                <Download size={16} /> Export Selected
              </button>
            </div>
          </div>
        )}

        {/* Data Table - Desktop */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]">
          {loading && <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[1px] flex items-center justify-center"><RefreshCw size={32} className="animate-spin text-purple-600 opacity-80" /></div>}

          <div className="hidden md:block overflow-x-auto custom-scrollbar-light">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-5 text-left w-12 border-b border-gray-100 sticky top-0 bg-white">
                    <CustomCheckbox
                      checked={visas.length > 0 && selectedVisas.length === visas.length}
                      partial={selectedVisas.length > 0 && selectedVisas.length < visas.length}
                      onChange={() => setSelectedVisas(selectedVisas.length === visas.length ? [] : visas.map(v => v.id.toString()))}
                    />
                  </th>
                  {visibleColumns.includes('id') && (
                    <th onClick={() => handleSort('visa_id')} className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 tracking-widest uppercase cursor-pointer hover:text-purple-600 transition-colors border-b border-gray-100 border-r border-gray-50/50">
                      <div className="flex items-center gap-2">Reference ID {sortConfig.field === 'visa_id' && (sortConfig.order === 'asc' ? <ArrowUpDown size={12} /> : <ArrowUpDown size={12} className="rotate-180" />)}</div>
                    </th>
                  )}
                  {visibleColumns.includes('type') && (
                    <th onClick={() => handleSort('visa_type')} className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 tracking-widest uppercase cursor-pointer hover:text-purple-600 transition-colors border-b border-gray-100 border-r border-gray-50/50">
                      <div className="flex items-center gap-2">Visa Type {sortConfig.field === 'visa_type' && (sortConfig.order === 'asc' ? <ArrowUpDown size={12} /> : <ArrowUpDown size={12} className="rotate-180" />)}</div>
                    </th>
                  )}
                  {visibleColumns.includes('category') && <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 tracking-widest uppercase border-b border-gray-100 border-r border-gray-50/50">Category</th>}
                  {visibleColumns.includes('countries') && <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 tracking-widest uppercase border-b border-gray-100 border-r border-gray-50/50 text-center">Countries</th>}
                  {visibleColumns.includes('status') && <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 tracking-widest uppercase border-b border-gray-100 border-r border-gray-50/50 text-center">Status</th>}
                  {visibleColumns.includes('difficulty') && <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 tracking-widest uppercase border-b border-gray-100 border-r border-gray-50/50 text-center">Difficulty</th>}
                  {visibleColumns.includes('visible') && <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 tracking-widest uppercase border-b border-gray-100 border-r border-gray-50/50 text-center">Visible</th>}
                  <th className="px-6 py-5 text-right text-[11px] font-bold text-gray-400 tracking-widest uppercase border-b border-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visas.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={10} className="py-20">
                      <div className="flex flex-col items-center gap-3 text-gray-300">
                        <div className="p-4 bg-gray-50 rounded-full"><Shield size={40} className="opacity-40" /></div>
                        <p className="text-sm font-medium">No visa types found matching your criteria</p>
                        <Button onClick={() => { setSearchTerm(''); setStatusFilter('All'); setCategoryFilter('All Categories'); }} variant="outline" className="mt-2 text-purple-600 border-purple-100 hover:bg-purple-50">Clear all filters</Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visas.map((visa) => (
                    <tr
                      key={visa.id}
                      onClick={() => onNavigate?.(`/services/visa/${visa.id}`)}
                      className={`cursor-pointer group hover:bg-purple-50/10 transition-colors transition-all ${selectedVisas.includes(visa.id.toString()) ? 'bg-purple-50/30 shadow-[inset_4px_0_0_0_#9333ea]' : ''}`}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <CustomCheckbox checked={selectedVisas.includes(visa.id.toString())} onChange={() => handleToggleSelect(visa.id.toString())} />
                      </td>
                      {visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#0e042f]">{visa.visa_id}</td>}
                      {visibleColumns.includes('type') && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-[#253154] group-hover:text-purple-700 transition-colors uppercase tracking-tight">{visa.visa_type}</span>
                            <span className="text-[10px] text-gray-400 font-medium italic">Ref: {visa.id}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.includes('category') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{visa.category}</td>}
                      {visibleColumns.includes('countries') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{visa.countries_covered}</td>}
                      {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm text-center"><StatusBadge status={visa.status} /></td>}
                      {visibleColumns.includes('difficulty') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center font-medium capitalize">{visa.processing_difficulty}</td>}
                      {visibleColumns.includes('visible') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {visa.student_visible ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold"><Eye size={12} /> Public</div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-bold"><EyeOff size={12} /> Hidden</div>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <PermissionGuard module="services" action="view">
                            <button
                              onClick={(e) => { e.stopPropagation(); onNavigate?.(`/services/visa/${visa.id}`); }}
                              className="p-2 hover:bg-purple-50 rounded-lg transition-colors group/view"
                              title="View Details"
                            >
                              <Eye size={18} className="text-gray-400 group-hover/view:text-purple-600" />
                            </button>
                          </PermissionGuard>
                          <PermissionGuard module="services" action="edit">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEditVisa(visa); }}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/edit"
                              title="Edit Visa Details"
                            >
                              <Edit size={18} className="text-gray-400 group-hover/edit:text-blue-600" />
                            </button>
                          </PermissionGuard>
                          <PermissionGuard module="services" action="delete">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteVisa(visa.id); }}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors group/delete"
                              title="Delete Pathway"
                            >
                              <Trash2 size={18} className="text-gray-400 group-hover/delete:text-red-600" />
                            </button>
                          </PermissionGuard>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Data Cards - Mobile */}
          <div className="md:hidden flex flex-col gap-3 p-4 bg-gray-50/30">
            {loading && visas.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 text-gray-400"><RefreshCw size={32} className="animate-spin opacity-20" /><p className="text-xs font-medium uppercase tracking-widest">Loading paths...</p></div>
            ) : visas.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 text-gray-300"><Shield size={40} className="opacity-20" /><p className="text-xs font-medium uppercase tracking-widest">No paths found</p></div>
            ) : (
              visas.map((visa) => (
                <MobileVisaCard
                  key={visa.id}
                  visa={visa}
                  isSelected={selectedVisas.includes(visa.id.toString())}
                  onToggleSelect={() => handleToggleSelect(visa.id.toString())}
                  onEdit={handleEditVisa}
                  onDelete={handleDeleteVisa}
                  onNavigate={onNavigate}
                />
              ))
            )}
          </div>

          {/* Pagination Footer */}
          <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 rounded-tr-[30px] shadow-[0px_-5px_25px_rgba(0,0,0,0.03)] relative z-20 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Rows per page:</span>
              <Popover open={showRowsMenu} onOpenChange={setShowRowsMenu}>
                <PopoverTrigger asChild>
                  <button className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-100 bg-white hover:border-purple-200 transition-colors flex items-center justify-center gap-2 text-sm font-bold text-gray-700">
                    {rowsPerPage} <ChevronDown size={14} className="text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-24 p-1 rounded-xl shadow-xl border-gray-100" align="center">
                  {[10, 20, 50, 100].map((num) => (
                    <button
                      key={num}
                      onClick={() => { setRowsPerPage(num); setCurrentPage(1); setShowRowsMenu(false); }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-bold text-left transition-colors ${rowsPerPage === num ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {num} Rows
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">
                Page <span className="text-purple-600 font-black">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-white hover:shadow-md hover:border-purple-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 hover:text-purple-600">
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0 || loading} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-white hover:shadow-md hover:border-purple-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 hover:text-purple-600">
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddVisaDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleSaveVisa}
        mode={dialogMode}
        initialData={editingVisa}
      />

      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Visa" totalCount={totalCount} selectedCount={selectedVisas.length} columns={exportColumns} supportsDateRange={true} onExport={handleExport} />

      <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Visa" fields={importFields} onImport={handleImport} templateUrl="/templates/visa-import-template.xlsx" allowUpdate={true} />

    </TooltipProvider>
  );
};