"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, CornerDownLeft, Users, Database, Key, Activity, Shield, ChartBar, FileText, Settings, ListFilter } from 'lucide-react';
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
  {
    id: '1',
    module: 'Users',
    title: 'User Management',
    subtitle: '1,247 active users',
    status: 'Active',
    path: ['Admin', 'Users'],
    tags: ['users', 'manage', 'accounts']
  },
  {
    id: '2',
    module: 'Users',
    title: 'Roles & Permissions',
    subtitle: '12 roles configured',
    path: ['Admin', 'Users', 'Roles'],
    tags: ['roles', 'permissions', 'access']
  },
  {
    id: '3',
    module: 'Database',
    title: 'Data Management',
    subtitle: 'Manage database records',
    status: 'Connected',
    path: ['Admin', 'Database'],
    tags: ['database', 'data', 'records']
  },
  {
    id: '4',
    module: 'API',
    title: 'API Keys',
    subtitle: '8 active keys',
    path: ['Admin', 'API'],
    tags: ['api', 'keys', 'tokens']
  },
  {
    id: '5',
    module: 'Logs',
    title: 'System Logs',
    subtitle: 'View audit trail',
    path: ['Admin', 'Logs'],
    tags: ['logs', 'audit', 'system']
  },
  {
    id: '6',
    module: 'Analytics',
    title: 'Analytics Dashboard',
    subtitle: 'Performance metrics',
    status: 'Updated',
    path: ['Admin', 'Analytics'],
    tags: ['analytics', 'metrics', 'reports']
  },
  {
    id: '7',
    module: 'Reports',
    title: 'Custom Reports',
    subtitle: '24 reports created',
    path: ['Admin', 'Reports'],
    tags: ['reports', 'custom', 'data']
  },
  {
    id: '8',
    module: 'Settings',
    title: 'System Settings',
    subtitle: 'Configure system',
    path: ['Admin', 'Settings'],
    tags: ['settings', 'config', 'system']
  }
];

const MODULE_ICONS: { [key: string]: React.ReactNode } = {
  Users: <Users size={20} />,
  Database: <Database size={20} />,
  API: <Key size={20} />,
  Logs: <Activity size={20} />,
  Analytics: <ChartBar size={20} />,
  Reports: <FileText size={20} />,
  Settings: <Settings size={20} />
};

const MODULE_COLORS: { [key: string]: string } = {
  Users: 'text-blue-600',
  Database: 'text-green-600',
  API: 'text-purple-600',
  Logs: 'text-orange-600',
  Analytics: 'text-pink-600',
  Reports: 'text-indigo-600',
  Settings: 'text-gray-600'
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
    onNavigate?.(result.module.toLowerCase());
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
              No results found for "{query}"
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