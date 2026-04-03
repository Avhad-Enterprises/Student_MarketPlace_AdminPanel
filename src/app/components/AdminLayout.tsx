"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  House, Users, Grid3x3, Globe, Sparkles, Calendar, Mail, Wallet,
  BarChart3, FileEdit, Store, Settings, Bell, Menu, ChevronDown, ChevronRight, User, LogOut, FileText, GraduationCap
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { GlobalSearch } from './GlobalSearch';
import { NotificationPanel } from './common/NotificationPanel';
import { useNotifications } from './common/useNotifications';

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage?: string;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

interface NavSection {
  id: string;
  icon: React.ReactNode;
  label: string;
  pages?: string[];
  items?: { id: string; label: string }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'dashboard',
    icon: <House size={20} />,
    label: 'Dashboard',
    pages: ['dashboard']
  },
  {
    id: 'students',
    icon: <Users size={20} />,
    label: 'Students',
    items: [
      { id: 'students-all', label: 'All Students' },
      { id: 'students-profiles', label: 'Student Profiles' },
      { id: 'students-applications', label: 'Applications' },
      { id: 'students-status', label: 'Status Tracking' }
    ]
  },
  {
    id: 'services',
    icon: <Grid3x3 size={20} />,
    label: 'Services & Marketplace',
    items: [
      { id: 'services-sim-cards', label: 'SIM Cards' },
      { id: 'services-banks', label: 'Banks' },
      { id: 'services-insurance', label: 'Insurance' },
      { id: 'services-visa', label: 'Visa' },
      { id: 'services-taxes', label: 'Taxes' },
      { id: 'services-loans', label: 'Loans' },
      { id: 'services-credit', label: 'Build Credit' },
      { id: 'services-housing', label: 'Housing' },
      { id: 'services-forex', label: 'Forex' },
      { id: 'services-employment', label: 'Employment' },
      { id: 'services-food', label: 'Food' },
      { id: 'services-courses', label: 'Courses' },
      { id: 'services-provider-redesigned', label: 'Provider Overview (Redesigned)' }
    ]
  },
  {
    id: 'countries',
    icon: <Globe size={20} />,
    label: 'Countries & Universities',
    items: [
      { id: 'countries-list', label: 'Countries' },
      { id: 'universities-list', label: 'Universities' }
    ]
  },
  {
    id: 'ai',
    icon: <Sparkles size={20} />,
    label: 'AI Visa Assistant',
    items: [
      { id: 'ai-overview', label: 'Overview' },
      { id: 'ai-setup', label: 'Assistant Setup' },
      { id: 'ai-features', label: 'Features Manager' },
      { id: 'ai-knowledge', label: 'Content & Knowledge Base' },
      { id: 'ai-flows', label: 'Flows & Forms' },
      { id: 'ai-conversations', label: 'Conversations & Quality' }
    ]
  },
  {
    id: 'ai-test-assistant',
    icon: <GraduationCap size={20} />,
    label: 'AI Test Assistant',
    items: [
      { id: 'ai-test-overview', label: 'Overview' },
      { id: 'ai-test-library', label: 'Library' },
      { id: 'ai-test-plans', label: 'Plans' },
      { id: 'ai-test-reports', label: 'Reports' },
      { id: 'ai-test-scoring', label: 'Scoring' }
    ]
  },
  {
    id: 'bookings',
    icon: <Calendar size={20} />,
    label: 'Bookings & Leads',
    items: [
      { id: 'bookings-list', label: 'Bookings' },
      { id: 'bookings-enquiries', label: 'Enquiries' },
      { id: 'bookings-status', label: 'Lead Status' },
      { id: 'bookings-experts', label: 'Assigned Experts' }
    ]
  },
  {
    id: 'communications',
    icon: <Mail size={20} />,
    label: 'Communications',
    pages: ['communications']
  },
  {
    id: 'finance',
    icon: <Wallet size={20} />,
    label: 'Finance',
    pages: ['finance']
  },
  {
    id: 'reports',
    icon: <BarChart3 size={20} />,
    label: 'Reports & Analytics',
    pages: ['reports']
  },
  {
    id: 'blogs',
    icon: <FileEdit size={20} />,
    label: 'Blogs',
    pages: ['blogs']
  },
  {
    id: 'online-store',
    icon: <Store size={20} />,
    label: 'Online Store',
    items: [
      { id: 'store-themes', label: 'Themes' },
      { id: 'store-pages', label: 'Pages' },
      { id: 'store-builder', label: 'Website Builder' },
      { id: 'store-navigation', label: 'Navigation' },
      { id: 'store-preferences', label: 'Preferences' }
    ]
  },
  {
    id: 'sop',
    icon: <FileText size={20} />,
    label: 'SOP Assistant',
    items: [
      { id: 'sop-overview', label: 'Overview' },
      { id: 'sop-settings', label: 'Settings' }
    ]
  }
];

