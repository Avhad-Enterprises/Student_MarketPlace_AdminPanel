"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ShieldCheck, 
  MapPin, 
  FileText, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  Mail,
  Phone,
  MessageSquare,
  Activity,
  History,
  TrendingUp,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  ServiceProviderDetailTemplate, 
  TabDefinition, 
  KPICard, 
  ActionButton 
} from './common/ServiceProviderDetailTemplate';
import { bookingService, Booking } from '../../services/bookingService';
import { ServiceProviderLogsTab, AuditLogEntry } from './common/ServiceProviderLogsTab';

interface BookingDetailProps {
  bookingId: string;
  onBack: () => void;
}

export const BookingDetail: React.FC<BookingDetailProps> = ({ bookingId, onBack }) => {
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<AuditLogEntry[]>([]);
  const [userRole] = useState<'superadmin' | 'admin'>('superadmin');

  const fetchBookingData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch data using the specific booking_id (e.g., BK-1234)
      const data = await bookingService.getBookingById(bookingId);
      setBookingData(data);
      
      // Mock logs for demonstration
      setActivityLogs([
        {
          id: '1',
          timestamp: data.created_at || new Date().toISOString(),
          actor: 'System',
          actorType: 'System',
          action: 'Created',
          entity: 'Booking',
          entityId: data.booking_id,
          severity: 'Info',
          summary: 'Booking initial registration',
          source: 'System'
        } as AuditLogEntry,
        {
          id: '2',
          timestamp: new Date().toISOString(),
          actor: 'Admin User',
          actorType: 'Admin',
          action: 'Viewed',
          entity: 'Booking',
          entityId: data.booking_id,
          severity: 'Info',
          summary: 'Accessed detailed booking profile',
          source: 'Admin Action'
        } as AuditLogEntry
      ]);
    } catch (error) {
      toast.error('Failed to load booking details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBookingData();
  }, [fetchBookingData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fafbfc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium tracking-wide">Retrieving Booking Profile...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) return (
    <div className="flex flex-col items-center justify-center p-20 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-900">Booking Record Not Found</h3>
        <p className="text-gray-500 max-w-md mx-auto mt-2">The record for #{bookingId} could not be retrieved from the server. Please check the ID and try again.</p>
        <button onClick={onBack} className="mt-8 px-6 py-3 bg-[#0e042f] text-white rounded-2xl font-bold">Back to Bookings</button>
    </div>
  );

  const kpis: KPICard[] = [
    { 
      icon: CalendarIcon, 
      label: 'Session Date', 
      value: new Date(bookingData.date_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), 
      subtitle: 'Date of session', 
      color: 'blue' 
    },
    { 
      icon: Clock, 
      label: 'Time Slot', 
      value: new Date(bookingData.date_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), 
      subtitle: 'Expert local time', 
      color: 'purple' 
    },
    { 
      icon: History, 
      label: 'Booking Mode', 
      value: bookingData.mode, 
      subtitle: 'Session platform', 
      color: 'emerald' 
    },
    { 
        icon: User, 
        label: 'Lead Source', 
        value: bookingData.source || 'Organic', 
        subtitle: 'Entry channel', 
        color: 'gray' 
    },
  ];

  const tabs: TabDefinition[] = [
    {
      id: 'summary',
      label: 'Booking Summary',
      component: () => (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/30 rounded-bl-[100px] -mr-8 -mt-8" />
                    <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <FileText size={20} className="text-purple-600" />
                        Session Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Student</p>
                                <p className="text-lg font-bold text-gray-900">{bookingData.student_name}</p>
                                <div className="flex gap-2 mt-2">
                                    <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Call Student"><Phone size={14} /></button>
                                    <button className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors" title="Email Student"><Mail size={14} /></button>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Service Requested</p>
                                <p className="text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg inline-block border border-gray-100">{bookingData.service}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Assigned Expert</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-black">
                                        {bookingData.expert[0]}
                                    </div>
                                    <div>
                                        <p className="text-md font-bold text-gray-900">{bookingData.expert}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">Senior Consultant</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Meeting Link</p>
                                <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                    <ExternalLink size={16} />
                                    Join Digital Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-blue-600" />
                        Live Status & Notifications
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                            <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-amber-900">Meeting Reminder Sent</p>
                                <p className="text-xs text-amber-700 mt-0.5">Automated SMS and Email reminder was sent to the student 24 hours ago.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-green-50/50 border border-green-100">
                            <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-green-900">Expert Confirmed</p>
                                <p className="text-xs text-green-700 mt-0.5">The professional consultant has accepted this schedule and is ready.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Lifecycle Status</h4>
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                            bookingData.status === 'upcoming' ? 'bg-blue-100 text-blue-600 shadow-lg shadow-blue-900/10' : 
                            bookingData.status === 'completed' ? 'bg-green-100 text-green-600 shadow-lg shadow-green-900/10' : 'bg-red-100 text-red-600 shadow-lg shadow-red-900/10'
                        }`}>
                            {bookingData.status === 'upcoming' ? <Clock size={28} /> : bookingData.status === 'completed' ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
                        </div>
                        <div>
                            <p className="text-xl font-black text-gray-900 capitalize">{bookingData.status}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Current State</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-all">
                            <CheckCircle2 size={14} /> Completed
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold hover:bg-red-100 transition-all">
                            <XCircle size={14} /> Cancel
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#0e042f] to-[#1a0c4a] p-8 rounded-[38px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                    <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                        <TrendingUp size={20} className="text-purple-400" />
                        Next Steps
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed font-medium">After the session, ensure to upload the "Interview Prep Notes" to the student profile for future reference by the visa processing team.</p>
                    <button className="mt-6 w-full py-3.5 bg-white text-[#0e042f] rounded-2xl font-black text-sm hover:translate-y-[-2px] hover:shadow-xl active:translate-y-0 transition-all">
                        Prepare Session Notes
                    </button>
                </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'logs',
      label: 'Audit Trail',
      component: () => (
        <ServiceProviderLogsTab
          serviceId={bookingId}
          serviceType="Booking"
          serviceName={bookingData.booking_id}
          userRole={userRole as any}
          logs={activityLogs}
        />
      ),
    },
  ];

  const actions: ActionButton[] = [
    { icon: MessageSquare, label: 'Chat expert', onClick: () => toast.success('Expert chat initiated.') },
    { icon: Phone, label: 'Call Student', onClick: () => toast.info('Initiating call gateway...') },
    { icon: Settings, label: 'Reschedule', onClick: () => toast.info('Opening calendar suite...') },
  ];

  return (
    <ServiceProviderDetailTemplate
      provider={{
        id: bookingData.booking_id,
        name: `Booking ${bookingData.booking_id}`,
        avatar: '📅',
        status: bookingData.status === 'completed' ? 'active' : bookingData.status === 'cancelled' ? 'suspended' : 'active',
        metadata: [
          { icon: ShieldCheck, label: 'Service', value: bookingData.service, color: 'blue' },
          { icon: User, label: 'Expert', value: bookingData.expert, color: 'purple' },
          { icon: MapPin, label: 'Mode', value: bookingData.mode, color: 'gray' },
        ],
      }}
      kpis={kpis}
      tabs={tabs}
      actions={actions}
      onBack={onBack}
      breadcrumbs={['Bookings', 'Leads', bookingData.booking_id]}
    />
  );
};
