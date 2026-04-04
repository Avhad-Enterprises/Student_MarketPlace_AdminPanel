import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, ArrowDown, Search, Copy, Printer, Archive, Edit, Check, Columns, Eye, Power, Globe, Users, Shield, FileCheck, MapPin, TrendingUp, X } from 'lucide-react';
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ServicePageHeader } from './service-marketplace/ServicePageHeader';
import { ServiceMetricGrid } from './service-marketplace/ServiceMetricGrid';
import { CustomCheckbox, StatusBadge } from './service-marketplace/CommonUI';

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField, ImportMode } from './common/ImportDialog';
import { AddInsuranceDialog } from './common/AddInsuranceDialog';
import { PermissionGuard } from './common/PermissionGuard';
import { getAllInsurance, getInsuranceMetrics, createInsurance, updateInsurance, deleteInsurance, Insurance as InsuranceType } from '@/app/services/insuranceService';

interface MobileInsuranceCardProps {
  insurance: InsuranceType;
  isSelected: boolean;
  onToggleSelect: () => void;
  onNavigate?: (page: string) => void;
  onEdit?: (insurance: InsuranceType) => void;
  onDelete?: (id: number | string) => void;
  onToggleStatus?: (insurance: InsuranceType) => void;
  onCopyId?: (id: string) => void;
}


