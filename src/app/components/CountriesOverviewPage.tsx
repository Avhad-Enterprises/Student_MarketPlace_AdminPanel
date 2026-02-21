"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
  Archive,
  Edit,
  Check,
  Columns,
  Globe,
  MapPin,
  DollarSign,
  TrendingUp,
  Eye,
  Settings,
  FileText,
  Building2,
  ToggleLeft,
  ToggleRight,
  Trash2,
  FileSpreadsheet, // Add FileSpreadsheet icon
  FileJson // Add FileJson icon
} from 'lucide-react';
import * as XLSX from 'xlsx'; // Import xlsx
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { CountryForm } from './CountryForm';
import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { getAll, getMetrics, deleteCountry, getCountryById, Country, CountryFormData, bulkUpdateCountries, exportCountries } from '@/services/countriesService';

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
  status: 'active' | 'disabled';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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

// --- MobileCountryCard Component ---
// Interface moved to service, importing it instead
// import { Country } from '@/services/countriesService'; // Removed duplicate import

interface MobileCountryCardProps {
  country: Country;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
}

const MobileCountryCard: React.FC<MobileCountryCardProps> = ({ country, isSelected, onToggleSelect, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 w-full transition-all active:scale-[0.99] cursor-pointer flex flex-col gap-2 ${isSelected ? 'bg-purple-50/30' : ''}`}>
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-[#253154] text-[15px]">{country.name}</span>
        <span className="bg-[#F4F4F4] text-gray-500 text-[10px] px-2 py-1 rounded-lg">{country.code}</span>
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
        <span className="text-gray-600 text-sm">{country.region}</span>
        <div className="ml-auto transform scale-90 origin-right">
          <StatusBadge status={country.status === 'active' ? 'active' : 'disabled'} />
        </div>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div className="mt-2 pt-3 border-t border-gray-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Visa Difficulty</div>
              <div className="text-sm text-gray-700 font-medium">{country.visa_difficulty}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Cost of Living</div>
              <div className="text-sm text-gray-700 font-medium">{country.cost_of_living}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Universities</div>
              <div className="text-sm text-gray-700 font-medium">{country.universities_count}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Popularity</div>
              <div className="text-sm text-gray-700 font-medium">{country.popularity}%</div>
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
interface CountriesOverviewPageProps {
  onNavigate?: (page: string) => void;
  onEditCountry?: (countryId: string) => void;
}

export const CountriesOverviewPage: React.FC<CountriesOverviewPageProps> = ({ onNavigate, onEditCountry }) => {
  // State management
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31)
  });
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search'>('none');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['name', 'code', 'region', 'visa_difficulty', 'cost_of_living', 'status', 'universities']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);

  // Dialog states
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editingCountryFormData, setEditingCountryFormData] = useState<CountryFormData | null>(null);
  const [deleteConfirmCountry, setDeleteConfirmCountry] = useState<Country | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetchingEdit, setIsFetchingEdit] = useState(false);

  // Data state
  const [countries, setCountries] = useState<Country[]>([]);
  const [metrics, setMetrics] = useState({
    totalCountries: 0,
    activeCountries: 0,
    visaFriendly: 0,
    highDemand: 0,
    withUniversities: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedSort, setSelectedSort] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Debounce search query
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadCountriesData = useCallback(async () => {
    try {
      setIsLoading(true);
      const filters = {
        q: debouncedSearch,
        region: selectedRegion === 'All Regions' ? undefined : selectedRegion,
        status: selectedStatus === 'All Status' ? undefined : selectedStatus,
        sort: selectedSort,
        order: sortOrder,
      };

      console.log('Loading countries with filters:', filters);

      const response = await getAll(filters);
      const fetchedMetrics = await getMetrics();

      console.log('Fetched details:', response);

      // Backend returns { data: [...], pagination: {...} }
      // We set countries directly.
      setCountries(response.data || []);
      setMetrics(fetchedMetrics);
    } catch (error) {
      console.error('Failed to load countries:', error);
      toast.error('Failed to load countries');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedRegion, selectedStatus, selectedSort, sortOrder]);

  // Load data on mount and when filters change
  useEffect(() => {
    // Only load if mounted
    if (!isMounted) return;
    loadCountriesData();
  }, [loadCountriesData, isMounted]);

  // Initial mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Metrics cards
  const metricsCards = [
    {
      title: 'Total Countries',
      value: metrics.totalCountries.toString(),
      icon: Globe,
      bgClass: 'bg-purple-50',
      colorClass: 'text-purple-600',
      tooltip: 'Total countries available on platform'
    },
    {
      title: 'Active Countries',
      value: metrics.activeCountries.toString(),
      icon: MapPin,
      bgClass: 'bg-green-50',
      colorClass: 'text-green-600',
      tooltip: 'Currently enabled for students'
    },
    {
      title: 'Visa-Friendly',
      value: metrics.visaFriendly.toString(),
      icon: FileText,
      bgClass: 'bg-blue-50',
      colorClass: 'text-blue-600',
      tooltip: 'Countries with low visa difficulty'
    },
    {
      title: 'High-Demand',
      value: metrics.highDemand.toString(),
      icon: TrendingUp,
      bgClass: 'bg-amber-50',
      colorClass: 'text-amber-600',
      tooltip: 'Most selected by students'
    },
    {
      title: 'With Universities',
      value: metrics.withUniversities.toString(),
      icon: Building2,
      bgClass: 'bg-pink-50',
      colorClass: 'text-pink-600',
      tooltip: 'Countries with active universities'
    }
  ];

  // Column configuration
  const allColumns = [
    { key: 'name', label: 'Country Name' },
    { key: 'code', label: 'Code' },
    { key: 'region', label: 'Region' },
    { key: 'visa_difficulty', label: 'Visa Difficulty' },
    { key: 'cost_of_living', label: 'Cost of Living' },
    { key: 'status', label: 'Status' },
    { key: 'universities', label: 'Universities' },
    { key: 'popularity', label: 'Popularity' }
  ];

  // Handlers
  const handleRefresh = () => {
    toast.success("Refreshing data...");
  };

  const handleSelectAll = () => {
    if (selectedCountries.length === countries.length) {
      setSelectedCountries([]);
      setSelectAllStore(false);
    } else {
      setSelectedCountries(countries.map(c => c.id));
      setSelectAllStore(false);
    }
  };

  const handleToggleCountry = (countryId: string) => {
    setSelectedCountries(prev =>
      prev.includes(countryId)
        ? prev.filter(id => id !== countryId)
        : [...prev, countryId]
    );
  };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedCountries(countries.map(c => c.id));
  };

  const handleClearSelection = () => {
    setSelectedCountries([]);
    setSelectAllStore(false);
  };

  const handleBulkEnable = async () => {
    try {
      await bulkUpdateCountries(selectedCountries, 'active');
      toast.success(`Enabled ${selectedCountries.length} countries`);
      loadCountriesData();
      handleClearSelection();
    } catch (error) {
      console.error('Failed to bulk enable:', error);
      toast.error('Failed to enable countries');
    }
  };

  const handleBulkDisable = async () => {
    try {
      await bulkUpdateCountries(selectedCountries, 'inactive');
      toast.success(`Disabled ${selectedCountries.length} countries`);
      loadCountriesData();
      handleClearSelection();
    } catch (error) {
      console.error('Failed to bulk disable:', error);
      toast.error('Failed to disable countries');
    }
  };

  const handleExportSelected = async () => {
    try {
      if (selectedCountries.length === 0) {
        toast.error("No countries selected");
        return;
      }

      toast.info(`Exporting ${selectedCountries.length} countries...`);

      // Fetch data for selected IDs
      const data = await exportCountries(selectedCountries);

      if (!data || data.length === 0) {
        toast.error("No data found for selected countries");
        return;
      }

      // Generate Excel file
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Countries");

      const fileName = `countries_selected_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success("Export successful");
    } catch (error) {
      console.error('Failed to export:', error);
      toast.error('Failed to export countries');
    }
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
    { id: 'name', label: 'Country Name', defaultSelected: true },
    { id: 'code', label: 'Country Code', defaultSelected: true },
    { id: 'region', label: 'Region/Continent', defaultSelected: true },
    { id: 'visaDifficulty', label: 'Visa Difficulty Level', defaultSelected: true },
    { id: 'costOfLiving', label: 'Cost of Living', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'universities', label: 'Number of Universities', defaultSelected: false },
    { id: 'popularity', label: 'Popularity Score', defaultSelected: false },
    { id: 'workRights', label: 'Work Rights Availability', defaultSelected: false },
    { id: 'prAvailability', label: 'PR/Settlement Availability', defaultSelected: false }
  ];

  const importFields: ImportField[] = [
    { id: 'countryName', label: 'Country Name', required: true, type: 'text' },
    { id: 'countryCode', label: 'Country Code', required: true, type: 'text' },
    { id: 'region', label: 'Region/Continent', required: true, type: 'select', options: ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'] },
    { id: 'visaDifficulty', label: 'Visa Difficulty Level', required: true, type: 'select', options: ['Low', 'Medium', 'High'] },
    { id: 'costOfLiving', label: 'Cost of Living', required: true, type: 'select', options: ['Low', 'Medium', 'High'] },
    { id: 'workRights', label: 'Work Rights Available', required: false, type: 'select', options: ['Yes', 'No', 'Limited'] },
    { id: 'prAvailability', label: 'PR/Settlement Available', required: false, type: 'select', options: ['Yes', 'No', 'Conditional'] },
    { id: 'status', label: 'Status', required: false, type: 'select', options: ['Active', 'Disabled'] }
  ];

  const handleExport = async (options: any) => {
    console.log('Exporting with options:', options);

    try {
      let dataToExport: any[] = [];

      // 1. Determine Scope and Fetch Data
      if (options.scope === 'all') {
        toast.info("Fetching all data for export...");
        // Fetch all countries (using a large limit for now)
        const response = await getAll({ limit: 10000 });
        dataToExport = response.data || [];
      } else if (options.scope === 'current') {
        // Use current view data
        dataToExport = [...countries];
      } else if (options.scope === 'selected') {
        if (selectedCountries.length === 0) {
          toast.error("No items selected");
          return;
        }
        toast.info(`Fetching ${selectedCountries.length} selected items...`);
        dataToExport = await exportCountries(selectedCountries);
      }

      // 2. Filter by Date Range (if applicable)
      if (options.dateRange?.from && options.dateRange?.to) {
        const fromDate = new Date(options.dateRange.from);
        const toDate = new Date(options.dateRange.to);
        // Set to end of day for inclusive comparison
        toDate.setHours(23, 59, 59, 999);

        dataToExport = dataToExport.filter(item => {
          // Use updated_at or created_at or fallback to true if no date field
          const itemDateStr = item.created_at || item.updated_at;
          if (!itemDateStr) return true;

          const itemDate = new Date(itemDateStr);
          return itemDate >= fromDate && itemDate <= toDate;
        });

        toast.info(`Filtered to ${dataToExport.length} records within date range`);
      }

      if (!dataToExport || dataToExport.length === 0) {
        toast.warning("No data available to export after filtering");
        return;
      }

      // 3. Filter Columns based on selection
      // Map data to selected columns with proper headers
      const exportData = dataToExport.map(item => {
        const row: any = {};

        // Helper to check if column is selected
        const isSelected = (id: string) => options.selectedColumns.includes(id);

        if (isSelected('name')) row['Country Name'] = item.name;
        if (isSelected('code')) row['Country Code'] = item.code;
        if (isSelected('region')) row['Region'] = item.region;
        if (isSelected('visaDifficulty')) row['Visa Difficulty'] = item.visa_difficulty;
        if (isSelected('costOfLiving')) row['Cost of Living'] = item.cost_of_living;
        if (isSelected('status')) row['Status'] = item.status;
        if (isSelected('universities')) row['Universities Count'] = item.universities_count || 0;
        if (isSelected('popularity')) row['Popularity'] = item.popularity || 0;
        if (isSelected('workRights')) row['Work Rights'] = item.work_rights ? 'Yes' : 'No';
        if (isSelected('prAvailability')) row['PR Availability'] = item.pr_availability ? 'Yes' : 'No';

        return row;
      });

      // 4. Generate File based on Format
      const dateStr = format(new Date(), 'yyyy-MM-dd');
      const fileName = `countries_export_${options.scope}_${dateStr}`;

      if (options.format === 'csv') {
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Countries");
        XLSX.writeFile(workbook, `${fileName}.csv`);
      } else if (options.format === 'xlsx') {
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Countries");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      } else if (options.format === 'json') {
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (options.format === 'pdf') {
        // PDF Export - Print to PDF strategy
        const headers = Object.keys(exportData[0] || {});
        if (headers.length === 0) {
          toast.error("No columns selected for PDF");
          return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          toast.error("Please allow popups to export PDF");
          return;
        }

        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>${fileName}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #253154; margin-bottom: 20px; text-align: center; }
                table { w-full: 100%; border-collapse: collapse; width: 100%; }
                th { background-color: #f1f5f9; color: #1e293b; font-weight: bold; text-align: left; padding: 12px; border: 1px solid #e2e8f0; }
                td { padding: 8px 12px; border: 1px solid #e2e8f0; color: #334155; font-size: 14px; }
                tr:nth-child(even) { background-color: #f8fafc; }
                .meta { margin-bottom: 20px; color: #64748b; font-size: 12px; }
              </style>
            </head>
            <body>
              <h1>Countries Export</h1>
              <div class="meta">
                <p>Generated: ${new Date().toLocaleString()}</p>
                <p>Scope: ${options.scope}</p>
                <p>Records: ${exportData.length}</p>
              </div>
              <table>
                <thead>
                  <tr>
                    ${headers.map(h => `<th>${h}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${exportData.map(row => `
                    <tr>
                      ${headers.map(h => `<td>${row[h] !== undefined ? row[h] : ''}</td>`).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        // Wait for styles to load
        setTimeout(() => {
          printWindow.print();
          // printWindow.close(); // Optional: close after print
        }, 500);
      }

      toast.success(`Successfully exported ${exportData.length} records`);
      setShowExportDialog(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export data");
    }
  };

  const handleImport = async (data: any[], mode: any) => {
    console.log('Importing:', data, 'Mode:', mode);
    toast.success(`Successfully imported ${data.length} countries`);
  };

  const handleAddCountry = () => {
    setShowAddCountryModal(true);
  };

  const handleEditCountry = async (countryId: string) => {
    setIsFetchingEdit(true);
    try {
      const fullCountry = await getCountryById(countryId);
      const country = fullCountry || countries.find(c => c.id === countryId);
      if (country) {
        setEditingCountry(country);
        setEditingCountryFormData({
          country_name: country.name,
          country_code: country.code,
          region: country.region,
          visa_difficulty: country.visa_difficulty,
          cost_of_living: country.cost_of_living,
          status: country.status === 'active' ? 'Active' : 'Inactive',
          visible: true,
          service_availability: {
            visa: country.service_visa ?? false,
            insurance: country.service_insurance ?? false,
            housing: country.service_housing ?? false,
            loans: country.service_loans ?? false,
            forex: country.service_forex ?? false,
            courses: country.service_courses ?? false,
            food: country.service_food ?? false,
          }
        });
      }
    } catch (err) {
      console.error('Failed to fetch country details:', err);
      const country = countries.find(c => c.id === countryId);
      if (country) setEditingCountry(country);
    } finally {
      setIsFetchingEdit(false);
    }
  };

  const handleDeleteCountry = async (country: Country) => {
    setIsDeleting(true);
    try {
      await deleteCountry(country.id);
      toast.success(`"${country.name}" deleted successfully`);
      setDeleteConfirmCountry(null);
      loadCountriesData();
    } catch (error) {
      console.error('Failed to delete country:', error);
      toast.error('Failed to delete country. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCountrySaved = () => {
    toast.success('Country saved successfully');
    setShowAddCountryModal(false);
    loadCountriesData();
  };

  /*
  const handleSaveCountry = async (formData: CountryFormData) => {
    try {
      if (modalMode === 'add') {
        await countriesService.createCountry(formData);
      toast.success(`Country ${formData.country_name} added successfully`);
      } else if (editingCountryId) {
        await countriesService.updateCountry(editingCountryId, formData);
      toast.success(`Country ${formData.country_name} updated successfully`);
      }

      // Reload data
      await loadCountriesData();
      setShowCountryModal(false);
    } catch (error: any) {
        console.error('Error saving country:', error);
      toast.error('Failed to save country');
      // throw error; // Let modal handle the error if needed, or handle it here
    }
  };

  // Get editing country data
  const getEditingCountryData = (): CountryFormData | null => {
    if (modalMode === 'edit' && editingCountryId) {
      const country = countries.find(c => c.id === editingCountryId);
      if (country) {
        // Transform UI data back to service format
        return {
        country_name: country.name,
      country_code: country.code,
      region: country.region as any,
      visa_difficulty: country.visaDifficulty as any,
      cost_of_living: country.costOfLiving as any,
      status: country.status === 'active' ? 'Active' : 'Inactive',
      visible: true, // Default
      service_availability: {
        visa: true,
      insurance: true,
      housing: true,
      loans: true,
      forex: true,
      courses: true,
      food: true
          }
        };
      }
    }
      return null;
  };
      */

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
            <button className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium" onClick={() => setShowAddCountryModal(true)}>
              <Plus size={20} strokeWidth={1.5} />
              Add Country
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
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShowExportDialog(true)}
              className="flex flex-col items-center justify-center gap-1 bg-white h-[60px] rounded-xl border border-gray-100 shadow-sm active:scale-95 transition-transform"
            >
              <Download size={18} className="text-[#253154]" />
              <span className="text-[10px] font-medium text-[#253154]">Export</span>
            </button>
            <button
              onClick={() => setShowImportDialog(true)}
              className="flex flex-col items-center justify-center gap-1 bg-white h-[60px] rounded-xl border border-gray-100 shadow-sm active:scale-95 transition-transform"
            >
              <Upload size={18} className="text-[#253154]" />
              <span className="text-[10px] font-medium text-[#253154]">Import</span>
            </button>
            <button
              onClick={() => setShowAddCountryModal(true)}
              className="flex flex-col items-center justify-center gap-1 bg-[#0e042f] h-[60px] rounded-xl shadow-lg active:scale-95 transition-transform"
            >
              <Plus size={18} className="text-white" />
              <span className="text-[10px] font-medium text-white">Add</span>
            </button>
          </div>
        </div>

        {/* Metrics Section - Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {metricsCards.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Metrics Section - Mobile Carousel */}
        <div className="block lg:hidden mb-14 -mx-4">
          <Slider {...slickSettings}>
            {metricsCards.map((metric, index) => (
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
              placeholder="Search by country name or code..."
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
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase mt-1">Region</div>
                    {['All Regions', 'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'].map(region => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        className={`w-full px-3 py-1.5 rounded-lg text-sm text-left flex items-center justify-between ${selectedRegion === region ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {region}
                        {selectedRegion === region && <Check size={14} />}
                      </button>
                    ))}

                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase mt-2">Status</div>
                    {['All Status', 'Active', 'Disabled'].map(status => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`w-full px-3 py-1.5 rounded-lg text-sm text-left flex items-center justify-between ${selectedStatus === status ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {status}
                        {selectedStatus === status && <Check size={14} />}
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
                    {([
                      { label: 'Popularity', value: 'popularity' },
                      { label: 'Cost of Living', value: 'cost_of_living' },
                      { label: 'Visa Difficulty', value: 'visa_difficulty' },
                      { label: 'Alphabetical (A-Z)', value: 'name' },
                      { label: 'Last Updated', value: 'updated_at' },
                    ] as { label: string; value: string }[]).map(option => {
                      const isActive = selectedSort === option.value;
                      const isDesc = isActive && sortOrder === 'desc';
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            if (isActive) {
                              setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSelectedSort(option.value);
                              setSortOrder('asc');
                            }
                            setShowSortMenu(false);
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-sm text-left flex items-center justify-between transition-colors ${isActive
                            ? 'bg-purple-50 text-purple-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <span>{option.label}</span>
                          {isDesc
                            ? <ArrowUp size={16} className={isActive ? 'text-purple-500' : 'text-gray-400'} />
                            : <ArrowDown size={16} className={isActive ? 'text-purple-500' : 'text-gray-400'} />
                          }
                        </button>
                      );
                    })}
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
                      <Eye size={16} />
                      View Details
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Edit size={16} />
                      Edit Data
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Settings size={16} />
                      Manage Visa Rules
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <FileText size={16} />
                      Comparison Factors
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <ToggleLeft size={16} />
                      Enable/Disable
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Building2 size={16} />
                      Linked Universities
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
              placeholder="Search countries..."
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
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filter by Region</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['All Regions', 'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'].map((region) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        className={`rounded-full text-sm font-medium px-3 py-2 border ${selectedRegion === region
                          ? 'bg-purple-50 text-purple-700 border-purple-100'
                          : 'bg-gray-50 text-gray-600 border-gray-100'
                          }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100" />

                {/* Sort Options */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sort By</div>
                  <div className="grid grid-cols-1 gap-2">
                    {['Popularity', 'Alphabetical (A-Z)', 'Cost of Living', 'Visa Difficulty'].map(option => (
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
          {selectedCountries.length > 0 && (
            <div className="bg-purple-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm border-b border-purple-100">
              <div className="flex items-center gap-2">
                <span className="text-purple-900">
                  {selectedCountries.length} countr{selectedCountries.length > 1 ? 'ies' : 'y'} selected
                </span>
                {!selectAllStore && selectedCountries.length === countries.length && (
                  <>
                    <span className="text-purple-700">·</span>
                    <button onClick={handleSelectAllStore} className="text-purple-700 font-bold hover:underline">
                      Select all {countries.length} countries
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleBulkEnable} className="text-purple-700 font-bold hover:underline">Bulk Enable</button>
                <button onClick={handleBulkDisable} className="text-purple-700 font-bold hover:underline">Bulk Disable</button>
                <button onClick={handleExportSelected} className="text-purple-700 font-bold hover:underline">Export Selected</button>
                <button onClick={handleClearSelection} className="text-purple-700 font-bold hover:underline">Clear</button>
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
                      checked={selectedCountries.length === countries.length}
                      partial={selectedCountries.length > 0 && selectedCountries.length < countries.length}
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
                {countries.map(country => (
                  <tr
                    key={country.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedCountries.includes(country.id) ? 'bg-purple-50/30' : ''}`}
                    onClick={(e) => {
                      // Don't navigate if clicking checkbox or actions
                      if ((e.target as HTMLElement).closest('td:first-child') || (e.target as HTMLElement).closest('td:last-child')) {
                        return;
                      }
                      handleEditCountry(country.id);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CustomCheckbox
                        checked={selectedCountries.includes(country.id)}
                        onChange={() => handleToggleCountry(country.id)}
                      />
                    </td>
                    {visibleColumns.includes('name') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#253154]">{country.name}</td>
                    )}
                    {visibleColumns.includes('code') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{country.code}</td>
                    )}
                    {visibleColumns.includes('region') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{country.region}</td>
                    )}
                    {visibleColumns.includes('visa_difficulty') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{country.visa_difficulty}</td>
                    )}
                    {visibleColumns.includes('cost_of_living') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{country.cost_of_living}</td>
                    )}
                    {visibleColumns.includes('status') && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={country.status === 'active' ? 'active' : 'disabled'} />
                      </td>
                    )}
                    {visibleColumns.includes('universities') && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="text-sm font-medium text-purple-600 hover:text-purple-800 cursor-pointer underline decoration-dotted"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/universities?countryId=${country.id}`;
                          }}
                        >
                          {country.universities_count || 0} Universities
                        </div>
                      </td>
                    )}
                    {visibleColumns.includes('popularity') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#253154]">{country.popularity}%</td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="text-gray-400 hover:text-[#0e042f] transition-colors p-1 rounded-md hover:bg-gray-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-32 p-0" align="end">
                          <div className="flex flex-col">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCountry(country.id);
                              }}
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2"
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmCountry(country);
                              }}
                              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {countries.map(country => (
              <MobileCountryCard
                key={country.id}
                country={country}
                isSelected={selectedCountries.includes(country.id)}
                onToggleSelect={() => handleToggleCountry(country.id)}
                onEdit={() => handleEditCountry(country.id)}
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

      {/* Add Country Dialog */}
      <Dialog open={showAddCountryModal} onOpenChange={setShowAddCountryModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Country</DialogTitle>
          </DialogHeader>
          <CountryForm
            onSuccess={handleCountrySaved}
            onCancel={() => setShowAddCountryModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Country Dialog */}
      <Dialog open={!!editingCountry || isFetchingEdit} onOpenChange={(open) => {
        if (!open) {
          setEditingCountry(null);
          setEditingCountryFormData(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Country</DialogTitle>
          </DialogHeader>
          {isFetchingEdit ? (
            <div className="flex items-center justify-center py-12">
              <span className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-3" />
              <span className="text-gray-500 text-sm">Loading country details...</span>
            </div>
          ) : (editingCountry && editingCountryFormData) && (
            <CountryForm
              isEdit
              countryId={editingCountry.id}
              initialData={editingCountryFormData}
              onSuccess={() => {
                setEditingCountry(null);
                setEditingCountryFormData(null);
                toast.success('Country updated successfully');
                loadCountriesData();
              }}
              onCancel={() => {
                setEditingCountry(null);
                setEditingCountryFormData(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirmCountry} onOpenChange={(open) => { if (!open) setDeleteConfirmCountry(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 size={18} />
              Delete Country
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirmCountry?.name}</span>?
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteConfirmCountry(null)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirmCountry && handleDeleteCountry(deleteConfirmCountry)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Deleting...</>
              ) : (
                <><Trash2 size={14} />Delete</>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Countries"
        totalCount={metrics.totalCountries}
        selectedCount={selectedCountries.length}
        columns={exportColumns}
        supportsDateRange={true}
        onExport={handleExport}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Countries"
        fields={importFields}
        onImport={handleImport}
        templateUrl="/templates/countries-import-template.xlsx"
        allowUpdate={true}
      />
    </TooltipProvider>
  );
};