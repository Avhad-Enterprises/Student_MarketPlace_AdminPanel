import React, { useState } from 'react';
import { X, Flag } from 'lucide-react';

interface SetPriorityFlagModalProps {
  isOpen: boolean;
  serviceName: string;
  currentPriority?: 'low' | 'medium' | 'high' | 'urgent' | null;
  currentFlags?: string[];
  onClose: () => void;
  onSave: (priority: 'low' | 'medium' | 'high' | 'urgent' | null, flags: string[], reason: string) => void;
}

export const SetPriorityFlagModal: React.FC<SetPriorityFlagModalProps> = ({
  isOpen,
  serviceName,
  currentPriority = null,
  currentFlags = [],
  onClose,
  onSave,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high' | 'urgent' | null>(currentPriority);
  const [selectedFlags, setSelectedFlags] = useState<string[]>(currentFlags);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleFlagToggle = (flag: string) => {
    setSelectedFlags(prev =>
      prev.includes(flag)
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  const handleSave = () => {
    onSave(selectedPriority, selectedFlags, reason);
    onClose();
  };

  const priorityOptions = [
    { value: 'low' as const, label: 'Low', color: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200' },
    { value: 'medium' as const, label: 'Medium', color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' },
    { value: 'high' as const, label: 'High', color: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200' },
    { value: 'urgent' as const, label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' },
  ];

  const flagOptions = [
    { value: 'important', label: 'Important', color: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200' },
    { value: 'follow-up', label: 'Follow-up', color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' },
    { value: 'risk', label: 'Risk', color: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] mx-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Flag size={16} className="text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Set Priority / Flag</h2>
              </div>
              <p className="text-sm text-gray-600 ml-10">{serviceName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0 ml-4"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Priority Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Priority
            </label>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedPriority(option.value)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all
                    ${selectedPriority === option.value
                      ? option.color + ' ring-2 ring-offset-2 ring-purple-500'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flag Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Flags
            </label>
            <div className="flex flex-wrap gap-2">
              {flagOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFlagToggle(option.value)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all
                    ${selectedFlags.includes(option.value)
                      ? option.color + ' ring-2 ring-offset-2 ring-purple-500'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Reason <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Add a note about why this priority/flag was set..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all text-sm font-semibold text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#253154] text-white rounded-lg hover:bg-[#1a0a4a] transition-all text-sm font-semibold shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
