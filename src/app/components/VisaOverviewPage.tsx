import React, { useState } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, ArrowDown, Search, Copy, Printer, Archive, Edit, Check, Columns, Eye, Power, Globe, Users, FileText, Award, Briefcase, TrendingUp } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';

interface CustomCheckboxProps { checked: boolean; partial?: boolean; onChange: () => void; }
const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, partial = false, onChange }) => (<div onClick={onChange} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'}`}>{checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}{partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}</div>);

interface StatusBadgeProps { status: 'active' | 'inactive'; }
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = { 'active': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Active' }, 'inactive': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', label: 'Inactive' } }[status];
  return (<span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>{config.label}</span>);
};

interface MetricCardProps { title: string; value: string; icon: React.ElementType; bgClass: string; colorClass: string; tooltip: string; }
const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
    <div className="flex items-center justify-between"><span className="text-[#253154] font-medium text-[15px]">{title}</span><TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors">i</div></TooltipTrigger><TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2"><p>{tooltip}</p></TooltipContent></Tooltip></TooltipProvider></div>
    <div className="flex items-end gap-3 mt-2"><div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}><Icon size={22} strokeWidth={1.5} /></div><div><p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p></div></div>
    <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500"><Icon size={80} /></div>
  </div>
);

interface Visa { id: string; visaType: string; category: string; countries: number; status: 'active' | 'inactive'; studentVisible: boolean; processingDifficulty: string; workRights: boolean; highApproval: boolean; popularity: number; lastUpdated: string; }

