import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal,
  Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check,
  Mail, Send, MessageSquare, CheckCircle, Clock, Info, Settings as SettingsIcon,
  Trash2, Edit3, MessageCircle
} from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { ExportDialog, ExportOptions } from './common/ExportDialog';
import { ImportDialog, ImportField, ImportMode } from './common/ImportDialog';
import { communicationService, Communication, CommunicationFormData } from '@/services/communicationService';
import { CommunicationModal } from './CommunicationModal';

interface CustomCheckboxProps {
  checked: boolean;
  partial?: boolean;
  onChange: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, partial = false, onChange }) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      onChange();
    }}
    className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'
      }`}
  >
    {checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}
    {partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = status?.toLowerCase() || 'sent';
  const config: any = {
    sent: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', label: 'Sent' },
    delivered: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', label: 'Delivered' },
    read: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Read' },
    failed: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'Failed' }
  }[s] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', label: status };

  return (
    <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; bgClass: string; colorClass: string }> = ({ title, value, icon: Icon, bgClass, colorClass }) => (
  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all group flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl ${bgClass} ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform`}>
      <Icon size={28} />
    </div>
    <div>
      <div className="text-[32px] font-bold text-[#0f172b] leading-none mb-1">{value}</div>
      <div className="text-[14px] font-medium text-gray-400 capitalize">{title}</div>
    </div>
  </div>
);

interface CommunicationsOverviewPageProps {
  onNavigate?: (page: string) => void;
  onEditCampaign?: (campaignId: string) => void;
}

