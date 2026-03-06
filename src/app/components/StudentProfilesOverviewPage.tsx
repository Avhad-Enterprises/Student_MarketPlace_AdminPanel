import React, { useState, useEffect, useCallback } from 'react';
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
  Users,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Plane,
  Eye,
  UserCog,
  Clock
} from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { format } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import Slider from "react-slick";

import { useRouter } from 'next/navigation';
import { ExportDialog, ExportColumn } from './common/ExportDialog';
import { ImportDialog, ImportField } from './common/ImportDialog';
import { ChangeCounselorModal } from './students/ChangeCounselorModal';
import { AddStudentModal } from './AddStudentModal';
import { ArchiveStudentModal } from './students/ArchiveStudentModal';
import { getAllStudents, getStudentMetrics, Student as BackendStudent } from '../services/studentsService';

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

// --- CompletionBadge Component ---
interface CompletionBadgeProps {
  percentage: number;
}

const CompletionBadge: React.FC<CompletionBadgeProps> = ({ percentage }) => {
  const getConfig = () => {
    if (percentage === 100) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    if (percentage >= 75) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    if (percentage >= 50) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  };

  const config = getConfig();

  return (
    <span className={`px-2 py-1 rounded text-[11px] font-medium border inline-flex items-center justify-center ${config.bg} ${config.text} ${config.border}`}>
      {percentage}%
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

// --- MobileStudentCard Component ---
interface StudentProfile {
  id: string;
  dbId: string;
  name: string;
  email: string;
  completion: number;
  countryPreference: string;
  intake: string;
  counselor: string;
  visaStage: string;
  lastUpdated: string;
  createdOn: string;
  raw?: BackendStudent;
}

interface MobileStudentCardProps {
  student: StudentProfile;
  isSelected: boolean;
  onToggleSelect: () => void;
  onViewProfile: (id: string) => void;
}

const MobileStudentCard: React.FC<MobileStudentCardProps> = ({ student, isSelected, onToggleSelect, onViewProfile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 w-full transition-all active:scale-[0.99] cursor-pointer flex flex-col gap-2 ${isSelected ? 'bg-purple-50/30' : ''}`}>
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-[#253154] text-[15px]">{student.id}</span>
        <span className="bg-[#F4F4F4] text-gray-500 text-[10px] px-2 py-1 rounded-lg">Tap to view</span>
        <span className="font-bold text-[#253154] text-[15px] ml-auto"><CompletionBadge percentage={student.completion} /></span>
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
        <span className="text-gray-600 text-sm">{student.name}</span>
        <div className="ml-auto text-xs text-gray-500">
          {student.intake}
        </div>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div className="mt-2 pt-3 border-t border-gray-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Email</div>
              <div className="text-sm text-gray-700 font-medium truncate">{student.email}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Country</div>
              <div className="text-sm text-gray-700 font-medium">{student.countryPreference}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Counselor</div>
              <div className="text-sm text-gray-700 font-medium">{student.counselor}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Visa Stage</div>
              <div className="text-sm text-gray-700 font-medium">{student.visaStage}</div>
            </div>
          </div>
          <button
            onClick={() => onViewProfile(student.dbId)}
            className="w-full h-10 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0c4a] transition-colors font-medium text-sm"
          >
            View Profile
          </button>
        </div>
      )}
    </div>
  );
};

// --- Helper: Calculate Profile Completion ---
const calculateCompletion = (student: BackendStudent): number => {
  const fields = [
    "first_name",
    "last_name",
    "email",
    "date_of_birth",
    "country_code",
    "phone_number",
    "nationality",
    "current_country",
    "primary_destination",
    "intended_intake",
    "current_stage",
    "assigned_counselor",
  ];

  const completedFields = fields.filter((f) => {
    const val = (student as any)[f];
    return val && val.toString().trim() !== "";
  });

  return Math.round((completedFields.length / fields.length) * 100);
};

// --- Main Component ---
export const StudentProfilesOverviewPage: React.FC = () => {
  // State management
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31)
  });
  const [activeMobileMenu, setActiveMobileMenu] = useState<'none' | 'import' | 'search'>('none');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['id', 'name', 'email', 'completion', 'country', 'intake', 'counselor', 'visaStage']);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);

  // Dialog states
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showCounselorModal, setShowCounselorModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [exportScope, setExportScope] = useState<'all' | 'selected'>('all');

  const [studentToEdit, setStudentToEdit] = useState<BackendStudent | null>(null);
  const [studentToArchive, setStudentToArchive] = useState<{ id: string, name: string } | null>(null);
  const [selectedIndividualStudent, setSelectedIndividualStudent] = useState<BackendStudent | null>(null);

  const router = useRouter();

  // Sample data (now state-driven)
  const [studentsList, setStudentsList] = useState<StudentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Filters and Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCompletion, setFilterCompletion] = useState<string>('All');
  const [filterVisaStage, setFilterVisaStage] = useState<string>('All Stages');

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({ total: 0, totalPages: 0 });
  const [metricsData, setMetricsData] = useState({
    totalStudents: 0,
    activeStudents: 0,
    incompleteProfiles: 0,
    readyForApplication: 0,
    visaInProgress: 0
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchStudentsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllStudents({
        page: currentPage,
        limit: rowsPerPage,
        search: debouncedSearch,
        sort: sortField,
        order: sortOrder,
        status: filterVisaStage !== 'All Stages' ? filterVisaStage : undefined,
      });

      const mappedStudents: StudentProfile[] = response.data.map(s => ({
        id: s.student_id,
        dbId: s.id,
        name: `${s.first_name} ${s.last_name}`,
        email: s.email,
        completion: calculateCompletion(s),
        countryPreference: s.primary_destination || 'Not Set',
        intake: s.intended_intake || 'Not Set',
        counselor: s.assigned_counselor || 'Unassigned',
        visaStage: s.current_stage || 'Not Started',
        lastUpdated: 'Recently',
        createdOn: format(new Date(s.created_at), 'MMM dd, yyyy'),
        raw: s
      }));

      setStudentsList(mappedStudents);
      setPaginationInfo({
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      });
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error("Failed to load student profiles");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, rowsPerPage, debouncedSearch, sortField, sortOrder, filterVisaStage]);

  const fetchMetrics = async () => {
    try {
      const m = await getStudentMetrics();
      setMetricsData({
        totalStudents: m.totalStudents || 0,
        activeStudents: m.activeStudents || 0,
        incompleteProfiles: m.atRiskStudents || 0,
        readyForApplication: m.applicationsInProgress || 0,
        visaInProgress: 0
      });
    } catch (e) {
      console.error("Failed to fetch metrics", e);
    }
  };

  useEffect(() => {
    fetchStudentsData();
    fetchMetrics();
  }, [fetchStudentsData]);

  // Replace 'students' with 'studentsList' in other parts of the component
  const students = studentsList;

  // Metrics data
  const metrics = [
    {
      title: 'Total Students',
      value: (metricsData.totalStudents || 0).toLocaleString(),
      icon: Users,
      bgClass: 'bg-purple-50',
      colorClass: 'text-purple-600',
      tooltip: 'All registered students'
    },
    {
      title: 'Active Students',
      value: (metricsData.activeStudents || 0).toLocaleString(),
      icon: CheckCircle,
      bgClass: 'bg-green-50',
      colorClass: 'text-green-600',
      tooltip: 'Currently engaged in applications or visa flow'
    },
    {
      title: 'Incomplete Profiles',
      value: (metricsData.incompleteProfiles || 0).toLocaleString(),
      icon: AlertCircle,
      bgClass: 'bg-amber-50',
      colorClass: 'text-amber-600',
      tooltip: 'Missing mandatory information'
    },
    {
      title: 'Ready for Application',
      value: (metricsData.readyForApplication || 0).toLocaleString(),
      icon: FileCheck,
      bgClass: 'bg-blue-50',
      colorClass: 'text-blue-600',
      tooltip: 'Profile complete and validated'
    },
    {
      title: 'Visa In Progress',
      value: (metricsData.visaInProgress || 0).toLocaleString(),
      icon: Plane,
      bgClass: 'bg-pink-50',
      colorClass: 'text-pink-600',
      tooltip: 'Students currently in visa stage'
    }
  ];

  // Column configuration
  const allColumns = [
    { key: 'id', label: 'Student ID' },
    { key: 'name', label: 'Student Name' },
    { key: 'email', label: 'Email' },
    { key: 'completion', label: 'Profile Completion' },
    { key: 'country', label: 'Country Preference' },
    { key: 'intake', label: 'Intake' },
    { key: 'counselor', label: 'Assigned Counselor' },
    { key: 'visaStage', label: 'Visa Stage' },
    { key: 'updated', label: 'Last Updated' },
    { key: 'created', label: 'Created On' }
  ];

  // Handlers
  const handleOpenExportSelected = () => {
    setExportScope('selected');
    setShowExportDialog(true);
  };

  const handleOpenExportAll = () => {
    setExportScope('all');
    setShowExportDialog(true);
  };

  const handleBulkAssignCounselor = (data: any) => {
    toast.success(`Counselor assigned to ${selectedStudents.length} students`);
    handleClearSelection();
  };

  const handleActionViewProfile = (studentId: string) => {
    router.push(`/students/${studentId}`);
  };

  const handleActionEditProfile = (student: BackendStudent) => {
    setStudentToEdit(student);
    setShowAddModal(true);
  };

  const handleActionViewApplications = (studentId: string) => {
    router.push(`/students/${studentId}?tab=applications`);
  };

  const handleActionAssignCounselor = (student: BackendStudent) => {
    setSelectedIndividualStudent(student);
    setShowCounselorModal(true);
  };

  const handleActionViewTimeline = (studentId: string) => {
    router.push(`/students/${studentId}?tab=activity`);
  };

  const handleActionArchiveStudent = (studentId: string, name: string) => {
    setStudentToArchive({ id: studentId, name });
    setShowArchiveModal(true);
  };

  const handleConfirmArchive = (data: any) => {
    toast.success(`Student ${studentToArchive?.name} archived successfully`);
    setShowArchiveModal(false);
    fetchStudentsData();
  };

  const handleIndividualCounselorSave = (data: any) => {
    toast.success(`Counselor updated for ${selectedIndividualStudent?.first_name}`);
    setShowCounselorModal(false);
    fetchStudentsData();
  };

  const handleRefresh = () => {
    fetchStudentsData();
    fetchMetrics();
    toast.success("Refreshing data...");
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
      setSelectAllStore(false);
    } else {
      setSelectedStudents(students.map(s => s.id));
      setSelectAllStore(false);
    }
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllStore = () => {
    setSelectAllStore(true);
    setSelectedStudents(students.map(s => s.id));
  };

  const handleClearSelection = () => {
    setSelectedStudents([]);
    setSelectAllStore(false);
  };

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(k => k !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setShowSortMenu(false);
  };

  const handleFilterCompletion = (value: string) => {
    setFilterCompletion(value);
    setCurrentPage(1);
    setShowFilterMenu(false);
  };

  const handleFilterVisaStage = (value: string) => {
    setFilterVisaStage(value);
    setCurrentPage(1);
    setShowFilterMenu(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCompletion('All');
    setFilterVisaStage('All Stages');
    setSortField('created_at');
    setSortOrder('desc');
    setCurrentPage(1);
    toast.success("Filters cleared");
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
    { id: 'name', label: 'Student Name', defaultSelected: true },
    { id: 'email', label: 'Email Address', defaultSelected: true },
    { id: 'completion', label: 'Profile Completion %', defaultSelected: true },
    { id: 'country', label: 'Country Preference', defaultSelected: true },
    { id: 'intake', label: 'Intake Period', defaultSelected: true },
    { id: 'counselor', label: 'Assigned Counselor', defaultSelected: false },
    { id: 'visaStage', label: 'Visa Stage', defaultSelected: false },
    { id: 'lastUpdated', label: 'Last Updated', defaultSelected: false },
    { id: 'createdOn', label: 'Created On', defaultSelected: false }
  ];

  const importFields: ImportField[] = [
    { id: 'studentId', label: 'Student ID', required: false, type: 'text' },
    { id: 'studentName', label: 'Student Name', required: true, type: 'text' },
    { id: 'email', label: 'Email Address', required: true, type: 'text' },
    { id: 'countryPreference', label: 'Country Preference', required: false, type: 'text' },
    { id: 'intake', label: 'Intake Period', required: false, type: 'text' },
    { id: 'assignedCounselor', label: 'Assigned Counselor', required: false, type: 'text' },
    { id: 'visaStage', label: 'Visa Stage', required: false, type: 'select', options: ['Not Started', 'In Progress', 'Submitted', 'Approved', 'Rejected'] }
  ];

  const handleExport = async (options: any) => {
    console.log('Exporting with options:', options);
    toast.success(`Exporting ${options.scope} student profiles as ${options.format.toUpperCase()}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleImport = async (data: any[], mode: any) => {
    console.log('Importing:', data, 'Mode:', mode);
    toast.success(`Successfully imported ${data.length} student profiles`);
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
              onClick={handleOpenExportAll}
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
            <button className="flex items-center gap-2 bg-[#0e042f] text-white px-6 h-[50px] rounded-xl shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-colors text-[16px] font-medium">
              <Plus size={20} strokeWidth={1.5} />
              Add New
            </button>
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
            <button className="flex-1 h-[50px] bg-[#0e042f] text-white rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 font-medium">
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
              placeholder="Search by name, email, student ID"
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
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Profile Completion</div>
                    {['All', 'Complete (100%)', 'Incomplete', 'Ready for Application'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleFilterCompletion(status)}
                        className={`w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left flex items-center justify-between ${filterCompletion === status ? 'text-purple-600 font-medium bg-purple-50/50' : 'text-gray-700'}`}
                      >
                        <span>{status}</span>
                        {filterCompletion === status && <Check size={14} />}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-1" />
                    <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Visa Stage</div>
                    {['All Stages', 'Not Started', 'In Progress', 'Submitted', 'Approved'].map(stage => (
                      <button
                        key={stage}
                        onClick={() => handleFilterVisaStage(stage)}
                        className={`w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left flex items-center justify-between ${filterVisaStage === stage ? 'text-purple-600 font-medium bg-purple-50/50' : 'text-gray-700'}`}
                      >
                        <span>{stage}</span>
                        {filterVisaStage === stage && <Check size={14} />}
                      </button>
                    ))}
                    <div className="h-px bg-gray-100 my-1" />
                    <button
                      onClick={handleClearFilters}
                      className="w-full px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-red-600 text-left font-medium"
                    >
                      Clear All Filters
                    </button>
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
                    {[
                      { label: 'Name (A-Z)', field: 'first_name' },
                      { label: 'Email', field: 'email' },
                      { label: 'Date Created', field: 'created_at' },
                      { label: 'Status', field: 'account_status' }
                    ].map(option => (
                      <button
                        key={option.field}
                        onClick={() => handleSort(option.field)}
                        className={`w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-left flex items-center justify-between ${sortField === option.field ? 'text-purple-600 font-medium bg-purple-50/50' : 'text-gray-700'}`}
                      >
                        <span>{option.label}</span>
                        {sortField === option.field && (
                          sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
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
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Mobile Bottom Sheet - Import Menu */}
        {activeMobileMenu === 'import' && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-40 transition-opacity"
              onClick={() => setActiveMobileMenu('none')}
            />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[30px] z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl custom-scrollbar-light">
              <div className="p-6 flex flex-col gap-6">
                {/* Drag handle */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-2" />

                {/* Actions Section */}
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

                {/* Close Button */}
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

        {/* Mobile Bottom Sheet - Search Menu */}
        {activeMobileMenu === 'search' && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-40 transition-opacity"
              onClick={() => setActiveMobileMenu('none')}
            />
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[30px] z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl custom-scrollbar-light">
              <div className="p-6 flex flex-col gap-6">
                {/* Drag handle */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-2" />

                {/* Filter by Completion */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Profile Completion</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', 'Complete (100%)', 'Incomplete', 'Ready for Application'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleFilterCompletion(status)}
                        className={`border rounded-full text-xs font-medium px-2 py-2 transition-colors ${filterCompletion === status ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100" />

                {/* Sort Options */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sort By</div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: 'Name (A-Z)', field: 'first_name' },
                      { label: 'Email', field: 'email' },
                      { label: 'Date Created', field: 'created_at' },
                      { label: 'Status', field: 'account_status' }
                    ].map(option => (
                      <button
                        key={option.field}
                        onClick={() => handleSort(option.field)}
                        className={`p-3 rounded-xl flex items-center justify-between transition-colors ${sortField === option.field ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        <span className="font-medium text-sm">{option.label}</span>
                        {sortField === option.field && (
                          sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Close Button */}
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
        {selectedStudents.length > 0 && (
          <div className="bg-purple-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm border-b border-purple-100 mb-6 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <span className="text-purple-900 font-medium">{selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected</span>
              {selectedStudents.length === students.length && !selectAllStore && (
                <>
                  <span className="text-purple-700">•</span>
                  <button onClick={handleSelectAllStore} className="text-purple-700 font-bold hover:underline">
                    Select all {paginationInfo.total.toLocaleString()} students
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCounselorModal(true)}
                className="text-purple-700 font-bold hover:underline"
              >
                Assign Counselor
              </button>
              <button
                onClick={handleOpenExportSelected}
                className="text-purple-700 font-bold hover:underline"
              >
                Export Selected
              </button>
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
                      checked={selectedStudents.length === students.length}
                      partial={selectedStudents.length > 0 && selectedStudents.length < students.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {visibleColumns.includes('id') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Student ID</th>}
                  {visibleColumns.includes('name') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Student Name</th>}
                  {visibleColumns.includes('email') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Email</th>}
                  {visibleColumns.includes('completion') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Completion</th>}
                  {visibleColumns.includes('country') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Country</th>}
                  {visibleColumns.includes('intake') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Intake</th>}
                  {visibleColumns.includes('counselor') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Counselor</th>}
                  {visibleColumns.includes('visaStage') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Visa Stage</th>}
                  {visibleColumns.includes('updated') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Last Updated</th>}
                  {visibleColumns.includes('created') && <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Created On</th>}
                  <th className="sticky top-0 z-10 bg-white px-6 py-4 text-left text-[14px] font-bold text-[#253154] tracking-wider uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw size={24} className="text-purple-600 animate-spin" />
                        <span className="text-gray-500 font-medium">Loading students...</span>
                      </div>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-12 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student.id}
                      className={`hover:bg-gray-50 transition-colors group ${selectedStudents.includes(student.id) ? 'bg-purple-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <CustomCheckbox
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleToggleStudent(student.id)}
                        />
                      </td>
                      {visibleColumns.includes('id') && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#253154]">{student.id}</td>}
                      {visibleColumns.includes('name') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.name}</td>}
                      {visibleColumns.includes('email') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>}
                      {visibleColumns.includes('completion') && <td className="px-6 py-4 whitespace-nowrap text-sm"><CompletionBadge percentage={student.completion} /></td>}
                      {visibleColumns.includes('country') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.countryPreference}</td>}
                      {visibleColumns.includes('intake') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.intake}</td>}
                      {visibleColumns.includes('counselor') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.counselor}</td>}
                      {visibleColumns.includes('visaStage') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.visaStage}</td>}
                      {visibleColumns.includes('updated') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.lastUpdated}</td>}
                      {visibleColumns.includes('created') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.createdOn}</td>}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="relative group/menu">
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <MoreHorizontal size={18} className="text-gray-400" />
                          </button>
                          <div className="hidden group-hover/menu:block absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-2 w-52">
                            <button
                              onClick={() => handleActionViewProfile(student.dbId)}
                              className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2"
                            >
                              <Eye size={16} />
                              View Profile
                            </button>
                            <button
                              onClick={() => student.raw && handleActionEditProfile(student.raw)}
                              className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2"
                            >
                              <Edit size={16} />
                              Edit Profile
                            </button>
                            <button
                              onClick={() => handleActionViewApplications(student.dbId)}
                              className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2"
                            >
                              <Copy size={16} />
                              View Applications
                            </button>
                            <button
                              onClick={() => student.raw && handleActionAssignCounselor(student.raw)}
                              className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2"
                            >
                              <UserCog size={16} />
                              Assign Counselor
                            </button>
                            <button
                              onClick={() => handleActionViewTimeline(student.dbId)}
                              className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 text-left flex items-center gap-2"
                            >
                              <Clock size={16} />
                              View Timeline
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            <button
                              onClick={() => handleActionArchiveStudent(student.dbId, student.name)}
                              className="w-full px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-red-600 text-left flex items-center gap-2"
                            >
                              <Archive size={16} />
                              Archive Student
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {students.map((student) => (
              <MobileStudentCard
                key={student.id}
                student={student}
                isSelected={selectedStudents.includes(student.id)}
                onToggleSelect={() => handleToggleStudent(student.id)}
                onViewProfile={handleActionViewProfile}
              />
            ))}
          </div>

          {/* Pagination Bar */}
          <div className="h-[80px] bg-white w-full flex items-center justify-between px-6 rounded-tr-[30px] shadow-[0px_-5px_25px_rgba(0,0,0,0.03)] relative z-20 border-t border-gray-50">
            {/* Left: Rows Per Page */}
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
                            setCurrentPage(1);
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

            {/* Right: Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} strokeWidth={2} className="text-gray-500" />
              </button>
              <button
                disabled={currentPage >= paginationInfo.totalPages}
                onClick={() => setCurrentPage(prev => Math.min(paginationInfo.totalPages, prev + 1))}
                className="w-10 h-10 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} strokeWidth={2} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Student Profiles"
        totalCount={exportScope === 'selected' ? selectedStudents.length : paginationInfo.total}
        selectedCount={selectedStudents.length}
        columns={exportColumns}
        supportsDateRange={true}
        onExport={handleExport}
      />

      {/* Change Counselor Modal */}
      <ChangeCounselorModal
        open={showCounselorModal}
        onOpenChange={(open) => {
          setShowCounselorModal(open);
          if (!open) setSelectedIndividualStudent(null);
        }}
        studentName={selectedIndividualStudent ? `${selectedIndividualStudent.first_name} ${selectedIndividualStudent.last_name}` : (selectedStudents.length > 0 ? `${selectedStudents.length} Selected Students` : '')}
        currentCounselor={selectedIndividualStudent ? { name: selectedIndividualStudent.assigned_counselor || 'Unassigned', initials: (selectedIndividualStudent.assigned_counselor || 'U').substring(0, 2).toUpperCase() } : { name: 'Multiple', initials: 'MS' }}
        onSave={selectedIndividualStudent ? handleIndividualCounselorSave : handleBulkAssignCounselor}
      />

      {/* Add/Edit Student Modal */}
      <AddStudentModal
        open={showAddModal}
        onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) setStudentToEdit(null);
        }}
        studentToEdit={studentToEdit}
        onStudentAdded={fetchStudentsData}
      />

      {/* Archive Student Modal */}
      <ArchiveStudentModal
        open={showArchiveModal}
        onOpenChange={(open) => {
          setShowArchiveModal(open);
          if (!open) setStudentToArchive(null);
        }}
        studentName={studentToArchive?.name || ''}
        onConfirm={handleConfirmArchive}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Student Profiles"
        fields={importFields}
        onImport={handleImport}
        templateUrl="/templates/student-profiles-import-template.xlsx"
        allowUpdate={true}
      />
    </TooltipProvider>
  );
};