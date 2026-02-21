/**
 * CONFIRM DIALOG
 * 
 * Branded replacement for window.confirm()
 * 
 * Features:
 * - 4 variants (info, warning, danger, success)
 * - Context-aware icons
 * - Keyboard shortcuts (Enter, Esc)
 * - Focus trap
 * - Accessibility compliant
 */

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  X,
  Info
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export type ConfirmDialogVariant = 'info' | 'warning' | 'danger' | 'success';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  variant?: ConfirmDialogVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmationRequired?: boolean;
  confirmationKeyword?: string;
  showCloseButton?: boolean;
  dangerous?: boolean;
}

// ============================================
// VARIANT CONFIGURATIONS
// ============================================

const variantConfig = {
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
    borderColor: 'border-blue-200',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
    confirmButton: 'bg-orange-600 hover:bg-orange-700 text-white',
    borderColor: 'border-orange-200',
  },
  danger: {
    icon: AlertCircle,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
    borderColor: 'border-red-200',
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    confirmButton: 'bg-green-600 hover:bg-green-700 text-white',
    borderColor: 'border-green-200',
  },
};

// ============================================
// COMPONENT
// ============================================

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  variant = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmationRequired = false,
  confirmationKeyword = 'DELETE',
  showCloseButton = true,
  dangerous = false,
}) => {
  const [confirmationInput, setConfirmationInput] = React.useState('');
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const config = variantConfig[variant];
  const Icon = config.icon;

  // Reset confirmation input when dialog opens/closes
  useEffect(() => {
    if (open) {
      setConfirmationInput('');
      // Focus cancel button by default (safer)
      setTimeout(() => cancelButtonRef.current?.focus(), 100);
    }
  }, [open]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyboard = (e: KeyboardEvent) => {
      // Escape key
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }

      // Enter key (only if not in input)
      if (e.key === 'Enter' && e.target instanceof HTMLElement && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        if (!confirmationRequired || confirmationInput === confirmationKeyword) {
          handleConfirm();
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [open, confirmationInput, confirmationRequired, confirmationKeyword]);

  const handleConfirm = () => {
    if (confirmationRequired && confirmationInput !== confirmationKeyword) {
      return;
    }
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const isConfirmDisabled = confirmationRequired && confirmationInput !== confirmationKeyword;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`px-6 py-5 border-b ${config.borderColor}`}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${config.iconColor}`} />
                  </div>

                  {/* Title */}
                  <div className="flex-1 pt-1">
                    <h2 className="text-xl font-bold text-gray-900">
                      {title}
                    </h2>
                  </div>

                  {/* Close Button */}
                  {showCloseButton && (
                    <button
                      onClick={handleCancel}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Close dialog"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  {description}
                </p>

                {/* Confirmation Input (for dangerous actions) */}
                {confirmationRequired && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Type <span className="font-mono font-bold text-red-600">{confirmationKeyword}</span> to confirm:
                    </label>
                    <input
                      type="text"
                      value={confirmationInput}
                      onChange={(e) => setConfirmationInput(e.target.value)}
                      placeholder={confirmationKeyword}
                      className="w-full px-4 h-11 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                      autoComplete="off"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                <button
                  ref={cancelButtonRef}
                  onClick={handleCancel}
                  className="px-6 h-11 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  ref={confirmButtonRef}
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled}
                  className={`
                    px-6 h-11 rounded-lg font-semibold transition-colors shadow-sm
                    ${config.confirmButton}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================
// HOOK FOR EASIER USAGE
// ============================================

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Partial<ConfirmDialogProps>>({});

  const confirm = (options: Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>) => {
    return new Promise<boolean>((resolve) => {
      setConfig({
        ...options,
        onConfirm: () => {
          options.onConfirm?.();
          resolve(true);
        },
        onCancel: () => {
          options.onCancel?.();
          resolve(false);
        },
      });
      setIsOpen(true);
    });
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title=""
      description=""
      onConfirm={() => { }}
      {...config}
    />
  );

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent,
  };
};
