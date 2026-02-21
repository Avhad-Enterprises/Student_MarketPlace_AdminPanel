import React, { useState, useEffect } from 'react';
import {
  Download,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  FileJson,
  File,
  X,
  Loader2
} from 'lucide-react';
import { DateInput } from '@/components/ui/date-input';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";

export interface ExportColumn {
  id: string;
  label: string;
  defaultSelected?: boolean;
}

export interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string; // e.g., "Tickets", "Add-ons"
  totalCount?: number;
  selectedCount?: number;
  columns?: ExportColumn[];
  supportsDateRange?: boolean;
  onExport: (options: ExportOptions) => Promise<void>;
}

export interface ExportOptions {
  scope: 'all' | 'current' | 'selected';
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  detailLevel: 'summary' | 'detailed' | 'full';
  dateRange?: {
    from: string;
    to: string;
  };
  selectedColumns: string[];
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  moduleName,
  totalCount = 0,
  selectedCount = 0,
  columns = [],
  supportsDateRange = false,
  onExport
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [scope, setScope] = useState<'all' | 'current' | 'selected'>('all');
  const [format, setFormat] = useState<'csv' | 'xlsx' | 'pdf' | 'json'>('csv');
  const [detailLevel, setDetailLevel] = useState<'summary' | 'detailed' | 'full'>('detailed');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize on open
  useEffect(() => {
    if (open) {
      setSelectedColumnIds(
        columns
          .filter(c => c.defaultSelected !== false)
          .map(c => c.id)
      );
      setScope('all');
      setFormat('csv');
      setDetailLevel('detailed');
      setDateFrom('');
      setDateTo('');
      setError(null);
      setIsExporting(false);
    }
  }, [open, columns]);

  const toggleColumn = (id: string) => {
    if (selectedColumnIds.includes(id)) {
      setSelectedColumnIds(selectedColumnIds.filter(c => c !== id));
    } else {
      setSelectedColumnIds([...selectedColumnIds, id]);
    }
  };

  const toggleAllColumns = () => {
    if (selectedColumnIds.length === columns.length) {
      setSelectedColumnIds([]);
    } else {
      setSelectedColumnIds(columns.map(c => c.id));
    }
  };

  const handleExport = async () => {
    setError(null);
    setIsExporting(true);

    try {
      await onExport({
        scope,
        format,
        detailLevel,
        dateRange: supportsDateRange && dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined,
        selectedColumns: selectedColumnIds
      });

      onOpenChange(false);
    } catch (err) {
      setError("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader className="p-6 border-b border-slate-100">
          <DialogTitle className="text-xl font-bold text-[#1d293d]">Export Data</DialogTitle>
          <DialogDescription className="text-slate-500">
            Export data from {moduleName}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
          {/* 1. Export Scope */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-900">Export Scope</Label>
            <RadioGroup value={scope} onValueChange={(val: any) => setScope(val)} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="scope-all" />
                <Label htmlFor="scope-all" className="font-normal cursor-pointer">
                  Export all items ({totalCount})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="scope-current" />
                <Label htmlFor="scope-current" className="font-normal cursor-pointer">
                  Export current view
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selected" id="scope-selected" disabled={selectedCount === 0} />
                <Label
                  htmlFor="scope-selected"
                  className={cn("font-normal cursor-pointer", selectedCount === 0 && "text-slate-400")}
                >
                  Export selected items {selectedCount > 0 ? `(${selectedCount})` : ''}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 2. Export Format */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-900">Export Format</Label>
            <div className="grid grid-cols-2 gap-3">
              {/* CSV Card */}
              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  format === 'csv' ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-200 hover:bg-slate-50"
                )}
                onClick={() => setFormat('csv')}
              >
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-md">
                  <FileSpreadsheet size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">CSV</span>
                  <span className="text-[10px] text-slate-500">Universal format</span>
                </div>
                {format === 'csv' && (
                  <div className="ml-auto text-slate-900">
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                  </div>
                )}
              </div>

              {/* Excel Card */}
              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  format === 'xlsx' ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-200 hover:bg-slate-50"
                )}
                onClick={() => setFormat('xlsx')}
              >
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-md">
                  <FileSpreadsheet size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">Excel</span>
                  <span className="text-[10px] text-slate-500">.xlsx format</span>
                </div>
                {format === 'xlsx' && (
                  <div className="ml-auto text-slate-900">
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                  </div>
                )}
              </div>

              {/* PDF Card */}
              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  format === 'pdf' ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-200 hover:bg-slate-50"
                )}
                onClick={() => setFormat('pdf')}
              >
                <div className="bg-red-100 text-red-600 p-2 rounded-md">
                  <FileText size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">PDF</span>
                  <span className="text-[10px] text-slate-500">Document format</span>
                </div>
                {format === 'pdf' && (
                  <div className="ml-auto text-slate-900">
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                  </div>
                )}
              </div>

              {/* JSON Card */}
              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  format === 'json' ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-200 hover:bg-slate-50"
                )}
                onClick={() => setFormat('json')}
              >
                <div className="bg-amber-100 text-amber-600 p-2 rounded-md">
                  <FileJson size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">JSON</span>
                  <span className="text-[10px] text-slate-500">Structured data</span>
                </div>
                {format === 'json' && (
                  <div className="ml-auto text-slate-900">
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Data Detail Level */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-900">Data Detail Level</Label>
            <Select value={detailLevel} onValueChange={(val: any) => setDetailLevel(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select detail level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">
                  <div>
                    <span className="font-medium block">Summary</span>
                    <span className="text-xs text-slate-500">Key metrics and high-level data only</span>
                  </div>
                </SelectItem>
                <SelectItem value="detailed">
                  <div>
                    <span className="font-medium block">Detailed</span>
                    <span className="text-xs text-slate-500">Standard set of fields for reporting</span>
                  </div>
                </SelectItem>
                <SelectItem value="full">
                  <div>
                    <span className="font-medium block">Full Export</span>
                    <span className="text-xs text-slate-500">All available data fields including metadata</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. Date Range (Conditional) */}
          {supportsDateRange && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-900">Date Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">From Date</Label>
                  <DateInput
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="block"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">To Date</Label>
                  <DateInput
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="block"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. Column Selection (Collapsible) */}
          {columns.length > 0 && (
            <Collapsible
              open={isColumnsOpen}
              onOpenChange={setIsColumnsOpen}
              className="space-y-2 border rounded-lg p-3 bg-slate-50/50"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-slate-700 hover:text-slate-900">
                <span>Select columns to include</span>
                {isColumnsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-3 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700"
                    onClick={toggleAllColumns}
                  >
                    {selectedColumnIds.length === columns.length ? 'Deselect all' : 'Select all'}
                  </Button>
                  <span className="text-xs text-slate-400">{selectedColumnIds.length} selected</span>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar-light">
                  {columns.map(col => (
                    <div key={col.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${col.id}`}
                        checked={selectedColumnIds.includes(col.id)}
                        onCheckedChange={() => toggleColumn(col.id)}
                      />
                      <Label
                        htmlFor={`col-${col.id}`}
                        className="text-sm font-normal cursor-pointer truncate"
                        title={col.label}
                      >
                        {col.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* 6. Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5" />
              <p className="text-sm text-red-600 flex-1">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t border-slate-100 bg-slate-50/50">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            className="bg-[#0f172b] min-w-[120px]"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};