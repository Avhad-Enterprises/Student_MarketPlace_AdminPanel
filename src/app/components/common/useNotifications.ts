import { useState } from 'react';

export interface Notification {
  id: string;
  type: 'system' | 'security' | 'performance' | 'activity' | 'admin';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'system',
    title: 'System Maintenance Scheduled',
    description: 'Platform will be under maintenance on Jan 10, 2026 from 2-4 AM EST',
    timestamp: '5 mins ago',
    isRead: false
  },
  {
    id: '2',
    type: 'security',
    title: 'Security Alert',
    description: 'New login detected from Chrome on Windows in Toronto, Canada',
    timestamp: '1 hour ago',
    isRead: false
  },
  {
    id: '3',
    type: 'activity',
    title: 'New Student Application',
    description: 'Sarah Chen submitted application for University of Toronto',
    timestamp: '2 hours ago',
    isRead: false
  },
  {
    id: '4',
    type: 'admin',
    title: 'Admin Action Required',
    description: '3 documents are pending verification for student ID STU-2024-00156',
    timestamp: '3 hours ago',
    isRead: false
  },
  {
    id: '5',
    type: 'performance',
    title: 'Performance Warning',
    description: 'Application processing time increased by 15% in the last 24 hours',
    timestamp: '4 hours ago',
    isRead: true
  },
  {
    id: '6',
    type: 'activity',
    title: 'Payment Received',
    description: 'Application fee payment of $150 received from Michael Zhang',
    timestamp: '5 hours ago',
    isRead: true
  },
  {
    id: '7',
    type: 'system',
    title: 'Database Backup Completed',
    description: 'Automated daily backup completed successfully at 3:00 AM EST',
    timestamp: '6 hours ago',
    isRead: true
  },
  {
    id: '8',
    type: 'activity',
    title: 'Visa Approved',
    description: 'Student visa approved for Priya Sharma - University of British Columbia',
    timestamp: 'Yesterday',
    isRead: true
  },
  {
    id: '9',
    type: 'security',
    title: 'Password Changed',
    description: 'Password was successfully changed for admin account',
    timestamp: 'Yesterday',
    isRead: true
  },
  {
    id: '10',
    type: 'admin',
    title: 'Counselor Assignment',
    description: 'New counselor Maria Rodriguez assigned to 5 pending applications',
    timestamp: '2 days ago',
    isRead: true
  },
  {
    id: '11',
    type: 'activity',
    title: 'Document Uploaded',
    description: 'James Wilson uploaded passport copy for application STU-2024-00198',
    timestamp: '2 days ago',
    isRead: true
  },
  {
    id: '12',
    type: 'performance',
    title: 'System Update Available',
    description: 'New platform update v2.4.1 is available with performance improvements',
    timestamp: '3 days ago',
    isRead: true
  },
  {
    id: '13',
    type: 'activity',
    title: 'Application Deadline Reminder',
    description: '8 applications are due for submission within the next 7 days',
    timestamp: '3 days ago',
    isRead: true
  },
  {
    id: '14',
    type: 'admin',
    title: 'Monthly Report Generated',
    description: 'December 2025 analytics report is ready for review',
    timestamp: '4 days ago',
    isRead: true
  },
  {
    id: '15',
    type: 'system',
    title: 'Server Health Check',
    description: 'All systems operational - 99.98% uptime maintained',
    timestamp: '5 days ago',
    isRead: true
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  return {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead
  };
};