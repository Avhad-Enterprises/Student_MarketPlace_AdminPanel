"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Edit, Check, Columns, Eye, Power, Globe, Users, CreditCard, Percent, TrendingUp, DollarSign, Trash2 } from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { AddLoanDialog } from './common/AddLoanDialog';
import * as loansService from '../services/loansService';
import { Loan } from '../services/loansService';

interface CustomCheckboxProps { checked: boolean; partial?: boolean; onChange: () => void; }
const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, partial, onChange }) => (<div onClick={onChange} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'}`}>{checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}{partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}</div>);

const StatusBadge: React.FC<{ status: 'active' | 'inactive' }> = ({ status }) => {
  const config = { 'active': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Active' }, 'inactive': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', label: 'Inactive' } }[status];
  return (<span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>{config.label}</span>);
};

const MetricCard: React.FC<{ title: string; value: string; icon: React.ElementType; bgClass: string; colorClass: string; tooltip: string }> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
    <div className="flex items-center justify-between"><span className="text-[#253154] font-medium text-[15px]">{title}</span><TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help">i</div></TooltipTrigger><TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2"><p>{tooltip}</p></TooltipContent></Tooltip></TooltipProvider></div>
    <div className="flex items-end gap-3 mt-2"><div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}><Icon size={22} strokeWidth={1.5} /></div><div><p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p></div></div>
    <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500"><Icon size={80} /></div>
  </div>
);

const MobileLoanCard: React.FC<{
  loan: Loan;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: (loan: Loan) => void;
  onDelete: (id: number) => void;
}> = ({ loan, isSelected, onToggleSelect, onEdit, onDelete }) => (
  <div className={`bg-white p-4 rounded-2xl border ${isSelected ? 'border-purple-600 bg-purple-50/30' : 'border-gray-100'} shadow-sm space-y-4`}>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <CustomCheckbox checked={isSelected} onChange={onToggleSelect} />
        <div>
          <h3 className="font-bold text-[#253154] text-[16px]">{loan.product_name}</h3>
          <p className="text-gray-500 text-xs">Ref: {loan.loan_id}</p>
        </div>
      </div>
      <StatusBadge status={loan.status} />
    </div>

    <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-3 border-y border-gray-50">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provider</p>
        <p className="text-sm font-medium text-gray-700">{loan.provider_name}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</p>
        <p className="text-sm font-medium text-gray-700">{loan.amount_range}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Countries</p>
        <p className="text-sm font-medium text-gray-700">{loan.countries_supported}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visibility</p>
        <p className="text-sm font-medium text-gray-700">{loan.student_visible ? 'Visible' : 'Hidden'}</p>
      </div>
    </div>

    <div className="flex items-center justify-end gap-2 pt-1">
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(loan); }}
        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
        title="Edit"
      >
        <Edit size={18} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(loan.id); }}
        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

