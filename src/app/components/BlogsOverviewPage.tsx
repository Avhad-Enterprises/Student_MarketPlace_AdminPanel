import React, { useState } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check, Columns, FileText, Edit, Archive, Clock, Eye } from 'lucide-react';
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

const StatusBadge: React.FC<{ status: 'draft' | 'published' | 'scheduled' | 'archived' }> = ({ status }) => {
  const config = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', label: 'Draft' },
    published: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Published' },
    scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', label: 'Scheduled' },
    archived: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', label: 'Archived' }
  }[status];
  return <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>{config.label}</span>;
};

const VisibilityBadge: React.FC<{ visibility: 'public' | 'restricted' }> = ({ visibility }) => {
  const config = visibility === 'public'
    ? { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Public' }
    : { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Restricted' };
  return <span className={`px-2 py-1 rounded-md text-[11px] font-medium border ${config.bg} ${config.text} ${config.border}`}>{config.label}</span>;
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

interface Blog {
  id: string;
  blogId: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishDate: string;
  lastUpdated: string;
  visibility: 'public' | 'restricted';
  language?: string;
}

const BlogsOverviewPage: React.FC = () => {
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) });
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['blogId', 'title', 'author', 'category', 'status', 'publishDate', 'lastUpdated', 'visibility']);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const blogs: Blog[] = [
    { id: 'BLOG-001', blogId: 'BLOG-001', title: 'Complete Guide to Student Visas in 2025', author: 'Sarah Johnson', category: 'Visa Guides', tags: ['visa', 'guide', 'student'], status: 'published', publishDate: '2025-01-10T08:00:00', lastUpdated: '2025-01-15T14:30:00', visibility: 'public', language: 'English' },
    { id: 'BLOG-002', blogId: 'BLOG-002', title: 'Top Universities for International Students', author: 'Mike Davis', category: 'University Rankings', tags: ['university', 'rankings'], status: 'published', publishDate: '2025-01-12T09:00:00', lastUpdated: '2025-01-12T09:00:00', visibility: 'public', language: 'English' },
    { id: 'BLOG-003', blogId: 'BLOG-003', title: 'How to Write a Winning SOP', author: 'Emma Wilson', category: 'Application Tips', tags: ['sop', 'application'], status: 'draft', publishDate: '', lastUpdated: '2025-01-18T16:45:00', visibility: 'public', language: 'English' },
    { id: 'BLOG-004', blogId: 'BLOG-004', title: 'Scholarship Opportunities for 2025', author: 'David Chen', category: 'Financial Aid', tags: ['scholarship', 'funding'], status: 'scheduled', publishDate: '2025-02-01T10:00:00', lastUpdated: '2025-01-20T11:00:00', visibility: 'public', language: 'English' },
    { id: 'BLOG-005', blogId: 'BLOG-005', title: 'Study Abroad Success Stories', author: 'Lisa Anderson', category: 'Student Stories', tags: ['success', 'testimonial'], status: 'published', publishDate: '2025-01-05T07:00:00', lastUpdated: '2025-01-05T07:00:00', visibility: 'public', language: 'English' },
    { id: 'BLOG-006', blogId: 'BLOG-006', title: 'Internal Policy Updates Q1 2025', author: 'Admin Team', category: 'Internal Updates', tags: ['policy', 'internal'], status: 'published', publishDate: '2025-01-08T12:00:00', lastUpdated: '2025-01-08T12:00:00', visibility: 'restricted', language: 'English' },
    { id: 'BLOG-007', blogId: 'BLOG-007', title: 'Understanding Visa Interview Process', author: 'Sarah Johnson', category: 'Visa Guides', tags: ['visa', 'interview'], status: 'archived', publishDate: '2024-11-15T08:00:00', lastUpdated: '2024-12-20T10:00:00', visibility: 'public', language: 'English' },
    { id: 'BLOG-008', blogId: 'BLOG-008', title: 'Cost of Living Guide for Students', author: 'Mike Davis', category: 'Financial Aid', tags: ['budget', 'cost'], status: 'draft', publishDate: '', lastUpdated: '2025-01-22T13:15:00', visibility: 'public', language: 'English' },
  ];

  const metrics = [
    { title: 'Total Blogs', value: '156', icon: FileText, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total number of blog posts in the system' },
    { title: 'Published', value: '89', icon: Eye, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Currently published and visible blogs' },
    { title: 'Drafts', value: '42', icon: Edit, bgClass: 'bg-gray-50', colorClass: 'text-gray-600', tooltip: 'Blog posts in draft state' },
    { title: 'Scheduled', value: '18', icon: Clock, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Blogs scheduled for future publication' },
    { title: 'Archived', value: '7', icon: Archive, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Archived blog posts' }
  ];

  const handleRefresh = () => toast.success("Refreshing data...");

  const handleSelectAll = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([]);
      setSelectAllStore(false);
    } else {
      setSelectedBlogs(blogs.map(b => b.id));
      setSelectAllStore(false);
    }
  };

  const handleToggleBlog = (blogId: string) => {
    setSelectedBlogs(prev => prev.includes(blogId) ? prev.filter(id => id !== blogId) : [...prev, blogId]);
  };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedBlogs(blogs.map(b => b.id));
  };

  const handleClearSelection = () => {
    setSelectedBlogs([]);
    setSelectAllStore(false);
  };

  const exportColumns: ExportColumn[] = [
    { id: 'blogId', label: 'Blog ID', defaultSelected: true },
    { id: 'title', label: 'Blog Title', defaultSelected: true },
    { id: 'author', label: 'Author', defaultSelected: true },
    { id: 'category', label: 'Category', defaultSelected: true },
    { id: 'tags', label: 'Tags', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'publishDate', label: 'Publish Date', defaultSelected: true },
    { id: 'lastUpdated', label: 'Last Updated', defaultSelected: true },
    { id: 'visibility', label: 'Visibility', defaultSelected: true }
  ];

  const importFields: ImportField[] = [
    { id: 'blogId', label: 'Blog ID', required: true, type: 'text' },
    { id: 'title', label: 'Blog Title', required: true, type: 'text' },
    { id: 'author', label: 'Author', required: true, type: 'text' },
    { id: 'category', label: 'Category', required: true, type: 'select', options: ['Visa Guides', 'University Rankings', 'Application Tips', 'Financial Aid', 'Student Stories', 'Internal Updates'] },
    { id: 'status', label: 'Status', required: true, type: 'select', options: ['draft', 'published', 'scheduled', 'archived'] },
    { id: 'publishDate', label: 'Publish Date', required: false, type: 'date' },
    { id: 'visibility', label: 'Visibility', required: true, type: 'select', options: ['public', 'restricted'] }
  ];

  const handleExport = async (options: any) => {
    toast.success(`Exporting ${options.scope} blogs as ${options.format}...`);
  };

  const handleImport = async (data: any) => {
    toast.success(`Importing ${data.length} blogs...`);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-10 py-6 md:py-10 bg-gray-50 min-h-screen">

      <div className="max-w-[1600px] mx-auto">
        {/* Desktop Action Bar */}
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
            <button onClick={() => setShowExportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium">
              <Download size={20} strokeWidth={1.5} />Export
            </button>
            <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium">
              <Upload size={20} strokeWidth={1.5} />Import
            </button>
            <button className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium">
              <Plus size={20} strokeWidth={1.5} />New Blog
            </button>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="flex md:hidden flex-col gap-4 mb-6">
          <div className="w-full h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <CalendarIcon size={18} className="text-[#253154]" />
              <span className="text-sm font-medium text-[#253154]">
                {date?.from && date?.to ? `${format(date.from, 'd MMM')} - ${format(date.to, 'd MMM')}` : 'Select range'}
              </span>
            </div>
            <button onClick={handleRefresh} className="p-2 hover:bg-gray-50 rounded-full transition-colors active:rotate-180 active:duration-500">
              <RefreshCw size={18} className="text-[#253154]" />
            </button>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 h-[50px] bg-[#0e042f] text-white rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 font-medium">
              <Plus size={20} />New Blog
            </button>
            <button className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center">
              <MoreHorizontal size={22} className="text-[#253154]" />
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
        </div>
        <div className="block lg:hidden mb-14 -mx-4">
          <Slider dots={false} infinite={false} speed={500} slidesToShow={5} slidesToScroll={1} arrows={true} responsive={[{ breakpoint: 1536, settings: { slidesToShow: 4 } }, { breakpoint: 1280, settings: { slidesToShow: 3 } }, { breakpoint: 1024, settings: { slidesToShow: 2 } }, { breakpoint: 640, settings: { slidesToShow: 1 } }]}>
            {metrics.map((m, i) => <div key={i} className="px-2 py-2"><MetricCard {...m} /></div>)}
          </Slider>
        </div>

        {/* Search and Filter Bar */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input type="text" placeholder="Search by title, author, or category..." className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none" />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
              <Filter size={20} strokeWidth={1.5} />
            </button>
            <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
              <ArrowUpDown size={20} strokeWidth={1.5} />
            </button>
            <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
              <Columns size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Selection Banner */}
        {selectedBlogs.length > 0 && !selectAllStore && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-6 py-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CustomCheckbox checked={true} onChange={handleClearSelection} />
              <span className="text-[#253154] font-medium">
                {selectedBlogs.length} blog{selectedBlogs.length > 1 ? 's' : ''} selected
              </span>
              {selectedBlogs.length === blogs.length && (
                <button onClick={handleSelectAllStore} className="text-purple-600 hover:text-purple-700 text-sm font-medium underline">
                  Select all {blogs.length} blogs
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#253154] hover:bg-gray-50">
                Change Status
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#253154] hover:bg-gray-50">
                Assign Category
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#253154] hover:bg-gray-50">
                Archive
              </button>
            </div>
          </div>
        )}

        {selectAllStore && (
          <div className="bg-purple-100 border border-purple-300 rounded-xl px-6 py-4 mb-6 flex items-center justify-between">
            <span className="text-[#253154] font-medium">
              All {blogs.length} blogs are selected
            </span>
            <button onClick={handleClearSelection} className="text-purple-600 hover:text-purple-700 text-sm font-medium underline">
              Clear selection
            </button>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="w-12 px-6 py-4 text-left">
                    <CustomCheckbox
                      checked={selectedBlogs.length === blogs.length}
                      partial={selectedBlogs.length > 0 && selectedBlogs.length < blogs.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {visibleColumns.includes('blogId') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Blog ID</th>}
                  {visibleColumns.includes('title') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Title</th>}
                  {visibleColumns.includes('author') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Author</th>}
                  {visibleColumns.includes('category') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</th>}
                  {visibleColumns.includes('status') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>}
                  {visibleColumns.includes('publishDate') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Publish Date</th>}
                  {visibleColumns.includes('lastUpdated') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Last Updated</th>}
                  {visibleColumns.includes('visibility') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Visibility</th>}
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <CustomCheckbox checked={selectedBlogs.includes(blog.id)} onChange={() => handleToggleBlog(blog.id)} />
                    </td>
                    {visibleColumns.includes('blogId') && (
                      <td className="px-6 py-4">
                        <span className="text-[14px] font-bold text-[#253154]">{blog.blogId}</span>
                      </td>
                    )}
                    {visibleColumns.includes('title') && (
                      <td className="px-6 py-4">
                        <span className="text-[14px] text-gray-700 font-medium max-w-[300px] line-clamp-2">{blog.title}</span>
                      </td>
                    )}
                    {visibleColumns.includes('author') && (
                      <td className="px-6 py-4">
                        <span className="text-[14px] text-gray-700">{blog.author}</span>
                      </td>
                    )}
                    {visibleColumns.includes('category') && (
                      <td className="px-6 py-4">
                        <span className="text-[12px] font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{blog.category}</span>
                      </td>
                    )}
                    {visibleColumns.includes('status') && (
                      <td className="px-6 py-4">
                        <StatusBadge status={blog.status} />
                      </td>
                    )}
                    {visibleColumns.includes('publishDate') && (
                      <td className="px-6 py-4">
                        <span className="text-[14px] text-gray-700">
                          {blog.publishDate ? format(new Date(blog.publishDate), 'MMM d, yyyy') : '—'}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes('lastUpdated') && (
                      <td className="px-6 py-4">
                        <span className="text-[12px] text-gray-500">{format(new Date(blog.lastUpdated), 'MMM d, yyyy HH:mm')}</span>
                      </td>
                    )}
                    {visibleColumns.includes('visibility') && (
                      <td className="px-6 py-4">
                        <VisibilityBadge visibility={blog.visibility} />
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal size={18} className="text-[#253154]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
                10<ChevronDown size={14} />
              </button>
              <span className="text-sm text-gray-600 ml-4">1-{Math.min(10, blogs.length)} of {blogs.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600">Page 1 of 1</span>
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Blogs"
        totalCount={blogs.length}
        selectedCount={selectedBlogs.length}
        columns={exportColumns}
        supportsDateRange={true}
        onExport={handleExport}
      />
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Blogs"
        fields={importFields}
        onImport={handleImport}
        allowUpdate={true}
      />
    </div>
  );
};

export default BlogsOverviewPage;
