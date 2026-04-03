import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  RefreshCw,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Search,
  Copy,
  Printer,
  XCircle,
  Archive,
  Edit,
  Check,
  Columns,
  FileText,
  Plane,
  Clock,
  CheckCircle,
  AlertOctagon,
  Eye,
  Flag,
  StickyNote,
  History,
  Trash2
} from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { ServicePageHeader } from './service-marketplace/ServicePageHeader';
import { ServiceMetricGrid } from './service-marketplace/ServiceMetricGrid';
import { CustomCheckbox } from './service-marketplace/CommonUI';

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { getAllStatusTracking, BackendStatusItem, getStatusByStudentId, updateStatus, getStatusMetrics } from '../services/statusTrackingService';
import { getAllApplications } from '../services/applicationsService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

// --- StageBadge Component ---
interface StageBadgeProps {
  stage: any;
}

const StageBadge: React.FC<StageBadgeProps> = ({ stage }) => {
  const normalizedStage = (stage || '').toLowerCase().trim();
  const stageConfig: Record<string, any> = {
    'profile': {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      label: 'Profile'
    },
    'application': {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
      label: 'Application'
    },
    'visa': {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-300',
      label: 'Visa'
    },
    'completed': {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      label: 'Completed'
    }
  };

  const config = stageConfig[normalizedStage] || {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
    label: stage || 'Unknown'
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[100px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

// --- SubStatusBadge Component ---
interface SubStatusBadgeProps {
  subStatus: string;
}

const SubStatusBadge: React.FC<SubStatusBadgeProps> = ({ subStatus }) => {
  return (
    <span className="px-2 py-1 rounded text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
      {subStatus}
    </span>
  );
};

// --- RiskBadge Component ---
interface RiskBadgeProps {
  level: any;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const normalizedLevel = (level || '').toLowerCase().trim();
  const riskConfig: Record<string, any> = {
    low: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
      label: 'Low'
    },
    medium: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200',
      label: 'Medium'
    },
    high: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
      label: 'High'
    }
  };

  const config = riskConfig[normalizedLevel] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    label: level || 'Unknown'
  };

  return (
    <span className={`px-2 py-1 rounded text-[11px] font-medium border inline-flex items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};


// --- MobileStatusCard Component ---
interface StudentStatus {
  id: string;
  dbId: number; // For API calls
  studentName: string;
  currentStage: string;
  subStatus: string;
  country: string;
  counselor: string;
  riskLevel: string;
  lastStatusChange: string;
  applicationRef: string;
  isFlagged?: boolean;
}

interface MobileStatusCardProps {
  status: StudentStatus;
  isSelected: boolean;
  onToggleSelect: () => void;
  onOpenTimeline: (status: StudentStatus) => void;
  onOpenStatusUpdate: (status: StudentStatus) => void;
  onDelete: (status: StudentStatus) => void;
}

const MobileStatusCard: React.FC<MobileStatusCardProps> = ({
  status,
  isSelected,
  onToggleSelect,
  onOpenTimeline,
  onOpenStatusUpdate,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 w-full transition-all active:scale-[0.99] cursor-pointer flex flex-col gap-2 ${isSelected ? 'bg-purple-50/30' : ''}`}>
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-[#253154] text-[15px]">{status.id}</span>
        <span className="bg-[#F4F4F4] text-gray-500 text-[10px] px-2 py-1 rounded-lg">Tap to view</span>
        <span className="ml-auto"><RiskBadge level={status.riskLevel} /></span>
        <button
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Middle row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-gray-600 text-sm font-medium">{status.studentName}</span>
        <div className="ml-auto transform scale-90 origin-right">
          <StageBadge stage={status.currentStage} />
        </div>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div className="mt-2 pt-3 border-t border-gray-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Sub-Status</div>
              <div className="text-sm text-gray-700 font-medium"><SubStatusBadge subStatus={status.subStatus} /></div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Country</div>
              <div className="text-sm text-gray-700 font-medium">{status.country}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Counselor</div>
              <div className="text-sm text-gray-700 font-medium">{status.counselor}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Last Update</div>
              <div className="text-sm text-gray-700 font-medium">{status.lastStatusChange}</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onOpenTimeline(status); }}
              className="w-full h-10 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0c4a] transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <Eye size={16} /> View Timeline
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onOpenStatusUpdate(status); }}
                className="w-full h-10 bg-white border border-gray-100 text-[#253154] rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Edit size={16} /> Update
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(status); }}
                className="w-full h-10 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export const StatusTrackingOverviewPage: React.FC = () => {
  // State management
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date()
  });
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search'>('none');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'student', 'stage', 'subStatus', 'country', 'counselor', 'risk']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All Levels');
  const [sortBy, setSortBy] = useState<string>('lastStatusChange');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dialog states
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Per-row action modal states
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentStatus | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Form states for modals
  const [updateForm, setUpdateForm] = useState({
    stage: '',
    subStatus: '',
    notes: ''
  });
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [linkedApplications, setLinkedApplications] = useState<any[]>([]);

  // Metrics state
  const [metricsData, setMetricsData] = useState({
    applicationCount: 0,
    visaCount: 0,
    awaitingDecisionCount: 0,
    completedCount: 0,
    blockedCount: 0
  });

  // Dynamic data states
  const [statuses, setStatuses] = useState<StudentStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch logic
  const fetchStatuses = async (query = searchQuery, stage = stageFilter, risk = riskFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        search: query || undefined,
        stage: stage !== 'All' ? stage.toLowerCase() : undefined,
        risk_level: risk !== 'All Levels' ? risk.toLowerCase() : undefined
      };

      const data = await getAllStatusTracking(params);

      // Map backend data to frontend interface
      let mappedData: StudentStatus[] = data.map((item: BackendStatusItem) => ({
        id: item.student_id,
        dbId: item.db_id,
        studentName: `${item.first_name} ${item.last_name}`,
        currentStage: item.stage,
        subStatus: item.sub_status || 'Unknown',
        country: item.country,
        counselor: item.counselor,
        riskLevel: item.risk_level,
        lastStatusChange: item.last_update ? format(new Date(item.last_update), 'MMM dd, y p') : 'No update',
        applicationRef: '-'
      }));

      // Client-side sorting
      mappedData.sort((a, b) => {
        let valA: any = a[sortBy as keyof StudentStatus];
        let valB: any = b[sortBy as keyof StudentStatus];

        // Special handling for dates
        if (sortBy === 'lastStatusChange' || sortBy === 'lastUpdate') {
          valA = new Date(a.lastStatusChange).getTime();
          valB = new Date(b.lastStatusChange).getTime();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      setStatuses(mappedData);
    } catch (err) {
      console.error('Failed to fetch statuses:', err);
      setError('Failed to load status tracking data');
      toast.error("Failed to load status tracking data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const data = await getStatusMetrics();
      setMetricsData(data);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  // Handle search with debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchStatuses(searchQuery, stageFilter, riskFilter);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle filter changes immediately
  React.useEffect(() => {
    fetchStatuses(searchQuery, stageFilter, riskFilter);
    fetchMetrics();
  }, [stageFilter, riskFilter, sortBy, sortOrder]);

  const metrics = [
    {
      title: 'Application Stage',
      value: metricsData.applicationCount.toString(),
      icon: FileText,
      bgClass: 'bg-purple-50',
      colorClass: 'text-purple-600',
      tooltip: 'Students in application preparation stage'
    },
    {
      title: 'Visa Stage',
      value: metricsData.visaCount.toString(),
      icon: Plane,
      bgClass: 'bg-amber-50',
      colorClass: 'text-amber-600',
      tooltip: 'Students currently in visa processing stage'
    },
    {
      title: 'Awaiting Decision',
      value: metricsData.awaitingDecisionCount.toString(),
      icon: Clock,
      bgClass: 'bg-blue-50',
      colorClass: 'text-blue-600',
      tooltip: 'Students awaiting university or visa decision'
    },
    {
      title: 'Approved / Completed',
      value: metricsData.completedCount.toString(),
      icon: CheckCircle,
      bgClass: 'bg-green-50',
      colorClass: 'text-green-600',
      tooltip: 'Successfully completed applications'
    },
    {
      title: 'Blocked / Stalled',
      value: metricsData.blockedCount.toString(),
      icon: AlertOctagon,
      bgClass: 'bg-red-50',
      colorClass: 'text-red-600',
      tooltip: 'Cases that are blocked or have stalled'
    }
  ];

  // Handlers for Row Actions
  const handleOpenStatusUpdate = (status: StudentStatus) => {
    setSelectedStudent(status);
    setUpdateForm({
      stage: status.currentStage,
      subStatus: status.subStatus,
      notes: ''
    });
    setShowStatusUpdateModal(true);
  };

  const handleOpenTimeline = async (status: StudentStatus) => {
    setSelectedStudent(status);
    setShowTimelineModal(true);
    try {
      const history = await getStatusByStudentId(status.id);
      setStatusHistory(history);
    } catch (err) {
      toast.error("Failed to load status history");
    }
  };

  const handleOpenNote = (status: StudentStatus) => {
    setSelectedStudent(status);
    setNewNote('');
    setShowNoteModal(true);
  };

  const handleOpenApplications = async (status: StudentStatus) => {
    setSelectedStudent(status);
    setShowApplicationsModal(true);
    try {
      // Use applications service to find by student
      const response = await getAllApplications({ search: status.studentName });
      setLinkedApplications(response.data || []);
    } catch (err) {
      toast.error("Failed to load applications");
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStudent || !updateForm.stage || !updateForm.subStatus) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStatus({
        studentDbId: selectedStudent.dbId,
        stage: updateForm.stage,
        subStatus: updateForm.subStatus,
        notes: updateForm.notes,
        changedBy: 'Admin' // Should come from auth context
      });
      toast.success("Status updated successfully");
      setShowStatusUpdateModal(false);
      fetchStatuses();
      fetchMetrics();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedStudent || !newNote.trim()) return;

    setIsSubmitting(true);
    try {
      // In this backend, notes are part of status_history
      // We'll reuse the updateStatus endpoint but keep the stage and sub-status the same
      await updateStatus({
        studentDbId: selectedStudent.dbId,
        stage: selectedStudent.currentStage,
        subStatus: selectedStudent.subStatus,
        notes: newNote,
        changedBy: 'Admin'
      });
      toast.success("Note added successfully");
      setShowNoteModal(false);
    } catch (err) {
      toast.error("Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFlag = (studentId: string) => {
    setStatuses(prev => prev.map(s =>
      s.id === studentId ? { ...s, isFlagged: !s.isFlagged } : s
    ));
    toast.success("Student flagged status updated");
  };

  // Column configuration
  const allColumns = [
    { key: 'id', label: 'Student ID' },
    { key: 'student', label: 'Student Name' },
    { key: 'stage', label: 'Current Stage' },
    { key: 'subStatus', label: 'Sub-Status' },
    { key: 'country', label: 'Country' },
    { key: 'counselor', label: 'Assigned Counselor' },
    { key: 'risk', label: 'Risk Level' },
    { key: 'lastChange', label: 'Last Status Change' },
    { key: 'appRef', label: 'Application Ref' }
  ];

  // Handlers
  const handleRefresh = async () => {
    toast.promise(fetchStatuses(), {
      loading: 'Refreshing data...',
      success: 'Data refreshed successfully',
      error: 'Failed to refresh data'
    });
  };

  const handleSelectAll = () => {
    if (selectedStatuses.length === statuses.length) {
      setSelectedStatuses([]);
      setSelectAllStore(false);
    } else {
      setSelectedStatuses(statuses.map(s => s.id));
      setSelectAllStore(false);
    }
  };

  const handleToggleStatus = (statusId: string) => {
    setSelectedStatuses(prev =>
      prev.includes(statusId)
        ? prev.filter(id => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedStatuses(statuses.map(s => s.id));
  };

  const handleClearSelection = () => {
    setSelectedStatuses([]);
    setSelectAllStore(false);
  };

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(k => k !== columnKey)
        : [...prev, columnKey]
    );
  };

  // Slick settings for mobile carousel
  const slickSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1.1,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: '20px'
  };

  // Export/Import configuration
  const exportColumns: ExportColumn[] = [
    { id: 'studentId', label: 'Student ID', defaultSelected: true },
    { id: 'studentName', label: 'Student Name', defaultSelected: true },
    { id: 'currentStage', label: 'Current Stage', defaultSelected: true },
    { id: 'subStatus', label: 'Sub-Status', defaultSelected: true },
    { id: 'country', label: 'Country', defaultSelected: true },
    { id: 'counselor', label: 'Assigned Counselor', defaultSelected: false },
    { id: 'riskLevel', label: 'Risk Level', defaultSelected: false },
    { id: 'lastStatusChange', label: 'Last Status Change', defaultSelected: false },
    { id: 'applicationRef', label: 'Application Reference', defaultSelected: false }
  ];

  const importFields: ImportField[] = [
    { id: 'studentId', label: 'Student ID', required: true, type: 'text' },
    { id: 'studentName', label: 'Student Name', required: true, type: 'text' },
    { id: 'currentStage', label: 'Current Stage', required: true, type: 'select', options: ['Profile', 'Application', 'Visa', 'Completed'] },
    { id: 'subStatus', label: 'Sub-Status', required: false, type: 'text' },
    { id: 'country', label: 'Country', required: false, type: 'text' },
    { id: 'riskLevel', label: 'Risk Level', required: false, type: 'select', options: ['Low', 'Medium', 'High'] }
  ];

  const handleExport = async (options: any) => {
    console.log('Exporting with options:', options);
    toast.success(`Exporting ${options.scope} status records as ${options.format.toUpperCase()}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleImport = async (data: any[], mode: any) => {
    console.log('Importing:', data, 'Mode:', mode);
    toast.success(`Successfully imported ${data.length} status records`);
  };

  return (
    <TooltipProvider>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">

        <ServicePageHeader 
          title="Status Tracking" 
          dateRange={date} 
          onDateChange={setDate}
          onRefresh={handleRefresh}
          onExport={() => setShowExportDialog(true)}
          onImport={() => setShowImportDialog(true)}
        />

        <ServiceMetricGrid metrics={metrics} />

        {/* Desktop Search & Filter Bar */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, student ID, application reference"
              className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>

          {/* Filter/Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFilterMenu(!showFilterMenu);
                  setShowSortMenu(false);
                  setShowColumnMenu(false);
                  setShowMoreMenu(false);
                }}
                className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <Filter size={20} strokeWidth={1.5} />
              </button>

              {showFilterMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Current Stage</div>
                    {['All', 'Profile', 'Application', 'Visa', 'Completed'].map(stage => (
                      <button
                        key={stage}
                        onClick={() => {
                          setStageFilter(stage);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left flex items-center justify-between ${stageFilter === stage ? 'text-purple-700 bg-purple-50 font-medium' : 'text-gray-700'}`}
                      >
                        {stage}
                        {stageFilter === stage && <Check size={14} />}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-1" />
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Risk Level</div>
                    {['All Levels', 'Low', 'Medium', 'High'].map(level => (
                      <button
                        key={level}
                        onClick={() => {
                          setRiskFilter(level);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left flex items-center justify-between ${riskFilter === level ? 'text-purple-700 bg-purple-50 font-medium' : 'text-gray-700'}`}
                      >
                        {level}
                        {riskFilter === level && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sort Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSortMenu(!showSortMenu);
                  setShowFilterMenu(false);
                  setShowColumnMenu(false);
                  setShowMoreMenu(false);
                }}
                className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <ArrowUpDown size={20} strokeWidth={1.5} />
              </button>

              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Sort By</div>
                    {Object.entries({
                      'currentStage': 'Current Stage',
                      'lastStatusChange': 'Last Status Change',
                      'riskLevel': 'Risk Level'
                    }).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => {
                          if (sortBy === key) {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy(key);
                            setSortOrder('desc');
                          }
                          setShowSortMenu(false);
                        }}
                        className={`w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left flex items-center justify-between ${sortBy === key ? 'text-purple-700 bg-purple-50 font-medium' : 'text-gray-700'}`}
                      >
                        <span>{label}</span>
                        {sortBy === key && (
                          sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Columns Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowColumnMenu(!showColumnMenu);
                  setShowFilterMenu(false);
                  setShowSortMenu(false);
                  setShowMoreMenu(false);
                }}
                className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <Columns size={20} strokeWidth={1.5} />
              </button>

              {showColumnMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowColumnMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Show Columns</div>
                    {allColumns.map(column => (
                      <div
                        key={column.key}
                        onClick={() => handleToggleColumn(column.key)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <div onClick={(e) => e.stopPropagation()}>
                          <CustomCheckbox
                            checked={visibleColumns.includes(column.key)}
                            onChange={() => handleToggleColumn(column.key)}
                          />
                        </div>
                        <span className="text-sm text-gray-700">{column.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* More Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowMoreMenu(!showMoreMenu);
                  setShowFilterMenu(false);
                  setShowSortMenu(false);
                  setShowColumnMenu(false);
                }}
                className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center"
              >
                <MoreHorizontal size={20} strokeWidth={1.5} />
              </button>

              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-48 animate-in fade-in zoom-in-95 duration-200">
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Copy size={16} />
                      Copy
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Printer size={16} />
                      Print
                    </button>
                    <button className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                      <Archive size={16} />
                      Archive Selected
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button className="w-full px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-red-600 text-left flex items-center gap-2">
                      <XCircle size={16} />
                      Delete All
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mb-6 flex gap-3">
          <div className="flex-1 h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center px-5 gap-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search status..."
              className="flex-1 h-full border-none focus:ring-0 text-sm bg-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setActiveMobileMenu(activeMobileMenu === 'search' ? 'none' : 'search')}
            className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center"
          >
            <MoreHorizontal size={22} className="text-[#253154]" />
          </button>
        </div>

        {/* Mobile Bottom Sheets */}
        {activeMobileMenu === 'import' && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-40 transition-opacity"
              onClick={() => setActiveMobileMenu('none')}
            />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[30px] z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl custom-scrollbar-light">
              <div className="p-6 flex flex-col gap-6">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-2" />
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Actions</div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setShowExportDialog(true);
                        setActiveMobileMenu('none');
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700"
                    >
                      <Download size={18} />
                      <span className="font-medium">Export Data</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowImportDialog(true);
                        setActiveMobileMenu('none');
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700"
                    >
                      <Upload size={18} />
                      <span className="font-medium">Import Data</span>
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMobileMenu('none')}
                  className="mt-2 w-full bg-gray-100 text-gray-900 font-medium py-4 rounded-2xl"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {activeMobileMenu === 'search' && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-40 transition-opacity"
              onClick={() => setActiveMobileMenu('none')}
            />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[30px] z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl custom-scrollbar-light">
              <div className="p-6 flex flex-col gap-6">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-2" />
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filter by Stage</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', 'Profile', 'Application', 'Visa', 'Completed'].map(stage => (
                      <button
                        key={stage}
                        onClick={() => {
                          setStageFilter(stage);
                          setActiveMobileMenu('none');
                        }}
                        className={`bg-gray-50 border rounded-full text-sm font-medium px-2 py-2 transition-colors ${stageFilter === stage ? 'bg-purple-50 text-purple-700 border-purple-100' : 'text-gray-600 border-gray-100'}`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-full h-px bg-gray-100" />
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sort By</div>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries({
                      'currentStage': 'Current Stage',
                      'lastStatusChange': 'Last Status Change',
                      'riskLevel': 'Risk Level'
                    }).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => {
                          if (sortBy === key) {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy(key);
                            setSortOrder('desc');
                          }
                          setActiveMobileMenu('none');
                        }}
                        className={`p-3 rounded-xl flex items-center justify-between text-sm transition-colors ${sortBy === key ? 'bg-purple-50 text-purple-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        <span>{label}</span>
                        {sortBy === key && (
                          sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setActiveMobileMenu('none')}
                  className="mt-2 w-full bg-gray-100 text-gray-900 font-medium py-4 rounded-2xl"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {/* Selection Banner */}
        {selectedStatuses.length > 0 && (
          <div className="bg-purple-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm border-b border-purple-100 mb-6 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <span className="text-purple-900 font-medium">{selectedStatuses.length} student{selectedStatuses.length !== 1 ? 's' : ''} selected</span>
              {selectedStatuses.length === statuses.length && !selectAllStore && (
                <>
                  <span className="text-purple-700">•</span>
                  <button onClick={handleSelectAllStore} className="text-purple-700 font-bold hover:underline">
                    Select all students
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="text-purple-700 font-bold hover:underline">Update Status</button>
              <button className="text-purple-700 font-bold hover:underline">Flag for Review</button>
              <button className="text-purple-700 font-bold hover:underline">Export Selected</button>
              <button onClick={handleClearSelection} className="text-purple-700 font-bold hover:underline">Clear</button>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12">
                    <CustomCheckbox
                      checked={selectedStatuses.length === statuses.length}
                      partial={selectedStatuses.length > 0 && selectedStatuses.length < statuses.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {visibleColumns.includes('id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Student ID</th>}
                  {visibleColumns.includes('student') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Student Name</th>}
                  {visibleColumns.includes('stage') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Current Stage</th>}
                  {visibleColumns.includes('subStatus') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Sub-Status</th>}
                  {visibleColumns.includes('country') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Country</th>}
                  {visibleColumns.includes('counselor') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Counselor</th>}
                  {visibleColumns.includes('risk') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Risk Level</th>}
                  {visibleColumns.includes('lastChange') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Last Change</th>}
                  {visibleColumns.includes('appRef') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">App Ref</th>}
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={allColumns.length + 2} className="px-6 py-10 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="animate-spin text-purple-500" size={24} />
                        <span className="text-sm">Loading statuses...</span>
                      </div>
                    </td>
                  </tr>
                ) : statuses.length > 0 ? (
                  statuses.map(status => (
                      <tr
                        key={status.id}
                        className={`hover:bg-gray-50 transition-colors group ${selectedStatuses.includes(status.id) ? 'bg-purple-50/40' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <CustomCheckbox
                            checked={selectedStatuses.includes(status.id)}
                            onChange={() => handleToggleStatus(status.id)}
                          />
                        </td>
                        {visibleColumns.includes('id') && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-[#253154] bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                              {status.id}
                            </span>
                          </td>
                        )}
                        {visibleColumns.includes('student') && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{status.studentName}</td>
                        )}
                        {visibleColumns.includes('stage') && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <StageBadge stage={status.currentStage} />
                          </td>
                        )}
                        {visibleColumns.includes('subStatus') && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <SubStatusBadge subStatus={status.subStatus} />
                          </td>
                        )}
                        {visibleColumns.includes('country') && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{status.country}</td>
                        )}
                        {visibleColumns.includes('counselor') && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700">
                                {status.counselor.split(' ').map(n => n[0]).join('')}
                              </div>
                              {status.counselor}
                            </div>
                          </td>
                        )}
                        {visibleColumns.includes('risk') && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <RiskBadge level={status.riskLevel} />
                          </td>
                        )}
                        {visibleColumns.includes('lastChange') && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{status.lastStatusChange}</td>
                        )}
                        {visibleColumns.includes('appRef') && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600 font-mono tracking-tighter">
                            {status.applicationRef}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleOpenTimeline(status)}
                                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                  >
                                    <Eye size={16} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>View Timeline</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleOpenStatusUpdate(status)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  >
                                    <Edit size={16} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Update Status</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleOpenNote(status)}
                                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                  >
                                    <StickyNote size={16} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Add Internal Note</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    onClick={() => {
                                      toast.error("Internal delete logic pending backend approval");
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Delete Entry</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={visibleColumns.length + 2} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                            <Clock size={24} className="text-gray-300" />
                          </div>
                          <p className="text-gray-500 font-medium">No results found</p>
                          <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                            We couldn't find any status records matching your search criteria.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {statuses.length > 0 ? (
              statuses.map(status => (
                <MobileStatusCard
                  key={status.id}
                  status={status}
                  isSelected={selectedStatuses.includes(status.id)}
                  onToggleSelect={() => handleToggleStatus(status.id)}
                  onOpenTimeline={handleOpenTimeline}
                  onOpenStatusUpdate={handleOpenStatusUpdate}
                  onDelete={() => { toast.error("Delete pending approval"); }}
                />
              ))
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <Clock size={24} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No results found</p>
                <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                  We couldn't find any status records matching your search criteria.
                </p>
              </div>
            )}
          </div>

          {/* Pagination Bar */}
          {statuses.length > 0 && (
            <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 rounded-tr-[30px] shadow-[0px_-5px_25px_rgba(0,0,0,0.03)] relative z-20 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm font-medium">Rows per page:</span>
                <div className="relative">
                  <button
                    onClick={() => setShowRowsMenu(!showRowsMenu)}
                    className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors flex items-center justify-between gap-2"
                  >
                    <span className="text-sm font-medium text-gray-700">{rowsPerPage}</span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>
                  {showRowsMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowRowsMenu(false)} />
                      <div className="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-xl border border-gray-100 z-20 p-1 animate-in slide-in-from-bottom-1 duration-200">
                        {[10, 25, 50, 100].map(num => (
                          <button
                            key={num}
                            onClick={() => {
                              setRowsPerPage(num);
                              setShowRowsMenu(false);
                            }}
                            className={`w-full px-3 py-1.5 text-xs font-medium rounded ${rowsPerPage === num
                              ? 'bg-purple-50 text-purple-700'
                              : 'text-gray-600 hover:bg-gray-50'
                              }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="hidden sm:block text-sm text-gray-500 font-medium">
                Showing {statuses.length > 0 ? 1 : 0} to {statuses.length} of {statuses.length} records
              </div>

              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center disabled:opacity-50" disabled>
                  <ChevronLeft size={18} strokeWidth={2} className="text-gray-500" />
                </button>
                <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center disabled:opacity-50" disabled>
                  <ChevronRight size={18} strokeWidth={2} className="text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Status Tracking"
        totalCount={1456}
        selectedCount={selectedStatuses.length}
        columns={exportColumns}
        supportsDateRange={true}
        onExport={handleExport}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Status Tracking"
        fields={importFields}
        onImport={handleImport}
        templateUrl="/templates/status-tracking-import-template.xlsx"
        allowUpdate={true}
      />

      {/* Status Update Modal */}
      <Dialog open={showStatusUpdateModal} onOpenChange={setShowStatusUpdateModal}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-6 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#253154]">Update Student Status</DialogTitle>
            <DialogDescription className="text-gray-500">
              Change the current stage and sub-status for {selectedStudent?.studentName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stage" className="text-sm font-semibold text-gray-700">Stage</Label>
              <Select
                value={updateForm.stage}
                onValueChange={(val: string) => setUpdateForm({ ...updateForm, stage: val })}
              >
                <SelectTrigger id="stage" className="bg-gray-50 border-gray-100 rounded-xl">
                  <SelectValue placeholder="Select Stage" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-100 rounded-xl shadow-xl">
                  {['Profile', 'Application', 'Visa', 'Completed'].map(stage => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subStatus" className="text-sm font-semibold text-gray-700">Sub-Status</Label>
              <Input
                id="subStatus"
                value={updateForm.subStatus}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateForm({ ...updateForm, subStatus: e.target.value })}
                placeholder="e.g. Document Collection"
                className="bg-gray-50 border-gray-100 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">Internal Notes</Label>
              <Textarea
                id="notes"
                value={updateForm.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                placeholder="Add details about this status change..."
                className="bg-gray-50 border-gray-100 rounded-xl min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowStatusUpdateModal(false)} className="rounded-xl">Cancel</Button>
            <Button
              className="bg-[#0e042f] text-white hover:bg-purple-900 rounded-xl px-6"
              onClick={handleUpdateStatus}
              disabled={isSubmitting}
            >
              {isSubmitting ? <RefreshCw className="animate-spin mr-2" size={16} /> : null}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Timeline Modal */}
      <Dialog open={showTimelineModal} onOpenChange={setShowTimelineModal}>
        <DialogContent className="max-w-2xl bg-white rounded-3xl p-8 border-none shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Clock size={24} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-[#253154] leading-tight">Student Journey Timeline</DialogTitle>
                <DialogDescription className="text-purple-400 font-medium">
                  Complete history for {selectedStudent?.studentName}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar-light">
            <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-200 before:via-purple-100 before:to-transparent">
              {statusHistory.length > 0 ? (
                statusHistory.map((item: any, idx: number) => (
                  <div key={idx} className="relative animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className={`absolute -left-8 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${idx === 0 ? 'bg-purple-600 ring-4 ring-purple-100' : 'bg-gray-200'}`}>
                      {idx === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                    </div>
                    <div className={`p-5 rounded-2xl border transition-all hover:shadow-md ${idx === 0 ? 'bg-purple-50/30 border-purple-100 ring-1 ring-purple-50' : 'bg-white border-gray-100'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#253154] text-lg capitalize">{item.stage}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg">{item.sub_status}</span>
                          </div>
                          <span className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                            <CalendarIcon size={12} />
                            {format(new Date(item.created_at), 'MMMM d, yyyy • h:mm a')}
                          </span>
                        </div>
                        <div className="px-3 py-1 bg-white rounded-full border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-sm">
                          {item.changed_by}
                        </div>
                      </div>
                      {item.notes && (
                        <div className="relative group">
                          <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-purple-200 rounded-full group-hover:bg-purple-400 transition-colors" />
                          <p className="text-sm text-gray-600 leading-relaxed italic pl-3">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                    <History size={32} strokeWidth={1.5} className="opacity-20" />
                  </div>
                  <p className="font-medium">No history records found for this student.</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-8 pt-6 border-t border-gray-50">
            <Button
              onClick={() => setShowTimelineModal(false)}
              className="w-full h-12 bg-white hover:bg-gray-50 text-[#253154] border border-gray-200 rounded-2xl font-bold transition-all shadow-sm"
            >
              Close Timeline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Internal Note Modal */}
      <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-6 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#253154]">Add Internal Note</DialogTitle>
            <DialogDescription className="text-gray-500">
              This note will be added to the student&apos;s status history for internal reference.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note here..."
              className="bg-gray-50 border-gray-100 rounded-xl min-h-[150px]"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowNoteModal(false)} className="rounded-xl">Cancel</Button>
            <Button
              className="bg-[#0e042f] text-white hover:bg-purple-900 rounded-xl px-6"
              onClick={handleAddNote}
              disabled={isSubmitting || !newNote.trim()}
            >
              {isSubmitting ? <RefreshCw className="animate-spin mr-2" size={16} /> : null}
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Linked Applications Modal */}
      <Dialog open={showApplicationsModal} onOpenChange={setShowApplicationsModal}>
        <DialogContent className="max-w-2xl bg-white rounded-2xl p-6 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#253154]">Linked Applications</DialogTitle>
            <DialogDescription className="text-gray-500">
              Applications found for {selectedStudent?.studentName}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            {linkedApplications.length > 0 ? (
              linkedApplications.map((app: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between hover:border-purple-200 transition-colors">
                  <div>
                    <div className="font-bold text-[#253154]">{app.university_name}</div>
                    <div className="text-xs text-gray-500">{app.country} • {app.intake}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-white border border-gray-100 rounded-lg text-purple-600 uppercase tracking-wider">
                      {app.status}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-purple-50 text-purple-600">
                      <Eye size={16} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No linked applications found in the system.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowApplicationsModal(false)} className="rounded-xl w-full">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};
