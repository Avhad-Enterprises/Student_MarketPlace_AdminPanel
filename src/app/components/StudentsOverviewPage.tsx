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
  Users,
  CheckCircle,
  FileText,
  AlertTriangle,
  Calendar as CalendarPlus,
  Eye,
  UserCog,
  X,
  TrendingUp,
  TrendingDown,
  Trash2,
  StickyNote
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
import { CustomSelect } from './common/CustomSelect';
import { ConfirmDialog } from './ui/modals/ConfirmDialog';
// Removed AddStudentModal import
import { getAllStudents, Student, PaginationData, deleteStudent, getStudentMetrics, StudentMetrics, createStudent, updateStudent } from '../services/studentsService';
import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

// --- CustomCheckbox Component ---
interface CustomCheckboxProps {
  checked: boolean;
  partial?: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  partial = false,
  onChange,
  ariaLabel
}) => {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${checked || partial
        ? 'bg-[#0e042f] border-[#0e042f]'
        : 'bg-white border-gray-300 hover:border-gray-400'
        }`}
    >
      {checked && (
        <Check size={14} className="text-white" strokeWidth={3} />
      )}
      {partial && !checked && (
        <div className="w-2.5 h-0.5 bg-white rounded-full" />
      )}
    </div>
  );
};

// --- METRIC CARD WITH INLINE EXPANSION ---
interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ElementType;
  bgClass: string;
  colorClass: string;
  tooltip: string;
  isActive?: boolean;
  isCompressed?: boolean;
  onClick?: () => void;
  expandedContent?: {
    trend: {
      direction: 'up' | 'down';
      value: string;
      label: string;
    };
    microInsights?: {
      label: string;
      value: string;
    }[];
    breakdowns: {
      label: string;
      items: {
        name: string;
        count: number;
        color: string;
      }[];
    }[];
  };
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  bgClass,
  colorClass,
  tooltip,
  isActive = false,
  isCompressed = false,
  onClick,
  expandedContent
}) => {
  // Compressed state (when another card is expanded)
  if (isCompressed) {
    return (
      <div
        onClick={onClick}
        className="bg-white p-3 rounded-2xl shadow-md flex flex-col items-center justify-center h-[130px] relative overflow-hidden group transition-all duration-300 ease-in-out border-2 border-transparent hover:shadow-lg hover:border-purple-200 cursor-pointer"
      >
        <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center mb-2 flex-shrink-0`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div className="text-[20px] font-bold text-[#253154] leading-none">{value}</div>
        <span className="text-[10px] text-gray-500 font-medium mt-1.5 text-center leading-tight px-1">{title}</span>
      </div>
    );
  }

  // Expanded state (with border highlight, same size as normal)
  if (isActive) {
    return (
      <div
        onClick={onClick}
        className="bg-white p-5 rounded-2xl shadow-lg relative overflow-hidden transition-[border-color,box-shadow] duration-300 ease-in-out border-2 border-[#e9d4ff] cursor-pointer h-[130px] flex-shrink-0"
      >
        {expandedContent ? (
          // With data - show insights
          <div className="flex gap-4 h-full">
            {/* Left Column: Metric Summary */}
            <div className="flex flex-col justify-between flex-shrink-0 min-w-0" style={{ width: '180px' }}>
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[#253154] font-medium text-[14px]">{title}</span>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded-full border border-current text-[9px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors flex-shrink-0"
                      >
                        i
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2">
                      <p>{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Icon + Value */}
              <div className="flex items-end gap-2.5">
                <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[26px] font-bold text-[#253154] leading-none">{value}</div>
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-px bg-gray-200 flex-shrink-0" />

            {/* Middle Column: Insights & Breakdowns */}
            <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
              {/* Trend Indicator */}
              <div className={`inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${expandedContent.trend.direction === 'up'
                ? 'bg-green-50 text-green-700'
                : 'bg-blue-50 text-blue-700'
                }`}>
                {expandedContent.trend.direction === 'up' ? (
                  <TrendingUp size={12} strokeWidth={2.5} />
                ) : (
                  <TrendingDown size={12} strokeWidth={2.5} />
                )}
                <span className="font-bold">{expandedContent.trend.value}</span>
                <span className="opacity-75">{expandedContent.trend.label}</span>
              </div>

              {/* Micro Insights */}
              {expandedContent.microInsights && (
                <div className="space-y-1">
                  {expandedContent.microInsights.map((insight, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {insight.label}:
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium px-1">
                        {insight.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Breakdown Chips */}
              <div className="space-y-2">
                {expandedContent.breakdowns.map((breakdown, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {breakdown.label}:
                    </span>
                    <div className="flex flex-wrap gap-1.5 min-w-0">
                      {breakdown.items.slice(0, 3).map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className={`${item.color} px-2 py-0.5 rounded text-[10px] font-medium inline-flex items-center gap-1 border border-current border-opacity-10 whitespace-nowrap`}
                        >
                          <span>{item.name}</span>
                          <span className="font-bold">·</span>
                          <span className="font-bold">{item.count}</span>
                        </div>
                      ))}
                      {breakdown.items.length > 3 && (
                        <div className="text-[10px] text-gray-500 font-medium px-1">
                          +{breakdown.items.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Actions */}
            <div className="flex flex-col gap-2 justify-center flex-shrink-0 min-w-0" style={{ width: '140px' }}>
              <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0c4a] transition-colors text-[11px] font-medium">
                <Eye size={13} />
                View Students
              </button>
              <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-[#253154] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-[11px] font-medium">
                <Download size={13} />
                Export
              </button>
            </div>
          </div>
        ) : (
          // Without data - show standard card
          <>
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-[#253154] font-medium text-[15px]">{title}</span>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors flex-shrink-0"
                    >
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
              <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center flex-shrink-0`}>
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</div>
              </div>
            </div>

            {/* Decorative background */}
            <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 pointer-events-none">
              <Icon size={80} />
            </div>
          </>
        )}
      </div>
    );
  }

  // Default/Normal state
  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between h-[130px] relative overflow-hidden group transition-all duration-300 ease-in-out border-2 border-transparent hover:shadow-lg hover:border-purple-200 cursor-pointer"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-[#253154] font-medium text-[15px]">{title}</span>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors flex-shrink-0"
              >
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
        <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center flex-shrink-0`}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
        <div>
          <div className="text-[28px] font-bold text-[#253154] leading-none mb-1">{value}</div>
        </div>
      </div>

      {/* Decorative background */}
      <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
        <Icon size={80} />
      </div>
    </div>
  );
};

// --- MobileStudentCard Component ---
// Use Student interface from service


interface MobileStudentCardProps {
  student: Student;
  onSelect: (id: string) => void;
  isSelected: boolean;
  onNavigate?: (page: string) => void;
  onEdit?: (studentId: string) => void;
  onArchive?: (student: Student) => void;
}

const MobileStudentCard: React.FC<MobileStudentCardProps> = ({ student, onSelect, isSelected, onNavigate, onEdit, onArchive }) => {
  const getStatusConfig = (isActive: boolean) => {
    return isActive
      ? { label: 'Active', bgColor: 'bg-green-50', textColor: 'text-green-700' }
      : { label: 'Inactive', bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
  };

  const getRiskLevelConfig = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return { label: 'Low', bgColor: 'bg-green-50', textColor: 'text-green-700' };
      case 'medium': return { label: 'Medium', bgColor: 'bg-orange-50', textColor: 'text-orange-700' };
      case 'high': return { label: 'High', bgColor: 'bg-red-50', textColor: 'text-red-700' };
      default: return { label: riskLevel, bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
    }
  };

  const statusConfig = getStatusConfig(student.account_status);
  const riskConfig = getRiskLevelConfig(student.risk_level);

  // Parse country preferences if it&apos;s a string
  let countryPref = 'N/A';
  try {
    const parsed = JSON.parse(student.country_preferences);
    if (Array.isArray(parsed) && parsed.length > 0) countryPref = parsed.join(', ');
  } catch (e) {
    countryPref = student.country_preferences || 'N/A';
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <CustomCheckbox
            checked={isSelected}
            onChange={() => onSelect(student.id)}
            ariaLabel={`Select ${student.first_name} ${student.last_name}`}
          />
          <div className="flex-1">
            <h3
              onClick={(e) => { e.stopPropagation(); onNavigate?.(`student-detail:${student.id}`); }}
              className="font-bold text-[#253154] text-base cursor-pointer hover:text-purple-600 hover:underline"
            >
              {student.first_name} {student.last_name}
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">{student.email}</p>
            <p className="text-xs text-gray-500 mt-1">{student.student_id}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
          {statusConfig.label}
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${riskConfig.bgColor} ${riskConfig.textColor}`}>
          {riskConfig.label}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(student.id); }}
            className="flex items-center justify-center gap-2 h-10 bg-white border border-gray-100 text-[#253154] rounded-xl hover:bg-gray-50 transition-colors font-medium text-xs whitespace-nowrap shadow-sm"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onArchive?.(student); }}
            className="flex items-center justify-center gap-2 h-10 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors font-medium text-xs whitespace-nowrap"
          >
            <Archive size={14} /> Archive
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main StudentsOverviewPage Component ---
export const StudentsOverviewPage: React.FC<{ onNavigate: (page: string) => void; setStudentDetailTab?: (tab: string) => void }> = ({ onNavigate, setStudentDetailTab }) => {
  const router = useRouter();
  /* State for API Data */
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  });

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [studentToArchive, setStudentToArchive] = useState<Student | null>(null);
  // Removed studentToEdit and isAddStudentModalOpen states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [studentMetrics, setStudentMetrics] = useState<StudentMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Sort and Filter State
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'created_at',
    direction: 'desc'
  });
  const [filterConfig, setFilterConfig] = useState({
    status: '',
    riskLevel: ''
  });
  const [openFilterPopover, setOpenFilterPopover] = useState(false);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    studentId: true,
    firstName: true,
    email: true,
    status: true,
    riskLevel: true,
    countryPreferences: true,
    applicationsCount: true,
    assignedCounselor: true,
    actions: true
  });
  const [openColumnsPopover, setOpenColumnsPopover] = useState(false);

  // Fetch students from API
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await getAllStudents({
        page: currentPage,
        limit: rowsPerPage,
        search: debouncedSearchTerm,
        sort: sortConfig.key,
        order: sortConfig.direction,
        status: filterConfig.status,
        risk_level: filterConfig.riskLevel
      });
      setStudents(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    setMetricsLoading(true);
    const data = await getStudentMetrics();
    setStudentMetrics(data);
    setMetricsLoading(false);
  };

  React.useEffect(() => {
    fetchStudents();
    fetchMetrics();
  }, [currentPage, rowsPerPage, debouncedSearchTerm, sortConfig, filterConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key: 'status' | 'riskLevel', value: string) => {
    setFilterConfig(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter
  };

  // Debounce search term
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleMetricClick = (metricTitle: string) => {
    if (metricTitle === 'Total Students') {
      setActiveFilter(null);
      return;
    }
    setActiveFilter(activeFilter === metricTitle ? null : metricTitle);
  };

  // Action handlers
  const handleViewStudent = (studentId: string) => {
    setOpenActionMenuId(null);
    router.push(`/students/${studentId}?tab=overview`);
  };

  const handleEditStudent = (studentId: string) => {
    setOpenActionMenuId(null);
    router.push(`/students/add?id=${studentId}`);
  };

  const handleAddNote = (studentId: string) => {
    setOpenActionMenuId(null);
    router.push(`/students/${studentId}?tab=notes`);
  };

  const handleViewDocuments = (studentId: string) => {
    setOpenActionMenuId(null);
    router.push(`/students/${studentId}?tab=documents`);
  };

  const handleViewApplications = (studentId: string) => {
    setOpenActionMenuId(null);
    router.push(`/students/${studentId}?tab=applications`);
  };

  const handleViewPayments = (studentId: string) => {
    setOpenActionMenuId(null);
    router.push(`/students/${studentId}?tab=payments`);
  };

  const handleViewActivity = (studentId: string) => {
    setOpenActionMenuId(null);
    router.push(`/students/${studentId}?tab=activity`);
  };

  const handleViewServices = (studentId: string) => {
    setOpenActionMenuId(null);
    router.push(`/students/${studentId}?tab=services`);
  };

  const handleArchiveStudent = (student: Student) => {
    setOpenActionMenuId(null);
    setStudentToArchive(student);
    setShowArchiveDialog(true);
  };

  const confirmArchiveStudent = async () => {
    if (studentToArchive) {
      try {
        await deleteStudent(studentToArchive.id);
        toast.success(`Student ${studentToArchive.first_name} has been archived`);
        setShowArchiveDialog(false);
        setStudentToArchive(null);
        fetchStudents(); // Refresh list
      } catch (error) {
        toast.error('Failed to archive student');
      }
    }
  };

  // Generate insight data based on active metric
  const getInsightData = (metricTitle: string) => {
    switch (metricTitle) {
      case 'Active Students':
        return {
          trend: { direction: 'up' as const, value: '+8%', label: 'vs last month' },
          microInsights: [
            { label: 'Avg engagement score', value: '8.4/10' },
            { label: 'Most active intake', value: 'Fall 2024' },
          ],
          breakdowns: [
            {
              label: 'By Intake',
              items: [
                { name: 'Fall 2024', count: 892, color: 'bg-purple-50 text-purple-700' },
                { name: 'Spring 2024', count: 634, color: 'bg-blue-50 text-blue-700' },
                { name: 'Winter 2024', count: 366, color: 'bg-cyan-50 text-cyan-700' },
              ]
            },
            {
              label: 'By Country',
              items: [
                { name: 'Canada', count: 567, color: 'bg-red-50 text-red-700' },
                { name: 'Australia', count: 445, color: 'bg-yellow-50 text-yellow-700' },
                { name: 'UK', count: 334, color: 'bg-indigo-50 text-indigo-700' },
                { name: 'USA', count: 546, color: 'bg-green-50 text-green-700' },
              ]
            },
            {
              label: 'By Counselor',
              items: [
                { name: 'Sarah Johnson', count: 487, color: 'bg-pink-50 text-pink-700' },
                { name: 'Mike Davis', count: 623, color: 'bg-teal-50 text-teal-700' },
                { name: 'Emma Wilson', count: 782, color: 'bg-violet-50 text-violet-700' },
              ]
            }
          ]
        };
      case 'Applications In Progress':
        return {
          trend: { direction: 'up' as const, value: '+12%', label: 'vs last month' },
          microInsights: [
            { label: 'Avg time in this stage', value: '23 days' },
            { label: 'Top blocker', value: 'Awaiting university response' },
          ],
          breakdowns: [
            {
              label: 'By Intake',
              items: [
                { name: 'Fall 2024', count: 234, color: 'bg-purple-50 text-purple-700' },
                { name: 'Spring 2025', count: 156, color: 'bg-blue-50 text-blue-700' },
                { name: 'Winter 2025', count: 66, color: 'bg-cyan-50 text-cyan-700' },
              ]
            },
            {
              label: 'By Country',
              items: [
                { name: 'Canada', count: 178, color: 'bg-red-50 text-red-700' },
                { name: 'Australia', count: 134, color: 'bg-yellow-50 text-yellow-700' },
                { name: 'UK', count: 89, color: 'bg-indigo-50 text-indigo-700' },
                { name: 'USA', count: 55, color: 'bg-green-50 text-green-700' },
              ]
            },
            {
              label: 'By Counselor',
              items: [
                { name: 'Sarah Johnson', count: 167, color: 'bg-pink-50 text-pink-700' },
                { name: 'Mike Davis', count: 145, color: 'bg-teal-50 text-teal-700' },
                { name: 'Emma Wilson', count: 144, color: 'bg-violet-50 text-violet-700' },
              ]
            }
          ]
        };
      case 'At-Risk Students':
        return {
          trend: { direction: 'down' as const, value: '-5%', label: 'vs last month' },
          microInsights: [
            { label: 'Avg days overdue', value: '12 days' },
            { label: 'Primary risk', value: 'Documents missing' },
          ],
          breakdowns: [
            {
              label: 'By Intake',
              items: [
                { name: 'Fall 2024', count: 34, color: 'bg-purple-50 text-purple-700' },
                { name: 'Spring 2024', count: 28, color: 'bg-blue-50 text-blue-700' },
                { name: 'Winter 2024', count: 16, color: 'bg-cyan-50 text-cyan-700' },
              ]
            },
            {
              label: 'By Risk Factor',
              items: [
                { name: 'Documents Missing', count: 32, color: 'bg-orange-50 text-orange-700' },
                { name: 'Payment Overdue', count: 24, color: 'bg-red-50 text-red-700' },
                { name: 'No Contact', count: 22, color: 'bg-yellow-50 text-yellow-700' },
              ]
            },
            {
              label: 'By Counselor',
              items: [
                { name: 'Sarah Johnson', count: 28, color: 'bg-pink-50 text-pink-700' },
                { name: 'Mike Davis', count: 26, color: 'bg-teal-50 text-teal-700' },
                { name: 'Emma Wilson', count: 24, color: 'bg-violet-50 text-violet-700' },
              ]
            }
          ]
        };
      case 'Recently Added':
        return {
          trend: { direction: 'up' as const, value: '+15%', label: 'vs last period' },
          microInsights: [
            { label: 'Top source', value: 'Website referral' },
            { label: 'Conversion rate', value: '67%' },
          ],
          breakdowns: [
            {
              label: 'By Source',
              items: [
                { name: 'Website', count: 18, color: 'bg-blue-50 text-blue-700' },
                { name: 'Referral', count: 12, color: 'bg-green-50 text-green-700' },
                { name: 'Walk-in', count: 4, color: 'bg-purple-50 text-purple-700' },
              ]
            },
            {
              label: 'By Country',
              items: [
                { name: 'Canada', count: 14, color: 'bg-red-50 text-red-700' },
                { name: 'Australia', count: 10, color: 'bg-yellow-50 text-yellow-700' },
                { name: 'UK', count: 6, color: 'bg-indigo-50 text-indigo-700' },
                { name: 'USA', count: 4, color: 'bg-green-50 text-green-700' },
              ]
            },
            {
              label: 'By Counselor',
              items: [
                { name: 'Sarah Johnson', count: 12, color: 'bg-pink-50 text-pink-700' },
                { name: 'Mike Davis', count: 11, color: 'bg-teal-50 text-teal-700' },
                { name: 'Emma Wilson', count: 11, color: 'bg-violet-50 text-violet-700' },
              ]
            }
          ]
        };
      default:
        return undefined;
    }
  };

  // Define metrics data
  const metrics = [
    {
      title: 'Total Students',
      value: metricsLoading ? <Skeleton className="h-8 w-16" /> : (studentMetrics?.totalStudents?.toLocaleString() || '0'),
      icon: Users,
      bgClass: 'bg-indigo-50',
      colorClass: 'text-indigo-600',
      tooltip: 'Total registered students'
    },
    {
      title: 'Active Students',
      value: metricsLoading ? <Skeleton className="h-8 w-16" /> : (studentMetrics?.activeStudents?.toLocaleString() || '0'),
      icon: CheckCircle,
      bgClass: 'bg-green-50',
      colorClass: 'text-green-600',
      tooltip: 'Students with active status'
    },
    {
      title: 'Applications In Progress',
      value: metricsLoading ? <Skeleton className="h-8 w-16" /> : (studentMetrics?.applicationsInProgress?.toLocaleString() || '0'),
      icon: FileText,
      bgClass: 'bg-blue-50',
      colorClass: 'text-blue-600',
      tooltip: 'Applications under review'
    },
    {
      title: 'At-Risk Students',
      value: metricsLoading ? <Skeleton className="h-8 w-16" /> : (studentMetrics?.atRiskStudents?.toLocaleString() || '0'),
      icon: AlertTriangle,
      bgClass: 'bg-orange-50',
      colorClass: 'text-orange-600',
      tooltip: 'Students identified as high risk'
    },
    {
      title: 'Recently Added',
      value: metricsLoading ? <Skeleton className="h-8 w-16" /> : (studentMetrics?.recentlyAdded?.toLocaleString() || '0'),
      icon: CalendarPlus,
      bgClass: 'bg-pink-50',
      colorClass: 'text-pink-600',
      tooltip: 'Students added in last 30 days'
    }
  ];

  const toggleStudentSelection = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const allSelected = selectedStudents.length === students.length && students.length > 0;
  const someSelected = selectedStudents.length > 0 && selectedStudents.length < students.length;

  const getStatusConfig = (isActive: boolean) => {
    return isActive
      ? { label: 'Active', bgColor: 'bg-green-50', textColor: 'text-green-700' }
      : { label: 'Inactive', bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
  };

  const getRiskLevelConfig = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return { label: 'Low', bgColor: 'bg-green-50', textColor: 'text-green-700' };
      case 'medium': return { label: 'Medium', bgColor: 'bg-orange-50', textColor: 'text-orange-700' };
      case 'high': return { label: 'High', bgColor: 'bg-red-50', textColor: 'text-red-700' };
      default: return { label: riskLevel || 'Low', bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
    }
  };

  // Carousel settings for mobile
  const slickSettings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
  };

  const exportColumns: ExportColumn[] = [
    { id: 'id', label: 'Student ID', defaultSelected: true },
    { id: 'name', label: 'Student Name', defaultSelected: true },
    { id: 'email', label: 'Email', defaultSelected: true },
    { id: 'status', label: 'Status', defaultSelected: true },
    { id: 'riskLevel', label: 'Risk Level', defaultSelected: true },
    { id: 'countryPreference', label: 'Country Preference', defaultSelected: true },
    { id: 'applications', label: 'Applications', defaultSelected: true },
    { id: 'counselor', label: 'Assigned Counselor', defaultSelected: true },
  ];

  const importFields: ImportField[] = [
    { id: 'firstName', label: 'First Name', type: 'text', required: true },
    { id: 'lastName', label: 'Last Name', type: 'text', required: true },
    { id: 'email', label: 'Email', type: 'email', required: true },
    { id: 'dateOfBirth', label: 'Date of Birth (YYYY-MM-DD)', type: 'text', required: false },
    { id: 'countryCode', label: 'Country Code', type: 'text', required: false },
    { id: 'phoneNumber', label: 'Phone Number', type: 'text', required: false },
    { id: 'nationality', label: 'Nationality', type: 'text', required: false },
    { id: 'currentCountry', label: 'Current Country', type: 'text', required: false },
    { id: 'primaryDestination', label: 'Primary Destination', type: 'text', required: false },
    { id: 'intendedIntake', label: 'Intake', type: 'text', required: false },
    { id: 'currentStage', label: 'Current Stage', type: 'text', required: false },
    { id: 'assignedCounselor', label: 'Counselor', type: 'text', required: false },
    { id: 'riskLevel', label: 'Risk Level', type: 'select', required: false, options: ['low', 'medium', 'high'] },
    { id: 'leadSource', label: 'Lead Source', type: 'text', required: false },
    { id: 'campaign', label: 'Campaign', type: 'text', required: false },
    { id: 'countryPreferences', label: 'Country Preferences (Comma Separated)', type: 'text', required: false },
    { id: 'notes', label: 'Notes', type: 'text', required: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf7ff] via-white to-[#f8faff] px-8 py-6">


      <div className="max-w-[1920px] mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                <CalendarIcon size={18} className="text-[#253154]" />
                <span className="text-sm text-[#253154] font-medium">
                  {dateRange?.from && dateRange?.to
                    ? `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
                    : 'Select date range'}
                </span>
                <div className="h-4 w-px bg-gray-200 mx-1" />
                <RefreshCw size={18} className="text-[#253154]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="rounded-xl border-0"
              />
            </PopoverContent>
          </Popover>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExportDialog(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download size={18} className="text-[#253154]" />
              <span className="text-sm text-[#253154] font-medium">Export</span>
            </button>
            <button
              onClick={() => setShowImportDialog(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Upload size={18} className="text-[#253154]" />
              <span className="text-sm text-[#253154] font-medium">Import</span>
            </button>
            <button
              onClick={() => onNavigate('add-student')}
              className="flex items-center gap-2 px-5 py-3 bg-[#0e042f] rounded-xl hover:bg-[#1a0c4a] transition-colors shadow-lg"
            >
              <Plus size={18} className="text-white" />
              <span className="text-sm text-white font-medium">Add Student</span>
            </button>
          </div>
        </div>

        {/* Metrics Section - Desktop Flex Layout with Inline Expansion */}
        <div className="hidden lg:flex gap-4 mb-8">
          {metrics.map((metric, index) => {
            const isActive = activeFilter === metric.title;
            const hasActiveFilter = !!(activeFilter && activeFilter !== 'Total Students');
            const isCompressed = hasActiveFilter && !isActive;

            return (
              <div
                key={index}
                className="flex-1 transition-all duration-300 ease-in-out"
              >
                <MetricCard
                  {...metric}
                  isActive={isActive}
                  isCompressed={isCompressed}
                  onClick={() => handleMetricClick(metric.title)}
                  expandedContent={getInsightData(metric.title)}
                />
              </div>
            );
          })}
        </div>

        {/* Metrics Section - Mobile Carousel */}
        <div className="block lg:hidden mb-6 -mx-4">
          <Slider {...slickSettings}>
            {metrics.map((metric, index) => (
              <div key={index} className="px-2 py-2">
                <MetricCard
                  {...metric}
                  isActive={activeFilter === metric.title}
                  onClick={() => handleMetricClick(metric.title)}
                  expandedContent={getInsightData(metric.title)}
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253154]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, student ID"
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-0 shadow-sm focus:ring-2 focus:ring-purple-100 outline-none text-[#253154] placeholder:text-gray-400"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-3">
            <Popover open={openFilterPopover} onOpenChange={setOpenFilterPopover}>
              <PopoverTrigger asChild>
                <button
                  className={`p-3 bg-white rounded-xl border transition-colors shadow-sm flex items-center gap-2 ${filterConfig.status || filterConfig.riskLevel
                    ? 'border-[#0e042f] bg-[#0e042f]/5 text-[#0e042f]'
                    : 'border-gray-200 hover:bg-gray-50 text-[#253154]'
                    }`}
                >
                  <Filter size={20} />
                  {(filterConfig.status || filterConfig.riskLevel) && (
                    <div className="w-2 h-2 rounded-full bg-[#0e042f]" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 bg-white" align="end">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-[#253154]">Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {['active', 'inactive'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleFilterChange('status', filterConfig.status === status ? '' : status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filterConfig.status === status
                            ? 'bg-[#0e042f] text-white border-[#0e042f]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-[#253154]">Risk Level</h4>
                    <div className="flex flex-wrap gap-2">
                      {['low', 'medium', 'high'].map(level => (
                        <button
                          key={level}
                          onClick={() => handleFilterChange('riskLevel', filterConfig.riskLevel === level ? '' : level)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filterConfig.riskLevel === level
                            ? 'bg-[#0e042f] text-white border-[#0e042f]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {(filterConfig.status || filterConfig.riskLevel) && (
                    <button
                      onClick={() => {
                        setFilterConfig({ status: '', riskLevel: '' });
                        setCurrentPage(1);
                      }}
                      className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm gap-2 text-sm font-medium text-[#253154] min-w-[150px]">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={16} className="text-gray-400" />
                    <span>Sort: {
                      sortConfig.key === 'first_name' ? 'Name' :
                        sortConfig.key === 'email' ? 'Email' :
                          sortConfig.key === 'account_status' ? 'Status' :
                            sortConfig.key === 'student_id' ? 'Student ID' :
                              'Date Created'
                    }</span>
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 bg-white" align="end">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase tracking-wider">Sort By</div>
                  {[
                    { label: 'Name (A-Z)', key: 'first_name' },
                    { label: 'Email', key: 'email' },
                    { label: 'Date Created', key: 'created_at' },
                    { label: 'Status', key: 'account_status' },
                    { label: 'Student ID', key: 'student_id' }
                  ].map(option => (
                    <button
                      key={option.key}
                      onClick={() => handleSort(option.key)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${sortConfig.key === option.key
                          ? 'bg-purple-50 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <span>{option.label}</span>
                      {sortConfig.key === option.key && (
                        sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={openColumnsPopover} onOpenChange={setOpenColumnsPopover}>
              <PopoverTrigger asChild>
                <button className={`p-3 bg-white rounded-xl border transition-colors shadow-sm ${Object.values(visibleColumns).some(v => !v)
                  ? 'border-[#0e042f] bg-[#0e042f]/5 text-[#0e042f]'
                  : 'border-gray-200 hover:bg-gray-50 text-[#253154]'
                  }`}>
                  <Columns size={20} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4 bg-white" align="end">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-[#253154] mb-2">Toggle Columns</h4>
                  <div className="space-y-2">
                    {[
                      { key: 'studentId', label: 'Student ID' },
                      { key: 'firstName', label: 'Student Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'status', label: 'Status' },
                      { key: 'riskLevel', label: 'Risk Level' },
                      { key: 'countryPreferences', label: 'Country Pref' },
                      { key: 'applicationsCount', label: 'Applications' },
                      { key: 'assignedCounselor', label: 'Counselor' },
                    ].map(col => (
                      <div key={col.key} className="flex items-center gap-2">
                        <CustomCheckbox
                          checked={visibleColumns[col.key]}
                          onChange={(checked) => setVisibleColumns(prev => ({ ...prev, [col.key]: checked }))}
                          ariaLabel={`Toggle ${col.label}`}
                        />
                        <span className="text-sm text-gray-600">{col.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left">
                    <CustomCheckbox
                      checked={allSelected}
                      partial={someSelected}
                      onChange={toggleAllStudents}
                      ariaLabel="Select all students"
                    />
                  </th>
                  {visibleColumns.studentId && (
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Student ID</span>
                    </th>
                  )}
                  {visibleColumns.firstName && (
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Student Name</span>
                    </th>
                  )}
                  {visibleColumns.email && (
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Email</span>
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Status</span>
                    </th>
                  )}
                  {visibleColumns.riskLevel && (
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Risk Level</span>
                    </th>
                  )}
                  {visibleColumns.countryPreferences && (
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Country Preference</span>
                    </th>
                  )}
                  {visibleColumns.applicationsCount && (
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Applications</span>
                    </th>
                  )}
                  {visibleColumns.assignedCounselor && (
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Assigned Counselor</span>
                    </th>
                  )}
                  {visibleColumns.actions && (
                    <th className="px-6 py-4 text-right">
                      <span className="text-xs font-bold text-[#253154] uppercase tracking-wider">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(rowsPerPage)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-6 py-4"><Skeleton className="h-4 w-4" /></td>
                      {visibleColumns.studentId && <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>}
                      {visibleColumns.firstName && <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>}
                      {visibleColumns.email && <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>}
                      {visibleColumns.status && <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-lg" /></td>}
                      {visibleColumns.riskLevel && <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-lg" /></td>}
                      {visibleColumns.countryPreferences && <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>}
                      {visibleColumns.applicationsCount && <td className="px-6 py-4"><Skeleton className="h-4 w-8" /></td>}
                      {visibleColumns.assignedCounselor && <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>}
                      {visibleColumns.actions && <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></td>}
                    </tr>
                  ))
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => {
                    const statusConfig = getStatusConfig(student.account_status);
                    const riskConfig = getRiskLevelConfig(student.risk_level);

                    // Parse country preferences
                    let countryPref = 'N/A';
                    try {
                      const parsed = JSON.parse(student.country_preferences);
                      if (Array.isArray(parsed) && parsed.length > 0) countryPref = parsed.join(', ');
                    } catch (e) {
                      countryPref = student.country_preferences || 'N/A';
                    }

                    return (
                      <tr
                        key={student.id}
                        onClick={() => handleViewStudent(student.id)}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                      >
                        <td
                          className="px-6 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CustomCheckbox
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => toggleStudentSelection(student.id)}
                            ariaLabel={`Select ${student.first_name}`}
                          />
                        </td>
                        {visibleColumns.studentId && (
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-[#253154]">{student.student_id}</span>
                          </td>
                        )}
                        {visibleColumns.firstName && (
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-[#253154]">
                              {student.first_name} {student.last_name}
                            </span>
                          </td>
                        )}
                        {visibleColumns.email && (
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{student.email}</span>
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="px-6 py-4">
                            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                              {statusConfig.label}
                            </div>
                          </td>
                        )}
                        {visibleColumns.riskLevel && (
                          <td className="px-6 py-4">
                            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-medium ${riskConfig.bgColor} ${riskConfig.textColor}`}>
                              {riskConfig.label}
                            </div>
                          </td>
                        )}
                        {visibleColumns.countryPreferences && (
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 truncate max-w-[150px]" title={countryPref}>{countryPref}</span>
                          </td>
                        )}
                        {visibleColumns.applicationsCount && (
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-[#253154]">{student.applications_count}</span>
                          </td>
                        )}
                        {visibleColumns.assignedCounselor && (
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{student.assigned_counselor || 'Unassigned'}</span>
                          </td>
                        )}
                        {visibleColumns.actions && (
                          <td
                            className="px-6 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end">
                              <Popover open={openActionMenuId === student.id} onOpenChange={(open) => setOpenActionMenuId(open ? student.id : null)}>
                                <PopoverTrigger asChild>
                                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <MoreHorizontal size={18} className="text-gray-400" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-2 bg-white rounded-xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200" align="end">
                                  <div className="space-y-1">
                                    <button
                                      onClick={() => handleViewStudent(student.id)}
                                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2 text-[#253154]"
                                    >
                                      <Eye size={16} />
                                      <span>View Student</span>
                                    </button>
                                    <button
                                      onClick={() => handleEditStudent(student.id)}
                                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2 text-[#253154]"
                                    >
                                      <Edit size={16} />
                                      <span>Edit Student</span>
                                    </button>
                                    <button
                                      onClick={() => handleAddNote(student.id)}
                                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2 text-[#253154]"
                                    >
                                      <StickyNote size={16} />
                                      <span>Add Note</span>
                                    </button>
                                    <button
                                      onClick={() => handleViewDocuments(student.id)}
                                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2 text-[#253154]"
                                    >
                                      <FileText size={16} />
                                      <span>View Documents</span>
                                    </button>
                                    <button
                                      onClick={() => handleViewApplications(student.id)}
                                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2 text-[#253154]"
                                    >
                                      <FileText size={16} />
                                      <span>View Applications</span>
                                    </button>
                                    <div className="h-px bg-gray-100 my-1" />
                                    <button
                                      onClick={() => handleArchiveStudent(student)}
                                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-red-50 flex items-center gap-2 text-red-600"
                                    >
                                      <Archive size={16} />
                                      <span>Archive Student</span>
                                    </button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  }))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <CustomSelect
                value={rowsPerPage.toString()}
                onChange={(value) => {
                  setRowsPerPage(Number(value));
                  setCurrentPage(1);
                }}
                options={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' },
                ]}
                className="w-20"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} className="text-[#253154]" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} className="text-[#253154]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 space-y-3">
                <div className="flex items-start gap-3"><Skeleton className="h-4 w-4" /><Skeleton className="h-4 w-32" /></div>
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-24" />
                <div className="flex gap-2"><Skeleton className="h-6 w-14" /><Skeleton className="h-6 w-14" /></div>
                <div className="flex gap-2 pt-3 border-t"><Skeleton className="h-10 flex-1 rounded-xl" /><Skeleton className="h-10 flex-1 rounded-xl" /></div>
              </div>
            ))
          ) : students.map((student) => (
            <MobileStudentCard
              key={student.id}
              student={student}
              onSelect={toggleStudentSelection}
              isSelected={selectedStudents.includes(student.id)}
              onNavigate={onNavigate}
              onEdit={handleEditStudent}
              onArchive={handleArchiveStudent}
            />
          ))}

          {/* Mobile Pagination */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        moduleName="Students"
        columns={exportColumns}
        onExport={async (options) => {
          console.log('Exporting with options:', options);
          toast.success(`Exporting ${selectedStudents.length || pagination.total} students as ${options.format.toUpperCase()}`);
          setShowExportDialog(false);
        }}
        totalCount={pagination.total}
        selectedCount={selectedStudents.length}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        moduleName="Students"
        fields={importFields}
        templateUrl="/templates/students-import-template.xlsx"
        onImport={async (data, mode) => {
          console.log('Importing data:', data, 'mode:', mode);
          let successCount = 0;
          let failCount = 0;

          const loadingToast = toast.loading(`Importing students (0/${data.length})...`);

          for (let i = 0; i < data.length; i++) {
            const row = data[i];
            try {
              const payload = {
                ...row,
                riskLevel: row.riskLevel || 'low',
                accountStatus: true,
                countryPreferences: row.countryPreferences ? String(row.countryPreferences).split(',').map((s: any) => s.trim()) : []
              };

              if (mode === 'update' && row.id) {
                // Wait, type casting if needed? data is `any`
                await updateStudent(row.id, payload);
              } else {
                await createStudent(payload);
              }
              successCount++;
            } catch (error) {
              console.error(`Failed to import row ${i + 1}:`, error);
              failCount++;
            }
            toast.loading(`Importing students (${successCount + failCount}/${data.length})...`, { id: loadingToast });
          }

          toast.dismiss(loadingToast);
          if (successCount > 0) {
            toast.success(`Import complete! ${successCount} successful, ${failCount} failed.`);
          } else {
            toast.error(`Import failed! All ${failCount} rows failed.`);
          }

          setShowImportDialog(false);
          if (typeof fetchStudents === 'function') {
            fetchStudents();
          }
        }}
      />

      {/* Archive Dialog */}
      {
        showArchiveDialog && studentToArchive && (
          <ConfirmDialog
            open={showArchiveDialog}
            onOpenChange={setShowArchiveDialog}
            title="Archive Student"
            description={`Are you sure you want to archive ${studentToArchive.first_name} ${studentToArchive.last_name}? This action cannot be undone.`}
            variant="danger"
            confirmText="Archive"
            cancelText="Cancel"
            onConfirm={confirmArchiveStudent}
          />
        )
      }

      {/* Removed AddStudentModal component */}
    </div >
  );
};

export default StudentsOverviewPage;