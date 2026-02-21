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
  Clock,
  Send,
  CheckCircle,
  FileUp,
  Eye,
  UserCog,
  XOctagon
} from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import {
  getAllApplications,
  getApplicationMetrics,
  Application as ServiceApplication,
  ApplicationMetrics,
  createApplication,
  CreateApplicationData
} from '../services/applicationsService';
import { getAllStudents, Student } from '../services/studentsService';
import { getAllUniversities, University } from '../services/universitiesService';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

// --- CustomCheckbox Component ---
interface CustomCheckboxProps {
  checked: boolean;
  partial?: boolean;
  onChange: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, partial = false, onChange }) => {
  return (
    <div
      onClick={onChange}
      className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center cursor-pointer ${checked || partial
        ? 'bg-white border-purple-600'
        : 'bg-white border-gray-300 hover:border-gray-400'
        }`}
    >
      {checked && <Check size={12} className="text-purple-600" strokeWidth={4} />}
      {partial && <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm" />}
    </div>
  );
};

// --- StatusBadge Component ---
interface StatusBadgeProps {
  status: 'in-progress' | 'submitted' | 'decision-received' | 'pending-docs' | 'closed';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    'in-progress': {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      label: 'In Progress'
    },
    'submitted': {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
      label: 'Submitted'
    },
    'decision-received': {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      label: 'Decision Received'
    },
    'pending-docs': {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-300',
      label: 'Pending Docs'
    },
    'closed': {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-300',
      label: 'Closed'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`px-3 py-1 rounded-lg text-[12px] font-medium border border-opacity-20 inline-flex w-[130px] items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

// --- MetricCard Component ---
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  bgClass: string;
  colorClass: string;
  tooltip: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, bgClass, colorClass, tooltip }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-w-[180px] h-[130px] relative overflow-hidden group hover:shadow-lg transition-all border border-gray-50/50">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-[#253154] font-medium text-[15px]">{title}</span>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors">
                i
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Bottom row */}
      <div className="flex items-end gap-3 mt-2">
        <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center`}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</p>
        </div>
      </div>

      {/* Decorative background */}
      <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500">
        <Icon size={80} />
      </div>
    </div>
  );
};

// --- MobileApplicationCard Component ---
interface Application {
  id: string;      // display ID e.g. APP-123
  dbId: string;    // real DB UUID for API calls
  studentName: string;
  university: string;
  country: string;
  intake: string;
  status: 'in-progress' | 'submitted' | 'decision-received' | 'pending-docs' | 'closed';
  counselor: string;
  submissionDate: string;
  decisionDate: string;
  lastUpdated: string;
}

interface MobileApplicationCardProps {
  application: Application;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const MobileApplicationCard: React.FC<MobileApplicationCardProps> = ({ application, isSelected, onToggleSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 w-full transition-all active:scale-[0.99] cursor-pointer flex flex-col gap-2 ${isSelected ? 'bg-purple-50/30' : ''}`}>
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-[#253154] text-[15px]">{application.id}</span>
        <span className="bg-[#F4F4F4] text-gray-500 text-[10px] px-2 py-1 rounded-lg">Tap to view</span>
        <span className="text-sm text-gray-600 ml-auto">{application.intake}</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
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
        <span className="text-gray-600 text-sm">{application.studentName}</span>
        <div className="ml-auto transform scale-90 origin-right">
          <StatusBadge status={application.status} />
        </div>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div className="mt-2 pt-3 border-t border-gray-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">University</div>
              <div className="text-sm text-gray-700 font-medium">{application.university}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Country</div>
              <div className="text-sm text-gray-700 font-medium">{application.country}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Counselor</div>
              <div className="text-sm text-gray-700 font-medium">{application.counselor}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Last Updated</div>
              <div className="text-sm text-gray-700 font-medium">{application.lastUpdated}</div>
            </div>
          </div>
          <button className="w-full h-10 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0c4a] transition-colors font-medium text-sm">
            View Application
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export const ApplicationsOverviewPage: React.FC = () => {
  // State management
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31)
  });
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search'>('none');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'student', 'university', 'country', 'intake', 'status', 'counselor']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);

  // Dialog states
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Bulk action modal states
  const [showAssignCounselorModal, setShowAssignCounselorModal] = useState(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [bulkCounselorName, setBulkCounselorName] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Per-row action state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRowChangeStatusModal, setShowRowChangeStatusModal] = useState(false);
  const [showRowAssignCounselorModal, setShowRowAssignCounselorModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Application>>({});
  const [rowCounselorName, setRowCounselorName] = useState('');
  const [rowStatus, setRowStatus] = useState('');
  const [isRowUpdating, setIsRowUpdating] = useState(false);

  // Add Application Form State
  const [students, setStudents] = useState<Student[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [newApplication, setNewApplication] = useState<CreateApplicationData>({
    studentDbId: '',
    universityName: '',
    country: '',
    intake: '',
    status: 'in-progress',
    counselor: '',
    notes: ''
  });

  // State for fetched data
  const [applications, setApplications] = useState<Application[]>([]);
  const [metricsData, setMetricsData] = useState<ApplicationMetrics | null>(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [countryFilter, setCountryFilter] = useState<string>('All Countries');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sort field map
  const sortOptions: { label: string; field: string }[] = [
    { label: 'Last Updated', field: 'updated_at' },
    { label: 'Submission Date', field: 'submission_date' },
    { label: 'Decision Date', field: 'decision_date' },
    { label: 'Application Status', field: 'status' },
  ];

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPagination(prev => ({ ...prev, page: 1 }));
    setShowSortMenu(false);
  };

  // Helper to fetch data
  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const response = await getAllApplications({
        page: pagination.page,
        limit: rowsPerPage,
        search: searchTerm,
        status: statusFilter === 'All' ? undefined : statusFilter.toLowerCase().replace(' ', '-'),
        sort: sortBy,
        order: sortOrder
      });

      const mappedApps: Application[] = response.data.map((app: ServiceApplication) => ({
        id: app.application_id,
        dbId: app.id,
        studentName: `${app.first_name} ${app.last_name}`,
        university: app.university_name,
        country: app.country,
        intake: app.intake,
        status: app.status,
        counselor: app.counselor,
        submissionDate: app.submission_date ? format(new Date(app.submission_date), 'MMM dd, yyyy') : '-',
        decisionDate: app.decision_date ? format(new Date(app.decision_date), 'MMM dd, yyyy') : '-',
        lastUpdated: app.updated_at ? formatDistanceToNow(new Date(app.updated_at), { addSuffix: true }) : '-'
      }));

      setApplications(mappedApps);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMetrics = async () => {
    const data = await getApplicationMetrics();
    setMetricsData(data);
  };

  const fetchStudents = async () => {
    try {
      const response = await getAllStudents({ limit: 100 });
      setStudents(response.data || []);
    } catch (error) {
      console.error("Failed to fetch students");
    }
  };



  const fetchUniversities = async () => {
    try {
      const response = await getAllUniversities({ limit: 100 });
      setUniversities(response.data || []);
    } catch (error) {
      console.error("Failed to fetch universities");
    }
  };

  const handleUniversityChange = (univId: string) => {
    // Since select value is ID (or we can use name as value if preferred, but usually ID is cleaner)
    // But application payload expects universityName.
    // Let's use university NAME as the value for the Select to match the payload directly,
    // OR find the university by ID if we use ID.
    // Given the CreateApplicationData needs universityName, let's look it up.

    // Actually, let's use the university NAME as the Select value to keep it simple with current state
    // BUT if names are not unique, ID is better.
    // For now, let's assume names are unique enough or use ID and find the object.
    // Let's use ID for robust lookup, then set name and country.

    const selectedUniv = universities.find(u => u.id.toString() === univId || u.name === univId);

    if (selectedUniv) {
      setNewApplication({
        ...newApplication,
        universityName: selectedUniv.name,
        country: selectedUniv.country_name || ''
      });
    }
  };

  const handleAddApplication = async () => {
    if (!newApplication.studentDbId || !newApplication.universityName || !newApplication.country) {
      toast.error("Please fill in all required fields (Student, University, Country)");
      return;
    }

    try {
      await createApplication(newApplication);
      toast.success("Application created successfully");
      setShowAddDialog(false);
      loadApplications();
      loadMetrics();
      setNewApplication({
        studentDbId: '',
        universityName: '',
        country: '',
        intake: '',
        status: 'in-progress',
        counselor: '',
        notes: ''
      });
    } catch (error) {
      toast.error("Failed to create application");
    }
  };

  React.useEffect(() => {
    loadApplications();
    loadMetrics();
    loadMetrics();
    fetchStudents();
    fetchUniversities();
  }, [pagination.page, rowsPerPage, searchTerm, statusFilter, countryFilter, sortBy, sortOrder]);

  // Metrics data - Derived from API
  const metrics = [
    {
      title: 'Total Applications',
      value: metricsData?.totalApplications.toLocaleString() || '0',
      icon: FileText,
      bgClass: 'bg-purple-50',
      colorClass: 'text-purple-600',
      tooltip: 'Total number of applications'
    },
    {
      title: 'In Progress',
      value: metricsData?.inProgress.toLocaleString() || '0',
      icon: Clock,
      bgClass: 'bg-blue-50',
      colorClass: 'text-blue-600',
      tooltip: 'Applications currently being prepared'
    },
    {
      title: 'Submitted',
      value: metricsData?.submitted.toLocaleString() || '0',
      icon: Send,
      bgClass: 'bg-indigo-50',
      colorClass: 'text-indigo-600',
      tooltip: 'Applications submitted to universities'
    },
    {
      title: 'Decisions Received',
      value: metricsData?.decisions.toLocaleString() || '0',
      icon: CheckCircle,
      bgClass: 'bg-green-50',
      colorClass: 'text-green-600',
      tooltip: 'Applications with university decisions'
    },
    {
      title: 'Pending Documents',
      value: metricsData?.pendingDocs.toLocaleString() || '0',
      icon: FileUp,
      bgClass: 'bg-amber-50',
      colorClass: 'text-amber-600',
      tooltip: 'Applications awaiting required documents'
    }
  ];

  // Column configuration
  const allColumns = [
    { key: 'id', label: 'Application ID' },
    { key: 'student', label: 'Student Name' },
    { key: 'university', label: 'University' },
    { key: 'country', label: 'Country' },
    { key: 'intake', label: 'Intake' },
    { key: 'status', label: 'Status' },
    { key: 'counselor', label: 'Assigned Counselor' },
    { key: 'submission', label: 'Submission Date' },
    { key: 'decision', label: 'Decision Date' },
    { key: 'updated', label: 'Last Updated' }
  ];

  // Handlers
  const handleRefresh = () => {
    loadApplications();
    loadMetrics();
    toast.success("Refreshing data...");
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
      setSelectAllStore(false);
    } else {
      setSelectedApplications(applications.map(a => a.id));
      setSelectAllStore(false);
    }
  };

  const handleToggleApplication = (applicationId: string) => {
    setSelectedApplications(prev =>
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedApplications(applications.map(a => a.id));
  };

  const handleClearSelection = () => {
    setSelectedApplications([]);
    setSelectAllStore(false);
  };

  const handleBulkAssignCounselor = async () => {
    if (!bulkCounselorName.trim()) {
      toast.error('Please enter a counselor name');
      return;
    }
    setIsBulkUpdating(true);
    try {
      const { updateApplication } = await import('../services/applicationsService');
      await Promise.all(
        selectedApplications.map(appId => {
          const app = applications.find(a => a.id === appId);
          if (!app) return Promise.resolve();
          return updateApplication(app.dbId, { counselor: bulkCounselorName.trim() } as any);
        })
      );
      toast.success(`Counselor updated for ${selectedApplications.length} application(s)`);
      setShowAssignCounselorModal(false);
      setBulkCounselorName('');
      handleClearSelection();
      loadApplications();
    } catch {
      toast.error('Failed to update counselor for some applications');
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleBulkChangeStatus = async () => {
    if (!bulkStatus) {
      toast.error('Please select a status');
      return;
    }
    setIsBulkUpdating(true);
    try {
      const { updateApplication } = await import('../services/applicationsService');
      await Promise.all(
        selectedApplications.map(appId => {
          const app = applications.find(a => a.id === appId);
          if (!app) return Promise.resolve();
          return updateApplication(app.dbId, { status: bulkStatus as any } as any);
        })
      );
      toast.success(`Status updated for ${selectedApplications.length} application(s)`);
      setShowChangeStatusModal(false);
      setBulkStatus('');
      handleClearSelection();
      loadApplications();
    } catch {
      toast.error('Failed to update status for some applications');
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // --- Per-row action handlers ---
  const openRowMenu = (app: Application) => {
    setActiveMenuId(prev => prev === app.id ? null : app.id);
    setSelectedApp(app);
  };

  const handleViewApplication = (app: Application) => {
    setSelectedApp(app);
    setShowViewModal(true);
    setActiveMenuId(null);
  };

  const handleEditApplication = (app: Application) => {
    setSelectedApp(app);
    setEditForm({
      studentName: app.studentName,
      university: app.university,
      country: app.country,
      intake: app.intake,
      status: app.status,
      counselor: app.counselor,
    });
    setShowEditModal(true);
    setActiveMenuId(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedApp) return;
    setIsRowUpdating(true);
    try {
      const { updateApplication } = await import('../services/applicationsService');
      await updateApplication(selectedApp.dbId, editForm as any);
      toast.success('Application updated successfully');
      setShowEditModal(false);
      loadApplications();
    } catch {
      toast.error('Failed to update application');
    } finally {
      setIsRowUpdating(false);
    }
  };

  const handleRowChangeStatus = (app: Application) => {
    setSelectedApp(app);
    setRowStatus(app.status);
    setShowRowChangeStatusModal(true);
    setActiveMenuId(null);
  };

  const handleSaveRowStatus = async () => {
    if (!selectedApp || !rowStatus) return;
    setIsRowUpdating(true);
    try {
      const { updateApplication } = await import('../services/applicationsService');
      await updateApplication(selectedApp.dbId, { status: rowStatus as any } as any);
      toast.success('Status updated successfully');
      setShowRowChangeStatusModal(false);
      loadApplications();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setIsRowUpdating(false);
    }
  };

  const handleRowAssignCounselor = (app: Application) => {
    setSelectedApp(app);
    setRowCounselorName(app.counselor || '');
    setShowRowAssignCounselorModal(true);
    setActiveMenuId(null);
  };

  const handleSaveRowCounselor = async () => {
    if (!selectedApp || !rowCounselorName.trim()) {
      toast.error('Please enter a counselor name');
      return;
    }
    setIsRowUpdating(true);
    try {
      const { updateApplication } = await import('../services/applicationsService');
      await updateApplication(selectedApp.dbId, { counselor: rowCounselorName.trim() } as any);
      toast.success('Counselor assigned successfully');
      setShowRowAssignCounselorModal(false);
      loadApplications();
    } catch {
      toast.error('Failed to assign counselor');
    } finally {
      setIsRowUpdating(false);
    }
  };

  const handleViewTimeline = (app: Application) => {
    setSelectedApp(app);
    setShowTimelineModal(true);
    setActiveMenuId(null);
  };

  const handleCloseApplication = async (app: Application) => {
    setActiveMenuId(null);
    if (!confirm(`Are you sure you want to close application ${app.id}?`)) return;
    try {
      const { updateApplication } = await import('../services/applicationsService');
      await updateApplication(app.dbId, { status: 'closed' } as any);
      toast.success(`Application ${app.id} closed`);
      loadApplications();
    } catch {
      toast.error('Failed to close application');
    }
  };

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(k => k !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
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
    { id: 'applicationId', label: 'Application ID', defaultSelected: true },
    { id: 'studentName', label: 'Student Name', defaultSelected: true },
    { id: 'university', label: 'University', defaultSelected: true },
    { id: 'country', label: 'Country', defaultSelected: true },
    { id: 'intake', label: 'Intake Period', defaultSelected: true },
    { id: 'status', label: 'Application Status', defaultSelected: true },
    { id: 'counselor', label: 'Assigned Counselor', defaultSelected: false },
    { id: 'submissionDate', label: 'Submission Date', defaultSelected: false },
    { id: 'decisionDate', label: 'Decision Date', defaultSelected: false },
    { id: 'lastUpdated', label: 'Last Updated', defaultSelected: false }
  ];

  const importFields: ImportField[] = [
    { id: 'applicationId', label: 'Application ID', required: false, type: 'text' },
    { id: 'studentName', label: 'Student Name', required: true, type: 'text' },
    { id: 'university', label: 'University', required: true, type: 'text' },
    { id: 'country', label: 'Country', required: true, type: 'text' },
    { id: 'intake', label: 'Intake Period', required: false, type: 'text' },
    { id: 'status', label: 'Application Status', required: false, type: 'select', options: ['In Progress', 'Submitted', 'Decision Received', 'Pending Docs', 'Closed'] },
    { id: 'counselor', label: 'Assigned Counselor', required: false, type: 'text' }
  ];

  const handleExport = async (options: any) => {
    console.log('Exporting with options:', options);
    toast.success(`Exporting ${options.scope} applications as ${options.format.toUpperCase()}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleImport = async (data: any[], mode: any) => {
    console.log('Importing:', data, 'Mode:', mode);
    toast.success(`Successfully imported ${data.length} applications`);
  };

  return (
    <TooltipProvider>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">

        {/* Desktop Action Bar */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-8">
          {/* Left: Date Picker */}
          <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                  <CalendarIcon size={20} className="text-[#253154]" />
                  <span className="font-medium text-[#253154] text-[14px]">
                    {date?.from && date?.to
                      ? `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}`
                      : 'Select date range'}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <div className="w-px h-4 bg-gray-200 mx-2" />
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500"
            >
              <RefreshCw size={20} className="text-[#253154]" />
            </button>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExportDialog(true)}
              className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"
            >
              <Download size={20} strokeWidth={1.5} />
              Export
            </button>
            <button
              onClick={() => setShowImportDialog(true)}
              className="flex items-center gap-2 bg-white text-[#253154] px-6 h-[50px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-[16px] font-medium"
            >
              <Upload size={20} strokeWidth={1.5} />
              Import
            </button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium">
                  <Plus size={20} strokeWidth={1.5} />
                  Add New
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle>Add New Application</DialogTitle>
                  <DialogDescription>
                    Create a new application record for a student.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="student" className="text-right">
                      Student
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={newApplication.studentDbId}
                        onValueChange={(value) => setNewApplication({ ...newApplication, studentDbId: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.first_name} {student.last_name} ({student.student_id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="university" className="text-right">
                      University
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={newApplication.universityName}
                        onValueChange={(value) => handleUniversityChange(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a university" />
                        </SelectTrigger>
                        <SelectContent>
                          {universities.map((univ) => (
                            <SelectItem key={univ.id} value={univ.name}>
                              {univ.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country" className="text-right">
                      Country
                    </Label>
                    <Input
                      id="country"
                      value={newApplication.country}
                      readOnly
                      className="col-span-3 bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="intake" className="text-right">
                      Intake
                    </Label>
                    <Input
                      id="intake"
                      placeholder="e.g. Sep 2024"
                      value={newApplication.intake}
                      onChange={(e) => setNewApplication({ ...newApplication, intake: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={newApplication.status}
                        onValueChange={(value) => setNewApplication({ ...newApplication, status: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="decision-received">Decision Received</SelectItem>
                          <SelectItem value="pending-docs">Pending Docs</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="counselor" className="text-right">
                      Counselor
                    </Label>
                    <Input
                      id="counselor"
                      value={newApplication.counselor}
                      onChange={(e) => setNewApplication({ ...newApplication, counselor: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddApplication}>Save Application</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="flex md:hidden flex-col gap-4 mb-6">
          {/* Date Range Pill */}
          <div className="w-full h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <CalendarIcon size={18} className="text-[#253154]" />
              <span className="text-sm font-medium text-[#253154]">
                {date?.from && date?.to
                  ? `${format(date.from, 'd MMM')} - ${format(date.to, 'd MMM')}`
                  : 'Select range'}
              </span>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors active:rotate-180 active:duration-500"
            >
              <RefreshCw size={18} className="text-[#253154]" />
            </button>
          </div>

          {/* Button Row */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddDialog(true)}
              className="flex-1 h-[50px] bg-[#0e042f] text-white rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={20} />
              Add New
            </button>
            <button
              onClick={() => setActiveMobileMenu(activeMobileMenu === 'import' ? 'none' : 'import')}
              className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center"
            >
              <MoreHorizontal size={22} className="text-[#253154]" />
            </button>
          </div>
        </div>

        {/* Metrics Section - Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Metrics Section - Mobile Carousel */}
        <div className="block lg:hidden mb-14 -mx-4">
          <Slider {...slickSettings}>
            {metrics.map((metric, index) => (
              <div key={index} className="px-2 py-2">
                <MetricCard {...metric} />
              </div>
            ))}
          </Slider>
        </div>

        {/* Desktop Search & Filter Bar */}
        <div className="hidden md:flex justify-between items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
            <input
              type="text"
              placeholder="Search by student name, application ID, university name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Application Status</div>
                    {['All', 'In Progress', 'Submitted', 'Decision Received', 'Pending Docs', 'Closed'].map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-center ${statusFilter === status ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700'}`}
                      >
                        {status}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-1" />
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Country</div>
                    {['All Countries', 'Canada', 'USA', 'UK', 'Australia'].map(country => (
                      <button key={country} className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left">
                        {country}
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
                    {sortOptions.map(({ label, field }) => {
                      const isActive = sortBy === field;
                      return (
                        <button
                          key={field}
                          onClick={() => handleSort(field)}
                          className={`w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left flex items-center justify-between transition-colors ${isActive ? 'text-purple-700 font-semibold bg-purple-50' : 'text-gray-700'
                            }`}
                        >
                          <span>{label}</span>
                          {isActive
                            ? (sortOrder === 'asc' ? <ArrowUp size={16} className="text-purple-500" /> : <ArrowDown size={16} className="text-purple-500" />)
                            : <ArrowDown size={16} className="text-gray-300" />
                          }
                        </button>
                      );
                    })}
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
                        <CustomCheckbox
                          checked={visibleColumns.includes(column.key)}
                          onChange={() => { }}
                        />
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
              placeholder="Search applications..."
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
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filter by Status</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', 'In Progress', 'Submitted', 'Decided'].map(status => (
                      <button key={status} className="bg-gray-50 text-gray-600 border border-gray-100 rounded-full text-sm font-medium px-2 py-2 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-100">
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-full h-px bg-gray-100" />
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sort By</div>
                  <div className="grid grid-cols-1 gap-2">
                    {sortOptions.filter(o => o.label !== 'Application Status').concat({ label: 'Status', field: 'status' }).slice(0, 3).map(({ label, field }) => {
                      const isActive = sortBy === field;
                      return (
                        <button
                          key={field}
                          onClick={() => handleSort(field)}
                          className={`p-3 rounded-xl hover:bg-gray-50 flex items-center justify-between transition-colors ${isActive ? 'text-purple-700 font-semibold bg-purple-50' : 'text-gray-700'
                            }`}
                        >
                          <span className="font-medium">{label}</span>
                          {isActive
                            ? (sortOrder === 'asc' ? <ArrowUp size={16} className="text-purple-500" /> : <ArrowDown size={16} className="text-purple-500" />)
                            : <ArrowDown size={16} className="text-gray-300" />
                          }
                        </button>
                      );
                    })}
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
        {selectedApplications.length > 0 && (
          <div className="bg-purple-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm border-b border-purple-100 mb-6 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <span className="text-purple-900 font-medium">{selectedApplications.length} application{selectedApplications.length !== 1 ? 's' : ''} selected</span>
              {selectedApplications.length === applications.length && !selectAllStore && (
                <>
                  <span className="text-purple-700">•</span>
                  <button onClick={handleSelectAllStore} className="text-purple-700 font-bold hover:underline">
                    Select all 1,456 applications
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowAssignCounselorModal(true)} className="text-purple-700 font-bold hover:underline">Assign Counselor</button>
              <button onClick={() => setShowChangeStatusModal(true)} className="text-purple-700 font-bold hover:underline">Change Status</button>
              <button onClick={() => setShowExportDialog(true)} className="text-purple-700 font-bold hover:underline">Export Selected</button>
              <button onClick={handleClearSelection} className="text-purple-700 font-bold hover:underline">Clear</button>
            </div>
          </div>
        )}

        {/* Assign Counselor Modal */}
        <Dialog open={showAssignCounselorModal} onOpenChange={(open) => { setShowAssignCounselorModal(open); if (!open) setBulkCounselorName(''); }}>
          <DialogContent className="sm:max-w-[400px] bg-white">
            <DialogHeader>
              <DialogTitle>Assign Counselor</DialogTitle>
              <DialogDescription>
                Assign a counselor to {selectedApplications.length} selected application{selectedApplications.length !== 1 ? 's' : ''}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="bulk-counselor" className="mb-2 block text-sm font-medium text-gray-700">Counselor Name</Label>
              <Input
                id="bulk-counselor"
                placeholder="e.g. Sarah Johnson"
                value={bulkCounselorName}
                onChange={(e) => setBulkCounselorName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleBulkAssignCounselor(); }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAssignCounselorModal(false)} disabled={isBulkUpdating}>Cancel</Button>
              <Button onClick={handleBulkAssignCounselor} disabled={isBulkUpdating}>
                {isBulkUpdating ? 'Saving...' : 'Assign'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Status Modal */}
        <Dialog open={showChangeStatusModal} onOpenChange={(open) => { setShowChangeStatusModal(open); if (!open) setBulkStatus(''); }}>
          <DialogContent className="sm:max-w-[400px] bg-white">
            <DialogHeader>
              <DialogTitle>Change Status</DialogTitle>
              <DialogDescription>
                Update the status of {selectedApplications.length} selected application{selectedApplications.length !== 1 ? 's' : ''}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label className="mb-2 block text-sm font-medium text-gray-700">New Status</Label>
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="decision-received">Decision Received</SelectItem>
                  <SelectItem value="pending-docs">Pending Docs</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowChangeStatusModal(false)} disabled={isBulkUpdating}>Cancel</Button>
              <Button onClick={handleBulkChangeStatus} disabled={isBulkUpdating}>
                {isBulkUpdating ? 'Saving...' : 'Apply'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Desktop Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-auto custom-scrollbar-light max-h-[600px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left w-12">
                    <CustomCheckbox
                      checked={selectedApplications.length === applications.length}
                      partial={selectedApplications.length > 0 && selectedApplications.length < applications.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {visibleColumns.includes('id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Application ID</th>}
                  {visibleColumns.includes('student') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Student Name</th>}
                  {visibleColumns.includes('university') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">University</th>}
                  {visibleColumns.includes('country') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Country</th>}
                  {visibleColumns.includes('intake') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Intake</th>}
                  {visibleColumns.includes('status') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Status</th>}
                  {visibleColumns.includes('counselor') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Counselor</th>}
                  {visibleColumns.includes('submission') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Submission</th>}
                  {visibleColumns.includes('decision') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Decision</th>}
                  {visibleColumns.includes('updated') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Last Updated</th>}
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className={`hover:bg-gray-50 transition-colors group ${selectedApplications.includes(application.id) ? 'bg-purple-50/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <CustomCheckbox
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => handleToggleApplication(application.id)}
                      />
                    </td>
                    {visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{application.id}</td>}
                    {visibleColumns.includes('student') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{application.studentName}</td>}
                    {visibleColumns.includes('university') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{application.university}</td>}
                    {visibleColumns.includes('country') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{application.country}</td>}
                    {visibleColumns.includes('intake') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{application.intake}</td>}
                    {visibleColumns.includes('status') && <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={application.status} /></td>}
                    {visibleColumns.includes('counselor') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{application.counselor}</td>}
                    {visibleColumns.includes('submission') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{application.submissionDate}</td>}
                    {visibleColumns.includes('decision') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{application.decisionDate}</td>}
                    {visibleColumns.includes('updated') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{application.lastUpdated}</td>}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="relative">
                        <button
                          onClick={() => openRowMenu(application)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <MoreHorizontal size={18} className="text-gray-400" />
                        </button>
                        {activeMenuId === application.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-2 w-56 animate-in fade-in zoom-in-95 duration-150">
                              <button onClick={() => handleViewApplication(application)} className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                                <Eye size={16} />
                                View Application
                              </button>
                              <button onClick={() => handleEditApplication(application)} className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                                <Edit size={16} />
                                Edit Application
                              </button>
                              <button onClick={() => { toast.info('Upload Documents coming soon'); setActiveMenuId(null); }} className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                                <FileUp size={16} />
                                Upload Documents
                              </button>
                              <button onClick={() => handleRowChangeStatus(application)} className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                                <Edit size={16} />
                                Change Status
                              </button>
                              <button onClick={() => handleRowAssignCounselor(application)} className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                                <UserCog size={16} />
                                Assign Counselor
                              </button>
                              <button onClick={() => handleViewTimeline(application)} className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2">
                                <Clock size={16} />
                                View Timeline
                              </button>
                              <div className="h-px bg-gray-100 my-1" />
                              <button onClick={() => handleCloseApplication(application)} className="w-full px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-red-600 text-left flex items-center gap-2">
                                <XOctagon size={16} />
                                Close Application
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {applications.map((application) => (
              <MobileApplicationCard
                key={application.id}
                application={application}
                isSelected={selectedApplications.includes(application.id)}
                onToggleSelect={() => handleToggleApplication(application.id)}
              />
            ))}
          </div>

          {/* Pagination Bar */}
          <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 rounded-tr-[30px] shadow-[0px_-5px_25px_rgba(0,0,0,0.03)] relative z-20 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm font-medium">Rows per page:</span>
              <div className="relative">
                <button
                  onClick={() => setShowRowsMenu(!showRowsMenu)}
                  className="h-9 min-w-[70px] px-3 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
                >
                  {rowsPerPage}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {showRowsMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowRowsMenu(false)} />
                    <div className="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-xl border border-gray-100 z-20 p-1 animate-in slide-in-from-bottom-1 duration-200">
                      {[5, 10, 25, 50].map(rows => (
                        <button
                          key={rows}
                          onClick={() => {
                            setRowsPerPage(rows);
                            setPagination(prev => ({ ...prev, page: 1 }));
                            setShowRowsMenu(false);
                          }}
                          className={`w-full px-3 py-1.5 text-xs font-medium rounded ${rowsPerPage === rows
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          {rows}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm font-medium">
                {(pagination.page - 1) * rowsPerPage + 1}-{Math.min(pagination.page * rowsPerPage, pagination.total)} of {pagination.total}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm transition-colors flex items-center justify-center ${pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-gray-300'}`}
                >
                  <ChevronLeft size={18} strokeWidth={2} className="text-gray-500" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm transition-colors flex items-center justify-center ${pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-gray-300'}`}
                >
                  <ChevronRight size={18} strokeWidth={2} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Applications"
        totalCount={1456}
        selectedCount={selectedApplications.length}
        columns={exportColumns}
        supportsDateRange={true}
        onExport={handleExport}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Applications"
        fields={importFields}
        onImport={handleImport}
        templateUrl="/templates/applications-import-template.xlsx"
        allowUpdate={true}
      />

      {/* View Application Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>{selectedApp?.id}</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="grid grid-cols-2 gap-4 py-4 text-sm">
              {[
                { label: 'Student', value: selectedApp.studentName },
                { label: 'University', value: selectedApp.university },
                { label: 'Country', value: selectedApp.country },
                { label: 'Intake', value: selectedApp.intake },
                { label: 'Counselor', value: selectedApp.counselor || '-' },
                { label: 'Submission Date', value: selectedApp.submissionDate },
                { label: 'Decision Date', value: selectedApp.decisionDate },
                { label: 'Last Updated', value: selectedApp.lastUpdated },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-gray-800 font-medium">{value}</div>
                </div>
              ))}
              <div className="col-span-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</div>
                <StatusBadge status={selectedApp.status} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>Close</Button>
            <Button onClick={() => { setShowViewModal(false); if (selectedApp) handleEditApplication(selectedApp); }}>Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Application Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[450px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>{selectedApp?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm">University</Label>
              <Input className="col-span-3" value={editForm.university || ''} onChange={e => setEditForm(f => ({ ...f, university: e.target.value }))} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm">Country</Label>
              <Input className="col-span-3" value={editForm.country || ''} onChange={e => setEditForm(f => ({ ...f, country: e.target.value }))} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm">Intake</Label>
              <Input className="col-span-3" value={editForm.intake || ''} onChange={e => setEditForm(f => ({ ...f, intake: e.target.value }))} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm">Status</Label>
              <div className="col-span-3">
                <Select value={editForm.status || ''} onValueChange={val => setEditForm(f => ({ ...f, status: val as Application['status'] }))}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="decision-received">Decision Received</SelectItem>
                    <SelectItem value="pending-docs">Pending Docs</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm">Counselor</Label>
              <Input className="col-span-3" value={editForm.counselor || ''} onChange={e => setEditForm(f => ({ ...f, counselor: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={isRowUpdating}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={isRowUpdating}>{isRowUpdating ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Row Change Status Modal */}
      <Dialog open={showRowChangeStatusModal} onOpenChange={setShowRowChangeStatusModal}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>{selectedApp?.id} — {selectedApp?.studentName}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block text-sm font-medium text-gray-700">New Status</Label>
            <Select value={rowStatus} onValueChange={setRowStatus}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select a status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="decision-received">Decision Received</SelectItem>
                <SelectItem value="pending-docs">Pending Docs</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRowChangeStatusModal(false)} disabled={isRowUpdating}>Cancel</Button>
            <Button onClick={handleSaveRowStatus} disabled={isRowUpdating}>{isRowUpdating ? 'Saving...' : 'Apply'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Row Assign Counselor Modal */}
      <Dialog open={showRowAssignCounselorModal} onOpenChange={setShowRowAssignCounselorModal}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle>Assign Counselor</DialogTitle>
            <DialogDescription>{selectedApp?.id} — {selectedApp?.studentName}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="row-counselor" className="mb-2 block text-sm font-medium text-gray-700">Counselor Name</Label>
            <Input
              id="row-counselor"
              placeholder="e.g. Sarah Johnson"
              value={rowCounselorName}
              onChange={e => setRowCounselorName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSaveRowCounselor(); }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRowAssignCounselorModal(false)} disabled={isRowUpdating}>Cancel</Button>
            <Button onClick={handleSaveRowCounselor} disabled={isRowUpdating}>{isRowUpdating ? 'Saving...' : 'Assign'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Timeline Modal */}
      <Dialog open={showTimelineModal} onOpenChange={setShowTimelineModal}>
        <DialogContent className="sm:max-w-[420px] bg-white">
          <DialogHeader>
            <DialogTitle>Application Timeline</DialogTitle>
            <DialogDescription>{selectedApp?.id} — {selectedApp?.studentName}</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="py-4">
              <ol className="relative border-l-2 border-purple-100 ml-4 space-y-6">
                {[
                  { label: 'Application Created', date: '-', icon: FileText, color: 'bg-purple-500' },
                  { label: 'Documents Submitted', date: selectedApp.submissionDate !== '-' ? selectedApp.submissionDate : 'Pending', icon: Send, color: selectedApp.submissionDate !== '-' ? 'bg-blue-500' : 'bg-gray-300' },
                  { label: 'Decision Received', date: selectedApp.decisionDate !== '-' ? selectedApp.decisionDate : 'Awaiting', icon: CheckCircle, color: selectedApp.decisionDate !== '-' ? 'bg-green-500' : 'bg-gray-300' },
                  { label: 'Last Updated', date: selectedApp.lastUpdated, icon: Clock, color: 'bg-amber-500' },
                ].map(({ label, date, icon: Icon, color }) => (
                  <li key={label} className="ml-6">
                    <span className={`absolute -left-[13px] w-6 h-6 rounded-full flex items-center justify-center ${color}`}>
                      <Icon size={12} className="text-white" strokeWidth={2} />
                    </span>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</div>
                    <div className="text-sm font-medium text-gray-800 mt-0.5">{date}</div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Current Status</span>
                <StatusBadge status={selectedApp.status} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimelineModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </TooltipProvider>
  );
};