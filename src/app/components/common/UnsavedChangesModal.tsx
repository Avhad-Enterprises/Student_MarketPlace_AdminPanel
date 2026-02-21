/**
 * UNSAVED CHANGES MODAL SYSTEM
 * 
 * A unified modal component that replaces browser default unsaved changes popups.
 * Applies to all in-app navigation (back buttons, cancel, sidebar, page switching, logout).
 * Does NOT apply to browser refresh/close (those still use beforeunload).
 * 
 * USAGE:
 * 
 * import { UnsavedChangesModal, useUnsavedChanges } from '@/components/common/UnsavedChangesModal';
 * 
 * const MyComponent = () => {
 *   const { markDirty, markClean, hasDirtyChanges } = useUnsavedChanges();
 *   
 *   const handleFieldChange = () => {
 *     markDirty('form-section');
 *   };
 *   
 *   return <YourContent />;
 * };
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AlertTriangle, Loader2, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================

export type UnsavedChangesState = 'normal' | 'loading' | 'error' | 'success';

export interface UnsavedChangesModalProps {
  isOpen: boolean;
  onStay: () => void;
  onDiscard: () => void | Promise<void>;
  lastSavedTime?: Date;
  state?: UnsavedChangesState;
  errorMessage?: string;
  isDarkMode?: boolean;
}

export interface UnsavedSection {
  id: string;
  label: string;
  timestamp: Date;
}

export interface UnsavedChangesContextValue {
  hasDirtyChanges: boolean;
  dirtySections: UnsavedSection[];
  lastSavedTime: Date | null;
  markDirty: (sectionId: string, sectionLabel?: string) => void;
  markClean: (sectionId?: string) => void;
  requestNavigation: (callback: () => void) => void;
  clearAll: () => void;
}

// ============================================
// CONTEXT
// ============================================

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error('useUnsavedChanges must be used within UnsavedChangesProvider');
  }
  return context;
};

// ============================================
// PROVIDER
// ============================================

export const UnsavedChangesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dirtySections, setDirtySections] = useState<UnsavedSection[]>([]);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [modalState, setModalState] = useState<UnsavedChangesState>('normal');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const hasDirtyChanges = dirtySections.length > 0;

  const markDirty = useCallback((sectionId: string, sectionLabel?: string) => {
    setDirtySections((prev) => {
      const exists = prev.find((s) => s.id === sectionId);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: sectionId,
          label: sectionLabel || sectionId,
          timestamp: new Date(),
        },
      ];
    });
  }, []);

  const markClean = useCallback((sectionId?: string) => {
    if (sectionId) {
      setDirtySections((prev) => prev.filter((s) => s.id !== sectionId));
    } else {
      setDirtySections([]);
    }
    setLastSavedTime(new Date());
  }, []);

  const clearAll = useCallback(() => {
    setDirtySections([]);
    setLastSavedTime(new Date());
  }, []);

  const requestNavigation = useCallback(
    (callback: () => void) => {
      if (hasDirtyChanges) {
        setPendingNavigation(() => callback);
        setShowModal(true);
        setModalState('normal');
      } else {
        callback();
      }
    },
    [hasDirtyChanges]
  );

  const handleStay = useCallback(() => {
    setShowModal(false);
    setPendingNavigation(null);
    setModalState('normal');
    setErrorMessage('');
  }, []);

  const handleDiscard = useCallback(async () => {
    setModalState('loading');
    setErrorMessage('');

    try {
      // Simulate async operation (cleanup, API calls, etc.)
      await new Promise((resolve) => setTimeout(resolve, 500));

      setModalState('success');
      setDirtySections([]);

      // Brief success state before closing
      setTimeout(() => {
        setShowModal(false);
        if (pendingNavigation) {
          pendingNavigation();
        }
        setPendingNavigation(null);
        setModalState('normal');
      }, 600);
    } catch (error) {
      setModalState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to discard changes');
    }
  }, [pendingNavigation]);

  const contextValue: UnsavedChangesContextValue = {
    hasDirtyChanges,
    dirtySections,
    lastSavedTime,
    markDirty,
    markClean,
    requestNavigation,
    clearAll,
  };

  return (
    <UnsavedChangesContext.Provider value={contextValue}>
      {children}
      <UnsavedChangesModal
        isOpen={showModal}
        onStay={handleStay}
        onDiscard={handleDiscard}
        lastSavedTime={lastSavedTime || undefined}
        state={modalState}
        errorMessage={errorMessage}
      />
    </UnsavedChangesContext.Provider>
  );
};

// ============================================
// MODAL COMPONENT
// ============================================

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onStay,
  onDiscard,
  lastSavedTime,
  state = 'normal',
  errorMessage = '',
  isDarkMode = false,
}) => {
  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onStay();
      } else if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onStay();
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onDiscard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onStay, onDiscard]);

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={state === 'normal' ? onStay : undefined}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`
                relative w-full max-w-md rounded-2xl shadow-2xl
                ${isDarkMode ? 'bg-[#1a1a2e]' : 'bg-white'}
                border border-gray-200/20
              `}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                    ${state === 'normal' ? 'bg-amber-100' : ''}
                    ${state === 'loading' ? 'bg-blue-100' : ''}
                    ${state === 'error' ? 'bg-red-100' : ''}
                    ${state === 'success' ? 'bg-green-100' : ''}
                  `}>
                    {state === 'normal' && <AlertTriangle className="w-6 h-6 text-amber-600" />}
                    {state === 'loading' && <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />}
                    {state === 'error' && <AlertTriangle className="w-6 h-6 text-red-600" />}
                    {state === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
                  </div>

                  {/* Title */}
                  <div className="flex-1 pt-1">
                    <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0e042f]'}`}>
                      {state === 'loading' && 'Discarding Changes...'}
                      {state === 'error' && 'Error Occurred'}
                      {state === 'success' && 'Changes Discarded'}
                      {state === 'normal' && 'Unsaved Changes'}
                    </h2>
                  </div>

                  {/* Close button (only in normal state) */}
                  {state === 'normal' && (
                    <button
                      onClick={onStay}
                      className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="px-6 pb-6">
                <div className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {state === 'normal' && (
                    <>
                      <p className="mb-3">
                        You have unsaved changes. Leaving now will discard your edits.
                      </p>
                      {lastSavedTime && (
                        <p className="text-sm text-gray-500">
                          Last saved: <span className="font-medium">{getTimeAgo(lastSavedTime)}</span>
                        </p>
                      )}
                    </>
                  )}

                  {state === 'loading' && (
                    <p>Please wait while we discard your changes...</p>
                  )}

                  {state === 'error' && (
                    <>
                      <p className="mb-2">Failed to discard changes.</p>
                      {errorMessage && (
                        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                          {errorMessage}
                        </p>
                      )}
                    </>
                  )}

                  {state === 'success' && (
                    <p>Your changes have been discarded successfully.</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  {state === 'normal' && (
                    <>
                      <button
                        onClick={onStay}
                        className="flex-1 h-12 rounded-xl bg-[#0e042f] text-white font-semibold hover:bg-[#1a0c4a] transition-colors shadow-lg shadow-purple-900/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Stay & Continue Editing
                      </button>
                      <button
                        onClick={onDiscard}
                        className="flex-1 h-12 rounded-xl border-2 border-red-500 text-red-600 font-semibold hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Discard & Leave
                      </button>
                    </>
                  )}

                  {state === 'loading' && (
                    <button
                      disabled
                      className="flex-1 h-12 rounded-xl bg-gray-300 text-gray-500 font-semibold cursor-not-allowed"
                    >
                      Processing...
                    </button>
                  )}

                  {state === 'error' && (
                    <>
                      <button
                        onClick={onStay}
                        className="flex-1 h-12 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                      >
                        Go Back
                      </button>
                      <button
                        onClick={onDiscard}
                        className="flex-1 h-12 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Try Again
                      </button>
                    </>
                  )}

                  {state === 'success' && (
                    <button
                      disabled
                      className="flex-1 h-12 rounded-xl bg-green-500 text-white font-semibold cursor-default"
                    >
                      ✓ Success
                    </button>
                  )}
                </div>

                {/* Keyboard shortcuts hint */}
                {state === 'normal' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono">Esc</kbd> or{' '}
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono">Enter</kbd> to stay • {' '}
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono">⌘Enter</kbd> to discard
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================
// STANDALONE MODAL (NO CONTEXT)
// ============================================

/**
 * Standalone modal component for one-off usage without context
 */
export const StandaloneUnsavedChangesModal = UnsavedChangesModal;
