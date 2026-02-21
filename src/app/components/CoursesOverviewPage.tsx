import React, { useState } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check, Columns, BookOpen, GraduationCap, Users, TrendingUp } from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';

const CustomCheckbox: React.FC<{ checked: boolean; partial?: boolean; onChange: () => void }> = ({ checked, partial, onChange }) => (<div onClick={onChange} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial ? 'bg-white border-purple-600' : 'bg-white border-gray-300 hover:border-gray-400'}`}>{checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}{partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}</div>);
const StatusBadge: React.FC<{ status: 'active' | 'inactive' }> = ({ status }) => {
  const c = { 'active': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Active' }, 'inactive': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300', label: 'Inactive' } }[status];
  return (<span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${c.bg} ${c.text} ${c.border}`}>{c.label}</span>);
};
const MetricCard: React.FC<{ title: string; value: string; icon: React.ElementType; bgClass: string; colorClass: string; tooltip: string }> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
    <div className="flex items-center justify-between"><span className="text-[#253154] font-medium text-[15px]">{title}</span><TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help">i</div></TooltipTrigger><TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2"><p>{tooltip}</p></TooltipContent></Tooltip></TooltipProvider></div>
    <div className="flex items-end gap-3 mt-2"><div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}><Icon size={22} strokeWidth={1.5} /></div><div><p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p></div></div>
    <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500"><Icon size={80} /></div>
  </div>
);

interface Course { id: string; provider: string; courseName: string; category: string; countries: number; status: 'active' | 'inactive'; studentVisible: boolean; duration: string; certified: boolean; popularity: number; }

interface CoursesOverviewPageProps {
  onNavigate?: (page: string, context?: any) => void;
}

