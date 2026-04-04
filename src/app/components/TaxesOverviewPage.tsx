'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Edit, Check, Columns, Eye, Power, Globe, Users, FileText, Building, DollarSign, TrendingUp, Trash2 } from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
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
import { AddTaxDialog } from './common/AddTaxDialog';
import * as taxesService from '../services/taxesService';
import { Tax } from '../services/taxesService';


const MobileTaxCard: React.FC<{
  tax: Tax;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: (tax: Tax) => void;
  onDelete: (id: number | string) => void;
  onNavigate?: (page: string) => void;
}> = ({ tax, isSelected, onToggleSelect, onEdit, onDelete, onNavigate }) => (
  <div className={`bg-white p-4 rounded-2xl border ${isSelected ? 'border-purple-600 bg-purple-50/30' : 'border-gray-100'} shadow-sm space-y-4`}>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <CustomCheckbox checked={isSelected} onChange={onToggleSelect} />
        <div>
          <h3 className="font-bold text-[#253154] text-[16px]">{tax.service_name}</h3>
          <p className="text-gray-500 text-xs">Ref: {tax.tax_id}</p>
        </div>
      </div>
      <StatusBadge status={tax.status} />
    </div>

    <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-3 border-y border-gray-50">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provider</p>
        <p className="text-sm font-medium text-gray-700">{tax.provider}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filing Type</p>
        <p className="text-sm font-medium text-gray-700">{tax.filing_type}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Countries</p>
        <p className="text-sm font-medium text-gray-700">{tax.countries_covered}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visibility</p>
        <p className="text-sm font-medium text-gray-700">{tax.student_visible ? 'Visible' : 'Hidden'}</p>
      </div>
    </div>

    <div className="flex items-center justify-end gap-2 pt-1">
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate?.(`/services/taxes/${tax.id}`); }}
        className="p-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
        title="View Details"
      >
        <Eye size={18} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(tax); }}
        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
        title="Edit"
      >
        <Edit size={18} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(tax.id); }}
        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

