import React, { useState } from 'react';
import {
  Save,
  Eye,
  EyeOff,
  GripVertical,
  Plus,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
  ChevronRight,
  Settings,
  Layout,
  Image as ImageIcon,
  Grid3x3,
  Megaphone,
  ShoppingCart,
  MessageSquare,
  Menu,
  User,
  ArrowLeft,
  Sparkles,
  Star,
  Copy,
  Trash2,
  MoreVertical,
  Shield,
  Images,
  Quote,
  Video,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Box,
  Maximize2,
  Move,
  ZoomIn,
  Code,
  MousePointer,
  RotateCcw,
  Lock,
  Unlock,
  Layers,
  Circle,
  BarChart3,
  Minus,
  AlertCircle,
  Clock,
  CheckCircle,
  X,
  ExternalLink,
  FileText,
  Calendar,
  Users,
  Crown,
  Bell,
  LogOut,
  Mail,
  ChevronUp,
  History,
  Edit3,
  PlusCircle,
  Upload,
  Download,
  SkipBack,
  WifiOff,
  Wifi,
  Command,
  Search,
  Keyboard,
  Puzzle,
  Zap,
  TrendingUp,
  CreditCard,
  Database,
  Brain,
  ExternalLink as ExternalLinkIcon,
  Power,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { toast } from 'sonner';

// Import extracted components
import { BlockToolbar } from './website-builder/BlockToolbar';
import { BlockContent } from './website-builder/BlockContent';
import { AddBlockPanel } from './website-builder/AddBlockPanel';
import {
  SectionRow,
  SectionPreviewWithBlocks,
  StaticSectionPreview,
  AddSectionModal,
  DeleteSectionModal,
  DeleteBlockModal
} from './website-builder/SectionComponents';
import {
  Section,
  Block,
  BlockType,
  SectionType,
  TeamMember,
  ActivityItem,
  PageVersion,
  VersionChange,
  PublishEvent,
  PageLock,
  UserRole,
  UserStatus,
  ActivityAction,
  VersionStatus
} from './website-builder/types';

// PART 6: Import Presets & Defaults UI Components
import { EnhancedPresetsTab } from './website-builder/EnhancedPresetsTab';
import {
  ResetToDefaultsModal,
  ExitWithChangesModal
} from './website-builder/PresetModals';
import {
  DefaultsInfoCallout,
  FieldChangeIndicator,
  SectionChangesBadge,
  PresetOverrideWarning
} from './website-builder/ThemeUIHelpers';

// PART 7: Import Enhanced Publishing & Environment Components
import {
  EnhancedEnvironmentBadge,
  EnhancedDraftModeBanner,
  EnhancedPreviewModeBar,
  EnhancedPublishConfirmationModal,
  EnhancedVersionHistoryPanel,
  EnhancedUnsavedChangesWarning
} from './website-builder/Part7EnhancedPublishing';
import {
  UnpublishedChangeDot,
  ModifiedSectionIndicator,
  ModifiedThemeIndicator
} from './website-builder/UnpublishedChangeIndicators';

// PART 8: Import Collaboration & Access Control Components
import {
  RoleBadge,
  LockedSectionIndicator,
  ActiveEditorBanner,
  EditConflictWarning,
  LockedPageBanner,
  ReadOnlyModeOverlay,
  PermissionTooltip,
  EnhancedTeamModal,
  VersionHistoryEntryWithRole,
  RoleBasedPublishButton,
  ViewerRoleBanner
} from './website-builder/Part8CollaborationUI';

// PART 9: Import Activity & History - Audit-Ready Components
import {
  ActivityPanel,
  PageHistoryPanel,
  VersionDetailModal,
  RestoreVersionModal
} from './website-builder/Part9ActivityHistoryUI';

// PART 10: Import System Feedback & Visual State Management Components
import {
  EnhancedSystemHealthIndicator,
  SaveFailedBanner,
  EnhancedBlockingErrorBanner,
  InlineWarning,
  EnhancedPreviewModeBanner,
  PublishReadinessChecklist,
  EnhancedOfflineBanner,
  PanelLoadingSkeleton,
  ActivityLoadingSkeleton,
  HistoryLoadingSkeleton,
  AutoSaveIndicator,
  PublishReadinessCheck
} from './website-builder/Part10FeedbackSystem';

// ============================================
// LOCAL CONSTANTS
// ============================================

// Available block types
const blockTypes: BlockType[] = [
  { id: 'heading', type: 'heading', name: 'Heading', icon: Type, description: 'Add a heading text' },
  { id: 'text', type: 'text', name: 'Text', icon: AlignLeft, description: 'Add a paragraph' },
  { id: 'image', type: 'image', name: 'Image', icon: ImageIcon, description: 'Add an image' },
  { id: 'button', type: 'button', name: 'Button', icon: MousePointer, description: 'Add a button' },
  { id: 'icon', type: 'icon', name: 'Icon', icon: Circle, description: 'Add an icon' },
  { id: 'list', type: 'list', name: 'List', icon: Layers, description: 'Add a list' },
  { id: 'card', type: 'card', name: 'Card', icon: Box, description: 'Add a card' },
  { id: 'stat', type: 'stat', name: 'Stat', icon: BarChart3, description: 'Add a statistic' },
  { id: 'divider', type: 'divider', name: 'Divider', icon: Minus, description: 'Add a divider line' },
];

const sectionTypes: SectionType[] = [
  { id: 'hero', type: 'hero', name: 'Hero', icon: Sparkles, description: 'Large banner with image and CTA' },
  { id: 'category-grid', type: 'category-grid', name: 'Category Grid', icon: Grid3x3, description: 'Display categories in grid layout' },
  { id: 'banner', type: 'banner', name: 'Banner', icon: ImageIcon, description: 'Promotional banner section' },
  { id: 'product-grid', type: 'product-grid', name: 'Product Grid', icon: ShoppingCart, description: 'Display products in grid' },
  { id: 'testimonial', type: 'testimonial', name: 'Testimonial', icon: Quote, description: 'Customer reviews and testimonials' },
  { id: 'custom', type: 'custom', name: 'Custom Section', icon: Layout, description: 'Build your own section' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const WebsiteBuilderEditor: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  // ============================================
  // PUBLISHING & ENVIRONMENT STATE
  // ============================================
  const [environment, setEnvironment] = useState<'draft' | 'preview' | 'live'>('draft');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [lastPublished, setLastPublished] = useState<Date>(new Date(Date.now() - 2 * 60 * 60 * 1000)); // 2 hours ago

  // PART 7: Track which sections have unpublished changes (visual only, for demo)
  const [sectionsWithChanges, setSectionsWithChanges] = useState<string[]>(['hero', 'categories']);

  // ============================================
  // COLLABORATION & ACCESS STATE
  // ============================================
  const [currentUser, setCurrentUser] = useState<TeamMember>({
    id: '1',
    name: 'Admin User',
    email: 'admin@studyvisa.com',
    role: 'admin', // Changed from 'owner' to 'admin' to demo role restrictions
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  });

  // PART 8: Team members for demo
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@studyvisa.com',
      role: 'admin',
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah@studyvisa.com',
      role: 'owner',
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    {
      id: '3',
      name: 'John Smith',
      email: 'john@studyvisa.com',
      role: 'editor',
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@studyvisa.com',
      role: 'viewer',
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
    },
    {
      id: '5',
      name: 'Mike Johnson',
      email: 'mike@studyvisa.com',
      role: 'editor',
      status: 'pending',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
    }
  ]);

  // PART 8: Locked sections (visual only, for demo)
  const [lockedSections] = useState<Record<string, TeamMember>>({
    'testimonials': {
      id: '3',
      name: 'John Smith',
      email: 'john@studyvisa.com',
      role: 'editor',
      status: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    }
  });

  // PART 8: Edit conflict warning state
  const [showEditConflict, setShowEditConflict] = useState(false);
  const [conflictSection, setConflictSection] = useState<string | null>(null);
  const [showTeamSettings, setShowTeamSettings] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showActivityPanel, setShowActivityPanel] = useState(false);
  const [showLockedPageModal, setShowLockedPageModal] = useState(false);
  const [lockedBy, setLockedBy] = useState<string | null>(null);

  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<{ sectionId: string; blockId: string } | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [hoveredCanvasSection, setHoveredCanvasSection] = useState<string | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<{ sectionId: string; blockId: string } | null>(null);
  const [showAddSectionInline, setShowAddSectionInline] = useState<string | null>(null);
  const [showAddBlockPanel, setShowAddBlockPanel] = useState<{ sectionId: string; position: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'layout' | 'style' | 'advanced'>('content');
  const [themeSettingsMode, setThemeSettingsMode] = useState<boolean>(false);
  const [themeTab, setThemeTab] = useState<'colors' | 'typography' | 'buttons' | 'forms' | 'layout' | 'advanced' | 'presets'>('colors');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    header: true,
    content: true,
    footer: true
  });

  // CRUD UI State
  const [showAddSectionModal, setShowAddSectionModal] = useState<{ position: string | number } | null>(null);
  const [showDeleteSectionModal, setShowDeleteSectionModal] = useState<string | null>(null);
  const [showDeleteBlockModal, setShowDeleteBlockModal] = useState<{ sectionId: string; blockId: string } | null>(null);
  const [showSectionMoreMenu, setShowSectionMoreMenu] = useState<string | null>(null);

  // PART 8: Team & Collaboration Modals
  const [showTeamModal, setShowTeamModal] = useState(false);

  // ============================================
  // PART 6: PRESETS & DEFAULTS UI STATE
  // ============================================
  const [showResetToDefaultsModal, setShowResetToDefaultsModal] = useState<{ section: string } | null>(null);
  const [showExitWithChangesModal, setShowExitWithChangesModal] = useState(false);
  const [appliedPresetId, setAppliedPresetId] = useState<string>('1'); // Default preset
  const [presetModified, setPresetModified] = useState(false);
  const [modifiedFields, setModifiedFields] = useState<Record<string, boolean>>({});
  const [sectionChanges, setSectionChanges] = useState<Record<string, boolean>>({});

  // Mock sections data with blocks
  const [sections, setSections] = useState<Section[]>([
    {
      id: 'header',
      type: 'header',
      name: 'Header',
      icon: Menu,
      isRequired: true,
      isVisible: true,
      group: 'header',
      blocks: [
        { id: 'h-logo', type: 'text', name: 'Logo', icon: Type, isVisible: true, content: { text: 'Study Visa Platform' } },
        { id: 'h-nav', type: 'list', name: 'Navigation', icon: Layers, isVisible: true, content: { items: ['Home', 'Services', 'Countries', 'Contact'] } }
      ]
    },
    {
      id: 'hero',
      type: 'hero',
      name: 'Hero Banner',
      icon: Sparkles,
      isRequired: false,
      isVisible: true,
      group: 'content',
      blocks: [
        { id: 'hero-h1', type: 'heading', name: 'Main Heading', icon: Type, isVisible: true, content: { text: 'Your Study Abroad Journey Starts Here' } },
        { id: 'hero-p', type: 'text', name: 'Description', icon: AlignLeft, isVisible: true, content: { text: 'Expert visa assistance for students worldwide' } },
        { id: 'hero-btn', type: 'button', name: 'CTA Button', icon: MousePointer, isVisible: true, content: { text: 'Get Started', link: '#' } }
      ]
    },
    {
      id: 'categories',
      type: 'category-grid',
      name: 'Category Grid',
      icon: Grid3x3,
      isRequired: false,
      isVisible: true,
      group: 'content',
      blocks: [
        { id: 'cat-h2', type: 'heading', name: 'Section Heading', icon: Type, isVisible: true, content: { text: 'Popular Destinations' } },
      ]
    },
    {
      id: 'promo',
      type: 'banner',
      name: 'Promotional Banner',
      icon: Megaphone,
      isRequired: false,
      isVisible: true,
      group: 'content',
      blocks: [
        { id: 'promo-text', type: 'text', name: 'Banner Text', icon: AlignLeft, isVisible: true, content: { text: '🎉 Special Offer: Free Consultation for New Students!' } }
      ]
    },
    {
      id: 'products',
      type: 'product-grid',
      name: 'Featured Services',
      icon: ShoppingCart,
      isRequired: false,
      isVisible: false,
      group: 'content',
      blocks: []
    },
    {
      id: 'testimonials',
      type: 'testimonial',
      name: 'Testimonials',
      icon: MessageSquare,
      isRequired: false,
      isVisible: true,
      group: 'content',
      blocks: [
        { id: 'test-h2', type: 'heading', name: 'Section Heading', icon: Type, isVisible: true, content: { text: 'What Students Say' } }
      ]
    },
    {
      id: 'footer',
      type: 'footer',
      name: 'Footer',
      icon: Layout,
      isRequired: true,
      isVisible: true,
      group: 'footer',
      blocks: []
    },
  ]);

  // ============================================
  // ACTIVITY & HISTORY STATE
  // ============================================
  const [showPageHistory, setShowPageHistory] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<PageVersion | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [activityFilter, setActivityFilter] = useState<'all' | 'created' | 'updated' | 'deleted' | 'published'>('all');

  // PART 9: Human-Readable Activity Data
  const [activities] = useState<ActivityItem[]>([
    {
      id: '1',
      user: 'Admin User',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      action: 'content_updated',
      actionLabel: 'updated content',
      target: 'Hero section',
      targetType: 'section',
      page: 'Home',
      timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 min ago
    },
    {
      id: '2',
      user: 'John Smith (Editor)',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      action: 'content_updated',
      actionLabel: 'changed button color',
      target: 'Header section',
      targetType: 'section',
      page: 'Home',
      timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 min ago
    },
    {
      id: '3',
      user: 'Sarah Chen (Admin)',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      action: 'page_published',
      actionLabel: 'published page',
      target: 'Home page',
      targetType: 'page',
      page: 'Home',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '4',
      user: 'Admin User',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      action: 'theme_changed',
      actionLabel: 'changed theme typography',
      target: 'Typography settings',
      targetType: 'theme',
      page: 'Home',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    },
    {
      id: '5',
      user: 'Mike Johnson (Owner)',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      action: 'app_connected',
      actionLabel: 'connected app',
      target: 'Google Analytics',
      targetType: 'app',
      page: 'Home',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
    },
    {
      id: '6',
      user: 'Sarah Chen (Admin)',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      action: 'theme_changed',
      actionLabel: 'changed theme colors',
      target: 'Primary color to purple',
      targetType: 'theme',
      page: 'Home',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: '7',
      user: 'John Smith (Editor)',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      action: 'content_updated',
      actionLabel: 'updated content',
      target: 'Testimonials section',
      targetType: 'section',
      page: 'Home',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
  ]);

  // Mock Page Version History
  const [pageVersions] = useState<PageVersion[]>([
    {
      id: 'v13',
      versionNumber: 13,
      summary: 'Updated Hero section layout',
      editorName: 'Admin User',
      editorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'draft',
      changes: [
        { type: 'modified', target: 'Hero section', sectionName: 'Hero Banner' }
      ]
    },
    {
      id: 'v12',
      versionNumber: 12,
      summary: 'Published website changes',
      editorName: 'Sarah Chen',
      editorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'published',
      changes: [
        { type: 'modified', target: 'Multiple sections', sectionName: 'Various' }
      ]
    },
    {
      id: 'v11',
      versionNumber: 11,
      summary: 'Added Promotional Banner',
      editorName: 'Admin User',
      editorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: 'draft',
      changes: [
        { type: 'added', target: 'Promotional Banner', sectionName: 'Promotional Banner' }
      ]
    },
    {
      id: 'v10',
      versionNumber: 10,
      summary: 'Updated testimonials layout',
      editorName: 'Mike Johnson',
      editorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'archived',
      changes: [
        { type: 'modified', target: 'Testimonials section', sectionName: 'Testimonials' }
      ]
    },
    {
      id: 'v9',
      versionNumber: 9,
      summary: 'Initial page structure',
      editorName: 'Sarah Chen',
      editorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'archived',
      changes: [
        { type: 'added', target: 'Header, Hero, Footer', sectionName: 'Multiple' }
      ]
    },
  ]);

  // Mock Publishing Events
  const [publishEvents] = useState<PublishEvent[]>([
    {
      id: 'p1',
      publishedBy: 'Sarah Chen',
      publishedByAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      page: 'Home',
      versionId: 'v12',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'p2',
      publishedBy: 'Admin User',
      publishedByAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      page: 'Home',
      versionId: 'v8',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
  ]);

  // ============================================
  // PERFORMANCE & FEEDBACK STATE
  // ============================================
  const [systemHealth, setSystemHealth] = useState<'operational' | 'saving' | 'warning' | 'offline'>('operational');
  const [isOffline, setIsOffline] = useState(false);
  const [saveRetryCount, setSaveRetryCount] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState<Date>(new Date());
  const [showBlockingError, setShowBlockingError] = useState(false);
  const [blockingErrorMessage, setBlockingErrorMessage] = useState('');
  const [showNonBlockingError, setShowNonBlockingError] = useState(false);
  const [nonBlockingErrorMessage, setNonBlockingErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning'>('success');
  const [showDestructiveModal, setShowDestructiveModal] = useState(false);
  const [destructiveAction, setDestructiveAction] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // PART 10: Enhanced Feedback State
  const [showPublishReadiness, setShowPublishReadiness] = useState(false);
  const [blockingErrorTitle, setBlockingErrorTitle] = useState('');
  const [blockingErrorAction, setBlockingErrorAction] = useState<{ label: string; action: () => void } | null>(null);
  const [showSaveFailed, setShowSaveFailed] = useState(false);
  const [showActivityLoading, setShowActivityLoading] = useState(false);
  const [showHistoryLoading, setShowHistoryLoading] = useState(false);

  // ============================================
  // ACCESSIBILITY STATE
  // ============================================
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState('');

  // ============================================
  // APPS & INTEGRATIONS STATE
  // ============================================
  const [showAppsPanel, setShowAppsPanel] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [showUninstallModal, setShowUninstallModal] = useState(false);
  const [appToUninstall, setAppToUninstall] = useState<any>(null);

  // Mock installed apps data
  const [installedApps, setInstalledApps] = useState([
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track visitor behavior and site performance with detailed analytics',
      icon: '📊',
      category: 'analytics',
      status: 'active',
      installedDate: '2024-01-15',
      permissions: ['Read page content', 'Track visitor events', 'Access site settings'],
      hasConfig: true
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Connect your email marketing campaigns and subscriber forms',
      icon: '📧',
      category: 'marketing',
      status: 'active',
      installedDate: '2024-01-10',
      permissions: ['Manage forms', 'Sync subscribers', 'Send emails'],
      hasConfig: true
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      description: 'Accept payments and manage transactions securely',
      icon: '💳',
      category: 'payments',
      status: 'disconnected',
      installedDate: '2023-12-20',
      permissions: ['Process payments', 'Access customer data', 'Manage transactions'],
      hasConfig: true
    }
  ]);

  // Keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + K: Open Command Palette
      if (modKey && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
        announceToScreenReader('Command palette opened');
      }

      // Cmd/Ctrl + S: Manual Save
      if (modKey && e.key === 's') {
        e.preventDefault();
        triggerAutoSave();
        announceToScreenReader('Saving changes');
      }

      // Cmd/Ctrl + /: Show Keyboard Shortcuts
      if (modKey && e.key === '/') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
        announceToScreenReader('Keyboard shortcuts panel opened');
      }

      // Escape: Close modals/panels
      if (e.key === 'Escape') {
        if (showCommandPalette) {
          setShowCommandPalette(false);
          announceToScreenReader('Command palette closed');
        } else if (showKeyboardShortcuts) {
          setShowKeyboardShortcuts(false);
          announceToScreenReader('Keyboard shortcuts panel closed');
        } else if (showPublishModal) {
          setShowPublishModal(false);
          announceToScreenReader('Publish modal closed');
        } else if (showVersionHistory) {
          setShowVersionHistory(false);
          announceToScreenReader('Version history closed');
        } else if (showTeamSettings) {
          setShowTeamSettings(false);
          announceToScreenReader('Team settings closed');
        } else if (showActivityPanel) {
          setShowActivityPanel(false);
          announceToScreenReader('Activity panel closed');
        } else if (showPageHistory) {
          setShowPageHistory(false);
          announceToScreenReader('Page history closed');
        } else if (showAppsPanel) {
          setShowAppsPanel(false);
          setSelectedApp(null);
          announceToScreenReader('Apps panel closed');
        } else if (showAddSectionModal) {
          setShowAddSectionModal(null);
          announceToScreenReader('Add section modal closed');
        } else if (showDeleteSectionModal) {
          setShowDeleteSectionModal(null);
          announceToScreenReader('Delete section modal closed');
        } else if (showDeleteBlockModal) {
          setShowDeleteBlockModal(null);
          announceToScreenReader('Delete block modal closed');
        } else if (showAddBlockPanel) {
          setShowAddBlockPanel(null);
          announceToScreenReader('Add block panel closed');
        } else if (showSectionMoreMenu) {
          setShowSectionMoreMenu(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette, showKeyboardShortcuts, showPublishModal, showVersionHistory, showTeamSettings, showActivityPanel, showPageHistory, showAppsPanel, showAddSectionModal, showDeleteSectionModal, showDeleteBlockModal, showAddBlockPanel, showSectionMoreMenu]);

  // Screen reader announcement helper
  const announceToScreenReader = (message: string) => {
    setAnnounceMessage(message);
    setTimeout(() => setAnnounceMessage(''), 100);
  };

  // Detect user's motion preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Simulate auto-save with retry logic
  const triggerAutoSave = () => {
    setAutoSaveStatus('saving');
    setSystemHealth('saving');

    // Simulate save delay
    setTimeout(() => {
      // 90% success rate
      if (Math.random() > 0.1) {
        setAutoSaveStatus('saved');
        setSystemHealth('operational');
        setLastSaveTime(new Date());
        setSaveRetryCount(0);
      } else {
        // Simulate failure with retry
        setSaveRetryCount(prev => prev + 1);
        if (saveRetryCount < 3) {
          // Auto-retry silently
          setTimeout(() => triggerAutoSave(), 2000);
        } else {
          setAutoSaveStatus('error');
          setSystemHealth('warning');
          setShowSaveFailed(true);
          setShowNonBlockingError(false);
        }
      }
    }, 800);
  };

  // Show toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Simulate offline detection
  const simulateOffline = () => {
    setIsOffline(true);
    setSystemHealth('offline');
    showToast('You\'re offline. Changes will sync when you\'re back online.', 'warning');
  };

  const simulateOnline = () => {
    setIsOffline(false);
    setSystemHealth('operational');
    showToast('Back online! Syncing changes...', 'success');
  };

  // Group sections by type
  const groupedSections = {
    header: sections.filter(s => s.group === 'header'),
    content: sections.filter(s => s.group === 'content'),
    footer: sections.filter(s => s.group === 'footer')
  };

  const toggleSectionVisibility = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s));
  };

  const toggleGroupExpansion = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const handleBlockSelect = (sectionId: string, blockId: string) => {
    setSelectedBlock({ sectionId, blockId });
    setSelectedSection(null); // Deselect section when block is selected
    setActiveTab('content'); // Switch to content tab for blocks
  };

  const handleSectionSelect = (sectionId: string) => {
    // PART 8: Check if section is locked
    if (lockedSections[sectionId]) {
      setConflictSection(sectionId);
      setShowEditConflict(true);
      return;
    }

    setSelectedSection(sectionId);
    setSelectedBlock(null); // Deselect block when section is selected
    setActiveTab('content');
  };

  const getDeviceWidth = () => {
    switch (deviceMode) {
      case 'tablet': return '768px';
      case 'mobile': return '375px';
      default: return '100%';
    }
  };

  // Get selected section object
  const selectedSectionObj = selectedSection ? sections.find(s => s.id === selectedSection) : null;

  // Get selected block object
  const selectedBlockObj = selectedBlock
    ? sections.find(s => s.id === selectedBlock.sectionId)?.blocks.find(b => b.id === selectedBlock.blockId)
    : null;

  // ============================================
  // SECTION CRUD HANDLERS
  // ============================================

  const handleAddSection = (sectionType: string, position: string | number) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type: sectionType,
      name: sectionType === 'custom' ? 'Custom Section' : sectionTypes.find(t => t.type === sectionType)?.name || 'New Section',
      icon: sectionTypes.find(t => t.type === sectionType)?.icon || Layout,
      isRequired: false,
      isVisible: true,
      group: 'content',
      blocks: []
    };

    setSections(prev => {
      if (position === 'bottom' || position === -1) {
        return [...prev, newSection];
      } else {
        // Find index to insert at
        const targetIndex = prev.findIndex(s => s.id === position);
        if (targetIndex === -1) return [...prev, newSection];
        const newSections = [...prev];
        newSections.splice(targetIndex, 0, newSection);
        return newSections;
      }
    });

    setSelectedSection(newSection.id);
    setSelectedBlock(null);
    setShowAddSectionModal(null);
    showToast('Section added', 'success');
    announceToScreenReader('Section added');
  };

  const handleDuplicateSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const duplicatedSection: Section = {
      ...section,
      id: `section-${Date.now()}`,
      name: `${section.name} (Copy)`,
      blocks: section.blocks.map(block => ({
        ...block,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    };

    setSections(prev => {
      const index = prev.findIndex(s => s.id === sectionId);
      const newSections = [...prev];
      newSections.splice(index + 1, 0, duplicatedSection);
      return newSections;
    });

    setSelectedSection(duplicatedSection.id);
    showToast('Section duplicated', 'success');
    announceToScreenReader('Section duplicated');
  };

  const handleDeleteSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    // Don't allow deleting if it&apos;s the only section
    if (sections.length === 1) {
      showToast('At least one section is required', 'warning');
      return;
    }

    setSections(prev => prev.filter(s => s.id !== sectionId));

    if (selectedSection === sectionId) {
      const remainingSections = sections.filter(s => s.id !== sectionId);
      setSelectedSection(remainingSections[0]?.id || null);
    }

    setShowDeleteSectionModal(null);
    setShowSectionMoreMenu(null);
    showToast('Section deleted', 'success');
    announceToScreenReader('Section deleted');
  };

  const handleToggleSectionVisibility = (sectionId: string) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
    ));

    const section = sections.find(s => s.id === sectionId);
    const newState = !section?.isVisible;
    showToast(newState ? 'Section shown' : 'Section hidden', 'info');
    announceToScreenReader(newState ? 'Section shown' : 'Section hidden');
  };

  // ============================================
  // BLOCK CRUD HANDLERS
  // ============================================

  const handleAddBlock = (sectionId: string, blockType: string, position: number) => {
    const blockTypeInfo = blockTypes.find(bt => bt.type === blockType);
    if (!blockTypeInfo) return;

    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      name: blockTypeInfo.name,
      icon: blockTypeInfo.icon,
      isVisible: true,
      content: getDefaultBlockContent(blockType)
    };

    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newBlocks = [...section.blocks];
        newBlocks.splice(position, 0, newBlock);
        return { ...section, blocks: newBlocks };
      }
      return section;
    }));

    setSelectedBlock({ sectionId, blockId: newBlock.id });
    setSelectedSection(null);
    setShowAddBlockPanel(null);
    showToast('Block added', 'success');
    announceToScreenReader('Block added');
  };

  const handleDuplicateBlock = (sectionId: string, blockId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const block = section?.blocks.find(b => b.id === blockId);
    if (!block) return;

    const duplicatedBlock: Block = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        const blockIndex = s.blocks.findIndex(b => b.id === blockId);
        const newBlocks = [...s.blocks];
        newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
        return { ...s, blocks: newBlocks };
      }
      return s;
    }));

    setSelectedBlock({ sectionId, blockId: duplicatedBlock.id });
    showToast('Block duplicated', 'success');
    announceToScreenReader('Block duplicated');
  };

  const handleDeleteBlock = (sectionId: string, blockId: string) => {
    setSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return { ...s, blocks: s.blocks.filter(b => b.id !== blockId) };
      }
      return s;
    }));

    if (selectedBlock?.blockId === blockId) {
      const section = sections.find(s => s.id === sectionId);
      const remainingBlocks = section?.blocks.filter(b => b.id !== blockId) || [];
      if (remainingBlocks.length > 0) {
        setSelectedBlock({ sectionId, blockId: remainingBlocks[0].id });
      } else {
        setSelectedBlock(null);
        setSelectedSection(sectionId);
      }
    }

    setShowDeleteBlockModal(null);
    showToast('Block deleted', 'success');
    announceToScreenReader('Block deleted');
  };

  const handleToggleBlockVisibility = (sectionId: string, blockId: string) => {
    setSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          blocks: s.blocks.map(b =>
            b.id === blockId ? { ...b, isVisible: !b.isVisible } : b
          )
        };
      }
      return s;
    }));

    const section = sections.find(s => s.id === sectionId);
    const block = section?.blocks.find(b => b.id === blockId);
    const newState = !block?.isVisible;
    showToast(newState ? 'Block shown' : 'Block hidden', 'info');
    announceToScreenReader(newState ? 'Block shown' : 'Block hidden');
  };

  // Helper function to get default content for blocks
  const getDefaultBlockContent = (blockType: string): any => {
    switch (blockType) {
      case 'heading': return { text: 'New Heading' };
      case 'text': return { text: 'New paragraph text' };
      case 'image': return { src: '', alt: 'Image' };
      case 'button': return { text: 'Click me', link: '#' };
      case 'icon': return { name: 'star' };
      case 'list': return { items: ['Item 1', 'Item 2', 'Item 3'] };
      case 'card': return { title: 'Card Title', description: 'Card description' };
      case 'stat': return { value: '0', label: 'Statistic' };
      case 'divider': return {};
      default: return {};
    }
  };

  // ============================================
  // BLOCK UPDATE HANDLER
  // ============================================

  const handleUpdateBlock = (sectionId: string, blockId: string, updates: Partial<Block>) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          blocks: section.blocks.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
          )
        };
      }
      return section;
    }));
  };

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col overflow-hidden">
      {/* SCREEN READER LIVE REGION */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announceMessage}
      </div>

      {/* SKIP TO MAIN CONTENT LINK */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#253154] focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* TOP EDITOR BAR */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm z-30">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-gray-600 hover:text-[#253154]"
              title="Back to Admin Panel"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-lg font-semibold text-[#253154]">Study Visa Platform</h1>

          {/* PART 8: Current User Role Badge */}
          <button
            onClick={() => {
              const roles: UserRole[] = ['owner', 'admin', 'editor', 'viewer'];
              const currentIndex = roles.indexOf(currentUser.role);
              const nextIndex = (currentIndex + 1) % roles.length;
              const nextRole = roles[nextIndex];
              setCurrentUser({ ...currentUser, role: nextRole });
              toast(`Role changed to ${nextRole.charAt(0).toUpperCase() + nextRole.slice(1)}`);
            }}
            className="hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
            title="Click to cycle through roles (DEMO)"
          >
            <RoleBadge role={currentUser.role} size="md" />
          </button>

          {/* Environment Badge - PART 7 Enhanced */}
          <EnhancedEnvironmentBadge environment={environment} lastPublished={lastPublished} />

          {/* Auto-save Status */}
          <AutoSaveIndicator status={autoSaveStatus} />
        </div>

        {/* Center Section */}
        <div className="flex items-center gap-4">
          {/* Page Selector */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-[#253154]">Home</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {/* Device Preview Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-2 rounded-md transition-colors ${deviceMode === 'desktop' ? 'bg-white shadow-sm text-[#253154]' : 'text-gray-500 hover:text-gray-700'
                }`}
              title="Desktop View"
            >
              <Monitor size={18} />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-2 rounded-md transition-colors ${deviceMode === 'tablet' ? 'bg-white shadow-sm text-[#253154]' : 'text-gray-500 hover:text-gray-700'
                }`}
              title="Tablet View"
            >
              <Tablet size={18} />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-2 rounded-md transition-colors ${deviceMode === 'mobile' ? 'bg-white shadow-sm text-[#253154]' : 'text-gray-500 hover:text-gray-700'
                }`}
              title="Mobile View"
            >
              <Smartphone size={18} />
            </button>
          </div>

          {/* Preview Button */}
          <button
            onClick={() => setEnvironment('preview')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-[#253154]">Preview</span>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLockedBy('Sarah Johnson');
              setShowLockedPageModal(true);
            }}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            title="View Lock Demo"
          >
            <Lock size={18} />
            <span className="font-medium text-[10px] bg-yellow-100 px-1.5 py-0.5 rounded">DEMO</span>
          </button>

          <button
            onClick={() => {
              setShowBlockingError(true);
              setBlockingErrorTitle('App connection required');
              setBlockingErrorMessage('You need to connect the University Search app before publishing. This ensures all university data displays correctly.');
              setBlockingErrorAction({
                label: 'Connect app',
                action: () => {
                  setShowBlockingError(false);
                  setShowAppsPanel(true);
                }
              });
            }}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            title="Demo: Blocking Error"
          >
            <AlertCircle size={18} />
            <span className="font-medium text-[10px] bg-red-100 px-1.5 py-0.5 rounded">ERROR</span>
          </button>

          <button
            onClick={() => showToast('Changes published successfully!', 'success')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            title="Demo: Success Toast"
          >
            <CheckCircle size={18} />
            <span className="font-medium text-[10px] bg-green-100 px-1.5 py-0.5 rounded">TOAST</span>
          </button>

          <button
            onClick={() => setShowActivityPanel(true)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            title="View Activity"
          >
            <Bell size={18} />
            <span className="font-medium">Activity</span>
          </button>

          <button
            onClick={() => setShowTeamModal(true)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            title="Team & Access"
          >
            <Users size={18} />
            <span className="font-medium">Team</span>
          </button>

          <button
            onClick={() => setShowAppsPanel(true)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            title="Apps & Integrations"
            aria-label="Open apps and integrations"
          >
            <Puzzle size={18} />
            <span className="font-medium">Apps</span>
            {installedApps.some(app => app.status === 'error' || app.status === 'disconnected') && (
              <span className="w-2 h-2 bg-yellow-500 rounded-full" title="Some apps need attention"></span>
            )}
          </button>

          <button
            onClick={() => setShowVersionHistory(true)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            title="View Version History"
          >
            <RotateCcw size={18} />
            <span className="font-medium">History</span>
          </button>

          {/* PART 10: Enhanced System Health Indicator */}
          <EnhancedSystemHealthIndicator
            health={systemHealth === 'warning' && showBlockingError ? 'blocking-error' : systemHealth}
            lastSaveTime={lastSaveTime}
            onTriggerSave={triggerAutoSave}
            onViewDetails={() => {
              // Show apps panel or error details
              setShowAppsPanel(true);
            }}
            onResolveIssue={() => {
              if (blockingErrorAction) {
                blockingErrorAction.action();
              }
            }}
            isOffline={isOffline}
            onSimulateOffline={simulateOffline}
            onSimulateOnline={simulateOnline}
          />

          <button
            onClick={() => {
              setThemeSettingsMode(!themeSettingsMode);
              if (!themeSettingsMode) {
                setSelectedSection(null);
                setSelectedBlock(null);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${themeSettingsMode
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-white border border-gray-300 text-[#253154] hover:bg-gray-50'
              }`}
          >
            <Palette size={18} />
            <span>Theme</span>
          </button>

          {/* Keyboard Shortcuts Button */}
          <button
            onClick={() => setShowKeyboardShortcuts(true)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            title="Keyboard shortcuts (Cmd+/)"
            aria-label="View keyboard shortcuts"
          >
            <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded shadow-sm">?</kbd>
          </button>

          <button
            onClick={() => setShowPublishModal(true)}
            disabled={environment !== 'draft' || (currentUser.role !== 'owner' && currentUser.role !== 'admin')}
            className={`px-5 py-2.5 rounded-lg transition-all text-sm font-semibold shadow-md flex items-center gap-2 ${environment === 'draft' && (currentUser.role === 'owner' || currentUser.role === 'admin')
                ? 'bg-[#0e042f] text-white hover:bg-[#1a0a4a] hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            title={
              environment !== 'draft'
                ? 'Cannot publish in preview/live mode'
                : currentUser.role !== 'owner' && currentUser.role !== 'admin'
                  ? 'Only Owners and Admins can publish changes'
                  : 'Publish your draft changes'
            }
          >
            <Save size={18} />
            Publish Changes
          </button>
        </div>
      </div>

      {/* DRAFT MODE BANNER - PART 7 Enhanced */}
      {environment === 'draft' && (
        <>
          <EnhancedDraftModeBanner />
          {/* PART 8: Viewer Role Banner */}
          {currentUser.role === 'viewer' && (
            <ViewerRoleBanner />
          )}
          {/* Editor Permission Notice */}
          {currentUser.role === 'editor' && (
            <div className="bg-orange-50 border-b border-orange-200 px-6 py-2.5">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-orange-600" />
                  <p className="text-sm text-orange-800">
                    <strong>Editor access:</strong> You can make changes, but you&apos;ll need an Admin to publish them.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* PREVIEW MODE OVERLAY - PART 7 Enhanced */}
      {environment === 'preview' && (
        <EnhancedPreviewModeBar onBackToDraft={() => setEnvironment('draft')} onPublish={() => setShowPublishModal(true)} />
      )}

      {/* MAIN EDITOR AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - SECTION LIST */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden shadow-sm">
          {/* Sidebar Header */}
          <div className="px-4 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-[#253154]">Sections</h2>
            <p className="text-xs text-gray-500 mt-1">Drag to reorder, click to edit</p>
          </div>

          {/* Section List */}
          <div className="flex-1 overflow-y-auto">
            {/* Header Group */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => toggleGroupExpansion('header')}
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Header</span>
                {expandedGroups.header ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {expandedGroups.header && (
                <div className="pb-2">
                  {groupedSections.header.map((section) => (
                    <SectionRow
                      key={section.id}
                      section={section}
                      isSelected={selectedSection === section.id}
                      isHovered={hoveredSection === section.id}
                      onSelect={() => handleSectionSelect(section.id)}
                      onHover={() => setHoveredSection(section.id)}
                      onLeave={() => setHoveredSection(null)}
                      onToggleVisibility={() => toggleSectionVisibility(section.id)}
                      hasUnpublishedChanges={sectionsWithChanges.includes(section.id)}
                      lockedBy={lockedSections[section.id] || null}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Content Group */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => toggleGroupExpansion('content')}
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Page Sections</span>
                {expandedGroups.content ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {expandedGroups.content && (
                <div className="pb-2">
                  {groupedSections.content.map((section) => (
                    <SectionRow
                      key={section.id}
                      section={section}
                      isSelected={selectedSection === section.id}
                      isHovered={hoveredSection === section.id}
                      onSelect={() => handleSectionSelect(section.id)}
                      onHover={() => setHoveredSection(section.id)}
                      onLeave={() => setHoveredSection(null)}
                      onToggleVisibility={() => toggleSectionVisibility(section.id)}
                      hasUnpublishedChanges={sectionsWithChanges.includes(section.id)}
                      lockedBy={lockedSections[section.id] || null}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer Group */}
            <div>
              <button
                onClick={() => toggleGroupExpansion('footer')}
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Footer</span>
                {expandedGroups.footer ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {expandedGroups.footer && (
                <div className="pb-2">
                  {groupedSections.footer.map((section) => (
                    <SectionRow
                      key={section.id}
                      section={section}
                      isSelected={selectedSection === section.id}
                      isHovered={hoveredSection === section.id}
                      onSelect={() => handleSectionSelect(section.id)}
                      onHover={() => setHoveredSection(section.id)}
                      onLeave={() => setHoveredSection(null)}
                      onToggleVisibility={() => toggleSectionVisibility(section.id)}
                      hasUnpublishedChanges={sectionsWithChanges.includes(section.id)}
                      lockedBy={lockedSections[section.id] || null}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Section Button */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={() => setShowAddSectionModal({ position: 'bottom' })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-colors font-medium text-sm"
            >
              <Plus size={18} />
              Add Section
            </button>
          </div>
        </div>

        {/* CENTER CANVAS - PAGE PREVIEW */}
        <div className="flex-1 bg-[#F1F5F9] overflow-auto p-8 flex justify-center">
          <div
            className="bg-white shadow-2xl transition-all duration-300 overflow-hidden"
            style={{
              width: getDeviceWidth(),
              maxWidth: '100%',
              minHeight: '100%'
            }}
          >
            {/* Canvas Sections with Block Support */}
            {sections.map((section, index) => (
              <div key={section.id}>
                {/* Inline Add Section Divider */}
                <div
                  className="relative group"
                  onMouseEnter={() => setShowAddSectionInline(section.id)}
                  onMouseLeave={() => setShowAddSectionInline(null)}
                >
                  {showAddSectionInline === section.id && (
                    <div className="absolute inset-x-0 top-0 h-12 -mt-6 flex items-center justify-center z-20">
                      <button
                        onClick={() => setShowAddSectionModal({ position: section.id })}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-all shadow-lg text-xs font-medium"
                      >
                        <Plus size={14} />
                        Add Section
                      </button>
                    </div>
                  )}
                </div>

                {/* Section with Chrome and Blocks */}
                <div
                  className={`relative group transition-all ${selectedSection === section.id
                      ? 'ring-2 ring-blue-500 ring-inset'
                      : hoveredCanvasSection === section.id
                        ? 'ring-1 ring-blue-300 ring-inset'
                        : ''
                    } ${!section.isVisible ? 'opacity-40' : ''}`}
                  onMouseEnter={() => setHoveredCanvasSection(section.id)}
                  onMouseLeave={() => setHoveredCanvasSection(null)}
                >
                  {/* Section Chrome Bar */}
                  {(hoveredCanvasSection === section.id || selectedSection === section.id) && !selectedBlock && (
                    <div className="absolute top-0 left-0 right-0 z-10 bg-blue-500 text-white px-3 py-2 flex items-center justify-between text-xs font-medium shadow-md">
                      <div className="flex items-center gap-2">
                        <section.icon size={14} />
                        <span>{section.name}</span>
                        {section.isRequired && (
                          <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px]">Required</span>
                        )}
                        {!section.isVisible && (
                          <span className="px-1.5 py-0.5 bg-gray-500 rounded text-[10px]">Hidden</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-white/20 rounded transition-colors" title="Drag to reorder">
                          <GripVertical size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateSection(section.id);
                          }}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Duplicate section"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSectionVisibility(section.id);
                          }}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Toggle visibility"
                        >
                          {section.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowSectionMoreMenu(showSectionMoreMenu === section.id ? null : section.id);
                            }}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            title="More options"
                          >
                            <MoreVertical size={14} />
                          </button>
                          {showSectionMoreMenu === section.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowSectionMoreMenu(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (sections.length === 1) {
                                      showToast('At least one section is required', 'warning');
                                      setShowSectionMoreMenu(null);
                                    } else if (section.isRequired) {
                                      showToast('This section cannot be deleted', 'warning');
                                      setShowSectionMoreMenu(null);
                                    } else {
                                      setShowDeleteSectionModal(section.id);
                                      setShowSectionMoreMenu(null);
                                    }
                                  }}
                                  disabled={sections.length === 1 || section.isRequired}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  title={sections.length === 1 ? 'At least one section is required' : section.isRequired ? 'This section cannot be deleted' : 'Delete section'}
                                >
                                  <Trash2 size={14} />
                                  Delete Section
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Section Content with Block-Level Editing */}
                  <div
                    className={`${hoveredCanvasSection === section.id || selectedSection === section.id ? 'pt-10' : ''}`}
                    onClick={(e) => {
                      // Only select section if clicking on section background, not blocks
                      if (e.target === e.currentTarget) {
                        handleSectionSelect(section.id);
                      }
                    }}
                  >
                    <SectionPreviewWithBlocks
                      section={section}
                      selectedBlock={selectedBlock}
                      hoveredBlock={hoveredBlock}
                      onBlockSelect={handleBlockSelect}
                      onBlockHover={setHoveredBlock}
                      onBlockLeave={() => setHoveredBlock(null)}
                      onShowAddBlock={setShowAddBlockPanel}
                      handleDuplicateBlock={handleDuplicateBlock}
                      handleToggleBlockVisibility={handleToggleBlockVisibility}
                      setShowDeleteBlockModal={setShowDeleteBlockModal}
                    />
                  </div>

                  {/* Selection Tint Overlay */}
                  {selectedSection === section.id && (
                    <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                  )}
                </div>
              </div>
            ))}

            {/* Final Add Section at Bottom */}
            <div
              className="relative group py-8"
              onMouseEnter={() => setShowAddSectionInline('bottom')}
              onMouseLeave={() => setShowAddSectionInline(null)}
            >
              {showAddSectionInline === 'bottom' && (
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setShowAddSectionModal({ position: 'bottom' })}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-all shadow-lg text-sm font-medium"
                  >
                    <Plus size={16} />
                    Add Section
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - INSPECTOR PANEL */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-sm">
          {/* PART 8: Edit Conflict Warning */}
          {showEditConflict && conflictSection && lockedSections[conflictSection] && (
            <div className="p-4 border-b border-gray-200">
              <EditConflictWarning
                lockedBy={lockedSections[conflictSection]}
                onDismiss={() => {
                  setShowEditConflict(false);
                  setConflictSection(null);
                }}
              />
            </div>
          )}

          {/* PART 10: Preview Mode Warning */}
          {environment === 'preview' && (selectedSection || selectedBlock) && (
            <div className="p-4 border-b border-gray-200">
              <InlineWarning
                message="You're in preview mode. Switch to draft to make changes."
                icon={<Eye size={16} />}
              />
            </div>
          )}

          {/* PART 10: Offline Mode Warning */}
          {isOffline && (selectedSection || selectedBlock) && (
            <div className="p-4 border-b border-gray-200">
              <InlineWarning
                message="You're offline. Changes will sync when connection is restored."
                icon={<WifiOff size={16} />}
              />
            </div>
          )}

          {themeSettingsMode ? (
            <ThemeSettingsPanel
              activeTab={themeTab}
              onTabChange={setThemeTab}
            />
          ) : (
            <SettingsPanel
              selectedSection={selectedSectionObj}
              selectedBlock={selectedBlockObj}
              selectedBlockId={selectedBlock}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onBlockUpdate={handleUpdateBlock}
            />
          )}
        </div>
      </div>

      {/* Add Block Panel (Modal Overlay) */}
      {showAddBlockPanel && (
        <AddBlockPanel
          blockTypes={blockTypes}
          sectionName={sections.find(s => s.id === showAddBlockPanel.sectionId)?.name || ''}
          position={showAddBlockPanel.position}
          onClose={() => setShowAddBlockPanel(null)}
          onSelectBlockType={(blockType) => {
            handleAddBlock(showAddBlockPanel.sectionId, blockType.type, showAddBlockPanel.position);
          }}
        />
      )}

      {/* PUBLISH CONFIRMATION MODAL - PART 7 Enhanced */}
      {showPublishModal && (
        <EnhancedPublishConfirmationModal
          onConfirm={() => {
            setShowPublishModal(false);
            setLastPublished(new Date());
            setHasUnsavedChanges(false);
            setEnvironment('live');
            // Success message handled in modal
          }}
          onCancel={() => setShowPublishModal(false)}
        />
      )}

      {/* VERSION HISTORY PANEL - PART 7 Enhanced */}
      {showVersionHistory && (
        <EnhancedVersionHistoryPanel onClose={() => setShowVersionHistory(false)} />
      )}

      {/* UNSAVED CHANGES WARNING - PART 7 Enhanced */}
      {showUnsavedWarning && (
        <EnhancedUnsavedChangesWarning
          onStay={() => setShowUnsavedWarning(false)}
          onDiscard={() => {
            setShowUnsavedWarning(false);
            setHasUnsavedChanges(false);
            // Navigate away
          }}
        />
      )}

      {/* PART 8: Enhanced Team Modal */}
      {showTeamModal && (
        <EnhancedTeamModal
          currentUser={currentUser}
          teamMembers={teamMembers}
          onClose={() => setShowTeamModal(false)}
        />
      )}

      {/* TEAM & ACCESS SETTINGS */}
      {showTeamSettings && (
        <TeamAccessSettings
          currentUser={currentUser}
          onClose={() => setShowTeamSettings(false)}
          onInvite={() => setShowInviteModal(true)}
        />
      )}

      {/* INVITE USER MODAL */}
      {showInviteModal && (
        <InviteUserModal
          onClose={() => setShowInviteModal(false)}
          onInvite={(email, role) => {
            // Handle invite logic
            setShowInviteModal(false);
          }}
        />
      )}

      {/* ACTIVITY PANEL */}
      {showActivityPanel && (
        <ActivityPanel
          onClose={() => setShowActivityPanel(false)}
          activities={activities}
          onViewPageHistory={() => {
            setShowActivityPanel(false);
            setShowPageHistory(true);
          }}
        />
      )}

      {/* PAGE HISTORY PANEL */}
      {showPageHistory && (
        <PageHistoryPanel
          onClose={() => setShowPageHistory(false)}
          versions={pageVersions}
          onSelectVersion={(version) => setSelectedVersion(version)}
          onRestore={(version) => {
            setSelectedVersion(version);
            setShowRestoreModal(true);
          }}
        />
      )}

      {/* VERSION DETAIL MODAL */}
      {selectedVersion && !showRestoreModal && (
        <VersionDetailModal
          version={selectedVersion}
          onClose={() => setSelectedVersion(null)}
          onRestore={() => {
            setShowRestoreModal(true);
          }}
        />
      )}

      {/* RESTORE VERSION MODAL */}
      {showRestoreModal && selectedVersion && (
        <RestoreVersionModal
          version={selectedVersion}
          onConfirm={() => {
            setShowRestoreModal(false);
            setSelectedVersion(null);
            setShowPageHistory(false);
            // In real app: apply the restore logic
          }}
          onCancel={() => setShowRestoreModal(false)}
        />
      )}

      {/* LOCKED PAGE MODAL */}
      {showLockedPageModal && lockedBy && (
        <LockedPageModal
          lockedBy={lockedBy}
          onClose={() => setShowLockedPageModal(false)}
          onNotify={() => {
            // Handle notify logic
            setShowLockedPageModal(false);
          }}
        />
      )}

      {/* ============================================ */}
      {/* FEEDBACK & ERROR UI */}
      {/* ============================================ */}

      {/* PART 10: Enhanced Offline Banner */}
      {isOffline && (
        <EnhancedOfflineBanner
          onDismiss={() => setIsOffline(false)}
        />
      )}

      {/* PART 10: Enhanced Blocking Error Banner */}
      {showBlockingError && (
        <EnhancedBlockingErrorBanner
          title={blockingErrorTitle || 'Unable to complete action'}
          message={blockingErrorMessage}
          actionLabel={blockingErrorAction?.label}
          onAction={blockingErrorAction?.action}
          onDismiss={() => {
            setShowBlockingError(false);
            setBlockingErrorAction(null);
          }}
        />
      )}

      {/* PART 10: Save Failed Banner */}
      {showSaveFailed && (
        <SaveFailedBanner
          onRetry={() => {
            setShowSaveFailed(false);
            setSaveRetryCount(0);
            triggerAutoSave();
          }}
          onDismiss={() => {
            setShowSaveFailed(false);
            setSaveRetryCount(0);
          }}
        />
      )}

      {/* NON-BLOCKING ERROR BANNER - Legacy */}
      {showNonBlockingError && (
        <NonBlockingErrorBanner
          message={nonBlockingErrorMessage}
          onRetry={() => {
            setShowNonBlockingError(false);
            triggerAutoSave();
          }}
          onDismiss={() => setShowNonBlockingError(false)}
        />
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onDismiss={() => setToastMessage(null)}
        />
      )}

      {/* PART 10: Auto-Save Indicator */}
      <AutoSaveIndicator
        status={autoSaveStatus === 'error' ? 'failed' : autoSaveStatus}
        lastSaveTime={autoSaveStatus === 'saved' ? lastSaveTime : undefined}
      />

      {/* DESTRUCTIVE ACTION MODAL */}
      {showDestructiveModal && destructiveAction && (
        <DestructiveActionModal
          title={destructiveAction.title}
          message={destructiveAction.message}
          confirmLabel={destructiveAction.confirmLabel}
          onConfirm={() => {
            destructiveAction.onConfirm();
            setShowDestructiveModal(false);
          }}
          onCancel={() => setShowDestructiveModal(false)}
        />
      )}

      {/* ============================================ */}
      {/* ACCESSIBILITY UI */}
      {/* ============================================ */}

      {/* COMMAND PALETTE */}
      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          onExecute={(action) => {
            if (action === 'save') triggerAutoSave();
            if (action === 'publish') setShowPublishModal(true);
            if (action === 'preview') setEnvironment('preview');
            if (action === 'theme') setThemeSettingsMode(true);
            if (action === 'apps') setShowAppsPanel(true);
            if (action === 'history') setShowVersionHistory(true);
            if (action === 'team') setShowTeamSettings(true);
            if (action === 'shortcuts') setShowKeyboardShortcuts(true);
            setShowCommandPalette(false);
            announceToScreenReader(`${action} command executed`);
          }}
        />
      )}

      {/* KEYBOARD SHORTCUTS PANEL */}
      {showKeyboardShortcuts && (
        <KeyboardShortcutsPanel
          onClose={() => setShowKeyboardShortcuts(false)}
        />
      )}

      {/* APPS & INTEGRATIONS PANEL */}
      {showAppsPanel && (
        <AppsIntegrationsPanel
          installedApps={installedApps}
          selectedApp={selectedApp}
          currentUserRole={currentUser.role}
          onSelectApp={(appId) => setSelectedApp(appId)}
          onClose={() => {
            setShowAppsPanel(false);
            setSelectedApp(null);
          }}
          onUninstall={(app) => {
            setAppToUninstall(app);
            setShowUninstallModal(true);
          }}
          onToggleStatus={(appId) => {
            setInstalledApps(prev => prev.map(app =>
              app.id === appId
                ? { ...app, status: app.status === 'active' ? 'disabled' : 'active' }
                : app
            ));
            showToast(
              installedApps.find(app => app.id === appId)?.status === 'active'
                ? 'App disabled successfully'
                : 'App enabled successfully',
              'success'
            );
          }}
          onReconnect={(appId) => {
            setInstalledApps(prev => prev.map(app =>
              app.id === appId
                ? { ...app, status: 'active' }
                : app
            ));
            showToast('App reconnected successfully', 'success');
          }}
        />
      )}

      {/* UNINSTALL APP MODAL */}
      {showUninstallModal && appToUninstall && (
        <UninstallAppModal
          app={appToUninstall}
          onConfirm={() => {
            setInstalledApps(prev => prev.filter(app => app.id !== appToUninstall.id));
            setShowUninstallModal(false);
            setAppToUninstall(null);
            setSelectedApp(null);
            showToast('App uninstalled successfully', 'success');
          }}
          onCancel={() => {
            setShowUninstallModal(false);
            setAppToUninstall(null);
          }}
        />
      )}

      {/* ADD SECTION MODAL */}
      {showAddSectionModal && (
        <AddSectionModal
          onSelectType={(type) => handleAddSection(type, showAddSectionModal.position)}
          onCancel={() => setShowAddSectionModal(null)}
          sectionTypes={sectionTypes}
        />
      )}

      {/* DELETE SECTION CONFIRMATION */}
      {showDeleteSectionModal && (
        <DeleteSectionModal
          sectionName={sections.find(s => s.id === showDeleteSectionModal)?.name || 'this section'}
          onConfirm={() => handleDeleteSection(showDeleteSectionModal)}
          onCancel={() => setShowDeleteSectionModal(null)}
        />
      )}

      {/* DELETE BLOCK CONFIRMATION */}
      {showDeleteBlockModal && (
        <DeleteBlockModal
          blockName={sections.find(s => s.id === showDeleteBlockModal.sectionId)?.blocks.find(b => b.id === showDeleteBlockModal.blockId)?.name || 'this block'}
          onConfirm={() => handleDeleteBlock(showDeleteBlockModal.sectionId, showDeleteBlockModal.blockId)}
          onCancel={() => setShowDeleteBlockModal(null)}
        />
      )}
    </div>
  );
};

// Section components now imported from './website-builder/SectionComponents'

// ============================================
// SETTINGS PANEL COMPONENT
// ============================================

interface SettingsPanelProps {
  selectedSection: Section | null;
  selectedBlock: Block | null;
  selectedBlockId: { sectionId: string; blockId: string } | null;
  activeTab: 'content' | 'layout' | 'style' | 'advanced';
  onTabChange: (tab: 'content' | 'layout' | 'style' | 'advanced') => void;
  onBlockUpdate?: (sectionId: string, blockId: string, updates: Partial<Block>) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ selectedSection, selectedBlock, selectedBlockId, activeTab, onTabChange, onBlockUpdate }) => {
  const [accordionStates, setAccordionStates] = useState<Record<string, boolean>>({
    headings: true,
    subcontent: false,
    cta: false,
    size: true,
    spacing: false,
    alignment: false,
    responsive: false,
    typography: true,
    background: false,
    border: false,
    shadow: false,
    effects: false,
    visibility: false,
    animation: false,
    advanced_settings: false,
    // Block-specific
    block_content: true,
    block_style: true,
    block_advanced: false
  });

  // Move all useState hooks to the top to follow Rules of Hooks
  const [showBlockResetModal, setShowBlockResetModal] = useState(false);
  const [showSectionResetModal, setShowSectionResetModal] = useState(false);

  const toggleAccordion = (key: string) => {
    setAccordionStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Empty State
  if (!selectedSection && !selectedBlock) {
    return (
      <>
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-[#253154]">Inspector</h2>
          <p className="text-xs text-gray-500 mt-1">Select a section or block to edit</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <MousePointer size={48} className="text-gray-300 mb-4" />
          <p className="text-sm font-medium text-gray-700 mb-1">No selection</p>
          <p className="text-xs text-gray-500">Select a section or block from the page to customize its settings</p>
        </div>
      </>
    );
  }

  // Block Selected State
  if (selectedBlock) {
    const BlockIcon = selectedBlock.icon;

    return (
      <>
        {/* Sticky Header - Block Context */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
          {/* MODE HEADER STRIP - Block Mode */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-green-50/30">
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
              <BlockIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-green-700 uppercase tracking-wide font-semibold mb-0.5">Editing Block</p>
              <h2 className="text-base font-semibold text-[#253154] truncate mb-0.5">{selectedBlock.name}</h2>
              <p className="text-xs text-gray-500">Affects content and appearance</p>
            </div>
            <button
              onClick={() => setShowBlockResetModal(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              title="Resets this block to default styles"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>

          {/* Block Preset Selector */}
          <BlockPresetSelector blockType={selectedBlock.type} />

          {/* Tabs - Only Content, Style, Advanced for blocks */}
          <div className="border-b border-gray-200">
            <div className="flex items-center">
              <TabButton label="Content" icon={Type} isActive={activeTab === 'content'} onClick={() => onTabChange('content')} />
              <TabButton label="Style" icon={Palette} isActive={activeTab === 'style'} onClick={() => onTabChange('style')} />
              <TabButton label="Advanced" icon={Code} isActive={activeTab === 'advanced'} onClick={() => onTabChange('advanced')} />
            </div>
            {/* Tab Purpose Helper */}
            <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {activeTab === 'content' && 'Edit what appears inside this block'}
                {activeTab === 'style' && 'Visual appearance of this element'}
                {activeTab === 'advanced' && 'Optional technical settings'}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content - Block Tabs */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeTab === 'content' && selectedBlockId && onBlockUpdate && (
            <BlockContentTab
              accordionStates={accordionStates}
              toggleAccordion={toggleAccordion}
              block={selectedBlock}
              sectionId={selectedBlockId.sectionId}
              blockId={selectedBlockId.blockId}
              onUpdate={onBlockUpdate}
            />
          )}
          {activeTab === 'style' && selectedBlockId && onBlockUpdate && (
            <BlockStyleTab
              accordionStates={accordionStates}
              toggleAccordion={toggleAccordion}
              block={selectedBlock}
              sectionId={selectedBlockId.sectionId}
              blockId={selectedBlockId.blockId}
              onUpdate={onBlockUpdate}
            />
          )}
          {activeTab === 'advanced' && selectedBlockId && onBlockUpdate && (
            <BlockAdvancedTab
              accordionStates={accordionStates}
              toggleAccordion={toggleAccordion}
              block={selectedBlock}
              sectionId={selectedBlockId.sectionId}
              blockId={selectedBlockId.blockId}
              onUpdate={onBlockUpdate}
            />
          )}
        </div>

        {/* Reset Confirmation Modal */}
        {showBlockResetModal && (
          <ResetConfirmationModal
            type="block"
            targetName={selectedBlock.name}
            onConfirm={() => {
              setShowBlockResetModal(false);
              // Reset logic here
            }}
            onCancel={() => setShowBlockResetModal(false)}
          />
        )}
      </>
    );
  }

  // Section Selected State
  const SectionIcon = selectedSection!.icon;

  return (
    <>
      {/* Sticky Header - Section Context */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        {/* MODE HEADER STRIP - Section Mode */}
        <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-blue-50/30">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <SectionIcon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-blue-700 uppercase tracking-wide font-semibold mb-0.5">Editing Section</p>
            <h2 className="text-base font-semibold text-[#253154] truncate mb-0.5">{selectedSection!.name}</h2>
            <p className="text-xs text-gray-500">Affects layout and visibility</p>
          </div>
          <button
            onClick={() => setShowSectionResetModal(true)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            title="Resets this section to default settings"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>

        {/* Section Preset Selector */}
        <SectionPresetDropdown sectionName={selectedSection!.name} />

        {/* Tabs - All 4 tabs for sections */}
        <div className="border-b border-gray-200">
          <div className="flex items-center">
            <TabButton label="Content" icon={Type} isActive={activeTab === 'content'} onClick={() => onTabChange('content')} />
            <TabButton label="Layout" icon={Layout} isActive={activeTab === 'layout'} onClick={() => onTabChange('layout')} />
            <TabButton label="Style" icon={Palette} isActive={activeTab === 'style'} onClick={() => onTabChange('style')} />
            <TabButton label="Advanced" icon={Code} isActive={activeTab === 'advanced'} onClick={() => onTabChange('advanced')} />
          </div>
          {/* Tab Purpose Helper */}
          <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {activeTab === 'content' && 'Edit text, headings, and elements in this section'}
              {activeTab === 'layout' && 'Control structure, alignment, and spacing'}
              {activeTab === 'style' && 'Visual appearance of this section'}
              {activeTab === 'advanced' && 'Visibility rules and technical settings'}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content - Section Tabs */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeTab === 'content' && <ContentTab accordionStates={accordionStates} toggleAccordion={toggleAccordion} />}
        {activeTab === 'layout' && <LayoutTab accordionStates={accordionStates} toggleAccordion={toggleAccordion} />}
        {activeTab === 'style' && <StyleTab accordionStates={accordionStates} toggleAccordion={toggleAccordion} />}
        {activeTab === 'advanced' && <AdvancedTab accordionStates={accordionStates} toggleAccordion={toggleAccordion} />}
      </div>

      {/* Reset Confirmation Modal */}
      {showSectionResetModal && (
        <ResetConfirmationModal
          type="section"
          targetName={selectedSection!.name}
          onConfirm={() => {
            setShowSectionResetModal(false);
            // Reset logic here
          }}
          onCancel={() => setShowSectionResetModal(false)}
        />
      )}
    </>
  );
};

// Tab Button Component
const TabButton: React.FC<{ label: string; icon: React.ElementType; isActive: boolean; onClick: () => void }> = ({ label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center py-3 border-b-2 transition-colors ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
  >
    <Icon size={18} className="mb-1" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

// Accordion Component
const Accordion: React.FC<{ title: string; icon: React.ElementType; isOpen: boolean; onToggle: () => void; children: React.ReactNode }> = ({ title, icon: Icon, isOpen, onToggle, children }) => (
  <div className="bg-white border-b border-gray-200">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && <div className="px-4 py-4 space-y-4 bg-white">{children}</div>}
  </div>
);

// ============================================
// INHERITANCE INDICATOR COMPONENTS
// ============================================

const InheritanceIndicator: React.FC<{
  level: 'system' | 'theme' | 'section' | 'custom';
  onReset?: () => void;
}> = ({ level, onReset }) => {
  const config = {
    system: { text: 'System Default', color: 'text-gray-500', bg: 'bg-gray-100', icon: Shield },
    theme: { text: 'From Theme', color: 'text-purple-600', bg: 'bg-purple-50', icon: Palette },
    section: { text: 'From Section', color: 'text-blue-600', bg: 'bg-blue-50', icon: Layout },
    custom: { text: 'Custom', color: 'text-orange-600', bg: 'bg-orange-50', icon: Star }
  };

  const { text, color, bg, icon: Icon } = config[level];

  return (
    <div className="flex items-center justify-between mb-1.5">
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${bg}`}>
        <Icon size={10} className={color} />
        <span className={`text-[10px] font-semibold ${color}`}>{text}</span>
      </div>
      {onReset && level !== 'system' && (
        <button
          onClick={onReset}
          className="text-[10px] text-gray-500 hover:text-purple-600 font-medium flex items-center gap-0.5"
        >
          <RotateCcw size={9} />
          Reset
        </button>
      )}
    </div>
  );
};

