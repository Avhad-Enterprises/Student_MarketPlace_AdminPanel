import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, FileText, User, AlertCircle, Paperclip } from 'lucide-react';
import { DateInput } from '@/components/ui/date-input';

interface ActivityLogItem {
  id: string;
  type: 'status' | 'note' | 'assignment' | 'document';
  title: string;
  user: string;
  date: string;
  timeAgo: string;
  details?: {
    previous?: string;
    current?: string;
  };
}

interface ActivityLogDrawerProps {
  open: boolean;
  onClose: () => void;
  serviceName: string;
}

const mockActivityLogs: ActivityLogItem[] = [
  {
    id: '1',
    type: 'status',
    title: 'Status updated to In Progress',
    user: 'Sarah Johnson',
    date: 'Feb 1, 2024',
    timeAgo: '2 hours ago',
    details: {
      previous: 'Not Started',
      current: 'In Progress'
    }
  },
  {
    id: '2',
    type: 'note',
    title: 'Note added: Initial consultation completed',
    user: 'Michael Chen',
    date: 'Jan 31, 2024',
    timeAgo: '1 day ago',
    details: {
      current: 'Student showed strong interest in engineering programs. Recommended top 5 universities based on profile.'
    }
  },
  {
    id: '3',
    type: 'assignment',
    title: 'Assigned to Michael Chen',
    user: 'Admin',
    date: 'Jan 30, 2024',
    timeAgo: '2 days ago',
    details: {
      previous: 'Sarah Johnson',
      current: 'Michael Chen'
    }
  },
  {
    id: '4',
    type: 'document',
    title: 'Documents attached: Passport Copy, Academic Transcripts',
    user: 'Sarah Johnson',
    date: 'Jan 29, 2024',
    timeAgo: '3 days ago'
  },
  {
    id: '5',
    type: 'status',
    title: 'Status updated to Not Started',
    user: 'System',
    date: 'Jan 28, 2024',
    timeAgo: '4 days ago',
    details: {
      previous: 'Pending',
      current: 'Not Started'
    }
  }
];

export function ActivityLogDrawer({ open, onClose, serviceName }: ActivityLogDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'status' | 'notes' | 'assignments' | 'documents'>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getIcon = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'status':
        return <AlertCircle className="w-4 h-4" />;
      case 'note':
        return <FileText className="w-4 h-4" />;
      case 'assignment':
        return <User className="w-4 h-4" />;
      case 'document':
        return <Paperclip className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'status':
        return 'text-blue-600 bg-blue-50';
      case 'note':
        return 'text-purple-600 bg-purple-50';
      case 'assignment':
        return 'text-green-600 bg-green-50';
      case 'document':
        return 'text-amber-600 bg-amber-50';
    }
  };

  const filteredLogs = mockActivityLogs.filter(log => {
    // Filter by type
    if (filterType !== 'all') {
      const typeMap = {
        status: 'status',
        notes: 'note',
        assignments: 'assignment',
        documents: 'document'
      };
      if (log.type !== typeMap[filterType]) return false;
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!log.title.toLowerCase().includes(query) &&
        !log.user.toLowerCase().includes(query)) {
        return false;
      }
    }

    return true;
  });

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-semibold text-gray-900">Activity Log</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600">{serviceName}</p>
        </div>

        {/* Filters */}
        <div className="border-b border-gray-200 px-6 py-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search log..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-3 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#253154] focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-3">
            {/* Filter Dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#253154] focus:border-transparent text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="status">Status Changes</option>
              <option value="notes">Notes</option>
              <option value="assignments">Assignments</option>
              <option value="documents">Documents</option>
            </select>

            {/* Date Range */}
            <div className="flex gap-2 items-center">
              <DateInput
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
              <span className="text-gray-400">–</span>
              <DateInput
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Timeline List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No activity found for the selected filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log, index) => {
                const isExpanded = expandedItems.has(log.id);
                const hasDetails = log.details && (log.details.previous || log.details.current);

                return (
                  <div key={log.id} className="relative">
                    {/* Timeline line */}
                    {index < filteredLogs.length - 1 && (
                      <div className="absolute left-[15px] top-[32px] bottom-[-16px] w-px bg-gray-200" />
                    )}

                    {/* Log item */}
                    <div className="relative">
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getIconColor(log.type)}`}>
                          {getIcon(log.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div
                            className={`bg-gray-50 rounded-lg p-3 ${hasDetails ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                            onClick={() => hasDetails && toggleExpanded(log.id)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium text-gray-900">{log.title}</p>
                              {hasDetails && (
                                <button className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              by {log.user} • {log.date} • {log.timeAgo}
                            </p>

                            {/* Expandable details */}
                            {hasDetails && isExpanded && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                {log.details?.previous && log.details?.current && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className="text-gray-500">Previous:</span>
                                      <span className="px-2 py-1 bg-red-50 text-red-700 rounded">
                                        {log.details.previous}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className="text-gray-500">Current:</span>
                                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                                        {log.details.current}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {!log.details?.previous && log.details?.current && (
                                  <p className="text-xs text-gray-600">{log.details.current}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}