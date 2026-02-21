"use client";

import React, { useRef, useEffect } from 'react';
import { X, Bell, AlertCircle, Shield, Activity, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'system' | 'security' | 'performance' | 'activity' | 'admin';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  notifications: Notification[];
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'system':
      return <Bell size={16} className="text-blue-600" />;
    case 'security':
      return <Shield size={16} className="text-red-600" />;
    case 'performance':
      return <Activity size={16} className="text-orange-600" />;
    case 'activity':
      return <CheckCircle size={16} className="text-emerald-600" />;
    case 'admin':
      return <AlertCircle size={16} className="text-purple-600" />;
    default:
      return <Bell size={16} className="text-gray-600" />;
  }
};

const getNotificationIconBg = (type: string) => {
  switch (type) {
    case 'system':
      return 'bg-blue-100';
    case 'security':
      return 'bg-red-100';
    case 'performance':
      return 'bg-orange-100';
    case 'activity':
      return 'bg-emerald-100';
    case 'admin':
      return 'bg-purple-100';
    default:
      return 'bg-gray-100';
  }
};

export const NotificationPanel: React.FC<NotificationPanelProps> = (({
  isOpen,
  onClose,
  anchorRef,
  notifications,
  unreadCount,
  onMarkAllAsRead,
  onMarkAsRead
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  console.log('NotificationPanel render, isOpen:', isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Use setTimeout to add listener after current click completes
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-[420px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden z-[100]"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h3 className="font-bold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[480px] overflow-y-auto custom-scrollbar-light">
        {notifications.length === 0 ? (
          // Empty State
          <div className="py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-gray-400" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">You&apos;re all caught up</p>
            <p className="text-sm text-gray-500">No new notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => onMarkAsRead(notification.id)}
                className={`
                  w-full px-5 py-4 text-left transition-colors cursor-pointer
                  ${!notification.isRead
                    ? 'bg-purple-50/50 hover:bg-purple-50'
                    : 'bg-white hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-lg ${getNotificationIconBg(notification.type)} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`font-semibold text-sm ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-1.5"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-2 line-clamp-2">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => {
              // Navigate to notifications page
              onClose();
            }}
            className="w-full text-center text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors py-1"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
});