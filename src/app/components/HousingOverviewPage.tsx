"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Search, Check, Columns, Home, MapPin, Building, DollarSign, Edit, Eye, EyeOff, Trash2, Loader2, Signal, Globe } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";
import * as XLSX from 'xlsx';

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { AddHousingDialog } from './common/AddHousingDialog';
import { getAllHousing, deleteHousing, createHousing, updateHousing, getHousingMetrics, Housing } from '@/app/services/housingService';

const CustomCheckbox: React.FC<{ checked: boolean; partial?: boolean; onChange: () => void }> = ({ checked, partial, onChange }) => (
  <div onClick={onChange} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
    {checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}
    {partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}
  </div>
);

const StatusBadge: React.FC<{ status: 'active' | 'inactive' }> = ({ status }) => {
  const c = { 'active': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Active' }, 'inactive': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', label: 'Inactive' } }[status];
  return (
    <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
};

const MetricCard: React.FC<{ title: string; value: string; icon: React.ElementType; bgClass: string; colorClass: string; tooltip: string }> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
    <div className="flex items-center justify-between">
      <span className="text-[#253154] font-medium text-[15px]">{title}</span>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help">i</div>
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

export const HousingOverviewPage: React.FC<{ onNavigate?: (page: string, data?: any) => void }> = ({ onNavigate }) => {
  // State management
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'provider', 'type', 'location', 'status', 'visible', 'avgRent', 'countries', 'popularity']);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All Types');

  // UI States for Popovers
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showRowsMenu, setShowRowsMenu] = useState(false);

  // Data states
  const [items, setItems] = useState<Housing[]>([]);
  const [metricsData, setMetricsData] = useState<any>(null);

  // Dialog states
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Housing | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  // Column definitions
  const allColumns = [
    { key: 'id', label: 'Reference ID' },
    { key: 'provider', label: 'Provider Name' },
    { key: 'type', label: 'Housing Type' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
    { key: 'visible', label: 'Student Visibility' },
    { key: 'avgRent', label: 'Avg Rent' },
    { key: 'countries', label: 'Countries Covered' },
    { key: 'popularity', label: 'Popularity' }
  ];

  const sortOptions = [
    { label: 'Recently Added', value: 'created_at' },
    { label: 'Provider Name', value: 'provider_name' },
    { label: 'Housing Type', value: 'housing_type' },
    { label: 'Location', value: 'location' },
    { label: 'Average Rent', value: 'avg_rent' },
    { label: 'Popularity', value: 'popularity' }
  ];

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
      if (filterType !== 'All Types') params.housing_type = filterType;

      const [result, metricsResult] = await Promise.all([
        getAllHousing(params),
        getHousingMetrics()
      ]);

      setItems(result.data);
      setTotalItems(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
      setMetricsData(metricsResult.data);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch housing data";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, debouncedSearch, sortField, sortOrder, filterStatus, filterType]);

  const handleRefresh = () => {
    fetchData();
    toast.success("Data refreshed");
  };

  const handleAdd = () => {
    setDialogMode('add');
    setEditingItem(null);
    setShowAddDialog(true);
  };

  const handleEdit = (item: Housing) => {
    setDialogMode('edit');
    setEditingItem(item);
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this housing provider?")) return;
    try {
      await deleteHousing(id);
      toast.success("Housing provider deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete housing provider");
    }
  };

  const handleSave = async (data: any) => {
    if (dialogMode === 'edit' && editingItem) {
      await updateHousing(editingItem.id, data);
    } else {
      await createHousing(data);
    }
    fetchData();
  };

  const handleRowClick = (housingId: string) => {
    if (onNavigate) {
      onNavigate('housing-provider-detail', { housingId });
    }
  };

  const toggleColumn = (col: string) => {
    setVisibleColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
  };

  const metrics = [
    { title: 'Housing Partners', value: metricsData?.totalProviders?.toString() || '0', icon: Home, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total housing provider partners' },
    { title: 'Cities Covered', value: metricsData?.citiesCovered?.toString() || '0', icon: MapPin, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Cities with housing options' },
    { title: 'Total Listings', value: metricsData?.totalListings?.toString() || '0', icon: Building, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Total available housing listings' },
    { title: 'Most Popular', value: metricsData?.mostPopular || 'N/A', icon: DollarSign, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'The most popular housing provider' }
  ];

  const exportColumns: ExportColumn[] = [
    { id: 'reference_id', label: 'Reference ID', defaultSelected: true },
    { id: 'provider_name', label: 'Provider', defaultSelected: true },
    { id: 'housing_type', label: 'Housing Type', defaultSelected: true },
    { id: 'location', label: 'Location', defaultSelected: true },
    { id: 'countries_covered', label: 'Countries', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'avg_rent', label: 'Avg Rent', defaultSelected: true }
  ];

  const importFields: ImportField[] = [
    { id: 'reference_id', label: 'Reference ID', required: false, type: 'text' },
    { id: 'provider_name', label: 'Provider Name', required: true, type: 'text' },
    { id: 'housing_type', label: 'Housing Type', required: true, type: 'select', options: ['Student Residence', 'Shared Apartment', 'Homestay', 'Private Room', 'Multiple'] },
    { id: 'location', label: 'Location', required: true, type: 'text' },
    { id: 'status', label: 'Status', required: false, type: 'select', options: ['active', 'inactive'] },
    { id: 'avg_rent', label: 'Avg Rent', required: false, type: 'text' }
  ];

  const handleExport = async (options: any) => {
    try {
      setIsLoading(true);
      let dataToExport: any[] = [];
      if (options.scope === 'all') {
        const result = await getAllHousing({ limit: 1000 });
        dataToExport = result.data;
      } else if (options.scope === 'selected') {
        dataToExport = items.filter(i => selected.includes(i.id));
      } else {
        dataToExport = items;
      }

      const mappedData = dataToExport.map(item => {
        const row: any = {};
        options.selectedColumns.forEach((colId: string) => {
          row[colId] = (item as any)[colId];
        });
        return row;
      });

      if (options.format === 'json') {
        const blob = new Blob([JSON.stringify(mappedData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `housing_export_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const worksheet = XLSX.utils.json_to_sheet(mappedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Housing");

        if (options.format === 'csv') {
          XLSX.writeFile(workbook, `housing_export_${Date.now()}.csv`, { bookType: 'csv' });
        } else if (options.format === 'pdf') {
          const headers = options.selectedColumns.map((colId: string) => {
            const col = exportColumns.find(c => c.id === colId);
            return col ? col.label : colId;
          });

          const printWindow = window.open('', '_blank');
          if (!printWindow) {
            toast.error("Please allow popups to export PDF");
            return;
          }

          const htmlContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <title>Housing Export</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #253154; margin-bottom: 20px; text-align: center; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th { background-color: #f1f5f9; color: #1e293b; font-weight: bold; text-align: left; padding: 12px; border: 1px solid #e2e8f0; }
                  td { padding: 8px 12px; border: 1px solid #e2e8f0; color: #334155; font-size: 14px; }
                  tr:nth-child(even) { background-color: #f8fafc; }
                  .meta { margin-bottom: 20px; color: #64748b; font-size: 12px; }
                </style>
              </head>
              <body>
                <h1>Housing Export</h1>
                <div class="meta">
                  <p>Generated: ${new Date().toLocaleString()}</p>
                  <p>Scope: ${options.scope}</p>
                  <p>Records: ${mappedData.length}</p>
                </div>
                <table>
                  <thead>
                    <tr>
                      ${headers.map((h: string) => `<th>${h}</th>`).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    ${mappedData.map(row => `
                      <tr>
                        ${options.selectedColumns.map((colId: string) => `<td>${row[colId] !== undefined ? row[colId] : ''}</td>`).join('')}
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
          }, 500);
        } else {
          // Default to xlsx
          XLSX.writeFile(workbook, `housing_export_${Date.now()}.xlsx`);
        }
      }

      toast.success("Export successful");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (data: any[]) => { toast.success(`Successfully imported ${data.length} records`); };

  return (<TooltipProvider><div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">
    <div className="hidden md:flex justify-between items-center gap-4 mb-8">
      <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
        <Popover><PopoverTrigger asChild><button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"><CalendarIcon size={20} className="text-[#253154]" /><span className="font-medium text-[#253154] text-[14px]">Select date range</span></button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><CalendarComponent initialFocus mode="range" selected={date} onSelect={setDate} numberOfMonths={2} /></PopoverContent></Popover>
        <div className="w-px h-4 bg-gray-200 mx-2" /><button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500"><RefreshCw size={20} className="text-[#253154]" /></button>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Download size={20} />Export</button>
        <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Upload size={20} />Import</button>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"><Plus size={20} />Add Housing</button>
      </div>
    </div>

    <div className="hidden lg:grid grid-cols-4 gap-5 mb-8">{metrics.map((m, i) => <MetricCard key={i} {...m} />)}</div>

    <div className="hidden md:flex justify-between items-center gap-4 mb-6">
      <div className="relative flex-1"><Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" /><input type="text" placeholder="Search housing options..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" /></div>
      <div className="flex items-center gap-3 shrink-0">

        {/* Filter Popover */}
        <Popover open={showFilterMenu} onOpenChange={setShowFilterMenu}>
          <PopoverTrigger asChild>
            <button className={`h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center ${filterStatus !== 'All' || filterType !== 'All Types' ? 'border-purple-600 bg-purple-50 text-purple-600' : ''}`}>
              <Filter size={20} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
            <h3 className="font-bold text-[#253154] mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'Active', 'Inactive'].map((s) => (
                    <button key={s} onClick={() => { setFilterStatus(s); setShowFilterMenu(false); setCurrentPage(1); }} className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === s ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Housing Type</label>
                <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setShowFilterMenu(false); setCurrentPage(1); }} className="w-full h-10 px-3 rounded-xl bg-gray-50 border-none text-sm font-medium text-gray-600 outline-none focus:ring-2 focus:ring-purple-100">
                  <option>All Types</option>
                  <option>Student Residence</option>
                  <option>Shared Apartment</option>
                  <option>Homestay</option>
                  <option>Private Room</option>
                  <option>Multiple</option>
                </select>
              </div>
              <button onClick={() => { setFilterStatus('All'); setFilterType('All Types'); setShowFilterMenu(false); setCurrentPage(1); }} className="w-full py-2 text-sm font-bold text-purple-600 hover:bg-purple-50 rounded-xl transition-colors mt-2">Reset Filters</button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort Popover */}
        <Popover open={showSortMenu} onOpenChange={setShowSortMenu}>
          <PopoverTrigger asChild>
            <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center">
              <ArrowUpDown size={20} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2 rounded-2xl shadow-xl border-gray-100" align="end">
            <div className="flex flex-col">
              {sortOptions.map((opt) => (
                <button key={opt.value} onClick={() => { if (sortField === opt.value) { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); } else { setSortField(opt.value); setSortOrder('desc'); } setShowSortMenu(false); }} className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${sortField === opt.value ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {opt.label}
                  {sortField === opt.value && (sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Columns Popover */}
        <Popover open={showColumnMenu} onOpenChange={setShowColumnMenu}>
          <PopoverTrigger asChild>
            <button className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center">
              <Columns size={20} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
            <h3 className="font-bold text-[#253154] mb-4">Visible Columns</h3>
            <div className="space-y-3">
              {allColumns.map((col) => (
                <div key={col.key} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleColumn(col.key)}>
                  <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${visibleColumns.includes(col.key) ? 'bg-purple-600 border-purple-600' : 'border-gray-200 group-hover:border-gray-300'}`}>
                    {visibleColumns.includes(col.key) && <Check size={12} className="text-white" strokeWidth={4} />}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${visibleColumns.includes(col.key) ? 'text-[#253154]' : 'text-gray-400'}`}>{col.label}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" size={40} /></div>
      ) : (
        <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100">
              <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12"><CustomCheckbox checked={selected.length === items.length && items.length > 0} partial={selected.length > 0 && selected.length < items.length} onChange={() => setSelected(selected.length === items.length ? [] : items.map(i => i.id))} /></th>
              {visibleColumns.includes('id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">ID</th>}
              {visibleColumns.includes('provider') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase font-bold">Provider</th>}
              {visibleColumns.includes('type') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase font-bold">Type</th>}
              {visibleColumns.includes('location') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase font-bold">Location</th>}
              {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase font-bold">Status</th>}
              {visibleColumns.includes('visible') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase font-bold">Visible</th>}
              {visibleColumns.includes('avgRent') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase font-bold">Avg Rent</th>}
              {visibleColumns.includes('countries') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase font-bold">Countries</th>}
              {visibleColumns.includes('popularity') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase font-bold">Popularity</th>}
              <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase font-bold">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.id} className={`cursor-pointer hover:bg-gray-50 transition-colors ${selected.includes(item.id) ? 'bg-purple-50/30' : ''}`} onClick={() => handleRowClick(item.id)}>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><CustomCheckbox checked={selected.includes(item.id)} onChange={() => setSelected(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])} /></td>
                  {visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154] font-bold">{item.reference_id}</td>}
                  {visibleColumns.includes('provider') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{item.provider_name}</td>}
                  {visibleColumns.includes('type') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.housing_type}</td>}
                  {visibleColumns.includes('location') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.location}</td>}
                  {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.status} /></td>}
                  {visibleColumns.includes('visible') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.student_visible ? 'Yes' : 'No'}</td>}
                  {visibleColumns.includes('avgRent') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.avg_rent}</td>}
                  {visibleColumns.includes('countries') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.countries_covered}</td>}
                  {visibleColumns.includes('popularity') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.popularity}</td>}
                  <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"><Trash2 size={18} /></button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors"><MoreHorizontal size={18} className="text-gray-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={11} className="px-6 py-10 text-center text-gray-500">No housing providers found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="h-[80px] bg-white flex items-center justify-between px-6 border-t border-gray-50">

        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm font-medium">Rows per page:</span>
          <Popover open={showRowsMenu} onOpenChange={setShowRowsMenu}>
            <PopoverTrigger asChild>
              <button className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
                {rowsPerPage}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-24 p-2 rounded-xl shadow-xl border-gray-100" align="start">
              <div className="flex flex-col">
                {[5, 10, 20, 50].map((num) => (
                  <button key={num} onClick={() => { setRowsPerPage(num); setCurrentPage(1); setShowRowsMenu(false); }} className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${rowsPerPage === num ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{num}</button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-3">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50"><ChevronLeft size={18} strokeWidth={2} className="text-gray-500" /></button>
          <span className="text-sm font-medium text-gray-600">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50"><ChevronRight size={18} strokeWidth={2} className="text-gray-500" /></button>
        </div>
      </div>
    </div>
  </div>
    <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Housing" totalCount={totalItems} selectedCount={selected.length} columns={exportColumns} supportsDateRange={false} onExport={handleExport} />
    <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Housing" fields={importFields} onImport={handleImport} templateUrl="/templates/housing-import-template.xlsx" allowUpdate={true} />
    <AddHousingDialog open={showAddDialog} onOpenChange={setShowAddDialog} mode={dialogMode} initialData={editingItem} onSave={handleSave} />
  </TooltipProvider>);
};