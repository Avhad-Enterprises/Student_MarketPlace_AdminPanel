/**
 * STANDARDIZED PROVIDER ACTIONS HOOK
 * Universal hook for ALL service provider detail pages
 * Provides consistent header actions: Sync, Edit, Settings, 3-dot menu
 */

import { useState } from 'react';
import { RefreshCw, Edit3, Settings, MoreVertical, Pause, Ban, Archive, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ActionButton } from './ServiceProviderDetailTemplate';
import type { ProviderBasicData } from './EditProviderModal';

export interface UseProviderActionsOptions {
  serviceType: string; // "Bank", "Insurance", "SIM Card", etc.
  providerId: string;
  providerName: string;
  initialData: ProviderBasicData;
  onStatusChange?: (newStatus: 'active' | 'inactive' | 'suspended') => void;
  onTabChange?: (tabId: string) => void;
  onProviderUpdate?: (data: ProviderBasicData) => void;
}

export interface UseProviderActionsReturn {
  actions: ActionButton[];
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  isStatusModalOpen: boolean;
  setIsStatusModalOpen: (open: boolean) => void;
  isMoreMenuOpen: boolean;
  setIsMoreMenuOpen: (open: boolean) => void;
  providerData: ProviderBasicData;
  handleSync: () => void;
  handleEdit: () => void;
  handleSettings: () => void;
  handleSaveProvider: (data: ProviderBasicData) => void;
  handlePauseProvider: () => void;
  handleDisableSales: () => void;
  handleArchiveProvider: () => void;
  handleFlagForReview: () => void;
  handleViewContracts: () => void;
  handleViewLogs: () => void;
  renderMoreMenu: () => React.ReactNode;
}

export const useProviderActions = (options: UseProviderActionsOptions): UseProviderActionsReturn => {
  const {
    serviceType,
    providerId,
    providerName,
    initialData,
    onStatusChange,
    onTabChange,
    onProviderUpdate,
  } = options;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [providerData, setProviderData] = useState<ProviderBasicData>(initialData);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    toast.loading(`Syncing ${serviceType} provider data...`, { id: 'sync-toast' });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSyncing(false);
    toast.success(`${providerName} synced successfully`, { id: 'sync-toast' });
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSettings = () => {
    if (onTabChange) {
      onTabChange('settings');
      toast.info('Navigated to Settings tab');
    }
  };

  const handleSaveProvider = (data: ProviderBasicData) => {
    setProviderData(data);
    if (onProviderUpdate) {
      onProviderUpdate(data);
    }
    toast.success('Provider details updated successfully');
  };

  const handlePauseProvider = () => {
    toast.info(`${providerName} has been paused`);
    setIsMoreMenuOpen(false);
    if (onStatusChange) {
      onStatusChange('suspended');
    }
  };

  const handleDisableSales = () => {
    toast.warning(`Sales disabled for ${providerName}`);
    setIsMoreMenuOpen(false);
  };

  const handleArchiveProvider = () => {
    toast.info(`${providerName} has been archived`);
    setIsMoreMenuOpen(false);
    if (onStatusChange) {
      onStatusChange('inactive');
    }
  };

  const handleFlagForReview = () => {
    toast.success(`${providerName} flagged for admin review`);
    setIsMoreMenuOpen(false);
  };

  const handleViewContracts = () => {
    if (onTabChange) {
      onTabChange('contracts');
    }
    setIsMoreMenuOpen(false);
  };

  const handleViewLogs = () => {
    if (onTabChange) {
      onTabChange('logs');
    }
    setIsMoreMenuOpen(false);
  };

  // Render the 3-dot menu dropdown
  const renderMoreMenu = () => {
    if (!isMoreMenuOpen) return null;

    return (
      <>
        {/* Backdrop - Fixed positioning to cover entire viewport */}
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsMoreMenuOpen(false)}
        />
        
        {/* Dropdown Menu - Absolutely positioned, aligned to right edge, below the action buttons */}
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 py-2 w-56 animate-in fade-in zoom-in-95 duration-200">
          {/* Provider Control Section */}
          <div className="px-3 py-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Provider Control
            </div>
          </div>
          
          <button
            onClick={handlePauseProvider}
            className="w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left flex items-center gap-3 text-sm text-gray-700"
          >
            <Pause className="w-4 h-4 text-amber-600" />
            <span>Pause Provider</span>
          </button>
          
          <button
            onClick={handleDisableSales}
            className="w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left flex items-center gap-3 text-sm text-gray-700"
          >
            <Ban className="w-4 h-4 text-red-600" />
            <span>Disable Sales</span>
          </button>
          
          <button
            onClick={handleArchiveProvider}
            className="w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left flex items-center gap-3 text-sm text-gray-700"
          >
            <Archive className="w-4 h-4 text-gray-600" />
            <span>Archive Provider</span>
          </button>

          <div className="h-px bg-gray-100 my-2" />

          {/* Navigation Section */}
          <div className="px-3 py-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Navigation
            </div>
          </div>
          
          <button
            onClick={handleViewContracts}
            className="w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left flex items-center gap-3 text-sm text-gray-700"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>View Contracts</span>
          </button>
          
          <button
            onClick={handleViewLogs}
            className="w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left flex items-center gap-3 text-sm text-gray-700"
          >
            <FileText className="w-4 h-4 text-purple-600" />
            <span>View Logs</span>
          </button>

          <div className="h-px bg-gray-100 my-2" />

          {/* Admin Utility Section */}
          <div className="px-3 py-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Admin Utility
            </div>
          </div>
          
          <button
            onClick={handleFlagForReview}
            className="w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left flex items-center gap-3 text-sm text-gray-700"
          >
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span>Flag for Review</span>
          </button>
        </div>
      </>
    );
  };

  // Standard action buttons (Sync, Edit, Settings, More)
  const actions: ActionButton[] = [
    {
      icon: RefreshCw,
      label: 'Sync',
      onClick: handleSync,
      variant: 'secondary' as const,
      disabled: isSyncing,
    },
    {
      icon: Edit3,
      label: 'Edit',
      onClick: handleEdit,
      variant: 'secondary' as const,
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: handleSettings,
      variant: 'secondary' as const,
    },
    {
      icon: MoreVertical,
      label: '',
      onClick: () => setIsMoreMenuOpen(!isMoreMenuOpen),
      variant: 'secondary' as const,
    },
  ];

  return {
    actions,
    isEditModalOpen,
    setIsEditModalOpen,
    isStatusModalOpen,
    setIsStatusModalOpen,
    isMoreMenuOpen,
    setIsMoreMenuOpen,
    providerData,
    handleSync,
    handleEdit,
    handleSettings,
    handleSaveProvider,
    handlePauseProvider,
    handleDisableSales,
    handleArchiveProvider,
    handleFlagForReview,
    handleViewContracts,
    handleViewLogs,
    renderMoreMenu,
  };
};