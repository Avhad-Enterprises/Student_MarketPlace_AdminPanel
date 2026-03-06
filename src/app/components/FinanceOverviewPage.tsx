"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check, Columns, DollarSign, TrendingUp, CreditCard, Wallet, Receipt, Clock, Trash2, Edit3 } from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { financeService, Payment } from '@/services/financeService';
import { FinanceModal } from './FinanceModal';

const CustomCheckbox: React.FC<{ checked: boolean; partial?: boolean; onChange: () => void }> = ({ checked, partial = false, onChange }) => (
  <div onClick={onChange} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
    {checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}
    {partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}
  </div>
);

const StatusBadge: React.FC<{ status: 'paid' | 'pending' | 'overdue' | 'refunded' }> = ({ status }) => {
  const config = {
    paid: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Paid' },
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', label: 'Pending' },
    overdue: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'Overdue' },
    refunded: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', label: 'Refunded' }
  }[status] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', label: status };

  return <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>{config.label}</span>;
};

const MetricCard: React.FC<{ title: string; value: string; icon: React.ElementType; bgClass: string; colorClass: string; tooltip: string }> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
    <div className="flex items-center justify-between">
      <span className="text-[#253154] font-medium text-[15px]">{title}</span>
      <TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors">i</div></TooltipTrigger><TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2"><p>{tooltip}</p></TooltipContent></Tooltip></TooltipProvider>
    </div>
    <div className="flex items-end gap-3 mt-2">
      <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}><Icon size={22} strokeWidth={1.5} /></div>
      <div><p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p></div>
    </div>
    <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500"><Icon size={80} /></div>
  </div>
);

interface FinanceOverviewPageProps {
  onNavigate?: (page: string) => void;
  onEditEntry?: (entryId: string) => void;
}