const ROUTE_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/students': 'students-all',
  '/students/profiles': 'students-profiles',
  '/students/applications': 'students-applications',
  '/students/status-tracking': 'students-status',
  '/countries': 'countries-list',
  '/universities': 'universities-list',
  '/countries/add': 'countries-list',
  '/communications': 'communications',
  '/finance': 'finance',
  '/reports': 'reports',
  '/ai-test-assistant/overview': 'ai-test-overview',
  '/ai-test-assistant/library': 'ai-test-library',
  '/ai-test-assistant/plans': 'ai-test-plans',
  '/ai-test-assistant/reports': 'ai-test-reports',
  '/ai-test-assistant/scoring': 'ai-test-scoring',
  '/online-store/themes': 'store-themes',
  '/online-store/pages': 'store-pages',
  '/online-store/website-builder': 'store-builder',
  '/online-store/navigation': 'store-navigation',
  '/online-store/preferences': 'store-preferences',
  '/sop-assistant/overview': 'sop-overview',
  '/sop-assistant/settings': 'sop-settings',
  '/ai-visa-assistant/overview': 'ai-overview',
  '/ai-visa-assistant/setup': 'ai-setup',
  '/ai-visa-assistant/features': 'ai-features',
  '/ai-visa-assistant/knowledge': 'ai-knowledge',
  '/ai-visa-assistant/flows': 'ai-flows',
  '/ai-visa-assistant/conversations': 'ai-conversations',
  '/blogs': 'blogs',
  '/settings': 'settings',
  '/service-provider/overview': 'services-provider-redesigned',
  '/bookings/list': 'bookings-list',
  '/bookings/enquiries': 'bookings-enquiries',
  '/bookings/status': 'bookings-status',
  '/bookings/experts': 'bookings-experts',
  '/profile': 'profile',
};

const getActivePageFromPathname = (pathname: string): string => {
  // First, check for exact match or prefix in ROUTE_MAP
  const sortedRoutes = Object.keys(ROUTE_MAP).sort((a, b) => b.length - a.length);
  for (const route of sortedRoutes) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      return ROUTE_MAP[route];
    }
  }

  // Handle Dynamic Services
  if (pathname.startsWith('/services/')) {
    const service = pathname.split('/')[2];
    return `services-${service}`;
  }

  // Handle AI Visa Assistant sub-routes
  if (pathname.startsWith('/ai-visa-assistant/')) {
    const sub = pathname.split('/')[2];
    return `ai-${sub}`;
  }

  // Handle Bookings sub-routes
  if (pathname.startsWith('/bookings/')) {
    const sub = pathname.split('/')[2];
    return `bookings-${sub}`;
  }

  return 'dashboard';
};

const checkPageInSection = (section: NavSection, pageId: string) => {
  if (section.pages?.includes(pageId)) return true;
  if (section.items?.some(item => item.id === pageId)) return true;
  return false;
};

