import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal,
  Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check,
  Columns, MessageSquare, Clock, CheckCircle, XCircle, Mail, Edit2, Trash2
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
import { enquiryService, Enquiry as ApiEnquiry } from '../../services/enquiryService';
import { AddEnquiryModal } from './AddEnquiryModal';
import { EditEnquiryModal } from './EditEnquiryModal';

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
  status: 'new' | 'in-progress' | 'responded' | 'closed';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    new: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', label: 'New' },
    'in-progress': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', label: 'In Progress' },
    responded: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Responded' },
    closed: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', label: 'Closed' }
  }[status];

  return (
    <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[110px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
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

interface Enquiry {
  id: string;
  enquiryId: string;
  dateSubmitted: string;
  studentName: string;
  email: string;
  subject: string;
  status: 'new' | 'in-progress' | 'responded' | 'closed';
  priority: string;
}

interface EnquiriesOverviewPageProps {
  onNavigate?: (page: string, enquiryId?: string) => void;
}

const EnquiriesOverviewPage: React.FC<EnquiriesOverviewPageProps> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) });
  const [selectedEnquiries, setSelectedEnquiries] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['enquiryId', 'dateSubmitted', 'studentName', 'email', 'subject', 'priority', 'status']);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const [enquiries, setEnquiries] = useState<ApiEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'date_submitted', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<ApiEnquiry | null>(null);

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      const data = await enquiryService.getAllEnquiries();
      setEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast.error('Failed to load enquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [date]);

  const metrics = useMemo(() => {
    const total = enquiries.length;
    const isNew = enquiries.filter(e => e.status === 'new').length;
    const inProgress = enquiries.filter(e => e.status === 'in-progress').length;
    const responded = enquiries.filter(e => e.status === 'responded').length;
    const closed = enquiries.filter(e => e.status === 'closed').length;

    return [
      { title: 'Total Enquiries', value: total.toString(), icon: MessageSquare, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total enquiries received in selected period' },
      { title: 'New', value: isNew.toString(), icon: Mail, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Unread new enquiries' },
      { title: 'In Progress', value: inProgress.toString(), icon: Clock, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Enquiries being processed' },
      { title: 'Responded', value: responded.toString(), icon: CheckCircle, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Enquiries with responses sent' },
      { title: 'Closed', value: closed.toString(), icon: XCircle, bgClass: 'bg-gray-50', colorClass: 'text-gray-600', tooltip: 'Resolved and closed enquiries' }
    ];
  }, [enquiries]);

  const handleRefresh = () => {
    fetchEnquiries();
    toast.success("Refreshing data...");
  };

  const handleSelectAll = () => {
    if (selectedEnquiries.length === paginatedBookings.length) {
      setSelectedEnquiries([]);
    } else {
      setSelectedEnquiries(paginatedBookings.map(e => e.enquiry_id));
    }
  };

  const handleToggleEnquiry = (id: string) => {
    setSelectedEnquiries(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const filteredEnquiries = useMemo(() => {
    let result = [...enquiries];

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(e =>
        e.student_name.toLowerCase().includes(lowSearch) ||
        e.enquiry_id.toLowerCase().includes(lowSearch) ||
        e.subject.toLowerCase().includes(lowSearch) ||
        e.email.toLowerCase().includes(lowSearch)
      );
    }

    if (statusFilter.length > 0) {
      result = result.filter(e => statusFilter.includes(e.status));
    }

    if (priorityFilter.length > 0) {
      result = result.filter(e => priorityFilter.includes(e.priority));
    }

    return result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof ApiEnquiry];
      const bValue = b[sortConfig.key as keyof ApiEnquiry];

      if (aValue === bValue) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [enquiries, searchTerm, sortConfig, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredEnquiries.length / rowsPerPage);
  const paginatedBookings = filteredEnquiries.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await enquiryService.deleteEnquiry(id);
        toast.success("Enquiry deleted successfully");
        fetchEnquiries();
      } catch (error) {
        toast.error("Failed to delete enquiry");
      }
    }
  };

  const handleEdit = (enquiry: ApiEnquiry) => {
    setEditingEnquiry(enquiry);
    setIsEditModalOpen(true);
  };

  const exportColumns: ExportColumn[] = [
    { id: 'enquiryId', label: 'Enquiry ID', defaultSelected: true },
    { id: 'dateSubmitted', label: 'Date Submitted', defaultSelected: true },
    { id: 'studentName', label: 'Student Name', defaultSelected: true },
    { id: 'email', label: 'Email', defaultSelected: true },
    { id: 'subject', label: 'Subject', defaultSelected: true },
    { id: 'priority', label: 'Priority', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true }
  ];

  const importFields: ImportField[] = [
    { id: 'enquiry_id', label: 'Enquiry ID', required: true, type: 'text' },
    { id: 'student_name', label: 'Student Name', required: true, type: 'text' },
    { id: 'email', label: 'Email', required: true, type: 'email' },
    { id: 'subject', label: 'Subject', required: true, type: 'text' },
    { id: 'message', label: 'Message', required: false, type: 'text' },
    { id: 'priority', label: 'Priority', required: true, type: 'select', options: ['high', 'medium', 'low'] },
    { id: 'status', label: 'Status', required: true, type: 'select', options: ['new', 'in-progress', 'responded', 'closed'] }
  ];

  const handleExport = async (options: any) => {
    toast.success(`Exporting ${options.scope} enquiries as ${options.format}...`);
  };

  const handleImport = async (data: any) => {
    toast.success(`Importing ${data.length} enquiries...`);
  };

  const slickSettings = {
    dots: false, infinite: false, speed: 500, slidesToShow: 5, slidesToScroll: 1, arrows: true,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 4 } },
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-10 py-6 md:py-10 bg-gray-50 min-h-screen">

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
            <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium">
              <Plus size={20} strokeWidth={1.5} />Add Enquiry
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
            <button onClick={() => setIsAddModalOpen(true)} className="flex-1 h-[50px] bg-[#0e042f] text-white rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 font-medium">
              <Plus size={18} />Add Enquiry
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

        <div className="hidden md:flex justify-between items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button className={`h-[50px] min-w-[50px] bg-white border ${statusFilter.length > 0 || priorityFilter.length > 0 ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-200'} rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center relative`}>
                  <Filter size={20} strokeWidth={1.5} />
                  {(statusFilter.length > 0 || priorityFilter.length > 0) && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                      {statusFilter.length + priorityFilter.length}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span>Status</span>
                      {(statusFilter.length > 0 || priorityFilter.length > 0) && (
                        <button onClick={() => { setStatusFilter([]); setPriorityFilter([]); }} className="text-purple-600 hover:text-purple-700 capitalize text-[10px] font-bold">Clear All</button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {['new', 'in-progress', 'responded', 'closed'].map(status => (
                        <div key={status} className="flex items-center justify-between">
                          <label className="text-[14px] text-[#253154] capitalize" htmlFor={`status-${status}`}>{status.replace('-', ' ')}</label>
                          <CustomCheckbox
                            checked={statusFilter.includes(status)}
                            onChange={() => setStatusFilter(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status])}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Priority</h4>
                    <div className="space-y-2">
                      {['high', 'medium', 'low'].map(priority => (
                        <div key={priority} className="flex items-center justify-between">
                          <label className="text-[14px] text-[#253154] capitalize" htmlFor={`priority-${priority}`}>{priority}</label>
                          <CustomCheckbox
                            checked={priorityFilter.includes(priority)}
                            onChange={() => setPriorityFilter(prev => prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority])}
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
                    { id: 'enquiry_id', label: 'Enquiry ID' },
                    { id: 'date_submitted', label: 'Date Submitted' },
                    { id: 'student_name', label: 'Student Name' },
                    { id: 'subject', label: 'Subject' },
                    { id: 'priority', label: 'Priority' },
                    { id: 'status', label: 'Status' }
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

            {/* Columns Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                  <Columns size={20} strokeWidth={1.5} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Visible Columns</h4>
                <div className="space-y-3">
                  {[
                    { id: 'enquiryId', label: 'Enquiry ID' },
                    { id: 'dateSubmitted', label: 'Date Submitted' },
                    { id: 'studentName', label: 'Student Name' },
                    { id: 'email', label: 'Email' },
                    { id: 'subject', label: 'Subject' },
                    { id: 'priority', label: 'Priority' },
                    { id: 'status', label: 'Status' }
                  ].map((col) => (
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
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="w-12 px-6 py-4 text-left">
                    <CustomCheckbox checked={selectedEnquiries.length === paginatedBookings.length && paginatedBookings.length > 0} partial={selectedEnquiries.length > 0 && selectedEnquiries.length < paginatedBookings.length} onChange={handleSelectAll} />
                  </th>
                  {visibleColumns.includes('enquiryId') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Enquiry ID</th>}
                  {visibleColumns.includes('dateSubmitted') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date Submitted</th>}
                  {visibleColumns.includes('studentName') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Student</th>}
                  {visibleColumns.includes('email') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</th>}
                  {visibleColumns.includes('subject') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Subject</th>}
                  {visibleColumns.includes('priority') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Priority</th>}
                  {visibleColumns.includes('status') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>}
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedBookings.map((enquiry) => (
                  <tr
                    key={enquiry.enquiry_id}
                    onClick={() => onNavigate?.('enquiry-detail', enquiry.enquiry_id)}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CustomCheckbox checked={selectedEnquiries.includes(enquiry.enquiry_id)} onChange={() => handleToggleEnquiry(enquiry.enquiry_id)} />
                    </td>
                    {visibleColumns.includes('enquiryId') && <td className="px-6 py-4"><span className="text-[14px] font-bold text-[#253154]">{enquiry.enquiry_id}</span></td>}
                    {visibleColumns.includes('dateSubmitted') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{format(new Date(enquiry.date_submitted), 'MMM d, yyyy h:mm a')}</span></td>}
                    {visibleColumns.includes('studentName') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{enquiry.student_name}</span></td>}
                    {visibleColumns.includes('email') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{enquiry.email}</span></td>}
                    {visibleColumns.includes('subject') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{enquiry.subject}</span></td>}
                    {visibleColumns.includes('priority') && <td className="px-6 py-4"><span className="text-[12px] font-medium text-gray-600 capitalize">{enquiry.priority}</span></td>}
                    {visibleColumns.includes('status') && <td className="px-6 py-4"><StatusBadge status={enquiry.status} /></td>}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(enquiry); }}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(enquiry.enquiry_id); }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                {filteredEnquiries.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                {Math.min(currentPage * rowsPerPage, filteredEnquiries.length)} of {filteredEnquiries.length}
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
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Enquiries"
        totalCount={enquiries.length}
        selectedCount={selectedEnquiries.length}
        columns={exportColumns}
        supportsDateRange={true}
        onExport={handleExport}
      />
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Enquiries"
        fields={importFields}
        onImport={handleImport}
        allowUpdate={true}
      />

      <AddEnquiryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchEnquiries}
      />

      <EditEnquiryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchEnquiries}
        enquiry={editingEnquiry}
      />
    </div >
  );
};

export default EnquiriesOverviewPage;