import React, { useState } from 'react';
import {
  Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal,
  Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check,
  Columns, Target, TrendingUp, Clock, CheckCircle, XCircle, LayoutGrid, List,
  UserCircle, Percent, Timer, X
} from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { CustomSelect } from './common/CustomSelect';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CustomCheckboxProps {
  checked: boolean;
  partial?: boolean;
  onChange: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, partial = false, onChange }) => (
  <div
    onClick={onChange}
    className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'
      }`}
  >
    {checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}
    {partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}
  </div>
);

interface StatusBadgeProps {
  status: 'new' | 'contacted' | 'qualified' | 'proposal-sent' | 'converted' | 'lost';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    'new': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', label: 'New' },
    contacted: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', label: 'Contacted' },
    qualified: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', label: 'Qualified' },
    'proposal-sent': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300', label: 'Proposal Sent' },
    converted: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Converted' },
    lost: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'Lost' }
  }[status];

  return (
    <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[120px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const config = score >= 80
    ? { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'Hot', icon: '🔥' }
    : score >= 50
      ? { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', label: 'Warm', icon: '☀️' }
      : { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', label: 'Cold', icon: '❄️' };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <span className={`px-3 py-1 rounded-lg text-[12px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
              {config.icon} {score}
            </span>
            <span className={`px-2 py-1 rounded text-[10px] font-semibold ${config.bg} ${config.text}`}>
              {config.label}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2">
          <p>System calculated score</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  bgClass: string;
  colorClass: string;
  tooltip: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
    <div className="flex items-center justify-between">
      <span className="text-[#253154] font-medium text-[15px]">{title}</span>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors">i</div>
          </TooltipTrigger>
          <TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2"><p>{tooltip}</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div className="flex items-end gap-3 mt-2">
      <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}>
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div><p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p></div>
    </div>
    <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500"><Icon size={80} /></div>
  </div>
);

interface Lead {
  id: string;
  leadId: string;
  dateCreated: string;
  studentName: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal-sent' | 'converted' | 'lost';
  score: number;
  assignedCounselor?: string;
}

interface KanbanCardProps {
  lead: Lead;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ lead }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-move mb-3"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-[#0f172b] text-sm">{lead.studentName}</h4>
        <ScoreBadge score={lead.score} />
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-medium">Source:</span>
          <span className="px-2 py-1 bg-gray-100 rounded">{lead.source}</span>
        </div>

        {lead.assignedCounselor && (
          <div className="flex items-center gap-2">
            <UserCircle size={14} />
            <span>{lead.assignedCounselor}</span>
          </div>
        )}

        <div className="text-gray-500 text-[11px] mt-2">
          {format(new Date(lead.dateCreated), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  );
};

interface LeadStatusOverviewPageProps {
  onNavigate?: (page: string, leadId?: string) => void;
}

