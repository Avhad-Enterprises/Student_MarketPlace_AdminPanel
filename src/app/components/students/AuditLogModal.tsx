import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import {
  Activity,
  User,
  FileText,
  DollarSign,
  UserCheck,
  RefreshCw,
  Upload,
  Edit,
  Download,
  Search,
  Filter,
  Calendar,
  Clock,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';
import { getActivitiesByStudentId, Activity as ActivityData } from '../../services/activitiesService';
import { format } from 'date-fns';

interface AuditLogModalProps {
  isOpen: boolean;
  studentId: string | undefined;
  studentName: string;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  studentId,
  studentName,
  onClose,
}) => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSource, setFilterSource] = useState('all');

  useEffect(() => {
    if (isOpen && studentId) {
      const fetchActivities = async () => {
        setIsLoading(true);
        try {
          const data = await getActivitiesByStudentId(studentId);
          setActivities(data);
        } catch (error) {
          console.error('Failed to fetch activities:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchActivities();
    }
  }, [isOpen, studentId]);

  // Helper to get icon and color based on activity type
  const getActivityMeta = (type: string) => {
    switch (type.toLowerCase()) {
      case 'status':
        return { icon: RefreshCw, color: 'text-amber-600', bgColor: 'bg-amber-50' };
      case 'counselor':
        return { icon: UserCheck, color: 'text-purple-600', bgColor: 'bg-purple-50' };
      case 'application':
        return { icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case 'document':
        return { icon: Upload, color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
      case 'payment':
        return { icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'service':
        return { icon: Activity, color: 'text-indigo-600', bgColor: 'bg-indigo-50' };
      case 'profile':
        return { icon: Edit, color: 'text-gray-600', bgColor: 'bg-gray-50' };
      default:
        return { icon: AlertCircle, color: 'text-gray-400', bgColor: 'bg-gray-100' };
    }
  };

  // Filter logs based on search and filters
  const filteredLogs = activities.filter(log => {
    const matchesSearch = log.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.content?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || log.type?.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Status', label: 'Status Changes' },
    { value: 'Counselor', label: 'Counselor Changes' },
    { value: 'Application', label: 'Applications' },
    { value: 'Document', label: 'Documents' },
    { value: 'Payment', label: 'Payments' },
    { value: 'Service', label: 'Services' },
    { value: 'Profile', label: 'Profile Updates' },
  ];

  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'manual', label: 'Manual' },
    { value: 'system', label: 'System' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1400px] w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 shrink-0">
          <DialogTitle>Audit Log - {studentName}</DialogTitle>
          <DialogDescription>
            Complete activity history and changes for this student
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search actions, descriptions, or users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <CustomSelect
                placeholder="All Categories"
                value={filterCategory}
                onChange={setFilterCategory}
                options={categoryOptions}
              />
            </div>

            {/* Source Filter */}
            <div>
              <CustomSelect
                placeholder="All Sources"
                value={filterSource}
                onChange={setFilterSource}
                options={sourceOptions}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="px-6 py-3 bg-white border-b border-gray-100 shrink-0">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredLogs.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{activities.length}</span> activities
            </p>
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3 h-3 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                Loading...
              </div>
            )}
          </div>
        </div>

        {/* Audit Log List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar-light">
          <div className="px-6 py-4">
            {!isLoading && filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <Activity size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No activities found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => {
                  const meta = getActivityMeta(log.type);
                  const Icon = meta.icon;
                  const date = new Date(log.created_at);

                  return (
                    <div
                      key={log.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg ${meta.bgColor} flex items-center justify-center shrink-0`}>
                          <Icon size={18} className={meta.color} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900">{log.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 shrink-0">
                              <Calendar size={12} />
                              <span>{format(date, 'yyyy-MM-dd')}</span>
                              <Clock size={12} className="ml-2" />
                              <span>{format(date, 'hh:mm a')}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{log.content}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <User size={12} />
                              <span className="font-medium">System</span> {/* Backend doesn't provide user yet */}
                            </div>
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600">
                              System
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-semibold">
                              {log.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Audit logs are retained for compliance and traceability
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-all text-sm font-semibold shadow-lg shadow-purple-900/20"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
