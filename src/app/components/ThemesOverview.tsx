import React, { useState } from 'react';
import { Plus, X, Copy, Settings, Eye, Palette, Clock, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { toast } from 'sonner';
import Slider from "react-slick";
import { SlickStyles } from './SlickStyles';

interface Theme {
  id: string;
  name: string;
  status: 'live' | 'draft';
  lastModified: string;
  thumbnail?: string;
}

const mockThemes: Theme[] = [
  {
    id: '1',
    name: 'Default Theme',
    status: 'live',
    lastModified: 'Published on Dec 15, 2024'
  },
  {
    id: '2',
    name: 'Holiday Edition',
    status: 'draft',
    lastModified: 'Saved 2 hours ago'
  },
  {
    id: '3',
    name: 'Minimal Clean',
    status: 'draft',
    lastModified: 'Saved yesterday'
  }
];

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

export const ThemesOverview: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [themes, setThemes] = useState(mockThemes);

  const liveTheme = themes.find(t => t.status === 'live');
  const draftThemes = themes.filter(t => t.status === 'draft');

  // Metrics data
  const metrics = [
    {
      title: 'Live Theme',
      value: '1',
      icon: Palette,
      bgClass: 'bg-green-100',
      colorClass: 'text-green-600',
      tooltip: 'Currently active theme on your store'
    },
    {
      title: 'Draft Themes',
      value: draftThemes.length.toString(),
      icon: Eye,
      bgClass: 'bg-amber-100',
      colorClass: 'text-amber-600',
      tooltip: 'Themes in draft status'
    },
    {
      title: 'Last Published',
      value: 'Dec 15',
      icon: Calendar,
      bgClass: 'bg-blue-100',
      colorClass: 'text-blue-600',
      tooltip: 'Date when current theme was published'
    },
    {
      title: 'Last Edited',
      value: '2h ago',
      icon: Clock,
      bgClass: 'bg-purple-100',
      colorClass: 'text-purple-600',
      tooltip: 'Most recent theme modification'
    }
  ];

  const handleDuplicate = (themeId: string, themeName: string) => {
    const newTheme: Theme = {
      id: Date.now().toString(),
      name: `${themeName} (Copy)`,
      status: 'draft',
      lastModified: 'Just now'
    };
    setThemes([...themes, newTheme]);
    toast.success('Theme duplicated');
  };

  const handlePublish = (themeId: string) => {
    setThemes(themes.map(t => {
      if (t.id === themeId) {
        return { ...t, status: 'live' as const, lastModified: `Published on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` };
      }
      if (t.status === 'live') {
        return { ...t, status: 'draft' as const, lastModified: 'Saved just now' };
      }
      return t;
    }));
    toast.success('Theme published successfully');
  };

  const handleDelete = (themeId: string) => {
    setThemes(themes.filter(t => t.id !== themeId));
    toast.success('Theme deleted');
  };

  const handleCreateBlank = () => {
    const newTheme: Theme = {
      id: Date.now().toString(),
      name: 'Untitled Theme',
      status: 'draft',
      lastModified: 'Just now'
    };
    setThemes([...themes, newTheme]);
    setShowAddModal(false);
    toast.success('Blank theme created');
  };

  const handleDuplicateExisting = () => {
    if (liveTheme) {
      handleDuplicate(liveTheme.id, liveTheme.name);
      setShowAddModal(false);
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

  return (
    <TooltipProvider>
      <SlickStyles />
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-gray-900">Themes</h1>
            <p className="text-gray-600 mt-1">Manage and customize your store&apos;s appearance</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="h-[50px] bg-[#0e042f] text-white rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 font-medium px-6 hover:bg-[#1a0a4a] transition-colors"
          >
            <Plus size={20} />
            Add Theme
          </button>
        </div>

        {/* Metrics Section - Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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

        {/* Content */}
        <div className="space-y-8">
          {/* Current Theme Section */}
          {liveTheme && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-gray-900">Current Theme</h2>
                  <p className="text-sm text-gray-500 mt-1">This theme is live on your store</p>
                </div>
              </div>
              
              {/* Full-width Current Theme Card - Preview Only */}
              <div className="relative bg-white rounded-2xl border-2 border-green-200 shadow-lg overflow-hidden hover:shadow-xl transition-all mb-6">
                {/* Live Badge - Top Right */}
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 z-10">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Live
                </div>

                {/* Compact Preview Container */}
                <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8 flex items-center justify-center">
                  {/* Browser Frame Mock - Centered and Contained */}
                  <div className="w-full max-w-[700px]">
                    <div className="w-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                      {/* Browser Chrome */}
                      <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 ml-2">
                          yourstore.com
                        </div>
                      </div>
                      
                      {/* Homepage Preview Content - More Compact */}
                      <div className="bg-white">
                        {/* Hero Section */}
                        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 px-6 py-8 text-center border-b border-gray-100">
                          <div className="w-24 h-3 bg-gray-800 rounded mx-auto mb-3"></div>
                          <div className="w-36 h-2 bg-gray-400 rounded mx-auto mb-4"></div>
                          <div className="w-20 h-7 bg-blue-600 rounded mx-auto"></div>
                        </div>
                        
                        {/* Product Grid Preview */}
                        <div className="p-5 grid grid-cols-4 gap-2.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-gray-100 rounded"></div>
                          ))}
                        </div>
                        
                        {/* Feature Sections */}
                        <div className="px-5 pb-5 space-y-2">
                          <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata & Actions Below Preview Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
                <div className="max-w-3xl mx-auto">
                  {/* Theme Name & Date */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{liveTheme.name}</h3>
                    <p className="text-sm text-gray-500">{liveTheme.lastModified}</p>
                  </div>

                  {/* Description */}
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Palette size={16} className="text-gray-400" />
                      <span>Modern e-commerce theme with responsive design</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} className="text-gray-400" />
                      <span>Last updated 2 hours ago</span>
                    </div>
                  </div>

                  {/* Primary CTA - Full Width */}
                  <button
                    onClick={() => onNavigate('website-builder')}
                    className="w-full h-12 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0a4a] transition-colors font-semibold shadow-md hover:shadow-lg mb-3"
                  >
                    Customize Theme
                  </button>
                  
                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => toast.info('Theme settings opened')}
                      className="h-10 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={() => handleDuplicate(liveTheme.id, liveTheme.name)}
                      className="h-10 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Copy size={16} />
                      Duplicate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Draft Themes Section */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-gray-900">Draft Themes</h2>
                <p className="text-sm text-gray-500 mt-1">Unpublished themes you can experiment with</p>
              </div>
            </div>
            
            {draftThemes.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {draftThemes.map((theme) => (
                  <div key={theme.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:border-gray-300 hover:shadow-md transition-all flex flex-col">
                    {/* Fixed Aspect Ratio Preview (16:10) - Same as Current Theme */}
                    <div className="relative w-full bg-gradient-to-br from-gray-50 to-white border-b border-gray-200 p-6 flex items-center justify-center" style={{ aspectRatio: '16/10' }}>
                      {/* Draft Badge */}
                      <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-semibold z-10">
                        Draft
                      </div>

                      {/* Mini Browser Mock - Contained */}
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-full h-full bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex flex-col" style={{ objectFit: 'contain' }}>
                          {/* Mini Browser Chrome */}
                          <div className="bg-gray-100 px-2 py-1.5 flex items-center gap-1 border-b border-gray-200 flex-shrink-0">
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            </div>
                          </div>
                          
                          {/* Mini Content */}
                          <div className="flex-1 bg-white p-2.5 space-y-2 overflow-hidden">
                            <div className="h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded"></div>
                            <div className="grid grid-cols-3 gap-1.5">
                              <div className="aspect-square bg-gray-100 rounded"></div>
                              <div className="aspect-square bg-gray-100 rounded"></div>
                              <div className="aspect-square bg-gray-100 rounded"></div>
                            </div>
                            <div className="space-y-1">
                              <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-1.5 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Below Preview */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{theme.name}</h3>
                        <p className="text-xs text-gray-500">{theme.lastModified}</p>
                      </div>

                      {/* Actions at Bottom */}
                      <div className="mt-auto space-y-2.5">
                        {/* Primary: Customize */}
                        <button
                          onClick={() => onNavigate('website-builder')}
                          className="w-full h-11 px-3 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-colors font-medium text-sm"
                        >
                          Customize
                        </button>
                        
                        {/* Secondary: Publish & Delete */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handlePublish(theme.id)}
                            className="h-10 px-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                          >
                            Publish
                          </button>
                          <button
                            onClick={() => handleDelete(theme.id)}
                            className="h-10 px-3 bg-white text-red-600 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No draft themes yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create a new theme or duplicate your current theme to get started
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Theme
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Theme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Add Theme</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <button
                onClick={handleCreateBlank}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Plus size={20} className="text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Create Blank Theme</h4>
                    <p className="text-sm text-gray-600">Start with an empty canvas and build from scratch</p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleDuplicateExisting}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Copy size={20} className="text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Duplicate Existing Theme</h4>
                    <p className="text-sm text-gray-600">Create a copy of your current theme to modify</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
};