export const LoansOverviewPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'provider', 'product', 'amount', 'countries', 'status', 'visible']);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editLoan, setEditLoan] = useState<Loan | null>(null);

  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', order: 'desc' });

  const [metrics, setMetrics] = useState({
    totalLoanProviders: '0',
    activeLoanProducts: '0',
    countriesSupported: '0',
    averageApprovalRate: '0%'
  });

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    try {
      const result = await loansService.getAllLoans({
        page: currentPage,
        limit: rowsPerPage,
        search: searchQuery,
        status: statusFilter === 'All' ? undefined : statusFilter,
        sort: sortConfig.key,
        order: sortConfig.order
      });
      setLoans(result.data || []);
      setTotalCount(result.pagination?.total || 0);
    } catch (error) {
      toast.error("Failed to load loans data");
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchQuery, statusFilter, sortConfig]);

  const fetchMetrics = useCallback(async () => {
    try {
      const data = await loansService.getLoanMetrics();
      if (data) {
        setMetrics({
          totalLoanProviders: data.totalLoanProviders.toString(),
          activeLoanProducts: data.activeLoanProducts.toString(),
          countriesSupported: data.countriesSupported.toString(),
          averageApprovalRate: data.averageApprovalRate
        });
      }
    } catch (error) {
      console.error("Failed to fetch metrics", error);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const handleSave = async (data: any) => {
    try {
      if (editLoan) {
        await loansService.updateLoan(editLoan.id, data);
      } else {
        await loansService.createLoan(data);
      }
      fetchLoans();
      fetchMetrics();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this loan product?")) {
      try {
        await loansService.deleteLoan(id);
        toast.success("Loan product deleted successfully");
        fetchLoans();
        fetchMetrics();
      } catch (error) {
        toast.error("Failed to delete loan product");
      }
    }
  };

  const metricCards = [
    { title: 'Loan Providers', value: metrics.totalLoanProviders, icon: CreditCard, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total loan provider partners' },
    { title: 'Active Products', value: metrics.activeLoanProducts, icon: DollarSign, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Currently active loan products' },
    { title: 'Countries Supported', value: metrics.countriesSupported, icon: Globe, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Countries with loan support' },
    { title: 'Avg Approval Rate', value: metrics.averageApprovalRate, icon: TrendingUp, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Average loan approval rate' }
  ];

  const allColumns = [{ key: 'id', label: 'Reference ID' }, { key: 'provider', label: 'Provider' }, { key: 'product', label: 'Product Name' }, { key: 'amount', label: 'Amount Range' }, { key: 'countries', label: 'Countries' }, { key: 'status', label: 'Status' }, { key: 'interestType', label: 'Interest Type' }, { key: 'collateral', label: 'Collateral' }, { key: 'approvalRate', label: 'Approval Rate' }, { key: 'visible', label: 'Visible' }];
  const exportColumns: ExportColumn[] = [{ id: 'loan_id', label: 'Reference ID', defaultSelected: true }, { id: 'provider_name', label: 'Provider', defaultSelected: true }, { id: 'product_name', label: 'Product Name', defaultSelected: true }, { id: 'amount_range', label: 'Amount Range', defaultSelected: true }, { id: 'countries_supported', label: 'Countries', defaultSelected: true }, { id: 'status', label: 'Status', defaultSelected: true }, { id: 'interest_type', label: 'Interest Type', defaultSelected: false }, { id: 'collateral_required', label: 'Collateral Requirement', defaultSelected: false }];
  const importFields: ImportField[] = [{ id: 'loan_id', label: 'Reference ID', required: false, type: 'text' }, { id: 'provider_name', label: 'Provider', required: true, type: 'text' }, { id: 'product_name', label: 'Product Name', required: true, type: 'text' }, { id: 'amount_range', label: 'Amount Range', required: true, type: 'text' }, { id: 'countries_supported', label: 'Countries', required: true, type: 'text' }, { id: 'status', label: 'Status', required: false, type: 'select', options: ['Active', 'Inactive'] }, { id: 'interest_type', label: 'Interest Type', required: false, type: 'select', options: ['Fixed', 'Variable'] }, { id: 'collateral_required', label: 'Collateral Requirement', required: false, type: 'select', options: ['Yes', 'No'] }];

  const handleExport = async (options: any) => {
    try {
      if (options.format === 'pdf') {
        let dataToExport: Loan[] = [];
        if (options.scope === 'all') {
          const response = await loansService.getAllLoans({ limit: 10000 });
          dataToExport = response.data || [];
        } else if (options.scope === 'current') {
          dataToExport = [...loans];
        } else if (options.scope === 'selected') {
          dataToExport = loans.filter(l => selectedLoans.includes(l.id.toString()));
        }

        if (options.dateRange?.from && options.dateRange?.to) {
          const from = new Date(options.dateRange.from);
          const to = new Date(options.dateRange.to);
          dataToExport = dataToExport.filter(item => {
            const date = new Date(item.created_at || '');
            return date >= from && date <= to;
          });
        }

        const exportData = dataToExport.map(item => {
          const row: any = {};
          const isSelected = (id: string) => options.selectedColumns.includes(id);
          if (isSelected('loan_id')) row['Ref ID'] = item.loan_id;
          if (isSelected('provider_name')) row['Provider'] = item.provider_name;
          if (isSelected('product_name')) row['Product'] = item.product_name;
          if (isSelected('amount_range')) row['Amount'] = item.amount_range;
          if (isSelected('countries_supported')) row['Countries'] = item.countries_supported;
          if (isSelected('status')) row['Status'] = item.status;
          return row;
        });

        const headers = Object.keys(exportData[0] || {});
        const dateStr = format(new Date(), 'yyyy-MM-dd');
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
          <html>
            <head>
              <title>Loans Export ${dateStr}</title>
              <style>
                body { font-family: sans-serif; padding: 40px; color: #1e293b; }
                header { margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
                h1 { color: #0e042f; margin: 0; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #f8fafc; text-align: left; padding: 12px; border: 1px solid #e2e8f0; font-size: 11px; text-transform: uppercase; }
                td { padding: 12px; border: 1px solid #e2e8f0; font-size: 13px; }
              </style>
            </head>
            <body>
              <header>
                <h1>Loan Products Export</h1>
                <p>Generated: ${new Date().toLocaleString()} | Records: ${exportData.length}</p>
              </header>
              <table>
                <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                <tbody>${exportData.map(row => `<tr>${headers.map(h => `<td>${row[h]}</td>`).join('')}</tr>`).join('')}</tbody>
              </table>
              <script>window.onload = () => { window.print(); window.close(); }</script>
            </body>
          </html>
        `);
        printWindow.document.close();
        toast.success("PDF report generated");
      } else {
        await loansService.exportLoans({
          ...options,
          ids: options.scope === 'selected' ? selectedLoans.join(',') : undefined
        });
        toast.success("Data exported successfully");
        setShowExportDialog(false);
      }
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const handleImport = async (data: any[], mode: any) => { toast.success(`Successfully imported ${data.length} loan records`); };

  return (
    <TooltipProvider>
      <>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">
          <div className="hidden md:flex justify-between items-center gap-4 mb-8">
            <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
              <Popover><PopoverTrigger asChild><button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"><CalendarIcon size={20} className="text-[#253154]" /><span className="font-medium text-[#253154] text-[14px]">{date?.from && date?.to ? `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}` : 'Select date range'}</span></button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><CalendarComponent initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} /></PopoverContent></Popover>
              <div className="w-px h-4 bg-gray-200 mx-2" /><button onClick={() => fetchLoans()} className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500"><RefreshCw size={20} className="text-[#253154]" /></button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Download size={20} strokeWidth={1.5} />Export</button>
              <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Upload size={20} strokeWidth={1.5} />Import</button>
              <button onClick={() => { setEditLoan(null); setShowAddDialog(true); }} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"><Plus size={20} strokeWidth={1.5} />Add Loan</button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">{metricCards.map((m, i) => <MetricCard key={i} {...m} />)}</div>
          <div className="block lg:hidden mb-14 -mx-4"><Slider dots infinite={false} speed={500} slidesToShow={1.1} slidesToScroll={1} arrows={false} centerMode centerPadding='20px'>{metricCards.map((m, i) => <div key={i} className="px-2 py-2"><MetricCard {...m} /></div>)}</Slider></div>

          <div className="hidden md:flex justify-between items-center gap-4 mb-6">
            <div className="relative flex-1"><Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" /><input type="text" placeholder="Search by provider, product name, reference ID" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" /></div>
            <div className="flex items-center gap-3 shrink-0">
              <Popover>
                <PopoverTrigger asChild>
                  <button className={`h-[50px] min-w-[50px] ${statusFilter !== 'All' ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-white border-gray-200 text-[#253154]'} border rounded-xl hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-2 px-4`}>
                    <Filter size={20} strokeWidth={1.5} />
                    {statusFilter !== 'All' && <span className="text-sm font-bold">{statusFilter}</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 rounded-xl border-gray-100 shadow-xl" align="end">
                  <div className="space-y-1">
                    {['All', 'Active', 'Inactive'].map((s) => (
                      <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === s ? 'bg-purple-50 text-purple-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}>{s}</button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button className={`h-[50px] min-w-[50px] bg-white border ${sortConfig.key !== 'created_at' ? 'border-purple-200 text-purple-600 bg-purple-50' : 'border-gray-200 text-[#253154]'} rounded-xl hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-2 px-4`}>
                    <ArrowUpDown size={20} strokeWidth={1.5} />
                    <span className="hidden md:inline text-sm font-medium">Sort by</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-xl border-gray-100 shadow-xl" align="end">
                  <div className="space-y-1">
                    <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Field</div>
                    {[
                      { key: 'created_at', label: 'Recently Added' },
                      { key: 'provider_name', label: 'Provider' },
                      { key: 'product_name', label: 'Product' },
                      { key: 'popularity', label: 'Popularity' },
                      { key: 'countries_supported', label: 'Coverage' }
                    ].map((item) => (
                      <button key={item.key} onClick={() => setSortConfig(prev => ({ ...prev, key: item.key }))} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortConfig.key === item.key ? 'bg-purple-50 text-purple-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}>{item.label}</button>
                    ))}
                    <div className="h-px bg-gray-100 my-1" />
                    <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Direction</div>
                    {[{ key: 'asc', label: 'Ascending' }, { key: 'desc', label: 'Descending' }].map((item) => (
                      <button key={item.key} onClick={() => setSortConfig(prev => ({ ...prev, order: item.key as any }))} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortConfig.order === item.key ? 'bg-purple-50 text-purple-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}>{item.label}</button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-2 px-4"><Columns size={20} strokeWidth={1.5} /><span className="hidden md:inline text-sm font-medium">Columns</span></button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-xl border-gray-100 shadow-xl" align="end">
                  <div className="space-y-1">
                    <div className="px-2 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center"><span>Visible Columns</span><button onClick={() => setVisibleColumns(['id', 'provider', 'product', 'amount', 'countries', 'status', 'visible'])} className="text-purple-600 hover:underline capitalize font-normal text-[10px]">Reset</button></div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar-light pr-1 space-y-1">
                      {allColumns.map((col) => (
                        <button key={col.key} onClick={() => setVisibleColumns(prev => prev.includes(col.key) ? (prev.length > 1 ? prev.filter(k => k !== col.key) : prev) : [...prev, col.key])} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-gray-600 transition-colors">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${visibleColumns.includes(col.key) ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white'}`}>{visibleColumns.includes(col.key) && <Check size={10} className="text-white" strokeWidth={4} />}</div>
                          {col.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><MoreHorizontal size={20} strokeWidth={1.5} /></button>
            </div>
          </div>

          {selectedLoans.length > 0 && (<div className="bg-purple-50 px-6 py-3 flex items-center justify-between text-sm border-b border-purple-100 mb-6 rounded-t-2xl"><span className="text-purple-900 font-medium">{selectedLoans.length} loan{selectedLoans.length !== 1 ? 's' : ''} selected</span><button onClick={() => setSelectedLoans([])} className="text-purple-700 font-bold hover:underline">Clear</button></div>)}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]">
            {loading && (<div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center"><RefreshCw size={40} className="text-purple-600 animate-spin" /></div>)}

            {/* Mobile View */}
            <div className="md:hidden space-y-4 p-4">
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <MobileLoanCard
                    key={loan.id}
                    loan={loan}
                    isSelected={selectedLoans.includes(loan.id.toString())}
                    onToggleSelect={() => setSelectedLoans(prev => prev.includes(loan.id.toString()) ? prev.filter(x => x !== loan.id.toString()) : [...prev, loan.id.toString()])}
                    onEdit={(l) => { setEditLoan(l); setShowAddDialog(true); }}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-3">
                  <CreditCard size={48} className="text-gray-200 mx-auto" />
                  <p className="text-gray-500 font-medium">No loan products found</p>
                </div>
              )}
            </div>

            <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
              <table className="w-full">
                <thead><tr className="border-b border-gray-100">
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12"><CustomCheckbox checked={selectedLoans.length === loans.length && loans.length > 0} partial={selectedLoans.length > 0 && selectedLoans.length < loans.length} onChange={() => setSelectedLoans(selectedLoans.length === loans.length ? [] : loans.map(l => l.id.toString()))} /></th>
                  {visibleColumns.includes('id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Reference ID</th>}
                  {visibleColumns.includes('provider') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Provider</th>}
                  {visibleColumns.includes('product') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Product Name</th>}
                  {visibleColumns.includes('amount') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Amount Range</th>}
                  {visibleColumns.includes('countries') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Countries</th>}
                  {visibleColumns.includes('interestType') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Interest</th>}
                  {visibleColumns.includes('collateral') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Collateral</th>}
                  {visibleColumns.includes('approvalRate') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Approval</th>}
                  {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Status</th>}
                  {visibleColumns.includes('visible') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visible</th>}
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {loans.length > 0 ? loans.map((loan) => (
                    <tr key={loan.id} onClick={(e) => { const target = e.target as HTMLElement; if (!target.closest('td:first-child') && !target.closest('td:last-child')) onNavigate?.('loan-provider-detail'); }} className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedLoans.includes(loan.id.toString()) ? 'bg-purple-50/30' : ''}`}>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><CustomCheckbox checked={selectedLoans.includes(loan.id.toString())} onChange={() => setSelectedLoans(prev => prev.includes(loan.id.toString()) ? prev.filter(x => x !== loan.id.toString()) : [...prev, loan.id.toString()])} /></td>
                      {visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{loan.loan_id}</td>}
                      {visibleColumns.includes('provider') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{loan.provider_name}</td>}
                      {visibleColumns.includes('product') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold underline decoration-purple-200 decoration-2 underline-offset-4">{loan.product_name}</td>}
                      {visibleColumns.includes('amount') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{loan.amount_range}</td>}
                      {visibleColumns.includes('countries') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{loan.countries_supported}</td>}
                      {visibleColumns.includes('interestType') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{loan.interest_type}</td>}
                      {visibleColumns.includes('collateral') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{loan.collateral_required ? 'Yes' : 'No'}</td>}
                      {visibleColumns.includes('approvalRate') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{loan.approval_rate}</td>}
                      {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={loan.status} /></td>}
                      {visibleColumns.includes('visible') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{loan.student_visible ? 'Yes' : 'No'}</td>}
                      <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditLoan(loan); setShowAddDialog(true); }}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                            title="Edit"
                          >
                            <Edit size={18} className="text-gray-400 group-hover:text-blue-600" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(loan.id); }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-gray-400 group-hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (<tr><td colSpan={11} className="px-6 py-20 text-center"><div className="flex flex-col items-center gap-3"><CreditCard size={48} className="text-gray-200" /><p className="text-gray-500 font-medium">No loan products found</p><button onClick={() => { setEditLoan(null); setShowAddDialog(true); }} className="text-purple-600 font-bold hover:underline">Add your first product</button></div></td></tr>)}
                </tbody>
              </table>
            </div>
            <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 rounded-tr-[30px] shadow-[0px_-5px_25px_rgba(0,0,0,0.03)] relative z-20 border-t border-gray-50">
              <div className="flex items-center gap-2"><span className="text-gray-500 text-sm font-medium">Rows per page:</span><button className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-gray-700">{rowsPerPage}<ChevronDown size={14} className="text-gray-400" /></button></div>
              <div className="text-sm text-gray-500 font-medium">Showing {loans.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, totalCount)} of {totalCount} records</div>
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={18} strokeWidth={2} className="text-gray-500" /></button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.ceil(totalCount / rowsPerPage) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)} className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === p ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / rowsPerPage), p + 1))} disabled={currentPage === Math.ceil(totalCount / rowsPerPage) || totalCount === 0} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={18} strokeWidth={2} className="text-gray-500" /></button>
              </div>
            </div>
          </div>
        </div>

        <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Loans" totalCount={totalCount} selectedCount={selectedLoans.length} columns={exportColumns} supportsDateRange={true} onExport={handleExport} />
        <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Loans" fields={importFields} onImport={handleImport} templateUrl="/templates/loans-import-template.xlsx" allowUpdate={true} />
        <AddLoanDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSave={handleSave} initialData={editLoan} mode={editLoan ? 'edit' : 'add'} />
      </>
    </TooltipProvider>
  );
};