export const TaxesOverviewPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>({ from: subDays(new Date(), 29), to: new Date() });
  const [selectedTaxes, setSelectedTaxes] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'service', 'provider', 'filingType', 'countries', 'status', 'visible']);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editTax, setEditTax] = useState<Tax | null>(null);

  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', order: 'desc' });

  const [metrics, setMetrics] = useState({
    totalTaxServices: '0',
    countriesCovered: '0',
    activeTaxServices: '0',
    studentUsageRate: '0%'
  });

  const fetchTaxes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await taxesService.getAllTaxes({
        page: currentPage,
        limit: rowsPerPage,
        search: searchQuery,
        status: statusFilter === 'All' ? undefined : statusFilter,
        sort: sortConfig.key,
        order: sortConfig.order
      });
      setTaxes(result.data || []);
      setTotalCount(result.pagination?.total || 0);
    } catch (error) {
      toast.error("Failed to load taxes data");
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchQuery, statusFilter, sortConfig]);

  const handleDelete = async (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this tax service?")) return;
    try {
      await taxesService.deleteTax(id);
      toast.success("Tax service deleted successfully");
      fetchTaxes();
    } catch (error) {
      toast.error("Failed to delete tax service");
    }
  };

  const fetchMetrics = useCallback(async () => {
    try {
      const data = await taxesService.getTaxMetrics();
      if (data) {
        setMetrics({
          totalTaxServices: data.totalTaxServices.toString(),
          countriesCovered: data.countriesCovered.toString(),
          activeTaxServices: data.activeTaxServices.toString(),
          studentUsageRate: data.studentUsageRate
        });
      }
    } catch (error) {
      console.error("Failed to fetch metrics", error);
    }
  }, []);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const handleSave = async (data: any) => {
    if (editTax) {
      await taxesService.updateTax(editTax.id, data);
    } else {
      await taxesService.createTax(data);
    }
    fetchTaxes();
    fetchMetrics();
  };


  const metricCards = [
    { title: 'Tax Advisory Services', value: metrics.totalTaxServices, icon: FileText, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total tax advisory service partners' },
    { title: 'Countries Covered', value: metrics.countriesCovered, icon: Globe, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Countries with tax filing support' },
    { title: 'Active Filing Types', value: metrics.activeTaxServices, icon: Building, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Currently active tax filing types' },
    { title: 'Student Usage Rate', value: metrics.studentUsageRate, icon: TrendingUp, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Percentage of students using tax services' }
  ];

  const allColumns = [{ key: 'id', label: 'Reference ID' }, { key: 'service', label: 'Service Name' }, { key: 'provider', label: 'Provider' }, { key: 'filingType', label: 'Filing Type' }, { key: 'countries', label: 'Countries' }, { key: 'status', label: 'Status' }, { key: 'residencyType', label: 'Residency Type' }, { key: 'complexity', label: 'Complexity' }, { key: 'usageRate', label: 'Usage Rate' }, { key: 'visible', label: 'Visible' }];
  const exportColumns: ExportColumn[] = [
    { id: 'id', label: 'Database ID', defaultSelected: false },
    { id: 'tax_id', label: 'Reference ID', defaultSelected: true }, { id: 'service_name', label: 'Service Name', defaultSelected: true }, { id: 'provider', label: 'Provider', defaultSelected: true }, { id: 'filing_type', label: 'Filing Type', defaultSelected: true }, { id: 'countries_covered', label: 'Countries', defaultSelected: true }, { id: 'status', label: 'Status', defaultSelected: true }, { id: 'residency_type', label: 'Residency Type', defaultSelected: false }, { id: 'complexity', label: 'Complexity', defaultSelected: false }
  ];

  const importFields: ImportField[] = [
    { id: 'id', label: 'Database ID (For Updates)', required: false, type: 'text' },
    { id: 'tax_id', label: 'Reference ID', required: false, type: 'text' }, { id: 'service_name', label: 'Service Name', required: true, type: 'text' }, { id: 'provider', label: 'Provider', required: true, type: 'text' }, { id: 'filing_type', label: 'Filing Type', required: true, type: 'select', options: ['Full Service', 'Self-Service', 'Advisory Only'] }, { id: 'countries_covered', label: 'Countries', required: true, type: 'text' }, { id: 'status', label: 'Status', required: false, type: 'select', options: ['Active', 'Inactive'] }, { id: 'residency_type', label: 'Residency Type', required: false, type: 'select', options: ['Resident', 'Non-Resident', 'Both'] }, { id: 'complexity', label: 'Complexity', required: false, type: 'select', options: ['Low', 'Medium', 'High'] },
    { id: 'student_visible', label: 'Visible to Students', required: false, type: 'select', options: ['Yes', 'No'] }
  ];


  const handleExport = async (options: any) => {
    try {
      if (options.format === 'pdf') {
        let dataToExport: Tax[] = [];

        // 1. Determine Scope and Fetch Data
        if (options.scope === 'all') {
          toast.info("Fetching all data for PDF export...");
          const response = await taxesService.getAllTaxes({ limit: 10000 });
          dataToExport = response.data || [];
        } else if (options.scope === 'current') {
          dataToExport = [...taxes];
        } else if (options.scope === 'selected') {
          if (selectedTaxes.length === 0) {
            toast.error("No items selected");
            return;
          }
          dataToExport = taxes.filter(t => selectedTaxes.includes(t.id.toString()));
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
          if (isSelected('tax_id')) row['Ref ID'] = item.tax_id;

          if (isSelected('service_name')) row['Service Name'] = item.service_name;
          if (isSelected('provider')) row['Provider'] = item.provider;
          if (isSelected('filing_type')) row['Filing Type'] = item.filing_type;
          if (isSelected('countries_covered')) row['Countries'] = item.countries_covered;
          if (isSelected('status')) row['Status'] = item.status;
          if (isSelected('residency_type')) row['Residency'] = item.residency_type;
          if (isSelected('complexity')) row['Complexity'] = item.complexity;

          return row;
        });

        const headers = Object.keys(exportData[0] || {});
        if (headers.length === 0) {
          toast.error("No columns selected for PDF");
          return;
        }

        // 4. Generate Print Window with Premium Styling
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
              <title>Taxes Export ${dateStr}</title>
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
                <h1>Tax Advisory Services Export</h1>
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
              <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); }</script>
            </body>
          </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        toast.success(`Generated PDF report for ${exportData.length} records`);
      } else {
        // Handle CSV, JSON via backend
        await taxesService.exportTaxes({
          ...options,
          ids: options.scope === 'selected' ? selectedTaxes.join(',') : undefined
        });
        toast.success("Data exported successfully");
        setShowExportDialog(false);
      }
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.message || "Failed to export tax records");
    }
  };

  const handleImport = async (data: any[], mode: any) => {
    console.log('Importing taxes data:', data, 'mode:', mode);
    let successCount = 0;
    let failCount = 0;

    const loadingToast = toast.loading(`Importing taxes (0/${data.length})...`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const payload = {
          tax_id: row.tax_id || '',
          service_name: row.service_name,
          provider: row.provider,
          filing_type: row.filing_type || 'Full Service',
          countries_covered: Number(row.countries_covered) || 1,
          status: (row.status || 'Active').toLowerCase() as 'active' | 'inactive',
          student_visible: row.student_visible === 'Yes',
          residency_type: row.residency_type || 'Non-Resident',
          complexity: row.complexity || 'Medium',
          usage_rate: '0%',
          popularity: 0
        };

        if (mode === 'update' && row.id) {
          await taxesService.updateTax(row.id, payload);
        } else {
          await taxesService.createTax(payload);
        }
        successCount++;
      } catch (error) {
        console.error(`Failed to import tax row ${i + 1}:`, error);
        failCount++;
      }
      toast.loading(`Importing taxes (${successCount + failCount}/${data.length})...`, { id: loadingToast });
    }

    toast.dismiss(loadingToast);
    if (successCount > 0) {
      toast.success(`Import complete! ${successCount} successful, ${failCount} failed.`);
    } else {
      toast.error(`Import failed! All ${failCount} rows failed.`);
    }

    setShowImportDialog(false);
    fetchTaxes();
    if (typeof fetchMetrics === 'function') {
      fetchMetrics();
    }
  };


  return (
    <TooltipProvider>
      <>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">
          <ServicePageHeader 
            title="Taxes" 
            dateRange={date} 
            onDateChange={setDate}
            onRefresh={() => fetchTaxes()}
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
                    onClick={() => { setEditTax(null); setShowAddDialog(true); }}
                    className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"
                  >
                    <Plus size={20} strokeWidth={1.5} />Add Tax Service
                  </button>
                </PermissionGuard>
              </div>
            }
          />

          <ServiceMetricGrid metrics={metricCards} />

          <div className="hidden md:flex justify-between items-center gap-4 mb-6">
            <div className="relative flex-1"><Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" /><input type="text" placeholder="Search by service name, provider, reference ID" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" /></div>
            <div className="flex items-center gap-3 shrink-0">
              <Popover>
                <PopoverTrigger asChild>
                  <button className={`h-[50px] min-w-[50px] ${statusFilter !== 'All' ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-white border-gray-200 text-[#253154]'} border rounded-xl hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-2 px-4`}>
                    <Filter size={20} strokeWidth={1.5} />
                    {statusFilter !== 'All' && <span className="text-sm font-bold">{statusFilter}</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 rounded-xl border-gray-100 shadow-xl" align="end">
                  <div className="space-y-1">
                    {['All', 'Active', 'Inactive'].map((s) => (
                      <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === s ? 'bg-purple-50 text-purple-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}>{s}</button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <button className={`h-[50px] min-w-[50px] bg-white border ${sortConfig.key !== 'created_at' ? 'border-purple-200 text-purple-600 bg-purple-50' : 'border-gray-200 text-[#253154]'} rounded-xl hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-2 px-4`}>
                    <ArrowUpDown size={20} strokeWidth={1.5} />
                    <span className="hidden md:inline text-sm font-medium">Sort by</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-xl border-gray-100 shadow-xl" align="end">
                  <div className="space-y-1">
                    <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Field</div>
                    {[
                      { key: 'created_at', label: 'Recently Added' },
                      { key: 'service_name', label: 'Service Name' },
                      { key: 'provider', label: 'Provider' },
                      { key: 'popularity', label: 'Popularity' },
                      { key: 'countries_covered', label: 'Coverage' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setSortConfig(prev => ({ ...prev, key: item.key }))}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortConfig.key === item.key ? 'bg-purple-50 text-purple-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-1" />
                    <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Direction</div>
                    {[
                      { key: 'asc', label: 'Ascending' },
                      { key: 'desc', label: 'Descending' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setSortConfig(prev => ({ ...prev, order: item.key }))}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortConfig.order === item.key ? 'bg-purple-50 text-purple-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-2 px-4">
                    <Columns size={20} strokeWidth={1.5} />
                    <span className="hidden md:inline text-sm font-medium">Columns</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-xl border-gray-100 shadow-xl" align="end">
                  <div className="space-y-1">
                    <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                      <span>Visible Columns</span>
                      <button
                        onClick={() => setVisibleColumns(['id', 'service', 'provider', 'filingType', 'countries', 'status', 'visible'])}
                        className="text-purple-600 hover:underline capitalize font-normal text-[10px]"
                      >
                        Reset
                      </button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar-light pr-1 space-y-1">
                      {allColumns.map((col) => (
                        <button
                          key={col.key}
                          onClick={() => {
                            setVisibleColumns(prev =>
                              prev.includes(col.key)
                                ? (prev.length > 1 ? prev.filter(k => k !== col.key) : prev)
                                : [...prev, col.key]
                            );
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${visibleColumns.includes(col.key) ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white'}`}>
                            {visibleColumns.includes(col.key) && <Check size={10} className="text-white" strokeWidth={4} />}
                          </div>
                          {col.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><MoreHorizontal size={20} strokeWidth={1.5} /></button>
            </div>
          </div>

          {selectedTaxes.length > 0 && (<div className="bg-purple-50 px-6 py-3 flex items-center justify-between text-sm border-b border-purple-100 mb-6 rounded-t-2xl"><span className="text-purple-900 font-medium">{selectedTaxes.length} tax service{selectedTaxes.length !== 1 ? 's' : ''} selected</span><button onClick={() => setSelectedTaxes([])} className="text-purple-700 font-bold hover:underline">Clear</button></div>)}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]">
            {loading && (
              <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center">
                <RefreshCw size={40} className="text-purple-600 animate-spin" />
              </div>
            )}

            {/* Mobile View */}
            <div className="md:hidden space-y-4 p-4">
              {taxes.length > 0 ? (
                taxes.map((tax) => (
                  <MobileTaxCard
                    key={tax.id}
                    tax={tax}
                    isSelected={selectedTaxes.includes(tax.id.toString())}
                    onToggleSelect={() => setSelectedTaxes(prev => prev.includes(tax.id.toString()) ? prev.filter(x => x !== tax.id.toString()) : [...prev, tax.id.toString()])}
                    onEdit={(t) => { setEditTax(t); setShowAddDialog(true); }}
                    onDelete={handleDelete}
                    onNavigate={onNavigate}
                  />
                ))
              ) : (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <FileText size={24} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No data available</p>
                  <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                    There are no tax services matching your current filters.
                  </p>
                </div>
              )}
            </div>

            <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
              <table className="w-full">
                <thead><tr className="border-b border-gray-100">
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12"><CustomCheckbox checked={selectedTaxes.length === taxes.length && taxes.length > 0} partial={selectedTaxes.length > 0 && selectedTaxes.length < taxes.length} onChange={() => setSelectedTaxes(selectedTaxes.length === taxes.length ? [] : taxes.map(t => t.id.toString()))} /></th>
                  {visibleColumns.includes('id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50" onClick={() => setSortConfig({ key: 'tax_id', order: sortConfig.key === 'tax_id' && sortConfig.order === 'asc' ? 'desc' : 'asc' })}>Reference ID {sortConfig.key === 'tax_id' ? (sortConfig.order === 'asc' ? '↑' : '↓') : ''}</th>}
                  {visibleColumns.includes('service') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50" onClick={() => setSortConfig({ key: 'service_name', order: sortConfig.key === 'service_name' && sortConfig.order === 'asc' ? 'desc' : 'asc' })}>Service Name {sortConfig.key === 'service_name' ? (sortConfig.order === 'asc' ? '↑' : '↓') : ''}</th>}
                  {visibleColumns.includes('provider') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Provider</th>}
                  {visibleColumns.includes('filingType') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Filing Type</th>}
                  {visibleColumns.includes('countries') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Countries</th>}
                  {visibleColumns.includes('residencyType') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Residency Type</th>}
                  {visibleColumns.includes('complexity') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Complexity</th>}
                  {visibleColumns.includes('usageRate') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Usage Rate</th>}
                  {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Status</th>}
                  {visibleColumns.includes('visible') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visible</th>}
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {taxes.length > 0 ? taxes.map((tax) => (
                    <tr
                      key={tax.id}
                      onClick={() => onNavigate?.(`/services/taxes/${tax.id}`)}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedTaxes.includes(tax.id.toString()) ? 'bg-purple-50/30' : ''}`}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <CustomCheckbox checked={selectedTaxes.includes(tax.id.toString())} onChange={() => setSelectedTaxes(prev => prev.includes(tax.id.toString()) ? prev.filter(x => x !== tax.id.toString()) : [...prev, tax.id.toString()])} />
                      </td>
                      {visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{tax.tax_id}</td>}
                      {visibleColumns.includes('service') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold underline decoration-purple-200 decoration-2 underline-offset-4">{tax.service_name}</td>}
                      {visibleColumns.includes('provider') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tax.provider}</td>}
                      {visibleColumns.includes('filingType') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tax.filing_type}</td>}
                      {visibleColumns.includes('countries') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tax.countries_covered}</td>}
                      {visibleColumns.includes('residencyType') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tax.residency_type}</td>}
                      {visibleColumns.includes('complexity') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tax.complexity}</td>}
                      {visibleColumns.includes('usageRate') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tax.usage_rate}</td>}
                      {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={tax.status} /></td>}
                      {visibleColumns.includes('visible') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tax.student_visible ? 'Yes' : 'No'}</td>}
                      <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <PermissionGuard module="services" action="view">
                            <button
                              onClick={(e) => { e.stopPropagation(); onNavigate?.(`/services/taxes/${tax.id}`); }}
                              className="p-2 hover:bg-purple-50 rounded-lg transition-colors group/view"
                              title="View Details"
                            >
                              <Eye size={18} className="text-gray-400 group-hover/view:text-purple-600" />
                            </button>
                          </PermissionGuard>
                          <PermissionGuard module="services" action="edit">
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditTax(tax); setShowAddDialog(true); }}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                              title="Edit"
                            >
                              <Edit size={18} className="text-gray-400 group-hover:text-blue-600" />
                            </button>
                          </PermissionGuard>
                          <PermissionGuard module="services" action="delete">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(tax.id); }}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                              title="Delete"
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
                            <FileText size={24} className="text-gray-300" />
                          </div>
                          <p className="text-gray-500 font-medium">No results found</p>
                          <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                            We couldn't find any tax services matching your filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {taxes.length > 0 && (
              <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 rounded-tr-[30px] shadow-[0px_-5px_25px_rgba(0,0,0,0.03)] relative z-20 border-t border-gray-50">
                <div className="flex items-center gap-2"><span className="text-gray-500 text-sm font-medium">Rows per page:</span><button className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-gray-700">{rowsPerPage}<ChevronDown size={14} className="text-gray-400" /></button></div>
                <div className="text-sm text-gray-500 font-medium">Showing {taxes.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, totalCount)} of {totalCount} records</div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={18} strokeWidth={2} className="text-gray-500" /></button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.ceil(totalCount / rowsPerPage) }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setCurrentPage(p)} className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === p ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
                    ))}
                  </div>
                  <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / rowsPerPage), p + 1))} disabled={currentPage === Math.ceil(totalCount / rowsPerPage) || totalCount === 0} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={18} strokeWidth={2} className="text-gray-500" /></button>
                </div>
              </div>
            )}
          </div>
        </div>

        <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Taxes" totalCount={totalCount} selectedCount={selectedTaxes.length} columns={exportColumns} supportsDateRange={true} onExport={handleExport} />
        <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Taxes" fields={importFields} onImport={handleImport} templateUrl="/templates/taxes-import-template.xlsx" allowUpdate={true} />
        <AddTaxDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSave={handleSave} initialData={editTax} mode={editTax ? 'edit' : 'add'} />
      </>
    </TooltipProvider>
  );
};