const CommunicationsOverviewPage: React.FC<CommunicationsOverviewPageProps> = ({ onNavigate, onEditCampaign }) => {
  const [comms, setComms] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [channelFilter, setChannelFilter] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>();
  const [sortConfig, setSortConfig] = useState<{ key: keyof Communication; direction: 'asc' | 'desc' } | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['commId', 'dateSent', 'recipient', 'channel', 'subject', 'status']);

  const fetchCommunications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await communicationService.getAllCommunications();
      setComms(data || []);
    } catch (error) {
      toast.error('Failed to fetch communications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunications();
  }, [fetchCommunications]);

  const handleRefresh = () => {
    fetchCommunications();
    toast.success('Communications refreshed');
  };

  const filteredComms = useMemo(() => {
    let result = [...comms];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.sender.toLowerCase().includes(term) ||
        (c.subject || '').toLowerCase().includes(term) ||
        c.content.toLowerCase().includes(term)
      );
    }

    if (statusFilter.length > 0) {
      result = result.filter(c => statusFilter.includes(c.status.toLowerCase()));
    }

    if (channelFilter.length > 0) {
      result = result.filter(c => channelFilter.includes(c.type.toLowerCase()));
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [comms, searchTerm, statusFilter, channelFilter, sortConfig]);

  const totalPages = Math.ceil(filteredComms.length / rowsPerPage);
  const paginatedComms = filteredComms.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(paginatedComms.map(c => c.id));
    } else {
      setSelected([]);
    }
  };

  const handleToggle = (checked: boolean, id: number) => {
    if (checked) {
      setSelected(prev => [...prev, id]);
    } else {
      setSelected(prev => prev.filter(x => x !== id));
    }
  };

  const toggleSort = (key: keyof Communication) => {
    setSortConfig(current => {
      if (current?.key === key && current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const columns = [
    { id: 'commId', label: 'Comm ID', key: 'id' },
    { id: 'dateSent', label: 'Date Sent', key: 'created_at' },
    { id: 'recipient', label: 'Sender', key: 'sender' },
    { id: 'channel', label: 'Channel', key: 'type' },
    { id: 'subject', label: 'Subject', key: 'subject' },
    { id: 'status', label: 'Status', key: 'status' }
  ];

  const channelOptions = Array.from(new Set(comms.map(c => c.type.toLowerCase()))).filter(Boolean);

  const metrics = [
    { title: 'Total Sent', value: comms.length, icon: Send, bgClass: 'bg-blue-50', colorClass: 'text-blue-600' },
    { title: 'Emails', value: comms.filter(c => c.type === 'Email').length, icon: Mail, bgClass: 'bg-indigo-50', colorClass: 'text-indigo-600' },
    { title: 'Messages', value: comms.filter(c => c.type !== 'Email').length, icon: MessageSquare, bgClass: 'bg-purple-50', colorClass: 'text-purple-600' },
    { title: 'Delivered', value: comms.filter(c => c.status === 'delivered' || c.status === 'read').length, icon: CheckCircle, bgClass: 'bg-emerald-50', colorClass: 'text-emerald-600' },
    { title: 'Failed', value: comms.filter(c => c.status === 'failed').length, icon: Clock, bgClass: 'bg-red-50', colorClass: 'text-red-600' }
  ];

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this communication log?')) {
      try {
        await communicationService.deleteCommunication(id);
        toast.success('Communication log deleted');
        fetchCommunications();
      } catch (error) {
        toast.error('Failed to delete communication');
      }
    }
  };

  const handleOpenModal = (comm: Communication | null = null) => {
    setSelectedComm(comm);
    setShowCommunicationModal(true);
  };

  const handleSaveCommunication = async (data: CommunicationFormData) => {
    try {
      if (selectedComm) {
        await communicationService.updateCommunication(selectedComm.id, data);
      } else {
        await communicationService.createCommunication(data);
      }
      fetchCommunications();
    } catch (error) {
      console.error('Error saving communication:', error);
      throw error;
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-10 py-6 md:py-10 bg-gray-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        {/* Metrics Grid */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-center gap-4 mb-8">
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
            <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium">
              <Plus size={20} strokeWidth={1.5} />New Message
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                This module uses global settings configured under Settings → Communications & Campaigns.
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Email providers, sender identities, and delivery rules are managed centrally.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('settings-communications-campaigns')}
            className="flex items-center gap-2 px-4 h-9 rounded-lg bg-white text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <SettingsIcon size={16} />
            View Settings
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input
              type="text"
              placeholder="Search communications by sender, subject or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <button className={`h-[50px] min-w-[50px] bg-white border ${statusFilter.length > 0 || channelFilter.length > 0 ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-200'} rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center relative`}>
                  <Filter size={20} strokeWidth={1.5} />
                  {(statusFilter.length > 0 || channelFilter.length > 0) && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                      {statusFilter.length + channelFilter.length}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span>Status</span>
                      {(statusFilter.length > 0 || channelFilter.length > 0) && (
                        <button onClick={() => { setStatusFilter([]); setChannelFilter([]); }} className="text-purple-600 hover:text-purple-700 capitalize text-[10px] font-bold">Clear All</button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {['sent', 'delivered', 'read', 'failed'].map((opt) => (
                        <div key={opt} className="flex items-center justify-between">
                          <label className="text-[14px] text-[#253154] capitalize">{opt}</label>
                          <CustomCheckbox
                            checked={statusFilter.includes(opt)}
                            onChange={() => setStatusFilter(prev => prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt])}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Channel</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar-light pr-2">
                      {channelOptions.map((opt) => (
                        <div key={opt} className="flex items-center justify-between">
                          <label className="text-[14px] text-[#253154] capitalize">{opt}</label>
                          <CustomCheckbox
                            checked={channelFilter.includes(opt)}
                            onChange={() => setChannelFilter(prev => prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt])}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                  <ArrowUpDown size={20} strokeWidth={1.5} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 rounded-2xl shadow-xl border-gray-100" align="end">
                <div className="space-y-1">
                  {columns.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => toggleSort(col.key as keyof Communication)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${sortConfig?.key === col.key ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {col.label}
                      {sortConfig?.key === col.key && (sortConfig.direction === 'asc' ? <ChevronDown size={14} className="rotate-180" /> : <ChevronDown size={14} />)}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className={`h-[50px] min-w-[50px] bg-white border ${visibleColumns.length < columns.length ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-200'} rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center`}>
                  <Clock size={20} strokeWidth={1.5} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Show Columns</h4>
                <div className="space-y-2">
                  {columns.map((col) => (
                    <div key={col.id} className="flex items-center justify-between">
                      <label className="text-[14px] text-[#253154]">{col.label}</label>
                      <CustomCheckbox
                        checked={visibleColumns.includes(col.id)}
                        onChange={() => setVisibleColumns(prev => prev.includes(col.id) ? prev.filter(i => i !== col.id) : [...prev, col.id])}
                      />
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-indigo-900/5 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar-light">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-5 px-6 w-12 text-center items-center">
                    <div className="flex justify-center">
                      <CustomCheckbox
                        checked={selected.length === paginatedComms.length && paginatedComms.length > 0}
                        partial={selected.length > 0 && selected.length < paginatedComms.length}
                        onChange={() => handleSelectAll(selected.length !== paginatedComms.length)}
                      />
                    </div>
                  </th>
                  {columns.filter(c => visibleColumns.includes(c.id)).map(col => (
                    <th key={col.id} className="py-5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort(col.key as keyof Communication)}>
                        {col.label}
                        <ArrowUpDown size={14} className="text-gray-300" />
                      </div>
                    </th>
                  ))}
                  <th className="py-5 px-6 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedComms.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">
                        <CustomCheckbox
                          checked={selected.includes(c.id)}
                          onChange={() => handleToggle(!selected.includes(c.id), c.id)}
                        />
                      </div>
                    </td>
                    {visibleColumns.includes('commId') && (
                      <td className="py-4 px-4 text-sm font-medium text-indigo-600">COM-{c.id.toString().padStart(3, '0')}</td>
                    )}
                    {visibleColumns.includes('dateSent') && (
                      <td className="py-4 px-4 text-sm text-gray-600">{format(new Date(c.created_at), 'MMM d, yyyy h:mm a')}</td>
                    )}
                    {visibleColumns.includes('recipient') && (
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                            {c.sender.charAt(0)}
                          </div>
                          <div className="text-sm font-bold text-[#0f172b]">{c.sender}</div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.includes('channel') && (
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {c.type === 'Email' ? <Mail size={16} className="text-blue-500" /> :
                            c.type === 'SMS' ? <MessageSquare size={16} className="text-purple-500" /> :
                              c.type === 'WhatsApp' ? <MessageCircle size={16} className="text-emerald-500" /> :
                                <Send size={16} className="text-gray-500" />}
                          <span className="text-sm text-gray-600">{c.type}</span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.includes('subject') && (
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate font-medium">{c.subject || 'No Subject'}</div>
                        <div className="text-xs text-gray-400 max-w-xs truncate">{c.content}</div>
                      </td>
                    )}
                    {visibleColumns.includes('status') && (
                      <td className="py-4 px-4">
                        <StatusBadge status={c.status} />
                      </td>
                    )}
                    <td className="py-4 px-6 text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={20} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-1" align="end">
                          <button
                            onClick={() => handleOpenModal(c)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                          >
                            <Edit3 size={16} /> View Details
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} /> Delete Log
                          </button>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                ))}
                {paginatedComms.length === 0 && !loading && (
                  <tr>
                    <td colSpan={visibleColumns.length + 2} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <Mail size={32} className="text-gray-300" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#0f172b]">No communications found</h3>
                          <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Showing {Math.min(filteredComms.length, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(filteredComms.length, currentPage * rowsPerPage)} of {filteredComms.length} logs
              </span>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-500">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="text-sm font-bold text-[#0f172b] outline-none bg-transparent"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-[#253154] hover:bg-gray-50 disabled:opacity-50 transition-all font-bold"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 3 + i + 1;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${currentPage === pageNum ? 'bg-[#0e042f] text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-[#253154] hover:bg-gray-50 disabled:opacity-50 transition-all font-bold"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Communications"
        totalCount={comms.length}
        onExport={async (options: ExportOptions) => { toast.success(`Exporting as ${options.format}...`); }}
      />

      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Communications"
        fields={[
          { id: 'sender', label: 'Sender', required: true, type: 'text' },
          { id: 'type', label: 'Channel', required: true, type: 'text' },
          { id: 'status', label: 'Status', required: true, type: 'text' }
        ]}
        onImport={async (data: any[], mode: ImportMode) => { toast.success(`Importing ${data.length} logs using ${mode} mode...`); }}
      />

      <CommunicationModal
        isOpen={showCommunicationModal}
        onClose={() => setShowCommunicationModal(false)}
        onSave={handleSaveCommunication}
        communication={selectedComm}
      />
    </div>
  );
};

export default CommunicationsOverviewPage;