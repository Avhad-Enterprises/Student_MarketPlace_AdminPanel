"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  Edit,
  MoreVertical,
  Plus,
  User,
  Bell,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  GraduationCap,
  Building,
  Target,
  DollarSign,
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  MessageCircle,
  PhoneCall,
  PlayCircle,
  CreditCard,
  Filter,
  Search,
  Tag,
  Monitor,
  Smartphone,
  MapPinIcon,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Award,
  Shield,
  Plane,
  XCircle,
  UserCheck,
  TrendingUp,
  ListChecks,
  Briefcase,
  List,
  Banknote,
  Utensils,
  Home,
  BookOpen,
  ArrowLeftRight,
  Sparkles,
  ExternalLink,
  Link,
  MousePointer,
  Zap,
  BarChart3,
  Users,
  TrendingDown,
  Repeat,
  Radio,
  X,
  Archive,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  SessionHeatmapsSection,
  UserJourneySection,
  FunnelPerformanceSection,
  ClickInteractionSection,
  BehavioralSegmentationSection,
  IntentSignalsSection,
  BehavioralFrictionSection
} from '@/components/ActivityTabSections';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreActionsMenu } from "@/components/common/MoreActionsMenu";
import { CustomSelect } from "@/components/common/CustomSelect";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { NotificationPanel } from "@/components/common/NotificationPanel";
import { useNotifications } from "@/components/common/useNotifications";
import { EditStudentDrawer } from "@/components/EditStudentDrawer";
import { ServiceDetailsDrawer } from "@/components/ServiceDetailsDrawer";
import { ServiceDetailModal } from "@/components/services/ServiceDetailModal";
import { UpdateServiceStatusModal } from "@/components/UpdateServiceStatusModal";
import { ReassignCounselorDrawer } from "@/components/ReassignCounselorDrawer";
import { AddNoteModal } from "@/components/AddNoteModal";
import { AttachDocumentsDrawer } from "@/components/AttachDocumentsDrawer";
import { ActivityLogDrawer } from "@/components/students/ActivityLogDrawer";
import { SetPriorityFlagModal } from "@/components/students/SetPriorityFlagModal";
import { PauseServiceModal } from "@/components/students/PauseServiceModal";
import { ArchiveServiceModal } from "@/components/students/ArchiveServiceModal";
import { ChangeStatusModal } from "@/components/students/ChangeStatusModal";
import { ChangeCounselorModal } from "@/components/students/ChangeCounselorModal";
import { AuditLogModal } from "@/components/students/AuditLogModal";
import { ArchiveStudentModal } from "@/components/students/ArchiveStudentModal";
import {
  ApplicationDetailModal,
  EditApplicationModal,
  ApplicationActionsDropdown,
  UpdateApplicationStatusModal,
  UploadApplicationDocumentsDrawer,
  // Removed Document modals as they are implemented locally below
  PaymentDetailModal,
  EditPaymentModal,
  DataPolicyModal
} from '@/components/MissingStubs_StudentDetail';
import { mockDocuments, mockPaymentsForTable, mockTimelineEvents } from '@/components/studentDetailMockData';
import { getStudentById, updateStudent, Student as BackendStudent } from '../services/studentsService';
import { getAllApplications, Application as BackendApplication } from '../services/applicationsService';
import { createActivity, getActivitiesByStudentId, Activity as BackendActivity } from '../services/activitiesService';

interface StudentDetailProps {
  onBack: () => void;
  initialTab?: string;
  studentId?: string;
}