const MobileInsuranceCard: React.FC<MobileInsuranceCardProps> = ({
  insurance,
  isSelected,
  onToggleSelect,
  onNavigate,
  onEdit,
  onDelete,
  onToggleStatus,
  onCopyId
}) => {
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 ${isSelected ? 'border-purple-600 shadow-md ring-1 ring-purple-600/10' : 'border-gray-100 shadow-sm'}`}>
      <div className="p-4" onClick={() => {}}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}>
              <CustomCheckbox checked={isSelected} onChange={() => { }} />
            </div>
            <div>
              <h3 className="text-[#253154] font-bold text-[15px]">{insurance.policy_name}</h3>
              <p className="text-gray-500 text-[12px]">{insurance.provider_name}</p>
            </div>
          </div>
          <StatusBadge status={insurance.status} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Coverage</p>
            <p className="text-[#253154] font-medium text-[13px]">{insurance.coverage_type}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Countries</p>
            <p className="text-[#253154] font-medium text-[13px]">{insurance.countries_covered} Covered</p>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(insurance); }}
            className="flex items-center justify-center gap-2 h-10 bg-white border border-gray-100 text-[#253154] rounded-xl hover:bg-gray-50 transition-colors font-medium text-xs whitespace-nowrap shadow-sm"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate?.(`/services/insurance/${insurance.id}`); }}
            className="flex items-center justify-center gap-2 h-10 bg-purple-50 text-purple-600 border border-purple-100 rounded-xl hover:bg-purple-100 transition-colors font-medium text-xs whitespace-nowrap shadow-sm"
          >
            <Eye size={14} /> View
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(insurance.id); }}
            className="flex items-center justify-center gap-2 h-10 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors font-medium text-xs whitespace-nowrap"
          >
            <Archive size={14} /> Delete
          </button>
          <div className="grid grid-cols-2 gap-1">
             <button
              onClick={(e) => { e.stopPropagation(); onToggleStatus?.(insurance); }}
              className="flex items-center justify-center gap-2 h-10 bg-gray-50 text-[#64748b] rounded-xl hover:bg-gray-100 transition-colors font-medium text-[10px]"
            >
              <Power size={12} /> {insurance.status === 'active' ? 'Off' : 'On'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onCopyId?.(insurance.insurance_id); }}
              className="flex items-center justify-center gap-2 h-10 bg-gray-50 text-[#64748b] rounded-xl hover:bg-gray-100 transition-colors font-medium text-[10px]"
            >
              <Copy size={12} /> ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InsuranceOverviewPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>({ from: subDays(new Date(), 29), to: new Date() });
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search' | 'filter' | 'sort'>('none');
  const [selectedInsurance, setSelectedInsurance] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'provider', 'policy', 'coverage', 'countries', 'status', 'visible']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<InsuranceType | null>(null);

  const [insurances, setInsurances] = useState<InsuranceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [coverageFilter, setCoverageFilter] = useState('All Types');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [openRowMenuId, setOpenRowMenuId] = useState<number | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllInsurance({
        page: currentPage,
        limit: rowsPerPage,
        search: debouncedSearchQuery,
        status: statusFilter,
        coverage_type: coverageFilter,
        sort: sortBy,
        order: sortOrder
      });

      setInsurances(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotalCount(result.pagination.total);

      const metrics = await getInsuranceMetrics();
      setMetricsData(metrics);
    } catch (error) {
      console.error("Error fetching insurance data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, debouncedSearchQuery, statusFilter, coverageFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const metrics = [
    { title: 'Insurance Providers', value: metricsData?.totalProviders?.toString() || '0', icon: Shield, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total insurance provider partners' },
    { title: 'Active Policies', value: metricsData?.activePolicies?.toString() || '0', icon: FileCheck, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Currently active insurance policies' },
    { title: 'Mandatory Countries', value: metricsData?.mandatoryCountries?.toString() || '0', icon: MapPin, bgClass: 'bg-red-50', colorClass: 'text-red-600', tooltip: 'Countries requiring mandatory insurance' },
    { title: 'Most Popular Coverage', value: metricsData?.mostChosenType || 'N/A', icon: TrendingUp, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Most popular policy type among students' }
  ];

  const handleRefresh = () => {
    fetchData();
    toast.success("Refreshing data...");
  };

  const handleToggleInsurance = (id: string) => {
    setSelectedInsurance(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedInsurance.length === insurances.length) {
      setSelectedInsurance([]);
      setSelectAllStore(false);
    } else {
      setSelectedInsurance(insurances.map(i => i.id.toString()));
      setSelectAllStore(false);
    }
  };

  const handleClearSelection = () => { setSelectedInsurance([]); setSelectAllStore(false); };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedInsurance(insurances.map(i => i.id.toString()));
  };

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => prev.includes(columnKey) ? prev.filter(k => k !== columnKey) : [...prev, columnKey]);
  };

  const handleSaveInsurance = async (data: Partial<InsuranceType>) => {
    try {
      if (editingInsurance) {
        await updateInsurance(editingInsurance.id, data);
      } else {
        await createInsurance(data as any);
      }
      fetchData();
    } catch (error) {
      throw error;
    }
  };

  const handleEditInsurance = (insurance: InsuranceType) => {
    setEditingInsurance(insurance);
    setShowAddDialog(true);
    setOpenRowMenuId(null);
  };

  const handleDeleteInsurance = async (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await deleteInsurance(id);
        toast.success("Policy deleted successfully");
        fetchData();
        setOpenRowMenuId(null);
      } catch (error) {
        toast.error("Failed to delete policy");
      }
    }
  };

  const handleToggleStatus = async (insurance: InsuranceType) => {
    try {
      const newStatus = insurance.status === 'active' ? 'inactive' : 'active';
      await updateInsurance(insurance.id, { status: newStatus });
      toast.success(`Policy status updated to ${newStatus}`);
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

  const exportColumns: ExportColumn[] = [
    { id: 'id', label: 'Database ID', defaultSelected: false },
    { id: 'referenceId', label: 'Reference ID', defaultSelected: true }, { id: 'providerName', label: 'Provider Name', defaultSelected: true },
    { id: 'policyName', label: 'Policy Name', defaultSelected: true }, { id: 'coverageType', label: 'Coverage Type', defaultSelected: true },
    { id: 'countries', label: 'Country Availability', defaultSelected: true }, { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'duration', label: 'Duration', defaultSelected: false }, { id: 'visaCompliant', label: 'Visa Compliant', defaultSelected: false },
    { id: 'mandatory', label: 'Mandatory', defaultSelected: false }, { id: 'studentVisible', label: 'Student Visibility', defaultSelected: false }
  ];


  const importFields: ImportField[] = [
    { id: 'id', label: 'Database ID (For Updates)', required: false, type: 'text' },
    { id: 'referenceId', label: 'Reference ID', required: false, type: 'text' }, { id: 'providerName', label: 'Provider Name', required: true, type: 'text' },
    { id: 'policyName', label: 'Policy Name', required: true, type: 'text' }, { id: 'coverageType', label: 'Coverage Type', required: true, type: 'select', options: ['Comprehensive', 'Medical Only', 'Basic'] },
    { id: 'countries', label: 'Country Availability', required: true, type: 'text' }, { id: 'status', label: 'Status', required: false, type: 'select', options: ['Active', 'Inactive'] },
    { id: 'visaCompliant', label: 'Visa Compliant', required: false, type: 'select', options: ['Yes', 'No'] }, { id: 'studentVisible', label: 'Student Visibility', required: false, type: 'select', options: ['Yes', 'No'] }
  ];


  const handleExport = async (options: any) => {
    try {
      setLoading(true);
      toast.info(`Preparing ${options.scope} export...`);

      let dataToExport: InsuranceType[] = [];
      if (options.scope === 'all') {
        const result = await getAllInsurance({ limit: 1000 });
        dataToExport = result.data;
      } else if (options.scope === 'selected') {
        dataToExport = insurances.filter(i => selectedInsurance.includes(i.id.toString()));
      } else {
        dataToExport = insurances;
      }

      const mappedData = dataToExport.map(ins => {
        const row: any = {};
        options.selectedColumns.forEach((colId: string) => {
          switch (colId) {
            case 'id': row['Database ID'] = ins.id; break;
            case 'referenceId': row['Reference ID'] = ins.insurance_id; break;
            case 'providerName': row['Provider Name'] = ins.provider_name; break;
            case 'policyName': row['Policy Name'] = ins.policy_name; break;
            case 'coverageType': row['Coverage Type'] = ins.coverage_type; break;
            case 'countries': row['Countries'] = ins.countries_covered; break;
            case 'status': row['Status'] = ins.status; break;
            case 'duration': row['Duration'] = ins.duration; break;
            case 'visaCompliant': row['Visa Compliant'] = ins.visa_compliant ? 'Yes' : 'No'; break;
            case 'mandatory': row['Mandatory'] = ins.mandatory ? 'Yes' : 'No'; break;
            case 'studentVisible': row['Student Visible'] = ins.student_visible ? 'Yes' : 'No'; break;
            default: break;
          }
        });
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(mappedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Insurance");
      XLSX.writeFile(workbook, `insurance_export_${new Date().getTime()}.${options.format === 'json' ? 'json' : (options.format === 'csv' ? 'csv' : 'xlsx')}`);
      toast.success(`${options.scope.charAt(0).toUpperCase() + options.scope.slice(1)} insurance records exported successfully`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export insurance items");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (data: any[], mode: ImportMode) => {
    console.log('Importing data:', data, 'mode:', mode);
    let successCount = 0;
    let failCount = 0;

    const loadingToast = toast.loading(`Importing insurance (0/${data.length})...`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const payload = {
          insurance_id: row.referenceId || '',
          provider_name: row.providerName,
          policy_name: row.policyName,
          coverage_type: row.coverageType || 'Comprehensive',
          countries_covered: Number(row.countries) || 0,
          status: (row.status || 'Active').toLowerCase() as 'active' | 'inactive',
          duration: row.duration || '12 months',
          visa_compliant: row.visaCompliant === 'Yes',
          mandatory: row.mandatory === 'Yes',
          student_visible: row.studentVisible === 'Yes',
          popularity: 0
        };

        if ((mode === 'update' || mode === 'merge') && row.id) {
          await updateInsurance(row.id, payload);
        } else {
          await createInsurance(payload);
        }
        successCount++;
      } catch (error) {
        console.error(`Failed to import row ${i + 1}:`, error);
        failCount++;
      }
      toast.loading(`Importing insurance (${successCount + failCount}/${data.length})...`, { id: loadingToast });
    }

    toast.dismiss(loadingToast);
    if (successCount > 0) {
      toast.success(`Import complete! ${successCount} successful, ${failCount} failed.`);
    } else {
      toast.error(`Import failed! All ${failCount} rows failed.`);
    }

    setShowImportDialog(false);
    if (typeof fetchData === 'function') {
      fetchData();
    }
  };


  return (
    <TooltipProvider><div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">

      <ServicePageHeader 
        title="Insurance" 
        dateRange={date} 
        onDateChange={setDate}
        onRefresh={handleRefresh}
        actions={
          <div className="flex items-center gap-3">
            <PermissionGuard module="services" action="export">
              <button
                onClick={() => setShowExportDialog(true)}
                className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"
              >
                <Download size={20} strokeWidth={1.5} />Export
              </button>
            </PermissionGuard>
            <PermissionGuard module="services" action="create">
              <button
                onClick={() => setShowImportDialog(true)}
                className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"
              >
                <Upload size={20} strokeWidth={1.5} />Import
              </button>
            </PermissionGuard>
            <PermissionGuard module="services" action="create">
              <button
                onClick={() => { setEditingInsurance(null); setShowAddDialog(true); }}
                className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"
              >
                <Plus size={20} strokeWidth={1.5} />Add Insurance Plan
              </button>
            </PermissionGuard>
          </div>
        }
      />

      <ServiceMetricGrid metrics={metrics} />

      {/* Search Bar - Desktop (same pattern) */}
      <div className="hidden md:flex justify-between items-center gap-4 mb-6">
        <div className="relative flex-1"><Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
          <input
            type="text"
            placeholder="Search by provider name, policy name, reference ID"
            className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <button className={`h-[50px] min-w-[50px] bg-white border ${statusFilter !== 'All' || coverageFilter !== 'All Types' ? 'border-purple-600 ring-1 ring-purple-600' : 'border-gray-200'} rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-2 px-4`}>
                <Filter size={20} strokeWidth={1.5} />
                {(statusFilter !== 'All' || coverageFilter !== 'All Types') && <span className="text-sm font-bold">Filters Active</span>}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="font-bold text-[#253154]">Filters</h4>
                  <button onClick={() => { setStatusFilter('All'); setCoverageFilter('All Types'); }} className="text-xs text-purple-600 font-bold hover:underline">Reset All</button>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-11 rounded-xl border-gray-100 bg-gray-50/50">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Coverage Type</Label>
                  <Select value={coverageFilter} onValueChange={setCoverageFilter}>
                    <SelectTrigger className="h-11 rounded-xl border-gray-100 bg-gray-50/50">
                      <SelectValue placeholder="Select Coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Types">All Types</SelectItem>
                      <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                      <SelectItem value="Medical Only">Medical Only</SelectItem>
                      <SelectItem value="Travel Only">Travel Only</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center px-4 gap-2">
                <ArrowUpDown size={20} strokeWidth={1.5} />
                <span className="text-sm font-medium">Sort</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 rounded-2xl shadow-xl border-gray-100" align="end">
              {[
                { label: 'Popularity', value: 'popularity' },
                { label: 'Policy Name', value: 'policy_name' },
                { label: 'Countries Covered', value: 'countries_covered' },
                { label: 'Last Updated', value: 'updated_at' },
                { label: 'Creation Date', value: 'created_at' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (sortBy === option.value) {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy(option.value);
                      setSortOrder('desc');
                    }
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-left text-sm flex items-center justify-between transition-colors ${sortBy === option.value ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {option.label}
                  {sortBy === option.value && (
                    sortOrder === 'asc' ? <ChevronDown size={14} className="rotate-180" /> : <ChevronDown size={14} />
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <Popover open={showColumnMenu} onOpenChange={setShowColumnMenu}>
            <PopoverTrigger asChild>
              <button className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center">
                <Columns size={20} strokeWidth={1.5} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
              <h4 className="font-bold text-[#253154] mb-3">Show Columns</h4>
              <div className="space-y-2">
                {[
                  { key: 'id', label: 'Reference ID' },
                  { key: 'provider', label: 'Provider' },
                  { key: 'policy', label: 'Policy Name' },
                  { key: 'coverage', label: 'Coverage Type' },
                  { key: 'countries', label: 'Countries' },
                  { key: 'status', label: 'Status' },
                  { key: 'visible', label: 'Visibility' }
                ].map((col) => (
                  <label key={col.key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <CustomCheckbox
                      checked={visibleColumns.includes(col.key)}
                      onChange={() => handleToggleColumn(col.key)}
                    />
                    <span className="text-sm font-medium text-gray-700">{col.label}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center">
            <MoreHorizontal size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Selection Banner */}
      {selectedInsurance.length > 0 && (
        <div className="bg-purple-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm border-b border-purple-100 mb-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="text-purple-900 font-medium">{selectedInsurance.length} insurance polic{selectedInsurance.length !== 1 ? 'ies' : 'y'} selected</span>
            {selectedInsurance.length === insurances.length && !selectAllStore && (<><span className="text-purple-700">•</span><button onClick={handleSelectAllStore} className="text-purple-700 font-bold hover:underline">Select all {totalCount} policies</button></>)}
          </div>
          <div className="flex items-center gap-3">
            <button className="text-purple-700 font-bold hover:underline">Enable/Disable</button>
            <button className="text-purple-700 font-bold hover:underline">Update Countries</button>
            <button onClick={handleClearSelection} className="text-purple-700 font-bold hover:underline">Clear</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100">
              <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12"><CustomCheckbox checked={selectedInsurance.length === insurances.length} partial={selectedInsurance.length > 0 && selectedInsurance.length < insurances.length} onChange={handleSelectAll} /></th>
              {visibleColumns.includes('id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Reference ID</th>}
              {visibleColumns.includes('provider') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Provider</th>}
              {visibleColumns.includes('policy') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Policy Name</th>}
              {visibleColumns.includes('coverage') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Coverage Type</th>}
              {visibleColumns.includes('countries') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Countries</th>}
              {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Status</th>}
              {visibleColumns.includes('visible') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visible</th>}
              <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <RefreshCw size={40} className="animate-spin opacity-20" />
                      <p className="text-sm font-medium">Loading insurance data...</p>
                    </div>
                  </td>
                </tr>
              ) : insurances.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                        <Shield className="text-gray-300" size={24} />
                      </div>
                      <p className="text-gray-500 font-medium">No results found</p>
                      <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                        We couldn't find any insurance plans matching your filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                insurances.map((ins) => (
                  <tr
                    key={ins.id}
                    onClick={() => onNavigate?.(`/services/insurance/${ins.id}`)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors group ${selectedInsurance.includes(ins.id.toString()) ? 'bg-purple-50/30' : ''}`}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox checked={selectedInsurance.includes(ins.id.toString())} onChange={() => handleToggleInsurance(ins.id.toString())} />
                    </td>
                    {visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{ins.insurance_id}</td>}
                    {visibleColumns.includes('provider') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ins.provider_name}</td>}
                    {visibleColumns.includes('policy') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ins.policy_name}</td>}
                    {visibleColumns.includes('coverage') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ins.coverage_type}</td>}
                    {visibleColumns.includes('countries') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ins.countries_covered}</td>}
                    {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={ins.status} /></td>}
                    {visibleColumns.includes('visible') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ins.student_visible ? 'Yes' : 'No'}</td>}
                    <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <PermissionGuard module="services" action="view">
                          <button
                            onClick={(e) => { e.stopPropagation(); onNavigate?.(`/services/insurance/${ins.id}`); }}
                            className="p-2 hover:bg-purple-50 rounded-lg transition-colors group/view"
                            title="View Details"
                          >
                            <Eye size={18} className="text-gray-400 group-hover/view:text-purple-600" />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard module="services" action="edit">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditInsurance(ins); }}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/edit"
                            title="Edit Insurance"
                          >
                            <Edit size={18} className="text-gray-400 group-hover/edit:text-blue-600" />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard module="services" action="delete">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteInsurance(ins.id); }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group/delete"
                            title="Delete Policy"
                          >
                            <Archive size={18} className="text-gray-400 group-hover/delete:text-red-600" />
                          </button>
                        </PermissionGuard>
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
          {loading ? (
            <div className="py-10 flex flex-col items-center gap-3 text-gray-400">
              <RefreshCw size={32} className="animate-spin opacity-20" />
              <p className="text-xs font-medium">Loading...</p>
            </div>
          ) : insurances.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Shield size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No results found</p>
              <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                We couldn't find any insurance plans matching your filters.
              </p>
            </div>
          ) : (
            insurances.map((ins) => (
              <MobileInsuranceCard
                key={ins.id}
                insurance={ins}
                isSelected={selectedInsurance.includes(ins.id.toString())}
                onToggleSelect={() => handleToggleInsurance(ins.id.toString())}
                onNavigate={onNavigate}
                onEdit={handleEditInsurance}
                onDelete={handleDeleteInsurance}
                onToggleStatus={handleToggleStatus}
                onCopyId={handleCopyId}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {insurances.length > 0 && (
          <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 rounded-tr-[30px] shadow-[0px_-5px_25px_rgba(0,0,0,0.03)] relative z-20 border-t border-gray-50">
            <div className="flex items-center gap-2"><span className="text-gray-500 text-sm font-medium">Rows per page:</span>
              <Popover open={showRowsMenu} onOpenChange={setShowRowsMenu}>
                <PopoverTrigger asChild>
                  <button className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
                    {rowsPerPage}<ChevronDown size={14} className="text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-24 p-1 rounded-xl shadow-xl border-gray-100" align="center">
                  {[10, 20, 50, 100].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setRowsPerPage(num);
                        setCurrentPage(1);
                        setShowRowsMenu(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${rowsPerPage === num ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {num}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium hidden sm:inline">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <ChevronLeft size={18} strokeWidth={2} className="text-gray-500" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <ChevronRight size={18} strokeWidth={2} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menus */}
      {activeMobileMenu === 'search' && (
        <div className="fixed inset-0 z-50 bg-[#0e042f]/90 backdrop-blur-sm animate-in fade-in duration-300 flex flex-col p-6 md:hidden">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-white text-2xl font-bold">Search</h2>
            <button onClick={() => setActiveMobileMenu('none')} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="relative">
            <Search size={22} className="absolute inset-y-0 left-4 my-auto text-white/40" />
            <input
              autoFocus
              type="text"
              placeholder="Policy, Provider, ID..."
              className="w-full h-16 bg-white/10 border-none rounded-2xl pl-14 pr-4 text-white text-xl font-medium outline-none focus:ring-2 focus:ring-purple-400/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <p className="text-white/40 w-full text-xs font-bold uppercase tracking-widest mb-2">Popular Searches</p>
            {['Allianz', 'Comprehensive', 'Medical', 'INS-34'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/80 text-sm hover:bg-white/10"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeMobileMenu === 'filter' && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setActiveMobileMenu('none')} />
          <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] p-6 pb-10 animate-in slide-in-from-bottom duration-300 md:hidden">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#253154]">Active Filters</h2>
              <button
                onClick={() => { setStatusFilter('All'); setCoverageFilter('All Types'); setActiveMobileMenu('none'); }}
                className="text-sm font-bold text-purple-600 hover:bg-purple-50 px-3 py-1 rounded-lg"
              >
                Reset
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Power size={14} />Status</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['All', 'active', 'inactive'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`h-12 rounded-xl text-sm font-bold transition-all ${statusFilter === status ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Shield size={14} />Coverage</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['All Types', 'Comprehensive', 'Medical Only', 'Travel Only', 'Basic'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setCoverageFilter(type)}
                      className={`h-12 rounded-xl text-sm font-bold transition-all px-4 truncate ${coverageFilter === type ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveMobileMenu('none')}
              className="w-full h-16 bg-[#0e042f] text-white rounded-2xl mt-10 font-bold shadow-xl shadow-purple-900/20 active:scale-[0.98] transition-all"
            >
              Apply Changes
            </button>
          </div>
        </>
      )}

      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-[#0e042f] p-2 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
        <button onClick={() => setActiveMobileMenu('search')} className="flex items-center gap-2 text-white/90 font-bold text-xs bg-white/10 px-4 py-3 rounded-xl hover:bg-white/20 transition-colors">
          <Search size={16} /> Search
        </button>
        <div className="w-px h-4 bg-white/20 mx-1" />
        <button onClick={() => setActiveMobileMenu('filter')} className="flex items-center gap-2 text-white/90 font-bold text-xs bg-white/10 px-4 py-3 rounded-xl hover:bg-white/20 transition-colors relative">
          <Filter size={16} /> Filter
          {(statusFilter !== 'All' || coverageFilter !== 'All Types') && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#09031d] shadow-lg" />}
        </button>
      </div>
    </div>

      <AddInsuranceDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSave={handleSaveInsurance} initialData={editingInsurance} mode={editingInsurance ? 'edit' : 'add'} />
      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Insurance" totalCount={totalCount} selectedCount={selectedInsurance.length} columns={exportColumns} supportsDateRange={false} onExport={handleExport} />
      <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Insurance" fields={importFields} onImport={handleImport} templateUrl="/templates/insurance-import-template.xlsx" allowUpdate={true} />
    </TooltipProvider>
  );
};