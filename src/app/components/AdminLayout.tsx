"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  House, Users, Grid3x3, Globe, Sparkles, Calendar, Mail, Wallet,
  BarChart3, FileEdit, Store, Settings, Bell, Menu, ChevronDown, ChevronRight, User, LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
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

export const AdminLayout = ({ children, activePage = 'dashboard', onNavigate, onLogout }: AdminLayoutProps) => {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();

  const navSections: NavSection[] = [
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
        { id: 'services-courses', label: 'Courses' }
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
        { id: 'store-navigation', label: 'Navigation' },
        { id: 'store-preferences', label: 'Preferences' }
      ]
    }
  ];

  const handleNav = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      // Default internal navigation logic
      const routeMap: Record<string, string> = {
        'dashboard': '/dashboard',
        'students-all': '/students',
        'students-profiles': '/students/profiles',
        'students-applications': '/students/applications',
        'students-status': '/students/status-tracking',
        'countries-list': '/countries',
        'universities-list': '/universities',
        'add-country': '/countries/add',
      };

      if (routeMap[page]) {
        router.push(routeMap[page]);
      } else if (page.startsWith('services-')) {
        const service = page.replace('services-', '');
        router.push(`/services/${service}`);
      }
    }
    setSidebarOpen(false);
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

  return (
    <div className="bg-app-bg min-h-screen w-full font-sans text-app-heading flex relative overflow-hidden">
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
          {navSections.slice(1).map((section) => (
            <div key={section.id}>
              {section.items ? (
                <>
                  <NavItemExpandable
                    icon={section.icon}
                    label={section.label}
                    active={isPageInSection(section)}
                    expanded={expandedSections.includes(section.id)}
                    onClick={() => toggleSection(section.id)}
                  />
                  {expandedSections.includes(section.id) && (
                    <div className="ml-4 mt-1 space-y-1">
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
              <GlobalSearch onNavigate={onNavigate} />
            </div>

            {/* Right: Notifications + Profile */}
            <div className="flex items-center gap-2 md:gap-6">
              {/* Notification */}
              <div className="relative">
                <button
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
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-normal text-[#d1d5dc]\">Admin User</div>
                  </div>
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#c27aff] to-[#fb64b6] p-[2px]">
                      <div className="w-full h-full flex items-center justify-center rounded-full bg-app-sidebar-bg border-2 border-app-sidebar-bg text-white">
                        AU
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
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout?.();
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