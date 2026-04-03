"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, ArrowUpDown, Columns, Download, Upload,
  Plus, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight,
  Utensils, Globe, Zap, ShieldCheck, DollarSign,
  CheckCircle2, XCircle, ChevronDown, Eye, RefreshCw
} from 'lucide-react';
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { ServicePageHeader } from './service-marketplace/ServicePageHeader';
import { ServiceMetricGrid } from './service-marketplace/ServiceMetricGrid';
import { CustomCheckbox, StatusBadge } from './service-marketplace/CommonUI';
import * as XLSX from 'xlsx';
import { AddFoodDialog } from './common/AddFoodDialog';
import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { Food, getAllFood, createFood, updateFood, deleteFood, getFoodMetrics } from '../services/foodService';


const MobileFoodCard: React.FC<{
  item: Food;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: (item: Food) => void;
  onDelete: (id: string) => void;
  onNavigate?: (page: string) => void;
}> = ({ item, isSelected, onToggleSelect, onEdit, onDelete, onNavigate }) => (
  <div className={`bg-white p-4 rounded-2xl border ${isSelected ? 'border-pink-600 bg-pink-50/30' : 'border-gray-100'} shadow-sm space-y-4`}>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <CustomCheckbox checked={isSelected} onChange={onToggleSelect} />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs">{item.platform.charAt(0)}</div>
          <div>
            <h3 className="font-bold text-[#253154] text-[15px]">{item.platform}</h3>
            <p className="text-gray-500 text-[10px]">Ref: {item.reference_id}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${item.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {item.status === 'active' ? 'Active' : 'Inactive'}
        </span>
        {item.verified && <div className="flex items-center gap-1 text-green-500 text-[10px]"><CheckCircle2 size={12} /> Verified</div>}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-3 border-y border-gray-50">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service</p>
        <p className="text-xs font-medium text-gray-700">{item.service_type}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg Cost</p>
        <p className="text-xs font-bold text-gray-900">{item.avg_cost}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Countries</p>
        <p className="text-xs font-medium text-gray-700">{item.countries_covered} Covered</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Popularity</p>
        <div className="flex items-center gap-1 text-yellow-600 font-bold text-xs"><Zap size={10} fill="currentColor" /> {item.popularity}/10</div>
      </div>
    </div>

    <div className="flex items-center justify-end gap-2 pt-1">
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate?.(`/services/food/${item.id}`); }}
        className="p-2.5 bg-pink-50 text-pink-610 rounded-xl hover:bg-pink-100 transition-colors"
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

