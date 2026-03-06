"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Search, Check, Columns, FileText, Edit, Archive, Clock, Eye, List, LayoutGrid, Globe, Lock } from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { blogService, Blog, BlogFormData } from '@/services/blogService';
import { BlogModal } from './BlogModal';

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
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors">i</div>
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

// Interface is imported from blogService

interface BlogsOverviewPageProps {
  onNavigate?: (page: string) => void;
}

const BlogsOverviewPage: React.FC<BlogsOverviewPageProps> = ({ onNavigate }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2025, 0, 1), to: new Date(2026, 11, 31) });
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['blogId', 'title', 'author', 'category', 'status', 'publishDate', 'updatedAt', 'visibility']);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'updated_at', direction: 'desc' });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBlogs = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await blogService.getAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const metrics = [
    { title: 'Total Blogs', value: '156', icon: FileText, bgClass: 'bg-purple-50', colorClass: 'text-purple-600', tooltip: 'Total number of blog posts in the system' },
    { title: 'Published', value: '89', icon: Eye, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Currently published and visible blogs' },
    { title: 'Drafts', value: '42', icon: Edit, bgClass: 'bg-gray-50', colorClass: 'text-gray-600', tooltip: 'Blog posts in draft state' },
    { title: 'Scheduled', value: '18', icon: Clock, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Blogs scheduled for future publication' },
    { title: 'Archived', value: '7', icon: Archive, bgClass: 'bg-amber-50', colorClass: 'text-amber-600', tooltip: 'Archived blog posts' }
  ];

  const handleRefresh = () => fetchBlogs();

  const handleOpenModal = (blog: Blog | null = null) => {
    setSelectedBlog(blog);
    setShowBlogModal(true);
  };

  const handleSaveBlog = async (data: BlogFormData) => {
    try {
      if (selectedBlog) {
        await blogService.updateBlog(selectedBlog.id, data);
      } else {
        await blogService.createBlog(data);
      }
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deleteBlog(id);
        toast.success('Blog post deleted');
        fetchBlogs();
      } catch (error) {
        toast.error('Failed to delete blog');
      }
    }
  };

  const filteredAndSortedBlogs = useMemo(() => {
    let result = [...blogs];

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(lowSearch) ||
        b.author.toLowerCase().includes(lowSearch) ||
        b.blog_id.toLowerCase().includes(lowSearch)
      );
    }

    if (statusFilter.length > 0) {
      result = result.filter(b => statusFilter.includes(b.status));
    }

    if (categoryFilter.length > 0) {
      result = result.filter(b => categoryFilter.includes(b.category));
    }

    return result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Blog];
      const bValue = b[sortConfig.key as keyof Blog];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [blogs, searchTerm, statusFilter, categoryFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedBlogs.length / rowsPerPage);
  const paginatedBlogs = filteredAndSortedBlogs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSelectAll = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([]);
      setSelectAllStore(false);
    } else {
      setSelectedBlogs(blogs.map(b => b.id.toString()));
      setSelectAllStore(false);
    }
  };

  const handleToggleBlog = (blogId: string) => {
    setSelectedBlogs(prev => prev.includes(blogId) ? prev.filter(id => id !== blogId) : [...prev, blogId]);
  };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedBlogs(blogs.map(b => b.id.toString()));
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
            <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium">
              <Plus size={20} strokeWidth={1.5} />New Blog
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input
              type="text"
              placeholder="Search blogs by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button className={`h-[50px] min-w-[50px] bg-white border ${statusFilter.length > 0 || categoryFilter.length > 0 ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-200'} rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center relative`}>
                  <Filter size={20} strokeWidth={1.5} />
                  {(statusFilter.length > 0 || categoryFilter.length > 0) && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                      {statusFilter.length + categoryFilter.length}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-gray-100" align="end">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span>Status</span>
                      {(statusFilter.length > 0 || categoryFilter.length > 0) && (
                        <button onClick={() => { setStatusFilter([]); setCategoryFilter([]); }} className="text-purple-600 hover:text-purple-700 capitalize text-[10px] font-bold">Clear All</button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {['draft', 'published', 'scheduled', 'archived'].map(status => (
                        <div key={status} className="flex items-center justify-between">
                          <label className="text-[14px] text-[#253154] capitalize">{status}</label>
                          <CustomCheckbox
                            checked={statusFilter.includes(status)}
                            onChange={() => setStatusFilter(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status])}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Category</h4>
                    <div className="space-y-2">
                      {['Visa Guides', 'University Rankings', 'Application Tips', 'Financial Aid', 'Student Stories', 'Internal Updates'].map(cat => (
                        <div key={cat} className="flex items-center justify-between">
                          <label className="text-[14px] text-[#253154]">{cat}</label>
                          <CustomCheckbox
                            checked={categoryFilter.includes(cat)}
                            onChange={() => setCategoryFilter(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
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
              <PopoverContent className="w-56 p-2 rounded-2xl shadow-xl border-gray-100" align="end">
                <div className="space-y-1">
                  {[
                    { id: 'blog_id', label: 'Blog ID' },
                    { id: 'title', label: 'Title' },
                    { id: 'author', label: 'Author' },
                    { id: 'updated_at', label: 'Last Updated' },
                    { id: 'status', label: 'Status' }
                  ].map((field) => (
                    <button
                      key={field.id}
                      onClick={() => {
                        if (sortConfig.key === field.id) {
                          setSortConfig({ key: field.id, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
                        } else {
                          setSortConfig({ key: field.id, direction: 'desc' });
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${sortConfig.key === field.id ? 'bg-purple-50 text-purple-600 font-bold' : 'text-[#253154] hover:bg-gray-50'}`}
                    >
                      {field.label}
                      {sortConfig.key === field.id && (
                        sortConfig.direction === 'asc' ? <ArrowUpDown size={14} className="rotate-180" /> : <ArrowUpDown size={14} />
                      )}
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
              <PopoverContent className="w-56 p-3 rounded-2xl shadow-xl border-gray-100" align="end">
                <h4 className="font-bold text-[#0e042f] mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Visible Columns</h4>
                <div className="space-y-2">
                  {[
                    { id: 'blogId', label: 'Blog ID' },
                    { id: 'title', label: 'Title' },
                    { id: 'author', label: 'Author' },
                    { id: 'category', label: 'Category' },
                    { id: 'status', label: 'Status' },
                    { id: 'publishDate', label: 'Publish Date' },
                    { id: 'updatedAt', label: 'Last Updated' },
                    { id: 'visibility', label: 'Visibility' }
                  ].map(col => (
                    <div key={col.id} className="flex items-center justify-between">
                      <span className="text-[14px] text-[#253154]">{col.label}</span>
                      <CustomCheckbox
                        checked={visibleColumns.includes(col.id)}
                        onChange={() => setVisibleColumns(prev => prev.includes(col.id) ? prev.filter(c => c !== col.id) : [...prev, col.id])}
                      />
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="w-12 px-6 py-4 text-left">
                    <CustomCheckbox checked={selectedBlogs.length === blogs.length} partial={selectedBlogs.length > 0 && selectedBlogs.length < blogs.length} onChange={handleSelectAll} />
                  </th>
                  {visibleColumns.includes('blogId') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Blog ID</th>}
                  {visibleColumns.includes('title') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Title</th>}
                  {visibleColumns.includes('author') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Author</th>}
                  {visibleColumns.includes('category') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</th>}
                  {visibleColumns.includes('status') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>}
                  {visibleColumns.includes('publishDate') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Publish Date</th>}
                  {visibleColumns.includes('updatedAt') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Last Updated</th>}
                  {visibleColumns.includes('visibility') && <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Visibility</th>}
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-10 text-center text-gray-400">
                      <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                      Loading blogs...
                    </td>
                  </tr>
                ) : paginatedBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-10 text-center text-gray-400">
                      No blogs found.
                    </td>
                  </tr>
                ) : (
                  paginatedBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <CustomCheckbox checked={selectedBlogs.includes(blog.id.toString())} onChange={() => handleToggleBlog(blog.id.toString())} />
                      </td>
                      {visibleColumns.includes('blogId') && <td className="px-6 py-4"><span className="text-[14px] font-bold text-[#253154]">{blog.blog_id}</span></td>}
                      {visibleColumns.includes('title') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700 font-medium max-w-[300px] line-clamp-2">{blog.title}</span></td>}
                      {visibleColumns.includes('author') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{blog.author}</span></td>}
                      {visibleColumns.includes('category') && <td className="px-6 py-4"><span className="text-[12px] font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{blog.category}</span></td>}
                      {visibleColumns.includes('status') && <td className="px-6 py-4"><StatusBadge status={blog.status} /></td>}
                      {visibleColumns.includes('publishDate') && <td className="px-6 py-4"><span className="text-[14px] text-gray-700">{blog.publish_date ? format(new Date(blog.publish_date), 'MMM d, yyyy') : '—'}</span></td>}
                      {visibleColumns.includes('updatedAt') && <td className="px-6 py-4"><span className="text-[12px] text-gray-500">{format(new Date(blog.updated_at), 'MMM d, yyyy HH:mm')}</span></td>}
                      {visibleColumns.includes('visibility') && <td className="px-6 py-4"><VisibilityBadge visibility={blog.visibility} /></td>}
                      <td className="px-6 py-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreHorizontal size={18} className="text-[#253154]" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-40 p-1" align="end">
                            <button
                              onClick={() => handleOpenModal(blog)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                            >
                              <Edit size={16} /> Edit Blog
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Archive size={16} /> Delete
                            </button>
                          </PopoverContent>
                        </Popover>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 outline-none transition-all cursor-pointer font-medium text-[#253154]"
              >
                {[5, 10, 20, 50].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span className="text-sm text-gray-500 ml-4">
                {filteredAndSortedBlogs.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                {Math.min(currentPage * rowsPerPage, filteredAndSortedBlogs.length)} of {filteredAndSortedBlogs.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-all text-[#253154]"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-bold text-[#253154] px-2">Page {currentPage} of {Math.max(1, totalPages)}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-all text-[#253154]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} moduleName="Blogs" totalCount={blogs.length} selectedCount={selectedBlogs.length} columns={exportColumns} supportsDateRange={true} onExport={handleExport} />
      <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} moduleName="Blogs" fields={importFields} onImport={handleImport} allowUpdate={true} />

      <BlogModal
        isOpen={showBlogModal}
        onClose={() => setShowBlogModal(false)}
        onSave={handleSaveBlog}
        blog={selectedBlog}
      />
    </div>
  );
};

export default BlogsOverviewPage;
