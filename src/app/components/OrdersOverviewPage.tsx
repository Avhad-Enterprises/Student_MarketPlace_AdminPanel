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
  Combine,
  XCircle,
  Archive,
  Edit,
  Check,
  Columns,
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  TrendingUp
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
import { PermissionGuard } from './common/PermissionGuard';

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
  status: 'shipped' | 'fulfilled' | 'cancelled' | 'draft';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    shipped: {
      bg: 'bg-[#eedbfe]',
      text: 'text-[#7021a4]',
      border: 'border-[#7021a4]',
      label: 'Shipped'
    },
    fulfilled: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      border: 'border-amber-300',
      label: 'Fulfilled'
    },
    cancelled: {
      bg: 'bg-pink-100',
      text: 'text-pink-700',
      border: 'border-pink-300',
      label: 'Cancelled'
    },
    draft: {
      bg: 'bg-[#e7e7fc]',
      text: 'text-[#6a62ff]',
      border: 'border-[#6a62ff]',
      label: 'Draft'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
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

// --- MobileOrderCard Component ---
interface Order {
  id: string;
  date: string;
  customer: string;
  value: string;
  status: 'shipped' | 'fulfilled' | 'cancelled' | 'draft';
  items: number;
  payment: string;
  shipping: string;
}

interface MobileOrderCardProps {
  order: Order;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const MobileOrderCard: React.FC<MobileOrderCardProps> = ({ order, isSelected, onToggleSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 w-full transition-all active:scale-[0.99] cursor-pointer flex flex-col gap-2 ${isSelected ? 'bg-purple-50/30' : ''}`}>
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-[#253154] text-[15px]">{order.id}</span>
        <span className="bg-[#F4F4F4] text-gray-500 text-[10px] px-2 py-1 rounded-lg">Tap to view</span>
        <span className="font-bold text-[#253154] text-[15px] ml-auto">{order.value}</span>
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
        <span className="text-gray-600 text-sm">{order.customer}</span>
        <div className="ml-auto transform scale-90 origin-right">
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div className="mt-2 pt-3 border-t border-gray-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Date</div>
              <div className="text-sm text-gray-700 font-medium">{order.date}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Items</div>
              <div className="text-sm text-gray-700 font-medium">{order.items}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Payment</div>
              <div className="text-sm text-gray-700 font-medium">{order.payment}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Shipping</div>
              <div className="text-sm text-gray-700 font-medium">{order.shipping}</div>
            </div>
          </div>
          <button className="w-full h-10 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0c4a] transition-colors font-medium text-sm">
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export const OrdersOverviewPage: React.FC = () => {
  // State management
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31)
  });
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search'>('none');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'date', 'customer', 'value', 'status', 'items', 'payment']);
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
  const orders: Order[] = [
    { id: '#1234', date: 'Jan 15, 2024', customer: 'John Smith', value: '$1,234.50', status: 'shipped', items: 3, payment: 'Credit Card', shipping: 'Express' },
    { id: '#1235', date: 'Jan 16, 2024', customer: 'Sarah Johnson', value: '$856.00', status: 'fulfilled', items: 2, payment: 'PayPal', shipping: 'Standard' },
    { id: '#1236', date: 'Jan 17, 2024', customer: 'Mike Davis', value: '$2,145.75', status: 'shipped', items: 5, payment: 'Credit Card', shipping: 'Express' },
    { id: '#1237', date: 'Jan 18, 2024', customer: 'Emma Wilson', value: '$450.25', status: 'cancelled', items: 1, payment: 'Debit Card', shipping: 'Standard' },
    { id: '#1238', date: 'Jan 19, 2024', customer: 'David Brown', value: '$3,567.90', status: 'draft', items: 8, payment: 'Credit Card', shipping: 'Express' },
    { id: '#1239', date: 'Jan 20, 2024', customer: 'Lisa Anderson', value: '$1,876.40', status: 'shipped', items: 4, payment: 'PayPal', shipping: 'Standard' },
    { id: '#1240', date: 'Jan 21, 2024', customer: 'Tom Martinez', value: '$925.60', status: 'fulfilled', items: 2, payment: 'Credit Card', shipping: 'Express' },
    { id: '#1241', date: 'Jan 22, 2024', customer: 'Anna Taylor', value: '$1,456.30', status: 'shipped', items: 3, payment: 'Debit Card', shipping: 'Standard' },
  ];

  // Metrics data
  const metrics = [
    {
      title: 'Total Orders',
      value: '2,847',
      icon: ShoppingCart,
      bgClass: 'bg-purple-50',
      colorClass: 'text-purple-600',
      tooltip: 'Total number of orders this period'
    },
    {
      title: 'Revenue',
      value: '$45.2K',
      icon: DollarSign,
      bgClass: 'bg-green-50',
      colorClass: 'text-green-600',
      tooltip: 'Total revenue generated'
    },
    {
      title: 'Pending',
      value: '124',
      icon: Package,
      bgClass: 'bg-amber-50',
      colorClass: 'text-amber-600',
      tooltip: 'Orders pending fulfillment'
    },
    {
      title: 'Customers',
      value: '1,563',
      icon: Users,
      bgClass: 'bg-blue-50',
      colorClass: 'text-blue-600',
      tooltip: 'Active customers this period'
    },
    {
      title: 'Growth',
      value: '+23.5%',
      icon: TrendingUp,
      bgClass: 'bg-pink-50',
      colorClass: 'text-pink-600',
      tooltip: 'Growth compared to last period'
    }
  ];

  // Column configuration
  const allColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'date', label: 'Date' },
    { key: 'customer', label: 'Customer' },
    { key: 'value', label: 'Value' },
    { key: 'status', label: 'Status' },
    { key: 'items', label: 'Items' },
    { key: 'payment', label: 'Payment' },
    { key: 'shipping', label: 'Shipping' }
  ];

  // Handlers
  const handleRefresh = () => {
    toast.success("Refreshing data...");
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
      setSelectAllStore(false);
    } else {
      setSelectedOrders(orders.map(o => o.id));
      setSelectAllStore(false);
    }
  };

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedOrders(orders.map(o => o.id));
  };

  const handleClearSelection = () => {
    setSelectedOrders([]);
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
    { id: 'id', label: 'Order ID', defaultSelected: true },
    { id: 'date', label: 'Order Date', defaultSelected: true },
    { id: 'customer', label: 'Customer Name', defaultSelected: true },
    { id: 'value', label: 'Order Value', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'items', label: 'Items Count', defaultSelected: false },
    { id: 'payment', label: 'Payment Method', defaultSelected: false },
    { id: 'shipping', label: 'Shipping Method', defaultSelected: false }
  ];

  const importFields: ImportField[] = [
    { id: 'orderId', label: 'Order ID', required: false, type: 'text' },
    { id: 'orderDate', label: 'Order Date', required: true, type: 'date' },
    { id: 'customerName', label: 'Customer Name', required: true, type: 'text' },
    { id: 'customerEmail', label: 'Customer Email', required: true, type: 'email' },
    { id: 'orderValue', label: 'Order Value', required: true, type: 'number' },
    { id: 'status', label: 'Status', required: true, type: 'select', options: ['Shipped', 'Fulfilled', 'Cancelled', 'Draft'] },
    { id: 'itemsCount', label: 'Items Count', required: false, type: 'number' },
    { id: 'paymentMethod', label: 'Payment Method', required: false, type: 'text' },
    { id: 'shippingMethod', label: 'Shipping Method', required: false, type: 'text' }
  ];

  const handleExport = async (options: any) => {
    console.log('Exporting with options:', options);
    toast.success(`Exporting ${options.scope} orders as ${options.format.toUpperCase()}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleImport = async (data: any[], mode: any) => {
    console.log('Importing:', data, 'Mode:', mode);
    toast.success(`Successfully imported ${data.length} orders`);
  };

  return (
    <TooltipProvider>

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
            <PermissionGuard module="online-store" action="export">
              <button
                onClick={() => setShowExportDialog(true)}
                className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"
              >
                <Download size={20} strokeWidth={1.5} />
                Export
              </button>
            </PermissionGuard>
            <PermissionGuard module="online-store" action="create">
              <button
                onClick={() => setShowImportDialog(true)}
                className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"
              >
                <Upload size={20} strokeWidth={1.5} />
                Import
              </button>
            </PermissionGuard>
            <PermissionGuard module="online-store" action="create">
              <button className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium">
                <Plus size={20} strokeWidth={1.5} />
                Add New
              </button>
            </PermissionGuard>
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
              Add New
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
              placeholder="Search orders..."
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
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-48 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Filter by Status</div>
                    {['All', 'Shipped', 'Fulfilled', 'Cancelled', 'Draft'].map(status => (
                      <button key={status} className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left">
                        {status}
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
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-48 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Sort By</div>
                    {['Date (Newest)', 'Date (Oldest)', 'Value (High)', 'Value (Low)', 'Customer (A-Z)'].map(option => (
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
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-48 animate-in fade-in zoom-in-95 duration-200">
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Copy size={16} />
                      Copy
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Printer size={16} />
                      Print
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Combine size={16} />
                      Merge
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <PermissionGuard module="online-store" action="delete">
                      <button className="w-full px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-red-600 text-left flex items-center gap-2">
                        <XCircle size={16} />
                        Delete All
                      </button>
                    </PermissionGuard>
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
              placeholder="Search orders..."
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

                <div className="w-full h-px bg-gray-100" />

                {/* More Actions */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">More</div>
                  <div className="flex flex-col gap-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700">
                      <Archive size={18} />
                      <span className="font-medium">Archive</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600">
                      <XCircle size={18} />
                      <span className="font-medium">Delete</span>
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
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filter by Status</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['All', 'Shipped', 'Fulfilled', 'Cancelled', 'Draft'].map((status, idx) => (
                      <button
                        key={status}
                        className={`rounded-full text-sm font-medium px-2 py-2 border ${idx === 0
                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                            : 'bg-gray-50 text-gray-600 border-gray-100'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100" />

                {/* Sort Options */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sort By</div>
                  <div className="grid grid-cols-1 gap-2">
                    {['Date (Newest)', 'Date (Oldest)', 'Value (High)', 'Value (Low)'].map(option => (
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
          {selectedOrders.length > 0 && (
            <div className="bg-purple-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm border-b border-purple-100">
              <div className="flex items-center gap-2">
                <span className="text-purple-900">
                  {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                </span>
                {!selectAllStore && selectedOrders.length === orders.length && (
                  <>
                    <span className="text-purple-700">·</span>
                    <button onClick={handleSelectAllStore} className="text-purple-700 font-bold hover:underline">
                      Select all {orders.length} orders
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <PermissionGuard module="online-store" action="edit">
                  <button className="text-purple-700 font-bold hover:underline">
                    <Edit size={16} className="inline mr-1" />
                    Edit
                  </button>
                </PermissionGuard>
                <PermissionGuard module="online-store" action="delete">
                  <button className="text-purple-700 font-bold hover:underline">
                    <Archive size={16} className="inline mr-1" />
                    Archive
                  </button>
                </PermissionGuard>
                <button onClick={handleClearSelection} className="text-purple-700 font-bold hover:underline">
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Desktop Table */}
          <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="sticky top-0 z-10 bg-white w-12 px-6 py-4">
                    <CustomCheckbox
                      checked={selectedOrders.length === orders.length}
                      partial={selectedOrders.length > 0 && selectedOrders.length < orders.length}
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
                {orders.map(order => (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 transition-colors group ${selectedOrders.includes(order.id) ? 'bg-purple-50/30' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CustomCheckbox
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleToggleOrder(order.id)}
                      />
                    </td>
                    {visibleColumns.includes('id') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#253154]">{order.id}</td>
                    )}
                    {visibleColumns.includes('date') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.date}</td>
                    )}
                    {visibleColumns.includes('customer') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                    )}
                    {visibleColumns.includes('value') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#253154]">{order.value}</td>
                    )}
                    {visibleColumns.includes('status') && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                    )}
                    {visibleColumns.includes('items') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.items}</td>
                    )}
                    {visibleColumns.includes('payment') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.payment}</td>
                    )}
                    {visibleColumns.includes('shipping') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.shipping}</td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PermissionGuard module="online-store" action="edit">
                        <button className="text-[#0e042f] hover:text-purple-700 transition-colors">
                          <Edit size={18} />
                        </button>
                      </PermissionGuard>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {orders.map(order => (
              <MobileOrderCard
                key={order.id}
                order={order}
                isSelected={selectedOrders.includes(order.id)}
                onToggleSelect={() => handleToggleOrder(order.id)}
              />
            ))}
          </div>

          {/* Pagination Bar */}
          <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 rounded-tr-[30px] shadow-[0px_-5px_25px_rgba(0,0,0,0.03)] relative z-20 border-t border-gray-50">
            {/* Left: Rows Per Page */}
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

            {/* Right: Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center">
                <ChevronLeft size={18} strokeWidth={2} className="text-gray-500" />
              </button>
              <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center">
                <ChevronRight size={18} strokeWidth={2} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Orders"
        totalCount={2847}
        selectedCount={selectedOrders.length}
        columns={exportColumns}
        supportsDateRange={true}
        onExport={handleExport}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Orders"
        fields={importFields}
        onImport={handleImport}
        templateUrl="/templates/orders-import-template.xlsx"
        allowUpdate={true}
      />
    </TooltipProvider>
  );
};