"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, ArrowUpDown, Columns, Download, Upload,
  Plus, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight,
  BookOpen, Globe, Zap, ShieldCheck, DollarSign,
  CheckCircle2, XCircle, Clock, Star, Eye
} from 'lucide-react';
import { toast } from "sonner";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddCourseDialog } from './common/AddCourseDialog';
import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { Course, getAllCourses, createCourse, updateCourse, deleteCourse, getCourseMetrics } from '../services/courseService';

const CustomCheckbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <div
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${checked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}
  >
    {checked && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
  </div>
);

const MobileCourseCard: React.FC<{
  item: Course;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: (item: Course) => void;
  onDelete: (id: string) => void;
  onNavigate?: (page: string) => void;
}> = ({ item, isSelected, onToggleSelect, onEdit, onDelete, onNavigate }) => (
  <div className={`bg-white p-4 rounded-2xl border ${isSelected ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-100'} shadow-sm space-y-4`}>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <CustomCheckbox checked={isSelected} onChange={onToggleSelect} />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">{item.course_name.charAt(0)}</div>
          <div>
            <h3 className="font-bold text-[#253154] text-[15px]">{item.course_name}</h3>
            <p className="text-gray-500 text-[10px]">Ref: {item.reference_id}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${item.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {item.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-3 border-y border-gray-50">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provider</p>
        <p className="text-xs font-medium text-gray-700">{item.provider}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</p>
        <p className="text-xs font-bold text-indigo-600">{item.category}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</p>
        <div className="flex items-center gap-1 text-gray-600 font-medium text-xs"><Clock size={10} /> {item.duration}</div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tuition</p>
        <p className="text-xs font-bold text-gray-900">{item.avg_cost}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Learners</p>
        <p className="text-xs font-medium text-gray-700">{item.learners_count?.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</p>
        <div className="flex items-center gap-1 text-green-600 font-bold text-xs"><Star size={10} fill="currentColor" /> {item.rating}/5.0</div>
      </div>
    </div>

    <div className="flex items-center justify-end gap-2 pt-1">
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate?.(`/services/courses/${item.id}`); }}
        className="p-2.5 bg-indigo-50 text-indigo-610 rounded-xl hover:bg-indigo-100 transition-colors"
        title="View Details"
      >
        <Eye size={18} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
        title="Edit"
      >
        <Edit2 size={18} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

export const CoursesOverviewPage = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  // State for data
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalCourses: 0,
    activeLearners: '0',
    totalProviders: 0,
    avgRating: '0/5.0'
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // State for sorting, filtering, and debounced search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Export state
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['course_name', 'provider', 'category', 'status', 'rating', 'learners_count', 'actions']);

  const toggleColumn = (colId: string) => {
    setVisibleColumns(prev => prev.includes(colId) ? prev.filter(id => id !== colId) : [...prev, colId]);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        search: debouncedSearch,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        sort: sortField,
        order: sortOrder
      };
      const result = await getAllCourses(params);
      setCourseData(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);

      const metricsResult = await getCourseMetrics();
      setMetrics(metricsResult.data);
    } catch (error) {
      toast.error("Failed to fetch courses");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, rowsPerPage, debouncedSearch, filterStatus, filterCategory, sortField, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (data: any) => {
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, data);
      } else {
        await createCourse(data);
      }
      fetchData();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(id);
      toast.success("Course deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const columns = [
    { id: 'reference_id', label: 'Reference ID', defaultSelected: true },
    { id: 'course_name', label: 'Course Name', defaultSelected: true },
    { id: 'provider', label: 'Provider', defaultSelected: true },
    { id: 'category', label: 'Category', defaultSelected: true },
    { id: 'duration', label: 'Duration', defaultSelected: true },
    { id: 'avg_cost', label: 'Avg Cost', defaultSelected: true },
    { id: 'popularity', label: 'Popularity', defaultSelected: false },
    { id: 'learners_count', label: 'Learners', defaultSelected: true },
    { id: 'rating', label: 'Rating', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'actions', label: 'Actions' }
  ];

  const exportColumns: ExportColumn[] = [
    { id: 'id', label: 'Database ID', defaultSelected: false },
    ...columns.filter(col => col.id !== 'actions').map(col => ({
      id: col.id,
      label: col.label,
      defaultSelected: true
    }))
  ];

  const importFields: ImportField[] = [
    { id: 'id', label: 'Database ID (For Updates)', required: false, type: 'text' },
    { id: 'reference_id', label: 'Reference ID', required: false, type: 'text' },
    { id: 'course_name', label: 'Course Name', required: true, type: 'text' },
    { id: 'provider', label: 'Provider', required: true, type: 'text' },
    { id: 'category', label: 'Category', required: true, type: 'select', options: ['Certification', 'Degree', 'Bootcamp', 'Short Course'] },
    { id: 'duration', label: 'Duration', required: false, type: 'text' },
    { id: 'avg_cost', label: 'Avg Cost', required: false, type: 'text' },
    { id: 'countries_covered', label: 'Countries Covered', required: false, type: 'text' },
    { id: 'learners_count', label: 'Learners Count', required: false, type: 'text' },
    { id: 'rating', label: 'Rating', required: false, type: 'text' },
    { id: 'status', label: 'Status', required: false, type: 'select', options: ['active', 'inactive'] },
    { id: 'student_visible', label: 'Visible to Students', required: false, type: 'select', options: ['Yes', 'No'] },
    { id: 'popularity', label: 'Popularity Score', required: false, type: 'text' }
  ];

  const handleExport = async (options: any) => {
    try {
      setIsLoading(true);
      let dataToExport: any[] = [];

      if (options.scope === 'all') {
        const result = await getAllCourses({ limit: 1000 });
        dataToExport = result.data;
      } else if (options.scope === 'selected') {
        dataToExport = courseData.filter(i => selected.includes(i.id));
      } else {
        dataToExport = courseData;
      }

      const mappedData = dataToExport.map(item => {
        const row: any = {};
        options.selectedColumns.forEach((colId: string) => {
          row[colId] = item[colId as keyof Course];
        });
        return row;
      });

      if (options.format === 'json') {
        const blob = new Blob([JSON.stringify(mappedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `courses_export_${Date.now()}.json`;
        a.click();
      } else if (options.format === 'pdf') {
        const headers = options.selectedColumns.map((colId: string) => {
          const col = exportColumns.find(c => c.id === colId);
          return col ? col.label : colId;
        });

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          toast.error("Please allow popups to export PDF");
          return;
        }

        const dateStr = format(new Date(), 'yyyy-MM-dd');
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Courses Export ${dateStr}</title>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; }
                header { margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
                h1 { color: #0e042f; margin: 0; font-size: 24px; }
                .meta { margin-top: 10px; color: #64748b; font-size: 13px; display: flex; gap: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background-color: #f8fafc; color: #475569; font-weight: bold; text-align: left; padding: 12px 15px; border: 1px solid #e2e8f0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
                td { padding: 10px 15px; border: 1px solid #e2e8f0; font-size: 13px; }
                tr:nth-child(even) { background-color: #fcfcfd; }
                .status-active { color: #15803d; font-weight: bold; }
                .status-inactive { color: #94a3b8; }
              </style>
            </head>
            <body>
              <header>
                <h1>Course Records Export</h1>
                <div class="meta">
                  <span><strong>Generated:</strong> ${new Date().toLocaleString()}</span>
                  <span><strong>Scope:</strong> ${options.scope}</span>
                  <span><strong>Records:</strong> ${mappedData.length}</span>
                </div>
              </header>
              <table>
                <thead>
                  <tr>
                    ${headers.map((h: string) => `<th>${h}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${mappedData.map(row => `
                    <tr>
                      ${options.selectedColumns.map((colId: string) => {
          const val = row[colId] !== undefined ? row[colId] : '';
          let className = '';
          if (colId === 'status') className = val === 'active' ? 'status-active' : 'status-inactive';
          return `<td class="${className}">${val}</td>`;
        }).join('')}
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
        setTimeout(() => {
          printWindow.print();
        }, 500);
      } else {
        const worksheet = XLSX.utils.json_to_sheet(mappedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");

        if (options.format === 'csv') {
          XLSX.writeFile(workbook, `courses_export_${Date.now()}.csv`, { bookType: 'csv' });
        } else {
          XLSX.writeFile(workbook, `courses_export_${Date.now()}.xlsx`);
        }
      }
      toast.success("Export successful");
    } catch (error) {
      toast.error("Export failed");
      console.error("Export error:", error);
    } finally {
      setIsLoading(false);
      setShowExportDialog(false);
    }
  };

  const handleImport = async (data: any[], mode: any) => {
    let successCount = 0;
    let failCount = 0;

    const loadingToast = toast.loading(`Importing courses (0/${data.length})...`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const payload = {
          reference_id: (row.reference_id || '').trim(),
          course_name: row.course_name,
          provider: row.provider,
          category: row.category || 'Certification',
          duration: row.duration || '',
          avg_cost: row.avg_cost || '',
          countries_covered: Number(row.countries_covered) || 0,
          learners_count: Number(row.learners_count) || 0,
          rating: Number(row.rating) || 0,
          status: (row.status || 'active').toLowerCase() as 'active' | 'inactive',
          student_visible: row.student_visible === 'Yes',
          popularity: Number(row.popularity) || 1
        };

        let targetId = row.id;
        if (!targetId && row.reference_id && (mode === 'update' || mode === 'merge')) {
          const searchResult = await getAllCourses({ search: row.reference_id.trim(), limit: 10 });
          const existingItem = searchResult.data?.find((i: any) => 
            i.reference_id?.trim().toLowerCase() === row.reference_id.trim().toLowerCase()
          );
          if (existingItem) {
            targetId = existingItem.id;
          }
        }

        if ((mode === 'update' || mode === 'merge') && targetId) {
          await updateCourse(targetId, payload);
        } else {
          await createCourse(payload);
        }
        successCount++;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || error.message || "Unknown error";
        console.error(`Failed to import course row ${i + 1}:`, error);
        toast.error(`Row ${i + 1} Error: ${errorMessage}`, { duration: 5000 });
        failCount++;
      }
      toast.loading(`Importing courses (${successCount + failCount}/${data.length})...`, { id: loadingToast });
    }

    toast.dismiss(loadingToast);
    if (successCount > 0) {
      toast.success(`Import complete! ${successCount} successful, ${failCount} failed.`);
    } else {
      toast.error(`Import failed! All ${failCount} rows failed.`);
    }
    fetchData();
    setShowImportDialog(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Courses', value: metrics.totalCourses, icon: <BookOpen className="text-indigo-600" />, bg: 'bg-indigo-50' },
          { label: 'Active Learners', value: metrics.activeLearners, icon: <Zap className="text-yellow-600" />, bg: 'bg-yellow-50' },
          { label: 'Total Providers', value: metrics.totalProviders, icon: <Globe className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Avg. Rating', value: metrics.avgRating, icon: <Star className="text-green-600" />, bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-[24px] border border-white/50 shadow-sm transition-all hover:scale-[1.02]`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">{stat.icon}</div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-indigo-900/5 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses or providers..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-[15px]"
              />
            </div>

            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <button className={`p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center ${filterStatus !== 'all' || filterCategory !== 'all' ? 'border-indigo-600 bg-indigo-50/50' : 'bg-white'}`}>
                    <Filter size={20} className={filterStatus !== 'all' || filterCategory !== 'all' ? 'text-indigo-600' : 'text-gray-600'} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <div className="space-y-4">
                    <h4 className="font-bold text-[#253154]">Filters</h4>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-500">Status</label>
                      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-500">Category</label>
                      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option value="all">All Categories</option>
                        <option value="Certification">Certification</option>
                        <option value="Degree">Degree</option>
                        <option value="Bootcamp">Bootcamp</option>
                        <option value="Short Course">Short Course</option>
                      </select>
                    </div>
                    <button onClick={() => { setFilterStatus('all'); setFilterCategory('all'); }} className="text-sm text-indigo-600 font-medium hover:underline">Reset Filters</button>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center justify-center">
                    <ArrowUpDown size={20} className="text-gray-600" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="space-y-1">
                    {[
                      { label: 'Course Name', value: 'course_name' },
                      { label: 'Provider', value: 'provider' },
                      { label: 'Category', value: 'category' },
                      { label: 'Countries', value: 'countries_covered' },
                      { label: 'Popularity', value: 'popularity' },
                      { label: 'Date Created', value: 'created_at' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          if (sortField === opt.value) {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField(opt.value);
                            setSortOrder('asc');
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between text-sm ${sortField === opt.value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {opt.label}
                        {sortField === opt.value && (sortOrder === 'asc' ? <ArrowUpDown size={14} /> : <ArrowUpDown size={14} className="rotate-180" />)}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center justify-center">
                    <Columns size={20} className="text-gray-600" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="space-y-1">
                    {columns.map((col) => (
                      <button
                        key={col.id}
                        onClick={(e) => { e.preventDefault(); toggleColumn(col.id); }}
                        className="w-full text-left px-3 py-2 rounded-md flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50"
                      >
                        <CustomCheckbox checked={visibleColumns.includes(col.id)} onChange={() => toggleColumn(col.id)} />
                        {col.label}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <button onClick={() => setShowExportDialog(true)} className="hidden md:flex items-center gap-2 p-4 px-6 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-gray-700 font-medium">
                <Download size={20} />
                Export
              </button>

              <button onClick={() => setShowImportDialog(true)} className="hidden md:flex items-center gap-2 p-4 px-6 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-gray-700 font-medium">
                <Upload size={20} />
                Import
              </button>

              <button
                onClick={() => { setEditingCourse(null); setIsAddDialogOpen(true); }}
                className="flex items-center gap-2 p-4 px-8 rounded-2xl bg-[#0e042f] hover:bg-[#1a0c4a] text-white transition-all shadow-lg shadow-indigo-900/10 font-medium"
              >
                <Plus size={20} />
                Add New
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-6 py-4 text-left w-12">
                  <CustomCheckbox
                    checked={selected.length === courseData.length && courseData.length > 0}
                    onChange={() => setSelected(selected.length === courseData.length ? [] : courseData.map(i => i.id))}
                  />
                </th>
                {visibleColumns.includes('reference_id') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>}
                {visibleColumns.includes('course_name') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Course</th>}
                {visibleColumns.includes('provider') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Provider</th>}
                {visibleColumns.includes('category') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Category</th>}
                {visibleColumns.includes('duration') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Duration</th>}
                {visibleColumns.includes('avg_cost') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Avg Cost</th>}
                {visibleColumns.includes('countries_covered') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Countries</th>}
                {visibleColumns.includes('learners_count') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Learners</th>}
                {visibleColumns.includes('popularity') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Popularity</th>}
                {visibleColumns.includes('rating') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Rating</th>}
                {visibleColumns.includes('status') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>}
                {visibleColumns.includes('actions') && <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-gray-50">
                    <td colSpan={10} className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-lg w-full"></div></td>
                  </tr>
                ))
              ) : (
                <>
                  {/* Mobile View */}
                  <tr className="md:hidden">
                    <td colSpan={12} className="p-0">
                      <div className="space-y-4 p-4">
                        {courseData.length > 0 ? (
                          courseData.map((item) => (
                            <MobileCourseCard
                              key={item.id}
                              item={item}
                              isSelected={selected.includes(item.id)}
                              onToggleSelect={() => setSelected(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                              onEdit={setEditingCourse}
                              onDelete={handleDelete}
                              onNavigate={onNavigate}
                            />
                          ))
                        ) : (
                          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-3">
                            <BookOpen size={48} className="text-gray-200 mx-auto" />
                            <p className="text-gray-500 font-medium">No courses found</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Desktop View Table */}
                  {courseData.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`hidden md:table-row border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer ${selected.includes(item.id) ? 'bg-indigo-50/30' : ''}`}
                      onClick={() => onNavigate?.(`/services/courses/${item.id}`)}
                    >
                      <td className="px-6 py-5">
                        <CustomCheckbox
                          checked={selected.includes(item.id)}
                          onChange={() => setSelected(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                        />
                      </td>
                      {visibleColumns.includes('reference_id') && <td className="px-6 py-5 text-sm text-gray-500 font-medium">{item.reference_id}</td>}
                      {visibleColumns.includes('course_name') && (
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">{item.course_name.charAt(0)}</div>
                            <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.course_name}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.includes('provider') && <td className="px-6 py-5 text-sm text-gray-600 font-medium">{item.provider}</td>}
                      {visibleColumns.includes('category') && (
                        <td className="px-6 py-5 text-center">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100">{item.category}</span>
                        </td>
                      )}
                      {visibleColumns.includes('duration') && (
                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-gray-600">
                            <Clock size={14} />
                            <span className="text-sm font-medium">{item.duration}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.includes('avg_cost') && <td className="px-6 py-5 text-sm text-gray-900 font-bold text-center">{item.avg_cost}</td>}
                      {visibleColumns.includes('countries_covered') && (
                        <td className="px-6 py-5 text-center">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">{item.countries_covered} Countries</span>
                        </td>
                      )}
                      {visibleColumns.includes('learners_count') && (
                        <td className="px-6 py-5 text-center text-sm font-medium text-gray-600">
                          {item.learners_count?.toLocaleString()}
                        </td>
                      )}
                      {visibleColumns.includes('popularity') && (
                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-100 mx-auto w-fit">
                            <Zap size={14} fill="currentColor" />
                            <span className="text-xs font-bold">{item.popularity}/10</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.includes('rating') && (
                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 mx-auto w-fit">
                            <Star size={14} fill="currentColor" />
                            <span className="text-xs font-bold">{item.rating}/5.0</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.includes('status') && (
                        <td className="px-6 py-5 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${item.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {item.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); onNavigate?.(`/services/courses/${item.id}`); }}
                            className="p-2 hover:bg-indigo-50 rounded-lg transition-colors group/view"
                            title="View Details"
                          >
                            <Eye size={18} className="text-gray-400 group-hover/view:text-indigo-600" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingCourse(item); setIsAddDialogOpen(true); }}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/edit"
                            title="Edit"
                          >
                            <Edit2 size={18} className="text-gray-400 group-hover/edit:text-blue-600" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group/delete"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-gray-400 group-hover/delete:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="h-[80px] bg-white flex items-center justify-between px-6 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm font-medium">Rows per page:</span>
            <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50"><ChevronLeft size={18} strokeWidth={2} className="text-gray-500" /></button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50"><ChevronRight size={18} strokeWidth={2} className="text-gray-500" /></button>
          </div>
        </div>
      </div>

      <AddCourseDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSave}
        initialData={editingCourse}
        mode={editingCourse ? 'edit' : 'add'}
      />

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Courses"
        totalCount={metrics.totalCourses}
        selectedCount={selected.length}
        columns={exportColumns}
        supportsDateRange={false}
        onExport={handleExport}
      />

      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Courses"
        fields={importFields}
        onImport={handleImport}
        templateUrl="/templates/courses-import-template.xlsx"
        allowUpdate={true}
      />
    </div>
  );
};