export const FoodOverviewPage = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  // State for data
  const [foodData, setFoodData] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalPartners: 0,
    activeUsers: '0',
    countriesServed: 0,
    studentSavings: '$0'
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
  const [filterServiceType, setFilterServiceType] = useState('all');

  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Food | null>(null);

  // Export state
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({ from: subDays(new Date(), 29), to: new Date() });
  const [selected, setSelected] = useState<string[]>([]);


  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['platform', 'service_type', 'offer_details', 'avg_cost', 'countries', 'status', 'verified', 'actions']);

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
        service_type: filterServiceType !== 'all' ? filterServiceType : undefined,
        sort: sortField,
        order: sortOrder,
        dateRange: date
      };
      const result = await getAllFood(params);
      setFoodData(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);

      const metricsResult = await getFoodMetrics();
      setMetrics(metricsResult.data);
    } catch (error) {
      toast.error("Failed to fetch food data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, rowsPerPage, debouncedSearch, filterStatus, filterServiceType, sortField, sortOrder]);

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
      if (editingPlatform) {
        await updateFood(editingPlatform.id, data);
      } else {
        await createFood(data);
      }
      fetchData();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this food platform?")) return;
    try {
      await deleteFood(id);
      toast.success("Platform deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete platform");
    }
  };

  const columns = [
    { id: 'id', label: 'Database ID', defaultSelected: false },
    { id: 'reference_id', label: 'Reference ID', defaultSelected: true },
    { id: 'platform', label: 'Platform', defaultSelected: true },
    { id: 'service_type', label: 'Service Type', defaultSelected: true },
    { id: 'offer_details', label: 'Offer Details', defaultSelected: true },
    { id: 'avg_cost', label: 'Avg Cost', defaultSelected: true },
    { id: 'countries_covered', label: 'Countries', defaultSelected: true },
    { id: 'popularity', label: 'Popularity', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'verified', label: 'Verified', defaultSelected: true },
    { id: 'actions', label: 'Actions' }
  ];

  const exportColumns: ExportColumn[] = columns.filter(col => col.id !== 'actions').map(col => ({
    id: col.id,
    label: col.label,
    defaultSelected: col.id !== 'id'
  }));

  const importFields: ImportField[] = [
    { id: 'id', label: 'Database ID (For Updates)', required: false, type: 'text' },
    { id: 'reference_id', label: 'Reference ID', required: false, type: 'text' },
    { id: 'platform', label: 'Platform Name', required: true, type: 'text' },
    { id: 'service_type', label: 'Service Type', required: true, type: 'select', options: ['Delivery', 'Meal Kits', 'Grocery Discounts', 'Student Specials'] },
    { id: 'offer_details', label: 'Offer Details', required: false, type: 'text' },
    { id: 'countries_covered', label: 'Countries Covered', required: false, type: 'text' },
    { id: 'avg_cost', label: 'Avg Cost/Month', required: false, type: 'text' },
    { id: 'verified', label: 'Verified Platform', required: false, type: 'select', options: ['Yes', 'No'] },
    { id: 'status', label: 'Status', required: false, type: 'select', options: ['active', 'inactive'] },
    { id: 'student_visible', label: 'Visible to Students', required: false, type: 'select', options: ['Yes', 'No'] },
    { id: 'popularity', label: 'Popularity Score', required: false, type: 'text' }
  ];


  const handleExport = async (options: any) => {
    try {
      setIsLoading(true);
      let dataToExport: any[] = [];

      if (options.scope === 'all') {
        const result = await getAllFood({ limit: 1000 });
        dataToExport = result.data;
      } else if (options.scope === 'selected') {
        dataToExport = foodData.filter(i => selected.includes(i.id));
      } else {
        dataToExport = foodData;
      }

      const mappedData = dataToExport.map(item => {
        const row: any = {};
        options.selectedColumns.forEach((colId: string) => {
          row[colId] = item[colId as keyof Food];
        });
        return row;
      });

      if (options.format === 'json') {
        const blob = new Blob([JSON.stringify(mappedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `food_export_${Date.now()}.json`;
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
              <title>Food Export ${dateStr}</title>
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
                <h1>Food Records Export</h1>
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Food");

        if (options.format === 'csv') {
          XLSX.writeFile(workbook, `food_export_${Date.now()}.csv`, { bookType: 'csv' });
        } else {
          XLSX.writeFile(workbook, `food_export_${Date.now()}.xlsx`);
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
    console.log('Importing food data:', data, 'mode:', mode);
    let successCount = 0;
    let failCount = 0;

    const loadingToast = toast.loading(`Importing food (0/${data.length})...`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        const payload = {
          reference_id: (row.reference_id || '').trim(),
          platform: row.platform,
          service_type: row.service_type || 'Delivery',
          offer_details: row.offer_details || '',
          countries_covered: Number(row.countries_covered) || 0,
          avg_cost: row.avg_cost || '',
          verified: row.verified === 'Yes',
          status: (row.status || 'active').toLowerCase() as 'active' | 'inactive',
          student_visible: row.student_visible === 'Yes',
          popularity: Number(row.popularity) || 1
        };

        let targetId = row.id;
        if (!targetId && row.reference_id && (mode === 'update' || mode === 'merge')) {
          const searchResult = await getAllFood({ search: row.reference_id.trim(), limit: 10 });
          const existingItem = searchResult.data?.find((i: any) => 
            i.reference_id?.trim().toLowerCase() === row.reference_id.trim().toLowerCase()
          );
          if (existingItem) {
            targetId = existingItem.id;
          }
        }

        if ((mode === 'update' || mode === 'merge') && targetId) {
          await updateFood(targetId, payload);
        } else {
          await createFood(payload);
        }
        successCount++;
      } catch (error) {
        console.error(`Failed to import food row ${i + 1}:`, error);
        failCount++;
      }
      toast.loading(`Importing food (${successCount + failCount}/${data.length})...`, { id: loadingToast });
    }

    toast.dismiss(loadingToast);
    if (successCount > 0) {
      toast.success(`Import complete! ${successCount} successful, ${failCount} failed.`);
    } else {
      toast.error(`Import failed! All ${failCount} rows failed.`);
    }

    setShowImportDialog(false);
    fetchData();
  };


  const metricCards = [
    { title: 'Total Partners', value: metrics.totalPartners.toString(), icon: Utensils, bgClass: 'bg-pink-50', colorClass: 'text-pink-600', tooltip: 'Total food delivery and discount partners' },
    { title: 'Active Users', value: metrics.activeUsers, icon: Zap, bgClass: 'bg-yellow-50', colorClass: 'text-yellow-600', tooltip: 'Students actively using food discounts' },
    { title: 'Countries Served', value: metrics.countriesServed.toString(), icon: Globe, bgClass: 'bg-blue-50', colorClass: 'text-blue-600', tooltip: 'Countries with active food partnerships' },
    { title: 'Student Savings', value: metrics.studentSavings, icon: DollarSign, bgClass: 'bg-green-50', colorClass: 'text-green-600', tooltip: 'Estimated total savings for students' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">
      <ServicePageHeader 
        title="Food & Dining" 
        dateRange={date} 
        onDateChange={setDate}
        onRefresh={fetchData}
        onExport={() => setShowExportDialog(true)}
        onImport={() => setShowImportDialog(true)}
        onAdd={() => { setEditingPlatform(null); setIsAddDialogOpen(true); }}
        addLabel="Add Platform"
      />

      <ServiceMetricGrid metrics={metricCards} />

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-pink-900/5 overflow-hidden">
        <div className="hidden md:flex justify-between items-center gap-4 p-6 border-b border-gray-50">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food platforms..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-[15px] font-medium"
            />
          </div>
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center">
              <RefreshCw size={40} className="text-pink-600 animate-spin" />
            </div>
          )}

          {/* Mobile View */}
          <div className="md:hidden space-y-4 p-4">
            {foodData.length > 0 ? (
              foodData.map((item) => (
                <MobileFoodCard
                  key={item.id}
                  item={item}
                  isSelected={selected.includes(item.id)}
                  onToggleSelect={() => setSelected(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                  onEdit={setEditingPlatform}
                  onDelete={handleDelete}
                  onNavigate={onNavigate}
                />
              ))
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <Utensils size={24} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No results found</p>
                <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                  We couldn't find any food platforms matching your filters.
                </p>
              </div>
            )}
          </div>

          {/* Desktop View Table */}
          <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-6 py-4 text-left w-12">
                    <CustomCheckbox
                      checked={selected.length === foodData.length && foodData.length > 0}
                      onChange={() => setSelected(selected.length === foodData.length ? [] : foodData.map(i => i.id))}
                    />
                  </th>
                  {visibleColumns.includes('reference_id') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>}
                  {visibleColumns.includes('platform') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Platform</th>}
                  {visibleColumns.includes('service_type') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Service Type</th>}
                  {visibleColumns.includes('offer_details') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Offer Details</th>}
                  {visibleColumns.includes('avg_cost') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Avg Cost</th>}
                  {visibleColumns.includes('countries_covered') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Countries</th>}
                  {visibleColumns.includes('popularity') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Popularity</th>}
                  {visibleColumns.includes('status') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>}
                  {visibleColumns.includes('verified') && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Verified</th>}
                  {visibleColumns.includes('actions') && <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {foodData.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length + 2} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                          <Utensils className="text-gray-300" size={24} />
                        </div>
                        <p className="text-gray-500 font-medium">No results found</p>
                        <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                          We couldn't find any food platforms matching your filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  foodData.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer ${selected.includes(item.id) ? 'bg-pink-50/30' : ''}`}
                      onClick={() => onNavigate?.(`/services/food/${item.id}`)}
                    >
                      <td className="px-6 py-5">
                        <CustomCheckbox
                          checked={selected.includes(item.id)}
                          onChange={() => setSelected(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                        />
                      </td>
                      {visibleColumns.includes('reference_id') && <td className="px-6 py-5 text-sm text-gray-500 font-medium">{item.reference_id}</td>}
                      {visibleColumns.includes('platform') && (
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold">{item.platform.charAt(0)}</div>
                            <span className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors uppercase tracking-tight">{item.platform}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.includes('service_type') && <td className="px-6 py-5 text-sm text-gray-600 font-medium">{item.service_type}</td>}
                      {visibleColumns.includes('offer_details') && <td className="px-6 py-5 text-sm text-gray-600 max-w-[200px] truncate">{item.offer_details}</td>}
                      {visibleColumns.includes('avg_cost') && <td className="px-6 py-5 text-sm text-gray-900 font-bold text-center">{item.avg_cost}</td>}
                      {visibleColumns.includes('countries_covered') && (
                        <td className="px-6 py-5 text-center">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">{item.countries_covered} Countries</span>
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
                      {visibleColumns.includes('status') && (
                        <td className="px-6 py-5 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${item.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {item.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.includes('verified') && (
                        <td className="px-6 py-5 text-center">
                          {item.verified ? <CheckCircle2 className="text-green-500 mx-auto" size={20} /> : <XCircle className="text-gray-300 mx-auto" size={20} />}
                        </td>
                      )}
                      <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); onNavigate?.(`/services/food/${item.id}`); }}
                            className="p-2 hover:bg-pink-50 rounded-lg transition-colors group/view"
                            title="View Details"
                          >
                            <Eye size={18} className="text-gray-400 group-hover/view:text-pink-610" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingPlatform(item); setIsAddDialogOpen(true); }}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddFoodDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSave}
        initialData={editingPlatform}
        mode={editingPlatform ? 'edit' : 'add'}
      />

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Food"
        totalCount={metrics.totalPartners}
        selectedCount={selected.length}
        columns={exportColumns}
        supportsDateRange={false}
        onExport={handleExport}
      />

      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Food"
        fields={importFields}
        onImport={handleImport}
        templateUrl="/templates/food-import-template.xlsx"
        allowUpdate={true}
      />
    </div>
  );
};