import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check, Columns, Briefcase, Users, MapPin, TrendingUp } from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";
import { Edit, Trash2, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { AddEmploymentDialog } from './common/AddEmploymentDialog';
import {
  getAllEmployment,
  getEmploymentMetrics,
  createEmployment,
  updateEmployment,
  deleteEmployment,
  Employment
} from '@/app/services/employmentService';

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
const MobileEmploymentCard: React.FC<{
  item: Employment;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: (item: Employment) => void;
  onDelete: (id: string) => void;
}> = ({ item, isSelected, onToggleSelect, onEdit, onDelete }) => (
  <div className={`bg-white p-4 rounded-2xl border ${isSelected ? 'border-purple-600 bg-purple-50/30' : 'border-gray-100'} shadow-sm space-y-4`}>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <CustomCheckbox checked={isSelected} onChange={onToggleSelect} />
        <div>
          <h3 className="font-bold text-[#253154] text-[16px]">{item.platform}</h3>
          <p className="text-gray-500 text-xs">Ref: {item.reference_id || item.id}</p>
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
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job Types</p>
        <p className="text-sm font-medium text-gray-700">{item.job_types}</p>
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

interface EmploymentOverviewPageProps {
  onNavigate?: (page: string, params?: any) => void;
  onViewJob?: (jobId: string) => void;
}

export const EmploymentOverviewPage: React.FC<EmploymentOverviewPageProps> = ({ onNavigate, onViewJob }) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'platform', 'service_type', 'job_types', 'countries_covered', 'status', 'student_visible']);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Employment[]>([]);
  const [metricsData, setMetricsData] = useState<any>(null);

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Employment | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterServiceType, setFilterServiceType] = useState('all');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        search: debouncedSearch,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        service_type: filterServiceType !== 'all' ? filterServiceType : undefined,
        sort: sortField,
        order: sortOrder
      };
      const result = await getAllEmployment(params);
      setItems(result?.data || []);
      setTotalPages(result?.pagination?.totalPages || 1);

      const metrics = await getEmploymentMetrics();
      setMetricsData(metrics?.data || null);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch employment data");
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

  const toggleColumn = (col: string) => {
    setVisibleColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
  };

  const metrics = [
    { title: 'Job Platforms', value: metricsData?.totalPlatforms || '0', icon: Briefcase, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total employment platforms integrated' },
    { title: 'Active Job Listings', value: metricsData?.activeListings || '0', icon: TrendingUp, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Current active job postings' },
    { title: 'Countries Served', value: metricsData?.countriesServed || '0', icon: MapPin, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Countries with employment opportunities' },
    { title: 'Student Placements', value: metricsData?.studentPlacements || '0', icon: Users, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Students placed through platform' }
  ];

  const exportColumns: ExportColumn[] = [
    { id: 'reference_id', label: 'Reference ID', defaultSelected: true },
    { id: 'platform', label: 'Platform', defaultSelected: true },
    { id: 'service_type', label: 'Service Type', defaultSelected: true },
    { id: 'job_types', label: 'Job Types', defaultSelected: true },
    { id: 'countries_covered', label: 'Countries', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true }
  ];
  const importFields: ImportField[] = [
    { id: 'reference_id', label: 'Reference ID', required: false, type: 'text' },
    { id: 'platform', label: 'Platform', required: true, type: 'text' },
    { id: 'service_type', label: 'Service Type', required: true, type: 'select', options: ['Job Board', 'Career Platform', 'Freelance'] },
    { id: 'job_types', label: 'Job Types', required: true, type: 'text' },
    { id: 'countries_covered', label: 'Countries Covered', required: false, type: 'number' },
    { id: 'status', label: 'Status', required: false, type: 'select', options: ['active', 'inactive'] }
  ];

  const handleExport = async (options: any) => {
    try {
      setIsLoading(true);
      let dataToExport: any[] = [];

      if (options.scope === 'all') {
        const result = await getAllEmployment({ limit: 1000 });
        dataToExport = result.data;
      } else if (options.scope === 'selected') {
        dataToExport = items.filter(i => selected.includes(i.id));
      } else {
        dataToExport = items;
      }

      const mappedData = dataToExport.map(item => {
        const row: any = {};
        options.selectedColumns.forEach((colId: string) => {
          row[colId] = item[colId as keyof Employment];
        });
        return row;
      });

      if (options.format === 'json') {
        const blob = new Blob([JSON.stringify(mappedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `employment_export_${Date.now()}.json`;
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
              <title>Employment Export ${dateStr}</title>
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
                <h1>Employment Records Export</h1>
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
              <script>window.print();</script>
            </body>
          </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
      }

      toast.success("Export successful");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (data: any[]) => {
    try {
      setIsLoading(true);
      toast.info(`Importing ${data.length} records...`);
      for (const row of data) {
        await createEmployment(row);
      }
      toast.success(`Successfully imported ${data.length} records`);
      fetchData();
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import some records");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlatform = () => {
    setEditingItem(null);
    setDialogMode('add');
    setShowAddDialog(true);
  };

  const handleEditPlatform = (item: Employment) => {
    setEditingItem(item);
    setDialogMode('edit');
    setShowAddDialog(true);
  };

  const handleSavePlatform = async (data: any) => {
    try {
      if (dialogMode === 'edit' && editingItem) {
        await updateEmployment(editingItem.id, data);
      } else {
        await createEmployment(data);
      }
      fetchData();
    } catch (error) {
      console.error("Save error:", error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employment platform?")) return;
    try {
      await deleteEmployment(id);
      toast.success("Platform deleted");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete platform");
    }
  };

  const handleRefresh = () => {
    fetchData();
    toast.success("Data refreshed");
  };

  return (<TooltipProvider><div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">
    <div className="hidden md:flex justify-between items-center gap-4 mb-8">
      <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
        <Popover><PopoverTrigger asChild><button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"><CalendarIcon size={20} className="text-[#253154]" /><span className="font-medium text-[#253154] text-[14px]">Select date range</span></button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><CalendarComponent initialFocus mode="range" selected={date} onSelect={setDate} numberOfMonths={2} /></PopoverContent></Popover>
        <div className="w-px h-4 bg-gray-200 mx-2" /><button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500"><RefreshCw size={20} className="text-[#253154]" /></button>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Download size={20} />Export</button>
        <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Upload size={20} />Import</button>
        <button onClick={handleAddPlatform} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"><Plus size={20} />Add Platform</button>
      </div>
    </div>

    <div className="hidden lg:grid grid-cols-4 gap-5 mb-8">{metrics.map((m, i) => <MetricCard key={i} {...m} />)}</div>
    <div className="block lg:hidden mb-14 -mx-4"><Slider dots infinite={false} speed={500} slidesToShow={1.1} slidesToScroll={1} arrows={false} centerMode centerPadding='20px'>{metrics.map((m, i) => <div key={i} className="px-2 py-2"><MetricCard {...m} /></div>)}</Slider></div>

    <div className="hidden md:flex justify-between items-center gap-4 mb-6">
      <div className="relative flex-1"><Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search employment platforms..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" /></div>
      <div className="flex items-center gap-3 shrink-0">
        <Popover>
          <PopoverTrigger asChild>
            <button className={`h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center ${filterStatus !== 'all' || filterServiceType !== 'all' ? 'border-purple-600' : ''}`}><Filter size={20} /></button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
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
                  <option value="Job Board">Job Board</option>
                  <option value="Career Platform">Career Platform</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
              <button onClick={() => { setFilterStatus('all'); setFilterServiceType('all'); }} className="text-sm text-purple-600 hover:underline">Reset Filters</button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><ArrowUpDown size={20} /></button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="space-y-1">
              {[
                { label: 'Platform', value: 'platform' },
                { label: 'Service Type', value: 'service_type' },
                { label: 'Countries', value: 'countries_covered' },
                { label: 'Popularity', value: 'popularity' },
                { label: 'Date Created', value: 'created_at' }
              ].map((opt) => (
                <button
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
            <button className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><Columns size={20} /></button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="space-y-1">
              {[
                { id: 'id', label: 'ID' },
                { id: 'platform', label: 'Platform' },
                { id: 'service_type', label: 'Service Type' },
                { id: 'job_types', label: 'Job Types' },
                { id: 'countries_covered', label: 'Countries' },
                { id: 'status', label: 'Status' },
                { id: 'student_visible', label: 'Student Visible' }
              ].map((col) => (
                <button
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
      <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100">
            <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12"><CustomCheckbox checked={selected.length === items.length} partial={selected.length > 0 && selected.length < items.length} onChange={() => setSelected(selected.length === items.length ? [] : items.map(i => i.id))} /></th>
            {visibleColumns.includes('id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">ID</th>}
            {visibleColumns.includes('platform') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Platform</th>}
            {visibleColumns.includes('service_type') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Service Type</th>}
            {visibleColumns.includes('job_types') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Job Types</th>}
            {visibleColumns.includes('countries_covered') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Countries</th>}
            {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Status</th>}
            {visibleColumns.includes('student_visible') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visible</th>}
            <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={10} className="px-6 py-10 text-center text-gray-400"><RefreshCw size={24} className="animate-spin mx-auto mb-2" />Loading platforms...</td></tr>
            ) : (
              <>
                {/* Mobile View */}
                <div className="md:hidden space-y-4 p-4">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <MobileEmploymentCard
                        key={item.id}
                        item={item}
                        isSelected={selected.includes(item.id)}
                        onToggleSelect={() => setSelected(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])}
                        onEdit={handleEditPlatform}
                        onDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-3">
                      <Briefcase size={48} className="text-gray-200 mx-auto" />
                      <p className="text-gray-500 font-medium">No platforms found</p>
                    </div>
                  )}
                </div>

                {/* Desktop View Table rows */}
                {items.length === 0 ? (
                  <tr className="hidden md:table-row"><td colSpan={10} className="px-6 py-10 text-center text-gray-400">No platforms found</td></tr>
                ) : items.map((item) => (
                  <tr
                    key={item.id}
                    className={`hidden md:table-row hover:bg-gray-50 transition-colors cursor-pointer ${selected.includes(item.id) ? 'bg-purple-50/30' : ''}`}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('td:first-child') || (e.target as HTMLElement).closest('td:last-child')) return;
                      onNavigate?.('employment-provider-detail', { id: item.id });
                    }}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><CustomCheckbox checked={selected.includes(item.id)} onChange={() => setSelected(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])} /></td>
                    {visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{item.reference_id || item.id}</td>}
                    {visibleColumns.includes('platform') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold underline decoration-purple-200 decoration-2 underline-offset-4">{item.platform}</td>}
                    {visibleColumns.includes('service_type') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.service_type}</td>}
                    {visibleColumns.includes('job_types') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.job_types}</td>}
                    {visibleColumns.includes('countries_covered') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.countries_covered}</td>}
                    {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.status} /></td>}
                    {visibleColumns.includes('student_visible') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.student_visible ? 'Yes' : 'No'}</td>}
                    <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditPlatform(item); }}
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
              </>
            )}
          </tbody>
        </table>
      </div>
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
  </div>
    <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Employment" totalCount={metricsData?.totalPlatforms || 0} selectedCount={selected.length} columns={exportColumns} supportsDateRange={false} onExport={handleExport} />
    <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Employment" fields={importFields} onImport={handleImport} templateUrl="/templates/employment-import-template.xlsx" allowUpdate={true} />
    <AddEmploymentDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSave={handleSavePlatform} initialData={editingItem} mode={dialogMode} />
  </TooltipProvider>);
};