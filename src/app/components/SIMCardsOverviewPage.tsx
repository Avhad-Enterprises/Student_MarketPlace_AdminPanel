"use client";

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { getAllSimCards, getSimMetrics, createSimCard, updateSimCard, deleteSimCard, SimCard as SimCardType } from '@/app/services/simCardsService';
import {
  Calendar as CalendarIcon,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Trash2,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  Search,
  Copy,
  Printer,
  Archive,
  Edit,
  Check,
  Columns,
  Eye,
  Power,
  Globe,
  Users,
  Smartphone,
  Signal,
  MapPin
} from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { GlobalDateFilter } from './common/GlobalDateFilter';
import Slider from "react-slick";

import { ServicePageHeader } from './service-marketplace/ServicePageHeader';
import { ServiceMetricGrid } from './service-marketplace/ServiceMetricGrid';
import { CustomCheckbox, StatusBadge } from './service-marketplace/CommonUI';

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { AddSIMCardDialog } from './common/AddSIMCardDialog';
import { PermissionGuard } from './common/PermissionGuard';

// --- Shared Components Extracted ---

const MetricCard: React.FC<{ title: string; value: string; icon: React.ElementType; bgClass: string; colorClass: string; tooltip: string }> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
    <div className="flex items-center justify-between">
      <span className="text-[#253154] font-medium text-[15px]">{title}</span>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help transition-colors">
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

