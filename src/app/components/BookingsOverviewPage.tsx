import React, { useState } from 'react';
import {
  Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal,
  Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check,
  Columns, Clock, CheckCircle, XCircle, Users
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
  booking: Booking;
  isSelected: boolean;
  onToggleSelect: () => void;
  onNavigateToDetail?: () => void;
}

const MobileBookingCard: React.FC<MobileBookingCardProps> = ({ booking, isSelected, onToggleSelect, onNavigateToDetail }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 w-full transition-all active:scale-[0.99] cursor-pointer flex flex-col gap-2 ${isSelected ? 'bg-purple-50/30' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-[#253154] text-[15px]">{booking.bookingId}</span>
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
          <p className="text-[14px] text-gray-700 font-medium">{booking.studentName}</p>
          <p className="text-[12px] text-gray-500">{booking.service}</p>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-2 pt-3 border-t border-gray-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Date & Time</div>
              <div className="text-sm text-gray-700 font-medium">{format(new Date(booking.dateTime), 'MMM d, h:mm a')}</div>
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
              onNavigateToDetail?.();
            }}
            className="w-full h-10 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0c4a] transition-colors font-medium text-sm"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

interface BookingsOverviewPageProps {
  onNavigate?: (page: string, bookingId?: string) => void;
}

const BookingsOverviewPage: React.FC<BookingsOverviewPageProps> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) });
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search'>('none');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['bookingId', 'dateTime', 'studentName', 'service', 'expert', 'mode', 'status']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const bookings: Booking[] = [
    { id: 'BKG-001', bookingId: 'BKG-001', dateTime: '2025-01-15T10:00:00', studentName: 'Emma Wilson', service: 'Initial Consultation', expert: 'Sarah Johnson', status: 'upcoming', mode: 'Online', source: 'regular' },
    { id: 'BKG-002', bookingId: 'BKG-002', dateTime: '2025-01-16T14:30:00', studentName: 'James Chen', service: 'Concierge Request', expert: 'Mike Davis', status: 'completed', mode: 'Online', source: 'concierge' },
    { id: 'BKG-003', bookingId: 'BKG-003', dateTime: '2025-01-17T09:00:00', studentName: 'Sofia Rodriguez', service: 'Document Review', expert: 'Emma Wilson', status: 'upcoming', mode: 'Online', source: 'regular' },
    { id: 'BKG-004', bookingId: 'BKG-004', dateTime: '2025-01-18T11:00:00', studentName: 'Liam Patel', service: 'Concierge Request', expert: 'David Chen', status: 'upcoming', mode: 'Online', source: 'concierge' },
    { id: 'BKG-005', bookingId: 'BKG-005', dateTime: '2025-01-19T15:00:00', studentName: 'Olivia Johnson', service: 'SOP Review', expert: 'Lisa Anderson', status: 'no-show', mode: 'In-Person', source: 'regular' },
    { id: 'BKG-006', bookingId: 'BKG-006', dateTime: '2025-01-20T10:30:00', studentName: 'Noah Kim', service: 'University Selection', expert: 'Sarah Johnson', status: 'completed', mode: 'Online', source: 'regular' },
    { id: 'BKG-007', bookingId: 'BKG-007', dateTime: '2025-01-21T13:00:00', studentName: 'Ava Martinez', service: 'Concierge Request', expert: 'Mike Davis', status: 'upcoming', mode: 'Online', source: 'concierge' },
    { id: 'BKG-008', bookingId: 'BKG-008', dateTime: '2025-01-22T16:00:00', studentName: 'Ethan Singh', service: 'Document Review', expert: 'Emma Wilson', status: 'completed', mode: 'Online', source: 'regular' },
  ];

  const metrics = [
    { title: 'Total Bookings', value: '248', icon: CalendarIcon, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total number of bookings in selected period' },
    { title: 'Upcoming', value: '84', icon: Clock, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Scheduled bookings yet to occur' },
    { title: 'Completed', value: '142', icon: CheckCircle, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Successfully completed bookings' },
    { title: 'Cancelled', value: '22', icon: XCircle, bgClass: 'bg-red-50', colorClass: 'text-red-600', tooltip: 'Cancelled or no-show bookings' },
    { title: 'Active Experts', value: '12', icon: Users, bgClass: 'bg-cyan-50', colorClass: 'text-cyan-600', tooltip: 'Number of experts with active bookings' }
  ];

  const allColumns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'dateTime', type: 'date', label: 'Date & Time' },
    { key: 'studentName', label: 'Student' },
    { key: 'service', label: 'Service' },
    { key: 'expert', label: 'Expert' },
    { key: 'mode', label: 'Mode' },
    { key: 'status', label: 'Status' }
  ];

  const handleRefresh = () => toast.success("Refreshing data...");

  const handleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
      setSelectAllStore(false);
    } else {
      setSelectedBookings(bookings.map(b => b.id));
      setSelectAllStore(false);
    }
  };

  const handleToggleBooking = (bookingId: string) => {
    setSelectedBookings(prev => prev.includes(bookingId) ? prev.filter(id => id !== bookingId) : [...prev, bookingId]);
  };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedBookings(bookings.map(b => b.id));
  };

  const handleClearSelection = () => {
    setSelectedBookings([]);
    setSelectAllStore(false);
  };

  const exportColumns: ExportColumn[] = [
    { id: 'bookingId', label: 'Booking ID', defaultSelected: true },
    { id: 'dateTime', label: 'Date & Time', defaultSelected: true },
    { id: 'studentName', label: 'Student Name', defaultSelected: true },
    { id: 'service', label: 'Service', defaultSelected: true },
    { id: 'expert', label: 'Expert', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'mode', label: 'Mode', defaultSelected: true }
  ];

  const importFields: ImportField[] = [
    { id: 'bookingId', label: 'Booking ID', required: true, type: 'text' },
    { id: 'bookingDate', label: 'Booking Date', required: true, type: 'date' },
    { id: 'dateTime', label: 'Date & Time', required: true, type: 'text' },
    { id: 'studentName', label: 'Student Name', required: true, type: 'text' },
    { id: 'service', label: 'Service', required: true, type: 'select', options: ['Initial Consultation', 'Visa Interview Prep', 'Document Review', 'Application Support', 'SOP Review', 'University Selection'] },
    { id: 'expert', label: 'Expert', required: true, type: 'text' },
    { id: 'status', label: 'Status', required: true, type: 'select', options: ['upcoming', 'completed', 'cancelled', 'no-show'] },
    { id: 'mode', label: 'Mode', required: true, type: 'select', options: ['Online', 'In-Person'] }
  ];

  const handleExport = async (options: any) => {
    toast.success(`Exporting ${options.scope} bookings as ${options.format}...`);
  };

  const handleImport = async (data: any) => {
    toast.success(`Importing ${data.length} bookings...`);
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
              <Plus size={20} strokeWidth={1.5} />Add Booking
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
            <input type="text" placeholder="Search bookings..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); setShowColumnMenu(false); setShowMoreMenu(false); }} className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
              <Filter size={20} strokeWidth={1.5} />
            </button>
            <button onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); setShowColumnMenu(false); setShowMoreMenu(false); }} className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
              <ArrowUpDown size={20} strokeWidth={1.5} />
            </button>
            <button onClick={() => { setShowColumnMenu(!showColumnMenu); setShowFilterMenu(false); setShowSortMenu(false); setShowMoreMenu(false); }} className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
              <Columns size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="flex md:hidden mb-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input type="text" placeholder="Search bookings..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-sm font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" />
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
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="w-12 px-6 py-4 text-left">
                    <CustomCheckbox checked={selectedBookings.length === bookings.length} partial={selectedBookings.length > 0 && selectedBookings.length < bookings.length} onChange={handleSelectAll} />
                  </th>
                  {visibleColumns.includes('bookingId') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Booking ID</th>}
                  {visibleColumns.includes('dateTime') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>}
                  {visibleColumns.includes('studentName') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Student</th>}
                  {visibleColumns.includes('service') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Service</th>}
                  {visibleColumns.includes('expert') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Expert</th>}
                  {visibleColumns.includes('mode') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mode</th>}
                  {visibleColumns.includes('status') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    onClick={() => onNavigate?.('booking-detail', booking.id)}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CustomCheckbox checked={selectedBookings.includes(booking.id)} onChange={() => handleToggleBooking(booking.id)} />
                    </td>
                    {visibleColumns.includes('bookingId') && <td className="px-6 py-4"><span className="text-[14px] font-bold text-[#253154]">{booking.bookingId}</span></td>}
                    {visibleColumns.includes('dateTime') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{format(new Date(booking.dateTime), 'MMM d, yyyy h:mm a')}</span></td>}
                    {visibleColumns.includes('studentName') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{booking.studentName}</span></td>}
                    {visibleColumns.includes('service') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{booking.service}</span></td>}
                    {visibleColumns.includes('expert') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{booking.expert}</span></td>}
                    {visibleColumns.includes('mode') && <td className="px-6 py-4"><span className="text-[12px] font-medium text-gray-600">{booking.mode}</span></td>}
                    {visibleColumns.includes('status') && <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden p-4 space-y-3">
            {bookings.map((booking) => <MobileBookingCard key={booking.id} booking={booking} isSelected={selectedBookings.includes(booking.id)} onToggleSelect={() => handleToggleBooking(booking.id)} onNavigateToDetail={() => onNavigate?.('booking-detail', booking.id)} />)}
          </div>

          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <div className="relative">
                <button onClick={() => setShowRowsMenu(!showRowsMenu)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
                  {rowsPerPage}<ChevronDown size={14} />
                </button>
              </div>
              <span className="text-sm text-gray-600 ml-4">1-{Math.min(rowsPerPage, bookings.length)} of {bookings.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={18} /></button>
              <span className="text-sm text-gray-600">Page 1 of 1</span>
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={18} /></button>
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
        allowUpdate={true}
      />
    </div>
  );
};

export default BookingsOverviewPage;