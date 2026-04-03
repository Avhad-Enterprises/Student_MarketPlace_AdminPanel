"use client";

import React from 'react';
import { 
  RefreshCw, 
  Download, 
  Upload, 
  Plus 
} from 'lucide-react';
import { DateRange } from "react-day-picker";
import { GlobalDateFilter } from '../common/GlobalDateFilter';

interface ServicePageHeaderProps {
  title: string;
  dateRange?: DateRange;
  onDateChange?: (range: DateRange | undefined) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onAdd?: () => void;
  addLabel?: string;
}

export const ServicePageHeader: React.FC<ServicePageHeaderProps> = ({
  title,
  dateRange,
  onDateChange,
  onRefresh,
  onExport,
  onImport,
  onAdd,
  addLabel = "Add Record"
}) => {
  return (
    <div className="flex justify-between items-center gap-4 mb-8">
      {/* Date Range & Refresh */}
      <div className="flex items-center gap-3">
        <GlobalDateFilter
          date={dateRange}
          onDateChange={onDateChange || (() => {})}
          className="w-[300px]"
        />
        <button 
          onClick={onRefresh} 
          className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:rotate-180 duration-500 shadow-sm"
          title="Refresh Data"
        >
          <RefreshCw size={20} className="text-[#253154]" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {onExport && (
          <button 
            onClick={onExport} 
            className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"
          >
            <Download size={20} strokeWidth={1.5} />
            Export
          </button>
        )}
        {onImport && (
          <button 
            onClick={onImport} 
            className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"
          >
            <Upload size={20} strokeWidth={1.5} />
            Import
          </button>
        )}
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium"
          >
            <Plus size={20} strokeWidth={1.5} />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
};