const MobileSIMCard: React.FC<{
  sim: any;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: (sim: any) => void;
  onDelete: (id: string) => void;
  onView: () => void;
}> = ({ sim, isSelected, onToggleSelect, onEdit, onDelete, onView }) => {
  return (
    <div className={`bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 w-full transition-all active:scale-[0.99] flex flex-col gap-3 ${isSelected ? 'bg-purple-50/30 border-purple-200' : ''}`}>
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <CustomCheckbox checked={isSelected} onChange={onToggleSelect} />
          <div className="flex-1">
            <h3
              onClick={(e) => { e.stopPropagation(); onView(); }}
              className="font-bold text-[#253154] text-base cursor-pointer hover:text-purple-600 hover:underline"
            >
              {sim.provider_name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{sim.service_name}</p>
            <p className="text-xs text-gray-400 mt-1 font-medium">{sim.sim_id}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="transform scale-90 origin-right">
            <StatusBadge status={sim.status} />
          </div>
          <div className="text-[10px] text-gray-400 font-medium">{sim.countries_covered} Countries</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-50 border-dashed">
        <div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Network</div>
          <div className="text-xs text-gray-700 font-medium truncate">{sim.network_type}</div>
        </div>
        <div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Data Allowance</div>
          <div className="text-xs text-gray-700 font-medium truncate">{sim.data_allowance}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(sim); }}
            className="w-full h-10 bg-white border border-gray-100 text-[#253154] rounded-xl hover:bg-gray-50 transition-colors font-medium text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(sim.id); }}
            className="w-full h-10 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors font-medium text-xs flex items-center justify-center gap-2"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export const SIMCardsOverviewPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  // State management
  const [date, setDate] = useState<DateRange | undefined>({ from: subDays(new Date(), 29), to: new Date() });
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search'>('none');
  const [selectedSIMs, setSelectedSIMs] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'provider', 'service', 'countries', 'status', 'network', 'visible']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSIMs, setTotalSIMs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Table functionality states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [filterNetwork, setFilterNetwork] = useState('All Networks');
  const [filterVisibility, setFilterVisibility] = useState<'All' | 'Visible' | 'Hidden'>('All');

  // Data states
  const [sims, setSims] = useState<SimCardType[]>([]);
  const [metricsData, setMetricsData] = useState<any>(null);

  // Dialog states
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSIM, setEditingSIM] = useState<SimCardType | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: rowsPerPage,
        search: debouncedSearch || undefined,
        sort: sortField,
        order: sortOrder
      };

      if (filterStatus !== 'All') params.status = filterStatus.toLowerCase();
      if (filterNetwork !== 'All Networks') params.network_type = filterNetwork;
      if (filterVisibility === 'Visible') params.student_visible = true;
      if (filterVisibility === 'Hidden') params.student_visible = false;

      const [simsResult, metricsResult] = await Promise.all([
        getAllSimCards(params),
        getSimMetrics()
      ]);

      setSims(simsResult.data);
      setTotalSIMs(simsResult.pagination.total);
      setTotalPages(simsResult.pagination.totalPages);
      setMetricsData(metricsResult.data);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.response?.data?.message || "Failed to fetch SIM cards data";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, debouncedSearch, sortField, sortOrder, filterStatus, filterNetwork, filterVisibility]);

  // Metrics data
  const metrics = metricsData ? [
    {
      title: 'Total SIM Providers',
      value: metricsData.totalProviders.toString(),
      icon: Smartphone,
      bgClass: 'bg-purple-50',
      colorClass: 'text-purple-600',
      tooltip: 'Total number of SIM card providers'
    },
    {
      title: 'Active SIM Plans',
      value: metricsData.activePlans.toString(),
      icon: Signal,
      bgClass: 'bg-blue-50',
      colorClass: 'text-blue-600',
      tooltip: 'Currently active SIM card plans'
    },
    {
      title: 'Countries Covered',
      value: metricsData.countriesCovered.toString(),
      icon: Globe,
      bgClass: 'bg-green-50',
      colorClass: 'text-green-600',
      tooltip: 'Number of countries with SIM coverage'
    },
    {
      title: 'Most Selected SIM',
      value: metricsData.mostPopular,
      icon: Users,
      bgClass: 'bg-amber-50',
      colorClass: 'text-amber-600',
      tooltip: 'Most popular SIM provider among students'
    }
  ] : [];

  // Column configuration
  const allColumns = [
    { key: 'id', label: 'Reference ID' },
    { key: 'provider', label: 'Provider Name' },
    { key: 'service', label: 'Service Name' },
    { key: 'countries', label: 'Country Availability' },
    { key: 'status', label: 'Status' },
    { key: 'network', label: 'Network Type' },
    { key: 'data', label: 'Data Allowance' },
    { key: 'validity', label: 'Validity Period' },
    { key: 'visible', label: 'Student Visibility' },
    { key: 'popularity', label: 'Popularity' },
    { key: 'updated', label: 'Last Updated' }
  ];

  // Handlers
  const handleRefresh = () => {
    fetchData();
    toast.success("Refreshing data...");
  };

  const handleAddSIM = () => {
    if (onNavigate) {
      onNavigate('/services/sim-cards/add');
    } else {
      setDialogMode('add');
      setEditingSIM(null);
      setShowAddDialog(true);
    }
  };

  const handleEditSIM = (sim: SimCardType) => {
    setDialogMode('edit');
    setEditingSIM(sim);
    setShowAddDialog(true);
  };

  const handleDeleteSIM = async (id: string) => {
    if (!confirm("Are you sure you want to delete this SIM card?")) return;

    try {
      await deleteSimCard(id);
      toast.success("SIM card deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete SIM card");
    }
  };

  const handleSaveSIM = async (data: any) => {
    try {
      if (dialogMode === 'edit' && editingSIM) {
        await updateSimCard(editingSIM.id, data);
      } else {
        await createSimCard(data);
      }
      fetchData();
    } catch (error) {
      throw error; // Let the dialog handle the toast error from the response
    }
  };

  const handleSelectAll = () => {
    if (selectedSIMs.length === sims.length) {
      setSelectedSIMs([]);
      setSelectAllStore(false);
    } else {
      setSelectedSIMs(sims.map(s => s.id));
      setSelectAllStore(false);
    }
  };

  const handleToggleSIM = (simId: string) => {
    setSelectedSIMs(prev =>
      prev.includes(simId)
        ? prev.filter(id => id !== simId)
        : [...prev, simId]
    );
  };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedSIMs(sims.map(s => s.id));
  };

  const handleClearSelection = () => {
    setSelectedSIMs([]);
    setSelectAllStore(false);
  };

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(k => k !== columnKey)
        : [...prev, columnKey]
    );
  };

  // Slick settings for mobile carousel
  const slickSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1.1,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: '20px'
  };

  // Export/Import configuration
  const exportColumns: ExportColumn[] = [
    { id: 'id', label: 'Database ID', defaultSelected: false },
    { id: 'referenceId', label: 'Reference ID', defaultSelected: true },
    { id: 'providerName', label: 'Provider Name', defaultSelected: true },
    { id: 'serviceName', label: 'Service Name', defaultSelected: true },
    { id: 'countries', label: 'Country Availability', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'networkType', label: 'Network Type', defaultSelected: false },
    { id: 'dataAllowance', label: 'Data Allowance', defaultSelected: false },
    { id: 'validity', label: 'Validity Period', defaultSelected: false },
    { id: 'studentVisible', label: 'Student Visibility', defaultSelected: false },
    { id: 'popularity', label: 'Popularity', defaultSelected: false }
  ];


  const importFields: ImportField[] = [
    { id: 'id', label: 'Database ID (For Updates)', required: false, type: 'text' },
    { id: 'referenceId', label: 'Reference ID', required: false, type: 'text' },
    { id: 'providerName', label: 'Provider Name', required: true, type: 'text' },
    { id: 'serviceName', label: 'Service Name', required: true, type: 'text' },
    { id: 'countries', label: 'Country Availability', required: true, type: 'text' },
    { id: 'status', label: 'Status', required: false, type: 'select', options: ['Active', 'Inactive'] },
    { id: 'networkType', label: 'Network Type', required: false, type: 'select', options: ['3G', '4G', '4G/5G', '5G'] },
    { id: 'dataAllowance', label: 'Data Allowance', required: false, type: 'text' },
    { id: 'validity', label: 'Validity Period', required: false, type: 'text' },
    { id: 'studentVisible', label: 'Student Visibility', required: false, type: 'select', options: ['Yes', 'No'] }
  ];


  const handleExport = async (options: any) => {
    try {
      setIsLoading(true);
      toast.info(`Preparing ${options.scope} export...`);

      let dataToExport: any[] = [];

      // 1. Get raw data based on scope
      if (options.scope === 'all') {
        const result = await getAllSimCards({ limit: 1000 }); // High limit for export
        dataToExport = result.data;
      } else if (options.scope === 'selected') {
        dataToExport = sims.filter(sim => selectedSIMs.includes(sim.id.toString()));
      } else {
        dataToExport = sims; // current view
      }

      if (dataToExport.length === 0) {
        toast.error("No data found to export");
        return;
      }

      // 2. Map data to friendly labels and filter by selected columns
      const mappedData = dataToExport.map(sim => {
        const row: any = {};
        options.selectedColumns.forEach((colId: string) => {
          switch (colId) {
            case 'id': row['Database ID'] = sim.id; break;
            case 'referenceId': row['Reference ID'] = sim.sim_id; break;
            case 'providerName': row['Provider Name'] = sim.provider_name; break;
            case 'serviceName': row['Service Name'] = sim.service_name; break;
            case 'countries': row['Countries Coverage'] = sim.countries_covered; break;
            case 'status': row['Status'] = sim.status; break;
            case 'networkType': row['Network'] = sim.network_type; break;
            case 'dataAllowance': row['Data'] = sim.data_allowance; break;
            case 'validity': row['Validity'] = sim.validity; break;
            case 'studentVisible': row['Student Visible'] = sim.student_visible ? 'Yes' : 'No'; break;
            case 'popularity': row['Popularity'] = sim.popularity; break;
            default: break;
          }
        });

        return row;
      });

      // 3. Handle specific formats
      if (options.format === 'json') {
        const blob = new Blob([JSON.stringify(mappedData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sim_cards_export_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Use XLSX for CSV and XLSX
        const worksheet = XLSX.utils.json_to_sheet(mappedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "SIM Cards");

        if (options.format === 'xlsx') {
          XLSX.writeFile(workbook, `sim_cards_export_${new Date().getTime()}.xlsx`);
        } else if (options.format === 'csv') {
          XLSX.writeFile(workbook, `sim_cards_export_${new Date().getTime()}.csv`, { bookType: 'csv' });
        } else if (options.format === 'pdf') {
          toast.warning("PDF export is currently being generated as Excel. For best results, print the Excel file to PDF.");
          XLSX.writeFile(workbook, `sim_cards_export_${new Date().getTime()}.xlsx`);
        }
      }

      toast.success(`${options.scope.charAt(0).toUpperCase() + options.scope.slice(1)} SIM cards exported successfully`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export SIM cards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (data: any[], mode: any) => {
    console.log('Importing data:', data, 'mode:', mode);
    let successCount = 0;
    let failCount = 0;

    const loadingToast = toast.loading(`Importing SIM cards (0/${data.length})...`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const payload = {
          sim_id: row.referenceId || '',
          provider_name: row.providerName,
          service_name: row.serviceName,
          countries_covered: Number(row.countries) || 0,
          status: (row.status || 'Active').toLowerCase() as 'active' | 'inactive',
          network_type: row.networkType || '4G/5G',
          data_allowance: row.dataAllowance || '',
          validity: row.validity || '',
          student_visible: row.studentVisible === 'Yes' ? true : false,
          popularity: 0
        };

        if (mode === 'update' && row.id) {
          await updateSimCard(row.id, payload);
        } else {
          await createSimCard(payload);
        }
        successCount++;
      } catch (error) {
        console.error(`Failed to import row ${i + 1}:`, error);
        failCount++;
      }
      toast.loading(`Importing SIM cards (${successCount + failCount}/${data.length})...`, { id: loadingToast });
    }

    toast.dismiss(loadingToast);
    if (successCount > 0) {
      toast.success(`Import complete! ${successCount} successful, ${failCount} failed.`);
    } else {
      toast.error(`Import failed! All ${failCount} rows failed.`);
    }

    setShowImportDialog(false);
    if (typeof fetchData === 'function') {
      fetchData();
    }
  };


  return (
    <TooltipProvider>
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">

        <ServicePageHeader 
          title="SIM Cards" 
          dateRange={date} 
          onDateChange={setDate}
          onRefresh={handleRefresh}
          actions={
            <div className="flex items-center gap-3">
              <PermissionGuard module="services" action="export">
                <button
                  onClick={() => setShowExportDialog(true)}
                  className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"
                >
                  <Download size={20} strokeWidth={1.5} />Export
                </button>
              </PermissionGuard>
              <PermissionGuard module="services" action="create">
                <button
                  onClick={() => setShowImportDialog(true)}
                  className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"
                >
                  <Upload size={20} strokeWidth={1.5} />Import
                </button>
              </PermissionGuard>
              <PermissionGuard module="services" action="create">
                <button
                  onClick={handleAddSIM}
                  className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"
                >
                  <Plus size={20} strokeWidth={1.5} />Add SIM
                </button>
              </PermissionGuard>
            </div>
          }
        />

        {/* Metrics Section */}
        <ServiceMetricGrid metrics={metrics} />

        {/* Desktop Search & Filter Bar */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input
              type="text"
              placeholder="Search by provider name, service name, reference ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>

          {/* Filter/Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFilterMenu(!showFilterMenu);
                  setShowSortMenu(false);
                  setShowColumnMenu(false);
                  setShowMoreMenu(false);
                }}
                className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <Filter size={20} strokeWidth={1.5} />
              </button>

              {showFilterMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Status</div>
                    {['All', 'Active', 'Inactive'].map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status as any);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-sm text-left flex items-center justify-between ${filterStatus === status ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {status}
                        {filterStatus === status && <Check size={14} />}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-1" />
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Network Type</div>
                    {['All Networks', '5G', '4G/5G', '4G', '3G'].map(network => (
                      <button
                        key={network}
                        onClick={() => {
                          setFilterNetwork(network);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-sm text-left flex items-center justify-between ${filterNetwork === network ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {network}
                        {filterNetwork === network && <Check size={14} />}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-1" />
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Student Visibility</div>
                    {['All', 'Visible', 'Hidden'].map(vis => (
                      <button
                        key={vis}
                        onClick={() => {
                          setFilterVisibility(vis as any);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-sm text-left flex items-center justify-between ${filterVisibility === vis ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {vis}
                        {filterVisibility === vis && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sort Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSortMenu(!showSortMenu);
                  setShowFilterMenu(false);
                  setShowColumnMenu(false);
                  setShowMoreMenu(false);
                }}
                className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <ArrowUpDown size={20} strokeWidth={1.5} />
              </button>

              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Sort By</div>
                    {[
                      { label: 'Popularity', field: 'popularity' },
                      { label: 'Country Coverage', field: 'countries_covered' },
                      { label: 'Last Updated', field: 'updated_at' },
                      { label: 'Alphabetical', field: 'provider_name' }
                    ].map(option => (
                      <button
                        key={option.field}
                        onClick={() => {
                          if (sortField === option.field) {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField(option.field);
                            setSortOrder('desc');
                          }
                          setShowSortMenu(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-sm text-left flex items-center justify-between ${sortField === option.field ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <span>{option.label}</span>
                        {sortField === option.field && (
                          sortOrder === 'desc' ? <ArrowDown size={16} /> : <ArrowDown size={16} className="rotate-180" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Columns Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowColumnMenu(!showColumnMenu);
                  setShowFilterMenu(false);
                  setShowSortMenu(false);
                  setShowMoreMenu(false);
                }}
                className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <Columns size={20} strokeWidth={1.5} />
              </button>

              {showColumnMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowColumnMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Show Columns</div>
                    {allColumns.map(column => (
                      <div
                        key={column.key}
                        onClick={() => handleToggleColumn(column.key)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <CustomCheckbox
                          checked={visibleColumns.includes(column.key)}
                          onChange={() => { }}
                        />
                        <span className="text-sm text-gray-700">{column.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* More Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowMoreMenu(!showMoreMenu);
                  setShowFilterMenu(false);
                  setShowSortMenu(false);
                  setShowColumnMenu(false);
                }}
                className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <MoreHorizontal size={20} strokeWidth={1.5} />
              </button>

              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-48 animate-in fade-in zoom-in-95 duration-200">
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Copy size={16} />
                      Copy
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Printer size={16} />
                      Print
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Archive size={16} />
                      Archive Selected
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mb-6 flex gap-3">
          <div className="flex-1 h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center px-5 gap-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search SIM cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-full border-none focus:ring-0 text-sm bg-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setActiveMobileMenu(activeMobileMenu === 'search' ? 'none' : 'search')}
            className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center"
          >
            <MoreHorizontal size={22} className="text-[#253154]" />
          </button>
        </div>

        {/* Mobile Bottom Sheets */}
        {activeMobileMenu === 'import' && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-40 transition-opacity"
              onClick={() => setActiveMobileMenu('none')}
            />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[30px] z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl custom-scrollbar-light">
              <div className="p-6 flex flex-col gap-6">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-2" />
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Actions</div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setShowExportDialog(true);
                        setActiveMobileMenu('none');
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700"
                    >
                      <Download size={18} />
                      <span className="font-medium">Export Data</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowImportDialog(true);
                        setActiveMobileMenu('none');
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700"
                    >
                      <Upload size={18} />
                      <span className="font-medium">Import Data</span>
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMobileMenu('none')}
                  className="mt-2 w-full bg-gray-100 text-gray-900 font-medium py-4 rounded-2xl"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {activeMobileMenu === 'search' && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-40 transition-opacity"
              onClick={() => setActiveMobileMenu('none')}
            />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[30px] z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl custom-scrollbar-light">
              <div className="p-6 flex flex-col gap-6">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-2" />
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filter by Status</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', 'Active', 'Inactive'].map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status as any);
                          setActiveMobileMenu('none');
                        }}
                        className={`border rounded-full text-sm font-medium px-2 py-2 transition-colors ${filterStatus === status ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-full h-px bg-gray-100" />
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sort By</div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: 'Popularity', field: 'popularity' },
                      { label: 'Country Coverage', field: 'countries_covered' },
                      { label: 'Last Updated', field: 'updated_at' }
                    ].map(option => (
                      <button
                        key={option.field}
                        onClick={() => {
                          if (sortField === option.field) {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField(option.field);
                            setSortOrder('desc');
                          }
                          setActiveMobileMenu('none');
                        }}
                        className={`p-3 rounded-xl flex items-center justify-between transition-colors ${sortField === option.field ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        <span className="font-medium">{option.label}</span>
                        {sortField === option.field ? (
                          sortOrder === 'desc' ? <ArrowDown size={16} /> : <ArrowDown size={16} className="rotate-180" />
                        ) : (
                          <ArrowDown size={16} className="text-gray-400 opacity-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setActiveMobileMenu('none')}
                  className="mt-2 w-full bg-gray-100 text-gray-900 font-medium py-4 rounded-2xl"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {/* Selection Banner */}
        {selectedSIMs.length > 0 && (
          <div className="bg-purple-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm border-b border-purple-100 mb-6 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <span className="text-purple-900 font-medium">{selectedSIMs.length} SIM card{selectedSIMs.length !== 1 ? 's' : ''} selected</span>
              {selectedSIMs.length === sims.length && !selectAllStore && (
                <>
                  <span className="text-purple-700">•</span>
                  <button onClick={handleSelectAllStore} className="text-purple-700 font-bold hover:underline">
                    Select all 156 SIM cards
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="text-purple-700 font-bold hover:underline">Enable/Disable</button>
              <button className="text-purple-700 font-bold hover:underline">Update Countries</button>
              <button onClick={() => setShowExportDialog(true)} className="text-purple-700 font-bold hover:underline">Export Selected</button>
              <button onClick={handleClearSelection} className="text-purple-700 font-bold hover:underline">Clear</button>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12">
                    <CustomCheckbox
                      checked={selectedSIMs.length === sims.length}
                      partial={selectedSIMs.length > 0 && selectedSIMs.length < sims.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {visibleColumns.includes('id') && (
                    <th
                      onClick={() => {
                        if (sortField === 'sim_id') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        else { setSortField('sim_id'); setSortOrder('asc'); }
                      }}
                      className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        Reference ID
                        {sortField === 'sim_id' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes('provider') && (
                    <th
                      onClick={() => {
                        if (sortField === 'provider_name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        else { setSortField('provider_name'); setSortOrder('asc'); }
                      }}
                      className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        Provider
                        {sortField === 'provider_name' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes('service') && (
                    <th
                      onClick={() => {
                        if (sortField === 'service_name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        else { setSortField('service_name'); setSortOrder('asc'); }
                      }}
                      className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        Service Name
                        {sortField === 'service_name' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes('countries') && (
                    <th
                      onClick={() => {
                        if (sortField === 'countries_covered') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        else { setSortField('countries_covered'); setSortOrder('desc'); }
                      }}
                      className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        Countries
                        {sortField === 'countries_covered' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Status</th>}
                  {visibleColumns.includes('network') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Network</th>}
                  {visibleColumns.includes('data') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Data</th>}
                  {visibleColumns.includes('validity') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Validity</th>}
                  {visibleColumns.includes('visible') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visible</th>}
                  {visibleColumns.includes('popularity') && (
                    <th
                      onClick={() => {
                        if (sortField === 'popularity') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        else { setSortField('popularity'); setSortOrder('desc'); }
                      }}
                      className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        Popularity
                        {sortField === 'popularity' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes('updated') && (
                    <th
                      onClick={() => {
                        if (sortField === 'updated_at') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        else { setSortField('updated_at'); setSortOrder('desc'); }
                      }}
                      className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        Last Updated
                        {sortField === 'updated_at' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                  )}
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                    {sims.length > 0 ? (
                      sims.map((sim, index) => (
                        <tr
                          key={sim.id}
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedSIMs.includes(sim.id.toString()) ? 'bg-purple-50/30 font-medium' : ''}`}
                          onClick={() => onNavigate?.(`/services/sim-cards/${sim.id}`)}
                        >
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <CustomCheckbox
                              checked={selectedSIMs.includes(sim.id.toString())}
                              onChange={() => handleToggleSIM(sim.id.toString())}
                            />
                          </td>

                          {visibleColumns.includes('id') && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{sim.sim_id}</td>
                          )}

                          {visibleColumns.includes('provider') && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-700 font-bold underline decoration-purple-200 decoration-2 underline-offset-4 decoration-skip-ink">
                                {sim.provider_name}
                              </span>
                            </td>
                          )}

                          {visibleColumns.includes('service') && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{sim.service_name}</td>
                          )}

                          {visibleColumns.includes('countries') && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{sim.countries_covered} Countries</td>
                          )}

                          {visibleColumns.includes('status') && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={sim.status} /></td>
                          )}

                          {visibleColumns.includes('network') && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{sim.network_type}</td>
                          )}

                          {visibleColumns.includes('data') && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{sim.data_allowance}</td>
                          )}

                          {visibleColumns.includes('validity') && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{sim.validity}</td>
                          )}

                          {visibleColumns.includes('visible') && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {sim.student_visible ?
                                <span className="flex items-center gap-1.5 text-green-600 font-medium"><Check size={14} strokeWidth={3} /> Visible</span> :
                                <span className="flex items-center gap-1.5 text-gray-400 font-medium"><Power size={14} /> Hidden</span>
                              }
                            </td>
                          )}

                          {visibleColumns.includes('popularity') && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{sim.popularity}</td>
                          )}

                          {visibleColumns.includes('updated') && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                              {sim.updated_at ? format(new Date(sim.updated_at), 'MMM dd, yyyy') : 'N/A'}
                            </td>
                          )}

                          <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => { e.stopPropagation(); }}>
                            <div className="flex items-center justify-end gap-2">
                              <PermissionGuard module="services" action="view">
                                <button
                                  onClick={(e) => { e.stopPropagation(); onNavigate?.(`/services/sim-cards/${sim.id}`); }}
                                  className="p-2 hover:bg-purple-50 rounded-lg transition-colors group/view"
                                  title="View Details"
                                >
                                  <Eye size={18} className="text-gray-400 group-hover/view:text-purple-600" />
                                </button>
                              </PermissionGuard>
                              <PermissionGuard module="services" action="edit">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEditSIM(sim); }}
                                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/edit"
                                  title="Edit SIM Card"
                                >
                                  <Edit size={18} className="text-gray-400 group-hover/edit:text-blue-600" />
                                </button>
                              </PermissionGuard>
                              <PermissionGuard module="services" action="delete">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeleteSIM(sim.id); }}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors group/delete"
                                  title="Delete"
                                >
                                  <Trash2 size={18} className="text-gray-400 group-hover/delete:text-red-600" />
                                </button>
                              </PermissionGuard>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={visibleColumns.length + 2} className="px-6 py-24 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                              <Smartphone size={24} className="text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">No results found</p>
                            <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                              We couldn't find any SIM cards matching your filters.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-3 p-4">
            {sims.length > 0 ? (
              sims.map((sim) => (
                <MobileSIMCard
                  key={sim.id}
                  sim={sim}
                  isSelected={selectedSIMs.includes(sim.id.toString())}
                  onToggleSelect={() => handleToggleSIM(sim.id.toString())}
                  onEdit={handleEditSIM}
                  onDelete={handleDeleteSIM}
                  onView={() => onNavigate?.('simcard-provider-detail')}
                />
              ))
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <Smartphone size={24} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No data available</p>
                <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                  There are no SIM cards matching your current filters.
                </p>
              </div>
            )}
          </div>

          {/* Pagination Bar */}
          {sims.length > 0 && (
            <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 border-t border-gray-50 relative z-20">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm font-medium">Rows per page:</span>
                <div className="relative">
                  <button
                    onClick={() => setShowRowsMenu(!showRowsMenu)}
                    className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
                  >
                    {rowsPerPage}
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {showRowsMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowRowsMenu(false)} />
                      <div className="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-xl border border-gray-100 z-20 p-1 animate-in slide-in-from-bottom-1 duration-200">
                        {[5, 10, 25, 50].map(rows => (
                          <button
                            key={rows}
                            onClick={() => {
                              setRowsPerPage(rows);
                              setShowRowsMenu(false);
                            }}
                            className={`w-full px-3 py-1.5 text-xs font-medium rounded ${rowsPerPage === rows
                              ? 'bg-purple-50 text-purple-700'
                              : 'text-gray-600 hover:bg-gray-50'
                              }`}
                          >
                            {rows}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center disabled:opacity-50">
                  <ChevronLeft size={18} strokeWidth={2} className="text-gray-500" />
                </button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center disabled:opacity-50">
                  <ChevronRight size={18} strokeWidth={2} className="text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="SIM Cards"
        totalCount={totalSIMs}
        selectedCount={selectedSIMs.length}
        columns={exportColumns}
        supportsDateRange={false}
        onExport={handleExport}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="SIM Cards"
        fields={importFields}
        onImport={handleImport}
        templateUrl="/templates/sim-cards-import-template.xlsx"
        allowUpdate={true}
      />
      {/* Add/Edit SIM Dialog */}
      <AddSIMCardDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleSaveSIM}
        initialData={editingSIM}
        mode={dialogMode}
      />
    </TooltipProvider>
  );
};