export const CoursesOverviewPage: React.FC<CoursesOverviewPageProps> = ({ onNavigate }) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'provider', 'courseName', 'category', 'countries', 'status', 'visible']);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const items: Course[] = [
    { id: 'CRS-1501', provider: 'Coursera for Campus', courseName: 'Data Science Fundamentals', category: 'Technology', countries: 195, status: 'active', studentVisible: true, duration: '8 weeks', certified: true, popularity: 9876 },
    { id: 'CRS-1502', provider: 'Udemy for Students', courseName: 'Business Analytics', category: 'Business', countries: 195, status: 'active', studentVisible: true, duration: '6 weeks', certified: true, popularity: 8765 },
    { id: 'CRS-1503', provider: 'edX Student Access', courseName: 'Introduction to AI', category: 'Technology', countries: 195, status: 'active', studentVisible: true, duration: '10 weeks', certified: true, popularity: 7654 },
    { id: 'CRS-1504', provider: 'LinkedIn Learning', courseName: 'Digital Marketing', category: 'Marketing', countries: 100, status: 'active', studentVisible: false, duration: '4 weeks', certified: false, popularity: 6543 },
  ];

  const metrics = [
    { title: 'Course Platforms', value: '12', icon: BookOpen, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total online course platforms' },
    { title: 'Available Courses', value: '1.2k', icon: GraduationCap, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Total courses available to students' },
    { title: 'Active Learners', value: '3.4k', icon: Users, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Students actively taking courses' },
    { title: 'Completion Rate', value: '78%', icon: TrendingUp, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Average course completion rate' }
  ];

  const exportColumns: ExportColumn[] = [{ id: 'referenceId', label: 'Reference ID', defaultSelected: true }, { id: 'provider', label: 'Provider', defaultSelected: true }, { id: 'courseName', label: 'Course Name', defaultSelected: true }, { id: 'category', label: 'Category', defaultSelected: true }, { id: 'countries', label: 'Countries', defaultSelected: true }, { id: 'status', label: 'Status', defaultSelected: true }];
  const importFields: ImportField[] = [{ id: 'referenceId', label: 'Reference ID', required: false, type: 'text' }, { id: 'provider', label: 'Provider', required: true, type: 'text' }, { id: 'courseName', label: 'Course Name', required: true, type: 'text' }, { id: 'category', label: 'Category', required: true, type: 'select', options: ['Technology', 'Business', 'Marketing', 'Design', 'Science'] }, { id: 'status', label: 'Status', required: false, type: 'select', options: ['Active', 'Inactive'] }];

  const handleExport = async (options: any) => { toast.success(`Exporting ${options.scope} records as ${options.format.toUpperCase()}`); await new Promise(r => setTimeout(r, 2000)); };
  const handleImport = async (data: any[]) => { toast.success(`Successfully imported ${data.length} records`); };

  // Handler for row click - navigate to course detail page
  const handleRowClick = (courseId: string, courseName: string) => {
    if (onNavigate) {
      onNavigate('course-detail', { courseId, courseName });
    }
  };

  return (<TooltipProvider><div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">
    <div className="hidden md:flex justify-between items-center gap-4 mb-8">
      <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
        <Popover><PopoverTrigger asChild><button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"><CalendarIcon size={20} className="text-[#253154]" /><span className="font-medium text-[#253154] text-[14px]">Select date range</span></button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><CalendarComponent initialFocus mode="range" selected={date} onSelect={setDate} numberOfMonths={2} /></PopoverContent></Popover>
        <div className="w-px h-4 bg-gray-200 mx-2" /><button className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500"><RefreshCw size={20} className="text-[#253154]" /></button>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Download size={20} />Export</button>
        <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"><Upload size={20} />Import</button>
        <button className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium" onClick={() => toast.info('Add Course modal would open here')}><Plus size={20} />Add Course</button>
      </div>
    </div>

    <div className="hidden lg:grid grid-cols-4 gap-5 mb-8">{metrics.map((m, i) => <MetricCard key={i} {...m} />)}</div>
    <div className="block lg:hidden mb-14 -mx-4"><Slider dots infinite={false} speed={500} slidesToShow={1.1} slidesToScroll={1} arrows={false} centerMode centerPadding='20px'>{metrics.map((m, i) => <div key={i} className="px-2 py-2"><MetricCard {...m} /></div>)}</Slider></div>

    <div className="hidden md:flex justify-between items-center gap-4 mb-6">
      <div className="relative flex-1"><Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" /><input type="text" placeholder="Search courses..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" /></div>
      <div className="flex items-center gap-3 shrink-0">
        <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><Filter size={20} /></button>
        <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><ArrowUpDown size={20} /></button>
        <button className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center"><Columns size={20} /></button>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100">
            <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12"><CustomCheckbox checked={selected.length === items.length} partial={selected.length > 0 && selected.length < items.length} onChange={() => setSelected(selected.length === items.length ? [] : items.map(i => i.id))} /></th>
            {visibleColumns.includes('id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">ID</th>}
            {visibleColumns.includes('provider') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Provider</th>}
            {visibleColumns.includes('courseName') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Course Name</th>}
            {visibleColumns.includes('category') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Category</th>}
            {visibleColumns.includes('countries') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Countries</th>}
            {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Status</th>}
            {visibleColumns.includes('visible') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visible</th>}
            <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr key={item.id} className={`hover:bg-gray-50 transition-colors cursor-pointer ${selected.includes(item.id) ? 'bg-purple-50/30' : ''}`} onClick={(e) => {
                if (!(e.target as HTMLElement).closest('input, button')) {
                  handleRowClick(item.id, item.courseName);
                }
              }}>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><CustomCheckbox checked={selected.includes(item.id)} onChange={() => setSelected(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])} /></td>
                {visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{item.id}</td>}
                {visibleColumns.includes('provider') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.provider}</td>}
                {visibleColumns.includes('courseName') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.courseName}</td>}
                {visibleColumns.includes('category') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.category}</td>}
                {visibleColumns.includes('countries') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.countries}</td>}
                {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.status} /></td>}
                {visibleColumns.includes('visible') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.studentVisible ? 'Yes' : 'No'}</td>}
                <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}><button className="p-1 hover:bg-gray-100 rounded transition-colors"><MoreHorizontal size={18} className="text-gray-400" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-[80px] bg-white flex items-center justify-between px-6 border-t border-gray-50">
        <div className="flex items-center gap-2"><span className="text-gray-500 text-sm font-medium">Rows per page:</span><button className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-gray-700">{rowsPerPage}<ChevronDown size={14} className="text-gray-400" /></button></div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"><ChevronLeft size={18} strokeWidth={2} className="text-gray-500" /></button>
          <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"><ChevronRight size={18} strokeWidth={2} className="text-gray-500" /></button>
        </div>
      </div>
    </div>
  </div>
    <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Courses" totalCount={1200} selectedCount={selected.length} columns={exportColumns} supportsDateRange={false} onExport={handleExport} />
    <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Courses" fields={importFields} onImport={handleImport} templateUrl="/templates/courses-import-template.xlsx" allowUpdate={true} />
  </TooltipProvider>);
};