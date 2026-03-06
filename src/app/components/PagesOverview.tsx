import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  RefreshCw,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Search,
  Copy,
  Printer,
  XCircle,
  Archive,
  Edit,
  Check,
  Columns,
  FileText,
  CheckCircle,
  AlertTriangle,
  Calendar as CalendarPlus,
  Eye,
  Layout,
  Globe
} from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";
import { SlickStyles } from './SlickStyles';
import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';

// --- CustomCheckbox Component ---
interface CustomCheckboxProps {
  checked: boolean;
  partial?: boolean;
  onChange: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, partial = false, onChange }) => {
  return (
    <div
      onClick={onChange}
      className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial
        ? 'bg-white border-purple-600'
        : 'bg-white border-gray-300 hover:border-gray-400'
        }`}
    >
      {checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}
      {partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}
    </div>
  );
};

// --- StatusBadge Component ---
interface StatusBadgeProps {
  status: 'published' | 'draft' | 'archived' | 'scheduled';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    published: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      label: 'Published'
    },
    draft: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      border: 'border-amber-300',
      label: 'Draft'
    },
    archived: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-300',
      label: 'Archived'
    },
    scheduled: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      label: 'Scheduled'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

// --- PageTypeBadge Component ---
interface PageTypeBadgeProps {
  type: 'listing' | 'detail' | 'landing' | 'static' | 'comparison';
}

const PageTypeBadge: React.FC<PageTypeBadgeProps> = ({ type }) => {
  const typeConfig = {
    listing: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-200',
      label: 'Listing'
    },
    detail: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      label: 'Detail'
    },
    landing: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      label: 'Landing'
    },
    static: {
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      border: 'border-slate-200',
      label: 'Static'
    },
    comparison: {
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      border: 'border-pink-200',
      label: 'Comparison'
    }
  };

  const config = typeConfig[type];

  return (
    <span className={`px-2 py-1 rounded text-[11px] font-medium border inline-flex items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

// --- MetricCard Component ---
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  bgClass: string;
  colorClass: string;
  tooltip: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-[#253154] font-medium text-[15px]">{title}</span>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors">
                i
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Bottom row */}
      <div className="flex items-end gap-3 mt-2">
        <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p>
        </div>
      </div>

      {/* Decorative background */}
      <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500">
        <Icon size={80} />
      </div>
    </div>
  );
};

// --- MobilePageCard Component ---
interface Page {
  id: string;
  name: string;
  type: 'listing' | 'detail' | 'landing' | 'static' | 'comparison';
  route: string;
  dataSource: string;
  status: 'published' | 'draft' | 'archived' | 'scheduled';
  lastUpdated: string;
  views: string;
}

