import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Edit, Check, Columns, Eye, CreditCard, TrendingUp, Award, Users, Trash2 } from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/app/components/ui/dropdown-menu";
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";
import { ServicePageHeader } from './service-marketplace/ServicePageHeader';
import { ServiceMetricGrid } from './service-marketplace/ServiceMetricGrid';
import { CustomCheckbox, StatusBadge } from './service-marketplace/CommonUI';
import { PermissionGuard } from './common/PermissionGuard';

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { buildCreditService, BuildCredit } from '../services/buildCreditService';
import { AddBuildCreditDialog } from './common/AddBuildCreditDialog';

// --- Shared Components Extracted ---

const MobileBuildCreditCard: React.FC<{
  item: BuildCredit;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: (item: BuildCredit) => void;
  onDelete: (id: number) => void;
  onView: () => void;
}> = ({ item, isSelected, onToggleSelect, onEdit, onDelete, onView }) => (
  <div className={`bg-white p-4 rounded-2xl border ${isSelected ? 'border-purple-600 bg-purple-50/30' : 'border-gray-100'} shadow-sm space-y-4`} onClick={onView}>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <CustomCheckbox checked={isSelected} onChange={onToggleSelect} />
        <div>
          <h3 className="font-bold text-[#253154] text-[16px]">{item.program_name}</h3>
          <p className="text-gray-500 text-xs">Ref: {item.reference_id}</p>
        </div>
      </div>
      <StatusBadge status={item.status} />
    </div>

    <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-3 border-y border-gray-50">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provider</p>
        <p className="text-sm font-medium text-gray-700">{item.provider_name}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Card Type</p>
        <p className="text-sm font-medium text-gray-700">{item.card_type}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Countries</p>
        <p className="text-sm font-medium text-gray-700">{item.countries_supported}</p>
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

export const BuildCreditOverviewPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>({ from: subDays(new Date(), 29), to: new Date() });
  const [selected, setSelected] = useState<number[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['reference_id', 'provider_name', 'program_name', 'card_type', 'countries_supported', 'status', 'student_visible']);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [items, setItems] = useState<BuildCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editItem, setEditItem] = useState<BuildCredit | null>(null);

  const [metrics, setMetrics] = useState([
    { title: 'Credit Programs', value: '0', icon: CreditCard, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total credit building programs' },
    { title: 'Average Credit Limit', value: '$0', icon: TrendingUp, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Average starting credit limit' },
    { title: 'Success Rate', value: '0%', icon: Award, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Students successfully building credit' },
    { title: 'Active Users', value: '0', icon: Users, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Students actively using programs' }
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await buildCreditService.getAll({
        page,
        limit: rowsPerPage,
        search,
        sort: sortBy,
        order: sortOrder,
        from: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
        to: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
      });
      setItems(result.data);
      setPagination(result.pagination);

      const metricsData = await buildCreditService.getMetrics();
      setMetrics(prev => prev.map(m => {
        if (m.title === 'Credit Programs') return { ...m, value: metricsData.data.totalPrograms.toString() };
        if (m.title === 'Average Credit Limit') return { ...m, value: metricsData.data.averageCreditLimit };
        if (m.title === 'Success Rate') return { ...m, value: metricsData.data.successRate };
        if (m.title === 'Active Users') return { ...m, value: metricsData.data.activeUsers };
        return m;
      }));
    } catch (error) {
      toast.error("Failed to fetch build credit data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, sortBy, sortOrder, date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      await buildCreditService.delete(id);
      toast.success("Program deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete program");
    }
  };

  const handleSave = async (data: Partial<BuildCredit>) => {
    try {
      if (editItem) {
        await buildCreditService.update(editItem.id, data);
        toast.success("Program updated successfully");
      } else {
        await buildCreditService.create(data);
        toast.success("Program created successfully");
      }
      fetchData();
      setEditItem(null);
    } catch (error) {
      toast.error("Failed to save program");
      throw error;
    }
  };

  const handleExport = async (options: any) => {
    try {
      let dataToExport = [];
      if (options.scope === 'all') {
        const response = await buildCreditService.getAll({ limit: 1000 });
        dataToExport = response.data;
      } else if (options.scope === 'current') {
        dataToExport = [...items];
      } else if (options.scope === 'selected') {
        if (selected.length === 0) {
          toast.error("No items selected");
          return;
        }
        dataToExport = items.filter(i => selected.includes(i.id));
      }

      if (options.format === 'pdf') {
        const exportData = dataToExport.map((item: BuildCredit) => {
          const row: any = {};
          const isSelected = (id: string) => options.selectedColumns.includes(id);
          if (isSelected('id')) row['Database ID'] = item.id;
          if (isSelected('reference_id')) row['Ref ID'] = item.reference_id;

          if (isSelected('provider_name')) row['Provider'] = item.provider_name;
          if (isSelected('program_name')) row['Program'] = item.program_name;
          if (isSelected('card_type')) row['Card Type'] = item.card_type;
          if (isSelected('countries_supported')) row['Countries'] = item.countries_supported;
          if (isSelected('status')) row['Status'] = item.status;
          if (isSelected('credit_limit')) row['Credit Limit'] = item.credit_limit;
          if (isSelected('monthly_fee')) row['Monthly Fee'] = item.monthly_fee;
          return row;
        });

        const headers = Object.keys(exportData[0] || {});
        const dateStr = format(new Date(), 'yyyy-MM-dd');
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          toast.error("Please allow popups to export PDF");
          return;
        }

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Build Credit Export ${dateStr}</title>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; }
                header { margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
                h1 { color: #0e042f; margin: 0; font-size: 24px; }
                .meta { margin-top: 10px; color: #64748b; font-size: 13px; display: flex; gap: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background-color: #f8fafc; color: #475569; font-weight: bold; text-align: left; padding: 12px 15px; border: 1px solid #e2e8f0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
                td { padding: 10px 15px; border: 1px solid #e2e8f0; font-size: 13px; }
                tr:nth-child(even) { background-color: #fcfcfd; }
              </style>
            </head>
            <body>
              <header>
                <h1>Build Credit Programs Export</h1>
                <div class="meta">
                  <span><strong>Generated:</strong> ${new Date().toLocaleString()}</span>
                  <span><strong>Scope:</strong> ${options.scope}</span>
                  <span><strong>Records:</strong> ${exportData.length}</span>
                </div>
              </header>
              <table>
                <thead>
                  <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                  ${exportData.map((row: any) => `
                    <tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>
                  `).join('')}
                </tbody>
              </table>
              <script>window.onload = () => { window.print(); window.close(); }</script>
            </body>
          </html>
        `);
        printWindow.document.close();
        toast.success("PDF report generated");
      } else {
        const blob = await buildCreditService.exportData({
          format: options.format,
          scope: options.scope,
          ids: options.scope === 'selected' ? selected.join(',') : undefined,
          columns: options.selectedColumns.join(','),
          from: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
          to: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `build-credit-export.${options.format}`;
        a.click();
        toast.success(`${options.format.toUpperCase()} exported successfully`);
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed");
    }
  };

  const exportColumns: ExportColumn[] = [
    { id: 'id', label: 'Database ID', defaultSelected: false },
    { id: 'reference_id', label: 'Reference ID', defaultSelected: true },
    { id: 'provider_name', label: 'Provider', defaultSelected: true },
    { id: 'program_name', label: 'Program Name', defaultSelected: true },
    { id: 'card_type', label: 'Card Type', defaultSelected: true },
    { id: 'countries_supported', label: 'Countries', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'credit_limit', label: 'Credit Limit', defaultSelected: false },
    { id: 'monthly_fee', label: 'Monthly Fee', defaultSelected: false }
  ];

  const importFields: ImportField[] = [
    { id: 'id', label: 'Database ID (For Updates)', required: false, type: 'text' },
    { id: 'provider_name', label: 'Provider Name', required: true, type: 'text' },
    { id: 'program_name', label: 'Program Name', required: true, type: 'text' },
    { id: 'card_type', label: 'Card Type', required: true, type: 'select', options: ['Student Card', 'Secured Card', 'Savings-Secured'] },
    { id: 'status', label: 'Status', required: false, type: 'select', options: ['active', 'inactive'] },
    { id: 'countries_supported', label: 'Countries Supported', required: false, type: 'text' },
    { id: 'student_visible', label: 'Visible to Students', required: false, type: 'select', options: ['Yes', 'No'] },
    { id: 'credit_limit', label: 'Credit Limit', required: false, type: 'text' },
    { id: 'monthly_fee', label: 'Monthly Fee', required: false, type: 'text' },
    { id: 'building_period', label: 'Building Period', required: false, type: 'text' }
  ];


  const handleImport = async (data: any[], mode: any) => {
    console.log('Importing build credit data:', data, 'mode:', mode);
    let successCount = 0;
    let failCount = 0;

    const loadingToast = toast.loading(`Importing programs (0/${data.length})...`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const payload = {
          provider_name: row.provider_name,
          program_name: row.program_name,
          card_type: row.card_type || 'Student Card',
          countries_supported: Number(row.countries_supported) || 1,
          status: (row.status || 'active').toLowerCase() as 'active' | 'inactive',
          student_visible: row.student_visible === 'Yes',
          credit_limit: row.credit_limit || '',
          monthly_fee: row.monthly_fee || '$0',
          building_period: row.building_period || '6 months',
          popularity: 0
        };

        if (mode === 'update' && row.id) {
          await buildCreditService.update(Number(row.id), payload);
        } else {
          await buildCreditService.create(payload);
        }
        successCount++;
      } catch (error) {
        console.error(`Failed to import build credit row ${i + 1}:`, error);
        failCount++;
      }
      toast.loading(`Importing programs (${successCount + failCount}/${data.length})...`, { id: loadingToast });
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


  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <TooltipProvider>
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">
        
        {/* Standard Action Bar */}
        <ServicePageHeader 
          title="Build Credit" 
          dateRange={date} 
          onDateChange={setDate}
          onRefresh={fetchData}
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
                  onClick={() => { setEditItem(null); setShowAddDialog(true); }}
                  className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"
                >
                  <Plus size={20} strokeWidth={1.5} />Add Program
                </button>
              </PermissionGuard>
            </div>
          }
        />

        {/* Metrics - Standard Grid */}
        <ServiceMetricGrid metrics={metrics} />


        <div className="hidden md:flex justify-between items-center gap-4 mb-6">
          <div className="relative flex-1"><Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search credit programs..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" /></div>
          <div className="flex items-center gap-3 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><Filter size={20} /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => fetchData()}>All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => fetchData()}>Active Only</DropdownMenuItem>
                <DropdownMenuItem onClick={() => fetchData()}>Inactive Only</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><ArrowUpDown size={20} /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSort('created_at')}>Recently Added</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('provider_name')}>Provider Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('program_name')}>Program Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('popularity')}>Popularity</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><Columns size={20} /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['reference_id', 'provider_name', 'program_name', 'card_type', 'countries_supported', 'status', 'student_visible'].map(col => (
                  <DropdownMenuItem
                    key={col}
                    onClick={() => setVisibleColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col])}
                    className="flex items-center justify-between"
                  >
                    {col.replace('_', ' ')}
                    {visibleColumns.includes(col) && <Check size={14} />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-purple-600">Loading programs...</p>
              </div>
            </div>
          )}

          {/* Mobile View */}
          {!loading && (
            <div className="md:hidden space-y-4 p-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <MobileBuildCreditCard
                    key={item.id}
                    item={item}
                    isSelected={selected.includes(item.id)}
                    onToggleSelect={() => setSelected(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])}
                    onEdit={(i) => { setEditItem(i); setShowAddDialog(true); }}
                    onDelete={handleDelete}
                    onView={() => onNavigate?.('build-credit-provider-detail')}
                  />
                ))
              ) : (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <CreditCard size={24} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No data available</p>
                  <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                    There are no credit programs matching your current filters.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
            <table className="w-full">
              <thead><tr className="border-b border-gray-100">
                <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12"><CustomCheckbox checked={selected.length === items.length && items.length > 0} partial={selected.length > 0 && selected.length < items.length} onChange={() => setSelected(selected.length === items.length ? [] : items.map(i => i.id))} /></th>
                {visibleColumns.includes('reference_id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">ID</th>}
                {visibleColumns.includes('provider_name') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Provider</th>}
                {visibleColumns.includes('program_name') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Program</th>}
                {visibleColumns.includes('card_type') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Card Type</th>}
                {visibleColumns.includes('countries_supported') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Countries</th>}
                {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Status</th>}
                {visibleColumns.includes('student_visible') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visible</th>}
                <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {items.length > 0 ? items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onNavigate?.('build-credit-provider-detail')}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${selected.includes(item.id) ? 'bg-purple-50/30' : ''}`}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox checked={selected.includes(item.id)} onChange={() => setSelected(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])} />
                    </td>
                    {visibleColumns.includes('reference_id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{item.reference_id}</td>}
                    {visibleColumns.includes('provider_name') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.provider_name}</td>}
                    {visibleColumns.includes('program_name') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold underline decoration-purple-200 decoration-2 underline-offset-4">{item.program_name}</td>}
                    {visibleColumns.includes('card_type') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.card_type}</td>}
                    {visibleColumns.includes('countries_supported') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.countries_supported}</td>}
                    {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.status} /></td>}
                    {visibleColumns.includes('student_visible') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.student_visible ? 'Yes' : 'No'}</td>}
                    <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <PermissionGuard module="services" action="edit">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditItem(item); setShowAddDialog(true); }}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                            title="Edit Details"
                          >
                            <Edit size={18} className="text-gray-400 group-hover:text-blue-600" />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard module="services" action="delete">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Delete Program"
                          >
                            <Trash2 size={18} className="text-gray-400 group-hover:text-red-600" />
                          </button>
                        </PermissionGuard>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={visibleColumns.length + 2} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                          <CreditCard className="text-gray-300" size={24} />
                        </div>
                        <p className="text-gray-500 font-medium">No results found</p>
                        <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                          We couldn't find any credit programs matching your filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {items.length > 0 && (
            <div className="h-[80px] bg-white flex items-center justify-between px-6 border-t border-gray-50">
              <div className="flex items-center gap-2"><span className="text-gray-500 text-sm font-medium">Rows per page:</span><button className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-gray-700">{rowsPerPage}<ChevronDown size={14} className="text-gray-400" /></button></div>
              <div className="flex items-center gap-3">
                <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50"><ChevronLeft size={18} strokeWidth={2} className="text-gray-500" /></button>
                <span className="text-sm font-medium text-gray-700">Page {page} of {pagination.totalPages}</span>
                <button disabled={page === pagination.totalPages} onClick={() => setPage(prev => prev + 1)} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50"><ChevronRight size={18} strokeWidth={2} className="text-gray-500" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Build Credit" totalCount={pagination.total} selectedCount={selected.length} columns={exportColumns} supportsDateRange={true} onExport={handleExport} />
      <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Build Credit" fields={importFields} onImport={handleImport} templateUrl="/templates/build-credit-import-template.xlsx" allowUpdate={true} />
      <AddBuildCreditDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSave={handleSave} initialData={editItem} mode={editItem ? 'edit' : 'add'} />
    </TooltipProvider>
  );
};
