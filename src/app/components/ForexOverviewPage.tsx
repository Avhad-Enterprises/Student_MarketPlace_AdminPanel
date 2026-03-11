import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check, Columns, DollarSign, TrendingDown, Globe, Zap, Eye, Edit, Trash2 } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";
import * as XLSX from 'xlsx';

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { getAllForex, getForexMetrics, createForex, updateForex, deleteForex, Forex } from '@/app/services/forexService';
import { AddForexDialog } from './common/AddForexDialog';

const CustomCheckbox: React.FC<{ checked: boolean; partial?: boolean; onChange: () => void }> = ({ checked, partial, onChange }) => (<div onClick={onChange} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'}`}>{checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}{partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}</div>);
const StatusBadge: React.FC<{ status: 'active' | 'inactive' }> = ({ status }) => {
  const c = { 'active': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Active' }, 'inactive': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', label: 'Inactive' } }[status];
  return (<span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${c.bg} ${c.text} ${c.border}`}>{c.label}</span>);
};
const MetricCard: React.FC<{ title: string; value: string; icon: React.ElementType; bgClass: string; colorClass: string; tooltip: string }> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
    <div className="flex items-center justify-between"><span className="text-[#253154] font-medium text-[15px]">{title}</span><TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help">i</div></TooltipTrigger><TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2"><p>{tooltip}</p></TooltipContent></Tooltip></TooltipProvider></div>
    <div className="flex items-end gap-3 mt-2"><div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}><Icon size={22} strokeWidth={1.5} /></div><div><p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p></div></div>
    <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500"><Icon size={80} /></div>
  </div>
);

const MobileForexCard: React.FC<{
  item: Forex;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: (item: Forex) => void;
  onDelete: (id: string) => void;
}> = ({ item, isSelected, onToggleSelect, onEdit, onDelete }) => (
  <div className={`bg-white p-4 rounded-2xl border ${isSelected ? 'border-purple-600 bg-purple-50/30' : 'border-gray-100'} shadow-sm space-y-4`}>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <CustomCheckbox checked={isSelected} onChange={onToggleSelect} />
        <div>
          <h3 className="font-bold text-[#253154] text-[16px]">{item.provider_name}</h3>
          <p className="text-gray-500 text-xs">Ref: {item.forex_id}</p>
        </div>
      </div>
      <StatusBadge status={item.status} />
    </div>

    <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-3 border-y border-gray-50">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service Type</p>
        <p className="text-sm font-medium text-gray-700">{item.service_type}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pairs</p>
        <p className="text-sm font-medium text-gray-700">{item.currency_pairs}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Countries</p>
        <p className="text-sm font-medium text-gray-700">{item.countries_covered}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visibility</p>
        <p className="text-sm font-medium text-gray-700">{item.student_visible ? 'Visible' : 'Hidden'}</p>
      </div>
    </div>

    <div className="flex items-center justify-end gap-2 pt-1">
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
        title="Edit"
      >
        <Edit size={18} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

// Forex interface is now imported from forexService

interface ForexOverviewPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export const ForexOverviewPage: React.FC<ForexOverviewPageProps> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['forex_id', 'provider_name', 'service_type', 'currency_pairs', 'countries_covered', 'status', 'visible']);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Forex[]>([]);
  const [metricsData, setMetricsData] = useState<any>(null);

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterServiceType, setFilterServiceType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Forex | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        search: debouncedSearch,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        service_type: filterServiceType !== 'all' ? filterServiceType : undefined,
        sort: sortField,
        order: sortOrder
      };
      const result = await getAllForex(params);
      setItems(result.data);
      setTotalPages(result?.pagination?.totalPages || 1);

      const metrics = await getForexMetrics();
      setMetricsData(metrics?.data || null);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch forex data");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, rowsPerPage, debouncedSearch, filterStatus, filterServiceType, sortField, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
    toast.success("Data refreshed");
  };

  const handleSaveForex = async (data: any) => {
    try {
      if (dialogMode === 'edit' && editingItem) {
        await updateForex(editingItem.id, data);
      } else {
        await createForex(data);
      }
      fetchData();
    } catch (error) {
      console.error("Save error:", error);
      throw error; // Re-throw to be handled by the dialog's toast
    }
  };

  const handleEditForex = (item: Forex) => {
    setEditingItem(item);
    setDialogMode('edit');
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this forex provider?")) return;
    try {
      await deleteForex(id);
      toast.success("Forex provider deleted");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete forex provider");
    }
  };

  const metrics = [
    { title: 'Forex Partners', value: metricsData?.totalPartners?.toString() || '0', icon: DollarSign, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total forex service partners' },
    { title: 'Currency Pairs', value: metricsData?.totalCurrencyPairs?.toString() || '0', icon: Globe, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Total currency pairs supported' },
    { title: 'Avg Transfer Fee', value: metricsData?.avgFee || '0%', icon: TrendingDown, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Average transfer fee across providers' },
    { title: 'Instant Transfers', value: metricsData?.instantPercentage || '0%', icon: Zap, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Percentage of instant transfer options' }
  ];

  const exportColumns: ExportColumn[] = [
    { id: 'forex_id', label: 'Forex ID', defaultSelected: true },
    { id: 'provider_name', label: 'Provider', defaultSelected: true },
    { id: 'service_type', label: 'Service Type', defaultSelected: true },
    { id: 'currency_pairs', label: 'Currency Pairs', defaultSelected: true },
    { id: 'countries_covered', label: 'Countries', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'avg_fee', label: 'Avg Fee', defaultSelected: true },
    { id: 'transfer_speed', label: 'Speed', defaultSelected: true }
  ];
  const importFields: ImportField[] = [
    { id: 'forex_id', label: 'Forex ID', required: false, type: 'text' },
    { id: 'provider_name', label: 'Provider Name', required: true, type: 'text' },
    { id: 'service_type', label: 'Service Type', required: true, type: 'select', options: ['Money Transfer', 'Multi-Currency Account', 'Currency Exchange'] },
    { id: 'currency_pairs', label: 'Currency Pairs', required: true, type: 'text' },
    { id: 'status', label: 'Status', required: false, type: 'select', options: ['active', 'inactive'] }
  ];
  const toggleColumn = (col: string) => {
    setVisibleColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
  };

  const handleExport = async (options: any) => {
    try {
      setIsLoading(true);
      let dataToExport: any[] = [];

      if (options.scope === 'all') {
        const result = await getAllForex({ limit: 1000 });
        dataToExport = result.data;
      } else if (options.scope === 'selected') {
        dataToExport = items.filter(i => selected.includes(i.id));
      } else {
        dataToExport = items;
      }

      const mappedData = dataToExport.map(item => {
        const row: any = {};
        options.selectedColumns.forEach((colId: string) => {
          row[colId] = item[colId as keyof Forex];
        });
        return row;
      });

      if (options.format === 'json') {
        const blob = new Blob([JSON.stringify(mappedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `forex_export_${Date.now()}.json`;
        a.click();
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

        const dateStr = format(new Date(), 'yyyy-MM-dd');
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Forex Export ${dateStr}</title>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; }
                header { margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
                h1 { color: #253154; margin: 0; font-size: 24px; }
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
                <h1>Forex Records Export</h1>
                <div class="meta">
                  <span><strong>Generated:</strong> ${new Date().toLocaleString()}</span>
                  <span><strong>Scope:</strong> ${options.scope}</span>
                  <span><strong>Records:</strong> ${mappedData.length}</span>
                </div>
              </header>
              <table>
                <thead>
                  <tr>
                    ${headers.map((h: string) => `<th>${h}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${mappedData.map(row => `
                    <tr>
                      ${options.selectedColumns.map((colId: string) => {
          const val = row[colId] !== undefined ? row[colId] : '';
          let className = '';
          if (colId === 'status') className = val === 'active' ? 'status-active' : 'status-inactive';
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
        }, 500);
      } else {
        const worksheet = XLSX.utils.json_to_sheet(mappedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Forex");

        if (options.format === 'csv') {
          XLSX.writeFile(workbook, `forex_export_${Date.now()}.csv`, { bookType: 'csv' });
        } else {
          XLSX.writeFile(workbook, `forex_export_${Date.now()}.xlsx`);
        }
      }
      toast.success("Export successful");
    } catch (error) {
      toast.error("Export failed");
      console.error("Export error:", error);
    } finally {
      setIsLoading(false);
      setShowExportDialog(false);
    }
  };
  const handleImport = async (data: any[]) => { toast.success(`Successfully imported ${data.length} records`); };

  return (<TooltipProvider>
    <>
      <div suppressHydrationWarning className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">
        {/* ... existing content ... */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-8">
          <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
            <Popover><PopoverTrigger asChild><button suppressHydrationWarning className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"><CalendarIcon size={20} className="text-[#253154]" /><span className="font-medium text-[#253154] text-[14px]">Select date range</span></button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><CalendarComponent initialFocus mode="range" selected={date} onSelect={setDate} numberOfMonths={2} /></PopoverContent></Popover>
            <div className="w-px h-4 bg-gray-200 mx-2" /><button className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500"><RefreshCw size={20} className="text-[#253154]" /></button>
          </div>
          <div className="flex items-center gap-3">
            <button suppressHydrationWarning onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Download size={20} />Export</button>
            <button suppressHydrationWarning onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Upload size={20} />Import</button>
            <button suppressHydrationWarning onClick={() => { setEditingItem(null); setDialogMode('add'); setShowAddDialog(true); }} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"><Plus size={20} />Add Forex</button>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-4 gap-5 mb-8">{metrics.map((m, i) => <MetricCard key={i} {...m} />)}</div>
        <div className="block lg:hidden mb-14 -mx-4"><Slider dots infinite={false} speed={500} slidesToShow={1.1} slidesToScroll={1} arrows={false} centerMode centerPadding='20px'>{metrics.map((m, i) => <div key={i} className="px-2 py-2"><MetricCard {...m} /></div>)}</Slider></div>

        <div className="hidden md:flex justify-between items-center gap-4 mb-6">
          <div className="relative flex-1"><Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search forex services..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" /></div>
          <div className="flex items-center gap-3 shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <button suppressHydrationWarning className={`h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center ${filterStatus !== 'all' || filterServiceType !== 'all' ? 'border-purple-600' : ''}`}><Filter size={20} /></button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                {/* ... filters ... */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[#253154]">Filters</h4>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">Status</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full p-2 border rounded-lg">
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">Service Type</label>
                    <select value={filterServiceType} onChange={(e) => setFilterServiceType(e.target.value)} className="w-full p-2 border rounded-lg">
                      <option value="all">All Types</option>
                      <option value="Money Transfer">Money Transfer</option>
                      <option value="Multi-Currency Account">Multi-Currency Account</option>
                      <option value="Currency Exchange">Currency Exchange</option>
                    </select>
                  </div>
                  <button onClick={() => { setFilterStatus('all'); setFilterServiceType('all'); }} className="text-sm text-purple-600 hover:underline">Reset Filters</button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button suppressHydrationWarning className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><ArrowUpDown size={20} /></button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-1">
                  {[
                    { label: 'Provider Name', value: 'provider_name' },
                    { label: 'Service Type', value: 'service_type' },
                    { label: 'Currency Pairs', value: 'currency_pairs' },
                    { label: 'Countries', value: 'countries_covered' },
                    { label: 'Avg Fee', value: 'avg_fee' },
                    { label: 'Popularity', value: 'popularity' },
                    { label: 'Date Created', value: 'created_at' }
                  ].map((opt) => (
                    <button
                      suppressHydrationWarning
                      key={opt.value}
                      onClick={() => {
                        if (sortField === opt.value) {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortField(opt.value);
                          setSortOrder('asc');
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between text-sm ${sortField === opt.value ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50'}`}
                    >
                      {opt.label}
                      {sortField === opt.value && (sortOrder === 'asc' ? <ArrowUpDown size={14} /> : <ArrowUpDown size={14} className="rotate-180" />)}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button suppressHydrationWarning className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><Columns size={20} /></button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-1">
                  {[
                    { id: 'forex_id', label: 'ID' },
                    { id: 'provider_name', label: 'Provider' },
                    { id: 'service_type', label: 'Service Type' },
                    { id: 'currency_pairs', label: 'Currency Pairs' },
                    { id: 'countries_covered', label: 'Countries' },
                    { id: 'status', label: 'Status' },
                    { id: 'visible', label: 'Student Visible' }
                  ].map((col) => (
                    <button
                      suppressHydrationWarning
                      key={col.id}
                      onClick={() => toggleColumn(col.id)}
                      className="w-full text-left px-3 py-2 rounded-md flex items-center gap-3 text-sm hover:bg-gray-50"
                    >
                      <CustomCheckbox checked={visibleColumns.includes(col.id)} onChange={() => { }} />
                      {col.label}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-4">
              <RefreshCw size={40} className="animate-spin" />
              <p className="font-medium">Loading forex providers...</p>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="md:hidden space-y-4 p-4">
                {items.length > 0 ? (
                  items.map((item) => (
                    <MobileForexCard
                      key={item.id}
                      item={item}
                      isSelected={selected.includes(item.id)}
                      onToggleSelect={() => setSelected(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])}
                      onEdit={handleEditForex}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-3">
                    <DollarSign size={48} className="text-gray-200 mx-auto" />
                    <p className="text-gray-500 font-medium">No forex providers found</p>
                  </div>
                )}
              </div>

              <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-100">
                    <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12"><CustomCheckbox checked={selected.length === items.length && items.length > 0} partial={selected.length > 0 && selected.length < items.length} onChange={() => setSelected(selected.length === items.length ? [] : items.map(i => i.id))} /></th>
                    {visibleColumns.includes('forex_id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">ID</th>}
                    {visibleColumns.includes('provider_name') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Provider</th>}
                    {visibleColumns.includes('service_type') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Service Type</th>}
                    {visibleColumns.includes('currency_pairs') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Pairs</th>}
                    {visibleColumns.includes('countries_covered') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Countries</th>}
                    {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Status</th>}
                    {visibleColumns.includes('visible') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visible</th>}
                    <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${selected.includes(item.id) ? 'bg-purple-50/30' : ''}`}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('td:first-child') || (e.target as HTMLElement).closest('td:last-child')) return;
                          onNavigate?.('forex-provider-detail', { forexId: item.id });
                        }}
                      >
                        <td className="px-6 py-4"><CustomCheckbox checked={selected.includes(item.id)} onChange={() => setSelected(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])} /></td>
                        {visibleColumns.includes('forex_id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{item.forex_id}</td>}
                        {visibleColumns.includes('provider_name') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold underline decoration-purple-200 decoration-2 underline-offset-4">{item.provider_name}</td>}
                        {visibleColumns.includes('service_type') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.service_type}</td>}
                        {visibleColumns.includes('currency_pairs') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.currency_pairs}</td>}
                        {visibleColumns.includes('countries_covered') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.countries_covered}</td>}
                        {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.status} /></td>}
                        {visibleColumns.includes('visible') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.student_visible ? 'Yes' : 'No'}</td>}
                        <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEditForex(item); }}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                              title="Edit"
                            >
                              <Edit size={18} className="text-gray-400 group-hover:text-blue-600" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                              title="Delete"
                            >
                              <Trash2 size={18} className="text-gray-400 group-hover:text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="h-[80px] bg-white flex items-center justify-between px-6 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm font-medium">Rows per page:</span>
            <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm font-medium text-gray-700 outline-none">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50"><ChevronLeft size={18} strokeWidth={2} className="text-gray-500" /></button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50"><ChevronRight size={18} strokeWidth={2} className="text-gray-500" /></button>
          </div>
        </div>
      </div>
      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Forex" totalCount={metricsData?.totalProviders || 0} selectedCount={selected.length} columns={exportColumns} supportsDateRange={false} onExport={handleExport} />
      <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Forex" fields={importFields} onImport={handleImport} templateUrl="/templates/forex-import-template.xlsx" allowUpdate={true} />
      <AddForexDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSave={handleSaveForex} initialData={editingItem} mode={dialogMode} />
    </>
  </TooltipProvider>);
};
