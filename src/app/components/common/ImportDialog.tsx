import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  X, Upload, FileSpreadsheet, AlertCircle, CheckCircle,
  ChevronRight, ChevronLeft, Download, FileText, RefreshCw, Info
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/components/ui/utils";

export interface ImportField {
  id: string;
  label: string;
  required: boolean;
  type: 'text' | 'number' | 'date' | 'email' | 'select';
  options?: string[]; // For select type
}

export interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string; // e.g. "Tickets", "Attendees"
  fields: ImportField[]; // System fields to map to
  onImport: (data: any[], mode: ImportMode) => Promise<void>;
  templateUrl?: string; // URL to download template
  allowUpdate?: boolean; // If true, shows update/merge options
}

export type ImportMode = 'create' | 'update' | 'merge';

type Step = 'upload' | 'mode' | 'mapping' | 'validation' | 'conflict' | 'importing' | 'success';

export const ImportDialog: React.FC<ImportDialogProps> = ({
  open,
  onOpenChange,
  moduleName,
  fields,
  onImport,
  templateUrl = '#',
  allowUpdate = false
}) => {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('create');
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [sourceColumns, setSourceColumns] = useState<string[]>([]);
  const [validationStats, setValidationStats] = useState({ total: 0, valid: 0, errors: 0 });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [conflictResolution, setConflictResolution] = useState('skip');
  const [progress, setProgress] = useState(0);
  const [parsedData, setParsedData] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep('upload');
      setFile(null);
      setImportMode('create');
      setMappings({});
      setSourceColumns([]);
      setValidationStats({ total: 0, valid: 0, errors: 0 });
      setValidationErrors([]);
      setShowErrorDetails(false);
      setProgress(0);
      setParsedData([]);
    }
  }, [open]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      parseFileColumns(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      parseFileColumns(selectedFile);
    }
  };

  const parseFileColumns = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length > 0) {
        const headers = jsonData[0] as string[];
        setSourceColumns(headers);
        setParsedData(jsonData.slice(1)); // Store raw data excluding header

        // Auto-map columns
        const autoMappings: Record<string, string> = {};
        headers.forEach(col => {
          const matchedField = fields.find(f =>
            f.label.toLowerCase() === col.toLowerCase() ||
            f.id.toLowerCase() === col.toLowerCase().replace(/\s/g, '')
          );
          if (matchedField) {
            autoMappings[col] = matchedField.id;
          }
        });
        setMappings(autoMappings);
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      // Handle error gracefully
    }
  };

  const analyzeFile = () => {
    // Map parsed data to system fields
    const mappedData = parsedData.map((row: any) => {
      const newRow: any = {};
      sourceColumns.forEach((col, index) => {
        const targetField = mappings[col];
        if (targetField && targetField !== 'ignore') {
          newRow[targetField] = row[index];
        }
      });
      return newRow;
    });

    // Validate required fields
    const newErrors: string[] = [];
    let validCount = 0;

    mappedData.forEach((row, index) => {
      let isValid = true;
      fields.forEach(field => {
        if (field.required && !row[field.id]) {
          newErrors.push(`Row ${index + 2}: Missing required field: ${field.label}`);
          isValid = false;
        }
      });
      if (isValid) validCount++;
    });

    setValidationStats({
      total: parsedData.length,
      valid: validCount,
      errors: newErrors.length
    });

    setValidationErrors(newErrors);
  };

  const runImport = async () => {
    setStep('importing');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Transform data for final import
      const finalData = parsedData.map((row: any) => {
        const newRow: any = {};
        sourceColumns.forEach((col, index) => {
          const targetField = mappings[col];
          if (targetField && targetField !== 'ignore') {
            newRow[targetField] = row[index];
          }
        });
        return newRow;
      });

      await onImport(finalData, importMode);
      clearInterval(interval);
      setProgress(100);
      setStep('success');
    } catch (e) {
      console.error(e);
      clearInterval(interval);
      // Handle error UI if needed
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'upload': return !!file;
      case 'mode': return true;
      case 'mapping': return Object.keys(mappings).length > 0;
      case 'validation': return validationStats.valid > 0;
      case 'conflict': return true;
      default: return false;
    }
  };

  const handleNext = () => {
    switch (step) {
      case 'upload':
        if (allowUpdate) setStep('mode');
        else setStep('mapping');
        break;
      case 'mode': setStep('mapping'); break;
      case 'mapping':
        analyzeFile();
        setStep('validation');
        break;
      case 'validation':
        runImport();
        break;
      case 'conflict': runImport(); break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'mode': setStep('upload'); break;
      case 'mapping':
        if (allowUpdate) setStep('mode');
        else setStep('upload');
        break;
      case 'validation': setStep('mapping'); break;
      case 'conflict': setStep('validation'); break;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'upload': return `Import ${moduleName}`;
      case 'mode': return 'Import Options';
      case 'mapping': return 'Map Columns';
      case 'validation': return 'Review & Validate';
      case 'conflict': return 'Resolve Conflicts';
      case 'importing': return 'Importing...';
      case 'success': return 'Import Complete';
      default: return `Import ${moduleName}`;
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'upload': return 'Upload your file to begin the import process';
      case 'mode': return 'Choose how you want to handle the imported data';
      case 'mapping': return 'Match your file columns to system fields';
      case 'validation': return 'Review data quality before importing';
      case 'conflict': return 'Decide how to handle conflicting records';
      case 'importing': return 'Processing your data...';
      case 'success': return 'Your data has been successfully imported';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader className="p-6 border-b border-slate-100">
          <DialogTitle className="text-xl font-bold text-[#1d293d]">{getStepTitle()}</DialogTitle>
          <DialogDescription className="text-slate-500">
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 min-h-[300px]">
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="space-y-6 py-4">
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-blue-200 transition-all group"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                />
                <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {file ? <FileSpreadsheet size={28} /> : <Upload size={28} />}
                </div>
                {file ? (
                  <div>
                    <p className="font-bold text-[#1d293d] text-lg">{file.name}</p>
                    <p className="text-slate-500 text-sm mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                    <Button variant="ghost" size="sm" className="mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-[#1d293d] text-lg">Click to upload or drag & drop</p>
                    <p className="text-slate-500 text-sm mt-1">CSV, Excel (.xlsx) up to 10MB</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                    <FileText size={16} />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-[#1d293d]">Need the correct format?</div>
                    <div className="text-slate-500 text-xs">Download the template to ensure smooth import.</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-2" asChild>
                  <a href={templateUrl}>
                    <Download size={14} /> Download Template
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: MODE */}
          {step === 'mode' && (
            <div className="space-y-6 py-4">
              <RadioGroup value={importMode} onValueChange={(v) => setImportMode(v as ImportMode)} className="space-y-4">
                <div
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-xl border-2 transition-colors cursor-pointer",
                    importMode === 'create' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'
                  )}
                  onClick={() => setImportMode('create')}
                >
                  <RadioGroupItem value="create" id="mode-create" className="mt-1" />
                  <Label htmlFor="mode-create" className="cursor-pointer">
                    <div className="font-bold text-[#1d293d]">Create new records only</div>
                    <div className="text-slate-500 text-sm mt-1 font-normal">
                      Adds all rows as new entries. Duplicates may be created if not validated.
                    </div>
                  </Label>
                </div>

                {allowUpdate && (
                  <>
                    <div
                      className={cn(
                        "flex items-start space-x-3 p-4 rounded-xl border-2 transition-colors cursor-pointer",
                        importMode === 'update' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'
                      )}
                      onClick={() => setImportMode('update')}
                    >
                      <RadioGroupItem value="update" id="mode-update" className="mt-1" />
                      <Label htmlFor="mode-update" className="cursor-pointer">
                        <div className="font-bold text-[#1d293d]">Update existing records</div>
                        <div className="text-slate-500 text-sm mt-1 font-normal">
                          Updates records that match a unique ID or email. New records are ignored.
                        </div>
                      </Label>
                    </div>

                    <div
                      className={cn(
                        "flex items-start space-x-3 p-4 rounded-xl border-2 transition-colors cursor-pointer",
                        importMode === 'merge' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'
                      )}
                      onClick={() => setImportMode('merge')}
                    >
                      <RadioGroupItem value="merge" id="mode-merge" className="mt-1" />
                      <Label htmlFor="mode-merge" className="cursor-pointer">
                        <div className="font-bold text-[#1d293d]">Create and Update (Smart Merge)</div>
                        <div className="text-slate-500 text-sm mt-1 font-normal">
                          Updates existing records and creates new ones for non-matching rows.
                        </div>
                      </Label>
                    </div>
                  </>
                )}
              </RadioGroup>
            </div>
          )}

          {/* STEP 3: MAPPING */}
          {step === 'mapping' && (
            <div className="space-y-4 py-4 h-[400px] flex flex-col">
              <Alert className="bg-blue-50 border-blue-100 text-blue-800">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">Column Mapping</AlertTitle>
                <AlertDescription className="text-blue-800">
                  We&apos;ve auto-matched columns where possible. Please review and correct any mappings.
                </AlertDescription>
              </Alert>

              <div className="border border-slate-200 rounded-lg overflow-hidden flex-1 mx-1">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[40%]">Source Column (from file)</TableHead>
                      <TableHead className="w-[10%]"></TableHead>
                      <TableHead className="w-[40%]">System Field</TableHead>
                      <TableHead className="w-[10%] text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
                <ScrollArea className="h-[280px]">
                  <Table>
                    <TableBody>
                      {sourceColumns.map((col, idx) => {
                        const isMapped = !!mappings[col];
                        return (
                          <TableRow key={idx} className="hover:bg-slate-50/50">
                            <TableCell className="font-medium text-slate-700 w-[40%]">{col}</TableCell>
                            <TableCell className="text-center text-slate-400 w-[10%]">
                              <ChevronRight size={16} />
                            </TableCell>
                            <TableCell className="w-[40%]">
                              <Select
                                value={mappings[col] || "ignore"}
                                onValueChange={(val) => setMappings({ ...mappings, [col]: val === "ignore" ? "" : val })}
                              >
                                <SelectTrigger className={cn("h-9", !isMapped && 'border-amber-300 bg-amber-50 text-amber-800')}>
                                  <SelectValue placeholder="Do not import" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ignore" className="text-slate-400 italic">Do not import</SelectItem>
                                  {fields.map(field => (
                                    <SelectItem key={field.id} value={field.id}>
                                      {field.label} {field.required && '*'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right w-[10%]">
                              {isMapped ? (
                                <Badge className="bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-100">
                                  <CheckCircle size={12} className="mr-1" /> Mapped
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-amber-200 text-amber-600 bg-amber-50">
                                  <AlertCircle size={12} className="mr-1" /> Unmapped
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* STEP 4: VALIDATION */}
          {step === 'validation' && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-sm text-slate-500 font-medium">Total Rows</span>
                  <span className="text-3xl font-bold text-slate-800 mt-1">{validationStats.total}</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center text-center">
                  <span className="text-sm text-emerald-600 font-medium">Valid Rows</span>
                  <span className="text-3xl font-bold text-emerald-700 mt-1">{validationStats.valid}</span>
                </div>
                <div className={cn(
                  "p-4 rounded-xl border flex flex-col items-center justify-center text-center",
                  validationStats.errors > 0 ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'
                )}>
                  <span className={cn(
                    "text-sm font-medium",
                    validationStats.errors > 0 ? 'text-rose-600' : 'text-slate-400'
                  )}>Errors</span>
                  <span className={cn(
                    "text-3xl font-bold mt-1",
                    validationStats.errors > 0 ? 'text-rose-700' : 'text-slate-300'
                  )}>{validationStats.errors}</span>
                </div>
              </div>

              {validationStats.errors > 0 ? (
                <div className="rounded-xl border border-rose-200 overflow-hidden">
                  <div
                    className="bg-rose-50 p-3 flex justify-between items-center cursor-pointer hover:bg-rose-100 transition-colors"
                    onClick={() => setShowErrorDetails(!showErrorDetails)}
                  >
                    <div className="flex items-center gap-2 text-rose-800 font-medium text-sm">
                      <AlertCircle size={16} />
                      Found {validationStats.errors} issues that need attention
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-rose-700 hover:text-rose-900 hover:bg-rose-200 rounded-full"
                    >
                      <div className={cn("transition-transform", showErrorDetails && "rotate-90")}>
                        <ChevronRight size={14} />
                      </div>
                    </Button>
                  </div>

                  {showErrorDetails && (
                    <div className="max-h-[200px] overflow-y-auto p-0 bg-white">
                      <Table>
                        <TableBody>
                          {validationErrors.map((err, i) => (
                            <TableRow key={i} className="hover:bg-rose-50/30">
                              <TableCell className="py-2 text-sm text-slate-600 border-b border-rose-50">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />
                                {err}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              ) : (
                <Alert className="bg-emerald-50 border-emerald-100 text-emerald-800">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <AlertTitle className="text-emerald-900">Ready to Import</AlertTitle>
                  <AlertDescription className="text-emerald-800">
                    All {validationStats.total} rows have been validated successfully.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* STEP 5: CONFLICT */}
          {step === 'conflict' && (
            <div className="space-y-6 py-4">
              <Alert className="bg-amber-50 border-amber-100 text-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-900">Potential Conflicts Detected</AlertTitle>
                <AlertDescription className="text-amber-800">
                  Some records match existing data in the system. How should we handle them?
                </AlertDescription>
              </Alert>

              <RadioGroup value={conflictResolution} onValueChange={setConflictResolution} className="space-y-4">
                <div
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-xl border-2 transition-colors cursor-pointer",
                    conflictResolution === 'skip' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'
                  )}
                  onClick={() => setConflictResolution('skip')}
                >
                  <RadioGroupItem value="skip" id="res-skip" className="mt-1" />
                  <Label htmlFor="res-skip" className="cursor-pointer">
                    <div className="font-bold text-[#1d293d]">Skip conflicting rows</div>
                    <div className="text-slate-500 text-sm mt-1 font-normal">
                      Keep existing data. Import row will be ignored.
                    </div>
                  </Label>
                </div>

                <div
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-xl border-2 transition-colors cursor-pointer",
                    conflictResolution === 'overwrite' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'
                  )}
                  onClick={() => setConflictResolution('overwrite')}
                >
                  <RadioGroupItem value="overwrite" id="res-overwrite" className="mt-1" />
                  <Label htmlFor="res-overwrite" className="cursor-pointer">
                    <div className="font-bold text-[#1d293d]">Overwrite existing data</div>
                    <div className="text-slate-500 text-sm mt-1 font-normal">
                      Update the record with data from the file. This cannot be undone.
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* STEP 6: IMPORTING */}
          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative h-16 w-16">
                <RefreshCw className="h-16 w-16 text-blue-600 animate-spin" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-[#1d293d]">Importing Data...</h3>
                <p className="text-slate-500">Please wait while we process your file.</p>
              </div>
              <div className="w-full max-w-xs space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Processing rows...</span>
                  <span>{progress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: SUCCESS */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                <CheckCircle size={40} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-[#1d293d]">Import Complete</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Successfully imported <strong>{validationStats.valid} records</strong> into {moduleName}.
                  {validationStats.errors > 0 && ` ${validationStats.errors} rows were skipped due to errors.`}
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                {validationStats.errors > 0 && (
                  <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
                    <Download size={16} className="mr-2" /> Download Error Log
                  </Button>
                )}
                <Button className="bg-[#0f172b] px-8" onClick={() => onOpenChange(false)}>
                  Close & View Data
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Hidden during importing/success */}
        {step !== 'importing' && step !== 'success' && (
          <DialogFooter className="p-6 border-t border-slate-100 bg-slate-50/50">
            {step !== 'upload' ? (
              <Button variant="ghost" onClick={handleBack} className="mr-auto text-slate-500 hover:text-slate-800">
                <ChevronLeft size={16} className="mr-1" /> Back
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="mr-auto text-slate-500 hover:text-slate-800">
                Cancel
              </Button>
            )}

            <Button
              onClick={handleNext}
              className="bg-[#0f172b]"
              disabled={!canProceed()}
            >
              {step === 'validation' || step === 'conflict' ? 'Run Import' : 'Next'}
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
