"use client";
import React, { useState } from 'react';
import {
  MoreHorizontal, Plus, Search, Filter, ArrowUpDown, ArrowDown, Columns, Download, Upload, Eye, Edit,
  Calendar as CalendarIcon, ToggleLeft, Users, FileText, Calendar as CalendarAltIcon, ChevronDown,
  ChevronLeft, ChevronRight, Check, Printer, X, RefreshCw, Building2, GraduationCap, DollarSign,
  TrendingUp, Settings, Archive, Copy, ArrowUp, Loader2, ToggleRight, Trash2,
  Globe, UserCheck, BookOpen, Heart, Image as ImageIcon, Target, Layout, Wallet, CreditCard
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as XLSX from 'xlsx';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";
import { SlickStyles } from "./ui/SlickStyles";
import { universityService } from '@/services/universityService';

import { ServicePageHeader } from './service-marketplace/ServicePageHeader';

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
  status: 'active' | 'disabled' | 'open' | 'closed';
  onClick?: (e: React.MouseEvent) => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onClick }) => {
  const statusConfig = {
    active: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      label: 'Active'
    },
    disabled: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-300',
      label: 'Disabled'
    },
    open: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      label: 'Open'
    },
    closed: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      label: 'Closed'
    }
  };

  const config = statusConfig[status] || statusConfig['disabled'];

  return (
    <span
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center cursor-pointer transition-all ${config.bg} ${config.text} ${config.border} ${onClick ? 'hover:brightness-95 active:scale-95' : ''}`}
    >
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

// --- MobileUniversityCard Component ---
interface University {
  id: string;
  name: string;
  city: string;
  country: string;
  tuition: string;
  acceptanceRate: string;
  type: string;
  applicationStatus: 'open' | 'closed';
  status: 'active' | 'disabled';
}

interface MobileUniversityCardProps {
  university: University;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
}

const MobileUniversityCard: React.FC<MobileUniversityCardProps> = ({ university, isSelected, onToggleSelect, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 w-full transition-all active:scale-[0.99] cursor-pointer flex flex-col gap-2 ${isSelected ? 'bg-purple-50/30' : ''}`}>
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-[#253154] text-[15px]">{university.name}</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-auto"
        >
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Middle row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-gray-600 text-sm">{university.city}, {university.country}</span>
        <div className="ml-auto transform scale-90 origin-right">
          <StatusBadge status={university.applicationStatus} />
        </div>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div className="mt-2 pt-3 border-t border-gray-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Tuition</div>
              <div className="text-sm text-gray-700 font-medium">{university.tuition}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Acceptance</div>
              <div className="text-sm text-gray-700 font-medium">{university.acceptanceRate}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Type</div>
              <div className="text-sm text-gray-700 font-medium">{university.type}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Status</div>
              <div className="text-sm text-gray-700 font-medium">{university.status}</div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="w-full h-10 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0c4a] transition-colors font-medium text-sm"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
interface UniversitiesOverviewPageProps {
  onNavigate?: (page: string) => void;
  onEditUniversity?: (universityId: string) => void;
}

export const UniversitiesOverviewPage: React.FC<UniversitiesOverviewPageProps> = ({ onNavigate, onEditUniversity }) => {
  const router = useRouter();
  // State management
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date()
  });
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search'>('none');
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['name', 'city', 'country', 'tuition', 'acceptanceRate', 'type', 'applicationStatus']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRowsMenu, setShowRowsMenu] = useState(false);

  // Data states
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Get countryId from URL query params
  const searchParams = useSearchParams();
  const urlCountryId = searchParams?.get('countryId');

  // Filter & Sort State
  const [filterConfig, setFilterConfig] = useState<{ type: string; status: string; applicationStatus: string; countryId: string }>({
    type: '',
    status: '',
    applicationStatus: '',
    countryId: urlCountryId || ''
  });

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc'
  });

  // Stats State
  const [stats, setStats] = useState({
    totalUniversities: 0,
    activeUniversities: 0,
    acceptingApps: 0,
    openIntakes: 0,
    highOfferRate: 0
  });



  // Fetch data
  const fetchUniversities = async () => {
    try {
      setIsLoading(true);
      const data = await universityService.getAll({
        page: currentPage,
        limit: rowsPerPage,
        search: searchQuery,
        type: filterConfig.type || undefined,
        status: filterConfig.status || undefined,
        applicationStatus: filterConfig.applicationStatus || undefined,
        countryId: filterConfig.countryId || undefined,
        sort: sortConfig.key,
        order: sortConfig.direction
      });
      // Handle both array response or paginated response structure
      const rawList = Array.isArray(data) ? data : (data?.data || []);
      const mappedList = rawList.map((item: any) => ({
        ...item,
        country: item.country_name || item.country || '',
        acceptanceRate: item.acceptance_rate || item.acceptanceRate || '',
        applicationStatus: item.application_status || item.applicationStatus || 'open',
      }));
      setUniversities(mappedList);
      console.log("[UniversitiesOverviewPage] Successfully fetched universities:", mappedList.length);
    } catch (error) {
      console.error("[UniversitiesOverviewPage] Failed to fetch universities:", error);
      toast.error("Failed to load universities");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and search effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchUniversities();
    }, 500); // 500ms debounce for search
    return () => clearTimeout(timer);
  }, [searchQuery, rowsPerPage, currentPage, filterConfig, sortConfig]);

  // Fetch stats on mount
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await universityService.getMetrics();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Metrics data
  const metrics = [
    {
      title: 'Total Universities',
      value: (stats?.totalUniversities || 0).toLocaleString(),
      icon: Building2,
      bgClass: 'bg-purple-50',
      colorClass: 'text-purple-600',
      tooltip: 'Total universities in the system'
    },
    {
      title: 'Active Universities',
      value: (stats?.activeUniversities || 0).toLocaleString(),
      icon: GraduationCap,
      bgClass: 'bg-green-50',
      colorClass: 'text-green-600',
      tooltip: 'Currently active universities'
    },
    {
      title: 'Accepting Apps',
      value: (stats?.acceptingApps || 0).toLocaleString(),
      icon: FileText,
      bgClass: 'bg-blue-50',
      colorClass: 'text-blue-600',
      tooltip: 'Universities accepting applications'
    },
    {
      title: 'Open Intakes',
      value: (stats?.openIntakes || 0).toLocaleString(),
      icon: CalendarAltIcon,
      bgClass: 'bg-amber-50',
      colorClass: 'text-amber-600',
      tooltip: 'Universities with open intakes'
    },
    {
      title: 'High-Offer Rate',
      value: (stats?.highOfferRate || 0).toLocaleString(),
      icon: TrendingUp,
      bgClass: 'bg-pink-50',
      colorClass: 'text-pink-600',
      tooltip: 'Universities with > 70% acceptance rate'
    }
  ];

  // Column configuration
  const allColumns = [
    { key: 'name', label: 'University Name' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'tuition', label: 'Tuition' },
    { key: 'acceptanceRate', label: 'Acceptance Rate' },
    { key: 'type', label: 'Type' },
    { key: 'applicationStatus', label: 'Applications' },
    { key: 'status', label: 'Status' }
  ];

  // Handlers
  const handleRefresh = () => {
    fetchUniversities();
    toast.success("Refreshing data...");
  };

  const handleAddUniversity = () => {
    router.push('/universities/add');
  };

  const handleEditUniversity = (id: string, tab: string = 'basic-info') => {
    router.push(`/universities/edit/${id}?tab=${tab}`);
  };

  const handleDeleteUniversity = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this university? This action cannot be undone.")) {
      try {
        toast.loading("Deleting university...");
        await universityService.delete(id);
        toast.dismiss();
        toast.success("University deleted successfully");
        fetchUniversities();
      } catch (error) {
        toast.dismiss();
        console.error("Delete failed:", error);
        toast.error("Failed to delete university");
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedUniversities.length === universities.length) {
      setSelectedUniversities([]);
      setSelectAllStore(false);
    } else {
      setSelectedUniversities(universities.map(u => u.id));
      setSelectAllStore(false);
    }
  };

  const handleToggleUniversity = (id: string) => {
    setSelectedUniversities(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedUniversities(universities.map(u => u.id));
  };

  // handleClearSelection removed from here as it is defined later


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
    { id: 'id', label: 'Database ID', defaultSelected: false },
    { id: 'name', label: 'University Name', defaultSelected: true },
    { id: 'universityId', label: 'University ID', defaultSelected: true },
    { id: 'city', label: 'City', defaultSelected: true },
    { id: 'country', label: 'Country', defaultSelected: true },
    { id: 'tuition', label: 'Tuition Fees', defaultSelected: true },
    { id: 'acceptanceRate', label: 'Acceptance Rate', defaultSelected: true },
    { id: 'type', label: 'University Type', defaultSelected: false },
    { id: 'applicationStatus', label: 'Application Status', defaultSelected: false },
    { id: 'ranking', label: 'Ranking', defaultSelected: false },
    { id: 'intakes', label: 'Available Intakes', defaultSelected: false }
  ];

  const importFields: ImportField[] = [
    { id: 'id', label: 'Database ID (For Updates)', required: false, type: 'text' },
    { id: 'universityName', label: 'University Name', required: true, type: 'text' },
    { id: 'universityId', label: 'University ID', required: false, type: 'text' },
    { id: 'city', label: 'City', required: true, type: 'text' },
    { id: 'country', label: 'Country', required: true, type: 'text' },
    { id: 'tuitionFees', label: 'Tuition Fees', required: true, type: 'text' },
    { id: 'acceptanceRate', label: 'Acceptance Rate (%)', required: false, type: 'number' },
    { id: 'universityType', label: 'University Type', required: true, type: 'select', options: ['Public', 'Private'] },
    { id: 'applicationStatus', label: 'Application Status', required: false, type: 'select', options: ['Open', 'Closed'] },
    { id: 'ranking', label: 'Global Ranking', required: false, type: 'number' },
    { id: 'status', label: 'Status', required: false, type: 'select', options: ['Active', 'Disabled'] }
  ];

  const handleExport = async (options: any) => {
    try {
      toast.info(`Exporting ${options.scope} universities...`);
      const data = await universityService.export(options.format);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `universities_export.${options.format}`);
      document.body.appendChild(link);
      link.remove();

      toast.success("Export completed successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export universities");
    }
  };

  const handleImport = async (data: any[], mode: any) => {
    let successCount = 0;
    let failCount = 0;

    const loadingToast = toast.loading(`Importing universities (0/${data.length})...`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const payload: any = {
          name: row.universityName,
          city: row.city,
          country: row.country,
          tuition: row.tuitionFees,
          acceptanceRate: String(row.acceptanceRate || ''),
          type: row.universityType || 'Public',
          applicationStatus: (row.applicationStatus || 'open').toLowerCase(),
          status: (row.status || 'active').toLowerCase()
        };

        let targetId = row.id;
        if (!targetId && row.universityName && (mode === 'update' || mode === 'merge')) {
          const searchResult = await universityService.getAll({ search: row.universityName, limit: 10 });
          const rawList = Array.isArray(searchResult) ? searchResult : (searchResult?.data || []);
          const existingItem = rawList.find((i: any) => 
            i.name?.trim().toLowerCase() === row.universityName.trim().toLowerCase()
          );
          if (existingItem) {
            targetId = existingItem.id;
          }
        }

        if ((mode === 'update' || mode === 'merge') && targetId) {
          await universityService.update(targetId, payload);
        } else {
          await universityService.create(payload);
        }
        successCount++;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || error.message || "Unknown error";
        console.error(`Failed to import university row ${i + 1}:`, error);
        toast.error(`Row ${i + 1} (${row.universityName || 'Unknown'}): ${errorMessage}`, { duration: 5000 });
        failCount++;
      }
      toast.loading(`Importing universities (${successCount + failCount}/${data.length})...`, { id: loadingToast });
    }

    toast.dismiss(loadingToast);
    if (successCount > 0) {
      toast.success(`Import complete! ${successCount} successful, ${failCount} failed.`);
    } else {
      toast.error(`Import failed! All ${failCount} rows failed.`);
    }
    fetchUniversities();
    setShowImportDialog(false);
  };



  const handleBulkUpdateStatus = async (status: 'active' | 'disabled') => {
    try {
      toast.loading(`Updating ${selectedUniversities.length} universities...`);
      await universityService.bulkUpdateStatus(selectedUniversities, status);
      toast.dismiss();
      toast.success(`Successfully updated universities to ${status}`);
      fetchUniversities();
      setSelectedUniversities([]);
    } catch (error) {
      toast.dismiss();
      console.error("Bulk update failed:", error);
      toast.error("Failed to update universities");
    }
  };

  const handleExportSelected = async () => {
    try {
      // Filter the universities data on client side based on selection
      const selectedData = universities.filter(u => selectedUniversities.includes(u.id));

      // Convert to CSV/Excel (reuses the service export logic if we could, but service exports ALL from backend)
      // Since service export URL downloads ALL, we need a way to filter. 
      // Current backend doesn't support filtering export by IDs. 
      // Workaround: We will use the client-side data we already have.

      // For now, let's just trigger the full export but tell user it is "selected" 
      // OR better: use the 'xlsx' library we installed to generate a file client-side!

      const worksheet = (XLSX.utils as any).json_to_sheet(selectedData);
      const workbook = (XLSX.utils as any).book_new();
      (XLSX.utils as any).book_append_sheet(workbook, worksheet, "Universities");
      XLSX.writeFile(workbook, "selected_universities.xlsx");

      toast.success("Exported selected universities");
    } catch (error) {
      console.error("Export selected failed:", error);
      toast.error("Failed to export selection");
    }
  };

  const handleClearSelection = () => {
    setSelectedUniversities([]);
  };

  const handleAddApplication = (universityId: string) => {
    if (onNavigate) {
      onNavigate('students-applications');
    } else {
      router.push(`/students/applications?universityId=${universityId}`);
    }
  };

  return (
    <TooltipProvider>
      <SlickStyles />
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">

        {/* Desktop Action Bar */}
        <ServicePageHeader 
          title="Universities" 
          dateRange={date} 
          onDateChange={setDate}
          onRefresh={handleRefresh}
          onExport={() => setShowExportDialog(true)}
          onImport={() => setShowImportDialog(true)}
          onAdd={handleAddUniversity}
          addLabel="Add University"
        />

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
              placeholder="Search by university name, ID, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-64 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Filter by</div>

                    {filterConfig.countryId && (
                      <div className="px-3 py-2 bg-purple-50 mx-2 rounded-lg mb-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-purple-700">Filtered by Country</span>
                          <button
                            onClick={() => setFilterConfig(prev => ({ ...prev, countryId: '' }))}
                            className="text-purple-400 hover:text-purple-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Country Filter - Placeholder for now */}
                    {/* <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left">Country</button> */}

                    <div className="px-3 py-2">
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Institution Type</label>
                      <select
                        className="w-full text-sm border-gray-200 rounded-lg p-1"
                        value={filterConfig.type}
                        onChange={(e) => setFilterConfig(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="">All Types</option>
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>

                    <div className="px-3 py-2">
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Application Status</label>
                      <select
                        className="w-full text-sm border-gray-200 rounded-lg p-1"
                        value={filterConfig.applicationStatus}
                        onChange={(e) => setFilterConfig(prev => ({ ...prev, applicationStatus: e.target.value }))}
                      >
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div className="px-3 py-2">
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">System Status</label>
                      <select
                        className="w-full text-sm border-gray-200 rounded-lg p-1"
                        value={filterConfig.status}
                        onChange={(e) => setFilterConfig(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        className="w-full px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium"
                        onClick={() => {
                          setFilterConfig({ type: '', status: '', applicationStatus: '', countryId: '' });
                          setShowFilterMenu(false);
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
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
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-48 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Sort By</div>
                    {[
                      { label: 'Name', key: 'name' },
                      { label: 'Popularity', key: 'ranking' }, // Assuming ranking maps to popularity for now
                      { label: 'Tuition Fees', key: 'tuition' },
                      { label: 'Acceptance Rate', key: 'acceptance_rate' },
                      { label: 'Ranking', key: 'ranking' },
                      { label: 'Last Updated', key: 'updated_at' } // Assuming backend supports this or created_at
                    ].map((option) => (
                      <button
                        key={option.label}
                        className={`w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left flex items-center justify-between ${sortConfig.key === option.key ? 'text-purple-600 bg-purple-50' : 'text-gray-700'}`}
                        onClick={() => {
                          if (sortConfig.key === option.key) {
                            setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }));
                          } else {
                            setSortConfig({ key: option.key, direction: 'asc' });
                          }
                          setShowSortMenu(false);
                        }}
                      >
                        <span>{option.label}</span>
                        {sortConfig.key === option.key && (
                          sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                        )}
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
                className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <Columns size={20} strokeWidth={1.5} />
              </button>

              {showColumnMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowColumnMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Show Columns</div>
                    {allColumns.map(column => (
                      <div
                        key={column.key}
                        onClick={() => handleToggleColumn(column.key)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <CustomCheckbox
                          checked={visibleColumns.includes(column.key)}
                          onChange={() => { }}
                        />
                        <span className="text-sm text-gray-700">{column.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* More Button */}
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
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Eye size={16} />
                      View University Details
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Edit size={16} />
                      Edit University Data
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <CalendarAltIcon size={16} />
                      Manage Intakes
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <FileText size={16} />
                      Manage Programs
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                       <ToggleLeft size={16} />
                       Enable/Disable
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                       <Users size={16} />
                       View Linked Applications
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mb-6 flex gap-3">
          <div className="flex-1 h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center px-5 gap-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search universities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-full border-none focus:ring-0 text-sm bg-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setActiveMobileMenu(activeMobileMenu === 'search' ? 'none' : 'search')}
            className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center"
          >
            <MoreHorizontal size={22} className="text-[#253154]" />
          </button>
        </div>

        {/* Mobile Bottom Sheet - Import Menu */}
        {activeMobileMenu === 'import' && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-40 transition-opacity"
              onClick={() => setActiveMobileMenu('none')}
            />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[30px] z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl custom-scrollbar-light">
              <div className="p-6 flex flex-col gap-6">
                {/* Drag handle */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-2" />

                {/* Actions Section */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Actions</div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setShowExportDialog(true);
                        setActiveMobileMenu('none');
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700"
                    >
                      <Download size={18} />
                      <span className="font-medium">Export Data</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowImportDialog(true);
                        setActiveMobileMenu('none');
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700"
                    >
                      <Upload size={18} />
                      <span className="font-medium">Import Data</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700">
                      <Printer size={18} />
                      <span className="font-medium">Print</span>
                    </button>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setActiveMobileMenu('none')}
                  className="mt-2 w-full bg-gray-100 text-gray-900 font-medium py-4 rounded-2xl"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {/* Mobile Bottom Sheet - Search Menu */}
        {activeMobileMenu === 'search' && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-40 transition-opacity"
              onClick={() => setActiveMobileMenu('none')}
            />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[30px] z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl custom-scrollbar-light">
              <div className="p-6 flex flex-col gap-6">
                {/* Drag handle */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-2" />

                {/* Filter Pills */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filter by Type</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', 'Public', 'Private', 'Open Applications'].map((type, idx) => (
                      <button
                        key={type}
                        className={`rounded-full text-sm font-medium px-2 py-2 border ${idx === 0
                          ? 'bg-purple-50 text-purple-700 border-purple-100'
                          : 'bg-gray-50 text-gray-600 border-gray-100'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100" />

                {/* Sort Options */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sort By</div>
                  <div className="grid grid-cols-1 gap-2">
                    {['Popularity', 'Tuition Fees', 'Acceptance Rate', 'Ranking'].map(option => (
                      <button key={option} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700">
                        <span className="font-medium">{option}</span>
                        <ArrowDown size={16} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setActiveMobileMenu('none')}
                  className="mt-2 w-full bg-gray-100 text-gray-900 font-medium py-4 rounded-2xl"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Selection Banner */}
          {selectedUniversities.length > 0 && (
            <div className="bg-purple-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm border-b border-purple-100">
              <div className="flex items-center gap-2">
                <span className="text-purple-900">
                  {selectedUniversities.length} universit{selectedUniversities.length > 1 ? 'ies' : 'y'} selected
                </span>
                {!selectAllStore && selectedUniversities.length === universities.length && (
                  <>
                    <span className="text-purple-700">·</span>
                    <button onClick={handleSelectAllStore} className="text-purple-700 font-bold hover:underline">
                      Select all {universities.length} universities
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => handleBulkUpdateStatus('active')} className="text-purple-700 font-bold hover:underline">Bulk Enable</button>
                  <button onClick={() => handleBulkUpdateStatus('disabled')} className="text-purple-700 font-bold hover:underline">Bulk Disable</button>
                  <button onClick={handleExportSelected} className="text-purple-700 font-bold hover:underline">Export Selected</button>
                  <button onClick={handleClearSelection} className="text-purple-700 font-bold hover:underline">Clear</button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="sticky top-0 z-10 bg-white w-12 px-6 py-4">
                    <CustomCheckbox
                      checked={selectedUniversities.length === universities.length}
                      partial={selectedUniversities.length > 0 && selectedUniversities.length < universities.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {allColumns.filter(col => visibleColumns.includes(col.key)).map(column => (
                    <th key={column.key} className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">
                      {column.label}
                    </th>
                  ))}
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {universities.length > 0 ? universities.map(university => (
                  <tr
                    key={university.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer group ${selectedUniversities.includes(university.id) ? 'bg-purple-50/30' : ''}`}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('td:first-child') || (e.target as HTMLElement).closest('td:last-child')) {
                        return;
                      }
                      handleEditUniversity(university.id);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CustomCheckbox
                        checked={selectedUniversities.includes(university.id)}
                        onChange={() => handleToggleUniversity(university.id)}
                      />
                    </td>
                    {visibleColumns.includes('name') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#253154]">{university.name}</td>
                    )}
                    {visibleColumns.includes('city') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{university.city}</td>
                    )}
                    {visibleColumns.includes('country') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{university.country}</td>
                    )}
                    {visibleColumns.includes('tuition') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#253154]">{university.tuition}</td>
                    )}
                    {visibleColumns.includes('acceptanceRate') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{university.acceptanceRate}</td>
                    )}
                    {visibleColumns.includes('type') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{university.type}</td>
                    )}
                    {visibleColumns.includes('applicationStatus') && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={university.applicationStatus}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddApplication(university.id);
                          }}
                        />
                      </td>
                    )}
                    {visibleColumns.includes('status') && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={university.status} />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => { e.stopPropagation(); }}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditUniversity(university.id); }}
                          className="p-2 hover:bg-purple-50 rounded-lg transition-colors group/view"
                          title="View Details"
                        >
                          <Eye size={18} className="text-gray-400 group-hover/view:text-purple-600" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditUniversity(university.id, 'basic-info'); }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                          title="Edit Basic Info"
                        >
                          <Edit size={18} className="text-gray-400 group-hover:text-blue-600" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddApplication(university.id); }}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                          title="Add Application"
                        >
                          <Plus size={18} className="text-gray-400 group-hover:text-green-600" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteUniversity(university.id); }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-gray-400 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                          <GraduationCap size={24} className="text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">No data available</p>
                        <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                          There are no universities matching your current filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {universities.length > 0 ? (
              universities.map(university => (
                <MobileUniversityCard
                  key={university.id}
                  university={university}
                  isSelected={selectedUniversities.includes(university.id)}
                  onToggleSelect={() => handleToggleUniversity(university.id)}
                  onEdit={() => handleEditUniversity(university.id)}
                />
              ))
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <GraduationCap size={24} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No data available</p>
                <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                  There are no universities matching your current filters.
                </p>
              </div>
            )}
          </div>

          {/* Pagination Bar */}
          {universities.length > 0 && (
            <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 rounded-tr-[30px] shadow-[0px_-5px_25px_rgba(0,0,0,0.03)] relative z-20 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm font-medium">Rows per page:</span>
                <div className="relative">
                  <button
                    onClick={() => setShowRowsMenu(!showRowsMenu)}
                    className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors flex items-center justify-between gap-2"
                  >
                    <span className="text-sm font-medium text-gray-700">{rowsPerPage}</span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>

                  {showRowsMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowRowsMenu(false)} />
                      <div className="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-xl border border-gray-100 z-20 p-1 animate-in slide-in-from-bottom-1 duration-200">
                        {[10, 25, 50, 100].map(num => (
                          <button
                            key={num}
                            onClick={() => {
                              setRowsPerPage(num);
                              setShowRowsMenu(false);
                            }}
                            className={`w-full px-3 py-1.5 text-xs font-medium rounded ${rowsPerPage === num
                              ? 'bg-purple-50 text-purple-700'
                              : 'text-gray-600 hover:bg-gray-50'
                              }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-500 font-medium">
                Showing {universities.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, universities.length)} of {universities.length} records
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} strokeWidth={2} className="text-gray-500" />
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center"
                >
                  <ChevronRight size={18} strokeWidth={2} className="text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Universities"
        totalCount={1247}
        selectedCount={selectedUniversities.length}
        columns={exportColumns}
        supportsDateRange={true}
        onExport={handleExport}
      />

      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Universities"
        fields={importFields}
        onImport={handleImport}
        templateUrl="/templates/universities-import-template.xlsx"
        allowUpdate={true}
      />
    </TooltipProvider>
  );
};
;