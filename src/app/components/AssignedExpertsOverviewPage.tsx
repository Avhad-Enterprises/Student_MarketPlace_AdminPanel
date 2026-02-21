import React, { useState } from 'react';
import {
  Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal,
  Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check,
  Columns, Users, UserCheck, Award, Star, TrendingUp, List, LayoutGrid,
  Timer, Percent, Activity, AlertTriangle, User
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
import { Switch } from './ui/switch';
import ImageWithFallback from './figma/ImageWithFallback';

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
  status: 'active' | 'on-leave' | 'busy' | 'available';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Active' },
    'on-leave': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', label: 'On Leave' },
    busy: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', label: 'Busy' },
    available: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', label: 'Available' }
  }[status];

  return (
    <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
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
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip, subtitle }) => (
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
      <div>
        <p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p>
        {subtitle && (
          <p className="text-[10px] text-red-600 font-medium mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
    <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500"><Icon size={80} /></div>
  </div>
);

interface Expert {
  id: string;
  expertId: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  assignedStudents: number;
  maxCapacity: number;
  rating: number;
  status: 'active' | 'on-leave' | 'busy' | 'available';
  services: string[];
  countries: string[];
  acceptNewAssignments: boolean;
  roundRobin: boolean;
  isPriority: boolean;
  profileImage?: string;
}

interface ExpertCardProps {
  expert: Expert;
  onClick: () => void;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onClick }) => {
  const loadPercent = Math.round((expert.assignedStudents / expert.maxCapacity) * 100);
  const isOverload = loadPercent > 100;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
    >
      {/* Profile Image and Basic Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden">
          {expert.profileImage ? (
            <ImageWithFallback src={expert.profileImage} alt={expert.name} className="w-full h-full object-cover" />
          ) : (
            expert.name.split(' ').map(n => n[0]).join('')
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-[#0f172b] text-lg mb-1">{expert.name}</h3>
          <p className="text-sm text-[#62748e] mb-2">{expert.specialization}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-600">
              <Star size={14} fill="currentColor" />
              <span className="font-bold text-sm">{expert.rating}</span>
            </div>
            <StatusBadge status={expert.status} />
          </div>
        </div>
      </div>

      {/* Services Handled */}
      <div className="mb-3">
        <p className="text-xs font-medium text-[#62748e] mb-2">Services Handled</p>
        <div className="flex flex-wrap gap-1.5">
          {expert.services.slice(0, 3).map((service, idx) => (
            <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-medium rounded">
              {service}
            </span>
          ))}
          {expert.services.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
              +{expert.services.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Countries Supported */}
      <div className="mb-4">
        <p className="text-xs font-medium text-[#62748e] mb-2">Countries Supported</p>
        <div className="flex flex-wrap gap-1.5">
          {expert.countries.slice(0, 3).map((country, idx) => (
            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-medium rounded">
              {country}
            </span>
          ))}
          {expert.countries.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
              +{expert.countries.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Workload */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-[#62748e]">Workload</p>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${isOverload ? 'text-red-600' : 'text-[#0f172b]'}`}>
              {expert.assignedStudents}/{expert.maxCapacity}
            </span>
            {isOverload && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle size={14} className="text-red-600" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-red-600 text-white">
                    <p>Over capacity!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all ${isOverload
              ? 'bg-red-500'
              : loadPercent > 80
                ? 'bg-amber-500'
                : 'bg-green-500'
              }`}
            style={{ width: `${Math.min(loadPercent, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-[#62748e] mt-1">{loadPercent}% capacity</p>
      </div>
    </div>
  );
};

interface AssignedExpertsOverviewPageProps {
  onNavigate?: (page: string, expertId?: string) => void;
}

const AssignedExpertsOverviewPage: React.FC<AssignedExpertsOverviewPageProps> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) });
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['expert', 'specialization', 'services', 'workload', 'rating', 'status']);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const [experts, setExperts] = useState<Expert[]>([
    {
      id: 'EXP-001',
      expertId: 'EXP-001',
      name: 'Sarah Johnson',
      specialization: 'US Visa Expert',
      email: 'sarah.j@company.com',
      phone: '+1-555-1001',
      assignedStudents: 24,
      maxCapacity: 30,
      rating: 4.8,
      status: 'active',
      services: ['Student Visa', 'Work Visa', 'H1B'],
      countries: ['USA', 'Canada'],
      acceptNewAssignments: true,
      roundRobin: true,
      isPriority: true
    },
    {
      id: 'EXP-002',
      expertId: 'EXP-002',
      name: 'Mike Davis',
      specialization: 'UK Visa Specialist',
      email: 'mike.d@company.com',
      phone: '+1-555-1002',
      assignedStudents: 18,
      maxCapacity: 25,
      rating: 4.9,
      status: 'available',
      services: ['Student Visa', 'Tier 2', 'Settlement'],
      countries: ['UK', 'Ireland'],
      acceptNewAssignments: true,
      roundRobin: true,
      isPriority: false
    },
    {
      id: 'EXP-003',
      expertId: 'EXP-003',
      name: 'Emma Wilson',
      specialization: 'Canada Immigration',
      email: 'emma.w@company.com',
      phone: '+1-555-1003',
      assignedStudents: 31,
      maxCapacity: 30,
      rating: 4.7,
      status: 'busy',
      services: ['Express Entry', 'Study Permit', 'PR'],
      countries: ['Canada'],
      acceptNewAssignments: false,
      roundRobin: false,
      isPriority: true
    },
    {
      id: 'EXP-004',
      expertId: 'EXP-004',
      name: 'David Chen',
      specialization: 'Australia PR Expert',
      email: 'david.c@company.com',
      phone: '+1-555-1004',
      assignedStudents: 0,
      maxCapacity: 20,
      rating: 4.6,
      status: 'on-leave',
      services: ['PR Visa', 'Student Visa', 'TSS'],
      countries: ['Australia', 'New Zealand'],
      acceptNewAssignments: false,
      roundRobin: false,
      isPriority: false
    },
    {
      id: 'EXP-005',
      expertId: 'EXP-005',
      name: 'Lisa Anderson',
      specialization: 'EU Visa Consultant',
      email: 'lisa.a@company.com',
      phone: '+1-555-1005',
      assignedStudents: 22,
      maxCapacity: 28,
      rating: 4.9,
      status: 'active',
      services: ['Schengen', 'Student Visa', 'Work Permit'],
      countries: ['Germany', 'France', 'Netherlands'],
      acceptNewAssignments: true,
      roundRobin: true,
      isPriority: false
    },
  ]);

  const metrics = [
    { title: 'Total Experts', value: '45', icon: Users, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total registered experts in the system' },
    { title: 'Active Experts', value: '38', icon: UserCheck, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Currently active and working experts' },
    { title: 'Total Assignments', value: '286', icon: TrendingUp, bgClass: 'bg-cyan-50', colorClass: 'text-cyan-600', tooltip: 'Total student assignments across all experts' },
    { title: 'Avg Capacity Utilization', value: '78%', icon: Activity, bgClass: 'bg-indigo-50', colorClass: 'text-indigo-600', tooltip: 'Overall capacity utilization across experts', subtitle: '3 experts overloaded' }
  ];

  const handleRefresh = () => toast.success("Refreshing data...");

  const handleSelectAll = () => {
    if (selectedExperts.length === experts.length) {
      setSelectedExperts([]);
      setSelectAllStore(false);
    } else {
      setSelectedExperts(experts.map(e => e.id));
      setSelectAllStore(false);
    }
  };

  const handleToggleExpert = (expertId: string) => {
    setSelectedExperts(prev => prev.includes(expertId) ? prev.filter(id => id !== expertId) : [...prev, expertId]);
  };

  const handleToggleAcceptAssignments = (expertId: string) => {
    setExperts(prev => prev.map(exp =>
      exp.id === expertId
        ? { ...exp, acceptNewAssignments: !exp.acceptNewAssignments }
        : exp
    ));
    toast.success('Assignment preference updated');
  };

  const handleToggleRoundRobin = (expertId: string) => {
    setExperts(prev => prev.map(exp =>
      exp.id === expertId
        ? { ...exp, roundRobin: !exp.roundRobin }
        : exp
    ));
    toast.success('Round robin preference updated');
  };

  const handleTogglePriority = (expertId: string) => {
    setExperts(prev => prev.map(exp =>
      exp.id === expertId
        ? { ...exp, isPriority: !exp.isPriority }
        : exp
    ));
    toast.success('Priority status updated');
  };

  const exportColumns: ExportColumn[] = [
    { id: 'expertId', label: 'Expert ID', defaultSelected: true },
    { id: 'name', label: 'Name', defaultSelected: true },
    { id: 'specialization', label: 'Specialization', defaultSelected: true },
    { id: 'email', label: 'Email', defaultSelected: true },
    { id: 'phone', label: 'Phone', defaultSelected: true },
    { id: 'assignedStudents', label: 'Assigned Students', defaultSelected: true },
    { id: 'maxCapacity', label: 'Max Capacity', defaultSelected: true },
    { id: 'rating', label: 'Rating', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true }
  ];

  const importFields: ImportField[] = [
    { id: 'expertId', label: 'Expert ID', required: true, type: 'text' },
    { id: 'name', label: 'Name', required: true, type: 'text' },
    { id: 'specialization', label: 'Specialization', required: true, type: 'text' },
    { id: 'email', label: 'Email', required: true, type: 'email' },
    { id: 'phone', label: 'Phone', required: true, type: 'text' },
    { id: 'assignedStudents', label: 'Assigned Students', required: true, type: 'number' },
    { id: 'maxCapacity', label: 'Max Capacity', required: true, type: 'number' },
    { id: 'rating', label: 'Rating', required: true, type: 'number' },
    { id: 'status', label: 'Status', required: true, type: 'select', options: ['active', 'available', 'busy', 'on-leave'] }
  ];

  const handleExport = async (options: any) => {
    toast.success(`Exporting ${options.scope} experts as ${options.format}...`);
  };

  const handleImport = async (data: any) => {
    toast.success(`Importing ${data.length} experts...`);
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
            <button className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium">
              <Plus size={20} strokeWidth={1.5} />Add Expert
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
              <Plus size={20} />Add Expert
            </button>
            <button className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center">
              <MoreHorizontal size={22} className="text-[#253154]" />
            </button>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metrics.map((metric, index) => <MetricCard key={index} {...metric} />)}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-4 mb-6">
          {viewMode === 'table' && (
            <>
              <div className="relative flex-1">
                <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
                <input type="text" placeholder="Search experts..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" />
              </div>
              <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                <Filter size={20} strokeWidth={1.5} />
              </button>
              <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                <ArrowUpDown size={20} strokeWidth={1.5} />
              </button>
              <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                <Columns size={20} strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="w-12 px-8 py-3.5 text-left">
                      <CustomCheckbox checked={selectedExperts.length === experts.length} partial={selectedExperts.length > 0 && selectedExperts.length < experts.length} onChange={handleSelectAll} />
                    </th>
                    <th className="px-8 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Expert</th>
                    <th className="px-8 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Specialization</th>
                    <th className="px-8 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Services</th>
                    <th className="px-8 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Workload</th>
                    <th className="px-8 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                    <th className="px-8 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {experts.map((expert) => {
                    const loadPercent = Math.round((expert.assignedStudents / expert.maxCapacity) * 100);
                    const isOverload = loadPercent > 100;

                    return (
                      <tr
                        key={expert.id}
                        onClick={() => onNavigate?.('expert-detail', expert.id)}
                        className="hover:bg-purple-50/30 transition-colors cursor-pointer"
                      >
                        <td
                          className="px-8 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CustomCheckbox checked={selectedExperts.includes(expert.id)} onChange={() => handleToggleExpert(expert.id)} />
                        </td>

                        {/* Expert Column - Avatar + Name + ID */}
                        <td className="px-8 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {expert.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-[14px] font-semibold text-[#0f172b]">{expert.name}</p>
                              <p className="text-[11px] text-gray-500">{expert.expertId}</p>
                            </div>
                          </div>
                        </td>

                        {/* Specialization */}
                        <td className="px-8 py-3">
                          <span className="text-[13px] text-gray-700">{expert.specialization}</span>
                        </td>

                        {/* Services - Compact chips */}
                        <td className="px-8 py-3">
                          <div className="flex flex-wrap gap-1">
                            {expert.services.slice(0, 3).map((service, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
                                {service}
                              </span>
                            ))}
                            {expert.services.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-semibold rounded">
                                +{expert.services.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Workload - Progress bar + text */}
                        <td className="px-8 py-3">
                          <div className="space-y-1.5 min-w-[140px]">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full transition-all ${isOverload
                                  ? 'bg-red-500'
                                  : loadPercent > 80
                                    ? 'bg-amber-500'
                                    : 'bg-green-500'
                                  }`}
                                style={{ width: `${Math.min(loadPercent, 100)}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-[11px] font-semibold ${isOverload ? 'text-red-600' : 'text-gray-700'}`}>
                                {expert.assignedStudents} / {expert.maxCapacity}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className={`text-[11px] font-semibold ${isOverload ? 'text-red-600' : 'text-gray-600'}`}>
                                  ({loadPercent}%)
                                </span>
                                {isOverload && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <AlertTriangle size={12} className="text-red-600" />
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-red-600 text-white">
                                        <p>Over capacity!</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Rating - Smaller star */}
                        <td className="px-8 py-3">
                          <span className="text-[13px] font-medium text-gray-600 flex items-center gap-1">
                            <Star size={12} fill="currentColor" className="text-amber-500" />
                            {expert.rating}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-8 py-3">
                          <StatusBadge status={expert.status} />
                        </td>

                        {/* Controls - Horizontal icons with tooltips */}
                        <td
                          className="px-8 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            {/* Accept New Assignments */}
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleToggleAcceptAssignments(expert.id)}
                                    className={`p-1.5 rounded-lg transition-colors ${expert.acceptNewAssignments
                                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                      }`}
                                  >
                                    <UserCheck size={14} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#0e042f] text-white">
                                  <p>{expert.acceptNewAssignments ? 'Accepting new assignments' : 'Not accepting new assignments'}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Round Robin */}
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleToggleRoundRobin(expert.id)}
                                    className={`p-1.5 rounded-lg transition-colors ${expert.roundRobin
                                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                      }`}
                                  >
                                    <RefreshCw size={14} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#0e042f] text-white">
                                  <p>{expert.roundRobin ? 'Included in round robin' : 'Not in round robin'}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Priority Expert */}
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleTogglePriority(expert.id)}
                                    className={`p-1.5 rounded-lg transition-colors ${expert.isPriority
                                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                      }`}
                                  >
                                    <Star size={14} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#0e042f] text-white">
                                  <p>{expert.isPriority ? 'Priority expert' : 'Regular expert'}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
                  10<ChevronDown size={14} />
                </button>
                <span className="text-sm text-gray-600 ml-4">1-{Math.min(10, experts.length)} of {experts.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={18} /></button>
                <span className="text-sm text-gray-600">Page 1 of 1</span>
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        )}

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {experts.map((expert) => (
              <ExpertCard
                key={expert.id}
                expert={expert}
                onClick={() => onNavigate?.('expert-detail', expert.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Experts"
        totalCount={experts.length}
        selectedCount={selectedExperts.length}
        columns={exportColumns}
        supportsDateRange={true}
        onExport={handleExport}
      />
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Experts"
        fields={importFields}
        onImport={handleImport}
        allowUpdate={true}
      />
    </div>
  );
};

export default AssignedExpertsOverviewPage;