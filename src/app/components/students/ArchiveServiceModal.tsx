import React, { useState } from 'react';
import { X, Archive, AlertTriangle } from 'lucide-react';

interface ArchiveServiceModalProps {
  isOpen: boolean;
  serviceName: string;
  onClose: () => void;
  onConfirm: (data: {
    reason: string;
    reasonText?: string;
    archiveReminders: boolean;
  }) => void;
}

const archiveReasonOptions = [
  { value: 'duplicate-service', label: 'Duplicate service' },
  { value: 'no-longer-needed', label: 'Service no longer needed' },
  { value: 'created-by-mistake', label: 'Created by mistake' },
  { value: 'student-opted-out', label: 'Student opted out' },
  { value: 'other', label: 'Other (requires reason)' },
];

export const ArchiveServiceModal: React.FC<ArchiveServiceModalProps> = ({
  isOpen,
  serviceName,
  onClose,
  onConfirm,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [archiveReminders, setArchiveReminders] = useState(true);
  const [errors, setErrors] = useState<{ confirmed?: string; reason?: string; reasonText?: string }>({});

  if (!isOpen) return null;

  const handleConfirm = () => {
    const newErrors: { confirmed?: string; reason?: string; reasonText?: string } = {};

    // Validate confirmation checkbox
    if (!confirmed) {
      newErrors.confirmed = 'You must confirm to proceed';
    }

    // Validate required fields
    if (!reason) {
      newErrors.reason = 'Please select an archive reason';
    }

    if (reason === 'other' && !reasonText.trim()) {
      newErrors.reasonText = 'Please provide a reason when selecting "Other"';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm({
      reason,
      reasonText: reason === 'other' ? reasonText : undefined,
      archiveReminders,
    });

    // Reset form
    setConfirmed(false);
    setReason('');
    setReasonText('');
    setArchiveReminders(true);
    setErrors({});
  };

  const handleCancel = () => {
    // Reset form
    setConfirmed(false);
    setReason('');
    setReasonText('');
    setArchiveReminders(true);
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200 p-4"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[560px] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <Archive size={16} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Archive this service?</h2>
              </div>
              <p className="text-sm text-gray-600 ml-10">
                Archived services are hidden from active views but remain in records. You can restore from archives if allowed.
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0 ml-4"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5 max-h-[calc(100vh-240px)] overflow-y-auto">
          {/* Service Name Display */}
          <div className="bg-purple-50 border border-purple-100 rounded-lg px-4 py-3">
            <p className="text-sm text-purple-900">
              <span className="font-semibold">Service:</span> {serviceName}
            </p>
          </div>

          {/* Warning Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900 mb-1">
                This action will remove the service from active tracking
              </p>
              <p className="text-xs text-red-700">
                The service will be moved to archives and won&apos;t appear in active service lists.
              </p>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className={`border rounded-lg px-4 py-3 transition-colors ${errors.confirmed ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => {
                  setConfirmed(e.target.checked);
                  setErrors((prev) => ({ ...prev, confirmed: undefined }));
                }}
                className="w-4 h-4 mt-0.5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className={`text-sm font-semibold ${errors.confirmed ? 'text-red-900' : 'text-gray-900'}`}>
                  I understand this will remove it from active service tracking
                </div>
              </div>
            </label>
            {errors.confirmed && (
              <p className="text-xs text-red-600 mt-2 ml-7 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.confirmed}
              </p>
            )}
          </div>

          {/* Archive Reason - Required */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Archive Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrors((prev) => ({ ...prev, reason: undefined }));
              }}
              className={`w-full px-4 py-3 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 transition-colors appearance-none bg-white cursor-pointer ${errors.reason
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-purple-500'
                }`}
            >
              <option value="">Select a reason</option>
              {archiveReasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.reason && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.reason}
              </p>
            )}
          </div>

          {/* Other Reason Text - Conditional */}
          {reason === 'other' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Specify Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reasonText}
                onChange={(e) => {
                  setReasonText(e.target.value);
                  setErrors((prev) => ({ ...prev, reasonText: undefined }));
                }}
                placeholder="Please provide details about why this service is being archived..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors resize-none ${errors.reasonText
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-purple-500'
                  }`}
              />
              {errors.reasonText && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {errors.reasonText}
                </p>
              )}
            </div>
          )}

          {/* Archive Reminders Toggle */}
          <div className="border border-gray-200 rounded-lg px-4 py-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={archiveReminders}
                onChange={(e) => setArchiveReminders(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">Also archive related reminders</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Archive all reminders and notifications associated with this service
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all text-sm font-semibold text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-semibold shadow-sm"
          >
            Archive Service
          </button>
        </div>
      </div>
    </div>
  );
};