const LeadStatusOverviewPage: React.FC<LeadStatusOverviewPageProps> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) });
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['leadId', 'dateCreated', 'studentName', 'email', 'phone', 'source', 'assignedCounselor', 'score', 'status']);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterCounselor, setFilterCounselor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterScoreMin, setFilterScoreMin] = useState('');
  const [filterScoreMax, setFilterScoreMax] = useState('');
  const [filterSource, setFilterSource] = useState('');

  const [leads, setLeads] = useState<Lead[]>([
    { id: 'LEAD-001', leadId: 'LEAD-001', dateCreated: '2025-01-15T10:30:00', studentName: 'Alex Johnson', email: 'alex.j@email.com', phone: '+1-555-0101', source: 'Website', status: 'new', score: 85, assignedCounselor: 'Sarah Johnson' },
    { id: 'LEAD-002', leadId: 'LEAD-002', dateCreated: '2025-01-16T11:45:00', studentName: 'Maria Garcia', email: 'maria.g@email.com', phone: '+1-555-0102', source: 'Referral', status: 'contacted', score: 92, assignedCounselor: 'Mike Davis' },
    { id: 'LEAD-003', leadId: 'LEAD-003', dateCreated: '2025-01-17T09:20:00', studentName: 'David Lee', email: 'david.l@email.com', phone: '+1-555-0103', source: 'Social Media', status: 'qualified', score: 78, assignedCounselor: 'Sarah Johnson' },
    { id: 'LEAD-004', leadId: 'LEAD-004', dateCreated: '2025-01-18T14:15:00', studentName: 'Sophie Turner', email: 'sophie.t@email.com', phone: '+1-555-0104', source: 'Email Campaign', status: 'proposal-sent', score: 95, assignedCounselor: 'Emma Wilson' },
    { id: 'LEAD-005', leadId: 'LEAD-005', dateCreated: '2025-01-19T16:00:00', studentName: 'James Wilson', email: 'james.w@email.com', phone: '+1-555-0105', source: 'Website', status: 'converted', score: 88, assignedCounselor: 'David Chen' },
    { id: 'LEAD-006', leadId: 'LEAD-006', dateCreated: '2025-01-20T13:30:00', studentName: 'Emma Brown', email: 'emma.b@email.com', phone: '+1-555-0106', source: 'Referral', status: 'lost', score: 45, assignedCounselor: 'Sarah Johnson' },
  ]);

  const metrics = [
    { title: 'Total Leads', value: '324', icon: Target, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total leads generated in selected period' },
    { title: 'New Leads', value: '87', icon: TrendingUp, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'New leads not yet contacted' },
    { title: 'Qualified', value: '142', icon: Clock, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Leads qualified and in progress' },
    { title: 'Converted', value: '68', icon: CheckCircle, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Leads successfully converted to customers' },
    { title: 'Conversion Rate', value: '21%', icon: Percent, bgClass: 'bg-emerald-50', colorClass: 'text-emerald-600', tooltip: 'Percentage of leads converted to customers' }
  ];

  const handleRefresh = () => toast.success("Refreshing data...");

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
      setSelectAllStore(false);
    } else {
      setSelectedLeads(leads.map(l => l.id));
      setSelectAllStore(false);
    }
  };

  const handleToggleLead = (leadId: string) => {
    setSelectedLeads(prev => prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]);
  };

  const handleReassignLead = (leadId: string) => {
    toast.success(`Reassigning lead ${leadId}...`);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = leads.findIndex((lead) => lead.id === active.id);
      const newStatus = over.id as Lead['status'];

      setLeads((items) => {
        const newItems = [...items];
        newItems[oldIndex] = { ...newItems[oldIndex], status: newStatus };
        return newItems;
      });

      toast.success(`Lead status updated to ${newStatus}`);
    }
  };

  const getLeadsByStatus = (status: Lead['status']) => {
    return leads.filter(lead => lead.status === status);
  };

  const kanbanColumns: Array<{ id: Lead['status']; title: string; color: string }> = [
    { id: 'new', title: 'New', color: 'bg-blue-50' },
    { id: 'contacted', title: 'Contacted', color: 'bg-purple-50' },
    { id: 'qualified', title: 'Qualified', color: 'bg-amber-50' },
    { id: 'proposal-sent', title: 'Proposal Sent', color: 'bg-indigo-50' },
    { id: 'converted', title: 'Converted', color: 'bg-green-50' },
    { id: 'lost', title: 'Lost', color: 'bg-red-50' },
  ];

  const exportColumns: ExportColumn[] = [
    { id: 'leadId', label: 'Lead ID', defaultSelected: true },
    { id: 'dateCreated', label: 'Date Created', defaultSelected: true },
    { id: 'studentName', label: 'Student Name', defaultSelected: true },
    { id: 'email', label: 'Email', defaultSelected: true },
    { id: 'phone', label: 'Phone', defaultSelected: true },
    { id: 'source', label: 'Source', defaultSelected: true },
    { id: 'assignedCounselor', label: 'Assigned Counselor', defaultSelected: true },
    { id: 'score', label: 'Lead Score', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true }
  ];

  const importFields: ImportField[] = [
    { id: 'leadId', label: 'Lead ID', required: true, type: 'text' },
    { id: 'dateCreated', label: 'Date Created', required: true, type: 'date' },
    { id: 'studentName', label: 'Student Name', required: true, type: 'text' },
    { id: 'email', label: 'Email', required: true, type: 'email' },
    { id: 'phone', label: 'Phone', required: true, type: 'text' },
    { id: 'source', label: 'Source', required: true, type: 'select', options: ['Website', 'Referral', 'Social Media', 'Email Campaign'] },
    { id: 'score', label: 'Lead Score', required: true, type: 'number' },
    { id: 'assignedCounselor', label: 'Assigned Counselor', required: false, type: 'text' },
    { id: 'status', label: 'Status', required: true, type: 'select', options: ['new', 'contacted', 'qualified', 'proposal-sent', 'converted', 'lost'] }
  ];

  const handleExport = async (options: any) => {
    toast.success(`Exporting ${options.scope} leads as ${options.format}...`);
  };

  const handleImport = async (data: any) => {
    toast.success(`Importing ${data.length} leads...`);
  };

  const slickSettings = {
    dots: false, infinite: false, speed: 500, slidesToShow: 5, slidesToScroll: 1, arrows: true,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 4 } },
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
    ]
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-10 py-6 md:py-10 bg-gray-50 min-h-screen" >

      <div className="max-w-[1600px] mx-auto">

        {/* Desktop Action Bar */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-8">
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
            <button className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium">
              <Plus size={20} strokeWidth={1.5} />Add Lead
            </button>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="flex md:hidden flex-col gap-4 mb-6">
          <div className="w-full h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <CalendarIcon size={18} className="text-[#253154]" />
              <span className="text-sm font-medium text-[#253154]">{date?.from && date?.to ? `${format(date.from, 'd MMM')} - ${format(date.to, 'd MMM')}` : 'Select range'}</span>
            </div>
            <button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-full transition-colors active:rotate-180 active:duration-500">
              <RefreshCw size={18} className="text-[#253154]" />
            </button>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 h-[50px] bg-[#0e042f] text-white rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 font-medium">
              <Plus size={20} />Add Lead
            </button>
            <button className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center">
              <MoreHorizontal size={22} className="text-[#253154]" />
            </button>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {metrics.map((metric, index) => <MetricCard key={index} {...metric} />)}
        </div>

        <div className="block lg:hidden mb-14 -mx-4">
          <Slider {...slickSettings}>
            {metrics.map((metric, index) => (
              <div key={index} className="px-2 py-2"><MetricCard {...metric} /></div>
            ))}
          </Slider>
        </div>

        {/* Search & Filters Toolbar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input type="text" placeholder="Search leads..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" />
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
          >
            <Filter size={20} strokeWidth={1.5} />
          </button>
          <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
            <ArrowUpDown size={20} strokeWidth={1.5} />
          </button>
          <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
            <Columns size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#0f172b]">Advanced Filters</h3>
              <button onClick={() => setShowAdvancedFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0f172b] mb-2">Status</label>
                <CustomSelect
                  value={filterStatus}
                  onChange={setFilterStatus}
                  options={[
                    { value: '', label: 'All Statuses' },
                    { value: 'new', label: 'New' },
                    { value: 'contacted', label: 'Contacted' },
                    { value: 'qualified', label: 'Qualified' },
                    { value: 'proposal-sent', label: 'Proposal Sent' },
                    { value: 'converted', label: 'Converted' },
                    { value: 'lost', label: 'Lost' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f172b] mb-2">Source</label>
                <CustomSelect
                  value={filterSource}
                  onChange={setFilterSource}
                  options={[
                    { value: '', label: 'All Sources' },
                    { value: 'website', label: 'Website' },
                    { value: 'referral', label: 'Referral' },
                    { value: 'social-media', label: 'Social Media' },
                    { value: 'email-campaign', label: 'Email Campaign' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f172b] mb-2">Score Range (Min)</label>
                <input
                  type="number"
                  value={filterScoreMin}
                  onChange={(e) => setFilterScoreMin(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f172b] mb-2">Score Range (Max)</label>
                <input
                  type="number"
                  value={filterScoreMax}
                  onChange={(e) => setFilterScoreMax(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => {
                  setFilterStatus('');
                  setFilterSource('');
                  setFilterScoreMin('');
                  setFilterScoreMax('');
                  setFilterCounselor('');
                  toast.success('Filters cleared');
                }}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Clear Filters
              </button>
              <button
                onClick={() => {
                  toast.success('Filters applied');
                  setShowAdvancedFilters(false);
                }}
                className="px-5 py-2.5 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0c4a] transition-colors font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="w-12 px-6 py-4 text-left">
                      <CustomCheckbox checked={selectedLeads.length === leads.length} partial={selectedLeads.length > 0 && selectedLeads.length < leads.length} onChange={handleSelectAll} />
                    </th>
                    {visibleColumns.includes('leadId') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lead ID</th>}
                    {visibleColumns.includes('dateCreated') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date Created</th>}
                    {visibleColumns.includes('studentName') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Student</th>}
                    {visibleColumns.includes('email') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</th>}
                    {visibleColumns.includes('phone') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone</th>}
                    {visibleColumns.includes('source') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Source</th>}
                    {visibleColumns.includes('assignedCounselor') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Assigned Counselor</th>}
                    {visibleColumns.includes('score') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Score</th>}
                    {visibleColumns.includes('status') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>}
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => onNavigate?.('lead-detail', lead.id)}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    >
                      <td
                        className="px-6 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CustomCheckbox checked={selectedLeads.includes(lead.id)} onChange={() => handleToggleLead(lead.id)} />
                      </td>
                      {visibleColumns.includes('leadId') && <td className="px-6 py-4"><span className="text-[14px] font-bold text-[#253154]">{lead.leadId}</span></td>}
                      {visibleColumns.includes('dateCreated') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{format(new Date(lead.dateCreated), 'MMM d, yyyy')}</span></td>}
                      {visibleColumns.includes('studentName') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{lead.studentName}</span></td>}
                      {visibleColumns.includes('email') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{lead.email}</span></td>}
                      {visibleColumns.includes('phone') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{lead.phone}</span></td>}
                      {visibleColumns.includes('source') && <td className="px-6 py-4"><span className="text-[12px] font-medium text-gray-600">{lead.source}</span></td>}
                      {visibleColumns.includes('assignedCounselor') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{lead.assignedCounselor || 'Unassigned'}</span></td>}
                      {visibleColumns.includes('score') && <td className="px-6 py-4"><ScoreBadge score={lead.score} /></td>}
                      {visibleColumns.includes('status') && <td className="px-6 py-4"><StatusBadge status={lead.status} /></td>}
                      <td
                        className="px-6 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleReassignLead(lead.id)}
                          className="p-2 hover:bg-purple-50 rounded-lg transition-colors text-purple-600"
                        >
                          <UserCircle size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
                  10<ChevronDown size={14} />
                </button>
                <span className="text-sm text-gray-600 ml-4">1-{Math.min(10, leads.length)} of {leads.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={18} /></button>
                <span className="text-sm text-gray-600">Page 1 of 1</span>
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        )}

        {/* Kanban View */}
        {viewMode === 'kanban' && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {kanbanColumns.map((column) => (
                <div key={column.id} className="bg-gray-100 rounded-2xl p-4 min-h-[500px]">
                  <div className={`${column.color} rounded-xl p-3 mb-4`}>
                    <h3 className="font-bold text-[#0f172b] text-sm">{column.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{getLeadsByStatus(column.id).length} leads</p>
                  </div>

                  <SortableContext items={getLeadsByStatus(column.id).map(l => l.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {getLeadsByStatus(column.id).map((lead) => (
                        <div key={lead.id} onClick={() => onNavigate?.('lead-detail', lead.id)}>
                          <KanbanCard lead={lead} />
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </div>
              ))}
            </div>
          </DndContext>
        )}
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Leads"
        totalCount={leads.length}
        selectedCount={selectedLeads.length}
        columns={exportColumns}
        supportsDateRange={true}
        onExport={handleExport}
      />
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Leads"
        fields={importFields}
        onImport={handleImport}
        allowUpdate={true}
      />
    </div >
  );
};

export default LeadStatusOverviewPage;