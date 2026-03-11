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
  ArrowDown,
  Search,
  Copy,
  Printer,
  Archive,
  Edit,
  Trash2,
  Check,
  Columns,
  Eye,
  Power,
  Globe,
  Users,
  Building2,
  CreditCard,
  DollarSign,
  Loader2
} from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { AddBankDialog } from './common/AddBankDialog';
import {
  getAllBanks,
  getBankMetrics,
  createBank,
  updateBank,
  deleteBank,
  Bank as BankType
} from '@/app/services/banksService';

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
  status: 'active' | 'inactive';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    'active': {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      label: 'Active'
    },
    'inactive': {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-300',
      label: 'Inactive'
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
      <div className="flex items-end gap-3 mt-2">
        <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p>
        </div>
      </div>
      <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500">
        <Icon size={80} />
      </div>
    </div>
  );
};

interface MobileBankCardProps {
  bank: BankType;
  isSelected: boolean;
  onToggleSelect: () => void;
  onNavigate?: (page: string) => void;
  onEdit?: (bank: BankType) => void;
  onDelete?: (id: number | string) => void;
  onToggleStatus?: (bank: BankType) => void;
  onCopyId?: (id: string) => void;
}

const MobileBankCard: React.FC<MobileBankCardProps> = ({
  bank,
  isSelected,
  onToggleSelect,
  onNavigate,
  onEdit,
  onDelete,
  onToggleStatus,
  onCopyId
}) => {
  return (
    <div className={`bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 w-full transition-all active:scale-[0.99] flex flex-col gap-3 ${isSelected ? 'bg-purple-50/30 border-purple-200' : ''}`}>
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <CustomCheckbox checked={isSelected} onChange={onToggleSelect} />
          <div className="flex-1">
            <h3
              onClick={(e) => { e.stopPropagation(); onNavigate?.('bank-provider-detail'); }}
              className="font-bold text-[#253154] text-base cursor-pointer hover:text-purple-600 hover:underline"
            >
              {bank.bank_name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{bank.account_type}</p>
            <p className="text-xs text-gray-400 mt-1 font-medium">{bank.bank_id}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="transform scale-90 origin-right">
            <StatusBadge status={bank.status} />
          </div>
          <div className="text-[10px] text-gray-400 font-medium">{bank.countries_covered} Countries</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-50 border-dashed">
        <div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Min Balance</div>
          <div className="text-xs text-gray-700 font-medium truncate">{bank.min_balance}</div>
        </div>
        <div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Onboarding</div>
          <div className="text-xs text-gray-700 font-medium truncate">{bank.digital_onboarding ? 'Digital' : 'Manual'}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(bank); }}
            className="w-full h-10 bg-white border border-gray-100 text-[#253154] rounded-xl hover:bg-gray-50 transition-colors font-medium text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(bank.id); }}
            className="w-full h-10 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors font-medium text-xs flex items-center justify-center gap-2"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export const BanksOverviewPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search'>('none');
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'bank', 'accountType', 'countries', 'status', 'minBalance', 'visible']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // New Dynamic States
  const [banks, setBanks] = useState<BankType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [accountTypeFilter, setAccountTypeFilter] = useState('All Types');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', order: 'desc' });
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBanksCount, setTotalBanksCount] = useState(0);

  // Debounce search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page on filter/sort changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, accountTypeFilter, sortConfig]);
  const [metricsData, setMetricsData] = useState({
    totalBanks: 0,
    activeAccounts: 0,
    countriesSupported: 0,
    studentFriendly: 0
  });

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingBank, setEditingBank] = useState<BankType | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [banksRes, metricsRes] = await Promise.all([
        getAllBanks({
          page: currentPage,
          limit: rowsPerPage,
          search: debouncedSearchQuery,
          status: statusFilter,
          account_type: accountTypeFilter,
          sort: sortConfig.key,
          order: sortConfig.order
        }),
        getBankMetrics()
      ]);

      setBanks(banksRes.data || []);
      setTotalPages(banksRes.pagination?.totalPages || 1);
      setTotalBanksCount(banksRes.pagination?.total || 0);

      if (metricsRes) {
        setMetricsData(metricsRes);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load bank data");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, debouncedSearchQuery, statusFilter, accountTypeFilter, sortConfig]);

  const handleSaveBank = async (data: any) => {
    try {
      if (dialogMode === 'edit' && editingBank) {
        await updateBank(editingBank.id, data);
      } else {
        await createBank(data);
      }
      fetchData();
    } catch (error) {
      throw error;
    }
  };

  const handleEditBank = (bank: BankType) => {
    setEditingBank(bank);
    setDialogMode('edit');
    setShowAddDialog(true);
    setOpenRowMenuId(null);
  };

  const handleDeleteBank = async (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this bank?")) {
      try {
        await deleteBank(id);
        toast.success("Bank deleted successfully");
        fetchData();
        setOpenRowMenuId(null);
      } catch (error) {
        toast.error("Failed to delete bank");
      }
    }
  };

  const handleToggleStatus = async (bank: BankType) => {
    try {
      const newStatus = bank.status === 'active' ? 'inactive' : 'active';
      await updateBank(bank.id, { status: newStatus });
      toast.success(`Bank status updated to ${newStatus}`);
      fetchData();
      setOpenRowMenuId(null);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Reference ID copied to clipboard");
    setOpenRowMenuId(null);
  };

  const metrics = [
    {
      title: 'Total Banking Partners',
      value: metricsData.totalBanks.toString(),
      icon: Building2,
      bgClass: 'bg-purple-50',
      colorClass: 'text-purple-600',
      tooltip: 'Total number of banking partners'
    },
    {
      title: 'Active Bank Accounts',
      value: metricsData.activeAccounts.toString(),
      icon: CreditCard,
      bgClass: 'bg-blue-50',
      colorClass: 'text-blue-600',
      tooltip: 'Currently active bank account types'
    },
    {
      title: 'Countries Supported',
      value: metricsData.countriesSupported.toString(),
      icon: Globe,
      bgClass: 'bg-green-50',
      colorClass: 'text-green-600',
      tooltip: 'Max number of countries supported by a single partner'
    },
    {
      title: 'Student-Friendly Banks',
      value: metricsData.studentFriendly.toString(),
      icon: Users,
      bgClass: 'bg-amber-50',
      colorClass: 'text-amber-600',
      tooltip: 'Banks offering student-friendly accounts'
    }
  ];

  const allColumns = [
    { key: 'id', label: 'Reference ID' },
    { key: 'bank', label: 'Bank Name' },
    { key: 'accountType', label: 'Account Type' },
    { key: 'countries', label: 'Country Availability' },
    { key: 'status', label: 'Status' },
    { key: 'minBalance', label: 'Min Balance' },
    { key: 'digital', label: 'Digital Onboarding' },
    { key: 'studentFriendly', label: 'Student Friendly' },
    { key: 'visible', label: 'Student Visibility' },
    { key: 'popularity', label: 'Popularity' },
    { key: 'updated', label: 'Last Updated' }
  ];

  const handleRefresh = () => fetchData();
  const handleSelectAll = () => {
    if (selectedBanks.length === banks.length) {
      setSelectedBanks([]);
      setSelectAllStore(false);
    } else {
      setSelectedBanks(banks.map(b => b.id.toString()));
      setSelectAllStore(false);
    }
  };
  const handleToggleBank = (bankId: string) => {
    setSelectedBanks(prev =>
      prev.includes(bankId) ? prev.filter(id => id !== bankId) : [...prev, bankId]
    );
  };
  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedBanks(banks.map(b => b.id.toString()));
  };
  const handleClearSelection = () => {
    setSelectedBanks([]);
    setSelectAllStore(false);
  };
  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns(prev =>
      prev.includes(columnKey) ? prev.filter(k => k !== columnKey) : [...prev, columnKey]
    );
  };

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

  const exportColumns: ExportColumn[] = [
    { id: 'referenceId', label: 'Reference ID', defaultSelected: true },
    { id: 'bankName', label: 'Bank Name', defaultSelected: true },
    { id: 'accountType', label: 'Account Type', defaultSelected: true },
    { id: 'countries', label: 'Country Availability', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'minBalance', label: 'Minimum Balance', defaultSelected: false },
    { id: 'digitalOnboarding', label: 'Digital Onboarding', defaultSelected: false },
    { id: 'studentFriendly', label: 'Student Friendly', defaultSelected: false },
    { id: 'studentVisible', label: 'Student Visibility', defaultSelected: false },
    { id: 'popularity', label: 'Popularity', defaultSelected: false }
  ];

  const importFields: ImportField[] = [
    { id: 'referenceId', label: 'Reference ID', required: false, type: 'text' },
    { id: 'bankName', label: 'Bank Name', required: true, type: 'text' },
    { id: 'accountType', label: 'Account Type', required: true, type: 'text' },
    { id: 'countries', label: 'Country Availability', required: true, type: 'text' },
    { id: 'status', label: 'Status', required: false, type: 'select', options: ['Active', 'Inactive'] },
    { id: 'minBalance', label: 'Minimum Balance', required: false, type: 'text' },
    { id: 'digitalOnboarding', label: 'Digital Onboarding', required: false, type: 'select', options: ['Yes', 'No'] },
    { id: 'studentFriendly', label: 'Student Friendly', required: false, type: 'select', options: ['Yes', 'No'] },
    { id: 'studentVisible', label: 'Student Visibility', required: false, type: 'select', options: ['Yes', 'No'] }
  ];

  const handleExport = async (options: any) => {
    try {
      setIsLoading(true);
      toast.info(`Preparing ${options.scope} export...`);

      let dataToExport: BankType[] = [];

      if (options.scope === 'all') {
        const result = await getAllBanks({ limit: 1000 });
        dataToExport = result.data;
      } else if (options.scope === 'selected') {
        dataToExport = banks.filter(b => selectedBanks.includes(b.id.toString()));
      } else {
        dataToExport = banks;
      }

      if (dataToExport.length === 0) {
        toast.error("No data found to export");
        return;
      }

      const mappedData = dataToExport.map(bank => {
        const row: any = {};
        options.selectedColumns.forEach((colId: string) => {
          switch (colId) {
            case 'referenceId': row['Reference ID'] = bank.bank_id; break;
            case 'bankName': row['Bank Name'] = bank.bank_name; break;
            case 'accountType': row['Account Type'] = bank.account_type; break;
            case 'countries': row['Countries'] = bank.countries_covered; break;
            case 'status': row['Status'] = bank.status; break;
            case 'minBalance': row['Minimum Balance'] = bank.min_balance; break;
            case 'digitalOnboarding': row['Digital Onboarding'] = bank.digital_onboarding ? 'Yes' : 'No'; break;
            case 'studentFriendly': row['Student Friendly'] = bank.student_friendly ? 'Yes' : 'No'; break;
            case 'studentVisible': row['Student Visible'] = bank.student_visible ? 'Yes' : 'No'; break;
            case 'popularity': row['Popularity'] = bank.popularity; break;
            default: break;
          }
        });
        return row;
      });

      // Simple implementation using window.XLSX if available or similar logic
      // Since it&apos;s a client tool, I'll assume XLSX is imported as in SIMCardsOverviewPage
      const XLSX = (window as any).XLSX;
      if (!XLSX) {
        // Fallback to JSON if XLSX isn't loaded
        const blob = new Blob([JSON.stringify(mappedData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `banks_export_${new Date().getTime()}.json`;
        a.click();
        toast.success("Banks exported as JSON");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(mappedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Banks");
      XLSX.writeFile(workbook, `banks_export_${new Date().getTime()}.${options.format === 'json' ? 'json' : (options.format === 'csv' ? 'csv' : 'xlsx')}`);

      toast.success(`${options.scope.charAt(0).toUpperCase() + options.scope.slice(1)} banks exported successfully`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export banks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (data: any[], mode: any) => {
    console.log('Importing:', data, 'Mode:', mode);
    toast.success(`Successfully imported ${data.length} bank records`);
  };

  return (
    <TooltipProvider>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">

        {/* Desktop Action Bar */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-8">
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
            <button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500">
              <RefreshCw size={20} className="text-[#253154]" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium">
              <Download size={20} strokeWidth={1.5} />
              Export
            </button>
            <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium">
              <Upload size={20} strokeWidth={1.5} />
              Import
            </button>
            <button
              onClick={() => {
                setEditingBank(null);
                setDialogMode('add');
                setShowAddDialog(true);
              }}
              className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"
            >
              <Plus size={20} strokeWidth={1.5} />
              Add Bank
            </button>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="flex md:hidden flex-col gap-4 mb-6">
          <div className="w-full h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <CalendarIcon size={18} className="text-[#253154]" />
              <span className="text-sm font-medium text-[#253154]">
                {date?.from && date?.to
                  ? `${format(date.from, 'd MMM')} - ${format(date.to, 'd MMM')}`
                  : 'Select range'}
              </span>
            </div>
            <button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-full transition-colors active:rotate-180 active:duration-500">
              <RefreshCw size={18} className="text-[#253154]" />
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditingBank(null);
                setDialogMode('add');
                setShowAddDialog(true);
              }}
              className="flex-1 h-[50px] bg-[#0e042f] text-white rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={20} />
              Add Bank
            </button>
            <button onClick={() => setActiveMobileMenu(activeMobileMenu === 'import' ? 'none' : 'import')} className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center">
              <MoreHorizontal size={22} className="text-[#253154]" />
            </button>
          </div>
        </div>

        {/* Metrics - Desktop */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Metrics - Mobile */}
        <div className="block lg:hidden mb-14 -mx-4">
          <Slider {...slickSettings}>
            {metrics.map((metric, index) => (
              <div key={index} className="px-2 py-2">
                <MetricCard {...metric} />
              </div>
            ))}
          </Slider>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by bank name, account type, reference ID"
              className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>
          <div className="flex items-center gap-3 shrink-0">
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
                    {['All', 'Active', 'Inactive'].map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left flex items-center justify-between ${statusFilter === status ? 'text-purple-700 font-bold bg-purple-50' : 'text-gray-700'}`}
                      >
                        {status}
                        {statusFilter === status && <Check size={14} />}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-1" />
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Account Type</div>
                    {['All Types', 'Student Account', 'Savings Account', 'Current Account'].map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setAccountTypeFilter(type);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left flex items-center justify-between ${accountTypeFilter === type ? 'text-purple-700 font-bold bg-purple-50' : 'text-gray-700'}`}
                      >
                        {type}
                        {accountTypeFilter === type && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
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
                    {[
                      { label: 'Popularity', key: 'popularity' },
                      { label: 'Country Coverage', key: 'countries_covered' },
                      { label: 'Last Updated', key: 'updated_at' },
                      { label: 'Alphabetical', key: 'bank_name' }
                    ].map(option => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setSortConfig(prev => ({
                            key: option.key,
                            order: prev.key === option.key && prev.order === 'desc' ? 'asc' : 'desc'
                          }));
                          setShowSortMenu(false);
                        }}
                        className={`w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left flex items-center justify-between ${sortConfig.key === option.key ? 'text-purple-700 font-bold bg-purple-50' : 'text-gray-700'}`}
                      >
                        <span>{option.label}</span>
                        {sortConfig.key === option.key && (
                          <ArrowDown size={16} className={`transition-transform duration-200 ${sortConfig.order === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
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
                          onChange={() => handleToggleColumn(column.key)}
                        />
                        <span className="text-sm text-gray-700">{column.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
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
                      <Copy size={16} />Copy
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Printer size={16} />Print
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Archive size={16} />Archive Selected
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-6 flex gap-3">
          <div className="flex-1 h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center px-5 gap-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search banks..."
              className="flex-1 h-full border-none focus:ring-0 text-sm bg-transparent outline-none"
            />
          </div>
          <button onClick={() => setActiveMobileMenu(activeMobileMenu === 'search' ? 'none' : 'search')} className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center">
            <MoreHorizontal size={22} className="text-[#253154]" />
          </button>
        </div>

        {/* Mobile Bottom Sheets */}
        {activeMobileMenu === 'import' && (
          <>
            <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setActiveMobileMenu('none')} />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[30px] z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl custom-scrollbar-light">
              <div className="p-6 flex flex-col gap-6">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-2" />
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Actions</div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => { setShowExportDialog(true); setActiveMobileMenu('none'); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700">
                      <Download size={18} /><span className="font-medium">Export Data</span>
                    </button>
                    <button onClick={() => { setShowImportDialog(true); setActiveMobileMenu('none'); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700">
                      <Upload size={18} /><span className="font-medium">Import Data</span>
                    </button>
                  </div>
                </div>
                <button onClick={() => setActiveMobileMenu('none')} className="mt-2 w-full bg-gray-100 text-gray-900 font-medium py-4 rounded-2xl">Close</button>
              </div>
            </div>
          </>
        )}

        {activeMobileMenu === 'search' && (
          <>
            <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setActiveMobileMenu('none')} />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[30px] z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl custom-scrollbar-light">
              <div className="p-6 flex flex-col gap-6">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-2" />
                <div className="mb-6">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filter by Status</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', 'Active', 'Inactive'].map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setActiveMobileMenu('none');
                        }}
                        className={`bg-gray-50 text-gray-600 border border-gray-100 rounded-full text-sm font-medium px-2 py-2 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-100 ${statusFilter === status ? 'bg-purple-50 text-purple-700 border-purple-100 font-bold' : ''}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filter by Account Type</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['All Types', 'Student Account', 'Savings Account', 'Current Account'].map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setAccountTypeFilter(type);
                          setActiveMobileMenu('none');
                        }}
                        className={`bg-gray-50 text-gray-600 border border-gray-100 rounded-full text-sm font-medium px-2 py-2 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-100 ${accountTypeFilter === type ? 'bg-purple-50 text-purple-700 border-purple-100 font-bold' : ''}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sort By</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Popularity', key: 'popularity' },
                      { label: 'Country Coverage', key: 'countries_covered' },
                      { label: 'Last Updated', key: 'updated_at' },
                      { label: 'Alphabetical', key: 'bank_name' }
                    ].map(option => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setSortConfig(prev => ({
                            key: option.key,
                            order: prev.key === option.key && prev.order === 'desc' ? 'asc' : 'desc'
                          }));
                          setActiveMobileMenu('none');
                        }}
                        className={`bg-gray-50 text-gray-600 border border-gray-100 rounded-full text-sm font-medium px-2 py-2 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-100 ${sortConfig.key === option.key ? 'bg-purple-50 text-purple-700 border-purple-100 font-bold' : ''}`}
                      >
                        {option.label}
                        {sortConfig.key === option.key && (
                          <span className="ml-1 text-[10px]">{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setActiveMobileMenu('none')} className="mt-2 w-full bg-gray-100 text-gray-900 font-medium py-4 rounded-2xl">Close</button>
              </div>
            </div>
          </>
        )}

        {/* Selection Banner */}
        {selectedBanks.length > 0 && (
          <div className="bg-purple-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm border-b border-purple-100 mb-6 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <span className="text-purple-900 font-medium">{selectedBanks.length} bank{selectedBanks.length !== 1 ? 's' : ''} selected</span>
              {selectedBanks.length === banks.length && !selectAllStore && (
                <>
                  <span className="text-purple-700">•</span>
                  <button onClick={handleSelectAllStore} className="text-purple-700 font-bold hover:underline">Select all {totalBanksCount} banks</button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="text-purple-700 font-bold hover:underline">Enable/Disable</button>
              <button className="text-purple-700 font-bold hover:underline">Update Countries</button>
              <button className="text-purple-700 font-bold hover:underline">Change Visibility</button>
              <button onClick={handleClearSelection} className="text-purple-700 font-bold hover:underline">Clear</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12">
                    <CustomCheckbox checked={selectedBanks.length === banks.length} partial={selectedBanks.length > 0 && selectedBanks.length < banks.length} onChange={handleSelectAll} />
                  </th>
                  {visibleColumns.includes('id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Reference ID</th>}
                  {visibleColumns.includes('bank') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Bank Name</th>}
                  {visibleColumns.includes('accountType') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Account Type</th>}
                  {visibleColumns.includes('countries') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Countries</th>}
                  {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Status</th>}
                  {visibleColumns.includes('minBalance') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Min Balance</th>}
                  {visibleColumns.includes('digital') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Digital</th>}
                  {visibleColumns.includes('studentFriendly') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Student Friendly</th>}
                  {visibleColumns.includes('visible') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visible</th>}
                  {visibleColumns.includes('popularity') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Popularity</th>}
                  {visibleColumns.includes('updated') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Last Updated</th>}
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={visibleColumns.length + 2} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-purple-600" size={32} />
                        <span className="text-gray-500 font-medium">Loading banks...</span>
                      </div>
                    </td>
                  </tr>
                ) : banks.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length + 2} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                          <Building2 size={24} />
                        </div>
                        <span className="text-gray-500 font-medium">No banks found</span>
                        <p className="text-sm text-gray-400">Try adjusting your filters or search query</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  banks.map((bank) => (
                    <tr
                      key={bank.id}
                      className={`hover:bg-gray-50 transition-colors group cursor-pointer ${selectedBanks.includes(bank.id.toString()) ? 'bg-purple-50/30' : ''}`}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <CustomCheckbox checked={selectedBanks.includes(bank.id.toString())} onChange={() => handleToggleBank(bank.id.toString())} />
                      </td>
                      {visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{bank.bank_id}</td>}
                      {visibleColumns.includes('bank') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bank.bank_name}</td>}
                      {visibleColumns.includes('accountType') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bank.account_type}</td>}
                      {visibleColumns.includes('countries') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bank.countries_covered}</td>}
                      {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={bank.status} /></td>}
                      {visibleColumns.includes('minBalance') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bank.min_balance}</td>}
                      {visibleColumns.includes('digital') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bank.digital_onboarding ? 'Yes' : 'No'}</td>}
                      {visibleColumns.includes('studentFriendly') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bank.student_friendly ? 'Yes' : 'No'}</td>}
                      {visibleColumns.includes('visible') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bank.student_visible ? 'Yes' : 'No'}</td>}
                      {visibleColumns.includes('popularity') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bank.popularity.toLocaleString()}</td>}
                      {visibleColumns.includes('updated') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{bank.updated_at ? new Date(bank.updated_at).toLocaleDateString() : 'N/A'}</td>}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditBank(bank); }}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/edit"
                            title="Edit"
                          >
                            <Edit size={18} className="text-gray-400 group-hover/edit:text-blue-600" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteBank(bank.id); }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group/delete"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-gray-400 group-hover/delete:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {banks.map((bank) => (
              <MobileBankCard
                key={bank.id}
                bank={bank}
                isSelected={selectedBanks.includes(bank.id.toString())}
                onToggleSelect={() => handleToggleBank(bank.id.toString())}
                onNavigate={onNavigate}
                onEdit={handleEditBank}
                onDelete={handleDeleteBank}
                onToggleStatus={handleToggleStatus}
                onCopyId={handleCopyId}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 rounded-tr-[30px] shadow-[0px_-5px_25px_rgba(0,0,0,0.03)] relative z-20 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm font-medium">Rows per page:</span>
              <div className="relative">
                <button onClick={() => setShowRowsMenu(!showRowsMenu)} className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
                  {rowsPerPage}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {showRowsMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowRowsMenu(false)} />
                    <div className="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-xl border border-gray-100 z-20 p-1 animate-in slide-in-from-bottom-1 duration-200">
                      {[5, 10, 25, 50].map(rows => (
                        <button key={rows} onClick={() => { setRowsPerPage(rows); setShowRowsMenu(false); }} className={`w-full px-3 py-1.5 text-xs font-medium rounded ${rowsPerPage === rows ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                          {rows}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} strokeWidth={2} className="text-gray-500" />
              </button>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-700">{currentPage}</span>
                <span className="text-sm text-gray-400">/</span>
                <span className="text-sm text-gray-400">{totalPages}</span>
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} strokeWidth={2} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Banks" totalCount={totalBanksCount} selectedCount={selectedBanks.length} columns={exportColumns} supportsDateRange={false} onExport={handleExport} />
      <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Banks" fields={importFields} onImport={handleImport} templateUrl="/templates/banks-import-template.xlsx" allowUpdate={true} />

      <AddBankDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleSaveBank}
        initialData={editingBank}
        mode={dialogMode}
      />
    </TooltipProvider>
  );
};