export const VisaOverviewPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [selectedVisas, setSelectedVisas] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'type', 'category', 'countries', 'status', 'difficulty', 'visible']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const visas: Visa[] = [
    { id: 'VIS-5201', visaType: 'Student Visa (F-1)', category: 'Study', countries: 1, status: 'active', studentVisible: true, processingDifficulty: 'Medium', workRights: true, highApproval: true, popularity: 8934, lastUpdated: '3 hours ago' },
    { id: 'VIS-5202', visaType: 'Tier 4 Student Visa', category: 'Study', countries: 1, status: 'active', studentVisible: true, processingDifficulty: 'Medium', workRights: true, highApproval: true, popularity: 6543, lastUpdated: '1 day ago' },
    { id: 'VIS-5203', visaType: 'Subclass 500', category: 'Study', countries: 1, status: 'active', studentVisible: true, processingDifficulty: 'Low', workRights: true, highApproval: true, popularity: 5432, lastUpdated: '2 hours ago' },
    { id: 'VIS-5204', visaType: 'Study Permit', category: 'Study', countries: 1, status: 'active', studentVisible: true, processingDifficulty: 'Low', workRights: true, highApproval: true, popularity: 4987, lastUpdated: '5 hours ago' },
    { id: 'VIS-5205', visaType: 'National Visa (D)', category: 'Study', countries: 1, status: 'inactive', studentVisible: false, processingDifficulty: 'High', workRights: false, highApproval: false, popularity: 2134, lastUpdated: '2 weeks ago' },
  ];

  const metrics = [
    { title: 'Visa Types Supported', value: '67', icon: FileText, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total visa types available in system' },
    { title: 'Active Visa Rules', value: '234', icon: Award, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Currently active visa processing rules' },
    { title: 'Countries Enabled', value: '52', icon: Globe, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Countries with visa pathways enabled' },
    { title: 'High Approval Pathways', value: '45', icon: TrendingUp, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Visa pathways with high approval rates' }
  ];

  const allColumns = [
    { key: 'id', label: 'Reference ID' }, { key: 'type', label: 'Visa Type' }, { key: 'category', label: 'Category' }, { key: 'countries', label: 'Countries' },
    { key: 'status', label: 'Status' }, { key: 'difficulty', label: 'Difficulty' }, { key: 'workRights', label: 'Work Rights' }, { key: 'visible', label: 'Visible' }, { key: 'popularity', label: 'Popularity' }
  ];

  const exportColumns: ExportColumn[] = [
    { id: 'referenceId', label: 'Reference ID', defaultSelected: true }, { id: 'visaType', label: 'Visa Type', defaultSelected: true },
    { id: 'category', label: 'Category', defaultSelected: true }, { id: 'countries', label: 'Countries', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true }, { id: 'processingDifficulty', label: 'Processing Difficulty', defaultSelected: false },
    { id: 'workRights', label: 'Work Rights Included', defaultSelected: false }, { id: 'highApproval', label: 'High Approval', defaultSelected: false }
  ];

  const importFields: ImportField[] = [
    { id: 'referenceId', label: 'Reference ID', required: false, type: 'text' }, { id: 'visaType', label: 'Visa Type', required: true, type: 'text' },
    { id: 'category', label: 'Category', required: true, type: 'select', options: ['Study', 'Work', 'Dependent'] },
    { id: 'countries', label: 'Countries', required: true, type: 'text' }, { id: 'status', label: 'Status', required: false, type: 'select', options: ['Active', 'Inactive'] },
    { id: 'processingDifficulty', label: 'Processing Difficulty', required: false, type: 'select', options: ['Low', 'Medium', 'High'] },
    { id: 'workRights', label: 'Work Rights Included', required: false, type: 'select', options: ['Yes', 'No'] }
  ];

  const handleExport = async (options: any) => { toast.success(`Exporting ${options.scope} visa records as ${options.format.toUpperCase()}`); await new Promise(r => setTimeout(r, 2000)); };
  const handleImport = async (data: any[], mode: any) => { toast.success(`Successfully imported ${data.length} visa records`); };

  return (
    <TooltipProvider><div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">
      <div className="hidden md:flex justify-between items-center gap-4 mb-8">
        <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
          <Popover><PopoverTrigger asChild><button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"><CalendarIcon size={20} className="text-[#253154]" /><span className="font-medium text-[#253154] text-[14px]">{date?.from && date?.to ? `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}` : 'Select date range'}</span></button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><CalendarComponent initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} /></PopoverContent></Popover>
          <div className="w-px h-4 bg-gray-200 mx-2" /><button className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500"><RefreshCw size={20} className="text-[#253154]" /></button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Download size={20} strokeWidth={1.5} />Export</button>
          <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Upload size={20} strokeWidth={1.5} />Import</button>
          <button className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"><Plus size={20} strokeWidth={1.5} />Add Visa Type</button>
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">{metrics.map((m, i) => <MetricCard key={i} {...m} />)}</div>
      <div className="block lg:hidden mb-14 -mx-4"><Slider dots infinite={false} speed={500} slidesToShow={1.1} slidesToScroll={1} arrows={false} centerMode centerPadding='20px'>{metrics.map((m, i) => <div key={i} className="px-2 py-2"><MetricCard {...m} /></div>)}</Slider></div>

      <div className="hidden md:flex justify-between items-center gap-4 mb-6">
        <div className="relative flex-1"><Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" /><input type="text" placeholder="Search by visa type, category, reference ID" className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" /></div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><Filter size={20} strokeWidth={1.5} /></button>
          <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><ArrowUpDown size={20} strokeWidth={1.5} /></button>
          <button className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><Columns size={20} strokeWidth={1.5} /></button>
          <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><MoreHorizontal size={20} strokeWidth={1.5} /></button>
        </div>
      </div>

      {selectedVisas.length > 0 && (<div className="bg-purple-50 px-6 py-3 flex items-center justify-between text-sm border-b border-purple-100 mb-6 rounded-t-2xl"><span className="text-purple-900 font-medium">{selectedVisas.length} visa{selectedVisas.length !== 1 ? 's' : ''} selected</span><button onClick={() => setSelectedVisas([])} className="text-purple-700 font-bold hover:underline">Clear</button></div>)}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100">
              <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12"><CustomCheckbox checked={selectedVisas.length === visas.length} partial={selectedVisas.length > 0 && selectedVisas.length < visas.length} onChange={() => setSelectedVisas(selectedVisas.length === visas.length ? [] : visas.map(v => v.id))} /></th>
              {visibleColumns.includes('id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Reference ID</th>}
              {visibleColumns.includes('type') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visa Type</th>}
              {visibleColumns.includes('category') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Category</th>}
              {visibleColumns.includes('countries') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Countries</th>}
              {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Status</th>}
              {visibleColumns.includes('difficulty') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Difficulty</th>}
              {visibleColumns.includes('workRights') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Work Rights</th>}
              {visibleColumns.includes('visible') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visible</th>}
              <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {visas.map((visa) => (
                <tr
                  key={visa.id}
                  onClick={(e) => {
                    // Don't navigate if clicking on checkbox or actions button
                    const target = e.target as HTMLElement;
                    if (!target.closest('td:first-child') && !target.closest('td:last-child')) {
                      onNavigate?.('visa-provider-detail');
                    }
                  }}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedVisas.includes(visa.id) ? 'bg-purple-50/30' : ''}`}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <CustomCheckbox checked={selectedVisas.includes(visa.id)} onChange={() => setSelectedVisas(prev => prev.includes(visa.id) ? prev.filter(x => x !== visa.id) : [...prev, visa.id])} />
                  </td>
                  {visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{visa.id}</td>}
                  {visibleColumns.includes('type') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{visa.visaType}</td>}
                  {visibleColumns.includes('category') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{visa.category}</td>}
                  {visibleColumns.includes('countries') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{visa.countries}</td>}
                  {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={visa.status} /></td>}
                  {visibleColumns.includes('difficulty') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{visa.processingDifficulty}</td>}
                  {visibleColumns.includes('workRights') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{visa.workRights ? 'Yes' : 'No'}</td>}
                  {visibleColumns.includes('visible') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{visa.studentVisible ? 'Yes' : 'No'}</td>}
                  <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <MoreHorizontal size={18} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 rounded-tr-[30px] shadow-[0px_-5px_25px_rgba(0,0,0,0.03)] relative z-20 border-t border-gray-50">
          <div className="flex items-center gap-2"><span className="text-gray-500 text-sm font-medium">Rows per page:</span><button className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-gray-700">{rowsPerPage}<ChevronDown size={14} className="text-gray-400" /></button></div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"><ChevronLeft size={18} strokeWidth={2} className="text-gray-500" /></button>
            <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"><ChevronRight size={18} strokeWidth={2} className="text-gray-500" /></button>
          </div>
        </div>
      </div>
    </div>

      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Visa" totalCount={234} selectedCount={selectedVisas.length} columns={exportColumns} supportsDateRange={false} onExport={handleExport} />
      <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Visa" fields={importFields} onImport={handleImport} templateUrl="/templates/visa-import-template.xlsx" allowUpdate={true} />
    </TooltipProvider>
  );
};