// Enhanced Field Components with Inheritance
const TextFieldWithInheritance: React.FC<{
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string;
  inheritanceLevel?: 'system' | 'theme' | 'section' | 'custom';
  onReset?: () => void;
}> = ({ label, placeholder, helpText, defaultValue, inheritanceLevel = 'theme', onReset }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
    {inheritanceLevel && <InheritanceIndicator level={inheritanceLevel} onReset={onReset} />}
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
    />
    {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
  </div>
);

const ColorPickerWithInheritance: React.FC<{
  label: string;
  inheritanceLevel?: 'system' | 'theme' | 'section' | 'custom';
  onReset?: () => void;
}> = ({ label, inheritanceLevel = 'theme', onReset }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
    {inheritanceLevel && <InheritanceIndicator level={inheritanceLevel} onReset={onReset} />}
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-lg border-2 border-gray-300 bg-gradient-to-br from-blue-500 to-purple-600 cursor-pointer hover:border-gray-400 transition-colors" />
      <input
        type="text"
        placeholder="#3B82F6"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
    </div>
  </div>
);

const SliderFieldWithInheritance: React.FC<{
  label: string;
  min: number;
  max: number;
  unit?: string;
  inheritanceLevel?: 'system' | 'theme' | 'section' | 'custom';
  onReset?: () => void;
}> = ({ label, min, max, unit = 'px', inheritanceLevel = 'theme', onReset }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          defaultValue={min}
          className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
    </div>
    {inheritanceLevel && <InheritanceIndicator level={inheritanceLevel} onReset={onReset} />}
    <input
      type="range"
      min={min}
      max={max}
      defaultValue={min}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>
);

// Form Field Components
const TextField: React.FC<{ label: string; placeholder?: string; helpText?: string; defaultValue?: string }> = ({ label, placeholder, helpText, defaultValue }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
    />
    {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
  </div>
);

const TextArea: React.FC<{ label: string; placeholder?: string; rows?: number; defaultValue?: string }> = ({ label, placeholder, rows = 3, defaultValue }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
    <textarea
      placeholder={placeholder}
      rows={rows}
      defaultValue={defaultValue}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
    />
  </div>
);

const SelectField: React.FC<{ label: string; options: string[] }> = ({ label, options }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
      {options.map(opt => <option key={opt} value={opt.toLowerCase()}>{opt}</option>)}
    </select>
  </div>
);

const ToggleSwitch: React.FC<{ label: string; helpText?: string }> = ({ label, helpText }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs font-medium text-gray-700">{label}</p>
      {helpText && <p className="text-xs text-gray-500 mt-0.5">{helpText}</p>}
    </div>
    <button className="w-11 h-6 bg-gray-200 rounded-full relative transition-colors hover:bg-gray-300">
      <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm transition-transform" />
    </button>
  </div>
);

const ColorPicker: React.FC<{ label: string }> = ({ label }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-lg border-2 border-gray-300 bg-gradient-to-br from-blue-500 to-purple-600 cursor-pointer hover:border-gray-400 transition-colors" />
      <input
        type="text"
        placeholder="#3B82F6"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
    </div>
  </div>
);

const SliderField: React.FC<{ label: string; min: number; max: number; unit?: string }> = ({ label, min, max, unit = 'px' }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          defaultValue={min}
          className="w-14 px-2 py-1 border border-gray-300 rounded text-xs text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      defaultValue={min}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>
);

const ImagePicker: React.FC<{ label: string }> = ({ label }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
      <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
      <p className="text-xs text-gray-600 font-medium">Click to upload</p>
      <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
    </div>
  </div>
);

const SpacingControl: React.FC<{ label: string }> = ({ label }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-2">{label}</label>
    <div className="grid grid-cols-4 gap-2">
      {['Top', 'Right', 'Bottom', 'Left'].map(side => (
        <div key={side}>
          <input
            type="number"
            placeholder="0"
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="text-[10px] text-gray-500 text-center mt-1">{side}</p>
        </div>
      ))}
    </div>
  </div>
);

const AlignmentButtons: React.FC<{ label: string }> = ({ label }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="flex gap-1">
      {[AlignLeft, AlignCenter, AlignRight].map((Icon, i) => (
        <button
          key={i}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Icon size={16} className="mx-auto text-gray-600" />
        </button>
      ))}
    </div>
  </div>
);

// ============================================
// TAB CONTENT COMPONENTS - SECTION LEVEL
// ============================================

const ContentTab: React.FC<{ accordionStates: Record<string, boolean>; toggleAccordion: (key: string) => void }> = ({ accordionStates, toggleAccordion }) => (
  <div>
    {/* Section Grouping: Text Elements */}
    <div className="px-4 pt-4 pb-2">
      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Text Elements</p>
    </div>

    <Accordion title="Headings" icon={Type} isOpen={accordionStates.headings} onToggle={() => toggleAccordion('headings')}>
      <TextField label="Main Heading" placeholder="Enter heading text" />
      <TextField label="Subheading" placeholder="Enter subheading text" />
      <ToggleSwitch label="Show heading" helpText="Display or hide the main heading" />
    </Accordion>

    <Accordion title="Sub-content" icon={Layers} isOpen={accordionStates.subcontent} onToggle={() => toggleAccordion('subcontent')}>
      <TextArea label="Description" placeholder="Enter description text" rows={4} />
      <SelectField label="Content Source" options={['Static Text', 'Dynamic Data', 'Database Field']} />
    </Accordion>

    {/* Section Grouping: Interactive Elements */}
    <div className="px-4 pt-4 pb-2 mt-2 border-t border-gray-200">
      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Interactive Elements</p>
    </div>

    <Accordion title="CTA / Links" icon={MousePointer} isOpen={accordionStates.cta} onToggle={() => toggleAccordion('cta')}>
      <TextField label="Button Text" placeholder="Get Started" />
      <TextField label="Button Link" placeholder="https://example.com" />
      <ToggleSwitch label="Open in new tab" />
    </Accordion>

    {/* Section Scope Footer */}
    <div className="p-4 mt-4 bg-blue-50/50 border-t border-blue-100">
      <div className="flex items-start gap-2">
        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info size={12} className="text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-blue-700 font-medium mb-0.5">Section-level content</p>
          <p className="text-xs text-gray-600">Changes here affect the entire section and all blocks within it.</p>
        </div>
      </div>
    </div>
  </div>
);

const LayoutTab: React.FC<{ accordionStates: Record<string, boolean>; toggleAccordion: (key: string) => void }> = ({ accordionStates, toggleAccordion }) => (
  <div>
    {/* Section Grouping: Structure */}
    <div className="px-4 pt-4 pb-2">
      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Structure</p>
    </div>

    <Accordion title="Size" icon={Maximize2} isOpen={accordionStates.size} onToggle={() => toggleAccordion('size')}>
      <SelectField label="Width" options={['Full Width', 'Boxed', 'Custom']} />
      <SelectField label="Height" options={['Auto', 'Full Screen', 'Custom']} />
      <SliderField label="Max Width" min={320} max={1920} unit="px" />
    </Accordion>

    <Accordion title="Spacing" icon={Move} isOpen={accordionStates.spacing} onToggle={() => toggleAccordion('spacing')}>
      <SpacingControl label="Padding" />
      <SpacingControl label="Margin" />
    </Accordion>

    <Accordion title="Alignment" icon={AlignCenter} isOpen={accordionStates.alignment} onToggle={() => toggleAccordion('alignment')}>
      <AlignmentButtons label="Horizontal Alignment" />
      <AlignmentButtons label="Vertical Alignment" />
    </Accordion>

    {/* Section Grouping: Responsive Behavior */}
    <div className="px-4 pt-4 pb-2 mt-2 border-t border-gray-200">
      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Responsive Behavior</p>
    </div>

    <Accordion title="Responsive" icon={Monitor} isOpen={accordionStates.responsive} onToggle={() => toggleAccordion('responsive')}>
      <div className="flex gap-2 mb-3">
        <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium">Desktop</button>
        <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">Tablet</button>
        <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">Mobile</button>
      </div>
      <ToggleSwitch label="Hide on mobile" />
      <ToggleSwitch label="Stack on tablet" />
    </Accordion>

    {/* Layout Scope Footer */}
    <div className="p-4 mt-4 bg-blue-50/50 border-t border-blue-100">
      <div className="flex items-start gap-2">
        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Layout size={12} className="text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-blue-700 font-medium mb-0.5">Section layout controls</p>
          <p className="text-xs text-gray-600">These settings control how this section is positioned and sized on the page.</p>
        </div>
      </div>
    </div>
  </div>
);

const StyleTab: React.FC<{ accordionStates: Record<string, boolean>; toggleAccordion: (key: string) => void }> = ({ accordionStates, toggleAccordion }) => (
  <div>
    <Accordion title="Typography" icon={Type} isOpen={accordionStates.typography} onToggle={() => toggleAccordion('typography')}>
      <SelectField label="Font Family" options={['Inter', 'Roboto', 'Open Sans', 'Lato']} />
      <SliderFieldWithInheritance label="Font Size" min={12} max={72} unit="px" inheritanceLevel="theme" onReset={() => { }} />
      <SliderFieldWithInheritance label="Line Height" min={1} max={3} unit="em" inheritanceLevel="custom" onReset={() => { }} />
      <ColorPickerWithInheritance label="Text Color" inheritanceLevel="theme" onReset={() => { }} />
    </Accordion>

    <Accordion title="Background" icon={Box} isOpen={accordionStates.background} onToggle={() => toggleAccordion('background')}>
      <SelectField label="Background Type" options={['Color', 'Gradient', 'Image', 'Video']} />
      <ColorPickerWithInheritance label="Background Color" inheritanceLevel="custom" onReset={() => { }} />
      <ImagePicker label="Background Image" />
    </Accordion>

    <Accordion title="Border" icon={Box} isOpen={accordionStates.border} onToggle={() => toggleAccordion('border')}>
      <SliderFieldWithInheritance label="Border Width" min={0} max={10} unit="px" inheritanceLevel="system" />
      <SliderFieldWithInheritance label="Border Radius" min={0} max={50} unit="px" inheritanceLevel="theme" onReset={() => { }} />
      <ColorPickerWithInheritance label="Border Color" inheritanceLevel="theme" onReset={() => { }} />
    </Accordion>

    <Accordion title="Shadow" icon={ZoomIn} isOpen={accordionStates.shadow} onToggle={() => toggleAccordion('shadow')}>
      <SelectField label="Shadow Preset" options={['None', 'Small', 'Medium', 'Large', 'Custom']} />
      <SliderField label="Blur" min={0} max={50} unit="px" />
      <ColorPicker label="Shadow Color" />
    </Accordion>

    <Accordion title="Effects" icon={Sparkles} isOpen={accordionStates.effects} onToggle={() => toggleAccordion('effects')}>
      <SliderField label="Opacity" min={0} max={100} unit="%" />
      <ToggleSwitch label="Blur effect" />
      <SelectField label="Blend Mode" options={['Normal', 'Multiply', 'Screen', 'Overlay']} />
    </Accordion>
  </div>
);

const AdvancedTab: React.FC<{ accordionStates: Record<string, boolean>; toggleAccordion: (key: string) => void }> = ({ accordionStates, toggleAccordion }) => (
  <div>
    <Accordion title="Visibility Rules" icon={Eye} isOpen={accordionStates.visibility} onToggle={() => toggleAccordion('visibility')}>
      <ToggleSwitch label="Show for logged-in users only" />
      <ToggleSwitch label="Hide on specific dates" />
      <SelectField label="Visibility Condition" options={['Always Show', 'Hide if Empty', 'Show on Scroll']} />
    </Accordion>

    <Accordion title="Animation Triggers" icon={Sparkles} isOpen={accordionStates.animation} onToggle={() => toggleAccordion('animation')}>
      <SelectField label="Entrance Animation" options={['None', 'Fade In', 'Slide Up', 'Zoom In']} />
      <SliderField label="Animation Duration" min={0} max={2000} unit="ms" />
      <SliderField label="Animation Delay" min={0} max={1000} unit="ms" />
    </Accordion>

    <Accordion title="Advanced Settings" icon={Settings} isOpen={accordionStates.advanced_settings} onToggle={() => toggleAccordion('advanced_settings')}>
      <TextField label="Custom CSS Class" placeholder="my-custom-class" />
      <TextField label="Element ID" placeholder="hero-section" />
      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <Lock size={16} className="text-yellow-600 flex-shrink-0" />
        <p className="text-xs text-yellow-700">Custom CSS editing is locked. Upgrade to unlock.</p>
      </div>
    </Accordion>

    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Code size={16} className="text-gray-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">SEO Metadata</h3>
          <p className="text-xs text-gray-500 mb-3">Configure search engine optimization settings</p>
          <TextField label="Meta Title" placeholder="Enter page title" />
          <div className="mt-3">
            <TextArea label="Meta Description" placeholder="Enter meta description" rows={2} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// TAB CONTENT COMPONENTS - BLOCK LEVEL
// ============================================

interface BlockContentTabProps {
  accordionStates: Record<string, boolean>;
  toggleAccordion: (key: string) => void;
  block: Block;
  sectionId: string;
  blockId: string;
  onUpdate: (sectionId: string, blockId: string, updates: Partial<Block>) => void;
}

const BlockContentTab: React.FC<BlockContentTabProps> = ({
  accordionStates,
  toggleAccordion,
  block,
  sectionId,
  blockId,
  onUpdate
}) => {
  const handleContentUpdate = (field: string, value: any) => {
    onUpdate(sectionId, blockId, {
      content: {
        ...block.content,
        [field]: value
      }
    });
  };

  const handleListItemUpdate = (index: number, value: string) => {
    const newItems = [...(block.content.items || [])];
    newItems[index] = value;
    onUpdate(sectionId, blockId, {
      content: {
        ...block.content,
        items: newItems
      }
    });
  };

  const handleAddListItem = () => {
    const newItems = [...(block.content.items || []), 'New item'];
    onUpdate(sectionId, blockId, {
      content: {
        ...block.content,
        items: newItems
      }
    });
  };

  const handleRemoveListItem = (index: number) => {
    const newItems = [...(block.content.items || [])];
    newItems.splice(index, 1);
    onUpdate(sectionId, blockId, {
      content: {
        ...block.content,
        items: newItems
      }
    });
  };

  // Check if block has editable content
  const hasEditableContent = ['heading', 'text', 'button', 'image', 'list', 'card', 'stat'].includes(block.type);

  if (!hasEditableContent) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center gap-3 text-center py-12">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <AlertCircle size={28} className="text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">No content settings available</p>
            <p className="text-xs text-gray-500">This block type has no editable content in this tab.</p>
          </div>
          <div className="mt-2 flex gap-2">
            <div className="px-3 py-1.5 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-600">💡 Try the <strong>Style</strong> tab</p>
            </div>
            <div className="px-3 py-1.5 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-600">or <strong>Advanced</strong></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Accordion title="Primary Content" icon={Type} isOpen={accordionStates.block_content} onToggle={() => toggleAccordion('block_content')}>
        {block.type === 'heading' && (
          <>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Heading Text</label>
              <input
                type="text"
                value={block.content.text || ''}
                onChange={(e) => handleContentUpdate('text', e.target.value)}
                placeholder="Enter heading"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 italic">Changes appear instantly in the preview</p>
            </div>
            <div className="space-y-2 mt-3">
              <label className="block text-xs font-medium text-gray-700">Heading Level</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={block.content.level || 'h2'}
                onChange={(e) => handleContentUpdate('level', e.target.value)}
              >
                <option value="h1">H1 - Largest</option>
                <option value="h2">H2 - Large</option>
                <option value="h3">H3 - Medium</option>
                <option value="h4">H4 - Small</option>
                <option value="h5">H5 - Smaller</option>
                <option value="h6">H6 - Smallest</option>
              </select>
            </div>
          </>
        )}
        {block.type === 'text' && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Text Content</label>
            <textarea
              value={block.content.text || ''}
              onChange={(e) => handleContentUpdate('text', e.target.value)}
              placeholder="Enter text content"
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
            />
            <p className="text-xs text-gray-500 italic">Supports plain text only</p>
          </div>
        )}
        {block.type === 'button' && (
          <>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Button Label</label>
              <input
                type="text"
                value={block.content.text || ''}
                onChange={(e) => handleContentUpdate('text', e.target.value)}
                placeholder="Click Here"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2 mt-3">
              <label className="block text-xs font-medium text-gray-700">Button Link</label>
              <input
                type="text"
                value={block.content.link || ''}
                onChange={(e) => handleContentUpdate('link', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center justify-between py-3 mt-3">
              <label className="text-xs font-medium text-gray-700">Open in new tab</label>
              <button
                onClick={() => handleContentUpdate('newTab', !block.content.newTab)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${block.content.newTab ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${block.content.newTab ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </button>
            </div>
          </>
        )}
        {block.type === 'image' && (
          <>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                value={block.content.src || ''}
                onChange={(e) => handleContentUpdate('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {block.content.src && (
                <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                  <img src={block.content.src} alt={block.content.alt || ''} className="w-full h-32 object-cover" />
                </div>
              )}
            </div>
            <div className="space-y-2 mt-3">
              <label className="block text-xs font-medium text-gray-700">Alt Text</label>
              <input
                type="text"
                value={block.content.alt || ''}
                onChange={(e) => handleContentUpdate('alt', e.target.value)}
                placeholder="Describe the image"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 italic">Important for accessibility</p>
            </div>
          </>
        )}
        {block.type === 'list' && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 mb-2">List Items</label>
            {block.content.items?.map((item: string, i: number) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListItemUpdate(i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleRemoveListItem(i)}
                  className="px-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddListItem}
              className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              + Add Item
            </button>
          </div>
        )}
        {block.type === 'card' && (
          <>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Card Title</label>
              <input
                type="text"
                value={block.content.title || ''}
                onChange={(e) => handleContentUpdate('title', e.target.value)}
                placeholder="Enter card title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2 mt-3">
              <label className="block text-xs font-medium text-gray-700">Description</label>
              <textarea
                value={block.content.description || ''}
                onChange={(e) => handleContentUpdate('description', e.target.value)}
                placeholder="Enter description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
              />
            </div>
          </>
        )}
        {block.type === 'stat' && (
          <>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Value</label>
              <input
                type="text"
                value={block.content.value || ''}
                onChange={(e) => handleContentUpdate('value', e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2 mt-3">
              <label className="block text-xs font-medium text-gray-700">Label</label>
              <input
                type="text"
                value={block.content.label || ''}
                onChange={(e) => handleContentUpdate('label', e.target.value)}
                placeholder="Students Helped"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </>
        )}
      </Accordion>

      {/* Content Editing Footer */}
      <div className="p-4 mt-4 bg-green-50/50 border-t border-green-100">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info size={12} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-green-700 font-medium mb-0.5">Live preview enabled</p>
            <p className="text-xs text-gray-600">Changes appear instantly in the canvas. No save required.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BlockStyleTabProps {
  accordionStates: Record<string, boolean>;
  toggleAccordion: (key: string) => void;
  block: Block;
  sectionId: string;
  blockId: string;
  onUpdate: (sectionId: string, blockId: string, updates: Partial<Block>) => void;
}

const BlockStyleTab: React.FC<BlockStyleTabProps> = ({
  accordionStates,
  toggleAccordion,
  block,
  sectionId,
  blockId,
  onUpdate
}) => {
  const handleStyleUpdate = (field: string, value: any) => {
    onUpdate(sectionId, blockId, {
      content: {
        ...block.content,
        style: {
          ...((block.content.style as any) || {}),
          [field]: value
        }
      }
    });
  };

  const blockStyle = (block.content.style as any) || {};

  return (
    <div>
      <Accordion title="Text & Colors" icon={Type} isOpen={accordionStates.block_style} onToggle={() => toggleAccordion('block_style')}>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-gray-700">Text Color</label>
              {!blockStyle.textColor && (
                <span className="text-xs text-gray-400 italic">Inherited</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="color"
                value={blockStyle.textColor || '#000000'}
                onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={blockStyle.textColor || '#000000'}
                onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Font Size</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="12"
                max="72"
                value={blockStyle.fontSize || 16}
                onChange={(e) => handleStyleUpdate('fontSize', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12 text-right">{blockStyle.fontSize || 16}px</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Text Align</label>
            <div className="flex gap-2">
              {['left', 'center', 'right'].map(align => (
                <button
                  key={align}
                  onClick={() => handleStyleUpdate('textAlign', align)}
                  className={`flex-1 px-3 py-2 border rounded-lg text-xs font-medium transition-colors ${(blockStyle.textAlign || 'left') === align
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                    }`}
                >
                  <AlignLeft size={14} className="mx-auto" style={{
                    transform: align === 'center' ? 'none' : align === 'right' ? 'scaleX(-1)' : 'none'
                  }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Accordion>

      <Accordion title="Background & Border" icon={Box} isOpen={accordionStates.block_bg || false} onToggle={() => toggleAccordion('block_bg')}>
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={blockStyle.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={blockStyle.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Border Radius</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="50"
                value={blockStyle.borderRadius || 0}
                onChange={(e) => handleStyleUpdate('borderRadius', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12 text-right">{blockStyle.borderRadius || 0}px</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Shadow</label>
            <select
              value={blockStyle.shadow || 'none'}
              onChange={(e) => handleStyleUpdate('shadow', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="none">None</option>
              <option value="soft">Soft Shadow</option>
              <option value="medium">Medium Shadow</option>
              <option value="strong">Strong Shadow</option>
            </select>
          </div>
        </div>
      </Accordion>

      <Accordion title="Spacing" icon={Move} isOpen={accordionStates.block_spacing || false} onToggle={() => toggleAccordion('block_spacing')}>
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Padding (Top/Bottom)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={blockStyle.paddingY || 16}
                onChange={(e) => handleStyleUpdate('paddingY', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12 text-right">{blockStyle.paddingY || 16}px</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Padding (Left/Right)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={blockStyle.paddingX || 16}
                onChange={(e) => handleStyleUpdate('paddingX', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12 text-right">{blockStyle.paddingX || 16}px</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 italic mt-2">Margin is controlled at section level</p>
        </div>
      </Accordion>

      {/* Style Scope Footer */}
      <div className="p-4 mt-4 bg-blue-50/50 border-t border-blue-100">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info size={12} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-blue-700 font-medium mb-0.5">Block-level styling</p>
            <p className="text-xs text-gray-600">Changes here affect only this block. Use Theme Settings for site-wide styles.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BlockAdvancedTabProps {
  accordionStates: Record<string, boolean>;
  toggleAccordion: (key: string) => void;
  block: Block;
  sectionId: string;
  blockId: string;
  onUpdate: (sectionId: string, blockId: string, updates: Partial<Block>) => void;
}

const BlockAdvancedTab: React.FC<BlockAdvancedTabProps> = ({
  accordionStates,
  toggleAccordion,
  block,
  sectionId,
  blockId,
  onUpdate
}) => {
  const handleAdvancedUpdate = (field: string, value: any) => {
    onUpdate(sectionId, blockId, {
      content: {
        ...block.content,
        advanced: {
          ...((block.content.advanced as any) || {}),
          [field]: value
        }
      }
    });
  };

  const advancedSettings = (block.content.advanced as any) || {};

  return (
    <div>
      <Accordion title="Device Visibility" icon={Eye} isOpen={accordionStates.block_advanced} onToggle={() => toggleAccordion('block_advanced')}>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Monitor size={16} className="text-gray-500" />
              <label className="text-xs font-medium text-gray-700">Show on Desktop</label>
            </div>
            <button
              onClick={() => handleAdvancedUpdate('showDesktop', !advancedSettings.showDesktop)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${advancedSettings.showDesktop !== false ? 'bg-purple-600' : 'bg-gray-300'
                }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${advancedSettings.showDesktop !== false ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Tablet size={16} className="text-gray-500" />
              <label className="text-xs font-medium text-gray-700">Show on Tablet</label>
            </div>
            <button
              onClick={() => handleAdvancedUpdate('showTablet', !advancedSettings.showTablet)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${advancedSettings.showTablet !== false ? 'bg-purple-600' : 'bg-gray-300'
                }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${advancedSettings.showTablet !== false ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-gray-500" />
              <label className="text-xs font-medium text-gray-700">Show on Mobile</label>
            </div>
            <button
              onClick={() => handleAdvancedUpdate('showMobile', !advancedSettings.showMobile)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${advancedSettings.showMobile !== false ? 'bg-purple-600' : 'bg-gray-300'
                }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${advancedSettings.showMobile !== false ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
          </div>
        </div>
      </Accordion>

      <Accordion title="Animation" icon={Sparkles} isOpen={accordionStates.block_animation || false} onToggle={() => toggleAccordion('block_animation')}>
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Entrance Animation</label>
            <select
              value={advancedSettings.animation || 'none'}
              onChange={(e) => handleAdvancedUpdate('animation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="none">None</option>
              <option value="fade">Fade In</option>
              <option value="slide-up">Slide Up</option>
              <option value="slide-down">Slide Down</option>
              <option value="zoom">Zoom In</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Animation Delay (ms)</label>
            <input
              type="number"
              min="0"
              max="2000"
              step="100"
              value={advancedSettings.animationDelay || 0}
              onChange={(e) => handleAdvancedUpdate('animationDelay', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </Accordion>

      <Accordion title="Custom Attributes" icon={Code} isOpen={accordionStates.block_custom || false} onToggle={() => toggleAccordion('block_custom')}>
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Custom ID</label>
            <input
              type="text"
              value={advancedSettings.customId || ''}
              onChange={(e) => handleAdvancedUpdate('customId', e.target.value)}
              placeholder="my-block-id"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 italic">Used for anchors and styling</p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Custom Classes</label>
            <input
              type="text"
              value={advancedSettings.customClasses || ''}
              onChange={(e) => handleAdvancedUpdate('customClasses', e.target.value)}
              placeholder="class1 class2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 italic">Space-separated CSS classes</p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-3">
            <p className="text-xs text-blue-700">
              <strong>Tip:</strong> Advanced settings affect layout and behavior. Changes are visual only and won&apos;t persist after refresh.
            </p>
          </div>
        </div>
      </Accordion>

      {/* Advanced Scope Footer */}
      <div className="p-4 mt-4 bg-purple-50/50 border-t border-purple-100">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Code size={12} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-purple-700 font-medium mb-0.5">Power user settings</p>
            <p className="text-xs text-gray-600">These settings are optional. Most blocks work perfectly without customization.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// THEME SETTINGS PANEL COMPONENT
// ============================================

interface ThemeSettingsPanelProps {
  activeTab: 'colors' | 'typography' | 'buttons' | 'forms' | 'layout' | 'advanced' | 'presets';
  onTabChange: (tab: 'colors' | 'typography' | 'buttons' | 'forms' | 'layout' | 'advanced' | 'presets') => void;
}

const ThemeSettingsPanel: React.FC<ThemeSettingsPanelProps> = ({ activeTab, onTabChange }) => {
  const [accordionStates, setAccordionStates] = useState<Record<string, boolean>>({
    brand_colors: true,
    neutral_palette: false,
    semantic_colors: false,
    font_families: true,
    text_styles: false,
    button_variants: true,
    form_inputs: true,
    spacing_system: true,
    theme_advanced: false
  });

  const toggleAccordion = (key: string) => {
    setAccordionStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Sticky Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        {/* MODE HEADER STRIP - Theme Mode */}
        <div className="px-4 py-3 border-b border-gray-100 bg-purple-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Palette size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-xs text-purple-700 uppercase tracking-wide font-semibold">Theme Settings</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="px-1.5 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-full cursor-help">
                      GLOBAL
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Changes affect all pages
                  </TooltipContent>
                </Tooltip>
              </div>
              <h2 className="text-base font-semibold text-[#253154] mb-0.5">Global Styles</h2>
              <p className="text-xs text-gray-500">Applies globally across the site</p>
            </div>
          </div>
        </div>

        {/* Preview Awareness Banner */}
        <div className="px-4 py-2 bg-blue-50/50 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-blue-600 flex-shrink-0" />
            <p className="text-xs text-blue-700">Previewing theme changes</p>
          </div>
        </div>

        {/* DIVIDER - Separates Theme from Section/Block editing */}
        <div className="h-1 bg-gradient-to-b from-purple-100/50 to-transparent"></div>

        {/* Theme Tabs - Vertical List */}
        <div className="border-b border-gray-200">
          <ThemeTabButton label="Colors" icon={Palette} isActive={activeTab === 'colors'} onClick={() => onTabChange('colors')} />
          <ThemeTabButton label="Typography" icon={Type} isActive={activeTab === 'typography'} onClick={() => onTabChange('typography')} />
          <ThemeTabButton label="Buttons" icon={MousePointer} isActive={activeTab === 'buttons'} onClick={() => onTabChange('buttons')} />
          <ThemeTabButton label="Forms" icon={Box} isActive={activeTab === 'forms'} onClick={() => onTabChange('forms')} />
          <ThemeTabButton label="Layout & Spacing" icon={Layout} isActive={activeTab === 'layout'} onClick={() => onTabChange('layout')} />
          <ThemeTabButton label="Presets" icon={Star} isActive={activeTab === 'presets'} onClick={() => onTabChange('presets')} />
          <ThemeTabButton label="Advanced" icon={Code} isActive={activeTab === 'advanced'} onClick={() => onTabChange('advanced')} />

          {/* Theme Tab Helper */}
          <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {activeTab === 'colors' && 'Define your brand color palette'}
              {activeTab === 'typography' && 'Set text styles and font families'}
              {activeTab === 'buttons' && 'Customize button appearance'}
              {activeTab === 'forms' && 'Style form inputs and controls'}
              {activeTab === 'layout' && 'Configure spacing and breakpoints'}
              {activeTab === 'presets' && 'Quick-start style templates'}
              {activeTab === 'advanced' && 'Technical and export options'}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeTab === 'colors' && <ColorsTab accordionStates={accordionStates} toggleAccordion={toggleAccordion} />}
        {activeTab === 'typography' && <TypographyTab accordionStates={accordionStates} toggleAccordion={toggleAccordion} />}
        {activeTab === 'buttons' && <ButtonsTab accordionStates={accordionStates} toggleAccordion={toggleAccordion} />}
        {activeTab === 'forms' && <FormsTab accordionStates={accordionStates} toggleAccordion={toggleAccordion} />}
        {activeTab === 'layout' && <LayoutSpacingTab accordionStates={accordionStates} toggleAccordion={toggleAccordion} />}
        {activeTab === 'presets' && <EnhancedPresetsTab accordionStates={accordionStates} toggleAccordion={toggleAccordion} />}
        {activeTab === 'advanced' && <ThemeAdvancedTab accordionStates={accordionStates} toggleAccordion={toggleAccordion} />}
      </div>
    </>
  );
};

// Theme Tab Button (Vertical Style)
const ThemeTabButton: React.FC<{ label: string; icon: React.ElementType; isActive: boolean; onClick: () => void }> = ({ label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${isActive ? 'bg-purple-50 border-l-3 border-l-purple-600 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
      }`}
  >
    <Icon size={16} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// Modified Indicator Component
const ModifiedIndicator: React.FC<{ isModified?: boolean }> = ({ isModified = false }) => (
  isModified ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 cursor-help" />
      </TooltipTrigger>
      <TooltipContent side="top">
        Modified from default
      </TooltipContent>
    </Tooltip>
  ) : null
);

// Color Swatch Component
const ColorSwatch: React.FC<{ label: string; color: string; usage?: string; onReset?: () => void; isModified?: boolean }> = ({ label, color, usage, onReset, isModified = false }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <ModifiedIndicator isModified={isModified} />
      </div>
      {onReset && (
        <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">Reset</button>
      )}
    </div>
    <div className="flex items-center gap-2">
      <div
        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1">
        <input
          type="text"
          defaultValue={color}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
        />
        {usage && <p className="text-xs text-gray-500 mt-1">{usage}</p>}
      </div>
    </div>
  </div>
);

// Typography Style Row
const TypographyStyleRow: React.FC<{ label: string; size: string; weight: string; lineHeight: string }> = ({ label, size, weight, lineHeight }) => (
  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <button className="text-xs text-purple-600 hover:text-purple-700">Edit</button>
    </div>
    <div className="grid grid-cols-3 gap-2 text-xs">
      <div>
        <p className="text-gray-500 mb-1">Size</p>
        <p className="font-mono text-gray-700">{size}</p>
      </div>
      <div>
        <p className="text-gray-500 mb-1">Weight</p>
        <p className="font-mono text-gray-700">{weight}</p>
      </div>
      <div>
        <p className="text-gray-500 mb-1">Line H.</p>
        <p className="font-mono text-gray-700">{lineHeight}</p>
      </div>
    </div>
  </div>
);

// Button Preview Component
const ButtonPreview: React.FC<{ variant: string; bgColor: string; textColor: string }> = ({ variant, bgColor, textColor }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700 capitalize">{variant}</span>
      <button className="text-xs text-purple-600 hover:text-purple-700">Edit</button>
    </div>
    <div className="flex gap-2">
      <button
        className="px-4 py-2 rounded-lg font-medium text-sm transition-all"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        Default
      </button>
      <button
        className="px-4 py-2 rounded-lg font-medium text-sm transition-all opacity-80"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        Hover
      </button>
      <button
        className="px-4 py-2 rounded-lg font-medium text-sm transition-all opacity-40 cursor-not-allowed"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        Disabled
      </button>
    </div>
    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-200">
      <div>
        <p className="text-gray-500 mb-1">Background</p>
        <input type="text" defaultValue={bgColor} className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-mono" />
      </div>
      <div>
        <p className="text-gray-500 mb-1">Text</p>
        <input type="text" defaultValue={textColor} className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-mono" />
      </div>
    </div>
  </div>
);

// ============================================
// THEME TAB CONTENT COMPONENTS
// ============================================

const ColorsTab: React.FC<{ accordionStates: Record<string, boolean>; toggleAccordion: (key: string) => void }> = ({ accordionStates, toggleAccordion }) => (
  <div>
    {/* Brand Colors Card */}
    <Accordion title="Brand Colors" icon={Palette} isOpen={accordionStates.brand_colors} onToggle={() => toggleAccordion('brand_colors')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Brand Identity</h4>
        <p className="text-xs text-gray-500">Primary colors representing your brand</p>
      </div>
      <ColorSwatch label="Primary" color="#0e042f" usage="Used in buttons, links, headers" onReset={() => { }} isModified={true} />
      <ColorSwatch label="Secondary" color="#253154" usage="Used in secondary buttons, accents" onReset={() => { }} />
      <ColorSwatch label="Accent" color="#8B5CF6" usage="Used for highlights, CTAs" onReset={() => { }} isModified={true} />

      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            This cannot be undone
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500 mt-1.5 text-center">Resets all values in this section</p>
      </div>
    </Accordion>

    {/* Neutral Palette Card */}
    <Accordion title="Neutral Palette" icon={Box} isOpen={accordionStates.neutral_palette} onToggle={() => toggleAccordion('neutral_palette')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Surface & Text Colors</h4>
        <p className="text-xs text-gray-500">Background, text, and UI element colors</p>
      </div>
      <ColorSwatch label="Background" color="#FFFFFF" usage="Page background" />
      <ColorSwatch label="Surface" color="#F8FAFC" usage="Cards, panels" />
      <ColorSwatch label="Border" color="#E2E8F0" usage="Dividers, borders" isModified={true} />
      <ColorSwatch label="Text Primary" color="#1F2937" usage="Main text content" />
      <ColorSwatch label="Text Secondary" color="#6B7280" usage="Supporting text" />
      <ColorSwatch label="Muted" color="#9CA3AF" usage="Disabled, placeholders" />

      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            This cannot be undone
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500 mt-1.5 text-center">Resets all values in this section</p>
      </div>
    </Accordion>

    {/* Semantic Colors Card */}
    <Accordion title="Semantic Colors" icon={AlertCircle} isOpen={accordionStates.semantic_colors} onToggle={() => toggleAccordion('semantic_colors')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">State & Feedback Colors</h4>
        <p className="text-xs text-gray-500">Colors for alerts, notifications, and status</p>
      </div>
      <ColorSwatch label="Success" color="#10B981" usage="Success messages, confirmations" />
      <ColorSwatch label="Warning" color="#F59E0B" usage="Warning alerts" />
      <ColorSwatch label="Error" color="#EF4444" usage="Error states, validation" />
      <ColorSwatch label="Info" color="#3B82F6" usage="Informational messages" />

      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            This cannot be undone
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500 mt-1.5 text-center">Resets all values in this section</p>
      </div>
    </Accordion>
  </div>
);

const TypographyTab: React.FC<{ accordionStates: Record<string, boolean>; toggleAccordion: (key: string) => void }> = ({ accordionStates, toggleAccordion }) => (
  <div>
    <Accordion title="Font Families" icon={Type} isOpen={accordionStates.font_families} onToggle={() => toggleAccordion('font_families')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Typography System</h4>
        <p className="text-xs text-gray-500">Set primary and secondary font families</p>
      </div>
      <SelectField label="Primary Font" options={['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins']} />
      <SelectField label="Secondary Font (Optional)" options={['None', 'Inter', 'Roboto', 'Open Sans']} />
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Primary font</strong> is used for headings and body text by default.
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            This cannot be undone
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500 mt-1.5 text-center">Resets all values in this section</p>
      </div>
    </Accordion>

    <Accordion title="Text Styles" icon={Layers} isOpen={accordionStates.text_styles} onToggle={() => toggleAccordion('text_styles')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Text Size & Hierarchy</h4>
        <p className="text-xs text-gray-500">Define heading and body text styles</p>
      </div>
      <div className="space-y-3">
        <TypographyStyleRow label="H1 - Main Heading" size="48px" weight="700" lineHeight="1.2" />
        <TypographyStyleRow label="H2 - Section Heading" size="36px" weight="700" lineHeight="1.3" />
        <TypographyStyleRow label="H3 - Subsection" size="28px" weight="600" lineHeight="1.4" />
        <TypographyStyleRow label="Body - Paragraph" size="16px" weight="400" lineHeight="1.6" />
        <TypographyStyleRow label="Small - Fine Print" size="14px" weight="400" lineHeight="1.5" />
        <TypographyStyleRow label="Caption - Meta Info" size="12px" weight="500" lineHeight="1.4" />
      </div>
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600">
          Blocks inherit these text styles automatically. You can override per-block in the Style tab.
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            This cannot be undone
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500 mt-1.5 text-center">Resets all values in this section</p>
      </div>
    </Accordion>
  </div>
);

const ButtonsTab: React.FC<{ accordionStates: Record<string, boolean>; toggleAccordion: (key: string) => void }> = ({ accordionStates, toggleAccordion }) => (
  <div>
    <Accordion title="Button Variants" icon={MousePointer} isOpen={accordionStates.button_variants} onToggle={() => toggleAccordion('button_variants')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Button Styles</h4>
        <p className="text-xs text-gray-500">Customize appearance for each button variant</p>
      </div>
      <div className="space-y-6">
        <ButtonPreview variant="Primary" bgColor="#0e042f" textColor="#FFFFFF" />
        <ButtonPreview variant="Secondary" bgColor="#253154" textColor="#FFFFFF" />
        <ButtonPreview variant="Outline" bgColor="transparent" textColor="#0e042f" />
        <ButtonPreview variant="Ghost" bgColor="transparent" textColor="#6B7280" />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            This cannot be undone
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500 mt-1.5 text-center">Resets all values in this section</p>
      </div>
    </Accordion>

    <Accordion title="Global Button Settings" icon={Settings} isOpen={false} onToggle={() => toggleAccordion('button_global')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Default Button Attributes</h4>
        <p className="text-xs text-gray-500">Apply to all button variants</p>
      </div>
      <SliderField label="Border Radius" min={0} max={50} unit="px" />
      <SliderField label="Default Padding (Horizontal)" min={8} max={48} unit="px" />
      <SliderField label="Default Padding (Vertical)" min={4} max={24} unit="px" />
      <SelectField label="Hover Effect" options={['Darken', 'Lighten', 'Shadow', 'Scale']} />

      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            This cannot be undone
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500 mt-1.5 text-center">Resets all values in this section</p>
      </div>
    </Accordion>
  </div>
);

const FormsTab: React.FC<{ accordionStates: Record<string, boolean>; toggleAccordion: (key: string) => void }> = ({ accordionStates, toggleAccordion }) => (
  <div>
    <Accordion title="Form Input Styles" icon={Box} isOpen={accordionStates.form_inputs} onToggle={() => toggleAccordion('form_inputs')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Input Field Styling</h4>
        <p className="text-xs text-gray-500">Customize form inputs, dropdowns, and textareas</p>
      </div>
      <div className="space-y-4">
        <SliderField label="Input Height" min={32} max={64} unit="px" />
        <SliderField label="Border Radius" min={0} max={24} unit="px" />
        <ColorPicker label="Border Color" />
        <ColorPicker label="Focus Color" />
        <ColorPicker label="Error Color" />

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-3">Placeholder</p>
          <ColorPicker label="Placeholder Color" />
          <SelectField label="Placeholder Style" options={['Normal', 'Italic']} />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-3">Preview</p>
          <input
            type="text"
            placeholder="Email address"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-all"
          />
          <input
            type="text"
            value="Error state"
            className="w-full px-3 py-2 border-2 border-red-500 rounded-lg outline-none mt-2"
            readOnly
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            This cannot be undone
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500 mt-1.5 text-center">Resets all values in this section</p>
      </div>
    </Accordion>

    <Accordion title="Components Affected" icon={Layers} isOpen={false} onToggle={() => toggleAccordion('form_components')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Applied Components</h4>
        <p className="text-xs text-gray-500">These form elements inherit the styles above</p>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-700">Text Inputs</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-700">Dropdowns</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-700">Textareas</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-700">Toggles</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-700">Checkboxes</span>
        </div>
      </div>
    </Accordion>
  </div>
);

const LayoutSpacingTab: React.FC<{ accordionStates: Record<string, boolean>; toggleAccordion: (key: string) => void }> = ({ accordionStates, toggleAccordion }) => (
  <div>
    <Accordion title="Spacing System" icon={Move} isOpen={accordionStates.spacing_system} onToggle={() => toggleAccordion('spacing_system')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Spacing & Rhythm</h4>
        <p className="text-xs text-gray-500">Control vertical spacing and container widths</p>
      </div>
      <SelectField label="Base Spacing Unit" options={['4px (Tight)', '8px (Standard)', '12px (Relaxed)']} />
      <SliderField label="Section Vertical Spacing" min={32} max={128} unit="px" />
      <SliderField label="Container Max Width" min={960} max={1920} unit="px" />
      <SliderField label="Grid Gutter Size" min={8} max={48} unit="px" />

      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs font-medium text-gray-700 mb-3">Spacing Preview</p>
        <div className="space-y-4">
          <div className="h-16 bg-purple-100 rounded flex items-center justify-center text-xs text-purple-700 font-medium">
            Section
          </div>
          <div className="h-12 bg-blue-100 rounded flex items-center justify-center text-xs text-blue-700 font-medium">
            Block
          </div>
          <div className="h-12 bg-blue-100 rounded flex items-center justify-center text-xs text-blue-700 font-medium">
            Block
          </div>
          <div className="h-16 bg-purple-100 rounded flex items-center justify-center text-xs text-purple-700 font-medium">
            Section
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Wireframe showing vertical rhythm with current spacing values
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            This cannot be undone
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500 mt-1.5 text-center">Resets all values in this section</p>
      </div>
    </Accordion>

    <Accordion title="Responsive Breakpoints" icon={Monitor} isOpen={false} onToggle={() => toggleAccordion('breakpoints')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Device Breakpoints</h4>
        <p className="text-xs text-gray-500">Define responsive breakpoint values</p>
      </div>
      <div className="space-y-3">
        <TextField label="Desktop (min-width)" defaultValue="1024px" helpText="Large screens" />
        <TextField label="Tablet (min-width)" defaultValue="768px" helpText="Medium screens" />
        <TextField label="Mobile (max-width)" defaultValue="767px" helpText="Small screens" />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            This cannot be undone
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500 mt-1.5 text-center">Resets all values in this section</p>
      </div>
    </Accordion>
  </div>
);

const ThemeAdvancedTab: React.FC<{ accordionStates: Record<string, boolean>; toggleAccordion: (key: string) => void }> = ({ accordionStates, toggleAccordion }) => (
  <div>
    {/* Danger Zone - Custom CSS */}
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-3 border-b border-red-200 bg-red-50/30">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
          <h3 className="text-sm font-semibold text-red-900">Danger Zone</h3>
        </div>
      </div>
      <Accordion title="Custom CSS" icon={Code} isOpen={accordionStates.theme_advanced} onToggle={() => toggleAccordion('theme_advanced')}>
        <div className="mb-3 pb-3 border-b border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Advanced CSS Customization</h4>
          <p className="text-xs text-red-600 font-medium">Advanced users only. Incorrect CSS may break layouts.</p>
        </div>
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700">
              <strong>Global Scope:</strong> Applies globally across all pages
            </p>
          </div>
        </div>
        <textarea
          placeholder="/* Your custom CSS here */"
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none bg-gray-900 text-green-400"
        />
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-3">
          <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
          <p className="text-xs text-red-700">Custom CSS may override theme settings and affect site performance.</p>
        </div>
      </Accordion>
    </div>

    <Accordion title="Animation Settings" icon={Sparkles} isOpen={false} onToggle={() => toggleAccordion('animations')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Motion & Transitions</h4>
        <p className="text-xs text-gray-500">Configure default animation behavior</p>
      </div>
      <SelectField label="Default Animation Easing" options={['Ease', 'Ease-In', 'Ease-Out', 'Ease-In-Out', 'Linear']} />
      <SliderField label="Default Animation Duration" min={100} max={1000} unit="ms" />
      <ToggleSwitch label="Reduce motion for accessibility" helpText="Respects user's motion preferences" />

      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            This cannot be undone
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500 mt-1.5 text-center">Resets all values in this section</p>
      </div>
    </Accordion>

    <Accordion title="Global Border Radius" icon={Box} isOpen={false} onToggle={() => toggleAccordion('border_radius')}>
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-0.5">Corner Roundness</h4>
        <p className="text-xs text-gray-500">Set default border radius for all elements</p>
      </div>
      <SelectField label="Border Radius Scale" options={['None (0px)', 'Small (4px)', 'Medium (8px)', 'Large (12px)', 'Extra Large (16px)']} />
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="aspect-square bg-purple-100 border-2 border-purple-500" style={{ borderRadius: '0px' }}>
          <p className="text-center text-xs text-purple-700 pt-4">None</p>
        </div>
        <div className="aspect-square bg-purple-100 border-2 border-purple-500" style={{ borderRadius: '8px' }}>
          <p className="text-center text-xs text-purple-700 pt-4">Medium</p>
        </div>
        <div className="aspect-square bg-purple-100 border-2 border-purple-500" style={{ borderRadius: '16px' }}>
          <p className="text-center text-xs text-purple-700 pt-4">Large</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
              Reset to Defaults
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            This cannot be undone
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500 mt-1.5 text-center">Resets all values in this section</p>
      </div>
    </Accordion>

    {/* Global Reset - Danger Zone */}
    <div className="bg-white border-b border-gray-200 p-4 border-t-2 border-t-red-200">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
          <RotateCcw size={16} className="text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Reset Theme to Defaults</h3>
          <p className="text-xs text-gray-500 mb-3">This will reset all theme settings to default values. This action cannot be undone.</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-full px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                Reset All Theme Settings
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              This cannot be undone
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// PRESETS TAB COMPONENT
// ============================================

const PresetsTab: React.FC<{ accordionStates: Record<string, boolean>; toggleAccordion: (key: string) => void }> = ({ accordionStates, toggleAccordion }) => {
  const [showCreatePresetModal, setShowCreatePresetModal] = useState(false);

  // Mock preset data - separated into default and custom
  const defaultPresets = [
    { id: '1', name: 'Default Theme', description: 'System default theme', isActive: true, isSystem: true },
  ];

  const customPresets = [
    { id: '2', name: 'Professional Blue', description: 'Corporate color scheme', isActive: false, isSystem: false },
    { id: '3', name: 'Vibrant Purple', description: 'Bold and modern', isActive: false, isSystem: false },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Theme Presets</h3>
            <p className="text-xs text-gray-500 mt-0.5">Presets apply multiple theme settings at once</p>
          </div>
          <button
            onClick={() => setShowCreatePresetModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium"
          >
            <Plus size={14} />
            Save Current
          </button>
        </div>
      </div>

      {/* Default Presets Section */}
      <div className="bg-gray-50/50">
        <div className="px-4 py-2 border-b border-gray-200 bg-white/50">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-gray-600" />
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Default Presets</h4>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {defaultPresets.map((preset) => (
            <PresetCard key={preset.id} preset={preset} />
          ))}
        </div>
      </div>

      {/* Custom Presets Section */}
      <div className="bg-gray-50/50">
        <div className="px-4 py-2 border-b border-gray-200 bg-white/50">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-gray-600" />
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Custom Presets</h4>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {customPresets.length > 0 ? (
            customPresets.map((preset) => (
              <PresetCard key={preset.id} preset={preset} />
            ))
          ) : (
            <div className="text-center py-8">
              <Star size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs text-gray-500">No custom presets yet</p>
              <p className="text-xs text-gray-400 mt-1">Click &quot;Save Current&quot; to create one</p>
            </div>
          )}
        </div>
      </div>

      {/* System Info */}
      <div className="p-4 bg-blue-50 border-t border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Info size={16} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">About Presets</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              Presets save your complete theme configuration including colors, typography, buttons, and spacing.
              System presets cannot be deleted but can be duplicated and modified.
            </p>
          </div>
        </div>
      </div>

      {/* Create Preset Modal */}
      {showCreatePresetModal && (
        <CreatePresetModal onClose={() => setShowCreatePresetModal(false)} />
      )}
    </div>
  );
};

// Preset Card Component
const PresetCard: React.FC<{ preset: any }> = ({ preset }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={`p-4 bg-white border-2 rounded-xl transition-all hover:shadow-md ${preset.isActive ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
      }`}>
      <div className="flex items-start gap-3">
        {/* Visual Swatch Preview */}
        <div className="flex gap-1 flex-shrink-0">
          <div className="w-3 h-12 rounded bg-[#0e042f]" />
          <div className="w-3 h-12 rounded bg-[#253154]" />
          <div className="w-3 h-12 rounded bg-[#8B5CF6]" />
        </div>

        {/* Preset Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-700">{preset.name}</h4>
            {preset.isActive ? (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                APPLIED
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">
                NOT APPLIED
              </span>
            )}
            {preset.isSystem && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                SYSTEM
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">{preset.description}</p>
          <p className="text-[10px] text-gray-400 mt-2">Last modified 2 hours ago</p>
        </div>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={16} className="text-gray-600" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
              {!preset.isActive && (
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Star size={14} />
                  Apply Preset
                </button>
              )}
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Copy size={14} />
                Duplicate
              </button>
              {!preset.isSystem && (
                <>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Type size={14} />
                    Rename
                  </button>
                  <div className="border-t border-gray-200 my-1" />
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <Trash2 size={14} />
                    Delete
                  </button>
                </>
              )}
              {preset.isSystem && (
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <RotateCcw size={14} />
                  Reset to System Default
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Create Preset Modal
const CreatePresetModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#253154]">Save Theme Preset</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Plus size={20} className="rotate-45 text-gray-600" />
        </button>
      </div>
      <div className="p-6 space-y-4">
        <TextField label="Preset Name" placeholder="e.g. Professional Blue" />
        <TextArea label="Description (Optional)" placeholder="Describe this theme preset..." rows={3} />
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            This will save your current theme configuration including colors, typography, buttons, forms, and spacing settings.
          </p>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
          Cancel
        </button>
        <button className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Save Preset
        </button>
      </div>
    </div>
  </div>
);

// ============================================
// SECTION PRESET DROPDOWN
// ============================================

const SectionPresetDropdown: React.FC<{ sectionName: string }> = ({ sectionName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sectionPresets = [
    { id: 'default', name: 'Default', isActive: true },
    { id: 'hero-1', name: 'Hero - Centered', isActive: false },
    { id: 'hero-2', name: 'Hero - Split', isActive: false },
    { id: 'hero-3', name: 'Hero - Minimal', isActive: false },
  ];

  return (
    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <div className="flex items-center gap-2">
            <Star size={14} className="text-blue-600" />
            <span className="text-xs font-medium text-gray-700">Preset: Default</span>
          </div>
          <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-2">
              <div className="px-3 py-2 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-700">Section Presets</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Reusable layout + style combinations</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {sectionPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setIsOpen(false)}
                    className="w-full px-3 py-2.5 text-left hover:bg-blue-50 flex items-center justify-between transition-colors"
                  >
                    <span className="text-sm text-gray-700">{preset.name}</span>
                    {preset.isActive && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-1 pt-1">
                <button className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2 text-blue-600 text-sm font-medium transition-colors">
                  <Plus size={14} />
                  Save as New Preset
                </button>
              </div>

              {/* Reset Options */}
              <div className="border-t border-gray-200 mt-1 pt-1 px-3 py-2">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Reset Options</p>
                <button className="w-full px-2 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-600 text-xs rounded transition-colors">
                  <RotateCcw size={12} />
                  Reset to Preset Default
                </button>
                <button className="w-full px-2 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-600 text-xs rounded transition-colors">
                  <Shield size={12} />
                  Reset to Theme Default
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// BLOCK PRESET SELECTOR
// ============================================

const BlockPresetSelector: React.FC<{ blockType: string }> = ({ blockType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const blockPresets = {
    button: [
      { id: 'default', name: 'Default Button', variant: 'Standard', icon: MousePointer },
      { id: 'primary', name: 'Primary CTA', variant: 'Bold', icon: Star },
      { id: 'secondary', name: 'Secondary', variant: 'Subtle', icon: Circle },
      { id: 'ghost', name: 'Ghost Button', variant: 'Minimal', icon: Circle },
    ],
    text: [
      { id: 'default', name: 'Body Text', variant: 'Standard', icon: Type },
      { id: 'heading', name: 'Heading', variant: 'Bold', icon: Type },
      { id: 'caption', name: 'Caption', variant: 'Small', icon: Type },
    ],
    image: [
      { id: 'default', name: 'Standard Image', variant: 'Responsive', icon: Image },
      { id: 'rounded', name: 'Rounded Image', variant: 'Styled', icon: Image },
    ]
  };

  const presets = blockPresets[blockType as keyof typeof blockPresets] || blockPresets.button;

  return (
    <div className="px-4 py-2 border-b border-gray-100 bg-green-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-sm"
        >
          <div className="flex items-center gap-2">
            <Star size={14} className="text-green-600" />
            <span className="text-xs font-medium text-gray-700">Block Preset: Default</span>
          </div>
          <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-2">
              <div className="px-3 py-2 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-700">Block Presets</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Reusable micro-patterns for {blockType} blocks</p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                {presets.map((preset) => {
                  const PresetIcon = preset.icon;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setIsOpen(false)}
                      className="p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-green-500 transition-all text-left"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <PresetIcon size={14} className="text-gray-600" />
                        <span className="text-xs font-semibold text-gray-700">{preset.name}</span>
                      </div>
                      <p className="text-[10px] text-gray-500">{preset.variant}</p>
                    </button>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 px-3 py-2 space-y-1">
                <button className="w-full px-2 py-1.5 text-left hover:bg-green-50 flex items-center gap-2 text-green-600 text-xs font-medium rounded transition-colors">
                  <Plus size={12} />
                  Save as New Preset
                </button>
                <button className="w-full px-2 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-600 text-xs rounded transition-colors">
                  <Copy size={12} />
                  Duplicate Current
                </button>
              </div>

              {/* Reset Options */}
              <div className="border-t border-gray-200 mt-1 pt-1 px-3 py-2">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Reset Options</p>
                <button className="w-full px-2 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-600 text-xs rounded transition-colors">
                  <RotateCcw size={12} />
                  Reset to Section Default
                </button>
                <button className="w-full px-2 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-600 text-xs rounded transition-colors">
                  <Layout size={12} />
                  Reset to Theme Default
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// RESET CONFIRMATION MODAL
// ============================================

const ResetConfirmationModal: React.FC<{
  type: 'field' | 'block' | 'section' | 'theme';
  targetName: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ type, targetName, onConfirm, onCancel }) => {
  const config = {
    field: {
      title: 'Reset Field',
      message: `Reset "${targetName}" to its default value?`,
      impact: 'This field will revert to the parent level default.',
      danger: false,
      confirmText: 'Reset Field'
    },
    block: {
      title: 'Reset Block',
      message: `Reset this ${targetName} block to default?`,
      impact: 'All customizations for this block will be lost. The block will revert to section defaults.',
      danger: false,
      confirmText: 'Reset Block'
    },
    section: {
      title: 'Reset Section',
      message: `Reset the entire "${targetName}" section?`,
      impact: 'All blocks and customizations in this section will be reset to theme defaults. This affects layout, style, and content settings.',
      danger: true,
      confirmText: 'Reset Section'
    },
    theme: {
      title: 'Reset Theme to System Defaults',
      message: 'This will reset your entire theme configuration.',
      impact: 'All theme settings including colors, typography, buttons, forms, and spacing will be reset to system defaults. This action cannot be undone.',
      danger: true,
      confirmText: 'Reset Theme'
    }
  };

  const { title, message, impact, danger, confirmText } = config[type];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${danger ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${danger ? 'bg-red-100' : 'bg-blue-100'
              }`}>
              <RotateCcw size={20} className={danger ? 'text-red-600' : 'text-blue-600'} />
            </div>
            <h2 className={`text-lg font-semibold ${danger ? 'text-red-900' : 'text-blue-900'}`}>{title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 font-medium">{message}</p>
          <p className="text-sm text-gray-600">{impact}</p>

          {/* Hierarchy Visualization */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-3">Inheritance Hierarchy</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-gray-500" />
                <span className="text-xs text-gray-600">System Default (Platform)</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Palette size={14} className="text-purple-500" />
                <span className="text-xs text-gray-600">Theme Settings</span>
              </div>
              <div className="flex items-center gap-2 ml-8">
                <Layout size={14} className="text-blue-500" />
                <span className="text-xs text-gray-600">Section Defaults</span>
              </div>
              <div className="flex items-center gap-2 ml-12">
                <Star size={14} className="text-orange-500" />
                <span className="text-xs text-gray-600">Block Overrides (Custom)</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-300">
              <p className="text-[10px] text-gray-500">
                Resetting will revert to the parent level in this hierarchy
              </p>
            </div>
          </div>

          {danger && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800">
                <strong>Warning:</strong> This action cannot be undone. Consider saving your current configuration as a preset before resetting.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${danger
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PUBLISHING & ENVIRONMENT COMPONENTS
// ============================================

// Environment Badge Component
const EnvironmentBadge: React.FC<{
  environment: 'draft' | 'preview' | 'live';
  lastPublished: Date;
}> = ({ environment, lastPublished }) => {
  const config = {
    draft: { label: 'Draft', bg: 'bg-gray-100', text: 'text-gray-700', tooltip: 'You are editing the Draft version' },
    preview: { label: 'Preview', bg: 'bg-blue-100', text: 'text-blue-700', tooltip: 'You are viewing a Preview' },
    live: { label: 'Live', bg: 'bg-green-100', text: 'text-green-700', tooltip: 'Viewing the Live version' }
  };

  const { label, bg, text, tooltip } = config[environment];
  const timeAgo = formatTimeAgo(lastPublished);

  return (
    <div className="flex items-center gap-2">
      <span
        className={`px-2.5 py-1 ${bg} ${text} text-xs font-semibold rounded-md flex items-center gap-1.5`}
        title={tooltip}
      >
        {environment === 'live' && <CheckCircle size={12} />}
        {label}
      </span>
      {environment === 'live' && (
        <span className="text-xs text-gray-500">
          Last published {timeAgo}
        </span>
      )}
    </div>
  );
};

// Draft Mode Banner
const DraftModeBanner: React.FC = () => (
  <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <AlertCircle size={16} className="text-blue-600" />
        <p className="text-sm text-blue-800">
          <strong>You&apos;re editing a draft.</strong> Changes won&apos;t go live until published.
        </p>
      </div>
    </div>
  </div>
);

// Preview Mode Bar
const PreviewModeBar: React.FC<{
  onBackToDraft: () => void;
  onPublish: () => void;
}> = ({ onBackToDraft, onPublish }) => {
  const [showShareLink, setShowShareLink] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 px-6 py-3 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Eye size={20} className="text-white" />
          <div>
            <p className="text-white font-semibold text-sm">Preview Mode</p>
            <p className="text-blue-100 text-xs">Viewing draft as it will appear live</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowShareLink(!showShareLink)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors text-sm font-medium"
          >
            <ExternalLink size={16} />
            Share Preview
          </button>
          <button
            onClick={onBackToDraft}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Draft
          </button>
          <button
            onClick={onPublish}
            className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-md"
          >
            <Save size={16} />
            Publish
          </button>
        </div>
      </div>

      {showShareLink && (
        <div className="mt-3 pt-3 border-t border-blue-500">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value="https://preview.studyvisa.com/draft-a8f3d2"
              className="flex-1 px-3 py-2 bg-white rounded-lg text-sm text-gray-700 border border-blue-300"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors text-sm font-medium">
              Copy Link
            </button>
          </div>
          <p className="text-xs text-blue-100 mt-1.5">
            This preview link is read-only and will expire in 7 days
          </p>
        </div>
      )}
    </div>
  );
};

// Publish Confirmation Modal
const PublishConfirmationModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setShowSuccess(true);
      setTimeout(() => {
        onConfirm();
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-[450px] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your changes are now live!</h2>
          <p className="text-sm text-gray-600">All visitors can now see the updated website.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={isPublishing ? undefined : onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-[600px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Save size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Publish your changes?</h2>
                <p className="text-sm text-gray-600 mt-0.5">Make your draft changes visible to all visitors</p>
              </div>
            </div>
            {!isPublishing && (
              <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Change Summary */}
        <div className="p-6">
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Change Summary</h3>
              <span className="text-xs text-gray-500">Last modified 5 minutes ago</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <ChangeSummaryItem
                icon={Plus}
                label="Sections added"
                count={2}
                color="text-green-600"
                bgColor="bg-green-50"
              />
              <ChangeSummaryItem
                icon={Trash2}
                label="Sections removed"
                count={0}
                color="text-red-600"
                bgColor="bg-red-50"
              />
              <ChangeSummaryItem
                icon={Settings}
                label="Settings changed"
                count={8}
                color="text-blue-600"
                bgColor="bg-blue-50"
              />
              <ChangeSummaryItem
                icon={FileText}
                label="Content edited"
                count={12}
                color="text-purple-600"
                bgColor="bg-purple-50"
              />
            </div>
          </div>

          {/* Publishing Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Publishing will update all draft changes</p>
                <p className="text-xs text-blue-700">
                  This is a site-wide publish. All pages with draft changes will go live. You can rollback to a previous version from History if needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          {!isPublishing && (
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${isPublishing
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
          >
            {isPublishing ? (
              <>
                <Clock size={18} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Save size={18} />
                Publish Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Change Summary Item
const ChangeSummaryItem: React.FC<{
  icon: React.ElementType;
  label: string;
  count: number;
  color: string;
  bgColor: string;
}> = ({ icon: Icon, label, count, color, bgColor }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2.5">
      <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center`}>
        <Icon size={16} className={color} />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <span className={`text-sm font-bold ${color}`}>{count}</span>
  </div>
);

// Version History Panel
const VersionHistoryPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [showRollbackModal, setShowRollbackModal] = useState(false);

  const versions = [
    { id: '1', date: new Date(), author: 'Admin User', status: 'Draft', changes: 'Current draft' },
    { id: '2', date: new Date(Date.now() - 2 * 60 * 60 * 1000), author: 'Admin User', status: 'Published', changes: 'Updated hero section' },
    { id: '3', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), author: 'John Doe', status: 'Published', changes: 'Added testimonials' },
    { id: '4', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), author: 'Admin User', status: 'Published', changes: 'Initial website setup' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-end justify-end z-50" onClick={onClose}>
        <div
          className="bg-white h-full w-[500px] shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <RotateCcw size={20} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Version History</h2>
                  <p className="text-xs text-gray-600">View and restore previous versions</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Version List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className={`p-4 border-2 rounded-xl transition-all cursor-pointer ${selectedVersion === version.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50'
                  }`}
                onClick={() => setSelectedVersion(version.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[9px] font-bold rounded uppercase">
                        Current
                      </span>
                    )}
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${version.status === 'Published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}>
                      {version.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{formatTimeAgo(version.date)}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{version.changes}</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <User size={12} />
                  <span>{version.author}</span>
                  <span>•</span>
                  <Calendar size={12} />
                  <span>{version.date.toLocaleDateString()}</span>
                </div>

                {selectedVersion === version.id && index !== 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
                    <button className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium">
                      Preview Version
                    </button>
                    <button
                      onClick={() => setShowRollbackModal(true)}
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-semibold"
                    >
                      Restore as Draft
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info Footer */}
          <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                <strong>Rollback Safety:</strong> Restoring a version creates a new draft. Review and publish when ready.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rollback Confirmation Modal */}
      {showRollbackModal && (
        <RollbackConfirmationModal
          onConfirm={() => {
            setShowRollbackModal(false);
            onClose();
          }}
          onCancel={() => setShowRollbackModal(false)}
        />
      )}
    </>
  );
};

// Rollback Confirmation Modal
const RollbackConfirmationModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]" onClick={onCancel}>
    <div className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="px-6 py-4 border-b bg-purple-50 border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <RotateCcw size={20} className="text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-purple-900">Restore this version?</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-700 font-medium">
          This will restore the selected version as a new draft.
        </p>
        <p className="text-sm text-gray-600">
          Your current draft will be replaced. The restored content will NOT be published automatically — you&apos;ll need to review and publish it manually.
        </p>

        {/* Process Visualization */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-3">Restore Process</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[10px]">1</div>
              <span>Version is restored as a new draft</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[10px]">2</div>
              <span>Review the restored content</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[10px]">3</div>
              <span>Publish when you&apos;re ready</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-green-800">
            <strong>Non-destructive:</strong> This is safe. Your live site won&apos;t change until you publish.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Restore as Draft
        </button>
      </div>
    </div>
  </div>
);

// Unsaved Changes Warning
const UnsavedChangesWarning: React.FC<{
  onStay: () => void;
  onDiscard: () => void;
}> = ({ onStay, onDiscard }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-yellow-50 border-yellow-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <AlertCircle size={20} className="text-yellow-600" />
          </div>
          <h2 className="text-lg font-semibold text-yellow-900">You have unsaved changes</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-700 font-medium">
          You have unsaved changes in your draft. What would you like to do?
        </p>
        <p className="text-sm text-gray-600">
          Your changes are auto-saved, but haven&apos;t been published yet.
        </p>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Unsaved Changes:</p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>8 setting modifications</li>
            <li>2 new sections added</li>
            <li>12 content edits</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          onClick={onDiscard}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Discard Changes
        </button>
        <button
          onClick={onStay}
          className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Stay & Continue Editing
        </button>
      </div>
    </div>
  </div>
);

// Utility: Format time ago
const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

// ============================================
// COLLABORATION & ACCESS COMPONENTS
// ============================================

// Team & Access Settings Page
const TeamAccessSettings: React.FC<{
  currentUser: TeamMember;
  onClose: () => void;
  onInvite: () => void;
}> = ({ currentUser, onClose, onInvite }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Admin User', email: 'admin@studyvisa.com', role: 'owner', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@studyvisa.com', role: 'admin', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: '3', name: 'Alex Chen', email: 'alex@studyvisa.com', role: 'editor', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { id: '4', name: 'John Doe', email: 'john@example.com', role: 'editor', status: 'invited', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: '5', name: 'Emily Brown', email: 'emily@studyvisa.com', role: 'viewer', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
  ]);

  const canManageUsers = currentUser.role === 'owner' || currentUser.role === 'admin';

  const getRoleBadge = (role: UserRole) => {
    const config = {
      owner: { label: 'Owner', bg: 'bg-purple-100', text: 'text-purple-700', icon: Crown },
      admin: { label: 'Admin', bg: 'bg-blue-100', text: 'text-blue-700', icon: Shield },
      editor: { label: 'Editor', bg: 'bg-green-100', text: 'text-green-700', icon: null },
      viewer: { label: 'Viewer', bg: 'bg-gray-100', text: 'text-gray-700', icon: Eye }
    };
    return config[role];
  };

  const getRoleDescription = (role: UserRole) => {
    const descriptions = {
      owner: 'Full access • Manage billing • Manage users • Publish & rollback • Delete site',
      admin: 'Manage content • Manage users • Publish & rollback • Access settings',
      editor: 'Edit pages & sections • Cannot publish • Cannot manage users',
      viewer: 'Read-only • Preview content • No edits'
    };
    return descriptions[role];
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-[900px] max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Users size={24} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Team & Access</h2>
                <p className="text-sm text-gray-600">Manage who can access and edit your website</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Invite Button */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
              <p className="text-sm text-gray-600">{teamMembers.length} members</p>
            </div>
            <button
              onClick={onInvite}
              disabled={!canManageUsers}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold ${canManageUsers
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              title={canManageUsers ? 'Invite team member' : 'Only Owners and Admins can invite users'}
            >
              <Plus size={18} />
              Invite Member
            </button>
          </div>

          {/* Team Members List */}
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 transition-all"
              >
                {/* Avatar */}
                <img
                  src={member.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + member.name}
                  alt={member.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-200"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h4>
                    {member.id === currentUser.id && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate">{member.email}</p>
                  {member.status === 'invited' && member.invitedAt && (
                    <p className="text-xs text-orange-600 mt-1">
                      Invited {formatTimeAgo(member.invitedAt)}
                    </p>
                  )}
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-2">
                  {(() => {
                    const badge = getRoleBadge(member.role);
                    const Icon = badge.icon;
                    return (
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 ${badge.bg} ${badge.text} rounded-lg`} title={getRoleDescription(member.role)}>
                        {Icon && <Icon size={14} />}
                        <span className="text-xs font-semibold">{badge.label}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Status Badge */}
                <div>
                  {member.status === 'active' ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-[10px] font-semibold rounded border border-green-200">
                      <CheckCircle size={10} />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-[10px] font-semibold rounded border border-orange-200">
                      <Clock size={10} />
                      Invited
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {/* Role Change Dropdown */}
                  {canManageUsers && member.role !== 'owner' && member.id !== currentUser.id && (
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                      title="Change role"
                    >
                      <ChevronDown size={16} />
                    </button>
                  )}

                  {/* Remove User */}
                  {canManageUsers && member.role !== 'owner' && member.id !== currentUser.id && (
                    <button
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      title="Remove user"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Role Explanations */}
          <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="text-sm font-semibold text-blue-900 mb-3">Role Permissions</h4>
            <div className="space-y-2.5">
              {(['owner', 'admin', 'editor', 'viewer'] as UserRole[]).map((role) => {
                const badge = getRoleBadge(role);
                const Icon = badge.icon;
                return (
                  <div key={role} className="flex items-start gap-2.5">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 ${badge.bg} ${badge.text} rounded-lg flex-shrink-0`}>
                      {Icon && <Icon size={12} />}
                      <span className="text-[11px] font-bold">{badge.label}</span>
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed">{getRoleDescription(role)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// Invite User Modal
const InviteUserModal: React.FC<{
  onClose: () => void;
  onInvite: (email: string, role: UserRole) => void;
}> = ({ onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('editor');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInvite = () => {
    if (!email) return;
    setShowSuccess(true);
    setTimeout(() => {
      onInvite(email, selectedRole);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
        <div className="bg-white rounded-2xl shadow-2xl w-[450px] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation sent!</h2>
          <p className="text-sm text-gray-600">An email invitation has been sent to <strong>{email}</strong></p>
        </div>
      </div>
    );
  }

  const roles: { value: UserRole; label: string; description: string; color: string }[] = [
    { value: 'admin', label: 'Admin', description: 'Can manage content, users, and publish changes', color: 'border-blue-300 bg-blue-50' },
    { value: 'editor', label: 'Editor', description: 'Can edit content but cannot publish', color: 'border-green-300 bg-green-50' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access to preview content', color: 'border-gray-300 bg-gray-50' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[550px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Mail size={20} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Invite Team Member</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Select Role</label>
            <div className="space-y-2">
              {roles.map((role) => (
                <label
                  key={role.value}
                  className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedRole === role.value
                      ? `${role.color} border-current`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{role.label}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{role.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                They&apos;ll receive an email invitation with a link to join your team. You can change their role or remove them anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={!email}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${email
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <Mail size={16} />
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// FEEDBACK & PERFORMANCE UI COMPONENTS
// ============================================

// NOTE: SystemHealthIndicator replaced by EnhancedSystemHealthIndicator from Part10FeedbackSystem.tsx

// Offline Banner
const OfflineBanner: React.FC<{
  onDismiss: () => void;
}> = ({ onDismiss }) => (
  <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top">
    <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 min-w-[400px]">
      <WifiOff size={18} className="text-gray-300 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium">You&apos;re offline</p>
        <p className="text-xs text-gray-300 mt-0.5">Changes will sync when you&apos;re back online</p>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 hover:bg-gray-800 rounded transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  </div>
);

// Blocking Error Banner
const BlockingErrorBanner: React.FC<{
  message: string;
  onDismiss: () => void;
}> = ({ message, onDismiss }) => (
  <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top">
    <div className="bg-red-50 border-2 border-red-200 px-6 py-4 rounded-lg shadow-xl flex items-start gap-3 min-w-[450px]">
      <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-900">Unable to complete action</p>
        <p className="text-sm text-red-700 mt-1">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 hover:bg-red-100 rounded transition-colors"
      >
        <X size={16} className="text-red-600" />
      </button>
    </div>
  </div>
);

// Non-Blocking Error Banner
const NonBlockingErrorBanner: React.FC<{
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}> = ({ message, onRetry, onDismiss }) => (
  <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom">
    <div className="bg-yellow-50 border-2 border-yellow-200 px-5 py-4 rounded-xl shadow-xl flex items-start gap-3 max-w-[400px]">
      <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-900">{message}</p>
        <button
          onClick={onRetry}
          className="text-xs font-semibold text-yellow-700 hover:text-yellow-900 mt-2 flex items-center gap-1"
        >
          <RotateCcw size={12} />
          Retry now
        </button>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 hover:bg-yellow-100 rounded transition-colors"
      >
        <X size={14} className="text-yellow-600" />
      </button>
    </div>
  </div>
);

// Toast Notification
const ToastNotification: React.FC<{
  message: string;
  type: 'success' | 'info' | 'warning';
  onDismiss: () => void;
}> = ({ message, type, onDismiss }) => {
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'warning':
        return 'bg-yellow-600';
      case 'info':
        return 'bg-blue-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'warning':
        return <AlertCircle size={18} />;
      case 'info':
        return <Bell size={18} />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom">
      <div className={`${getBgColor()} text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px]`}>
        {getIcon()}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Destructive Action Modal
const DestructiveActionModal: React.FC<{
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, message, confirmLabel, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]" onClick={onCancel}>
    <div
      className="bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-700">{message}</p>

        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">This cannot be undone</p>
              <p className="text-xs text-red-700 mt-1">
                Make sure you want to proceed before confirming.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Trash2 size={16} />
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

// Loading Skeleton Component
const LoadingSkeleton: React.FC<{ type: 'panel' | 'section' | 'block' }> = ({ type }) => {
  if (type === 'panel') {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (type === 'section') {
    return (
      <div className="p-4 border border-gray-200 rounded-xl animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-gray-50 rounded-lg animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center text-center py-12 px-6">
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <Icon size={32} className="text-gray-400" />
    </div>
    <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 max-w-sm mb-4">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        <Plus size={16} />
        {actionLabel}
      </button>
    )}
  </div>
);

// ============================================
// ACCESSIBILITY UI COMPONENTS
// ============================================

// Command Palette (Cmd+K)
const CommandPalette: React.FC<{
  onClose: () => void;
  onExecute: (action: string) => void;
}> = ({ onClose, onExecute }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const commands = [
    { id: 'save', label: 'Save Changes', icon: Save, shortcut: 'Cmd+S', category: 'Actions' },
    { id: 'publish', label: 'Publish Changes', icon: Upload, shortcut: 'none', category: 'Actions' },
    { id: 'preview', label: 'Preview Site', icon: Eye, shortcut: 'none', category: 'View' },
    { id: 'theme', label: 'Theme Settings', icon: Palette, shortcut: 'none', category: 'Settings' },
    { id: 'apps', label: 'Apps & Integrations', icon: Puzzle, shortcut: 'none', category: 'Settings' },
    { id: 'history', label: 'Version History', icon: RotateCcw, shortcut: 'none', category: 'History' },
    { id: 'team', label: 'Team & Access', icon: Users, shortcut: 'none', category: 'Settings' },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard, shortcut: 'Cmd+/', category: 'Help' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-start justify-center pt-[15vh] z-[80]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm outline-none"
              aria-label="Search commands"
            />
            <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded">Esc</kbd>
          </div>
        </div>

        {/* Commands List */}
        <div
          className="max-h-[400px] overflow-y-auto"
          role="listbox"
          aria-labelledby="command-palette-title"
        >
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">No commands found</p>
            </div>
          ) : (
            <>
              {['Actions', 'View', 'Settings', 'History', 'Help'].map(category => {
                const categoryCommands = filteredCommands.filter(cmd => cmd.category === category);
                if (categoryCommands.length === 0) return null;

                return (
                  <div key={category} className="py-2">
                    <div className="px-4 py-1.5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{category}</p>
                    </div>
                    {categoryCommands.map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={() => onExecute(cmd.id)}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left focus:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                        role="option"
                        aria-label={cmd.label}
                      >
                        <cmd.icon size={18} className="text-gray-600" />
                        <span className="flex-1 text-sm font-medium text-gray-900">{cmd.label}</span>
                        {cmd.shortcut !== 'none' && (
                          <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-white border border-gray-300 rounded text-[10px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-white border border-gray-300 rounded text-[10px]">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-white border border-gray-300 rounded text-[10px]">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keyboard Shortcuts Panel
const KeyboardShortcutsPanel: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    {
      category: 'General', items: [
        { keys: [`${modKey}`, 'K'], description: 'Open command palette' },
        { keys: [`${modKey}`, 'S'], description: 'Save changes manually' },
        { keys: [`${modKey}`, '/'], description: 'View keyboard shortcuts' },
        { keys: ['Esc'], description: 'Close modal or panel' },
      ]
    },
    {
      category: 'Navigation', items: [
        { keys: ['Tab'], description: 'Move to next element' },
        { keys: ['Shift', 'Tab'], description: 'Move to previous element' },
        { keys: ['↑', '↓'], description: 'Navigate lists' },
        { keys: ['Enter'], description: 'Confirm action' },
      ]
    },
    {
      category: 'Editing', items: [
        { keys: ['Delete'], description: 'Remove selected item' },
        { keys: [`${modKey}`, 'Z'], description: 'Undo (future)' },
        { keys: [`${modKey}`, 'Shift', 'Z'], description: 'Redo (future)' },
      ]
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-panel-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[700px] max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Keyboard size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 id="shortcuts-panel-title" className="text-lg font-bold text-gray-900">Keyboard Shortcuts</h2>
              <p className="text-xs text-gray-600 mt-0.5">Navigate the editor without a mouse</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close keyboard shortcuts panel"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)] space-y-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{section.category}</h3>
              <div className="space-y-2">
                {section.items.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-sm text-gray-700">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <span key={keyIdx} className="inline-flex items-center gap-1">
                          {keyIdx > 0 && <span className="text-gray-400 text-xs mx-1">+</span>}
                          <kbd className="px-2.5 py-1.5 text-xs font-mono bg-white border border-gray-300 rounded shadow-sm min-w-[32px] text-center">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            💡 <strong>Tip:</strong> Press <kbd className="px-1.5 py-0.5 font-mono bg-white border border-gray-300 rounded text-[10px]">{modKey}+K</kbd> anytime to quickly access all commands.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// APPS & INTEGRATIONS UI COMPONENTS
// ============================================

// Apps & Integrations Panel
const AppsIntegrationsPanel: React.FC<{
  installedApps: any[];
  selectedApp: string | null;
  currentUserRole: string;
  onSelectApp: (appId: string) => void;
  onClose: () => void;
  onUninstall: (app: any) => void;
  onToggleStatus: (appId: string) => void;
  onReconnect: (appId: string) => void;
}> = ({ installedApps, selectedApp, currentUserRole, onSelectApp, onClose, onUninstall, onToggleStatus, onReconnect }) => {
  const canManageApps = currentUserRole === 'owner' || currentUserRole === 'admin';

  const categoryIcons: Record<string, any> = {
    analytics: TrendingUp,
    marketing: Megaphone,
    payments: CreditCard,
    cms: Database,
    ai: Brain,
    other: Puzzle
  };

  const categoryNames: Record<string, string> = {
    analytics: 'Analytics',
    marketing: 'Marketing',
    payments: 'Payments',
    cms: 'Content Management',
    ai: 'AI & Automation',
    other: 'Other'
  };

  const groupedApps = installedApps.reduce((acc, app) => {
    if (!acc[app.category]) acc[app.category] = [];
    acc[app.category].push(app);
    return acc;
  }, {} as Record<string, any[]>);

  const selectedAppData = installedApps.find(app => app.id === selectedApp);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apps-panel-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[900px] h-[700px] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Apps List */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Puzzle size={20} className="text-purple-600" />
                </div>
                <div>
                  <h2 id="apps-panel-title" className="text-lg font-bold text-gray-900">Apps & Integrations</h2>
                  <p className="text-xs text-gray-600 mt-0.5">Extend your workspace</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close apps panel"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Installed Apps or Empty State */}
          <div className="flex-1 overflow-y-auto p-6">
            {installedApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Puzzle size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Extend your workspace</h3>
                <p className="text-sm text-gray-600 max-w-sm mb-6">
                  Add tools and services to enhance your site with analytics, marketing, payments, and more.
                </p>
                <button
                  className="px-4 py-2 bg-[#253154] text-white text-sm font-semibold rounded-lg hover:bg-[#1a2340] transition-colors"
                  disabled
                >
                  Browse apps
                  <span className="ml-2 text-xs opacity-75">(Coming soon)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedApps).map(([category, apps]) => {
                  const CategoryIcon = categoryIcons[category] || Puzzle;
                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <CategoryIcon size={16} className="text-gray-500" />
                        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          {categoryNames[category]}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {apps.map((app) => (
                          <button
                            key={app.id}
                            onClick={() => onSelectApp(app.id)}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedApp === app.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
                                {app.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm font-semibold text-gray-900 truncate">{app.name}</h4>
                                  {app.status === 'active' && (
                                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded uppercase">
                                      Active
                                    </span>
                                  )}
                                  {app.status === 'disabled' && (
                                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded uppercase">
                                      Disabled
                                    </span>
                                  )}
                                  {app.status === 'disconnected' && (
                                    <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-semibold rounded uppercase flex items-center gap-1">
                                      <AlertTriangle size={10} />
                                      Disconnected
                                    </span>
                                  )}
                                  {app.status === 'error' && (
                                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-semibold rounded uppercase flex items-center gap-1">
                                      <AlertCircle size={10} />
                                      Error
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2">{app.description}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Coming Soon Section */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-gray-500" />
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      More Coming Soon
                    </h3>
                  </div>
                  <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-center">
                    <p className="text-sm text-gray-600">New apps and integrations will appear here</p>
                    <button
                      className="mt-3 text-xs text-purple-600 font-semibold hover:text-purple-700"
                      disabled
                    >
                      Request an integration
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: App Details / Configuration */}
        <div className="w-1/2 flex flex-col bg-gray-50">
          {selectedAppData ? (
            <>
              {/* App Header */}
              <div className="px-6 py-5 bg-white border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-3xl flex-shrink-0">
                    {selectedAppData.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedAppData.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{selectedAppData.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} />
                      <span>Installed {new Date(selectedAppData.installedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Connection Status */}
                {selectedAppData.status === 'disconnected' && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-yellow-900 mb-1">Connection Lost</h4>
                        <p className="text-xs text-yellow-800 mb-3">
                          This app has been disconnected. Reconnect to restore functionality.
                        </p>
                        {canManageApps && (
                          <button
                            onClick={() => onReconnect(selectedAppData.id)}
                            className="px-3 py-1.5 bg-yellow-600 text-white text-xs font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            Reconnect App
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedAppData.status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-900 mb-1">App Error</h4>
                        <p className="text-xs text-red-800 mb-3">
                          This app encountered an error. Try reconnecting or contact support.
                        </p>
                        {canManageApps && (
                          <button
                            onClick={() => onReconnect(selectedAppData.id)}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Retry Connection
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Control */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Status</h4>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedAppData.status === 'active' ? 'App is active' : 'App is disabled'}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {selectedAppData.status === 'active'
                            ? 'This app is currently running on your site'
                            : 'Enable to activate app functionality'}
                        </p>
                      </div>
                      {canManageApps ? (
                        <button
                          onClick={() => onToggleStatus(selectedAppData.id)}
                          disabled={selectedAppData.status === 'disconnected' || selectedAppData.status === 'error'}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${selectedAppData.status === 'active'
                              ? 'bg-green-600'
                              : 'bg-gray-300'
                            } ${(selectedAppData.status === 'disconnected' || selectedAppData.status === 'error')
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                            }`}
                          aria-label="Toggle app status"
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${selectedAppData.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Admin only</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Permissions</h4>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-xs text-gray-600 mb-3">This app can:</p>
                    <ul className="space-y-2">
                      {selectedAppData.permissions.map((permission: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* App Configuration (Placeholder) */}
                {selectedAppData.hasConfig && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Configuration</h4>
                    <div className="p-6 bg-white border border-gray-200 rounded-lg text-center">
                      <Settings size={32} className="text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">App-specific settings</p>
                      <p className="text-xs text-gray-500">
                        Configuration UI will appear here
                      </p>
                    </div>
                  </div>
                )}

                {/* Danger Zone */}
                {canManageApps && (
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Danger Zone</h4>
                    <div className="p-4 bg-white border border-red-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">Uninstall app</p>
                          <p className="text-xs text-gray-600">
                            Remove this app and all its data from your site
                          </p>
                        </div>
                        <button
                          onClick={() => onUninstall(selectedAppData)}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Uninstall
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Puzzle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Select an app</h3>
              <p className="text-sm text-gray-600 max-w-sm">
                Choose an app from the list to view details and manage settings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Uninstall App Modal
const UninstallAppModal: React.FC<{
  app: any;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ app, onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-[90]"
    onClick={onCancel}
    role="dialog"
    aria-modal="true"
    aria-labelledby="uninstall-modal-title"
  >
    <div
      className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h2 id="uninstall-modal-title" className="text-lg font-bold text-gray-900 mb-1">
              Uninstall {app.name}?
            </h2>
            <p className="text-sm text-gray-600">
              This action cannot be undone
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5 space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-900 font-medium mb-2">
            This will permanently remove:
          </p>
          <ul className="space-y-1.5 text-sm text-red-800">
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-0.5">•</span>
              <span>All app functionality from your site</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-0.5">•</span>
              <span>App configuration and settings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-0.5">•</span>
              <span>Any data associated with this app</span>
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-700">
          You can reinstall this app later, but you&apos;ll need to reconfigure all settings.
        </p>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Trash2 size={16} />
          Uninstall App
        </button>
      </div>
    </div>
  </div>
);

// Locked Page Modal
const LockedPageModal: React.FC<{
  lockedBy: string;
  onClose: () => void;
  onNotify: () => void;
}> = ({ lockedBy, onClose, onNotify }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Lock size={20} className="text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">This page is currently locked</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lockedBy}`}
            alt={lockedBy}
            className="w-12 h-12 rounded-full border-2 border-gray-300"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{lockedBy}</p>
            <p className="text-xs text-gray-600">is currently editing this page</p>
          </div>
        </div>

        <p className="text-sm text-gray-700">
          To prevent conflicts, only one person can edit a page at a time. You can view the page or ask {lockedBy} to finish their edits.
        </p>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Edit locks prevent mistakes</p>
              <p className="text-xs text-blue-700">
                This ensures your changes don&apos;t overwrite each other. The lock will be released when they&apos;re done.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          View Only
        </button>
        <button
          onClick={onNotify}
          className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Bell size={16} />
          Notify {lockedBy}
        </button>
      </div>
    </div>
  </div>
);
