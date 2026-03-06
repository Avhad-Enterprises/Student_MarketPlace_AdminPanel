import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal,
  Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check,
  Columns, Target, TrendingUp, Clock, CheckCircle, XCircle, LayoutGrid, List,
  UserCircle, Percent, Timer, X, AlertOctagon, Ban
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
import { leadStatusService, LeadStatus, LeadMetrics } from '../../services/leadStatusService';
import LeadModal from './LeadModal';

interface CustomCheckboxProps {
  checked: boolean;
  partial?: boolean;
  onChange: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, partial = false, onChange }) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      onChange();
    }}
    className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'
      }`}
  >
    {checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}
    {partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}
  </div>
);

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = status?.toLowerCase() || 'new';
  const config: any = {
    'new': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', label: 'New' },
    'contacted': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', label: 'Contacted' },
    'qualified': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', label: 'Qualified' },
    'proposal-sent': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300', label: 'Proposal Sent' },
    'converted': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Converted' },
    'lost': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'Lost' },
    'application': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300', label: 'Application' },
    'visa': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', label: 'Visa' },
    'completed': { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', label: 'Completed' },
  }[s] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', label: status };

  return (
    <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[120px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

interface RiskBadgeProps {
  level: string;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const l = level?.toLowerCase() || 'low';
  const config: any = {
    'high': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'High Risk', icon: <AlertOctagon size={12} /> },
    'medium': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', label: 'Med Risk', icon: <TrendingUp size={12} /> },
    'low': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Low Risk', icon: <CheckCircle size={12} /> },
  }[l];

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
      {config.icon}
      {config.label}
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
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

interface KanbanCardProps {
  lead: LeadStatus;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ lead }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.db_id.toString() });

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
        <h4 className="font-semibold text-[#0f172b] text-sm">{lead.first_name} {lead.last_name}</h4>
        <RiskBadge level={lead.risk_level} />
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-medium">Country:</span>
          <span className="px-2 py-1 bg-gray-100 rounded">{lead.country}</span>
        </div>

        {lead.counselor && (
          <div className="flex items-center gap-2">
            <UserCircle size={14} />
            <span>{lead.counselor}</span>
          </div>
        )}

        {lead.last_update && (
          <div className="text-gray-500 text-[11px] mt-2">
            Last update: {format(new Date(lead.last_update), 'MMM d, yyyy')}
          </div>
        )}
      </div>
    </div>
  );
};

interface LeadStatusOverviewPageProps {
  onNavigate?: (page: string, leadId?: string) => void;
}

const LeadStatusOverviewPage: React.FC<LeadStatusOverviewPageProps> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2025, 0, 1), to: new Date(2026, 11, 31) });
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['leadId', 'studentName', 'riskLevel', 'stage', 'country', 'counselor', 'lastUpdate', 'subStatus']);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [riskFilter, setRiskFilter] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'lastUpdate', direction: 'desc' });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState<LeadStatus | null>(null);

  const [leads, setLeads] = useState<LeadStatus[]>([]);
  const [leadMetrics, setLeadMetrics] = useState<LeadMetrics | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [leadsData, metricsData] = await Promise.all([
        leadStatusService.getAllLeads(),
        leadStatusService.getMetrics()
      ]);
      setLeads(leadsData || []);
      setLeadMetrics(metricsData);
    } catch (error) {
      console.error('Error fetching lead data:', error);
      toast.error('Failed to load lead status data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const metrics = [
    { title: 'Applications', value: leadMetrics?.applicationCount || 0, icon: Target, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total applications currently being processed' },
    { title: 'Visa Process', value: leadMetrics?.visaCount || 0, icon: TrendingUp, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Students in visa processing stage' },
    { title: 'Awaiting Decision', value: leadMetrics?.awaitingDecisionCount || 0, icon: Clock, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Applications awaiting embassy or university decision' },
    { title: 'Completed', value: leadMetrics?.completedCount || 0, icon: CheckCircle, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Successfully completed enrollments' },
    { title: 'Blocked/Rejected', value: leadMetrics?.blockedCount || 0, icon: Ban, bgClass: 'bg-red-50', colorClass: 'text-red-600', tooltip: 'Blocked or rejected applications' }
  ];

  const handleRefresh = () => {
    fetchData();
    toast.success("Refreshing data...");
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(l => l.db_id.toString()));
    }
  };

  const handleToggleLead = (leadId: string) => {
    setSelectedLeads(prev => prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]);
  };

  const handleEditLead = (lead: LeadStatus) => {
    setSelectedLeadForEdit(lead);
    setLeadModalOpen(true);
  };

  const handleDeleteLead = async (leadId: number) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadStatusService.deleteLead(leadId);
        toast.success('Lead deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const leadId = active.id.toString();
      const newStage = over.id.toString();
      const lead = leads.find(l => l.db_id.toString() === leadId);

      if (lead) {
        try {
          await leadStatusService.updateStatus({
            studentDbId: lead.db_id,
            stage: newStage,
            subStatus: lead.sub_status || 'Updated via Board',
            notes: `Status changed to ${newStage} via Kanban board`,
            changedBy: 'Admin'
          });

          setLeads(items => items.map(l =>
            l.db_id.toString() === leadId ? { ...l, stage: newStage } : l
          ));

          toast.success(`Lead status updated to ${newStage}`);
          fetchData(); // Refresh metrics
        } catch (error) {
          toast.error('Failed to update lead status');
        }
      }
    }
  };

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(l =>
        l.first_name.toLowerCase().includes(lowSearch) ||
        l.last_name.toLowerCase().includes(lowSearch) ||
        l.student_id.toLowerCase().includes(lowSearch) ||
        l.country.toLowerCase().includes(lowSearch)
      );
    }

    if (statusFilter.length > 0) {
      result = result.filter((l: LeadStatus) => statusFilter.includes((l.stage || 'new').toLowerCase()));
    }

    if (riskFilter.length > 0) {
      result = result.filter((l: LeadStatus) => riskFilter.includes((l.risk_level || 'low').toLowerCase()));
    }

    return result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof LeadStatus];
      const bValue = b[sortConfig.key as keyof LeadStatus];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [leads, searchTerm, statusFilter, riskFilter, sortConfig]);

  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getLeadsByStatus = (status: string) => {
    return filteredLeads.filter(lead => (lead.stage || 'new').toLowerCase() === status.toLowerCase());
  };

  const kanbanColumns = [
    { id: 'new', title: 'New/Inquiry', color: 'bg-blue-50' },
    { id: 'lead', title: 'Qualified Lead', color: 'bg-amber-50' },
    { id: 'application', title: 'Application', color: 'bg-indigo-50' },
    { id: 'visa', title: 'Visa Process', color: 'bg-orange-50' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50' },
  ];

  const exportColumns: ExportColumn[] = [
    { id: 'leadId', label: 'Lead ID', defaultSelected: true },
    { id: 'studentName', label: 'Student Name', defaultSelected: true },
    { id: 'country', label: 'Country', defaultSelected: true },
    { id: 'counselor', label: 'Counselor', defaultSelected: true },
    { id: 'riskLevel', label: 'Risk Level', defaultSelected: true },
    { id: 'stage', label: 'Stage', defaultSelected: true },
    { id: 'lastUpdate', label: 'Last Update', defaultSelected: true }
  ];

  const importFields: ImportField[] = [
    { id: 'leadId', label: 'Lead ID', required: true, type: 'text' },
    { id: 'firstName', label: 'First Name', required: true, type: 'text' },
    { id: 'lastName', label: 'Last Name', required: true, type: 'text' },
    { id: 'country', label: 'Country', required: true, type: 'text' },
    { id: 'counselor', label: 'Counselor', required: false, type: 'text' },
    { id: 'stage', label: 'Stage', required: true, type: 'select', options: ['new', 'lead', 'application', 'visa', 'completed'] }
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
            <button onClick={() => {
              setSelectedLeadForEdit(null);
              setLeadModalOpen(true);
            }} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium">
              <Plus size={20} strokeWidth={1.5} />Add Lead
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

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input
              type="text"
              placeholder="Search leads by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button className={`h-[50px] min-w-[50px] bg-white border ${statusFilter.length > 0 || riskFilter.length > 0 ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-200'} rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center relative`}>
                  <Filter size={20} strokeWidth={1.5} />
                  {(statusFilter.length > 0 || riskFilter.length > 0) && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                      {statusFilter.length + riskFilter.length}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span>Stage</span>
                      {(statusFilter.length > 0 || riskFilter.length > 0) && (
                        <button onClick={() => { setStatusFilter([]); setRiskFilter([]); }} className="text-purple-600 hover:text-purple-700 capitalize text-[10px] font-bold">Clear All</button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {['new', 'lead', 'application', 'visa', 'completed'].map(stage => (
                        <div key={stage} className="flex items-center justify-between">
                          <label className="text-[14px] text-[#253154] capitalize">{stage.replace('-', ' ')}</label>
                          <CustomCheckbox
                            checked={statusFilter.includes(stage)}
                            onChange={() => setStatusFilter(prev => prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage])}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Risk Level</h4>
                    <div className="space-y-2">
                      {['low', 'medium', 'high'].map(level => (
                        <div key={level} className="flex items-center justify-between">
                          <label className="text-[14px] text-[#253154] capitalize">{level} risk</label>
                          <CustomCheckbox
                            checked={riskFilter.includes(level)}
                            onChange={() => setRiskFilter(prev => prev.includes(level) ? prev.filter(r => r !== level) : [...prev, level])}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Sort Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                  <ArrowUpDown size={20} strokeWidth={1.5} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 rounded-2xl shadow-xl border-gray-100" align="end">
                <div className="space-y-1">
                  {[
                    { id: 'student_id', label: 'Lead ID' },
                    { id: 'first_name', label: 'First Name' },
                    { id: 'lastUpdate', label: 'Last Update' },
                    { id: 'stage', label: 'Stage' },
                    { id: 'risk_level', label: 'Risk' }
                  ].map((field) => (
                    <button
                      key={field.id}
                      onClick={() => {
                        if (sortConfig.key === field.id) {
                          setSortConfig({ key: field.id, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
                        } else {
                          setSortConfig({ key: field.id, direction: 'desc' });
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${sortConfig.key === field.id ? 'bg-purple-50 text-purple-600 font-bold' : 'text-[#253154] hover:bg-gray-50'}`}
                    >
                      {field.label}
                      {sortConfig.key === field.id && (
                        sortConfig.direction === 'asc' ? <ArrowUpDown size={14} className="rotate-180" /> : <ArrowUpDown size={14} />
                      )}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                  <Columns size={20} strokeWidth={1.5} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3 rounded-2xl shadow-xl border-gray-100" align="end">
                <h4 className="font-bold text-[#0e042f] mb-3 text-sm px-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Visible Columns</h4>
                <div className="space-y-2">
                  {[
                    { id: 'leadId', label: 'Lead ID' },
                    { id: 'studentName', label: 'Student Name' },
                    { id: 'riskLevel', label: 'Risk Level' },
                    { id: 'stage', label: 'Stage' },
                    { id: 'country', label: 'Country' },
                    { id: 'counselor', label: 'Counselor' },
                    { id: 'lastUpdate', label: 'Last Update' },
                    { id: 'subStatus', label: 'Sub Status' }
                  ].map(col => (
                    <div key={col.id} className="flex items-center justify-between">
                      <span className="text-[14px] text-[#253154]">{col.label}</span>
                      <CustomCheckbox
                        checked={visibleColumns.includes(col.id)}
                        onChange={() => setVisibleColumns(prev => prev.includes(col.id) ? prev.filter(c => c !== col.id) : [...prev, col.id])}
                      />
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-[#0e042f] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-[#0e042f] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="w-12 px-6 py-4 text-left">
                      <CustomCheckbox checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0} partial={selectedLeads.length > 0 && selectedLeads.length < paginatedLeads.length} onChange={handleSelectAll} />
                    </th>
                    {visibleColumns.includes('leadId') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lead ID</th>}
                    {visibleColumns.includes('studentName') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Student</th>}
                    {visibleColumns.includes('country') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Country</th>}
                    {visibleColumns.includes('assignedCounselor') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Counselor</th>}
                    {visibleColumns.includes('riskLevel') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Risk</th>}
                    {visibleColumns.includes('stage') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Stage</th>}
                    {visibleColumns.includes('subStatus') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sub Status</th>}
                    {visibleColumns.includes('lastUpdate') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Last Update</th>}
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedLeads.map((lead: LeadStatus) => (
                    <tr
                      key={lead.db_id}
                      onClick={() => onNavigate?.('lead-detail', lead.student_id)}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <CustomCheckbox checked={selectedLeads.includes(lead.db_id.toString())} onChange={() => handleToggleLead(lead.db_id.toString())} />
                      </td>
                      {visibleColumns.includes('leadId') && <td className="px-6 py-4"><span className="text-[14px] font-bold text-[#253154]">{lead.student_id}</span></td>}
                      {visibleColumns.includes('studentName') && <td className="px-6 py-4">
                        <span className="text-[14px] font-bold text-[#253154]">{lead.first_name} {lead.last_name}</span>
                      </td>}
                      {visibleColumns.includes('country') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{lead.country}</span></td>}
                      {visibleColumns.includes('assignedCounselor') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{lead.counselor || 'Unassigned'}</span></td>}
                      {visibleColumns.includes('riskLevel') && <td className="px-6 py-4"><RiskBadge level={lead.risk_level} /></td>}
                      {visibleColumns.includes('stage') && <td className="px-6 py-4"><StatusBadge status={lead.stage} /></td>}
                      {visibleColumns.includes('subStatus') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{lead.sub_status || '-'}</span></td>}
                      {visibleColumns.includes('lastUpdate') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{lead.last_update ? format(new Date(lead.last_update), 'MMM d, yyyy') : '-'}</span></td>}
                      <td className="px-6 py-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleEditLead(lead)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600" title="Edit Lead">
                          <UserCircle size={18} />
                        </button>
                        <button onClick={() => handleDeleteLead(lead.db_id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" title="Delete Lead">
                          <Ban size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                        No leads found matching your criteria.
                      </td>
                    </tr>
                  )}
                  {isLoading && (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                        Loading lead data...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 outline-none"
                >
                  {[5, 10, 20, 50].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-600 ml-4">
                  {filteredLeads.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                  {Math.min(currentPage * rowsPerPage, filteredLeads.length)} of {filteredLeads.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-600">Page {currentPage} of {Math.max(1, totalPages)}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'kanban' && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {kanbanColumns.map((column) => (
                <div key={column.id} className="bg-gray-100 rounded-2xl p-4 min-h-[500px]">
                  <div className={`${column.color} rounded-xl p-3 mb-4`}>
                    <h3 className="font-bold text-[#0f172b] text-sm">{column.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{getLeadsByStatus(column.id).length} leads</p>
                  </div>

                  <SortableContext items={getLeadsByStatus(column.id).map((l: LeadStatus) => l.db_id.toString())} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {getLeadsByStatus(column.id).map((lead: LeadStatus) => (
                        <div key={lead.db_id}>
                          <div className="relative group">
                            <KanbanCard lead={lead} />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <button onClick={(e) => { e.stopPropagation(); handleEditLead(lead); }} className="p-1 bg-white shadow-sm rounded border border-gray-100 text-blue-600 hover:bg-blue-50">
                                <UserCircle size={14} />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead.db_id); }} className="p-1 bg-white shadow-sm rounded border border-gray-100 text-red-600 hover:bg-red-50">
                                <Ban size={14} />
                              </button>
                            </div>
                          </div>
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

      <LeadModal
        open={leadModalOpen}
        onOpenChange={setLeadModalOpen}
        lead={selectedLeadForEdit}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default LeadStatusOverviewPage;