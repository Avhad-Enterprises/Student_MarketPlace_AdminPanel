import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check, Columns, FileText, CheckCircle, Eye, Sparkles, Loader2, Edit2, Trash2 } from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar"; import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"; import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"; import { toast } from "sonner"; import { DateRange } from "react-day-picker"; import Slider from "react-slick"; import { ExportDialog, ExportColumn } from './common/ExportDialog'; import { ImportDialog, ImportField } from './common/ImportDialog';
import { sopAssistantService, SOP, SOPStats } from '@/services/sopAssistantService';
import { format } from 'date-fns';
import { SOPFormDialog } from './common/SOPFormDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const CustomCheckbox: React.FC<{ checked: boolean; partial?: boolean; onChange: () => void }> = ({ checked, partial, onChange }) => (<div onClick={onChange} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'}`}>{checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}{partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}</div>);
const StatusBadge: React.FC<{ status: 'active' | 'inactive' }> = ({ status }) => { const c = { 'active': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Active' }, 'inactive': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', label: 'Inactive' } }[status]; return (<span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${c.bg} ${c.text} ${c.border}`}>{c.label}</span>); };
const MetricCard: React.FC<{ title: string; value: string; icon: React.ElementType; bgClass: string; colorClass: string; tooltip: string }> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => (<div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50"><div className="flex items-center justify-between"><span className="text-[#253154] font-medium text-[15px]">{title}</span><TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help">i</div></TooltipTrigger><TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2"><p>{tooltip}</p></TooltipContent></Tooltip></TooltipProvider></div><div className="flex items-end gap-3 mt-2"><div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}><Icon size={22} strokeWidth={1.5} /></div><div><p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p></div></div><div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500"><Icon size={80} /></div></div>);

export const SOPAssistantOverviewPage: React.FC = () => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'studentName', 'country', 'university', 'reviewStatus', 'aiScore', 'status']);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [items, setItems] = useState<SOP[]>([]);
  const [stats, setStats] = useState<SOPStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sorting and Filtering State
  const [sortConfig, setSortConfig] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'id', order: 'desc' });
  const [filters, setFilters] = useState<{ status?: string; country?: string; reviewStatus?: string }>({});
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // New State for Form Dialog
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingSOP, setEditingSOP] = useState<SOP | null>(null);

  // Search Debouncing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const apiFilters = {
        search: debouncedSearch,
        startDate: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
        endDate: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order,
        ...filters
      };

      const [sopsData, statsData] = await Promise.all([
        sopAssistantService.getSOPs(apiFilters),
        sopAssistantService.getStats()
      ]);

      setItems(sopsData.data || []);
      setStats(statsData.data || null);
    } catch (error) {
      toast.error("Failed to fetch SOP data");
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [debouncedSearch, date, sortConfig, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleRefresh = () => {
    fetchData(true);
  };

  const handleCreateSOP = () => {
    setFormMode('add');
    setEditingSOP(null);
    setShowFormDialog(true);
  };

  const handleEditSOP = (sop: SOP) => {
    setFormMode('edit');
    setEditingSOP(sop);
    setShowFormDialog(true);
  };

  const handleFormSubmit = async (data: Partial<SOP>) => {
    if (formMode === 'add') {
      await sopAssistantService.createSOP(data);
    } else if (editingSOP) {
      await sopAssistantService.updateSOP(editingSOP.id, data);
    }
    fetchData(true);
  };

  const metrics = [
    { title: 'SOP Drafts Created', value: stats?.draftsCreated?.toLocaleString() || '0', icon: FileText, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total SOP drafts created' },
    { title: 'SOPs Completed', value: stats?.reviewedSOPs?.toLocaleString() || '0', icon: CheckCircle, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Completed and finalized SOPs' },
    { title: 'SOPs Under Review', value: ((stats?.totalSOPs || 0) - (stats?.draftsCreated || 0) - (stats?.reviewedSOPs || 0)).toLocaleString() || '0', icon: Eye, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'SOPs currently under review' },
    { title: 'AI Confidence Score', value: stats?.avgConfidence || '0%', icon: Sparkles, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Average AI confidence score across all SOPs' }
  ];

  const exportColumns: ExportColumn[] = [{ id: 'sopId', label: 'SOP ID', defaultSelected: true }, { id: 'studentName', label: 'Student Name', defaultSelected: true }, { id: 'university', label: 'University', defaultSelected: true }, { id: 'reviewStatus', label: 'Review Status', defaultSelected: true }, { id: 'aiConfidenceScore', label: 'AI Confidence Score', defaultSelected: false }];
  const importFields: ImportField[] = [{ id: 'sopId', label: 'SOP ID', required: false, type: 'text' }, { id: 'studentName', label: 'Student Name', required: true, type: 'text' }, { id: 'university', label: 'University', required: true, type: 'text' }, { id: 'reviewStatus', label: 'Review Status', required: false, type: 'select', options: ['Draft', 'Under Review', 'Completed', 'Approved'] }];

  const handleExport = async (options: any) => {
    toast.success(`Exporting ${options.scope} records as ${options.format.toUpperCase()}`);
    await new Promise(r => setTimeout(r, 2000));
  };

  const handleImport = async (data: any[]) => {
    toast.success(`Successfully imported ${data.length} records`);
  };

  return (<TooltipProvider><div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light"><div className="hidden md:flex justify-between items-center gap-4 mb-8"><div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center"><Popover><PopoverTrigger asChild><button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"><CalendarIcon size={20} className="text-[#253154]" /><span className="font-medium text-[#253154] text-[14px]">{date?.from ? (date.to ? `${format(date.from, 'LLL dd')} - ${format(date.to, 'LLL dd')}` : format(date.from, 'LLL dd')) : 'Select date range'}</span></button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><CalendarComponent initialFocus mode="range" selected={date} onSelect={setDate} numberOfMonths={2} /></PopoverContent></Popover><div className="w-px h-4 bg-gray-200 mx-2" /><button onClick={handleRefresh} className={`p-2 hover:bg-gray-50 rounded-full transition-all duration-500 ${isRefreshing ? 'animate-spin' : 'hover:rotate-180'}`}><RefreshCw size={20} className="text-[#253154]" /></button></div><div className="flex items-center gap-3"><button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Download size={20} />Export</button><button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Upload size={20} />Import</button><button onClick={handleCreateSOP} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"><Plus size={20} />New SOP</button></div></div><div className="hidden lg:grid grid-cols-4 gap-5 mb-8">{metrics.map((m, i) => <MetricCard key={i} {...m} />)}</div><div className="block lg:hidden mb-14 -mx-4"><Slider dots infinite={false} speed={500} slidesToShow={1.1} slidesToScroll={1} arrows={false} centerMode centerPadding='20px'>{metrics.map((m, i) => <div key={i} className="px-2 py-2"><MetricCard {...m} /></div>)}</Slider></div><div className="hidden md:flex justify-between items-center gap-4 mb-6"><div className="relative flex-1"><Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search SOPs..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" /></div><div className="flex items-center gap-3 shrink-0">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center relative">
          <Filter size={20} />
          {Object.keys(filters).length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] p-2">
        <div className="text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">Filter By Status</div>
        {['active', 'inactive'].map(s => (
          <DropdownMenuItem key={s} onClick={() => setFilters(prev => ({ ...prev, status: prev.status === s ? undefined : s }))} className="flex items-center justify-between">
            <span className="capitalize">{s}</span>
            {filters.status === s && <Check size={14} className="text-purple-600" />}
          </DropdownMenuItem>
        ))}
        <div className="h-px bg-gray-100 my-1" />
        <div className="text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">Review Status</div>
        {['Draft', 'Under Review', 'Completed', 'Approved'].map(rs => (
          <DropdownMenuItem key={rs} onClick={() => setFilters(prev => ({ ...prev, reviewStatus: prev.reviewStatus === rs ? undefined : rs }))} className="flex items-center justify-between">
            <span>{rs}</span>
            {filters.reviewStatus === rs && <Check size={14} className="text-purple-600" />}
          </DropdownMenuItem>
        ))}
        {Object.keys(filters).length > 0 && (
          <>
            <div className="h-px bg-gray-100 my-1" />
            <DropdownMenuItem onClick={() => setFilters({})} className="text-red-600 font-medium justify-center italic">Clear All Filters</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center relative">
          <ArrowUpDown size={20} />
          {sortConfig.field !== 'id' && <span className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <div className="text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">Sort By</div>
        {[
          { id: 'student_name', label: 'Student Name' },
          { id: 'university', label: 'University' },
          { id: 'country', label: 'Country' },
          { id: 'created_at', label: 'Date Created' }
        ].map(s => (
          <DropdownMenuItem key={s.id} onClick={() => handleSort(s.id)} className="flex items-center justify-between">
            <span>{s.label}</span>
            {sortConfig.field === s.id && <Check size={14} className="text-purple-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center">
          <Columns size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <div className="text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">Visible Columns</div>
        {[
          { id: 'id', label: 'ID' },
          { id: 'studentName', label: 'Student' },
          { id: 'country', label: 'Country' },
          { id: 'university', label: 'University' },
          { id: 'reviewStatus', label: 'Review Status' },
          { id: 'aiScore', label: 'AI Score' },
          { id: 'status', label: 'Status' }
        ].map(col => (
          <DropdownMenuItem key={col.id} onClick={() => setVisibleColumns(prev => prev.includes(col.id) ? prev.filter(c => c !== col.id) : [...prev, col.id])} className="flex items-center justify-between">
            <span>{col.label}</span>
            {visibleColumns.includes(col.id) && <Check size={14} className="text-purple-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div></div>
    {selected.length > 0 && (<div className="bg-purple-50 px-6 py-3 flex items-center justify-between text-sm border-b border-purple-100 mb-6 rounded-t-2xl"><span className="text-purple-900 font-medium">{selected.length} SOP{selected.length !== 1 ? 's' : ''} selected</span><div className="flex gap-3"><button className="text-purple-700 font-bold hover:underline">Mark Reviewed</button><button onClick={() => setSelected([])} className="text-purple-700 font-bold hover:underline">Clear</button></div></div>)}<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"><div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]"><table className="w-full"><thead><tr className="border-b border-gray-100"><th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12"><CustomCheckbox checked={selected.length === items.length && items.length > 0} partial={selected.length > 0 && selected.length < items.length} onChange={() => setSelected(selected.length === items.length ? [] : items.map(i => i.id))} /></th>
      {visibleColumns.includes('id') && (
        <th
          className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50 group"
          onClick={() => handleSort('id')}
        >
          <div className="flex items-center gap-1">
            ID
            <ArrowUpDown size={14} className={`transition-opacity ${sortConfig.field === 'id' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
          </div>
        </th>
      )}
      {visibleColumns.includes('studentName') && (
        <th
          className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50 group"
          onClick={() => handleSort('student_name')}
        >
          <div className="flex items-center gap-1">
            Student
            <ArrowUpDown size={14} className={`transition-opacity ${sortConfig.field === 'student_name' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
          </div>
        </th>
      )}
      {visibleColumns.includes('country') && (
        <th
          className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50 group"
          onClick={() => handleSort('country')}
        >
          <div className="flex items-center gap-1">
            Country
            <ArrowUpDown size={14} className={`transition-opacity ${sortConfig.field === 'country' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
          </div>
        </th>
      )}
      {visibleColumns.includes('university') && (
        <th
          className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50 group"
          onClick={() => handleSort('university')}
        >
          <div className="flex items-center gap-1">
            University
            <ArrowUpDown size={14} className={`transition-opacity ${sortConfig.field === 'university' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
          </div>
        </th>
      )}
      {visibleColumns.includes('reviewStatus') && (
        <th
          className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50 group"
          onClick={() => handleSort('review_status')}
        >
          <div className="flex items-center gap-1">
            Review Status
            <ArrowUpDown size={14} className={`transition-opacity ${sortConfig.field === 'review_status' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
          </div>
        </th>
      )}
      {visibleColumns.includes('aiScore') && (
        <th
          className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50 group"
          onClick={() => handleSort('ai_confidence_score')}
        >
          <div className="flex items-center gap-1">
            AI Score
            <ArrowUpDown size={14} className={`transition-opacity ${sortConfig.field === 'ai_confidence_score' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
          </div>
        </th>
      )}
      {visibleColumns.includes('status') && (
        <th
          className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase cursor-pointer hover:bg-gray-50 group"
          onClick={() => handleSort('status')}
        >
          <div className="flex items-center gap-1">
            Status
            <ArrowUpDown size={14} className={`transition-opacity ${sortConfig.field === 'status' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
          </div>
        </th>
      )}
      <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th></tr></thead>
      <tbody className="divide-y divide-gray-50">{isLoading ? (<tr><td colSpan={visibleColumns.length + 2} className="px-6 py-20 text-center"><div className="flex flex-col items-center gap-3"><Loader2 className="w-10 h-10 text-purple-600 animate-spin" /><p className="text-gray-500 font-medium">Loading SOP records...</p></div></td></tr>) : items.length === 0 ? (<tr><td colSpan={visibleColumns.length + 2} className="px-6 py-20 text-center"><p className="text-gray-500 font-medium">No SOP records found.</p></td></tr>) : items.map((item) => (<tr key={item.id} className={`hover:bg-gray-50 transition-colors ${selected.includes(item.id) ? 'bg-purple-50/30' : ''}`}><td className="px-6 py-4"><CustomCheckbox checked={selected.includes(item.id)} onChange={() => setSelected(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])} /></td>{visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{item.id}</td>}{visibleColumns.includes('studentName') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.studentName}</td>}{visibleColumns.includes('country') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.country}</td>}{visibleColumns.includes('university') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.university}</td>}{visibleColumns.includes('reviewStatus') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.reviewStatus}</td>}{visibleColumns.includes('aiScore') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.aiConfidenceScore}</td>}{visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.status} /></td>}<td className="px-6 py-4 whitespace-nowrap text-sm"><DropdownMenu><DropdownMenuTrigger asChild><button className="p-1 hover:bg-gray-100 rounded transition-colors"><MoreHorizontal size={18} className="text-gray-400" /></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-[160px]"><DropdownMenuItem onClick={() => handleEditSOP(item)} className="gap-2"><Edit2 size={14} /> Edit</DropdownMenuItem><DropdownMenuItem className="gap-2 text-red-600"><Trash2 size={14} /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></td></tr>))}</tbody></table></div><div className="h-[80px] bg-white flex items-center justify-between px-6 border-t border-gray-50"><div className="flex items-center gap-2"><span className="text-gray-500 text-sm font-medium">Rows per page:</span><button className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-gray-700">{rowsPerPage}<ChevronDown size={14} className="text-gray-400" /></button></div><div className="flex items-center gap-3"><button className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"><ChevronLeft size={18} strokeWidth={2} className="text-gray-500" /></button><button className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"><ChevronRight size={18} strokeWidth={2} className="text-gray-500" /></button></div></div></div></div><ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="SOP Assistant" totalCount={stats?.draftsCreated || 0} selectedCount={selected.length} columns={exportColumns} supportsDateRange={false} onExport={handleExport} /><ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="SOP Assistant" fields={importFields} onImport={handleImport} templateUrl="/templates/sop-assistant-import-template.xlsx" allowUpdate={true} /><SOPFormDialog open={showFormDialog} onOpenChange={setShowFormDialog} onSubmit={handleFormSubmit} initialData={editingSOP} mode={formMode} /></TooltipProvider>);
};