export const StudentDetail: React.FC<StudentDetailProps> = ({ onBack, initialTab = 'overview', studentId }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [userRole] = useState<'admin' | 'editor' | 'viewer'>('admin');

  // Student data state
  const [student, setStudent] = useState<BackendStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentStatus, setStudentStatus] = useState('Active');
  const [studentCounselor, setStudentCounselor] = useState({ name: 'Sarah Johnson', initials: 'SJ' });
  const [applications, setApplications] = useState<any[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [activities, setActivities] = useState<BackendActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Helper to map values to labels
  const getLabel = (type: 'destination' | 'intake' | 'leadSource', value: string | undefined): string => {
    if (!value) return 'Not Specified';

    const mappings: Record<string, Record<string, string>> = {
      destination: {
        'usa': 'USA',
        'uk': 'UK',
        'canada': 'Canada',
        'australia': 'Australia'
      },
      intake: {
        'fall-2025': 'Fall 2025',
        'spring-2026': 'Spring 2026'
      },
      leadSource: {
        'organic-search': 'Organic Search',
        'referral': 'Referral',
        'social-media': 'Social Media'
      }
    };

    return mappings[type][value.toLowerCase()] || value;
  };

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      getStudentById(studentId)
        .then(response => {
          // getStudentById directly returns the Student object because the service extracts it
          const data = response as any;
          setStudent(data);
          if (data.current_stage) {
            setStudentStatus(data.current_stage);
          }
          setStudentCounselor({
            name: data.assigned_counselor || 'Unassigned',
            initials: (data.assigned_counselor || 'U').substring(0, 2).toUpperCase()
          });
        })
        .catch(err => {
          console.error('Error fetching student:', err);
          toast.error('Failed to load student details');
        })
        .finally(() => setLoading(false));

      // Fetch applications
      setAppsLoading(true);
      getAllApplications({ student_id: studentId })
        .then(response => {
          const mappedApps = response.data.map((app: BackendApplication) => ({
            id: app.id,
            university: app.university_name,
            course: 'Not Specified', // Backend doesn't seem to have course field in Application interface yet, or it&apos;s hidden. 
            // I'll check Application interface in applicationsService again if needed, but for now I'll use a placeholder or check notes.
            country: app.country,
            intake: app.intake,
            appStatus: app.status.charAt(0).toUpperCase() + app.status.slice(1).replace('-', ' '),
            offerStatus: 'Pending', // Placeholder as not in backend interface
            lastUpdated: app.updated_at ? format(new Date(app.updated_at), 'yyyy-MM-dd') : 'N/A',
            assignedCounselor: app.counselor || 'Unassigned',
            counselorInitials: (app.counselor || 'U').substring(0, 2).toUpperCase(),
            createdDate: app.created_at ? format(new Date(app.created_at), 'yyyy-MM-dd') : 'N/A'
          }));
          setApplications(mappedApps);
        })
        .catch(err => {
          console.error('Error fetching applications:', err);
        })
        .finally(() => setAppsLoading(false));

      // Fetch activities
      setActivitiesLoading(true);
      getActivitiesByStudentId(studentId)
        .then(response => {
          // Sort by newest first
          const sorted = response.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setActivities(sorted);
        })
        .catch(err => {
          console.error('Error fetching activities:', err);
        })
        .finally(() => setActivitiesLoading(false));
    }
  }, [studentId]);

  // Sync activeTab with initialTab prop
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Timeline filter and pagination states
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'last7days' | 'last30days'>('all');
  const [showDateFilterDropdown, setShowDateFilterDropdown] = useState(false);
  const [visibleEventsCount, setVisibleEventsCount] = useState(6);
  const [serviceDetailsDrawer, setServiceDetailsDrawer] = useState<{
    isOpen: boolean;
    service: any;
  }>({ isOpen: false, service: null });
  const [updateStatusModal, setUpdateStatusModal] = useState<{
    isOpen: boolean;
    serviceName: string;
    currentStatus: string;
  }>({ isOpen: false, serviceName: '', currentStatus: '' });
  const [reassignCounselorDrawer, setReassignCounselorDrawer] = useState<{
    isOpen: boolean;
    serviceName: string;
    currentCounselor: {
      name: string;
      initials: string;
      assignedSince: string;
    } | null;
  }>({ isOpen: false, serviceName: '', currentCounselor: null });
  const [addNoteModal, setAddNoteModal] = useState<{
    isOpen: boolean;
    serviceName: string;
  }>({ isOpen: false, serviceName: '' });
  const [attachDocumentsDrawer, setAttachDocumentsDrawer] = useState<{
    isOpen: boolean;
    serviceName: string;
  }>({ isOpen: false, serviceName: '' });
  const [activityLogDrawer, setActivityLogDrawer] = useState<{
    isOpen: boolean;
    serviceName: string;
  }>({ isOpen: false, serviceName: '' });
  const [setPriorityModal, setSetPriorityModal] = useState<{
    isOpen: boolean;
    serviceName: string;
    serviceId: number;
  }>({ isOpen: false, serviceName: '', serviceId: 0 });
  const [servicePriorities, setServicePriorities] = useState<Record<number, {
    priority: 'low' | 'medium' | 'high' | 'urgent' | null;
    flags: string[];
  }>>({});
  const [pauseServiceModal, setPauseServiceModal] = useState<{
    isOpen: boolean;
    serviceName: string;
    serviceId: number;
  }>({ isOpen: false, serviceName: '', serviceId: 0 });
  const [pausedServices, setPausedServices] = useState<Record<number, {
    isPaused: boolean;
    reason: string;
    reasonText?: string;
    resumeDate?: string;
    pausedDate: string;
  }>>({});
  const [archiveServiceModal, setArchiveServiceModal] = useState<{
    isOpen: boolean;
    serviceName: string;
    serviceId: number;
  }>({ isOpen: false, serviceName: '', serviceId: 0 });
  const [archivedServices, setArchivedServices] = useState<Set<number>>(new Set());
  const [serviceDetailModal, setServiceDetailModal] = useState<{
    isOpen: boolean;
    service: any;
  }>({ isOpen: false, service: null });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    planning: true,
    offer: true,
    visa: true,
    arrival: true
  });

  // Refs for service action buttons (for smart dropdown positioning)
  const serviceActionRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  // 3rd Party Service Provider states
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    servicesOverview: false,
    providerEngagement: false,
    referralAttribution: false,
    behaviorFunnel: false,
    aiInsights: false,
    partnerRevenue: false
  });

  const [appFilters, setAppFilters] = useState({
    country: 'all',
    status: 'all',
    intake: 'all'
  });

  const [docFilters, setDocFilters] = useState({
    category: 'all',
    status: 'all'
  });

  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  const [newAppFormData, setNewAppFormData] = useState({
    university: '',
    country: '',
    course: '',
    intake: '',
    status: 'draft',
    offerStatus: 'pending',
    counselor: '',
    type: 'Regular'
  });

  const [uploadDocFormData, setUploadDocFormData] = useState({
    name: '',
    category: '',
    application: ''
  });

  // Modal states
  const [showAddApplicationModal, setShowAddApplicationModal] = useState(false);
  const [showUploadDocumentModal, setShowUploadDocumentModal] = useState(false);
  const [showMoreActionsMenu, setShowMoreActionsMenu] = useState(false);

  // Application states
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [applicationDetailModal, setApplicationDetailModal] = useState<{
    isOpen: boolean;
    application: any;
  }>({ isOpen: false, application: null });
  const [editApplicationModal, setEditApplicationModal] = useState<{
    isOpen: boolean;
    application: any;
  }>({ isOpen: false, application: null });
  const [openApplicationActionId, setOpenApplicationActionId] = useState<number | null>(null);
  const [updateApplicationStatusModal, setUpdateApplicationStatusModal] = useState<{
    isOpen: boolean;
    applicationName: string;
    currentStatus: string;
  }>({ isOpen: false, applicationName: '', currentStatus: '' });
  const [uploadApplicationDocumentsDrawer, setUploadApplicationDocumentsDrawer] = useState<{
    isOpen: boolean;
    applicationName: string;
  }>({ isOpen: false, applicationName: '' });

  // Document states
  const [documentDetailModal, setDocumentDetailModal] = useState<{
    isOpen: boolean;
    document: any;
  }>({ isOpen: false, document: null });
  const [editDocumentModal, setEditDocumentModal] = useState<{
    isOpen: boolean;
    document: any;
  }>({ isOpen: false, document: null });
  const [replaceDocumentModal, setReplaceDocumentModal] = useState<{
    isOpen: boolean;
    documentName: string;
    currentFile: any;
  }>({ isOpen: false, documentName: '', currentFile: null });

  // Payment states
  const [paymentDetailModal, setPaymentDetailModal] = useState<{
    isOpen: boolean;
    payment: any;
  }>({ isOpen: false, payment: null });
  const [editPaymentModal, setEditPaymentModal] = useState<{
    isOpen: boolean;
    payment: any;
  }>({ isOpen: false, payment: null });

  // Data policy modal state
  const [dataPolicyModalOpen, setDataPolicyModalOpen] = useState(false);

  // 3-Dot Menu modal states
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [changeCounselorModalOpen, setChangeCounselorModalOpen] = useState(false);
  const [auditLogModalOpen, setAuditLogModalOpen] = useState(false);
  const [archiveStudentModalOpen, setArchiveStudentModalOpen] = useState(false);

  // Handle Add Note button - navigate to Internal Notes tab
  const handleAddNote = () => {
    setActiveTab('notes');
    // Scroll to top of content area
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Timeline filtering logic
  const getFilteredEvents = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const mappedActivities = activities.map((act) => {
      let colorScheme = 'gray';
      if (act.type === 'Status') colorScheme = 'blue';
      else if (act.type === 'Counselor') colorScheme = 'purple';
      else if (act.type === 'Application') colorScheme = 'emerald';
      else if (act.type === 'Document') colorScheme = 'amber';
      else if (act.type === 'Payment') colorScheme = 'teal';

      return {
        id: act.id || act.created_at,
        title: act.title,
        date: format(new Date(act.created_at), 'MMM dd, yyyy h:mm a'),
        details: act.content,
        type: act.type,
        timestamp: new Date(act.created_at),
        colorScheme
      };
    });

    let filtered = mappedActivities;

    if (dateFilter === 'today') {
      filtered = mappedActivities.filter(event => event.timestamp >= today);
    } else if (dateFilter === 'last7days') {
      filtered = mappedActivities.filter(event => event.timestamp >= sevenDaysAgo);
    } else if (dateFilter === 'last30days') {
      filtered = mappedActivities.filter(event => event.timestamp >= thirtyDaysAgo);
    }

    return { filtered, visible: filtered.slice(0, visibleEventsCount) };
  };

  const { filtered: allFilteredEvents, visible: filteredEvents } = getFilteredEvents();
  const hasMoreEvents = allFilteredEvents.length > visibleEventsCount;

  const handleLoadMore = () => {
    setVisibleEventsCount(prev => prev + 6);
  };

  const handleDateFilterChange = (filter: 'all' | 'today' | 'last7days' | 'last30days') => {
    setDateFilter(filter);
    setVisibleEventsCount(6);
    setShowDateFilterDropdown(false);
  };

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case 'today':
        return 'Today';
      case 'last7days':
        return 'Last 7 Days';
      case 'last30days':
        return 'Last 30 Days';
      default:
        return 'All Time';
    }
  };

  // Helper function to get color scheme classes
  const getEventColorClasses = (colorScheme: string) => {
    const colorMap: Record<string, { bg: string; border: string; dot: string; badge: string; badgeText: string; badgeBorder: string }> = {
      blue: {
        bg: 'from-blue-50/50',
        border: 'border-blue-100/50 hover:border-blue-200/50',
        dot: 'bg-blue-500',
        badge: 'bg-blue-100',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-200'
      },
      emerald: {
        bg: 'from-emerald-50/50',
        border: 'border-emerald-100/50 hover:border-emerald-200/50',
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-100',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200'
      },
      purple: {
        bg: 'from-purple-50/50',
        border: 'border-purple-100/50 hover:border-purple-200/50',
        dot: 'bg-purple-500',
        badge: 'bg-purple-100',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-200'
      },
      amber: {
        bg: 'from-amber-50/50',
        border: 'border-amber-100/50 hover:border-amber-200/50',
        dot: 'bg-amber-500',
        badge: 'bg-amber-100',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-200'
      },
      teal: {
        bg: 'from-teal-50/50',
        border: 'border-teal-100/50 hover:border-teal-200/50',
        dot: 'bg-teal-500',
        badge: 'bg-teal-100',
        badgeText: 'text-teal-700',
        badgeBorder: 'border-teal-200'
      },
      gray: {
        bg: 'from-gray-50/50',
        border: 'border-gray-100/50 hover:border-gray-200/50',
        dot: 'bg-gray-500',
        badge: 'bg-gray-100',
        badgeText: 'text-gray-700',
        badgeBorder: 'border-gray-200'
      }
    };
    return colorMap[colorScheme] || colorMap.gray;
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSavePriority = (priority: 'low' | 'medium' | 'high' | 'urgent' | null, flags: string[], reason: string) => {
    setServicePriorities(prev => ({
      ...prev,
      [setPriorityModal.serviceId]: { priority, flags }
    }));
    setToastMessage('Priority updated.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePauseService = (data: {
    reason: string;
    reasonText?: string;
    resumeDate?: string;
    notifyCounselor: boolean;
  }) => {
    setPausedServices(prev => ({
      ...prev,
      [pauseServiceModal.serviceId]: {
        isPaused: true,
        reason: data.reason,
        reasonText: data.reasonText,
        resumeDate: data.resumeDate,
        pausedDate: new Date().toISOString().split('T')[0],
      }
    }));
    setPauseServiceModal({ isOpen: false, serviceName: '', serviceId: 0 });
    setToastMessage('Service paused.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleArchiveService = (data: {
    reason: string;
    reasonText?: string;
    archiveReminders: boolean;
  }) => {
    setArchivedServices(prev => new Set(prev).add(archiveServiceModal.serviceId));
    setArchiveServiceModal({ isOpen: false, serviceName: '', serviceId: 0 });
    setToastMessage('Service archived.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 3-Dot Menu handlers
  const handleChangeStatus = async (data: {
    newStatus: string;
    reason: string;
    notes: string;
    effectiveDate: string;
  }) => {
    if (!studentId) return;
    try {
      console.log('Status changed:', data);
      await updateStudent(studentId, { current_stage: data.newStatus });

      // Create activity record
      await createActivity({
        student_db_id: studentId,
        title: 'Status Changed',
        content: `Student status changed from "${studentStatus}" to "${data.newStatus}". Reason: ${data.reason}`,
        type: 'Status'
      });

      setStudentStatus(data.newStatus); // Update the status state
      setToastMessage(`Student status updated to "${data.newStatus}"`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      // Update local student object to keep UI in sync
      if (student) setStudent({ ...student, current_stage: data.newStatus });
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleChangeCounselor = async (data: {
    newCounselor: string;
    reason: string;
    notifyCounselor: boolean;
  }) => {
    if (!studentId) return;
    try {
      console.log('Counselor changed:', data);
      await updateStudent(studentId, { assigned_counselor: data.newCounselor });

      const counselorNames: Record<string, string> = {
        'sarah-johnson': 'Sarah Johnson',
        'michael-chen': 'Michael Chen',
        'priya-sharma': 'Priya Sharma',
        'david-miller': 'David Miller',
        'emma-wilson': 'Emma Wilson',
        'raj-patel': 'Raj Patel',
      };
      const newName = counselorNames[data.newCounselor] || data.newCounselor;

      // Create activity record
      await createActivity({
        student_db_id: studentId,
        title: 'Counselor Reassigned',
        content: `Counselor changed from "${studentCounselor.name}" to "${newName}". Reason: ${data.reason || 'Not specified'}`,
        type: 'Counselor'
      });

      const initials = newName.split(' ').map(n => n[0]).join('');
      setStudentCounselor({ name: newName, initials: initials });
      setToastMessage('Counselor assignment updated successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      // Update local student object to keep UI in sync
      if (student) setStudent({ ...student, assigned_counselor: data.newCounselor });
    } catch (error) {
      toast.error('Failed to update counselor');
    }
  };

  const handleArchiveStudent = async (data: {
    reason: string;
    notes: string;
  }) => {
    if (!studentId) return;
    try {
      console.log('Student archived:', data);
      await updateStudent(studentId, {
        account_status: false,
        current_stage: 'Archived'
      });

      // Create activity record
      await createActivity({
        student_db_id: studentId,
        title: 'Student Archived',
        content: `Student profile archived. Reason: ${data.reason}`,
        type: 'Status'
      });

      setStudentStatus('Archived');
      setToastMessage('Student archived successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      // Update local student object to keep UI in sync
      if (student) setStudent({
        ...student,
        account_status: false,
        current_stage: 'Archived'
      });
    } catch (error) {
      toast.error('Failed to archive student');
    }
  };

  // Document states
  const [documents, setDocuments] = useState(mockDocuments);

  const handleDownloadDocument = (docName: string) => {
    toast.success(`Downloading ${docName}...`);
    // In a real app, this would trigger a file download from the server
    console.log('Downloading document:', docName);
  };

  const handleDeleteDocument = (docId: number) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    toast.success('Document deleted successfully');
  };

  const renderPriorityBadge = (serviceId: number) => {
    const priorityData = servicePriorities[serviceId];
    if (!priorityData?.priority) return null;

    const priorityConfig = {
      low: { label: 'Low', color: 'bg-gray-100 text-gray-700 border-gray-200' },
      medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      high: { label: 'High', color: 'bg-amber-100 text-amber-700 border-amber-200' },
      urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200' },
    };

    const config = priorityConfig[priorityData.priority];
    return (
      <span className={`ml-2 px-2 py-0.5 ${config.color} rounded text-[10px] font-bold border`}>
        {config.label}
      </span>
    );
  };

  const DocumentDetailModal = ({ isOpen, onClose, document, onDownload, onEdit, onReplace }: any) => {
    if (!isOpen || !document) return null;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <div className="bg-[#0e042f] px-8 py-6 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -z-0"></div>
            <DialogHeader className="relative z-10">
              <div className="flex items-center gap-3 text-purple-200 mb-2">
                <FileText size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Document Details</span>
              </div>
              <DialogTitle className="text-2xl font-bold">{document.name}</DialogTitle>
            </DialogHeader>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Category</label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold border border-purple-100">
                      {document.category}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Status</label>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${document.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      document.status === 'Uploaded' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                      {document.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Uploaded Date</label>
                  <div className="text-gray-900 font-medium">{document.uploadedDate}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">File Size</label>
                  <div className="text-gray-900 font-medium">{document.fileSize || '2.4 MB'}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <FileText size={20} className="text-gray-400" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{document.name}</div>
                  <div className="text-xs text-gray-500">PDF Document • {document.fileSize || '2.4 MB'}</div>
                </div>
              </div>
              <button
                onClick={onDownload}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-bold flex items-center gap-2 text-gray-700"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onEdit}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-bold shadow-sm flex items-center gap-2 text-gray-700"
              >
                <Edit size={16} />
                Edit Metadata
              </button>
              <button
                onClick={onReplace}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-bold shadow-sm flex items-center gap-2 text-gray-700"
              >
                <RefreshCw size={16} />
                Replace File
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0a4a] transition-all text-sm font-bold shadow-lg shadow-purple-900/10"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const EditDocumentModal = ({ isOpen, onClose, document, onSave }: any) => {
    const [name, setName] = useState(document?.name || '');
    const [category, setCategory] = useState(document?.category || '');

    // Reset local state when document changes
    useEffect(() => {
      if (document) {
        setName(document.name);
        setCategory(document.category);
      }
    }, [document]);

    if (!isOpen) return null;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-white p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <div className="bg-[#0e042f] px-6 py-5 text-white">
            <DialogTitle className="text-xl font-bold">Edit Document</DialogTitle>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Document Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Category</label>
              <CustomSelect
                value={category}
                onChange={setCategory}
                options={[
                  { value: "Academic", label: "Academic" },
                  { value: "Financial", label: "Financial" },
                  { value: "Visa", label: "Visa" },
                  { value: "Identity", label: "Identity" }
                ]}
                className="w-full"
              />
            </div>
          </div>
          <div className="px-6 py-5 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
            <button
              onClick={() => onSave({ ...document, name, category })}
              className="px-6 py-2.5 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0a4a] transition-all text-sm font-bold"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const ReplaceDocumentModal = ({ isOpen, onClose, documentName, onConfirm }: any) => {
    if (!isOpen) return null;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-white p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <div className="bg-[#0e042f] px-6 py-5 text-white">
            <DialogTitle className="text-xl font-bold">Replace Document</DialogTitle>
          </div>
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload size={32} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Upload New Version</h3>
            <p className="text-sm text-gray-500 mb-8 px-4">
              You are replacing <span className="font-bold text-gray-900">{documentName}</span>.
              The old file will be overwritten with the new one.
            </p>

            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 hover:border-purple-300 transition-colors cursor-pointer bg-gray-50/50 group relative">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => e.target.files?.[0] && onConfirm(e.target.files[0])}
              />
              <Plus size={24} className="text-gray-400 mb-3 mx-auto group-hover:text-purple-500 transition-colors" />
              <div className="text-sm font-bold text-gray-600">Click to select new file</div>
              <div className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</div>
            </div>
          </div>
          <div className="px-6 py-5 bg-gray-50 flex items-center justify-center border-t border-gray-100">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700">Go Back</button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const UploadDocumentModal = ({ isOpen, onClose, onUpload }: any) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Academic');
    const [file, setFile] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleUpload = () => {
      if (!name || !file) {
        toast.error('Please provide a document name and select a file');
        return;
      }

      onUpload({
        id: Math.floor(Math.random() * 10000),
        name,
        category,
        status: 'Uploaded',
        uploadedDate: format(new Date(), 'MMM dd, yyyy'),
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: file.type.split('/')[1].toUpperCase(),
        fileUrl: '#'
      });

      // Reset and close
      setName('');
      setCategory('Academic');
      setFile(null);
      onClose();
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-white p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <div className="bg-[#0e042f] px-6 py-5 text-white">
            <DialogTitle className="text-xl font-bold">Upload Document</DialogTitle>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Document Name</label>
              <input
                type="text"
                placeholder="e.g. Passport, Transcript"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Category</label>
              <CustomSelect
                value={category}
                onChange={setCategory}
                options={[
                  { value: "Academic", label: "Academic" },
                  { value: "Financial", label: "Financial" },
                  { value: "Visa", label: "Visa" },
                  { value: "Identity", label: "Identity" }
                ]}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Select File</label>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-colors cursor-pointer bg-gray-50/50 group relative">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="text-center">
                  <Upload size={20} className="text-gray-400 mb-2 mx-auto group-hover:text-purple-500 transition-colors" />
                  <div className="text-sm font-bold text-gray-600">
                    {file ? file.name : "Click to select file"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-5 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
            <button
              onClick={handleUpload}
              className="px-6 py-2.5 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0a4a] transition-all text-sm font-bold shadow-lg shadow-purple-900/20"
            >
              Upload Document
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const tabs = [

    { id: 'overview', label: 'Overview' },
    { id: 'applications', label: 'Applications' },
    { id: 'services', label: 'Services & Lifecycle' },
    { id: 'documents', label: 'Documents' },
    { id: 'communications', label: 'Communications' },
    { id: 'activity', label: 'Activity & Behavior' },
    { id: 'payments', label: 'Payments & Financials' },
    { id: 'notes', label: 'Internal Notes' },
    { id: 'third-party', label: '3rd Party Service Provider' }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafbfc] custom-scrollbar-light">
      {/* Sticky Header - Unified Single Section */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        {/* Breadcrumb + Profile Identity + Metrics + Tabs - All in One Unified Section */}
        <div className="px-8 pt-6 pb-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <button onClick={onBack} className="hover:text-gray-600 transition-colors">
              Students
            </button>
            <ChevronRight size={14} />
            <button onClick={onBack} className="hover:text-gray-600 transition-colors">
              Student Profile
            </button>
            <ChevronRight size={14} />
            <span className="text-gray-700 font-medium">{student ? `${student.first_name} ${student.last_name}` : 'Loading...'}</span>
          </div>

          {/* Profile Identity Section */}
          <div className="flex items-start justify-between gap-8 mb-6">
            {/* Left: Identity Block */}
            <div className="flex items-start gap-5">
              {/* Avatar Badge */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20 flex-shrink-0">
                {student ? `${student.first_name[0]}${student.last_name[0]}`.toUpperCase() : '...'}
              </div>

              {/* Name & Metadata */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{student ? `${student.first_name} ${student.last_name}` : 'Loading...'}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg">
                    <FileText size={12} className="text-gray-500" />
                    <span className="text-xs font-semibold text-gray-700">{student?.student_id || '...'}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${studentStatus === 'Active' ? 'bg-emerald-50' :
                    studentStatus === 'Inactive' ? 'bg-gray-100' :
                      studentStatus === 'On Hold' ? 'bg-amber-50' :
                        studentStatus === 'Archived' ? 'bg-gray-200' :
                          studentStatus === 'Withdrawn' ? 'bg-red-50' :
                            'bg-gray-100'
                    }`}>
                    <CheckCircle size={12} className={
                      studentStatus === 'Active' ? 'text-emerald-600' :
                        studentStatus === 'Inactive' ? 'text-gray-500' :
                          studentStatus === 'On Hold' ? 'text-amber-600' :
                            studentStatus === 'Archived' ? 'text-gray-600' :
                              studentStatus === 'Withdrawn' ? 'text-red-600' :
                                'text-gray-500'
                    } />
                    <span className={`text-xs font-semibold ${studentStatus === 'Active' ? 'text-emerald-700' :
                      studentStatus === 'Inactive' ? 'text-gray-700' :
                        studentStatus === 'On Hold' ? 'text-amber-700' :
                          studentStatus === 'Archived' ? 'text-gray-700' :
                            studentStatus === 'Withdrawn' ? 'text-red-700' :
                              'text-gray-700'
                      }`}>{studentStatus}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg">
                    <TrendingUp size={12} className="text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700">{student?.lead_source || 'Organic Search'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg">
                    <Calendar size={12} className="text-gray-500" />
                    <span className="text-xs font-semibold text-gray-700">Created {student?.created_at ? format(new Date(student.created_at), 'MMM dd, yyyy') : '...'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Status & Action Cluster */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Status Badge with Glow */}
              <div className="px-4 py-2 bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-700 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 border border-emerald-200/50 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                {studentStatus}
              </div>

              {/* Notification Bell */}
              <div className="relative z-30">
                <button
                  type="button"
                  ref={notificationButtonRef}
                  onClick={() => {
                    console.log('Bell clicked! Current state:', showNotifications);
                    setShowNotifications(prev => !prev);
                  }}
                  className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors relative"
                >
                  <Bell size={18} className="text-gray-600" />
                  {/* Unread Badge */}
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </button>

                {/* Notification Panel */}
                <NotificationPanel
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  anchorRef={notificationButtonRef}
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAllAsRead={markAllAsRead}
                  onMarkAsRead={markAsRead}
                />
              </div>

              {/* Action Cluster */}
              <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200/50">
                <button
                  onClick={() => setShowEditDrawer(true)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all text-sm font-semibold flex items-center gap-2 text-gray-700"
                >
                  <Edit size={15} />
                  Edit Student
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all text-sm font-semibold flex items-center gap-2 text-gray-700"
                >
                  <Plus size={15} />
                  Add Note
                </button>
                <MoreActionsMenu
                  open={showMoreActionsMenu}
                  onOpenChange={setShowMoreActionsMenu}
                  onEditStudent={() => setShowEditDrawer(true)}
                  onChangeStatus={() => setChangeStatusModalOpen(true)}
                  onChangeCounselor={() => setChangeCounselorModalOpen(true)}
                  onViewAuditLog={() => setAuditLogModalOpen(true)}
                  onArchiveStudent={() => setArchiveStudentModalOpen(true)}
                />
              </div>
            </div>
          </div>

          {/* Current Snapshot - Insight Tiles */}
          <div className="mb-5">
            <div className="mb-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Snapshot</h3>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {/* Tile 1: Current Stage */}
              <div className="group relative bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100/50 cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100/40 to-transparent rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Target size={14} className="text-blue-600" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Current Stage</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-0.5">{student?.current_stage || 'Applied'}</div>
                  <div className="text-[10px] text-blue-600 font-semibold">● Active Phase</div>
                </div>
              </div>

              {/* Tile 2: Primary Destination */}
              <div className="group relative bg-gradient-to-br from-white to-purple-50/30 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-purple-100/50 cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-100/40 to-transparent rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Globe size={14} className="text-purple-600" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Primary Destination</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-0.5">{student?.primary_destination || 'United States'}</div>
                  <div className="text-[10px] text-gray-500 font-medium">Target Country</div>
                </div>
              </div>

              {/* Tile 3: Intake Term */}
              <div className="group relative bg-gradient-to-br from-white to-emerald-50/30 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100/50 cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-100/40 to-transparent rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Calendar size={14} className="text-emerald-600" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Intake Term</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-0.5">{student?.intended_intake || 'Fall 2025'}</div>
                  <div className="text-[10px] text-gray-500 font-medium">Sept - Nov 2025</div>
                </div>
              </div>

              {/* Tile 4: Assigned Counselor */}
              <div className="group relative bg-gradient-to-br from-white to-gray-50/30 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/50 cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gray-100/40 to-transparent rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                      <User size={14} className="text-gray-600" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Assigned Counselor</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-0.5">{student?.assigned_counselor || 'Sarah Johnson'}</div>
                  <div className="text-[10px] text-gray-500 font-medium">Primary Contact</div>
                </div>
              </div>

              {/* Tile 5: Last Activity */}
              <div className="group relative bg-gradient-to-br from-white to-amber-50/30 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-amber-100/50 cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-100/40 to-transparent rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Clock size={14} className="text-amber-600" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Last Activity</span>
                  </div>
                  <div className="text-base font-bold text-gray-900 mb-0.5">Viewed Offer Letter</div>
                  <div className="text-[10px] text-amber-600 font-semibold">● 2 days ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - Premium Pill Navigation */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative px-5 py-3 text-sm font-semibold whitespace-nowrap rounded-xl transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-gradient-to-br from-[#253154] to-[#1a0a4a] text-white shadow-lg shadow-purple-900/30'
                  : 'bg-white/60 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md border border-gray-200/50'
                  }`}
              >
                {/* Active Tab Accent Line */}
                {activeTab === tab.id && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
                )}

                {/* Tab Label */}
                <span className="relative z-10">{tab.label}</span>

                {/* Inactive Tab Hover Glow */}
                {activeTab !== tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-purple-50/0 group-hover:from-purple-50/40 group-hover:to-blue-50/40 rounded-xl transition-all duration-300"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Student Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                    <User size={14} className="text-purple-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 tracking-tight">Student Profile</h3>
                </div>
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-purple-500/20">
                    {student ? `${student.first_name[0]}${student.last_name[0]}`.toUpperCase() : '...'}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</div>
                      <div className="font-semibold text-gray-900 text-lg">{student ? `${student.first_name} ${student.last_name}` : '...'}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</div>
                        <div className="text-sm text-gray-700">{student?.email || '...'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</div>
                        <div className="text-sm text-gray-700">{student?.phone_number || 'Not Provided'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date of Birth</div>
                    <div className="font-medium text-gray-900">{student?.date_of_birth ? format(new Date(student.date_of_birth), 'MMMM dd, yyyy') : 'Not Provided'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nationality</div>
                    <div className="font-medium text-gray-900">{student?.nationality || 'Not Provided'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Current City</div>
                    <div className="font-medium text-gray-900">{student?.current_country || 'Not Provided'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Country</div>
                    <div className="font-medium text-gray-900">{student?.current_country || 'Not Provided'}</div>
                  </div>
                </div>
              </div>

              {/* Education Snapshot Card */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <GraduationCap size={14} className="text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 tracking-tight">Education Snapshot</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Highest Qualification</div>
                    <div className="font-medium text-gray-900">Bachelor&apos;s Degree</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Field of Study</div>
                    <div className="font-medium text-gray-900">Computer Science</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Current Institution</div>
                      <div className="text-sm text-gray-700">IIT Delhi</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Graduation Year</div>
                      <div className="text-sm text-gray-700">2023</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">GPA / Percentage</div>
                    <div className="font-medium text-gray-900">8.7 / 10.0</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Intent & Preferences Card */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Target size={14} className="text-emerald-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 tracking-tight">Intent & Preferences</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Preferred Countries</div>
                    <div className="flex flex-wrap gap-2">
                      {student?.country_preferences ? (
                        (() => {
                          try {
                            const prefs = JSON.parse(student.country_preferences);
                            return Array.isArray(prefs) ? prefs.map((country: string, idx: number) => (
                              <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">{country}</span>
                            )) : <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">{student.country_preferences}</span>;
                          } catch (e) {
                            return <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">{student.country_preferences}</span>;
                          }
                        })()
                      ) : (
                        <span className="text-sm text-gray-500">None Specified</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Preferred Course Level</div>
                    <div className="font-medium text-gray-900">Master&apos;s Degree</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Budget Range</div>
                    <div className="font-medium text-gray-900">$30,000 - $50,000 / year</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Intake Preference</div>
                    <div className="font-medium text-gray-900">{student?.intended_intake || 'Not Specified'}</div>
                  </div>
                  <div className="pt-5 border-t border-gray-50">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Test Scores</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">IELTS</span>
                        <span className="font-semibold text-gray-900">7.5 Overall</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">GRE</span>
                        <span className="font-semibold text-gray-900">325 (Q: 168, V: 157)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead & Attribution Card */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <TrendingUp size={14} className="text-amber-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 tracking-tight">Lead & Attribution</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Lead Source</div>
                    <div className="font-medium text-gray-900">Organic Search</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Campaign / Referrer</div>
                    <div className="font-medium text-gray-900">Google - Study Abroad USA</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">First Touch Date</div>
                    <div className="font-medium text-gray-900">January 10, 2024</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Conversion Path Summary</div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-50/50 rounded-xl p-4 space-y-2.5 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-700">Organic Search → Landing Page</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-700">University Comparison Tool</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-700">Signup Form → Converted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div>
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CustomSelect
                  placeholder="All Countries"
                  value={appFilters.country}
                  onChange={(val) => setAppFilters(prev => ({ ...prev, country: val }))}
                  options={[
                    { value: "all", label: "All Countries" },
                    { value: "usa", label: "USA" },
                    { value: "canada", label: "Canada" },
                    { value: "uk", label: "UK" }
                  ]}
                  className="w-[180px]"
                />
                <CustomSelect
                  placeholder="All Statuses"
                  value={appFilters.status}
                  onChange={(val) => setAppFilters(prev => ({ ...prev, status: val }))}
                  options={[
                    { value: "all", label: "All Statuses" },
                    { value: "draft", label: "Draft" },
                    { value: "submitted", label: "Submitted" },
                    { value: "under-review", label: "Under Review" }
                  ]}
                  className="w-[180px]"
                />
                <CustomSelect
                  placeholder="All Intakes"
                  value={appFilters.intake}
                  onChange={(val) => setAppFilters(prev => ({ ...prev, intake: val }))}
                  options={[
                    { value: "all", label: "All Intakes" },
                    { value: "fall-2025", label: "Fall 2025" },
                    { value: "spring-2026", label: "Spring 2026" }
                  ]}
                  className="w-[180px]"
                />
              </div>
              <button
                onClick={() => setShowAddApplicationModal(true)}
                className="px-5 py-2.5 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-all shadow-lg shadow-purple-900/20 text-sm font-medium flex items-center gap-2">
                <Plus size={16} />
                Add Application
              </button>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-b from-gray-50 to-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">University</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Country</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Intake</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">App Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Offer Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => {
                          setApplicationDetailModal({
                            isOpen: true,
                            application: app,
                          });
                        }}
                        className="hover:bg-purple-50/30 cursor-pointer transition-all group"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{app.university}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{app.course}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{app.country}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{app.intake}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${app.appStatus === 'Draft' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                            app.appStatus === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              app.appStatus === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                            {app.appStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${app.offerStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            app.offerStatus === 'Offer Received' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              'bg-gray-50 text-gray-400 border-gray-100'
                            }`}>
                            {app.offerStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{app.lastUpdated}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenApplicationActionId(openApplicationActionId === app.id ? null : app.id);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical size={16} className="text-gray-400" />
                          </button>
                          {openApplicationActionId === app.id && (
                            <ApplicationActionsDropdown
                              applicationName={`${app.university} - ${app.course}`}
                              onClose={() => setOpenApplicationActionId(null)}
                              onViewApplication={() => {
                                setApplicationDetailModal({
                                  isOpen: true,
                                  application: app,
                                });
                              }}
                              onEditApplication={() => {
                                setEditApplicationModal({
                                  isOpen: true,
                                  application: app,
                                });
                              }}
                              onUpdateStatus={() => {
                                setUpdateApplicationStatusModal({
                                  isOpen: true,
                                  applicationName: `${app.university} - ${app.course}`,
                                  currentStatus: app.appStatus,
                                });
                              }}
                              onUploadDocuments={() => {
                                setUploadApplicationDocumentsDrawer({
                                  isOpen: true,
                                  applicationName: `${app.university} - ${app.course}`,
                                });
                              }}
                              onAddNote={() => {
                                setAddNoteModal({
                                  isOpen: true,
                                  serviceName: `Application: ${app.university}`,
                                });
                              }}
                              onAssignCounselor={() => {
                                setReassignCounselorDrawer({
                                  isOpen: true,
                                  serviceName: `Application: ${app.university}`,
                                  currentCounselor: {
                                    name: app.assignedCounselor,
                                    initials: app.counselorInitials,
                                    assignedSince: app.createdDate,
                                  },
                                });
                              }}
                              userRole={userRole}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES & LIFECYCLE */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* UNIFIED: Journey Progress + Lifecycle Status - Single Combined Section */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50/30 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100/40 to-transparent rounded-bl-full"></div>

              {/* PART 1: Journey Progress Stages */}
              <div className="relative mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Target size={14} className="text-purple-600" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Student Journey Progress</h3>
                </div>
                <p className="text-xs text-gray-500 ml-9">Live mission control view of lifecycle stages</p>
              </div>

              <div className="relative mb-6">
                {/* Progress Connector */}
                <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-10"></div>
                <div className="absolute top-5 left-[10%] h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 -z-10 shadow-sm" style={{ width: '20%' }}></div>

                <div className="flex items-start justify-between">
                  {/* Stage 1: Planning - COMPLETED */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative group mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shadow-sm border border-purple-200/50">
                        <Lightbulb size={16} className="text-purple-600" />
                      </div>
                      {/* Completion Checkmark */}
                      <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center shadow-sm">
                        <CheckCircle size={10} className="text-white" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-900 mb-1">Planning</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">Completed</span>
                  </div>

                  {/* Stage 2: Applied - CURRENT */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative group mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shadow-sm border border-blue-200/50 ring-2 ring-blue-200/50">
                        <FileText size={16} className="text-blue-600" />
                      </div>
                      {/* Live Indicator */}
                      <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 border border-white flex items-center justify-center shadow-sm animate-pulse">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-900 mb-1">Applied</span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold flex items-center gap-1">
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                      Current Stage
                    </span>
                  </div>

                  {/* Stage 3: Accepted - UPCOMING */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative group mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shadow-sm border border-gray-200/50 border-dashed">
                        <Award size={16} className="text-gray-400" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 mb-1">Accepted</span>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">Upcoming</span>
                  </div>

                  {/* Stage 4: Visa - UPCOMING */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative group mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shadow-sm border border-gray-200/50 border-dashed">
                        <Shield size={16} className="text-gray-400" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 mb-1">Visa</span>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">Upcoming</span>
                  </div>

                  {/* Stage 5: Arrived - UPCOMING */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative group mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shadow-sm border border-gray-200/50 border-dashed">
                        <Plane size={16} className="text-gray-400" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 mb-1">Arrived</span>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">Upcoming</span>
                  </div>
                </div>
              </div>

              {/* PART 2: Lifecycle Status Overview - Within Same Card */}
              <div className="pt-6 border-t border-gray-200/50">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <TrendingUp size={14} className="text-emerald-600" />
                    </div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Student Lifecycle Status</h3>
                  </div>
                  <p className="text-xs text-gray-500 ml-9">Real-time operational overview across all service groups</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* LEFT: Big Numeric Emphasis */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-5xl font-bold text-[#253154] mb-2">22%</div>
                      <div className="text-sm font-semibold text-gray-600">Overall Progress</div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Stage</div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shadow-sm">
                          <FileText size={16} className="text-blue-600" />
                        </div>
                        <span className="font-bold text-gray-900">Applied</span>
                      </div>
                    </div>
                  </div>

                  {/* CENTER: Horizontal Progress Bar + Service Breakdown */}
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Lifecycle Completion</div>
                      <div className="relative">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-gradient-to-r from-[#253154] via-purple-600 to-purple-500 rounded-full shadow-lg" style={{ width: '22%' }}></div>
                        </div>
                        <div className="absolute -top-1 left-[22%] w-5 h-5 bg-purple-600 rounded-full border-2 border-white shadow-md"></div>
                      </div>
                    </div>

                    {/* Service Breakdown */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <div className="text-2xl font-bold text-emerald-700">2</div>
                        <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">Completed</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="text-2xl font-bold text-blue-700">2</div>
                        <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">In Progress</div>
                      </div>
                      <div className="text-center p-3 bg-gray-100 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-gray-600">9</div>
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Not Started</div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Status Pills + Last Activity */}
                  <div className="space-y-3">
                    {/* Status Indicator */}
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</div>
                      <div className="flex flex-col gap-2">
                        <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200 flex items-center gap-2 shadow-sm">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="font-bold text-emerald-700 text-sm">On Track</span>
                        </div>
                        <div className="text-xs text-gray-500 px-4">No blockers detected</div>
                      </div>
                    </div>

                    {/* Last Activity */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Activity</div>
                      <div className="text-xs text-gray-700 font-medium">Eligibility Check Updated</div>
                      <div className="text-[10px] text-gray-500 mt-1">2 hours ago by Lisa Taylor</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GROUP 1: PLANNING & APPLICATION */}
            <div className="group/card relative bg-gradient-to-br from-white to-purple-50/20 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-purple-100/50 overflow-hidden">
              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/40 to-transparent rounded-bl-full -z-0"></div>

              {/* Group Header */}
              <button
                onClick={() => toggleGroup('planning')}
                className="relative w-full px-8 py-6 flex items-center justify-between hover:bg-purple-50/30 transition-all"
              >
                <div className="flex items-center gap-5">
                  {/* Icon Badge */}
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shadow-sm">
                    <Lightbulb size={18} className="text-purple-600" />
                  </div>

                  {/* Group Info */}
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Planning & Application</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-semibold">9 services</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-emerald-600 font-medium">2 completed</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-blue-600 font-medium">2 in progress</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-gray-400 font-medium">5 not started</span>
                    </div>
                  </div>
                </div>

                {/* Progress & Toggle */}
                <div className="flex items-center gap-6">
                  {/* Progress Bar */}
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Progress</div>
                    <div className="flex items-center gap-3">
                      <div className="w-40 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 rounded-full shadow-lg" style={{ width: '22%' }}></div>
                      </div>
                      <span className="text-base font-bold text-purple-700 min-w-[3rem]">22%</span>
                    </div>
                  </div>

                  {/* Chevron Indicator */}
                  <div className={`transition-transform duration-300 ${expandedGroups.planning ? 'rotate-180' : ''}`}>
                    <ChevronDown size={22} className="text-purple-600" />
                  </div>
                </div>
              </button>

              {/* OPERATIONAL SERVICES TABLE */}
              {expandedGroups.planning && (
                <div className="bg-gray-50/30 p-6">
                  <div className="bg-white rounded-xl border border-gray-200">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      <div className="col-span-3">Service Name</div>
                      <div className="col-span-2">Assigned To</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Started On</div>
                      <div className="col-span-2">Last Update</div>
                      <div className="col-span-1 text-center">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-100">
                      {/* Service 1 */}
                      {!archivedServices.has(1) && (
                        <div className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-purple-50/50 transition-colors group items-center ${pausedServices[1]?.isPaused ? 'opacity-60' : ''}`}>
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-200">
                              <CheckCircle size={14} className="text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-gray-900 flex items-center">
                                University Selection Consultation
                                {renderPriorityBadge(1)}
                              </div>
                              <div className="text-xs text-gray-500">Best-fit university identification</div>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                              SJ
                            </div>
                            <span className="text-sm text-gray-700 font-medium">Sarah Johnson</span>
                          </div>
                          <div className="col-span-2">
                            {pausedServices[1]?.isPaused ? (
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold inline-block">On Hold</span>
                            ) : (
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold inline-block">Completed</span>
                            )}
                          </div>
                          <div className="col-span-2 text-sm text-gray-600">Jan 20, 2024</div>
                          <div className="col-span-2 text-sm text-gray-600">Jan 28, 2024</div>
                          <div className="col-span-1 text-center relative">
                            <button
                              ref={(el) => (serviceActionRefs.current[1] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "University Selection Consultation",
                                    description: "Best-fit university identification",
                                    status: pausedServices[1]?.isPaused ? "On Hold" : "Completed",
                                    category: "Planning & Application",
                                    assignedTo: "Sarah Johnson",
                                    startedOn: "Jan 20, 2024",
                                    lastUpdate: "Jan 28, 2024",
                                  },
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Service 2 */}
                      {!archivedServices.has(2) && (
                        <div className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-purple-50/50 transition-colors group items-center ${pausedServices[2]?.isPaused ? 'opacity-60' : ''}`}>
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-200">
                              <CheckCircle size={14} className="text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-gray-900 flex items-center">
                                Profile Evaluation
                                {renderPriorityBadge(2)}
                              </div>
                              <div className="text-xs text-gray-500">Academic & professional assessment</div>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                              SJ
                            </div>
                            <span className="text-sm text-gray-700 font-medium">Sarah Johnson</span>
                          </div>
                          <div className="col-span-2">
                            {pausedServices[2]?.isPaused ? (
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold inline-block">On Hold</span>
                            ) : (
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold inline-block">Completed</span>
                            )}
                          </div>
                          <div className="col-span-2 text-sm text-gray-600">Jan 16, 2024</div>
                          <div className="col-span-2 text-sm text-gray-600">Jan 18, 2024</div>
                          <div className="col-span-1 text-center relative">
                            <button
                              ref={(el) => (serviceActionRefs.current[2] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "Profile Evaluation",
                                    description: "Academic & professional assessment",
                                    status: pausedServices[2]?.isPaused ? "On Hold" : "Completed",
                                    category: "Planning & Application",
                                    assignedTo: "Sarah Johnson",
                                    startedOn: "Jan 16, 2024",
                                    lastUpdate: "Jan 18, 2024",
                                  },
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Service 3 */}
                      {!archivedServices.has(3) && (
                        <div className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-purple-50/50 transition-colors group items-center ${pausedServices[3]?.isPaused ? 'opacity-60' : ''}`}>
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-200">
                              <Clock size={14} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-gray-900">Eligibility & Readiness Check</div>
                              <div className="text-xs text-gray-500">Qualification verification</div>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-[10px] font-bold">
                              LT
                            </div>
                            <span className="text-sm text-gray-700 font-medium">Lisa Taylor</span>
                          </div>
                          <div className="col-span-2">
                            {pausedServices[3]?.isPaused ? (
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold inline-block">On Hold</span>
                            ) : (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                                In Progress
                              </span>
                            )}
                          </div>
                          <div className="col-span-2 text-sm text-gray-600">Feb 1, 2024</div>
                          <div className="col-span-2 text-sm text-amber-600 font-medium">2 hours ago</div>
                          <div className="col-span-1 text-center relative">
                            <button
                              ref={(el) => (serviceActionRefs.current[3] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "Eligibility & Readiness Check",
                                    description: "Qualification verification",
                                    status: pausedServices[3]?.isPaused ? "On Hold" : "In Progress",
                                    category: "Planning & Application",
                                    assignedTo: "Lisa Taylor",
                                    startedOn: "Feb 1, 2024",
                                    lastUpdate: "2 hours ago",
                                  },
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Service 4 */}
                      {!archivedServices.has(4) && (
                        <div className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-purple-50/50 transition-colors group items-center ${pausedServices[4]?.isPaused ? 'opacity-60' : ''}`}>
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                              <TrendingUp size={14} className="text-gray-400" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-gray-900">Career Outcome Insights</div>
                              <div className="text-xs text-gray-500">Post-graduation employment trends</div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm text-gray-500">Unassigned</span>
                          </div>
                          <div className="col-span-2">
                            {pausedServices[4]?.isPaused ? (
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold inline-block">On Hold</span>
                            ) : (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold inline-block">Not Started</span>
                            )}
                          </div>
                          <div className="col-span-2 text-sm text-gray-400">—</div>
                          <div className="col-span-2 text-sm text-gray-400">—</div>
                          <div className="col-span-1 text-center relative">
                            <button
                              ref={(el) => (serviceActionRefs.current[4] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "Career Outcome Insights",
                                    description: "Post-graduation employment trends",
                                    status: pausedServices[4]?.isPaused ? "On Hold" : "Not Started",
                                    category: "Planning & Application",
                                  },
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Service 5 */}
                      {!archivedServices.has(5) && (
                        <div className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-purple-50/50 transition-colors group items-center ${pausedServices[5]?.isPaused ? 'opacity-60' : ''}`}>
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                              <List size={14} className="text-gray-400" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-gray-900">University Shortlisting</div>
                              <div className="text-xs text-gray-500">Final target selection</div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm text-gray-500">Unassigned</span>
                          </div>
                          <div className="col-span-2">
                            {pausedServices[5]?.isPaused ? (
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold inline-block">On Hold</span>
                            ) : (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold inline-block">Not Started</span>
                            )}
                          </div>
                          <div className="col-span-2 text-sm text-gray-400">—</div>
                          <div className="col-span-2 text-sm text-gray-400">—</div>
                          <div className="col-span-1 text-center relative">
                            <button
                              ref={(el) => (serviceActionRefs.current[5] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "University Shortlisting",
                                    description: "Final target selection",
                                    status: pausedServices[5]?.isPaused ? "On Hold" : "Not Started",
                                    category: "Planning & Application",
                                  },
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Service 6 */}
                      {!archivedServices.has(6) && (
                        <div className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-purple-50/50 transition-colors group items-center ${pausedServices[6]?.isPaused ? 'opacity-60' : ''}`}>
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                              <Target size={14} className="text-gray-400" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-gray-900">Application Strategy</div>
                              <div className="text-xs text-gray-500">Timeline & approach planning</div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm text-gray-500">Unassigned</span>
                          </div>
                          <div className="col-span-2">
                            {pausedServices[6]?.isPaused ? (
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold inline-block">On Hold</span>
                            ) : (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold inline-block">Not Started</span>
                            )}
                          </div>
                          <div className="col-span-2 text-sm text-gray-400">—</div>
                          <div className="col-span-2 text-sm text-gray-400">—</div>
                          <div className="col-span-1 text-center relative">
                            <button
                              ref={(el) => (serviceActionRefs.current[6] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "Application Strategy",
                                    description: "Timeline & approach planning",
                                    status: "Not Started",
                                    category: "Planning & Application",
                                    assignedTo: null,
                                    startedOn: null,
                                    lastUpdate: null,
                                  },
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Service 7 */}
                      {!archivedServices.has(7) && (
                        <div className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-purple-50/50 transition-colors group items-center ${pausedServices[7]?.isPaused ? 'opacity-60' : ''}`}>
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-200">
                              <FileText size={14} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-gray-900">SOP Review & Editing</div>
                              <div className="text-xs text-gray-500">Statement of purpose refinement</div>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold">
                              MD
                            </div>
                            <span className="text-sm text-gray-700 font-medium">Mike Davis</span>
                          </div>
                          <div className="col-span-2">
                            {pausedServices[7]?.isPaused ? (
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold inline-block">On Hold</span>
                            ) : (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                                In Progress
                              </span>
                            )}
                          </div>
                          <div className="col-span-2 text-sm text-gray-600">Feb 5, 2024</div>
                          <div className="col-span-2 text-sm text-amber-600 font-medium">3 days ago</div>
                          <div className="col-span-1 text-center relative">
                            <button
                              ref={(el) => (serviceActionRefs.current[7] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "SOP Review & Editing",
                                    description: "Statement of purpose refinement",
                                    status: "In Progress",
                                    category: "Planning & Application",
                                    assignedTo: "Mike Davis",
                                    startedOn: "Feb 5, 2024",
                                    lastUpdate: "3 days ago",
                                  },
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Service 8 */}
                      {!archivedServices.has(8) && (
                        <div className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-purple-50/50 transition-colors group items-center ${pausedServices[8]?.isPaused ? 'opacity-60' : ''}`}>
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                              <UserCheck size={14} className="text-gray-400" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-gray-900">LOR Coordination</div>
                              <div className="text-xs text-gray-500">Recommendation letter management</div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm text-gray-500">Unassigned</span>
                          </div>
                          <div className="col-span-2">
                            {pausedServices[8]?.isPaused ? (
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold inline-block">On Hold</span>
                            ) : (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold inline-block">Not Started</span>
                            )}
                          </div>
                          <div className="col-span-2 text-sm text-gray-400">—</div>
                          <div className="col-span-2 text-sm text-gray-400">—</div>
                          <div className="col-span-1 text-center relative">
                            <button
                              ref={(el) => (serviceActionRefs.current[8] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "LOR Coordination",
                                    description: "Recommendation letter management",
                                    status: "Not Started",
                                    category: "Planning & Application",
                                    assignedTo: null,
                                    startedOn: null,
                                    lastUpdate: null,
                                  },
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Service 9 */}
                      {!archivedServices.has(9) && (
                        <div className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-purple-50/50 transition-colors group items-center ${pausedServices[9]?.isPaused ? 'opacity-60' : ''}`}>
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                              <Send size={14} className="text-gray-400" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-gray-900">Application Submission Support</div>
                              <div className="text-xs text-gray-500">Final review & submission</div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm text-gray-500">Unassigned</span>
                          </div>
                          <div className="col-span-2">
                            {pausedServices[9]?.isPaused ? (
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold inline-block">On Hold</span>
                            ) : (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold inline-block">Not Started</span>
                            )}
                          </div>
                          <div className="col-span-2 text-sm text-gray-400">—</div>
                          <div className="col-span-2 text-sm text-gray-400">—</div>
                          <div className="col-span-1 text-center relative">
                            <button
                              ref={(el) => (serviceActionRefs.current[9] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "Application Submission Support",
                                    description: "Final review & submission",
                                    status: "Not Started",
                                    category: "Planning & Application",
                                    assignedTo: null,
                                    startedOn: null,
                                    lastUpdate: null,
                                  },
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GROUP 2: OFFER & DECISION */}
            <div className="group/card relative bg-gradient-to-br from-white to-emerald-50/20 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100/50 overflow-hidden">
              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100/40 to-transparent rounded-bl-full -z-0"></div>

              {/* Group Header */}
              <button
                onClick={() => toggleGroup('offer')}
                className="relative w-full px-8 py-6 flex items-center justify-between hover:bg-emerald-50/30 transition-all"
              >
                <div className="flex items-center gap-5">
                  {/* Icon Badge */}
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shadow-sm">
                    <Award size={18} className="text-emerald-600" />
                  </div>

                  {/* Group Info */}
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Offer & Decision</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-semibold">1 service</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-emerald-600 font-medium">0 completed</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-blue-600 font-medium">0 in progress</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-gray-400 font-medium">1 not started</span>
                    </div>
                  </div>
                </div>

                {/* Progress & Toggle */}
                <div className="flex items-center gap-6">
                  {/* Progress Bar */}
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Progress</div>
                    <div className="flex items-center gap-3">
                      <div className="w-40 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 rounded-full shadow-lg" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-base font-bold text-gray-500 min-w-[3rem]">0%</span>
                    </div>
                  </div>

                  {/* Chevron Indicator */}
                  <div className={`transition-transform duration-300 ${expandedGroups.offer ? 'rotate-180' : ''}`}>
                    <ChevronDown size={22} className="text-emerald-600" />
                  </div>
                </div>
              </button>

              {/* Services List */}
              {expandedGroups.offer && (
                <div className="divide-y divide-gray-50">
                  {/* Service 10: Offer Review & Decision Support */}
                  <div className="px-8 py-5 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-sm">
                        <Award size={18} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">Offer Review & Decision Support</h4>
                            <p className="text-xs text-gray-500">Analysis and guidance on acceptance decisions</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">Not Started</span>
                            <button
                              ref={(el) => (serviceActionRefs.current[10] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "Offer Review & Decision",
                                    status: "Not Started",
                                    description: "Analysis and guidance on acceptance decisions"
                                  }
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-[10px] font-semibold">Unassigned</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Calendar size={12} />
                            <span>Started: —</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Clock size={12} />
                            <span>Completed: —</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GROUP 3: VISA & COMPLIANCE */}
            <div className="group/card relative bg-gradient-to-br from-white to-blue-50/20 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100/50 overflow-hidden">
              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/40 to-transparent rounded-bl-full -z-0"></div>

              {/* Group Header */}
              <button
                onClick={() => toggleGroup('visa')}
                className="relative w-full px-8 py-6 flex items-center justify-between hover:bg-blue-50/30 transition-all"
              >
                <div className="flex items-center gap-5">
                  {/* Icon Badge */}
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shadow-sm">
                    <Shield size={18} className="text-blue-600" />
                  </div>

                  {/* Group Info */}
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Visa & Compliance</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-semibold">2 services</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-emerald-600 font-medium">0 completed</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-blue-600 font-medium">0 in progress</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-gray-400 font-medium">2 not started</span>
                    </div>
                  </div>
                </div>

                {/* Progress & Toggle */}
                <div className="flex items-center gap-6">
                  {/* Progress Bar */}
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Progress</div>
                    <div className="flex items-center gap-3">
                      <div className="w-40 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-full shadow-lg" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-base font-bold text-gray-500 min-w-[3rem]">0%</span>
                    </div>
                  </div>

                  {/* Chevron Indicator */}
                  <div className={`transition-transform duration-300 ${expandedGroups.visa ? 'rotate-180' : ''}`}>
                    <ChevronDown size={22} className="text-blue-600" />
                  </div>
                </div>
              </button>

              {/* Services List */}
              {expandedGroups.visa && (
                <div className="divide-y divide-gray-50">
                  {/* Service 11: Visa Application Assistance */}
                  <div className="px-8 py-5 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-sm">
                        <FileText size={18} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">Visa Application Assistance</h4>
                            <p className="text-xs text-gray-500">Complete support for student visa application process</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">Not Started</span>
                            <button
                              ref={(el) => (serviceActionRefs.current[11] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "Visa Application Assistance",
                                    status: "Not Started",
                                    description: "Complete support for student visa application process"
                                  }
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-[10px] font-semibold">Unassigned</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Calendar size={12} />
                            <span>Started: —</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Clock size={12} />
                            <span>Completed: —</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service 12: Compliance & Renewals */}
                  <div className="px-8 py-5 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-sm">
                        <Shield size={18} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">Compliance & Renewals</h4>
                            <p className="text-xs text-gray-500">Ongoing visa compliance and renewal support</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">Not Started</span>
                            <button
                              ref={(el) => (serviceActionRefs.current[12] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "Compliance Renewals",
                                    status: "Not Started",
                                    description: "Ongoing visa compliance and renewal support"
                                  }
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-[10px] font-semibold">Unassigned</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Calendar size={12} />
                            <span>Started: —</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Clock size={12} />
                            <span>Completed: —</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GROUP 4: ARRIVAL & LIFE SETUP */}
            <div className="group/card relative bg-gradient-to-br from-white to-amber-50/20 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-amber-100/50 overflow-hidden">
              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100/40 to-transparent rounded-bl-full -z-0"></div>

              {/* Group Header */}
              <button
                onClick={() => toggleGroup('arrival')}
                className="relative w-full px-8 py-6 flex items-center justify-between hover:bg-amber-50/30 transition-all"
              >
                <div className="flex items-center gap-5">
                  {/* Icon Badge */}
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shadow-sm">
                    <Plane size={18} className="text-amber-600" />
                  </div>

                  {/* Group Info */}
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Arrival & Life Setup</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-semibold">1 service</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-emerald-600 font-medium">0 completed</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-blue-600 font-medium">0 in progress</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-gray-400 font-medium">1 not started</span>
                    </div>
                  </div>
                </div>

                {/* Progress & Toggle */}
                <div className="flex items-center gap-6">
                  {/* Progress Bar */}
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Progress</div>
                    <div className="flex items-center gap-3">
                      <div className="w-40 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 rounded-full shadow-lg" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-base font-bold text-gray-500 min-w-[3rem]">0%</span>
                    </div>
                  </div>

                  {/* Chevron Indicator */}
                  <div className={`transition-transform duration-300 ${expandedGroups.arrival ? 'rotate-180' : ''}`}>
                    <ChevronDown size={22} className="text-amber-600" />
                  </div>
                </div>
              </button>

              {/* Services List */}
              {expandedGroups.arrival && (
                <div className="divide-y divide-gray-50">
                  {/* Service 13: Pre-Departure Support */}
                  <div className="px-8 py-5 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-sm">
                        <Briefcase size={18} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">Pre-Departure Support</h4>
                            <p className="text-xs text-gray-500">Orientation and preparation for international travel and settling in</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">Not Started</span>
                            <button
                              ref={(el) => (serviceActionRefs.current[13] = el)}
                              onClick={() => {
                                setServiceDetailModal({
                                  isOpen: true,
                                  service: {
                                    name: "Pre-Departure Support",
                                    status: "Not Started",
                                    description: "Orientation and preparation for international travel and settling in"
                                  }
                                });
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-[10px] font-semibold">Unassigned</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Calendar size={12} />
                            <span>Started: —</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Clock size={12} />
                            <span>Completed: —</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div>
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CustomSelect
                  placeholder="All Categories"
                  value={docFilters.category}
                  onChange={(val) => setDocFilters(prev => ({ ...prev, category: val }))}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "academic", label: "Academic" },
                    { value: "financial", label: "Financial" },
                    { value: "visa", label: "Visa" }
                  ]}
                  className="w-[180px]"
                />
                <CustomSelect
                  placeholder="All Statuses"
                  value={docFilters.status}
                  onChange={(val) => setDocFilters(prev => ({ ...prev, status: val }))}
                  options={[
                    { value: "all", label: "All Statuses" },
                    { value: "pending", label: "Pending" },
                    { value: "uploaded", label: "Uploaded" },
                    { value: "verified", label: "Verified" },
                    { value: "rejected", label: "Rejected" }
                  ]}
                  className="w-[180px]"
                />
              </div>
              <button
                onClick={() => setShowUploadDocumentModal(true)}
                className="px-5 py-2.5 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-all shadow-lg shadow-purple-900/20 text-sm font-medium flex items-center gap-2">
                <Upload size={16} />
                Upload Document
              </button>
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-b from-gray-50 to-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Document Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Uploaded Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {documents.map((doc) => (
                      <tr
                        key={doc.id}
                        onClick={() => {
                          if (doc.status !== 'Pending') {
                            setDocumentDetailModal({
                              isOpen: true,
                              document: doc,
                            });
                          }
                        }}
                        className={`transition-all group ${doc.status !== 'Pending'
                          ? 'hover:bg-purple-50/30 cursor-pointer'
                          : 'hover:bg-gray-50/50'
                          }`}
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{doc.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${doc.category === 'Academic' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                            doc.category === 'Financial' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              doc.category === 'Visa' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                            {doc.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            doc.status === 'Uploaded' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              doc.status === 'Pending' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                doc.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                  'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm ${doc.uploadedDate === '-' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {doc.uploadedDate}
                        </td>
                        <td className="px-6 py-4">
                          {doc.status === 'Pending' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowUploadDocumentModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                            >
                              Upload
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDocumentDetailModal({
                                    isOpen: true,
                                    document: doc,
                                  });
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadDocument(doc.name);
                                }}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                <Download size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDocument(doc.id);
                                }}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COMMUNICATIONS */}
        {activeTab === 'communications' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100/50">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <MessageCircle size={14} className="text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 tracking-tight">Communication Timeline</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-5 pb-6 border-b border-gray-50 last:border-b-0">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                      <Mail size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Application Submission Confirmation</h4>
                        <span className="text-xs text-gray-500 font-medium">Feb 15, 2024 2:30 PM</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Your application to Stanford University has been successfully submitted.</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-semibold border border-blue-100">Email</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">Sent by: System</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-5 pb-6 border-b border-gray-50 last:border-b-0">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                      <MessageCircle size={18} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Follow-up on Document Requirements</h4>
                        <span className="text-xs text-gray-500 font-medium">Feb 10, 2024 10:15 AM</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Hi Arjun, please upload your bank statement by Feb 15.</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md font-semibold border border-emerald-100">WhatsApp</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">Sent by: Sarah Johnson</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-5 pb-6 border-b border-gray-50 last:border-b-0">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100">
                      <PhoneCall size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">University Selection Consultation Call</h4>
                        <span className="text-xs text-gray-500 font-medium">Jan 25, 2024 4:00 PM</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">45 minute call discussing university options and application strategy.</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md font-semibold border border-purple-100">Call</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">Counselor: Sarah Johnson</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-5 pb-6 border-b border-gray-50 last:border-b-0">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                      <Mail size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Welcome Email</h4>
                        <span className="text-xs text-gray-500 font-medium">Jan 15, 2024 9:00 AM</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Welcome to our platform! Your counselor will reach out within 24 hours.</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-semibold border border-blue-100">Email</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">Sent by: System</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Quick Actions */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100/50 sticky top-32">
                <h3 className="text-base font-semibold text-gray-900 mb-5 tracking-tight">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-5 py-3.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all flex items-center gap-3 font-semibold border border-blue-100 shadow-sm">
                    <Mail size={18} />
                    Send Email
                  </button>
                  <button className="w-full px-5 py-3.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all flex items-center gap-3 font-semibold border border-emerald-100 shadow-sm">
                    <MessageCircle size={18} />
                    Send WhatsApp
                  </button>
                  <button className="w-full px-5 py-3.5 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all flex items-center gap-3 font-semibold border border-purple-100 shadow-sm">
                    <PhoneCall size={18} />
                    Schedule Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ACTIVITY & BEHAVIOR */}
        {activeTab === 'activity' && (
          <div className="space-y-8">
            {/* SECTION 1: PLATFORM ACTIVITY SUMMARY (ENHANCED) */}
            <div className="grid grid-cols-4 gap-6">
              {/* Total Sessions Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Monitor size={18} className="text-white" />
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Sessions</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">47</div>
                <div className="text-xs text-gray-500">Lifetime sessions</div>
              </div>

              {/* Last Login Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Clock size={18} className="text-white" />
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Login</div>
                <div className="text-3xl font-bold text-gray-900 mb-1" title="Feb 28, 2024 3:45 PM">2d ago</div>
                <div className="text-xs text-gray-500">Feb 28, 2024 3:45 PM</div>
              </div>

              {/* Avg Session Duration Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Clock size={18} className="text-white" />
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Avg Session Duration</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">12m</div>
                <div className="text-xs text-gray-500">Last 30 days</div>
              </div>

              {/* Primary Device Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Monitor size={18} className="text-white" />
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Device</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">Desktop</div>
                <div className="text-xs text-gray-500" title="Desktop: 78% • Mobile: 22%">78% usage split</div>
              </div>
            </div>

            {/* SECTION 2: ENGAGEMENT & BEHAVIOR TIMELINE (CORE) */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Clock size={14} className="text-emerald-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 tracking-tight">Engagement & Behavior Timeline</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 w-64"
                    />
                  </div>
                  <CustomSelect
                    placeholder="All Event Types"
                    value={eventTypeFilter}
                    onChange={setEventTypeFilter}
                    options={[
                      { value: "all", label: "All Event Types" },
                      { value: "page-viewed", label: "Page Viewed" },
                      { value: "document-downloaded", label: "Document Downloaded" },
                      { value: "form-submitted", label: "Form Submitted" },
                      { value: "cta-clicked", label: "CTA Clicked" },
                      { value: "partner-redirect", label: "Partner Redirect" },
                      { value: "system-trigger", label: "System Trigger" }
                    ]}
                    className="w-[180px]"
                  />
                  <div className="relative">
                    <button
                      onClick={() => setShowDateFilterDropdown(!showDateFilterDropdown)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-all shadow-sm flex items-center gap-2"
                    >
                      <Filter size={16} />
                      {getDateFilterLabel()}
                      <ChevronDown size={14} className={`transition-transform ${showDateFilterDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDateFilterDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowDateFilterDropdown(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            onClick={() => handleDateFilterChange('all')}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${dateFilter === 'all' ? 'text-purple-600 font-semibold bg-purple-50' : 'text-gray-700'
                              }`}
                          >
                            All Time
                          </button>
                          <button
                            onClick={() => handleDateFilterChange('today')}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${dateFilter === 'today' ? 'text-purple-600 font-semibold bg-purple-50' : 'text-gray-700'
                              }`}
                          >
                            Today
                          </button>
                          <button
                            onClick={() => handleDateFilterChange('last7days')}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${dateFilter === 'last7days' ? 'text-purple-600 font-semibold bg-purple-50' : 'text-gray-700'
                              }`}
                          >
                            Last 7 Days
                          </button>
                          <button
                            onClick={() => handleDateFilterChange('last30days')}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${dateFilter === 'last30days' ? 'text-purple-600 font-semibold bg-purple-50' : 'text-gray-700'
                              }`}
                          >
                            Last 30 Days
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {filteredEvents.map((event) => {
                  const colors = getEventColorClasses(event.colorScheme);
                  return (
                    <div
                      key={event.id}
                      className={`group flex items-start gap-4 p-4 bg-gradient-to-r ${colors.bg} to-transparent rounded-xl border ${colors.border} hover:shadow-md transition-all cursor-pointer`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${colors.badge} flex-shrink-0`}>
                        <div className={`w-2.5 h-2.5 ${colors.dot} rounded-full`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 mb-1">{event.title}</div>
                        <div className="text-sm text-gray-500">{event.date}</div>
                        <div className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {event.details}
                        </div>
                      </div>
                      <span className={`px-3 py-1 ${colors.badge} ${colors.badgeText} rounded-lg text-xs font-semibold border ${colors.badgeBorder} flex-shrink-0`}>
                        {event.type}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Load More */}
              {hasMoreEvents && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                  >
                    Load More Events
                  </button>
                </div>
              )}
            </div>

            {/* NEW BEHAVIORAL INTELLIGENCE SECTIONS */}
            <SessionHeatmapsSection />
            <UserJourneySection />
            <FunnelPerformanceSection />
            <ClickInteractionSection />
            <BehavioralSegmentationSection />
            <IntentSignalsSection />
            <BehavioralFrictionSection />

            {/* SECTION 3: AI INSIGHTS & PREDICTIONS (EXTENDED) */}
            <div className="bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-indigo-50/30 rounded-2xl shadow-sm p-8 border border-purple-100/50 relative overflow-hidden">
              {/* Subtle Glow Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl -z-0"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -z-0"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Lightbulb size={14} className="text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 tracking-tight">AI Insights & Predictions</h3>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-bold border border-purple-200">AI</span>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {/* Readiness Score */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-24 h-24">
                        {/* Circular Progress Ring */}
                        <svg className="transform -rotate-90 w-24 h-24">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.78)}`}
                            className="text-emerald-500"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-900">78%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900 mb-1">Readiness Score</div>
                      <div className="text-xs text-gray-500 mb-2">Decision readiness</div>
                      <div className="text-xs text-emerald-600 font-semibold">Confidence: 91%</div>
                    </div>
                    <details className="mt-3 text-left">
                      <summary className="text-xs text-blue-600 font-semibold cursor-pointer hover:text-blue-700">Why AI thinks this</summary>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">Based on consistent document uploads, repeated offer views, and partner service engagements over past 7 days.</p>
                    </details>
                  </div>

                  {/* Drop-off Risk */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Shield size={28} className="text-emerald-600" />
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="inline-block px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-200 mb-2">Low Risk</span>
                      <div className="text-sm font-bold text-gray-900 mb-1">Drop-off Risk</div>
                      <div className="text-xs text-gray-500 mb-2">Engagement stable</div>
                      <div className="text-xs text-emerald-600 font-semibold">Confidence: 85%</div>
                    </div>
                    <details className="mt-3 text-left">
                      <summary className="text-xs text-blue-600 font-semibold cursor-pointer hover:text-blue-700">Why AI thinks this</summary>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">No abandonment signals detected. Steady session frequency and progressive funnel advancement indicate low churn risk.</p>
                    </details>
                  </div>

                  {/* Next Likely Action */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <TrendingUp size={28} className="text-blue-600" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900 mb-2">Next Likely Action</div>
                      <div className="text-xs text-gray-600 leading-relaxed mb-2">Will likely upload visa documents</div>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-xs text-blue-600 font-semibold">Timeframe: 48h</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-blue-600 font-semibold">73% confidence</span>
                      </div>
                    </div>
                    <details className="mt-3 text-left">
                      <summary className="text-xs text-blue-600 font-semibold cursor-pointer hover:text-blue-700">Why AI thinks this</summary>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">Similar students at this journey stage with comparable engagement patterns typically upload visa docs within 2 days.</p>
                    </details>
                  </div>

                  {/* Recommended Admin Action */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                        <Lightbulb size={28} className="text-purple-600" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900 mb-2">Recommended Action</div>
                      <div className="text-xs text-gray-600 leading-relaxed mb-2">Send proactive visa prep checklist</div>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-xs text-purple-600 font-semibold">Act within: 24h</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-purple-600 font-semibold">Impact: High</span>
                      </div>
                    </div>
                    <details className="mt-3 text-left">
                      <summary className="text-xs text-blue-600 font-semibold cursor-pointer hover:text-blue-700">Why AI thinks this</summary>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">Proactive outreach at this stage historically increases on-time document submission by 34% and reduces counselor workload.</p>
                    </details>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: TECHNICAL & ENVIRONMENT METADATA (EXPANDED) */}
            <details className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden group">
              <summary className="p-6 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50/50 transition-all list-none flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Shield size={14} className="text-gray-600" />
                  </div>
                  <span className="tracking-tight">Technical & Environment Metadata</span>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-8 pb-8 pt-4 grid grid-cols-2 gap-6 text-sm border-t border-gray-50">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Browser + Version</div>
                  <div className="text-gray-900 font-mono">Chrome 120.0.6099.129</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Operating System</div>
                  <div className="text-gray-900 font-mono">Windows 11 Pro</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Device Type</div>
                  <div className="text-gray-900 font-mono">Desktop (1920x1080)</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Approx Location</div>
                  <div className="text-gray-900 font-mono">New Delhi, India</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Network Type</div>
                  <div className="text-gray-900 font-mono">WiFi (Broadband)</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Referrer Source</div>
                  <div className="text-gray-900 font-mono">Google Organic Search</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">IP Address (Masked)</div>
                  <div className="text-gray-900 font-mono">103.xxx.xxx.xxx</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Multi-device Usage</div>
                  <div className="text-gray-900 font-mono">3 devices detected</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Session Count (Desktop)</div>
                  <div className="text-gray-900 font-mono">32 sessions</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Session Count (Mobile)</div>
                  <div className="text-gray-900 font-mono">15 sessions</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Device Status</div>
                  <div className="text-gray-900 font-mono">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold mr-1">Returning</span>
                    <span className="text-gray-500 text-xs">Primary</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Last Device Switch</div>
                  <div className="text-gray-900 font-mono">18 hours ago</div>
                </div>
              </div>
            </details>

            {/* SECTION 6: DATA ETHICS & CONSENT INDICATOR */}
            <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Shield size={16} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    Data Collection & Transparency
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    All data collected under user consent & platform policy
                  </p>
                </div>
                <button
                  onClick={() => setDataPolicyModalOpen(true)}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors underline decoration-dotted underline-offset-4"
                >
                  View Data Policy
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Data Sources</div>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">Web</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-xs font-semibold">Partner API</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-xs font-semibold">CRM</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Last Sync</div>
                  <div className="text-sm font-mono text-gray-900">2 min ago</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Data Retention</div>
                  <div className="text-sm font-mono text-gray-900">365 days</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PAYMENTS & FINANCIALS */}
        {activeTab === 'payments' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Total Paid</div>
                <div className="text-4xl font-bold text-emerald-600">$2,450</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pending Amount</div>
                <div className="text-4xl font-bold text-amber-600">$850</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100/50 hover:shadow-md transition-shadow">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Refunds Issued</div>
                <div className="text-4xl font-bold text-gray-900">$0</div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-b from-gray-50 to-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Invoice ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Service Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Payment Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockPaymentsForTable.map((payment, index) => (
                      <tr
                        key={index}
                        className="hover:bg-purple-50/30 transition-all cursor-pointer"
                        onClick={() => setPaymentDetailModal({
                          isOpen: true,
                          payment: payment
                        })}
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{payment.invoiceId}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{payment.serviceName}</td>
                        <td className="px-6 py-4 text-base font-bold text-gray-900">{payment.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${payment.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm ${payment.paymentMethod === '-' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {payment.paymentMethod}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{payment.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: INTERNAL NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-8">
            {/* Add Note Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100/50">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Plus size={14} className="text-purple-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 tracking-tight">Add New Note</h3>
              </div>
              <textarea
                className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 mb-4 resize-none"
                rows={4}
                placeholder="Type internal note here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100 transition-all flex items-center gap-2 font-semibold border border-red-100 shadow-sm">
                    <Tag size={14} />
                    Important
                  </button>
                  <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-all flex items-center gap-2 font-semibold border border-blue-100 shadow-sm">
                    <Tag size={14} />
                    Follow-up
                  </button>
                  <button className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm hover:bg-amber-100 transition-all flex items-center gap-2 font-semibold border border-amber-100 shadow-sm">
                    <Tag size={14} />
                    Risk
                  </button>
                </div>
                <button
                  onClick={async () => {
                    if (!noteText.trim()) return;
                    setIsAddingNote(true);
                    try {
                      const updatedNotes = student?.notes
                        ? `${noteText}\n\n---\n\n${student.notes}`
                        : noteText;
                      if (!studentId) {
                        toast.error('Student ID is missing');
                        return;
                      }
                      await updateStudent(studentId, { notes: updatedNotes });
                      setStudent(prev => prev ? { ...prev, notes: updatedNotes } : null);
                      setNoteText('');
                      toast.success('Note added successfully');
                    } catch (err) {
                      console.error('Error adding note:', err);
                      toast.error('Failed to add note');
                    } finally {
                      setIsAddingNote(false);
                    }
                  }}
                  disabled={isAddingNote || !noteText.trim()}
                  className="px-6 py-2.5 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-all shadow-lg shadow-purple-900/20 text-sm font-semibold disabled:opacity-50"
                >
                  {isAddingNote ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </div>

            {/* Notes Timeline */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100/50">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText size={14} className="text-blue-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 tracking-tight">Notes Timeline</h3>
              </div>
              <div className="space-y-6">
                {student?.notes && (
                  <div className="border-l-4 border-purple-500 pl-6 pb-6 border-b border-gray-50 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/20">
                          {studentCounselor.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{studentCounselor.name}</div>
                          <div className="text-xs text-gray-500 font-medium">Recently Updated</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold border border-purple-100">Latest Note</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {student.notes}
                    </p>
                  </div>
                )}

                {/* Keep mock notes below for history visualization until fully dynamic */}
                <div className="border-l-4 border-red-500 pl-6 pb-6 border-b border-gray-50 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/20">
                        SJ
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Sarah Johnson</div>
                        <div className="text-xs text-gray-500 font-medium">Feb 18, 2024 at 4:30 PM</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold border border-red-100">Important</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Student is showing high intent. Recommend prioritizing Stanford application review. Financial docs still pending - need to follow up by Feb 22.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-6 pb-6 border-b border-gray-50 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20">
                        MD
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Mike Davis</div>
                        <div className="text-xs text-gray-500 font-medium">Feb 10, 2024 at 11:20 AM</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">Follow-up</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Completed first SOP draft review. Strong writing but needs more specific examples. Scheduled follow-up call for Feb 15.
                  </p>
                </div>

                <div className="border-l-4 border-gray-200 pl-6 pb-6 border-b border-gray-50 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/20">
                        SJ
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Sarah Johnson</div>
                        <div className="text-xs text-gray-500 font-medium">Jan 28, 2024 at 2:15 PM</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Initial consultation completed. Student has clear goals and strong academic background. Recommended 5 universities across USA and Canada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: 3RD PARTY SERVICE PROVIDER */}
        {activeTab === 'third-party' && (
          <div className="space-y-6">

            {/* SECTION 1: SERVICES OVERVIEW GRID */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
              {/* Section Header */}
              <div
                className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => toggleSection('servicesOverview')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center shadow-sm">
                      <Building size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Services Overview</h3>
                      <p className="text-xs text-gray-500 mt-0.5">All metrics shown are specific to this student</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    {collapsedSections.servicesOverview ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                </div>
              </div>

              {/* Services Grid */}
              {!collapsedSections.servicesOverview && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* SIM Cards */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'sim'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'sim' ? null : 'sim')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shadow-sm">
                          <Smartphone size={20} className="text-blue-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Converted</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">SIM Cards</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          1 provider used
                        </span>
                        <span className="flex items-center gap-1 text-green-600 font-semibold">
                          <CheckCircle size={12} />
                          Purchased
                        </span>
                      </div>
                    </div>

                    {/* Banks */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'banks'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'banks' ? null : 'banks')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-sm">
                          <Banknote size={20} className="text-emerald-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">Engaged</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Banks</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          2 providers viewed
                        </span>
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                          <Eye size={12} />
                          Lead submitted
                        </span>
                      </div>
                    </div>

                    {/* Insurance */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'insurance'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'insurance' ? null : 'insurance')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-sm">
                          <Shield size={20} className="text-purple-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">Viewed</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Insurance</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          3 providers viewed
                        </span>
                        <span className="flex items-center gap-1 text-gray-500 font-semibold">
                          <MousePointer size={12} />
                          No click-out
                        </span>
                      </div>
                    </div>

                    {/* Food */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'food'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'food' ? null : 'food')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center shadow-sm">
                          <Utensils size={20} className="text-orange-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">Not Shown</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Food</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          Not shown yet
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 font-semibold">
                          <XCircle size={12} />
                          Not interacted
                        </span>
                      </div>
                    </div>

                    {/* Visas */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'visas'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'visas' ? null : 'visas')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm">
                          <Plane size={20} className="text-indigo-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Converted</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Visas</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          1 provider used
                        </span>
                        <span className="flex items-center gap-1 text-green-600 font-semibold">
                          <CheckCircle size={12} />
                          Completed
                        </span>
                      </div>
                    </div>

                    {/* Events */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'events'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'events' ? null : 'events')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center shadow-sm">
                          <Calendar size={20} className="text-pink-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">Engaged</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Events</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          4 events viewed
                        </span>
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                          <Eye size={12} />
                          Clicked
                        </span>
                      </div>
                    </div>

                    {/* Employment */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'employment'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'employment' ? null : 'employment')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm">
                          <Briefcase size={20} className="text-blue-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">Not Shown</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Employment</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          Not shown yet
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 font-semibold">
                          <XCircle size={12} />
                          Not interacted
                        </span>
                      </div>
                    </div>

                    {/* Taxes */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'taxes'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'taxes' ? null : 'taxes')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center shadow-sm">
                          <FileText size={20} className="text-amber-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">Not Shown</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Taxes</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          Not shown yet
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 font-semibold">
                          <XCircle size={12} />
                          Not interacted
                        </span>
                      </div>
                    </div>

                    {/* Loans */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'loans'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'loans' ? null : 'loans')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-sm">
                          <DollarSign size={20} className="text-green-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">Viewed</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Loans</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          2 providers viewed
                        </span>
                        <span className="flex items-center gap-1 text-gray-500 font-semibold">
                          <MousePointer size={12} />
                          No click-out
                        </span>
                      </div>
                    </div>

                    {/* Build Credit */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'credit'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'credit' ? null : 'credit')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center shadow-sm">
                          <CreditCard size={20} className="text-cyan-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">Not Shown</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Build Credit</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          Not shown yet
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 font-semibold">
                          <XCircle size={12} />
                          Not interacted
                        </span>
                      </div>
                    </div>

                    {/* Housing */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'housing'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'housing' ? null : 'housing')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center shadow-sm">
                          <Home size={20} className="text-violet-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">Engaged</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Housing</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          3 providers viewed
                        </span>
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                          <Eye size={12} />
                          Inquired
                        </span>
                      </div>
                    </div>

                    {/* Courses */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'courses'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'courses' ? null : 'courses')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center shadow-sm">
                          <BookOpen size={20} className="text-red-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">Viewed</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Courses</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          1 provider viewed
                        </span>
                        <span className="flex items-center gap-1 text-gray-500 font-semibold">
                          <MousePointer size={12} />
                          No click-out
                        </span>
                      </div>
                    </div>

                    {/* Forex */}
                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedService === 'forex'
                        ? 'border-purple-300 bg-purple-50/30 shadow-lg shadow-purple-100'
                        : 'border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-purple-200'
                        }`}
                      onClick={() => setSelectedService(selectedService === 'forex' ? null : 'forex')}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center shadow-sm">
                          <ArrowLeftRight size={20} className="text-teal-600" />
                        </div>
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Converted</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">Forex</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          1 provider used
                        </span>
                        <span className="flex items-center gap-1 text-green-600 font-semibold">
                          <CheckCircle size={12} />
                          Transacted
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: PROVIDER ENGAGEMENT OVERVIEW */}
            {selectedService && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                <div
                  className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => toggleSection('providerEngagement')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm">
                        <Users size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Provider Engagement</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Detailed provider-level analytics</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      {collapsedSections.providerEngagement ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                  </div>
                </div>

                {!collapsedSections.providerEngagement && (
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Provider</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Integration</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4" title="Student-specific codes for attribution">Referral Code</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Status</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Conversion</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Last Interaction</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-50 hover:bg-purple-50/20 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                  AP
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 text-sm">Airalo Plus</div>
                                  <div className="text-xs text-gray-500">SIM Cards</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">Click-out</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <code className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-mono font-semibold">SIM-US-2025</code>
                                <button className="text-gray-400 hover:text-purple-600">
                                  <ExternalLink size={14} />
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Converted</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle size={14} className="text-green-600" />
                                <span className="text-sm font-semibold text-green-600">Yes</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-700">Feb 15, 2024</div>
                              <div className="text-xs text-gray-500">3 days ago</div>
                            </td>
                            <td className="py-4 px-4">
                              <button className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors">
                                View Journey
                              </button>
                            </td>
                          </tr>

                          <tr className="border-b border-gray-50 hover:bg-purple-50/20 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                  WU
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 text-sm">Wise USA</div>
                                  <div className="text-xs text-gray-500">Banks</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">Lead</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <code className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-mono font-semibold">BANK-WISE-24</code>
                                <button className="text-gray-400 hover:text-purple-600">
                                  <ExternalLink size={14} />
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">Engaged</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5">
                                <Clock size={14} className="text-amber-600" />
                                <span className="text-sm font-semibold text-amber-600">Pending</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-700">Feb 18, 2024</div>
                              <div className="text-xs text-gray-500">Today</div>
                            </td>
                            <td className="py-4 px-4">
                              <button className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors">
                                View Referral
                              </button>
                            </td>
                          </tr>

                          <tr className="hover:bg-purple-50/20 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                  VS
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 text-sm">VFS Global</div>
                                  <div className="text-xs text-gray-500">Visas</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">API</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <code className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-mono font-semibold">VISA-US-2025</code>
                                <button className="text-gray-400 hover:text-purple-600">
                                  <ExternalLink size={14} />
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Converted</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle size={14} className="text-green-600" />
                                <span className="text-sm font-semibold text-green-600">Yes</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-700">Feb 12, 2024</div>
                              <div className="text-xs text-gray-500">6 days ago</div>
                            </td>
                            <td className="py-4 px-4">
                              <button className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors">
                                View Revenue
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: REFERRAL & ATTRIBUTION INTELLIGENCE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
              <div
                className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => toggleSection('referralAttribution')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-sm">
                      <Link size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Referral & Attribution Intelligence</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Student-level referral attribution (AI confidence weighted)</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    {collapsedSections.referralAttribution ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                </div>
              </div>

              {!collapsedSections.referralAttribution && (
                <div className="p-6 space-y-6">
                  {/* Active Referrals */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Referral 1 */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50/50 to-blue-50/50 border border-purple-100">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <code className="px-3 py-1.5 bg-white text-purple-700 rounded-lg text-sm font-mono font-bold shadow-sm">VISA-US-2025</code>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">Active</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">Exposure: <span className="font-semibold text-gray-800">WhatsApp + Email</span></p>
                        </div>
                        <ExternalLink size={16} className="text-purple-600" />
                      </div>

                      {/* Funnel */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Student views → clicks</span>
                          <span className="font-semibold text-gray-900">8 → 3</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Clicks → lead</span>
                          <span className="font-semibold text-gray-900">3 → 1</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Lead → conversion</span>
                          <span className="font-semibold text-green-700 font-bold">1 → 1 (100%)</span>
                        </div>
                      </div>

                      {/* Revenue */}
                      <div className="pt-3 border-t border-purple-200/50">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Student Attribution</div>
                            <div className="text-sm font-bold text-gray-900">$1,840</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Commission (8%)</div>
                            <div className="text-sm font-bold text-green-600">$147.20</div>
                          </div>
                        </div>
                      </div>

                      {/* Settlement */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-600">Settlement:</span>
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">Pending</span>
                      </div>
                    </div>

                    {/* Referral 2 */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50/50 to-cyan-50/50 border border-blue-100">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <code className="px-3 py-1.5 bg-white text-blue-700 rounded-lg text-sm font-mono font-bold shadow-sm">SIM-US-2025</code>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">Active</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">Exposure: <span className="font-semibold text-gray-800">Card + Counselor</span></p>
                        </div>
                        <ExternalLink size={16} className="text-blue-600" />
                      </div>

                      {/* Funnel */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Student views → clicks</span>
                          <span className="font-semibold text-gray-900">5 → 2</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Clicks → lead</span>
                          <span className="font-semibold text-gray-900">2 → 1</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Lead → conversion</span>
                          <span className="font-semibold text-green-700 font-bold">1 → 1 (100%)</span>
                        </div>
                      </div>

                      {/* Revenue */}
                      <div className="pt-3 border-t border-blue-200/50">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Student Attribution</div>
                            <div className="text-sm font-bold text-gray-900">$420</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Commission (12%)</div>
                            <div className="text-sm font-bold text-green-600">$50.40</div>
                          </div>
                        </div>
                      </div>

                      {/* Settlement */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-600">Settlement:</span>
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Approved</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md flex-shrink-0">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">AI Insight</span>
                          <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded text-xs font-semibold">High Confidence</span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">
                          Referral <span className="font-mono font-bold text-purple-700">VISA-US-2025</span> converts <span className="font-bold text-green-700">2.3× higher</span> for Fall 2025 applicants compared to Spring intake students.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: BEHAVIOR & FUNNEL ANALYTICS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
              <div
                className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => toggleSection('behaviorFunnel')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm">
                      <BarChart3 size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Behavior & Funnel Analytics</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Deep behavioral insights and conversion patterns</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    {collapsedSections.behaviorFunnel ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                </div>
              </div>

              {!collapsedSections.behaviorFunnel && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Session Heatmap Summary */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-red-50/40 to-orange-50/40 border border-red-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center shadow-sm">
                          <Monitor size={16} className="text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Student Session Heatmap</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Pages interacted by student</span>
                          <span className="text-sm font-bold text-gray-900">18 pages</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Avg Scroll Depth</span>
                          <span className="text-sm font-bold text-orange-600">72%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Peak Intent Zones</span>
                          <span className="text-sm font-bold text-red-600">SIM, Visa, Banks</span>
                        </div>
                      </div>
                    </div>

                    {/* User Journey Flow */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50/40 to-cyan-50/40 border border-blue-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-sm">
                          <Repeat size={16} className="text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Student Journey Flow</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <ChevronRight size={14} className="text-blue-600" />
                          <span>Dashboard → Services</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <ChevronRight size={14} className="text-blue-600" />
                          <span>Services → SIM Cards</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <ChevronRight size={14} className="text-blue-600" />
                          <span>Provider → Airalo Plus</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                          <CheckCircle size={14} className="text-green-600" />
                          <span>Conversion (3 min session)</span>
                        </div>
                      </div>
                    </div>

                    {/* Funnel Drop-off */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50/40 to-yellow-50/40 border border-amber-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-sm">
                          <TrendingDown size={16} className="text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Student Funnel Progression</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Service Page</span>
                            <span className="text-sm font-bold text-green-600">100%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-400 to-green-500 w-full"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Provider List</span>
                            <span className="text-sm font-bold text-blue-600">68%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 w-[68%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Click-out</span>
                            <span className="text-sm font-bold text-amber-600">35%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 w-[35%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Conversion</span>
                            <span className="text-sm font-bold text-red-600">12%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-400 to-red-500 w-[12%]"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Click & Intent Signals */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50/40 to-pink-50/40 border border-purple-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-sm">
                          <MousePointer size={16} className="text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Click & Intent</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">CTA Clicks</span>
                          <span className="text-sm font-bold text-purple-600">24 clicks</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Repeat Views</span>
                          <span className="text-sm font-bold text-pink-600">7 times</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Hesitation Signals</span>
                          <span className="text-sm font-bold text-amber-600">3 detected</span>
                        </div>
                        <div className="pt-2 border-t border-purple-200/50">
                          <span className="text-xs text-gray-600">Student Intent Score:</span>
                          <span className="ml-2 text-sm font-bold text-green-600">High (84/100)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 5: AI INSIGHTS & PREDICTIONS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
              <div
                className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => toggleSection('aiInsights')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center shadow-sm">
                      <Sparkles size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        AI Insights & Predictions
                        <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded text-xs font-bold">AI</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">Predictions generated from student behavior and comparable cohorts</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    {collapsedSections.aiInsights ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                </div>
              </div>

              {!collapsedSections.aiInsights && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Service Readiness Score */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">Service Readiness</h4>
                      </div>
                      <div className="mb-2">
                        <div className="text-3xl font-bold text-green-600 mb-1">92%</div>
                        <p className="text-xs text-gray-600">Ready for Housing & Employment services</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-green-200/50">
                        <span className="text-xs text-green-700 font-semibold">Confidence: High</span>
                      </div>
                    </div>

                    {/* Provider Match */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-sm">
                          <UserCheck size={14} className="text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">Provider Match</h4>
                      </div>
                      <div className="mb-2">
                        <div className="text-3xl font-bold text-blue-600 mb-1">88%</div>
                        <p className="text-xs text-gray-600">Best match: Wise for banking needs</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-blue-200/50">
                        <span className="text-xs text-blue-700 font-semibold">Confidence: High</span>
                      </div>
                    </div>

                    {/* Drop-off Risk */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                          <AlertCircle size={14} className="text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">Drop-off Risk</h4>
                      </div>
                      <div className="mb-2">
                        <div className="text-3xl font-bold text-amber-600 mb-1">Low</div>
                        <p className="text-xs text-gray-600">Strong engagement pattern detected</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-amber-200/50">
                        <span className="text-xs text-amber-700 font-semibold">Confidence: Medium</span>
                      </div>
                    </div>

                    {/* Next Likely Action */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-sm">
                          <Zap size={14} className="text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">Next Action</h4>
                      </div>
                      <div className="mb-2">
                        <div className="text-sm font-bold text-purple-700 mb-2">Housing Research</div>
                        <p className="text-xs text-gray-600">Likely within next 48 hours</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-purple-200/50">
                        <span className="text-xs text-purple-700 font-semibold">Timeframe: 2 days</span>
                      </div>
                    </div>

                    {/* Recommended Intervention */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center shadow-sm">
                          <Lightbulb size={14} className="text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">Intervention</h4>
                      </div>
                      <div className="mb-2">
                        <div className="text-sm font-bold text-indigo-700 mb-2">Send Housing Guide</div>
                        <p className="text-xs text-gray-600">Proactive outreach recommended</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-indigo-200/50">
                        <span className="text-xs text-indigo-700 font-semibold">Impact: High</span>
                      </div>
                    </div>

                    {/* Conversion Probability */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-sm">
                          <TrendingUp size={14} className="text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">Conv. Probability</h4>
                      </div>
                      <div className="mb-2">
                        <div className="text-3xl font-bold text-teal-600 mb-1">76%</div>
                        <p className="text-xs text-gray-600">For Housing services in next week</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-teal-200/50">
                        <span className="text-xs text-teal-700 font-semibold">Confidence: High</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 6: PARTNER REVENUE & IMPACT */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
              <div
                className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => toggleSection('partnerRevenue')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center shadow-sm">
                      <DollarSign size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        Revenue & Settlement
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">Live (Sample Data)</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">Partner-wise revenue and commission generated from this student</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    {collapsedSections.partnerRevenue ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                </div>
              </div>

              {!collapsedSections.partnerRevenue && (
                <div className="p-6 space-y-6">
                  {/* Student-Level Revenue Summary */}
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50/50 border border-blue-100/50">
                        <div className="text-xs text-gray-600 mb-2">Gross Transaction Value</div>
                        <div className="text-2xl font-bold text-gray-900">$2,680</div>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50/50 border border-emerald-100/50">
                        <div className="text-xs text-gray-600 mb-2">Platform Commission</div>
                        <div className="text-2xl font-bold text-emerald-600">$312</div>
                        <div className="text-xs text-emerald-600 mt-1 font-semibold">11.6%</div>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-100/50">
                        <div className="text-xs text-gray-600 mb-2">Partner Commission</div>
                        <div className="text-2xl font-bold text-gray-900">$2,368</div>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-100/50">
                        <div className="text-xs text-gray-600 mb-2">Refunds / Clawbacks</div>
                        <div className="text-2xl font-bold text-amber-600">$120</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">Revenue generated from this student across all service providers</p>
                  </div>

                  {/* Partner-wise Revenue Breakdown Table */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 size={16} className="text-purple-600" />
                      Partner-wise Revenue Breakdown
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Provider</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Service Category</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Integration Type</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Transactions</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Gross Value</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Platform Commission</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Partner Payout</th>
                            <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Settlement Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* VFS Global */}
                          <tr className="border-b border-gray-50 hover:bg-purple-50/20 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                  VF
                                </div>
                                <div className="font-semibold text-gray-900 text-sm">VFS Global</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">Visas</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-semibold">API</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-semibold text-gray-900 text-sm">2</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-gray-900 text-sm">$1,200</span>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-bold text-emerald-600 text-sm">$96</div>
                                <div className="text-xs text-gray-500">(8%)</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-semibold text-gray-900 text-sm">$1,104</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold border border-green-200">Paid</span>
                            </td>
                          </tr>

                          {/* Airalo Plus */}
                          <tr className="border-b border-gray-50 hover:bg-purple-50/20 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                  AP
                                </div>
                                <div className="font-semibold text-gray-900 text-sm">Airalo Plus</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">SIM Cards</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">Click-out</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-semibold text-gray-900 text-sm">1</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-gray-900 text-sm">$80</span>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-bold text-emerald-600 text-sm">$16</div>
                                <div className="text-xs text-gray-500">(20%)</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-semibold text-gray-900 text-sm">$64</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold border border-amber-200">Pending</span>
                            </td>
                          </tr>

                          {/* Wise USA */}
                          <tr className="border-b border-gray-50 hover:bg-purple-50/20 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                  WU
                                </div>
                                <div className="font-semibold text-gray-900 text-sm">Wise USA</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">Banks</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-semibold">Lead-based</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-semibold text-gray-900 text-sm">1</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-gray-900 text-sm">$1,400</span>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-bold text-emerald-600 text-sm">$200</div>
                                <div className="text-xs text-gray-500">(14%)</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-semibold text-gray-900 text-sm">$1,200</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200">In Review</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Settlement Timeline */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-50/50 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      Settlement Timeline
                    </h4>
                    <div className="space-y-3">
                      {/* Timeline Entry 1 */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 flex-shrink-0 w-32">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs text-gray-600">Feb 12, 2024</span>
                        </div>
                        <div className="flex-1 flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">VFS Global</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">Paid</span>
                        </div>
                        <div className="text-sm font-bold text-emerald-600">$96 commission</div>
                      </div>

                      {/* Timeline Entry 2 */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 flex-shrink-0 w-32">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-xs text-gray-600">Feb 15, 2024</span>
                        </div>
                        <div className="flex-1 flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">Airalo Plus</span>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-semibold">Pending</span>
                        </div>
                        <div className="text-sm font-bold text-emerald-600">$16 commission</div>
                      </div>

                      {/* Timeline Entry 3 */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 flex-shrink-0 w-32">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-xs text-gray-600">Feb 18, 2024</span>
                        </div>
                        <div className="flex-1 flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">Wise USA</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">In Review</span>
                        </div>
                        <div className="text-sm font-bold text-emerald-600">$200 commission</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Insight Footer */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 border border-purple-100/50">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-sm flex-shrink-0">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">Revenue Intelligence</span>
                          <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded text-xs font-bold">AI</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          This student generated higher-than-average revenue from Visa and Banking services.
                          Visa-related conversions contributed 45% of total platform commission.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Add Application Modal */}
      <Dialog open={showAddApplicationModal} onOpenChange={setShowAddApplicationModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add Application</DialogTitle>
            <DialogDescription>
              Add a new university application for this student
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto custom-scrollbar-light max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-2 gap-6 py-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    placeholder="Select University"
                    value={newAppFormData.university}
                    onChange={(val) => setNewAppFormData(prev => ({ ...prev, university: val }))}
                    options={[
                      { value: "", label: "Select University" },
                      { value: "toronto", label: "University of Toronto" },
                      { value: "harvard", label: "Harvard University" },
                      { value: "stanford", label: "Stanford University" },
                      { value: "mit", label: "MIT" },
                      { value: "oxford", label: "Oxford University" }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    placeholder="Select Country"
                    value={newAppFormData.country}
                    onChange={(val) => setNewAppFormData(prev => ({ ...prev, country: val }))}
                    options={[
                      { value: "", label: "Select Country" },
                      { value: "canada", label: "Canada" },
                      { value: "usa", label: "United States" },
                      { value: "uk", label: "United Kingdom" },
                      { value: "australia", label: "Australia" },
                      { value: "germany", label: "Germany" }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    placeholder="Select Course"
                    value={newAppFormData.course}
                    onChange={(val) => setNewAppFormData(prev => ({ ...prev, course: val }))}
                    options={[
                      { value: "", label: "Select Course" },
                      { value: "cs", label: "Computer Science" },
                      { value: "business", label: "Business Administration" },
                      { value: "mech-eng", label: "Mechanical Engineering" },
                      { value: "data-science", label: "Data Science" },
                      { value: "medicine", label: "Medicine" }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intake <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    placeholder="Select Intake"
                    value={newAppFormData.intake}
                    onChange={(val) => setNewAppFormData(prev => ({ ...prev, intake: val }))}
                    options={[
                      { value: "", label: "Select Intake" },
                      { value: "fall-2025", label: "Fall 2025" },
                      { value: "spring-2026", label: "Spring 2026" },
                      { value: "summer-2026", label: "Summer 2026" },
                      { value: "fall-2026", label: "Fall 2026" }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Education
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Bachelor of Engineering"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA / Marks
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 3.8/4.0 or 85%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Scores
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., IELTS 7.5, GRE 320"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Status <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    placeholder="Select Status"
                    value={newAppFormData.status}
                    onChange={(val) => setNewAppFormData(prev => ({ ...prev, status: val }))}
                    options={[
                      { value: "", label: "Select Status" },
                      { value: "draft", label: "Draft" },
                      { value: "submitted", label: "Submitted" },
                      { value: "accepted", label: "Accepted" },
                      { value: "rejected", label: "Rejected" }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer Status <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    placeholder="Select Status"
                    value={newAppFormData.offerStatus}
                    onChange={(val) => setNewAppFormData(prev => ({ ...prev, offerStatus: val }))}
                    options={[
                      { value: "", label: "Select Status" },
                      { value: "na", label: "N/A" },
                      { value: "pending", label: "Pending" },
                      { value: "received", label: "Offer Received" },
                      { value: "accepted", label: "Offer Accepted" }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Counselor <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    placeholder="Select Counselor"
                    value={newAppFormData.counselor}
                    onChange={(val) => setNewAppFormData(prev => ({ ...prev, counselor: val }))}
                    options={[
                      { value: "", label: "Select Counselor" },
                      { value: "sarah", label: "Sarah Johnson" },
                      { value: "mike", label: "Mike Davis" },
                      { value: "emma", label: "Emma Wilson" },
                      { value: "james", label: "James Chen" }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backlogs
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., None or 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Master of Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Artificial Intelligence"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Type
                  </label>
                  <CustomSelect
                    placeholder="Select Type"
                    value={newAppFormData.type}
                    onChange={(val) => setNewAppFormData(prev => ({ ...prev, type: val }))}
                    options={[
                      { value: "Regular", label: "Regular" },
                      { value: "Early Decision", label: "Early Decision" },
                      { value: "Rolling", label: "Rolling" }
                    ]}
                  />
                </div>
              </div>

              {/* Full Width Notes */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={4}
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowAddApplicationModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle save logic here
                setShowAddApplicationModal(false);
              }}
              className="px-4 py-2 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-colors"
            >
              Save Application
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Modal */}
      <Dialog open={showUploadDocumentModal} onOpenChange={setShowUploadDocumentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document for this student
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Drag & Drop Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-500 transition-colors cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold text-purple-600">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, JPG, PNG (max 10MB)
              </p>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter document name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  placeholder="Select Category"
                  value={uploadDocFormData.category}
                  onChange={(val) => setUploadDocFormData(prev => ({ ...prev, category: val }))}
                  options={[
                    { value: "", label: "Select Category" },
                    { value: "academic", label: "Academic" },
                    { value: "financial", label: "Financial" },
                    { value: "visa", label: "Visa" },
                    { value: "other", label: "Other" }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Application
                </label>
                <CustomSelect
                  placeholder="Select Application (Optional)"
                  value={uploadDocFormData.application}
                  onChange={(val) => setUploadDocFormData(prev => ({ ...prev, application: val }))}
                  options={[
                    { value: "", label: "Select Application (Optional)" },
                    { value: "toronto-cs", label: "University of Toronto - Computer Science" },
                    { value: "harvard-business", label: "Harvard University - Business Administration" },
                    { value: "stanford-ds", label: "Stanford University - Data Science" }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <SegmentedControl
                  options={[
                    { value: "student", label: "Student" },
                    { value: "internal", label: "Internal Only" }
                  ]}
                  defaultValue="student"
                  name="visibility"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowUploadDocumentModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle upload logic here
                setShowUploadDocumentModal(false);
              }}
              className="px-4 py-2 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-colors"
            >
              Upload Document
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Drawer */}
      <EditStudentDrawer
        isOpen={showEditDrawer}
        onClose={() => setShowEditDrawer(false)}
        student={student}
        onSave={(updatedStudent: any) => {
          setStudent(updatedStudent);
          // Update derived status if it&apos;s based on account_status
          setStudentStatus(updatedStudent.account_status ? 'Active' : 'Inactive');

          // Create activity record
          if (studentId) {
            createActivity({
              student_db_id: studentId,
              title: 'Student Profile Edited',
              content: 'Updated student profile information via Edit Student Drawer.',
              type: 'Profile'
            }).catch(err => console.error('Failed to create edit activity', err));
          }
        }}
      />

      {/* Service Details Drawer */}
      <ServiceDetailsDrawer
        isOpen={serviceDetailsDrawer.isOpen}
        onClose={() => setServiceDetailsDrawer({ isOpen: false, service: null })}
        service={serviceDetailsDrawer.service || {
          name: '',
          description: '',
          status: '',
          category: '',
        }}
        onUpdateStatus={() => {
          if (serviceDetailsDrawer.service) {
            setUpdateStatusModal({
              isOpen: true,
              serviceName: serviceDetailsDrawer.service.name,
              currentStatus: serviceDetailsDrawer.service.status,
            });
          }
        }}
        onReassignCounselor={() => {
          if (serviceDetailsDrawer.service) {
            setReassignCounselorDrawer({
              isOpen: true,
              serviceName: serviceDetailsDrawer.service.name,
              currentCounselor: {
                name: serviceDetailsDrawer.service.assignedTo || '',
                initials: serviceDetailsDrawer.service.assignedToInitials || '',
                assignedSince: serviceDetailsDrawer.service.startedOn || '',
              },
            });
          }
        }}
        onAddNote={() => {
          if (serviceDetailsDrawer.service) {
            setAddNoteModal({
              isOpen: true,
              serviceName: serviceDetailsDrawer.service.name,
            });
          }
        }}
        onAttachDocuments={() => {
          if (serviceDetailsDrawer.service) {
            setAttachDocumentsDrawer({
              isOpen: true,
              serviceName: serviceDetailsDrawer.service.name,
            });
          }
        }}
      />

      {/* Update Service Status Modal */}
      <UpdateServiceStatusModal
        isOpen={updateStatusModal.isOpen}
        onClose={() => setUpdateStatusModal({ isOpen: false, serviceName: '', currentStatus: '' })}
        serviceName={updateStatusModal.serviceName}
        currentStatus={updateStatusModal.currentStatus}
        onSave={(data: any) => {
          console.log('Status update:', data);
          setUpdateStatusModal({ isOpen: false, serviceName: '', currentStatus: '' });
          setToastMessage('Service status updated.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }}
      />

      {/* Reassign Counselor Drawer */}
      <ReassignCounselorDrawer
        isOpen={reassignCounselorDrawer.isOpen}
        onClose={() => setReassignCounselorDrawer({ isOpen: false, serviceName: '', currentCounselor: null })}
        serviceName={reassignCounselorDrawer.serviceName}
        currentCounselor={reassignCounselorDrawer.currentCounselor}
        onReassign={(data: any) => {
          console.log('Counselor reassignment:', data);
          setReassignCounselorDrawer({ isOpen: false, serviceName: '', currentCounselor: null });
          setToastMessage('Counselor reassigned.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }}
      />

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={addNoteModal.isOpen}
        onClose={() => setAddNoteModal({ isOpen: false, serviceName: '' })}
        serviceName={addNoteModal.serviceName}
        onSave={(data: any) => {
          console.log('Note added:', data);
          setAddNoteModal({ isOpen: false, serviceName: '' });
          setToastMessage('Note added.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }}
      />

      {/* Attach Documents Drawer */}
      <AttachDocumentsDrawer
        isOpen={attachDocumentsDrawer.isOpen}
        onClose={() => setAttachDocumentsDrawer({ isOpen: false, serviceName: '' })}
        serviceName={attachDocumentsDrawer.serviceName}
        onAttach={(data: any) => {
          console.log('Documents attached:', data);
          setAttachDocumentsDrawer({ isOpen: false, serviceName: '' });
          setToastMessage('Documents attached to service.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }}
      />

      {/* Activity Log Drawer */}
      <ActivityLogDrawer
        open={activityLogDrawer.isOpen}
        onClose={() => setActivityLogDrawer({ isOpen: false, serviceName: '' })}
        serviceName={activityLogDrawer.serviceName}
      />

      {/* Set Priority / Flag Modal */}
      <SetPriorityFlagModal
        isOpen={setPriorityModal.isOpen}
        serviceName={setPriorityModal.serviceName}
        currentPriority={servicePriorities[setPriorityModal.serviceId]?.priority}
        currentFlags={servicePriorities[setPriorityModal.serviceId]?.flags}
        onClose={() => setSetPriorityModal({ isOpen: false, serviceName: '', serviceId: 0 })}
        onSave={handleSavePriority}
      />

      {/* Pause Service Modal */}
      <PauseServiceModal
        isOpen={pauseServiceModal.isOpen}
        serviceName={pauseServiceModal.serviceName}
        onClose={() => setPauseServiceModal({ isOpen: false, serviceName: '', serviceId: 0 })}
        onConfirm={handlePauseService}
      />

      {/* Archive Service Modal */}
      <ArchiveServiceModal
        isOpen={archiveServiceModal.isOpen}
        serviceName={archiveServiceModal.serviceName}
        onClose={() => setArchiveServiceModal({ isOpen: false, serviceName: '', serviceId: 0 })}
        onConfirm={handleArchiveService}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        isOpen={serviceDetailModal.isOpen}
        onClose={() => setServiceDetailModal({ isOpen: false, service: null })}
        service={serviceDetailModal.service || {}}
        studentName="Michael Chen"
        onSave={(data) => {
          console.log('Service data saved:', data);
          setToastMessage('Service details updated successfully.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }}
      />

      {/* Application Detail Modal */}
      {applicationDetailModal.isOpen && applicationDetailModal.application && (
        <ApplicationDetailModal
          isOpen={applicationDetailModal.isOpen}
          application={applicationDetailModal.application}
          onClose={() => setApplicationDetailModal({ isOpen: false, application: null })}
          onEdit={() => {
            setEditApplicationModal({
              isOpen: true,
              application: applicationDetailModal.application,
            });
          }}
        />
      )}

      {/* Edit Application Modal */}
      {editApplicationModal.isOpen && editApplicationModal.application && (
        <EditApplicationModal
          isOpen={editApplicationModal.isOpen}
          application={editApplicationModal.application}
          onClose={() => setEditApplicationModal({ isOpen: false, application: null })}
          onSave={(data: any) => {
            console.log('Saving application:', data);
            // Handle save logic here
          }}
        />
      )}

      {/* Update Application Status Modal */}
      <UpdateApplicationStatusModal
        isOpen={updateApplicationStatusModal.isOpen}
        applicationName={updateApplicationStatusModal.applicationName}
        currentStatus={updateApplicationStatusModal.currentStatus}
        onClose={() => setUpdateApplicationStatusModal({ isOpen: false, applicationName: '', currentStatus: '' })}
        onSave={(data: any) => {
          console.log('Status updated:', data);
          setUpdateApplicationStatusModal({ isOpen: false, applicationName: '', currentStatus: '' });
          setToastMessage('Application status updated successfully!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }}
      />

      {/* Upload Application Documents Drawer */}
      {uploadApplicationDocumentsDrawer.isOpen && (
        <UploadApplicationDocumentsDrawer
          isOpen={uploadApplicationDocumentsDrawer.isOpen}
          applicationName={uploadApplicationDocumentsDrawer.applicationName}
          onClose={() => setUploadApplicationDocumentsDrawer({ isOpen: false, applicationName: '' })}
        />
      )}

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={showUploadDocumentModal}
        onClose={() => setShowUploadDocumentModal(false)}
        onUpload={(newDoc: any) => {
          setDocuments(prev => [newDoc, ...prev]);
          setToastMessage('Document uploaded successfully!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }}
      />

      {/* Document Detail Modal */}
      {documentDetailModal.isOpen && documentDetailModal.document && (
        <DocumentDetailModal
          isOpen={documentDetailModal.isOpen}
          document={documentDetailModal.document}
          onClose={() => setDocumentDetailModal({ isOpen: false, document: null })}
          onDownload={() => {
            console.log('Downloading:', documentDetailModal.document?.name);
            setToastMessage(`Downloading ${documentDetailModal.document?.name}...`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }}
          onEdit={() => {
            setEditDocumentModal({
              isOpen: true,
              document: documentDetailModal.document,
            });
          }}
          onReplace={() => {
            setReplaceDocumentModal({
              isOpen: true,
              documentName: documentDetailModal.document?.name || '',
              currentFile: {
                name: documentDetailModal.document?.name || '',
                size: documentDetailModal.document?.fileSize || '',
                uploadedDate: documentDetailModal.document?.uploadedDate || '',
                fileType: documentDetailModal.document?.fileType || '',
                fileUrl: documentDetailModal.document?.fileUrl || '',
                category: documentDetailModal.document?.category || '',
              },
            });
          }}
          userRole={userRole}
        />
      )}

      {/* Edit Document Modal */}
      {editDocumentModal.isOpen && editDocumentModal.document && (
        <EditDocumentModal
          isOpen={editDocumentModal.isOpen}
          document={editDocumentModal.document}
          onClose={() => setEditDocumentModal({ isOpen: false, document: null })}
          onSave={(data: any) => {
            setDocuments(prev => prev.map(doc => doc.id === data.id ? data : doc));
            setEditDocumentModal({ isOpen: false, document: null });
            setToastMessage('Document updated successfully!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }}
        />
      )}

      {/* Replace Document Modal */}
      {replaceDocumentModal.isOpen && replaceDocumentModal.currentFile && (
        <ReplaceDocumentModal
          isOpen={replaceDocumentModal.isOpen}
          documentName={replaceDocumentModal.documentName}
          currentFile={replaceDocumentModal.currentFile}
          onClose={() => setReplaceDocumentModal({ isOpen: false, documentName: '', currentFile: null })}
          onConfirm={(file: any) => {
            setDocuments(prev => prev.map(doc =>
              doc.name === replaceDocumentModal.documentName
                ? { ...doc, uploadedDate: format(new Date(), 'MMM dd, yyyy'), status: 'Uploaded' }
                : doc
            ));
            setReplaceDocumentModal({ isOpen: false, documentName: '', currentFile: null });
            setDocumentDetailModal({ isOpen: false, document: null });
            setToastMessage('Document replaced successfully!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }}
        />
      )}

      {/* Payment Detail Modal */}
      {paymentDetailModal.isOpen && paymentDetailModal.payment && (
        <PaymentDetailModal
          isOpen={paymentDetailModal.isOpen}
          payment={paymentDetailModal.payment}
          onClose={() => setPaymentDetailModal({ isOpen: false, payment: null })}
          onDownloadReceipt={() => {
            console.log('Downloading receipt:', paymentDetailModal.payment?.receiptNumber);
            setToastMessage(`Downloading receipt for ${paymentDetailModal.payment?.invoiceId}...`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }}
          onDownloadInvoice={() => {
            console.log('Downloading invoice:', paymentDetailModal.payment?.invoiceId);
            setToastMessage(`Downloading invoice ${paymentDetailModal.payment?.invoiceId}...`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }}
          onEdit={() => {
            setEditPaymentModal({
              isOpen: true,
              payment: paymentDetailModal.payment,
            });
          }}
          userRole={userRole}
        />
      )}

      {/* Edit Payment Modal */}
      {editPaymentModal.isOpen && editPaymentModal.payment && (
        <EditPaymentModal
          isOpen={editPaymentModal.isOpen}
          payment={editPaymentModal.payment}
          onClose={() => setEditPaymentModal({ isOpen: false, payment: null })}
          onSave={(data: any) => {
            console.log('Saving payment:', data);
            setEditPaymentModal({ isOpen: false, payment: null });
            setPaymentDetailModal({ isOpen: false, payment: null });
            setToastMessage('Payment updated successfully!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }}
        />
      )}

      {/* Data Policy Modal */}
      <DataPolicyModal
        isOpen={dataPolicyModalOpen}
        onClose={() => setDataPolicyModalOpen(false)}
      />

      {/* Change Status Modal */}
      <ChangeStatusModal
        isOpen={changeStatusModalOpen}
        currentStatus={studentStatus}
        studentName={student ? `${student.first_name} ${student.last_name}` : 'Student'}
        onClose={() => setChangeStatusModalOpen(false)}
        onSave={handleChangeStatus}
      />

      {/* Change Counselor Modal */}
      <ChangeCounselorModal
        open={changeCounselorModalOpen}
        currentCounselor={studentCounselor}
        studentName={student ? `${student.first_name} ${student.last_name}` : 'Student'}
        onOpenChange={setChangeCounselorModalOpen}
        onSave={handleChangeCounselor}
      />

      {/* Audit Log Modal */}
      <AuditLogModal
        isOpen={auditLogModalOpen}
        studentId={studentId}
        studentName={student ? `${student.first_name} ${student.last_name}` : 'Student'}
        onClose={() => setAuditLogModalOpen(false)}
      />

      {/* Archive Student Modal */}
      <ArchiveStudentModal
        open={archiveStudentModalOpen}
        studentName={student ? `${student.first_name} ${student.last_name}` : 'Student'}
        onOpenChange={setArchiveStudentModalOpen}
        onConfirm={handleArchiveStudent}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
