import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal,
  Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check,
  Columns, Clock, CheckCircle, XCircle, Users, Edit2, Trash2
} from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";
import { bookingService, Booking as ApiBooking } from '../../services/bookingService';

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { AddBookingModal } from './AddBookingModal';
import { EditBookingModal } from './EditBookingModal';
import { PermissionGuard } from './common/PermissionGuard';
import { usePermission } from '@/hooks/usePermission';

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
  status: 'upcoming' | 'completed' | 'cancelled' | 'no-show';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    upcoming: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', label: 'Upcoming' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Completed' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'Cancelled' },
    'no-show': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', label: 'No-Show' }
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

interface Booking {
  id: string;
  bookingId: string;
  dateTime: string;
  studentName: string;
  service: string;
  expert: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'no-show';
  mode: string;
  source?: 'regular' | 'concierge'; // Added to identify booking source
}

interface MobileBookingCardProps {
  booking: ApiBooking;
  isSelected: boolean;
  onToggleSelect: () => void;
  onNavigateToDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MobileBookingCard: React.FC<MobileBookingCardProps> = ({ booking, isSelected, onToggleSelect, onNavigateToDetail, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { hasPermission: canViewDetails } = usePermission('bookings', 'view');

  return (
    <div className={`bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 w-full transition-all active:scale-[0.99] cursor-pointer flex flex-col gap-2 ${isSelected ? 'bg-purple-50/30' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-[#253154] text-[15px]">{booking.booking_id}</span>
        <span className="bg-[#F4F4F4] text-gray-500 text-[10px] px-2 py-1 rounded-lg">Tap to view</span>
        <StatusBadge status={booking.status} />
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-auto">
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div onClick={(e) => e.stopPropagation()}>
          <CustomCheckbox checked={isSelected} onChange={onToggleSelect} />
        </div>
        <div className="flex-1">
          <p className="text-[14px] text-gray-700 font-medium">{booking.student_name}</p>
          <p className="text-[12px] text-gray-500">{booking.service}</p>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-2 pt-3 border-t border-gray-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Date & Time</div>
              <div className="text-sm text-gray-700 font-medium">{format(new Date(booking.date_time), 'MMM d, h:mm a')}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Expert</div>
              <div className="text-sm text-gray-700 font-medium">{booking.expert}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Mode</div>
              <div className="text-sm text-gray-700 font-medium">{booking.mode}</div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (canViewDetails) {
                onNavigateToDetail?.();
              } else {
                toast.error("Access Denied", { description: "You don't have permission to view booking details." });
              }
            }}
            className="w-full h-10 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0c4a] transition-colors font-medium text-sm mb-2"
          >
            View Details
          </button>
          <div className="flex gap-2">
            <PermissionGuard module="bookings" action="edit">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                className="flex-1 h-10 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Edit2 size={16} /> Edit
              </button>
            </PermissionGuard>
            <PermissionGuard module="bookings" action="delete">
              <button
                onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                className="flex-1 h-10 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Delete
              </button>
            </PermissionGuard>
          </div>
        </div>
      )}
    </div>
  );
};

interface BookingsOverviewPageProps {
  onNavigate?: (page: string, bookingId?: string) => void;
}

const BookingsOverviewPage: React.FC<BookingsOverviewPageProps> = ({ onNavigate }) => {
  const { hasPermission: canViewDetails } = usePermission('bookings', 'view');
  const { hasPermission: canCreate } = usePermission('bookings', 'create');
  const { hasPermission: canEdit } = usePermission('bookings', 'edit');
  const { hasPermission: canDelete } = usePermission('bookings', 'delete');
  const { hasPermission: canExport } = usePermission('bookings', 'export');
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search'>('none');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['bookingId', 'dateTime', 'studentName', 'service', 'expert', 'mode', 'status', 'actions']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<ApiBooking | null>(null);

  // Dynamic Features State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filterConfig, setFilterConfig] = useState<{ status: string[]; mode: string[] }>({ status: [], mode: [] });
  const [currentPage, setCurrentPage] = useState(1);

  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const metrics = [
    { title: 'Total Bookings', value: bookings.length.toString(), icon: CalendarIcon, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total number of bookings in selected period' },
    { title: 'Upcoming', value: bookings.filter(b => b.status === 'upcoming').length.toString(), icon: Clock, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Scheduled bookings yet to occur' },
    { title: 'Completed', value: bookings.filter(b => b.status === 'completed').length.toString(), icon: CheckCircle, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Successfully completed bookings' },
    { title: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length.toString(), icon: XCircle, bgClass: 'bg-red-50', colorClass: 'text-red-600', tooltip: 'Cancelled or no-show bookings' },
    { title: 'Active Experts', value: new Set(bookings.map(b => b.expert)).size.toString(), icon: Users, bgClass: 'bg-cyan-50', colorClass: 'text-cyan-600', tooltip: 'Number of experts with active bookings' }
  ];

  const allColumns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'dateTime', type: 'date', label: 'Date & Time' },
    { key: 'studentName', label: 'Student' },
    { key: 'service', label: 'Service' },
    { key: 'expert', label: 'Expert' },
    { key: 'mode', label: 'Mode' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  // Derived Data Logic
  const filteredAndSortedBookings = React.useMemo(() => {
    let result = [...bookings];

    // Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(b =>
        b.student_name.toLowerCase().includes(lowerSearch) ||
        b.booking_id.toLowerCase().includes(lowerSearch) ||
        b.service.toLowerCase().includes(lowerSearch) ||
        b.expert.toLowerCase().includes(lowerSearch)
      );
    }

    // Filters
    if (filterConfig.status.length > 0) {
      result = result.filter(b => filterConfig.status.includes(b.status));
    }
    if (filterConfig.mode.length > 0) {
      result = result.filter(b => filterConfig.mode.includes(b.mode));
    }

    // Date Range Filter
    if (date?.from && date?.to) {
      const from = new Date(date.from);
      from.setHours(0, 0, 0, 0);
      const to = new Date(date.to);
      to.setHours(23, 59, 59, 999);

      result = result.filter(b => {
        const bDate = new Date(b.date_time);
        return bDate >= from && bDate <= to;
      });
    }

    // Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key as keyof ApiBooking] ?? '';
        const valB = b[sortConfig.key as keyof ApiBooking] ?? '';

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [bookings, searchTerm, sortConfig, filterConfig]);

  const paginatedBookings = filteredAndSortedBookings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedBookings.length / rowsPerPage);

  const handleRefresh = () => {
    fetchBookings();
    toast.success("Refreshing data...");
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
      setSelectAllStore(false);
    } else {
      setSelectedBookings(bookings.map(b => b.booking_id));
      setSelectAllStore(false);
    }
  };

  const handleToggleBooking = (bookingId: string) => {
    setSelectedBookings(prev => prev.includes(bookingId) ? prev.filter(id => id !== bookingId) : [...prev, bookingId]);
  };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedBookings(bookings.map(b => b.booking_id));
  };

  const handleClearSelection = () => {
    setSelectedBookings([]);
    setSelectAllStore(false);
  };

  const exportColumns: ExportColumn[] = [
    { id: 'id', label: 'Database ID', defaultSelected: false },
    { id: 'bookingId', label: 'Booking ID', defaultSelected: true },
    { id: 'dateTime', label: 'Date & Time', defaultSelected: true },
    { id: 'studentName', label: 'Student Name', defaultSelected: true },
    { id: 'service', label: 'Service', defaultSelected: true },
    { id: 'expert', label: 'Expert', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'mode', label: 'Mode', defaultSelected: true }
  ];

  const importFields: ImportField[] = [
    { id: 'id', label: 'Database ID (For Updates)', required: false, type: 'text' },
    { id: 'bookingId', label: 'Booking ID', required: true, type: 'text' },
    { id: 'dateTime', label: 'Date & Time', required: true, type: 'text' },
    { id: 'studentName', label: 'Student Name', required: true, type: 'text' },
    { id: 'service', label: 'Service', required: true, type: 'select', options: ['Initial Consultation', 'Visa Interview Prep', 'Document Review', 'Application Support', 'SOP Review', 'University Selection'] },
    { id: 'expert', label: 'Expert', required: true, type: 'text' },
    { id: 'status', label: 'Status', required: true, type: 'select', options: ['upcoming', 'completed', 'cancelled', 'no-show'] },
    { id: 'mode', label: 'Mode', required: true, type: 'select', options: ['Online', 'In-Person'] }
  ];

  const handleToggleFilter = (type: 'status' | 'mode', value: string) => {
    setFilterConfig(prev => {
      const current = prev[type];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [type]: next };
    });
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleToggleColumn = (key: string) => {
    setVisibleColumns(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleDelete = async (id: string) => {
    if (!canDelete) {
      toast.error('Unauthorized', { description: 'You do not have permission to delete bookings.' });
      return;
    }
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await bookingService.deleteBooking(id);
        toast.success("Booking deleted successfully");
        fetchBookings();
      } catch (error) {
        console.error("Error deleting booking:", error);
        toast.error("Failed to delete booking");
      }
    }
  };

  const handleEdit = (booking: ApiBooking) => {
    if (!canEdit) {
      toast.error('Unauthorized', { description: 'You do not have permission to edit bookings.' });
      return;
    }
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleExport = async (options: any) => {
    if (!canExport) {
      toast.error('Unauthorized', { description: 'You do not have permission to export booking data.' });
      return;
    }
    const dataToExport = options.scope === 'selected'
      ? bookings.filter(b => selectedBookings.includes(b.booking_id))
      : filteredAndSortedBookings;

    const headers = exportColumns
      .filter(col => options.columns.includes(col.id))
      .map(col => col.label);

    const rows = dataToExport.map(booking => {
      const row: string[] = [];
      if (options.columns.includes('bookingId')) row.push(booking.booking_id);
      if (options.columns.includes('dateTime')) row.push(format(new Date(booking.date_time), 'yyyy-MM-dd HH:mm'));
      if (options.columns.includes('studentName')) row.push(booking.student_name);
      if (options.columns.includes('service')) row.push(booking.service);
      if (options.columns.includes('expert')) row.push(booking.expert);
      if (options.columns.includes('status')) row.push(booking.status);
      if (options.columns.includes('mode')) row.push(booking.mode);
      return row.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${dataToExport.length} bookings as ${options.format}`);
  };

  const handleImport = async (data: any[], mode: any) => {
    if (!canCreate && mode === 'create') {
      toast.error('Unauthorized', { description: 'You do not have permission to import new bookings.' });
      return;
    }
    if (!canEdit && (mode === 'update' || mode === 'merge')) {
      toast.error('Unauthorized', { description: 'You do not have permission to update bookings via import.' });
      return;
    }
    let successCount = 0;
    let failCount = 0;

    const loadingToast = toast.loading(`Importing bookings (0/${data.length})...`);

    try {
      const allBookings = await bookingService.getAllBookings();

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const payload: any = {
            booking_id: row.bookingId,
            date_time: row.dateTime ? new Date(row.dateTime).toISOString() : new Date().toISOString(),
            student_name: row.studentName,
            service: row.service,
            expert: row.expert,
            status: (row.status || 'upcoming').toLowerCase(),
            mode: row.mode || 'Online',
            source: 'regular'
          };

          let targetId = row.id;
          if (!targetId && row.bookingId && (mode === 'update' || mode === 'merge')) {
            const existingItem = allBookings.find((i: any) => 
              i.booking_id?.trim().toLowerCase() === row.bookingId.trim().toLowerCase()
            );
            if (existingItem) {
              targetId = existingItem.id;
            }
          }

          if ((mode === 'update' || mode === 'merge') && targetId) {
            await bookingService.updateBooking(targetId, payload);
          } else {
            await bookingService.createBooking(payload);
          }
          successCount++;
        } catch (error: any) {
          const errorMessage = error.message || "Unknown error";
          console.error(`Failed to import booking row ${i + 1}:`, error);
          toast.error(`Row ${i + 1} (${row.bookingId || 'Unknown'}): ${errorMessage}`, { duration: 5000 });
          failCount++;
        }
        toast.loading(`Importing bookings (${successCount + failCount}/${data.length})...`, { id: loadingToast });
      }

      toast.dismiss(loadingToast);
      if (successCount > 0) {
        toast.success(`Import complete! ${successCount} successful, ${failCount} failed.`);
      } else {
        toast.error(`Import failed! All ${failCount} rows failed.`);
      }
      fetchBookings();
      setShowImportDialog(false);

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Bulk lookup failed:", error);
      toast.error("Failed to execute import batch lookup setup.");
    }
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
            <PermissionGuard module="bookings" action="export">
              <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium">
                <Download size={20} strokeWidth={1.5} />Export
              </button>
            </PermissionGuard>
            <PermissionGuard module="bookings" action="create">
              <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium">
                <Upload size={20} strokeWidth={1.5} />Import
              </button>
            </PermissionGuard>
            <PermissionGuard module="bookings" action="create">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"
              >
                <Plus size={20} strokeWidth={1.5} />Add Booking
              </button>
            </PermissionGuard>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="flex md:hidden flex-col gap-4 mb-6">
          <div className="w-full h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <CalendarIcon size={18} className="text-[#253154]" />
              <span className="text-sm font-medium text-[#253154]">{date?.from && date?.to ? `${format(date.from, 'd MMM')} - ${format(date.to, 'd MMM')}` : 'All Bookings'}</span>
            </div>
            <button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-full transition-colors active:rotate-180 active:duration-500">
              <RefreshCw size={18} className="text-[#253154]" />
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 h-[50px] bg-[#0e042f] text-white rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={20} />Add Booking
            </button>
            <button onClick={() => setActiveMobileMenu(activeMobileMenu === 'import' ? 'none' : 'import')} className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center">
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
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                  <Filter size={20} strokeWidth={1.5} />
                  {filterConfig.status.length + filterConfig.mode.length > 0 && (
                    <span className="ml-2 bg-purple-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {filterConfig.status.length + filterConfig.mode.length}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1">Status</DropdownMenuLabel>
                {['upcoming', 'completed', 'cancelled', 'no-show'].map(status => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={filterConfig.status.includes(status)}
                    onCheckedChange={() => handleToggleFilter('status', status)}
                    className="rounded-lg capitalize"
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1">Mode</DropdownMenuLabel>
                {['Online', 'In-Person', 'Call'].map(mode => (
                  <DropdownMenuCheckboxItem
                    key={mode}
                    checked={filterConfig.mode.includes(mode)}
                    onCheckedChange={() => handleToggleFilter('mode', mode)}
                    className="rounded-lg"
                  >
                    {mode}
                  </DropdownMenuCheckboxItem>
                ))}
                {(filterConfig.status.length > 0 || filterConfig.mode.length > 0) && (
                  <>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={() => {
                        setFilterConfig({ status: [], mode: [] });
                        setDate(undefined);
                      }}
                      className="justify-center text-purple-600 font-medium focus:text-purple-700"
                    >
                      Clear all filters
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                  <ArrowUpDown size={20} strokeWidth={1.5} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1">Sort by</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sortConfig?.key} onValueChange={handleSort}>
                  {allColumns.map(col => (
                    <DropdownMenuRadioItem
                      key={col.key}
                      value={col.key}
                      className="rounded-lg"
                    >
                      {col.label}
                      {sortConfig?.key === col.key && (
                        <span className="ml-auto text-[10px] text-purple-600 font-bold uppercase">
                          {sortConfig.direction}
                        </span>
                      )}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
                {sortConfig && (
                  <>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={() => setSortConfig(null)}
                      className="justify-center text-gray-500 font-medium"
                    >
                      Reset sorting
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                  <Columns size={20} strokeWidth={1.5} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1">Visible Columns</DropdownMenuLabel>
                {allColumns.map(col => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns.includes(col.key)}
                    onCheckedChange={() => handleToggleColumn(col.key)}
                    className="rounded-lg"
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex md:hidden mb-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-sm font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>
        </div>

        {selectedBookings.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#253154]">{selectedBookings.length} selected</span>
              {!selectAllStore && selectedBookings.length === bookings.length && (
                <button onClick={handleSelectAllStore} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Select all {bookings.length} bookings
                </button>
              )}
              {selectAllStore && <span className="text-sm text-purple-600 font-medium">All {bookings.length} bookings selected</span>}
            </div>
            <button onClick={handleClearSelection} className="text-sm text-gray-600 hover:text-gray-700">Clear selection</button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="animate-spin text-purple-600" size={32} />
              <span className="ml-3 text-gray-500 font-medium">Loading bookings...</span>
            </div>
          )}

          {!isLoading && bookings.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="text-gray-300" size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#253154]">No bookings found</h3>
              <p className="text-gray-500 max-w-xs mt-1">There are no bookings recorded in the system yet.</p>
            </div>
          )}

          {!isLoading && bookings.length > 0 && (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="w-12 px-6 py-4 text-left">
                        <CustomCheckbox checked={selectedBookings.length === paginatedBookings.length && paginatedBookings.length > 0} partial={selectedBookings.length > 0 && selectedBookings.length < paginatedBookings.length} onChange={handleSelectAll} />
                      </th>
                      {visibleColumns.includes('bookingId') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Booking ID</th>}
                      {visibleColumns.includes('dateTime') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>}
                      {visibleColumns.includes('studentName') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Student</th>}
                      {visibleColumns.includes('service') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Service</th>}
                      {visibleColumns.includes('expert') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Expert</th>}
                      {visibleColumns.includes('mode') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mode</th>}
                      {visibleColumns.includes('status') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>}
                      {visibleColumns.includes('actions') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedBookings.map((booking) => (
                      <tr
                        key={booking.booking_id}
                        onClick={() => {
                          if (canViewDetails) {
                            onNavigate?.('booking-detail', booking.booking_id);
                          } else {
                            toast.error("Access Denied", { description: "You don't have permission to view booking details." });
                          }
                        }}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      >
                        <td
                          className="px-6 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CustomCheckbox checked={selectedBookings.includes(booking.booking_id)} onChange={() => handleToggleBooking(booking.booking_id)} />
                        </td>
                        {visibleColumns.includes('bookingId') && <td className="px-6 py-4"><span className="text-[14px] font-bold text-[#253154]">{booking.booking_id}</span></td>}
                        {visibleColumns.includes('dateTime') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{format(new Date(booking.date_time), 'MMM d, yyyy h:mm a')}</span></td>}
                        {visibleColumns.includes('studentName') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{booking.student_name}</span></td>}
                        {visibleColumns.includes('service') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{booking.service}</span></td>}
                        {visibleColumns.includes('expert') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{booking.expert}</span></td>}
                        {visibleColumns.includes('mode') && <td className="px-6 py-4"><span className="text-[12px] font-medium text-gray-600">{booking.mode}</span></td>}
                        {visibleColumns.includes('status') && <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>}
                        {visibleColumns.includes('actions') && (
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <PermissionGuard module="bookings" action="edit">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEdit(booking); }}
                                  className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors group/edit"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                              </PermissionGuard>
                              <PermissionGuard module="bookings" action="delete">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDelete(booking.booking_id); }}
                                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors group/delete"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </PermissionGuard>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden p-4 space-y-3">
                {paginatedBookings.map((booking) => (
                  <MobileBookingCard
                    key={booking.booking_id}
                    booking={booking}
                    isSelected={selectedBookings.includes(booking.booking_id)}
                    onToggleSelect={() => handleToggleBooking(booking.booking_id)}
                    onNavigateToDetail={() => onNavigate?.('booking-detail', booking.booking_id)}
                    onEdit={() => handleEdit(booking)}
                    onDelete={() => handleDelete(booking.booking_id)}
                  />
                ))}
              </div>
            </>
          )}

          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
                      {rowsPerPage}<ChevronDown size={14} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-20 rounded-xl">
                    {[10, 20, 50, 100].map(size => (
                      <DropdownMenuItem
                        key={size}
                        onClick={() => { setRowsPerPage(size); setCurrentPage(1); }}
                        className="rounded-lg justify-center"
                      >
                        {size}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <span className="text-sm text-gray-600 ml-4">
                {filteredAndSortedBookings.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                {Math.min(currentPage * rowsPerPage, filteredAndSortedBookings.length)} of {filteredAndSortedBookings.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                title="Previous Page"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600">Page {currentPage} of {Math.max(1, totalPages)}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                title="Next Page"
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
        moduleName="Bookings"
        totalCount={bookings.length}
        selectedCount={selectedBookings.length}
        columns={exportColumns}
        supportsDateRange={true}
        onExport={handleExport}
      />
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Bookings"
        fields={importFields}
        onImport={handleImport}
        templateUrl="/templates/bookings-import-template.xlsx"
        allowUpdate={true}
      />
      <AddBookingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleRefresh}
      />
      <EditBookingModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingBooking(null); }}
        onSuccess={handleRefresh}
        booking={editingBooking}
      />
    </div>
  );
};

export default BookingsOverviewPage;