export const FinanceOverviewPage: React.FC<FinanceOverviewPageProps> = ({ onNavigate, onEditEntry }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2025, 0, 1), to: new Date(2025, 11, 31) });
  const [selected, setSelected] = useState<number[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['transactionId', 'date', 'studentName', 'amount', 'type', 'method', 'status', 'actions']);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Advanced searching/filtering/sorting/pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [methodFilter, setMethodFilter] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Payment | 'studentName', direction: 'asc' | 'desc' }>({ key: 'created_at', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await financeService.getAllPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const collected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0);
    const pending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0);
    const overdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + Number(p.amount), 0);

    return [
      { title: 'Total Revenue', value: `$${(total / 1000).toFixed(1)}K`, icon: DollarSign, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total revenue defined' },
      { title: 'Collected', value: `$${(collected / 1000).toFixed(1)}K`, icon: Wallet, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Successfully collected payments' },
      { title: 'Pending', value: `$${(pending / 1000).toFixed(1)}K`, icon: Clock, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Pending payments' },
      { title: 'Overdue', value: `$${(overdue / 1000).toFixed(1)}K`, icon: TrendingUp, bgClass: 'bg-red-50', colorClass: 'text-red-600', tooltip: 'Overdue payments' },
      { title: 'Transactions', value: payments.length.toString(), icon: Receipt, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Total transactions' }
    ];
  }, [payments]);

  const filteredAndSortedPayments = useMemo(() => {
    let result = [...payments];

    // Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.payment_id.toLowerCase().includes(lowerSearch) ||
        p.invoice_number.toLowerCase().includes(lowerSearch) ||
        p.description.toLowerCase().includes(lowerSearch) ||
        (p.first_name && p.first_name.toLowerCase().includes(lowerSearch)) ||
        (p.last_name && p.last_name.toLowerCase().includes(lowerSearch))
      );
    }

    // Status Filter
    if (statusFilter.length > 0) {
      result = result.filter(p => statusFilter.includes(p.status));
    }

    // Method Filter
    if (methodFilter.length > 0) {
      result = result.filter(p => methodFilter.includes(p.payment_method));
    }

    // Sorting
    result.sort((a, b) => {
      let aVal: any = a[sortConfig.key as keyof Payment];
      let bVal: any = b[sortConfig.key as keyof Payment];

      if (sortConfig.key === 'studentName') {
        aVal = `${a.first_name} ${a.last_name}`.toLowerCase();
        bVal = `${b.first_name} ${b.last_name}`.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [payments, searchTerm, statusFilter, methodFilter, sortConfig]);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedPayments.slice(start, start + rowsPerPage);
  }, [filteredAndSortedPayments, currentPage, rowsPerPage]);

  const handleRefresh = () => {
    fetchPayments();
    toast.success("Refreshing data...");
  };

  const handleSelectAll = () => setSelected(selected.length === filteredAndSortedPayments.length ? [] : filteredAndSortedPayments.map(t => t.id));
  const handleToggle = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await financeService.deletePayment(id);
        toast.success('Invoice deleted successfully');
        fetchPayments();
      } catch (error) {
        toast.error('Failed to delete invoice');
      }
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-10 py-6 md:py-10 bg-gray-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Controls */}
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
            <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Download size={20} strokeWidth={1.5} />Export</button>
            <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Upload size={20} strokeWidth={1.5} />Import</button>
            <button onClick={() => { setSelectedPayment(null); setShowModal(true); }} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 font-medium"><Plus size={20} />Create Invoice</button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
        </div>

        {/* Table Controls */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#99a1af] focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                  <Filter size={20} strokeWidth={1.5} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-gray-100">
                <div className="space-y-4">
                  <h3 className="font-bold text-[#0e042f] mb-2 uppercase text-[11px] tracking-wider text-gray-400">Status</h3>
                  {['paid', 'pending', 'overdue', 'refunded'].map(status => (
                    <label key={status} className="flex items-center gap-3 cursor-pointer group">
                      <CustomCheckbox
                        checked={statusFilter.includes(status)}
                        onChange={() => setStatusFilter(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status])}
                      />
                      <span className="text-sm text-gray-700 capitalize group-hover:text-indigo-600 transition-colors">{status}</span>
                    </label>
                  ))}
                  <div className="h-px bg-gray-100 my-2" />
                  <button onClick={() => { setStatusFilter([]); setMethodFilter([]); }} className="text-xs text-indigo-600 font-semibold hover:underline">Clear all filters</button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Sort Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                  <ArrowUpDown size={20} strokeWidth={1.5} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-gray-100">
                <div className="space-y-2">
                  <h3 className="font-bold text-[#0e042f] mb-2 uppercase text-[11px] tracking-wider text-gray-400">Sort By</h3>
                  {[
                    { key: 'created_at', label: 'Recently Added' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'due_date', label: 'Due Date' },
                    { key: 'studentName', label: 'Student Name' }
                  ].map(option => (
                    <button
                      key={option.key}
                      onClick={() => setSortConfig({ key: option.key as any, direction: sortConfig.key === option.key && sortConfig.direction === 'desc' ? 'asc' : 'desc' })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${sortConfig.key === option.key ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {option.label}
                      {sortConfig.key === option.key && (sortConfig.direction === 'asc' ? <ChevronLeft className="rotate-90" size={14} /> : <ChevronRight className="rotate-90" size={14} />)}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Columns Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                  <Columns size={20} strokeWidth={1.5} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-gray-100">
                <div className="space-y-3">
                  <h3 className="font-bold text-[#0e042f] mb-2 uppercase text-[11px] tracking-wider text-gray-400">Visible Columns</h3>
                  {[
                    { key: 'transactionId', label: 'Invoice ID' },
                    { key: 'date', label: 'Date' },
                    { key: 'studentName', label: 'Student' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'type', label: 'Type' },
                    { key: 'method', label: 'Method' },
                    { key: 'status', label: 'Status' }
                  ].map(col => (
                    <label key={col.key} className="flex items-center gap-3 cursor-pointer group">
                      <CustomCheckbox
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => setVisibleColumns(prev => prev.includes(col.key) ? prev.filter(c => c !== col.key) : [...prev, col.key])}
                      />
                      <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">{col.label}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="w-12 px-6 py-4 text-left"><CustomCheckbox checked={selected.length === filteredAndSortedPayments.length && filteredAndSortedPayments.length > 0} partial={selected.length > 0 && selected.length < filteredAndSortedPayments.length} onChange={handleSelectAll} /></th>
                  {visibleColumns.includes('transactionId') && <th className="px-6 py-4 text-left text-[11px] font-bold text-[#99a1af] uppercase tracking-wider">Invoice ID</th>}
                  {visibleColumns.includes('date') && <th className="px-6 py-4 text-left text-[11px] font-bold text-[#99a1af] uppercase tracking-wider">Date</th>}
                  {visibleColumns.includes('studentName') && <th className="px-6 py-4 text-left text-[11px] font-bold text-[#99a1af] uppercase tracking-wider">Student</th>}
                  {visibleColumns.includes('amount') && <th className="px-6 py-4 text-left text-[11px] font-bold text-[#99a1af] uppercase tracking-wider">Amount</th>}
                  {visibleColumns.includes('type') && <th className="px-6 py-4 text-left text-[11px] font-bold text-[#99a1af] uppercase tracking-wider">Type</th>}
                  {visibleColumns.includes('method') && <th className="px-6 py-4 text-left text-[11px] font-bold text-[#99a1af] uppercase tracking-wider">Method</th>}
                  {visibleColumns.includes('status') && <th className="px-6 py-4 text-left text-[11px] font-bold text-[#99a1af] uppercase tracking-wider">Status</th>}
                  {visibleColumns.includes('actions') && <th className="px-6 py-4 text-right text-[11px] font-bold text-[#99a1af] uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={visibleColumns.length + 1} className="px-6 py-20 text-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-gray-500 animate-pulse">Loading financial records...</p></td></tr>
                ) : paginatedPayments.length === 0 ? (
                  <tr><td colSpan={visibleColumns.length + 1} className="px-6 py-20 text-center"><div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><Search size={24} className="text-gray-300" /></div><p className="text-[#0e042f] font-bold text-lg mb-1">No invoices found</p><p className="text-gray-500">Try adjusting your search or filters</p></td></tr>
                ) : paginatedPayments.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4"><CustomCheckbox checked={selected.includes(t.id)} onChange={() => handleToggle(t.id)} /></td>
                    {visibleColumns.includes('transactionId') && <td className="px-6 py-4"><span className="text-[14px] font-bold text-[#0e042f]">{t.invoice_number}</span></td>}
                    {visibleColumns.includes('date') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{format(new Date(t.created_at), 'MMM d, yyyy')}</span></td>}
                    {visibleColumns.includes('studentName') && <td className="px-6 py-4 text-[14px] text-gray-700">{t.first_name} {t.last_name}</td>}
                    {visibleColumns.includes('amount') && <td className="px-6 py-4"><span className="text-[14px] font-bold text-indigo-600">{t.currency} {Number(t.amount).toFixed(2)}</span></td>}
                    {visibleColumns.includes('type') && <td className="px-6 py-4 text-[14px] text-gray-700">{t.description}</td>}
                    {visibleColumns.includes('method') && <td className="px-6 py-4 text-[12px] font-medium text-gray-600">{t.payment_method}</td>}
                    {visibleColumns.includes('status') && <td className="px-6 py-4"><StatusBadge status={t.status} /></td>}
                    {visibleColumns.includes('actions') && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setSelectedPayment(t); setShowModal(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Edit3 size={18} /></button>
                          <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-transparent border-none text-sm font-semibold text-[#0e042f] focus:ring-0 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-500 ml-4">
                {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, filteredAndSortedPayments.length)} of {filteredAndSortedPayments.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-gray-200 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:shadow-none transition-all"
              ><ChevronLeft size={18} /></button>
              <div className="flex gap-1">
                {Array.from({ length: Math.ceil(filteredAndSortedPayments.length / rowsPerPage) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${currentPage === page ? 'bg-[#0e042f] text-white shadow-lg shadow-indigo-900/20' : 'hover:bg-white text-gray-500 hover:text-[#0e042f]'}`}
                  >{page}</button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredAndSortedPayments.length / rowsPerPage), prev + 1))}
                disabled={currentPage === Math.ceil(filteredAndSortedPayments.length / rowsPerPage) || filteredAndSortedPayments.length === 0}
                className="p-2 rounded-xl border border-gray-200 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:shadow-none transition-all"
              ><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      <FinanceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={fetchPayments}
        payment={selectedPayment}
      />

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Transactions"
        totalCount={payments.length}
        selectedCount={selected.length}
        columns={[
          { id: 'payment_id', label: 'Payment ID', defaultSelected: true },
          { id: 'created_at', label: 'Date', defaultSelected: true },
          { id: 'first_name', label: 'First Name', defaultSelected: true },
          { id: 'last_name', label: 'Last Name', defaultSelected: true },
          { id: 'amount', label: 'Amount', defaultSelected: true },
          { id: 'status', label: 'Status', defaultSelected: true }
        ]}
        supportsDateRange={true}
        onExport={async () => { toast.success("Exporting..."); }}
      />
    </div>
  );
};

export default FinanceOverviewPage;