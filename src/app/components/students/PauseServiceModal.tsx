import React, { useState } from 'react';
import { X, Pause, AlertCircle } from 'lucide-react';
import { DateInput } from '@/components/ui/date-input';

interface PauseServiceModalProps {
  isOpen: boolean;
  serviceName: string;
  onClose: () => void;
  onConfirm: (data: {
    reason: string;
    reasonText?: string;
    resumeDate?: string;
    notifyCounselor: boolean;
  }) => void;
}

const pauseReasonOptions = [
  { value: 'awaiting-documents', label: 'Awaiting student documents' },
  { value: 'awaiting-counselor', label: 'Awaiting counselor availability' },
  { value: 'student-not-responding', label: 'Student not responding' },
  { value: 'external-dependency', label: 'External dependency' },
  { value: 'other', label: 'Other (requires reason)' },
];

export const PauseServiceModal: React.FC<PauseServiceModalProps> = ({
  isOpen,
  serviceName,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [resumeDate, setResumeDate] = useState('');
  const [notifyCounselor, setNotifyCounselor] = useState(true);
  const [errors, setErrors] = useState<{ reason?: string; reasonText?: string }>({});

  if (!isOpen) return null;

  const handleConfirm = () => {
    const newErrors: { reason?: string; reasonText?: string } = {};

    // Validate required fields
    if (!reason) {
      newErrors.reason = 'Please select a pause reason';
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
      resumeDate: resumeDate || undefined,
      notifyCounselor,
    });

    // Reset form
    setReason('');
    setReasonText('');
    setResumeDate('');
    setNotifyCounselor(true);
    setErrors({});
  };

  const handleCancel = () => {
    // Reset form
    setReason('');
    setReasonText('');
    setResumeDate('');
    setNotifyCounselor(true);
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200 p-4"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Pause size={16} className="text-amber-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Pause this service?</h2>
              </div>
              <p className="text-sm text-gray-600 ml-10">
                Pausing will stop progress tracking and reminders until resumed.
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

          {/* Pause Reason - Required */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Pause Reason <span className="text-red-500">*</span>
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
              {pauseReasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.reason && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} />
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
                placeholder="Please provide details about why this service is being paused..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors resize-none ${errors.reasonText
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-purple-500'
                  }`}
              />
              {errors.reasonText && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.reasonText}
                </p>
              )}
            </div>
          )}

          {/* Resume Date - Optional */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Expected Resume Date <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <DateInput
              value={resumeDate}
              onChange={(e) => setResumeDate(e.target.value)}
              placeholder="Select expected resume date"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Set a tentative date when you expect to resume this service
            </p>
          </div>

          {/* Notify Counselor Toggle */}
          <div className="border border-gray-200 rounded-lg px-4 py-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyCounselor}
                onChange={(e) => setNotifyCounselor(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">Notify assigned counselor</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Send an email notification to the counselor about this pause
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
            className="px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm font-semibold shadow-sm"
          >
            Pause Service
          </button>
        </div>
      </div>
    </div>
  );
};