export const AdminLayout = ({ children, activePage: propActivePage, onNavigate, onLogout }: AdminLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Derive the active page from the current pathname
  const activePage = getActivePageFromPathname(pathname) || propActivePage || 'dashboard';

  // State for expandedSections
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  // Auto-expand the section containing the active page
  useEffect(() => {
    const activeSection = NAV_SECTIONS.find(section => checkPageInSection(section, activePage));
    if (activeSection && !expandedSections.includes(activeSection.id)) {
      setExpandedSections(prev => Array.from(new Set([...prev, activeSection.id])));
    }
  }, [activePage]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const [userName, setUserName] = useState('Admin User');
  const [userInitials, setUserInitials] = useState('AU');

  useEffect(() => {
    try {
      const userJson = localStorage.getItem('auth_user');
      if (userJson) {
        const user = JSON.parse(userJson);
        const name = user.full_name || user.name || 'Admin User';
        setUserName(name);
        
        // Calculate initials
        const initials = name
          .split(' ')
          .filter(Boolean)
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
        setUserInitials(initials || 'AU');
      }
    } catch (e) {
      console.error('Error reading auth_user', e);
    }
  }, []);

  const handleNav = (page: string) => {
    console.log('[AdminLayout] Requested navigation to:', page);
    try {
      if (onNavigate) {
        console.log('[AdminLayout] Using onNavigate prop');
        onNavigate(page);
      } else {
        // Default internal navigation logic
        const inverseRouteMap: Record<string, string> = {};
        Object.entries(ROUTE_MAP).forEach(([route, id]) => { inverseRouteMap[id] = route; });
        
        const targetRoute = inverseRouteMap[page];
        console.log('[AdminLayout] Target route for', page, 'is:', targetRoute);
        
        if (targetRoute) {
          console.log('[AdminLayout] Navigating to mapped route:', targetRoute);
          if (pathname !== targetRoute) {
            setIsNavigating(true);
          }
          router.push(targetRoute);
        } else if (page.startsWith('services-')) {
          const service = page.replace('services-', '');
          const target = `/services/${service}`;
          console.log('[AdminLayout] Navigating to service:', target);
          if (pathname !== target) {
            setIsNavigating(true);
          }
          router.push(target);
        } else if (page.startsWith('ai-')) {
          const subPage = page.replace('ai-', '');
          const target = `/ai-visa-assistant/${subPage}`;
          console.log('[AdminLayout] Navigating to AI section:', target);
          if (pathname !== target) {
            setIsNavigating(true);
          }
          router.push(target);
        } else if (page.startsWith('bookings-')) {
          const subPage = page.replace('bookings-', '');
          const target = `/bookings/${subPage}`;
          console.log('[AdminLayout] Navigating to booking section:', target);
          if (pathname !== target) {
            setIsNavigating(true);
          }
          router.push(target);
        } else {
          console.warn('[AdminLayout] No route found for page:', page);
        }
      }
    } catch (error) {
      console.error('[AdminLayout] Navigation failed:', error);
    } finally {
      setSidebarOpen(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isPageInSection = (section: NavSection) => {
    if (section.pages?.includes(activePage)) return true;
    if (section.items?.some(item => item.id === activePage)) return true;
    return false;
  };

  useEffect(() => {
    const currentRef = notificationButtonRef.current;
    const profileRef = profileButtonRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef && !profileRef.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset loading state on route change with a small delay to ensure visibility
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 400); // Minimum 400ms visibility
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div suppressHydrationWarning className="bg-app-bg min-h-screen w-full font-sans text-app-heading flex relative overflow-hidden">
      {/* Top Loading Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[9999] overflow-hidden">
          <div className="h-full bg-indigo-600 animate-progress-bar shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
        </div>
      )}

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
          role="button"
          aria-label="Close navigation menu"
        />
      )}

      {/* Sidebar */}
      <aside
        suppressHydrationWarning
        className={classNames(
          "fixed lg:static top-4 left-4 h-[calc(100vh-32px)] w-[287px] bg-app-sidebar-bg text-[#99a1af] flex flex-col z-50 rounded-[40px] shadow-[0px_25px_50px_-12px_rgba(89,22,139,0.4)] border border-white/5 transition-transform duration-300 ease-in-out shrink-0 ml-4 my-4",
          isSidebarOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0 lg:ml-4"
        )}
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Fixed Top Section (Logo + Dashboard) */}
        <div className="flex-none px-8 pt-8 pb-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-24 w-auto flex items-center">
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            </div>
          </div>

          <NavItem
            icon={<House size={20} />}
            label="Dashboard"
            active={activePage === 'dashboard'}
            onClick={() => handleNav('dashboard')}
          />
        </div>

        {/* Scrollable Middle Section */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-1 custom-scrollbar-dark">
          {NAV_SECTIONS.slice(1).map((section) => (
            <div suppressHydrationWarning key={section.id}>
              {section.items ? (
                <>
                  <NavItemExpandable
                    icon={section.icon}
                    label={section.label}
                    active={checkPageInSection(section, activePage)}
                    expanded={expandedSections.includes(section.id)}
                    onClick={() => toggleSection(section.id)}
                  />
                  {expandedSections.includes(section.id) && (
                    <div suppressHydrationWarning className="ml-4 mt-1 space-y-1">
                      {section.items.map((item) => (
                        <NavSubItem
                          key={item.id}
                          label={item.label}
                          active={activePage === item.id}
                          onClick={() => handleNav(item.id)}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavItem
                  icon={section.icon}
                  label={section.label}
                  active={section.pages?.includes(activePage)}
                  onClick={() => handleNav(section.pages?.[0] || section.id)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Fixed Bottom Section (Settings) */}
        <div className="flex-none px-6 py-6 pb-8 mt-auto">
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activePage === 'settings'}
            onClick={() => handleNav('settings')}
          />
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="flex-none px-4 md:px-8 pt-4 md:pt-8 pb-4 relative z-30">
          <header className="bg-app-sidebar-bg rounded-[22px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] min-h-[56px] md:h-[72px] flex items-center justify-between px-4 md:px-8 transition-all duration-300 gap-3">
            {/* Left: Menu Button */}
            <div className="flex items-center">
              <button
                suppressHydrationWarning
                className="lg:hidden p-2 text-[#90a1b9] hover:text-white transition-colors"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isSidebarOpen}
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-[448px] mx-auto">
              <GlobalSearch onNavigate={handleNav} />
            </div>

            {/* Right: Notifications + Profile */}
            <div className="flex items-center gap-2 md:gap-6">
              {/* Notification */}
              <div className="relative">
                <button
                  suppressHydrationWarning
                  className="relative p-2 text-[#99a1af] hover:text-white transition-colors"
                  aria-label="View notifications"
                  ref={notificationButtonRef}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#fb2c36] rounded-full border-2 border-app-sidebar-bg" aria-label="Unread notifications" />
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

              {/* Profile */}
              <div className="relative" ref={profileButtonRef}>
                <button
                  suppressHydrationWarning
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-normal text-[#d1d5dc]">{userName}</div>
                  </div>
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#c27aff] to-[#fb64b6] p-[2px]">
                      <div className="w-full h-full flex items-center justify-center rounded-full bg-app-sidebar-bg border-2 border-app-sidebar-bg text-white">
                        {userInitials}
                      </div>
                    </div>
                  </div>
                  <ChevronDown size={16} className="text-[#99a1af] hidden md:block" aria-hidden="true" />
                </button>

                {/* Profile Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden z-[100]">
                    <div className="py-1">
                      <button
                        suppressHydrationWarning
                        className="w-full px-4 py-3 text-left text-sm text-[#0f172b] hover:bg-gray-50 transition-colors flex items-center gap-3"
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleNav('profile');
                        }}
                      >
                        <User size={16} className="text-gray-600" />
                        Profile
                      </button>
                      <button
                        suppressHydrationWarning
                        className="w-full px-4 py-3 text-left text-sm text-[#0f172b] hover:bg-gray-50 transition-colors flex items-center gap-3"
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleNav('settings');
                        }}
                      >
                        <Settings size={16} className="text-gray-600" />
                        Settings
                      </button>
                      <div className="my-1 h-px bg-gray-100"></div>
                      <button
                        suppressHydrationWarning
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onLogout) {
                            onLogout();
                          } else {
                            localStorage.removeItem('auth_token');
                            localStorage.removeItem('auth_user');
                            router.push('/login');
                          }
                        }}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 custom-scrollbar-light" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};

// NavItem Component
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      suppressHydrationWarning
      onClick={onClick}
      className={classNames(
        "relative flex items-center gap-4 px-4 py-3 rounded-[16px] cursor-pointer transition-all duration-200 group overflow-hidden border border-transparent w-full text-left focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-app-sidebar-bg",
        active
          ? "bg-gradient-to-r from-white/10 to-white/5 text-white shadow-lg border-white/5"
          : "hover:bg-white/5 hover:text-white"
      )}
      aria-current={active ? 'page' : undefined}
      type="button"
    >
      <div className={classNames("flex items-center justify-center transition-transform duration-200", active ? "scale-105" : "group-hover:scale-105")} aria-hidden="true">
        {icon}
      </div>
      <span className="text-[15px] tracking-wide font-normal">{label}</span>
    </button>
  );
}

// NavItemExpandable Component
interface NavItemExpandableProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}

function NavItemExpandable({ icon, label, active, expanded, onClick }: NavItemExpandableProps) {
  return (
    <button
      suppressHydrationWarning
      onClick={onClick}
      className={classNames(
        "relative flex items-center gap-4 px-4 py-3 rounded-[16px] cursor-pointer transition-all duration-200 group overflow-hidden border border-transparent w-full text-left focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-app-sidebar-bg",
        active
          ? "bg-gradient-to-r from-white/10 to-white/5 text-white shadow-lg border-white/5"
          : "hover:bg-white/5 hover:text-white"
      )}
      type="button"
    >
      <div className={classNames("flex items-center justify-center transition-transform duration-200", active ? "scale-105" : "group-hover:scale-105")} aria-hidden="true">
        {icon}
      </div>
      <span className="text-[15px] tracking-wide font-normal flex-1">{label}</span>
      <ChevronRight
        size={16}
        className={classNames(
          "transition-transform duration-200",
          expanded ? "rotate-90" : ""
        )}
      />
    </button>
  );
}

// NavSubItem Component
interface NavSubItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavSubItem({ label, active, onClick }: NavSubItemProps) {
  return (
    <button
      suppressHydrationWarning
      onClick={onClick}
      className={classNames(
        "relative flex items-center gap-3 px-4 py-2 rounded-[12px] cursor-pointer transition-all duration-200 group overflow-hidden w-full text-left focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-app-sidebar-bg",
        active
          ? "bg-white/5 text-white"
          : "text-[#99a1af] hover:bg-white/5 hover:text-white"
      )}
      aria-current={active ? 'page' : undefined}
      type="button"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" aria-hidden="true" />
      <span className="text-[14px] font-normal">{label}</span>
    </button>
  );
}