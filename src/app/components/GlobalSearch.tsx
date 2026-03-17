"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, CornerDownLeft, Users, Database, Key, Activity, Shield, ChartBar, FileText, Settings, ListFilter, House, Grid3x3, Globe, Sparkles, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface SearchRecord {
  id: string;
  module: string;
  title: string;
  subtitle?: string;
  status?: string;
  path: string[];
  tags?: string[];
}

// Sample admin search data
const GLOBAL_INDEX: SearchRecord[] = [
  { id: 'dashboard', module: 'Navigation', title: 'Dashboard', path: ['Dashboard'], tags: ['home', 'index', 'overview'] },
  { id: 'students-all', module: 'Students', title: 'All Students', path: ['Students', 'All Students'], tags: ['students', 'manage', 'list'] },
  { id: 'students-profiles', module: 'Students', title: 'Student Profiles', path: ['Students', 'Profiles'], tags: ['profiles', 'details', 'data'] },
  { id: 'students-applications', module: 'Students', title: 'Applications', path: ['Students', 'Applications'], tags: ['apps', 'admissions', 'apply'] },
  { id: 'students-status', module: 'Students', title: 'Status Tracking', path: ['Students', 'Status Tracking'], tags: ['tracking', 'status', 'stages'] },
  { id: 'services-sim-cards', module: 'Services', title: 'SIM Cards', path: ['Services', 'SIM Cards'], tags: ['telecom', 'plans', 'mobile'] },
  { id: 'services-banks', module: 'Services', title: 'Banks', path: ['Services', 'Banks'], tags: ['finance', 'accounts', 'cards'] },
  { id: 'services-insurance', module: 'Services', title: 'Insurance', path: ['Services', 'Insurance'], tags: ['health', 'travel', 'insurance'] },
  { id: 'services-visa', module: 'Services', title: 'Visa', path: ['Services', 'Visa Assistance'], tags: ['visa', 'embassy', 'applications'] },
  { id: 'services-taxes', module: 'Services', title: 'Taxes', path: ['Services', 'Taxes'], tags: ['finance', 'tax', 'returns'] },
  { id: 'services-loans', module: 'Services', title: 'Loans', path: ['Services', 'Loans'], tags: ['finance', 'funding', 'study'] },
  { id: 'services-credit', module: 'Services', title: 'Build Credit', path: ['Services', 'Build Credit'], tags: ['credit', 'score', 'history'] },
  { id: 'services-housing', module: 'Services', title: 'Housing', path: ['Services', 'Housing'], tags: ['accommodation', 'rent', 'stay'] },
  { id: 'services-forex', module: 'Services', title: 'Forex', path: ['Services', 'Forex'], tags: ['currency', 'exchange', 'transfer'] },
  { id: 'services-employment', module: 'Services', title: 'Employment', path: ['Services', 'Employment'], tags: ['jobs', 'careers', 'work'] },
  { id: 'services-food', module: 'Services', title: 'Food', path: ['Services', 'Food'], tags: ['dining', 'meals', 'plans'] },
  { id: 'services-courses', module: 'Services', title: 'Courses', path: ['Services', 'Courses'], tags: ['study', 'programs', 'subjects'] },
  { id: 'countries-list', module: 'Countries', title: 'Countries', path: ['Countries & Universities', 'Countries'], tags: ['locations', 'nations', 'map'] },
  { id: 'universities-list', module: 'Countries', title: 'Universities', path: ['Countries & Universities', 'Universities'], tags: ['institutes', 'colleges', 'study'] },
  { id: 'ai-test-overview', module: 'AI', title: 'AI Test Overview', path: ['AI Assistant', 'Overview'], tags: ['ai', 'scoring', 'metrics'] },
  { id: 'ai-test-library', module: 'AI', title: 'AI Test Library', path: ['AI Assistant', 'Library'], tags: ['ai', 'tests', 'questions'] },
  { id: 'bookings-list', module: 'Bookings', title: 'Bookings', path: ['Bookings & Leads', 'Bookings'], tags: ['appointments', 'leads', 'schedules'] }
];

const MODULE_ICONS: { [key: string]: React.ReactNode } = {
  Navigation: <House size={20} />,
  Students: <Users size={20} />,
  Services: <Grid3x3 size={20} />,
  Countries: <Globe size={20} />,
  AI: <Sparkles size={20} />,
  Bookings: <Calendar size={20} />
};

const MODULE_COLORS: { [key: string]: string } = {
  Navigation: 'text-blue-600',
  Students: 'text-green-600',
  Services: 'text-purple-600',
  Countries: 'text-orange-600',
  AI: 'text-pink-600',
  Bookings: 'text-indigo-600'
};

interface GlobalSearchProps {
  onNavigate?: (page: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Filter results based on query
  const filteredResults = query.trim() === ''
    ? GLOBAL_INDEX.slice(0, 5) // Show first 5 as recent
    : GLOBAL_INDEX.filter(item => {
      const searchText = `${item.title} ${item.subtitle || ''} ${item.tags?.join(' ') || ''}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

  // Group results by module
  const groupedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.module]) {
      acc[item.module] = [];
    }
    acc[item.module].push(item);
    return acc;
  }, {} as { [key: string]: SearchRecord[] });

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Arrow key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredResults[selectedIndex]);
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (result: SearchRecord) => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
    onNavigate?.(result.id);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-[#90a1b9]" aria-hidden="true" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="w-full h-9 pl-9 pr-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-[#90a1b9] focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            placeholder="Search... (⌘K)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            aria-label="Global search"
            aria-expanded={isOpen}
            aria-controls="search-results"
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-[600px] max-h-[500px] p-2 overflow-y-auto bg-white border border-slate-200 shadow-xl rounded-xl"
        align="start"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div id="search-results" ref={resultsRef} role="listbox">
          {filteredResults.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <>
              {query.trim() === '' && (
                <div className="px-3 py-2 text-xs text-slate-400 uppercase tracking-wide">
                  Recent Searches
                </div>
              )}

              {Object.entries(groupedResults).map(([module, items]) => (
                <div key={module} className="mb-2">
                  <div className="px-3 py-2 text-xs text-slate-500 uppercase tracking-wide">
                    {module}
                  </div>
                  {items.map((item, idx) => {
                    const globalIndex = filteredResults.findIndex(r => r.id === item.id);
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <button
                        key={item.id}
                        data-index={globalIndex}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full py-2.5 px-3 rounded-lg cursor-pointer transition-all flex items-center justify-between border ${isSelected
                          ? 'bg-slate-50 border-slate-100'
                          : 'border-transparent hover:bg-slate-50'
                          }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`flex-shrink-0 ${MODULE_COLORS[module] || 'text-gray-600'}`}>
                            {MODULE_ICONS[module] || <FileText size={20} />}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="font-medium text-slate-900 truncate">
                              {item.title}
                            </div>
                            {item.subtitle && (
                              <div className="text-sm text-slate-500 truncate">
                                {item.subtitle}
                              </div>
                            )}
                          </div>
                          {item.status && (
                            <span className="flex-shrink-0 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-md">
                              {item.status}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          <div className="text-xs text-slate-400 truncate max-w-[120px]">
                            {item.path.join(' › ')}
                          </div>
                          {isSelected && (
                            <CornerDownLeft size={10} className="text-slate-400" aria-hidden="true" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}

              {filteredResults.length > 8 && (
                <div className="px-3 py-2 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    See all {filteredResults.length} results
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};