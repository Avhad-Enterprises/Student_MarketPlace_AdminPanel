import React, { useState } from 'react';
import { Settings, Layout, Palette } from 'lucide-react';
import { ModifiedSectionIndicator, ModifiedThemeIndicator } from './UnpublishedChangeIndicators';

// ============================================
// DEMO: How to integrate Part 7 change indicators
// ============================================

/**
 * Example 1: Section Row with Change Indicator
 * Shows how to add unpublished change dots to sidebar sections
 */
export const DemoSectionRowWithIndicator: React.FC<{
  sectionName: string;
  hasUnpublishedChanges?: boolean;
  isSelected?: boolean;
}> = ({ sectionName, hasUnpublishedChanges = false, isSelected = false }) => {
  return (
    <div 
      className={`px-4 py-2 flex items-center gap-2 cursor-pointer transition-colors ${
        isSelected ? 'bg-purple-50 border-l-4 border-purple-600' : 'hover:bg-gray-50'
      }`}
    >
      {/* 9️⃣ VISUAL CHANGE INDICATOR - Section */}
      <ModifiedSectionIndicator hasChanges={hasUnpublishedChanges} />
      
      <Layout size={16} className="text-gray-600" />
      <span className="text-sm font-medium text-gray-700">{sectionName}</span>
    </div>
  );
};

/**
 * Example 2: Theme Button with Change Indicator
 * Shows how to add unpublished change dots to the Theme settings button
 */
export const DemoThemeButtonWithIndicator: React.FC<{
  hasUnpublishedChanges?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ hasUnpublishedChanges = false, isActive = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-purple-100 text-purple-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Palette size={18} />
      <span className="text-sm font-medium">Theme</span>
      
      {/* 9️⃣ VISUAL CHANGE INDICATOR - Theme */}
      <ModifiedThemeIndicator hasChanges={hasUnpublishedChanges} />
    </button>
  );
};

/**
 * Example 3: Page Selector with Change Indicators
 * Shows how to add unpublished change dots to page dropdown
 */
export const DemoPageSelectorWithIndicators: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState('home');

  const pages = [
    { id: 'home', name: 'Home Page', hasChanges: true },
    { id: 'about', name: 'About Us', hasChanges: false },
    { id: 'services', name: 'Services', hasChanges: true },
    { id: 'contact', name: 'Contact', hasChanges: false },
  ];

  return (
    <div className="relative inline-block">
      <select
        value={selectedPage}
        onChange={(e) => setSelectedPage(e.target.value)}
        className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 appearance-none bg-white hover:bg-gray-50 cursor-pointer"
      >
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            {page.name} {page.hasChanges ? '•' : ''}
          </option>
        ))}
      </select>
      {/* Show indicator for selected page if it has changes */}
      {pages.find(p => p.id === selectedPage)?.hasChanges && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        </div>
      )}
    </div>
  );
};

/**
 * Example 4: Complete Sidebar with Multiple Indicators
 * Shows a full sidebar with change indicators on multiple sections
 */
export const DemoSidebarWithChangeTracking: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState('hero');

  const sections = [
    { id: 'header', name: 'Header', hasChanges: false, group: 'header' },
    { id: 'hero', name: 'Hero Banner', hasChanges: true, group: 'content' },
    { id: 'categories', name: 'Category Grid', hasChanges: true, group: 'content' },
    { id: 'testimonials', name: 'Testimonials', hasChanges: false, group: 'content' },
    { id: 'footer', name: 'Footer', hasChanges: false, group: 'footer' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">Page Sections</h2>
        <p className="text-xs text-gray-500 mt-1">
          {sections.filter(s => s.hasChanges).length} unpublished changes
        </p>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => (
          <DemoSectionRowWithIndicator
            key={section.id}
            sectionName={section.name}
            hasUnpublishedChanges={section.hasChanges}
            isSelected={selectedSection === section.id}
          />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <DemoThemeButtonWithIndicator 
          hasUnpublishedChanges={true}
          onClick={() => console.log('Open theme settings')}
        />
        
        {/* Publish indicator */}
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-xs text-orange-800 font-medium">
            You have unpublished changes
          </p>
          <button className="mt-2 w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">
            Publish Changes
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Example 5: Integration in Main Editor
 * Shows how all indicators work together in the full editor context
 */
export const DemoFullEditorWithIndicators: React.FC = () => {
  const [themeHasChanges] = useState(true);
  const [sectionsWithChanges] = useState(['hero', 'categories']);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar with Environment Badge (already enhanced in Part 7) */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Website Editor</h1>
          
          <div className="flex items-center gap-4">
            {/* Page selector with indicator */}
            <DemoPageSelectorWithIndicators />
            
            {/* Environment badge (Enhanced in Part 7) */}
            <div className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md">
              Draft
            </div>
            
            {/* Publish button */}
            <button className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold shadow-md">
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex">
        {/* Sidebar with change indicators */}
        <DemoSidebarWithChangeTracking />
        
        {/* Canvas Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview Canvas</h2>
            <p className="text-gray-600">
              This demo shows how Part 7 change indicators integrate throughout the UI.
              Orange dots appear next to any section or setting with unpublished changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Integration Instructions:
 * 
 * 1. Import the indicator components:
 *    import { ModifiedSectionIndicator, ModifiedThemeIndicator } from './UnpublishedChangeIndicators';
 * 
 * 2. Track which items have unpublished changes in your state:
 *    const [sectionsWithChanges, setSectionsWithChanges] = useState<string[]>([]);
 *    const [themeHasChanges, setThemeHasChanges] = useState(false);
 * 
 * 3. Add indicators to your UI:
 *    <ModifiedSectionIndicator hasChanges={sectionsWithChanges.includes(section.id)} />
 *    <ModifiedThemeIndicator hasChanges={themeHasChanges} />
 * 
 * 4. Update state when changes are made:
 *    - On section edit: setSectionsWithChanges([...sectionsWithChanges, sectionId])
 *    - On theme edit: setThemeHasChanges(true)
 *    - On publish: setSectionsWithChanges([]) and setThemeHasChanges(false)
 * 
 * 5. All indicators include built-in tooltips with "Unpublished changes" message
 */
