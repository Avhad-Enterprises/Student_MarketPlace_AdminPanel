/**
 * UNSAVED CHANGES SYSTEM - INTEGRATION EXAMPLES
 * 
 * This file demonstrates how to integrate the unsaved changes modal
 * across different parts of the application.
 * 
 * EXAMPLES INCLUDED:
 * 1. Form with unsaved changes detection
 * 2. Sidebar navigation with guards
 * 3. Page switching with confirmation
 * 4. Logout with unsaved check
 * 5. Back button with guard
 * 6. Cancel button with guard
 * 7. Tab switching with indicators
 * 8. Section switching with warnings
 */

import React, { useState } from 'react';
import { 
  useUnsavedChanges, 
  UnsavedChangesProvider 
} from './UnsavedChangesModal';
import {
  DotIndicator,
  UnsavedLabel,
  DraftBadge,
  TabIndicator,
  HeaderIndicator,
  SectionIndicator,
  NavigationGuard,
} from './DirtyStateIndicators';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Home, 
  Settings, 
  Users, 
  LogOut,
  FileText,
  Image,
  Globe
} from 'lucide-react';

// ============================================
// EXAMPLE 1: FORM WITH UNSAVED CHANGES
// ============================================

export const FormWithUnsavedChanges: React.FC = () => {
  const { markDirty, markClean, hasDirtyChanges, lastSavedTime } = useUnsavedChanges();
  const [formData, setFormData] = useState({ name: '', email: '', bio: '' });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    markDirty('contact-form', 'Contact Form');
  };

  const handleSave = async () => {
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    markClean('contact-form');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header with status */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#0e042f]">Contact Form</h2>
        <HeaderIndicator
          hasDirtyChanges={hasDirtyChanges}
          lastSavedTime={lastSavedTime || undefined}
          saveStatus="idle"
          variant="compact"
        />
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            rows={4}
            placeholder="Tell us about yourself"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={!hasDirtyChanges}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0e042f] text-white rounded-lg font-semibold hover:bg-[#1a0c4a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

// ============================================
// EXAMPLE 2: SIDEBAR WITH NAVIGATION GUARDS
// ============================================

export const SidebarWithGuards: React.FC = () => {
  const { requestNavigation, hasDirtyChanges } = useUnsavedChanges();
  const [activePage, setActivePage] = useState('home');

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'content', label: 'Content', icon: FileText, hasDirty: true },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const handleNavigate = (pageId: string) => {
    requestNavigation(() => {
      setActivePage(pageId);
    });
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-4">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#0e042f] mb-2">Navigation</h3>
        {hasDirtyChanges && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <DotIndicator size="sm" color="amber" pulse />
            <span className="text-xs text-amber-700 font-medium">Unsaved changes</span>
          </div>
        )}
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-[#0e042f] text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.hasDirty && (
                <DotIndicator size="sm" color="amber" pulse={isActive} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout with guard */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={() => requestNavigation(() => console.log('Logging out...'))}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

// ============================================
// EXAMPLE 3: PAGE HEADER WITH BACK BUTTON
// ============================================

export const PageHeaderWithGuard: React.FC = () => {
  const { requestNavigation, hasDirtyChanges, lastSavedTime } = useUnsavedChanges();

  const handleBack = () => {
    requestNavigation(() => {
      console.log('Navigating back...');
    });
  };

  const handleCancel = () => {
    requestNavigation(() => {
      console.log('Cancelling...');
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Back button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Center: Title & Status */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-[#0e042f]">Edit Page</h1>
          <HeaderIndicator
            hasDirtyChanges={hasDirtyChanges}
            lastSavedTime={lastSavedTime || undefined}
            isDraftMode={true}
            variant="compact"
          />
        </div>

        {/* Right: Cancel button */}
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 font-medium"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  );
};

// ============================================
// EXAMPLE 4: TAB SWITCHING WITH INDICATORS
// ============================================

export const TabsWithIndicators: React.FC = () => {
  const { requestNavigation, dirtySections } = useUnsavedChanges();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'content', label: 'Content' },
    { id: 'seo', label: 'SEO' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const handleTabChange = (tabId: string) => {
    requestNavigation(() => {
      setActiveTab(tabId);
    });
  };

  const hasDirtyChanges = (tabId: string) => {
    return dirtySections.some((s) => s.id.includes(tabId));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <TabIndicator
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            hasDirtyChanges={hasDirtyChanges(tab.id)}
            onClick={() => handleTabChange(tab.id)}
          />
        ))}
      </div>

      {/* Tab content */}
      <div className="py-4">
        <p className="text-gray-600">Content for {activeTab} tab</p>
      </div>
    </div>
  );
};

// ============================================
// EXAMPLE 5: SECTION SWITCHING WITH WARNINGS
// ============================================

export const SectionSwitchingExample: React.FC = () => {
  const { markDirty, dirtySections, requestNavigation } = useUnsavedChanges();
  const [activeSection, setActiveSection] = useState('header');

  const sections = [
    { id: 'header', name: 'Header Section' },
    { id: 'hero', name: 'Hero Section' },
    { id: 'features', name: 'Features Section' },
    { id: 'footer', name: 'Footer Section' },
  ];

  const handleSectionChange = (sectionId: string) => {
    requestNavigation(() => {
      setActiveSection(sectionId);
    });
  };

  const handleEdit = (sectionId: string) => {
    markDirty(sectionId, sections.find((s) => s.id === sectionId)?.name);
  };

  const hasDirtyChanges = (sectionId: string) => {
    return dirtySections.some((s) => s.id === sectionId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-[#0e042f] mb-6">Page Sections</h2>

      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`
              p-4 rounded-xl border-2 transition-all cursor-pointer
              ${activeSection === section.id 
                ? 'border-[#0e042f] bg-purple-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            onClick={() => handleSectionChange(section.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-900">{section.name}</span>
                {hasDirtyChanges(section.id) && (
                  <>
                    <DotIndicator size="sm" color="amber" pulse />
                    <UnsavedLabel size="sm" />
                  </>
                )}
              </div>

              {activeSection === section.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(section.id);
                  }}
                  className="px-4 py-2 bg-[#0e042f] text-white rounded-lg text-sm font-medium hover:bg-[#1a0c4a] transition-colors"
                >
                  Edit Section
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// EXAMPLE 6: COMPLETE DEMO LAYOUT
// ============================================

export const CompleteDemoLayout: React.FC = () => {
  return (
    <UnsavedChangesProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <PageHeaderWithGuard />

        {/* Main Layout */}
        <div className="flex">
          {/* Sidebar */}
          <SidebarWithGuards />

          {/* Content */}
          <div className="flex-1 p-8 space-y-8">
            <FormWithUnsavedChanges />
            <TabsWithIndicators />
            <SectionSwitchingExample />
          </div>
        </div>
      </div>
    </UnsavedChangesProvider>
  );
};

// Export for documentation
export default CompleteDemoLayout;