interface MobilePageCardProps {
  page: Page;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const MobilePageCard: React.FC<MobilePageCardProps> = ({ page, isSelected, onToggleSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 w-full transition-all active:scale-[0.99] cursor-pointer flex flex-col gap-2 ${isSelected ? 'bg-purple-50/30' : ''}`}>
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-[#253154] text-[15px]">{page.id}</span>
        <span className="bg-[#F4F4F4] text-gray-500 text-[10px] px-2 py-1 rounded-lg">Tap to view</span>
        <span className="font-bold text-[#253154] text-[15px] ml-auto">{page.views}</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Middle row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-gray-600 text-sm">{page.name}</span>
        <div className="ml-auto transform scale-90 origin-right">
          <StatusBadge status={page.status} />
        </div>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div className="mt-2 pt-3 border-t border-gray-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Type</div>
              <div className="text-sm text-gray-700 font-medium"><PageTypeBadge type={page.type} /></div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Route</div>
              <div className="text-sm text-gray-700 font-medium">{page.route}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Data Source</div>
              <div className="text-sm text-gray-700 font-medium">{page.dataSource}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Last Updated</div>
              <div className="text-sm text-gray-700 font-medium">{page.lastUpdated}</div>
            </div>
          </div>
          <button className="w-full h-10 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0c4a] transition-colors font-medium text-sm">
            Edit Page
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export const PagesOverview: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  // State management
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31)
  });
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search'>('none');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'name', 'type', 'route', 'dataSource', 'status', 'views']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);

  // Dialog states
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Sample data
  const pages: Page[] = [
    { id: 'PAGE-001', name: 'University Listings', type: 'listing', route: '/universities', dataSource: 'Universities', status: 'published', lastUpdated: '2 hours ago', views: '12.4K' },
    { id: 'PAGE-002', name: 'Country Guides', type: 'listing', route: '/countries', dataSource: 'Countries', status: 'published', lastUpdated: '5 hours ago', views: '8.2K' },
    { id: 'PAGE-003', name: 'University Detail Page', type: 'detail', route: '/universities/:slug', dataSource: 'Universities', status: 'published', lastUpdated: '1 day ago', views: '24.1K' },
    { id: 'PAGE-004', name: 'Country Detail Page', type: 'detail', route: '/countries/:slug', dataSource: 'Countries', status: 'published', lastUpdated: '1 day ago', views: '18.3K' },
    { id: 'PAGE-005', name: 'Compare Universities', type: 'comparison', route: '/compare/universities', dataSource: 'Universities', status: 'published', lastUpdated: '3 days ago', views: '5.6K' },
    { id: 'PAGE-006', name: 'Visa Application Guide', type: 'landing', route: '/visa-guide', dataSource: 'None', status: 'published', lastUpdated: '1 week ago', views: '32.7K' },
    { id: 'PAGE-007', name: 'Blog Articles', type: 'listing', route: '/blog', dataSource: 'Blogs', status: 'published', lastUpdated: '4 days ago', views: '9.8K' },
    { id: 'PAGE-008', name: 'Blog Article Detail', type: 'detail', route: '/blog/:slug', dataSource: 'Blogs', status: 'published', lastUpdated: '4 days ago', views: '15.2K' },
  ];

  // Metrics data
  const metrics = [
    {
      title: 'Total Pages',
      value: '47',
      icon: FileText,
      bgClass: 'bg-purple-50',
      colorClass: 'text-purple-600',
      tooltip: 'Total number of frontend pages defined'
    },
    {
      title: 'Published',
      value: '32',
      icon: CheckCircle,
      bgClass: 'bg-green-50',
      colorClass: 'text-green-600',
      tooltip: 'Pages currently live and accessible'
    },
    {
      title: 'Draft Pages',
      value: '12',
      icon: Edit,
      bgClass: 'bg-amber-50',
      colorClass: 'text-amber-600',
      tooltip: 'Pages in draft state, not yet published'
    },
    {
      title: 'Page Types Used',
      value: '5',
      icon: Layout,
      bgClass: 'bg-blue-50',
      colorClass: 'text-blue-600',
      tooltip: 'Different page template types in use'
    },
    {
      title: 'Total Views (30d)',
      value: '126K',
      icon: Eye,
      bgClass: 'bg-pink-50',
      colorClass: 'text-pink-600',
      tooltip: 'Total page views in last 30 days'
    }
  ];

  // Column configuration
  const allColumns = [
    { key: 'id', label: 'Page ID' },
    { key: 'name', label: 'Page Name' },
    { key: 'type', label: 'Page Type' },
    { key: 'route', label: 'Route' },
    { key: 'dataSource', label: 'Data Source' },
    { key: 'status', label: 'Status' },
    { key: 'views', label: 'Views (30d)' },
    { key: 'updated', label: 'Last Updated' }
  ];

  // Handlers
  const handleRefresh = () => {
    toast.success("Refreshing data...");
  };

  const handleSelectAll = () => {
    if (selectedPages.length === pages.length) {
      setSelectedPages([]);
      setSelectAllStore(false);
    } else {
      setSelectedPages(pages.map(p => p.id));
      setSelectAllStore(false);
    }
  };

  const handleTogglePage = (pageId: string) => {
    setSelectedPages(prev =>
      prev.includes(pageId)
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedPages(pages.map(p => p.id));
  };

  const handleClearSelection = () => {
    setSelectedPages([]);
    setSelectAllStore(false);
  };

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(k => k !== columnKey)
        : [...prev, columnKey]
    );
  };

  // Slick settings for mobile carousel
  const slickSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1.1,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: '20px'
  };

  // Export/Import configuration
  const exportColumns: ExportColumn[] = [
    { id: 'id', label: 'Page ID', defaultSelected: true },
    { id: 'name', label: 'Page Name', defaultSelected: true },
    { id: 'type', label: 'Page Type', defaultSelected: true },
    { id: 'route', label: 'Route', defaultSelected: true },
    { id: 'dataSource', label: 'Data Source', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'views', label: 'Views (30d)', defaultSelected: false },
    { id: 'lastUpdated', label: 'Last Updated', defaultSelected: false }
  ];

  const importFields: ImportField[] = [
    { id: 'pageId', label: 'Page ID', required: false, type: 'text' },
    { id: 'name', label: 'Page Name', required: true, type: 'text' },
    { id: 'type', label: 'Page Type', required: true, type: 'select', options: ['Listing', 'Detail', 'Landing', 'Static', 'Comparison'] },
    { id: 'route', label: 'Route', required: true, type: 'text' },
    { id: 'dataSource', label: 'Data Source', required: false, type: 'text' },
    { id: 'status', label: 'Status', required: false, type: 'select', options: ['Published', 'Draft', 'Archived', 'Scheduled'] }
  ];

  const handleExport = async (options: any) => {
    console.log('Exporting with options:', options);
    toast.success(`Exporting ${options.scope} pages as ${options.format.toUpperCase()}`);
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleImport = async (data: any[], mode: any) => {
    console.log('Importing:', data, 'Mode:', mode);
    toast.success(`Successfully imported ${data.length} pages`);
    // Simulate import delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <TooltipProvider>
      <SlickStyles />
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">

        {/* Desktop Action Bar */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-8">
          {/* Left: Date Picker */}
          <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                  <CalendarIcon size={20} className="text-[#253154]" />
                  <span className="font-medium text-[#253154] text-[14px]">
                    {date?.from && date?.to
                      ? `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}`
                      : 'Select date range'}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <div className="w-px h-4 bg-gray-200 mx-2" />
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500"
            >
              <RefreshCw size={20} className="text-[#253154]" />
            </button>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExportDialog(true)}
              className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"
            >
              <Download size={20} strokeWidth={1.5} />
              Export
            </button>
            <button
              onClick={() => setShowImportDialog(true)}
              className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"
            >
              <Upload size={20} strokeWidth={1.5} />
              Import
            </button>
            <button className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium">
              <Plus size={20} strokeWidth={1.5} />
              Add Page
            </button>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="flex md:hidden flex-col gap-4 mb-6">
          {/* Date Range Pill */}
          <div className="w-full h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <CalendarIcon size={18} className="text-[#253154]" />
              <span className="text-sm font-medium text-[#253154]">
                {date?.from && date?.to
                  ? `${format(date.from, 'd MMM')} - ${format(date.to, 'd MMM')}`
                  : 'Select range'}
              </span>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors active:rotate-180 active:duration-500"
            >
              <RefreshCw size={18} className="text-[#253154]" />
            </button>
          </div>

          {/* Button Row */}
          <div className="flex gap-3">
            <button className="flex-1 h-[50px] bg-[#0e042f] text-white rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 font-medium">
              <Plus size={20} />
              Add Page
            </button>
            <button
              onClick={() => setActiveMobileMenu(activeMobileMenu === 'import' ? 'none' : 'import')}
              className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center"
            >
              <MoreHorizontal size={22} className="text-[#253154]" />
            </button>
          </div>
        </div>

        {/* Metrics Section - Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Metrics Section - Mobile Carousel */}
        <div className="block lg:hidden mb-14 -mx-4">
          <Slider {...slickSettings}>
            {metrics.map((metric, index) => (
              <div key={index} className="px-2 py-2">
                <MetricCard {...metric} />
              </div>
            ))}
          </Slider>
        </div>

        {/* Desktop Search & Filter Bar */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input
              type="text"
              placeholder="Search by page name, route, or type"
              className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>

          {/* Filter/Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFilterMenu(!showFilterMenu);
                  setShowSortMenu(false);
                  setShowColumnMenu(false);
                  setShowMoreMenu(false);
                }}
                className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <Filter size={20} strokeWidth={1.5} />
              </button>

              {showFilterMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Status</div>
                    {['All', 'Published', 'Draft', 'Archived', 'Scheduled'].map(status => (
                      <button key={status} className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left">
                        {status}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-1" />
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Page Type</div>
                    {['All Types', 'Listing', 'Detail', 'Landing', 'Static', 'Comparison'].map(type => (
                      <button key={type} className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left">
                        {type}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sort Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSortMenu(!showSortMenu);
                  setShowFilterMenu(false);
                  setShowColumnMenu(false);
                  setShowMoreMenu(false);
                }}
                className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <ArrowUpDown size={20} strokeWidth={1.5} />
              </button>

              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Sort By</div>
                    {['Name (A-Z)', 'Name (Z-A)', 'Most Views', 'Recently Updated', 'Route (A-Z)'].map(option => (
                      <button key={option} className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center justify-between">
                        <span>{option}</span>
                        <ArrowDown size={16} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Columns Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowColumnMenu(!showColumnMenu);
                  setShowFilterMenu(false);
                  setShowSortMenu(false);
                  setShowMoreMenu(false);
                }}
                className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <Columns size={20} strokeWidth={1.5} />
              </button>

              {showColumnMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowColumnMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Show Columns</div>
                    {allColumns.map(column => (
                      <button
                        key={column.key}
                        onClick={() => handleToggleColumn(column.key)}
                        className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2"
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${visibleColumns.includes(column.key) ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}>
                          {visibleColumns.includes(column.key) && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        {column.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowMoreMenu(!showMoreMenu);
                  setShowFilterMenu(false);
                  setShowSortMenu(false);
                  setShowColumnMenu(false);
                }}
                className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <MoreHorizontal size={20} strokeWidth={1.5} />
              </button>

              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-48 animate-in fade-in zoom-in-95 duration-200">
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Printer size={16} />
                      Print
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Copy size={16} />
                      Duplicate
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-red-600 text-left flex items-center gap-2">
                      <Archive size={16} />
                      Archive Selected
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Selection Notification Banner */}
        {selectedPages.length > 0 && (
          <div className="mb-4 bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-purple-900">
                {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''} selected
              </span>
              {!selectAllStore && selectedPages.length === pages.length && (
                <button
                  onClick={handleSelectAllStore}
                  className="text-sm text-purple-700 underline hover:text-purple-900"
                >
                  Select all {pages.length} pages
                </button>
              )}
              {selectAllStore && (
                <span className="text-sm text-purple-700">
                  All {pages.length} pages selected
                </span>
              )}
            </div>
            <button
              onClick={handleClearSelection}
              className="text-purple-700 hover:text-purple-900"
            >
              <XCircle size={20} />
            </button>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-50">
          <div className="overflow-x-auto custom-scrollbar-light">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-b from-gray-50 to-white border-b-2 border-gray-100">
                  <th className="text-left py-5 px-6 w-[50px]">
                    <CustomCheckbox
                      checked={selectedPages.length === pages.length}
                      partial={selectedPages.length > 0 && selectedPages.length < pages.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {visibleColumns.includes('id') && <th className="text-left py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Page ID</th>}
                  {visibleColumns.includes('name') && <th className="text-left py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Page Name</th>}
                  {visibleColumns.includes('type') && <th className="text-left py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</th>}
                  {visibleColumns.includes('route') && <th className="text-left py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Route</th>}
                  {visibleColumns.includes('dataSource') && <th className="text-left py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Data Source</th>}
                  {visibleColumns.includes('status') && <th className="text-left py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>}
                  {visibleColumns.includes('views') && <th className="text-left py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Views (30d)</th>}
                  {visibleColumns.includes('updated') && <th className="text-left py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Last Updated</th>}
                  <th className="text-center py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.slice(0, rowsPerPage).map((page) => (
                  <tr key={page.id} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors group">
                    <td className="py-4 px-6">
                      <CustomCheckbox
                        checked={selectedPages.includes(page.id)}
                        onChange={() => handleTogglePage(page.id)}
                      />
                    </td>
                    {visibleColumns.includes('id') && (
                      <td className="py-4 px-6 font-semibold text-[#253154] text-[14px]">{page.id}</td>
                    )}
                    {visibleColumns.includes('name') && (
                      <td className="py-4 px-6 text-gray-700 font-medium text-[14px]">{page.name}</td>
                    )}
                    {visibleColumns.includes('type') && (
                      <td className="py-4 px-6"><PageTypeBadge type={page.type} /></td>
                    )}
                    {visibleColumns.includes('route') && (
                      <td className="py-4 px-6 text-gray-600 text-[13px] font-mono">{page.route}</td>
                    )}
                    {visibleColumns.includes('dataSource') && (
                      <td className="py-4 px-6 text-gray-600 text-[13px]">{page.dataSource}</td>
                    )}
                    {visibleColumns.includes('status') && (
                      <td className="py-4 px-6"><StatusBadge status={page.status} /></td>
                    )}
                    {visibleColumns.includes('views') && (
                      <td className="py-4 px-6 text-gray-700 font-semibold text-[14px]">{page.views}</td>
                    )}
                    {visibleColumns.includes('updated') && (
                      <td className="py-4 px-6 text-gray-500 text-[13px]">{page.lastUpdated}</td>
                    )}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn">
                          <Eye size={16} className="text-gray-400 group-hover/btn:text-[#253154]" />
                        </button>
                        <button
                          onClick={() => onNavigate?.('edit-page')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn"
                        >
                          <Edit size={16} className="text-gray-400 group-hover/btn:text-[#253154]" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn">
                          <MoreHorizontal size={16} className="text-gray-400 group-hover/btn:text-[#253154]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-t from-gray-50 to-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <div className="relative">
                <button
                  onClick={() => setShowRowsMenu(!showRowsMenu)}
                  className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">{rowsPerPage}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {showRowsMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowRowsMenu(false)} />
                    <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-100 z-20 p-1 w-20">
                      {[5, 10, 25, 50, 100].map(value => (
                        <button
                          key={value}
                          onClick={() => {
                            setRowsPerPage(value);
                            setShowRowsMenu(false);
                          }}
                          className="w-full px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700 text-left"
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">1-{Math.min(rowsPerPage, pages.length)} of {pages.length}</span>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={pages.length <= rowsPerPage}>
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="flex md:hidden flex-col gap-4 mb-6">
          {pages.slice(0, rowsPerPage).map((page) => (
            <MobilePageCard
              key={page.id}
              page={page}
              isSelected={selectedPages.includes(page.id)}
              onToggleSelect={() => handleTogglePage(page.id)}
            />
          ))}
        </div>

        {/* Mobile Pagination */}
        <div className="flex md:hidden items-center justify-between px-4 py-4">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <span className="text-sm text-gray-600">1-{Math.min(rowsPerPage, pages.length)} of {pages.length}</span>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={pages.length <= rowsPerPage}>
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>

      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={(open) => setShowExportDialog(open)}
        onExport={handleExport}
        moduleName="Pages"
        columns={exportColumns}
        totalCount={pages.length}
        selectedCount={selectedPages.length}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={(open) => setShowImportDialog(open)}
        onImport={handleImport}
        moduleName="Pages"
        fields={importFields}
      />
    </TooltipProvider>
  );
};