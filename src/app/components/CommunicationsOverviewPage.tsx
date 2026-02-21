import React, { useState } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check, Columns, Mail, Send, MessageSquare, CheckCircle, Clock, Info, Settings as SettingsIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';

const CustomCheckbox: React.FC<{ checked: boolean; partial?: boolean; onChange: () => void }> = ({ checked, partial = false, onChange }) => (
  <div onClick={onChange} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
    {checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}
    {partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}
  </div>
);

const StatusBadge: React.FC<{ status: 'sent' | 'delivered' | 'read' | 'failed' }> = ({ status }) => {
  const config = { sent: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', label: 'Sent' }, delivered: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', label: 'Delivered' }, read: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Read' }, failed: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'Failed' } }[status];
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

interface Communication { id: string; commId: string; dateSent: string; recipient: string; channel: string; subject: string; status: 'sent' | 'delivered' | 'read' | 'failed'; }

interface CommunicationsOverviewPageProps {
  onNavigate?: (page: string) => void;
  onEditCampaign?: (campaignId: string) => void;
}

const CommunicationsOverviewPage: React.FC<CommunicationsOverviewPageProps> = ({ onNavigate, onEditCampaign }) => {
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) });
  const [selected, setSelected] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['commId', 'dateSent', 'recipient', 'channel', 'subject', 'status']);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const comms: Communication[] = [
    { id: 'COM-001', commId: 'COM-001', dateSent: '2025-01-15T10:00:00', recipient: 'john.doe@email.com', channel: 'Email', subject: 'Application Status Update', status: 'read' },
    { id: 'COM-002', commId: 'COM-002', dateSent: '2025-01-16T11:30:00', recipient: 'jane.smith@email.com', channel: 'SMS', subject: 'Appointment Reminder', status: 'delivered' },
    { id: 'COM-003', commId: 'COM-003', dateSent: '2025-01-17T14:20:00', recipient: 'mike.wilson@email.com', channel: 'Email', subject: 'Document Request', status: 'sent' },
    { id: 'COM-004', commId: 'COM-004', dateSent: '2025-01-18T09:15:00', recipient: 'sarah.johnson@email.com', channel: 'WhatsApp', subject: 'Visa Interview Tips', status: 'read' },
    { id: 'COM-005', commId: 'COM-005', dateSent: '2025-01-19T16:45:00', recipient: 'alex.brown@email.com', channel: 'Email', subject: 'Payment Confirmation', status: 'failed' },
  ];

  const metrics = [
    { title: 'Total Sent', value: '1,248', icon: Send, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total communications sent in period' },
    { title: 'Emails', value: '856', icon: Mail, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Email communications sent' },
    { title: 'Messages', value: '392', icon: MessageSquare, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'SMS and WhatsApp messages' },
    { title: 'Delivered', value: '1,186', icon: CheckCircle, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Successfully delivered communications' },
    { title: 'Pending', value: '62', icon: Clock, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Communications pending delivery' }
  ];

  const handleRefresh = () => toast.success("Refreshing data...");
  const handleSelectAll = () => setSelected(selected.length === comms.length ? [] : comms.map(c => c.id));
  const handleToggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const exportColumns: ExportColumn[] = [
    { id: 'commId', label: 'Communication ID', defaultSelected: true },
    { id: 'dateSent', label: 'Date Sent', defaultSelected: true },
    { id: 'recipient', label: 'Recipient', defaultSelected: true },
    { id: 'channel', label: 'Channel', defaultSelected: true },
    { id: 'subject', label: 'Subject', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true }
  ];

  const importFields: ImportField[] = [
    { id: 'commId', label: 'Communication ID', required: true, type: 'text' },
    { id: 'dateSent', label: 'Date Sent', required: true, type: 'date' },
    { id: 'recipient', label: 'Recipient', required: true, type: 'text' },
    { id: 'channel', label: 'Channel', required: true, type: 'select', options: ['Email', 'SMS', 'WhatsApp', 'Push'] },
    { id: 'subject', label: 'Subject', required: true, type: 'text' },
    { id: 'status', label: 'Status', required: true, type: 'select', options: ['sent', 'delivered', 'read', 'failed'] }
  ];

  const handleExport = async (options: any) => {
    toast.success(`Exporting ${options.scope} communications as ${options.format}...`);
  };

  const handleImport = async (data: any) => {
    toast.success(`Importing ${data.length} communications...`);
  };

  const handleNewMessage = () => {
    if (onNavigate) {
      onNavigate('create-message');
    }
  };

  const handleEditCampaign = (campaignId: string) => {
    if (onEditCampaign && onNavigate) {
      onEditCampaign(campaignId);
      onNavigate('edit-message');
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-10 py-6 md:py-10 bg-gray-50 min-h-screen">

      <div className="max-w-[1600px] mx-auto">
        <div className="hidden md:flex justify-between items-center gap-4 mb-8">
          <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
            <Popover><PopoverTrigger asChild><button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"><CalendarIcon size={20} className="text-[#253154]" /><span className="font-medium text-[#253154] text-[14px]">{date?.from && date?.to ? `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}` : 'Select date range'}</span></button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><CalendarComponent initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} /></PopoverContent></Popover>
            <div className="w-px h-4 bg-gray-200 mx-2" />
            <button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500"><RefreshCw size={20} className="text-[#253154]" /></button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Download size={20} strokeWidth={1.5} />Export</button>
            <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Upload size={20} strokeWidth={1.5} />Import</button>
            <button onClick={handleNewMessage} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"><Plus size={20} strokeWidth={1.5} />New Message</button>
          </div>
        </div>

        <div className="flex md:hidden flex-col gap-4 mb-6">
          <div className="w-full h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-between px-5">
            <div className="flex items-center gap-3"><CalendarIcon size={18} className="text-[#253154]" /><span className="text-sm font-medium text-[#253154]">{date?.from && date?.to ? `${format(date.from, 'd MMM')} - ${format(date.to, 'd MMM')}` : 'Select range'}</span></div>
            <button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-full transition-colors active:rotate-180 active:duration-500"><RefreshCw size={18} className="text-[#253154]" /></button>
          </div>
          <div className="flex gap-3">
            <button onClick={handleNewMessage} className="flex-1 h-[50px] bg-[#0e042f] text-white rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 font-medium"><Plus size={20} />New Message</button>
            <button className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center"><MoreHorizontal size={22} className="text-[#253154]" /></button>
          </div>
        </div>

        {/* Info Banner - Global Settings Link */}
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

        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">{metrics.map((m, i) => <MetricCard key={i} {...m} />)}</div>
        <div className="block lg:hidden mb-14 -mx-4"><Slider dots={false} infinite={false} speed={500} slidesToShow={5} slidesToScroll={1} arrows={true} responsive={[{ breakpoint: 1536, settings: { slidesToShow: 4 } }, { breakpoint: 1280, settings: { slidesToShow: 3 } }, { breakpoint: 1024, settings: { slidesToShow: 2 } }, { breakpoint: 640, settings: { slidesToShow: 1 } }]}>{metrics.map((m, i) => <div key={i} className="px-2 py-2"><MetricCard {...m} /></div>)}</Slider></div>

        <div className="hidden md:flex justify-between items-center gap-4 mb-6">
          <div className="relative flex-1"><Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" /><input type="text" placeholder="Search communications..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" /></div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"><Filter size={20} strokeWidth={1.5} /></button>
            <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"><ArrowUpDown size={20} strokeWidth={1.5} /></button>
            <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"><Columns size={20} strokeWidth={1.5} /></button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="w-12 px-6 py-4 text-left"><CustomCheckbox checked={selected.length === comms.length} partial={selected.length > 0 && selected.length < comms.length} onChange={handleSelectAll} /></th>
                  {visibleColumns.includes('commId') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Comm ID</th>}
                  {visibleColumns.includes('dateSent') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date Sent</th>}
                  {visibleColumns.includes('recipient') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Recipient</th>}
                  {visibleColumns.includes('channel') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Channel</th>}
                  {visibleColumns.includes('subject') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Subject</th>}
                  {visibleColumns.includes('status') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comms.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => handleEditCampaign(c.id)}
                  >
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CustomCheckbox checked={selected.includes(c.id)} onChange={() => handleToggle(c.id)} />
                    </td>
                    {visibleColumns.includes('commId') && <td className="px-6 py-4"><span className="text-[14px] font-bold text-[#253154]">{c.commId}</span></td>}
                    {visibleColumns.includes('dateSent') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{format(new Date(c.dateSent), 'MMM d, yyyy h:mm a')}</span></td>}
                    {visibleColumns.includes('recipient') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{c.recipient}</span></td>}
                    {visibleColumns.includes('channel') && <td className="px-6 py-4"><span className="text-[12px] font-medium text-gray-600">{c.channel}</span></td>}
                    {visibleColumns.includes('subject') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{c.subject}</span></td>}
                    {visibleColumns.includes('status') && <td className="px-6 py-4"><StatusBadge status={c.status} /></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 flex items-center gap-2">10<ChevronDown size={14} /></button>
              <span className="text-sm text-gray-600 ml-4">1-{Math.min(10, comms.length)} of {comms.length}</span>
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
        moduleName="Communications"
        totalCount={comms.length}
        selectedCount={selected.length}
        columns={exportColumns}
        supportsDateRange={true}
        onExport={handleExport}
      />
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Communications"
        fields={importFields}
        onImport={handleImport}
        allowUpdate={true}
      />
    </div>
  );
};

export default CommunicationsOverviewPage;