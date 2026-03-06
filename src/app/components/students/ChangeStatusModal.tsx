import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { CustomSelect } from '../common/CustomSelect';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ChangeStatusModalProps {
  isOpen: boolean;
  currentStatus: string;
  studentName: string;
  onClose: () => void;
  onSave?: (data: {
    newStatus: string;
    reason: string;
    notes: string;
    effectiveDate: string;
  }) => void;
}

export const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
  isOpen,
  currentStatus,
  studentName,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    newStatus: '',
    reason: '',
    notes: '',
    effectiveDate: new Date().toISOString().split('T')[0],
  });

  const handleSave = () => {
    if (!formData.newStatus || !formData.reason) {
      alert('Please select a new status and provide a reason.');
      return;
    }
    onSave?.(formData);
    onClose();
  };

  const statusOptions = [
    { value: '', label: 'Select New Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Archived', label: 'Archived' },
    { value: 'Withdrawn', label: 'Withdrawn / Dropped' },
  ];

  const reasonOptions = [
    { value: '', label: 'Select Reason' },
    { value: 'Student Request', label: 'Student Request' },
    { value: 'Financial Issues', label: 'Financial Issues' },
    { value: 'Visa Rejected', label: 'Visa Rejected' },
    { value: 'Changed Plans', label: 'Changed Plans' },
    { value: 'Completed Program', label: 'Completed Program' },
    { value: 'Non-Responsive', label: 'Non-Responsive' },
    { value: 'Administrative', label: 'Administrative' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] w-[95vw] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 shrink-0">
          <DialogTitle>Change Student Status</DialogTitle>
          <DialogDescription>
            Update the status for {studentName}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          {/* Current Status Display */}
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={16} className="text-purple-600" />
              <label className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Current Status
              </label>
            </div>
            <p className="text-sm font-semibold text-purple-900 ml-6">{currentStatus}</p>
          </div>

          {/* New Status */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              New Status <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              placeholder="Select New Status"
              value={formData.newStatus}
              onChange={(value) => setFormData({ ...formData, newStatus: value })}
              options={statusOptions}
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Status Change Reason <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              placeholder="Select Reason"
              value={formData.reason}
              onChange={(value) => setFormData({ ...formData, reason: value })}
              options={reasonOptions}
            />
          </div>

          {/* Effective Date */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Effective Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Internal Notes <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
              rows={3}
              placeholder="Add any additional notes about this status change..."
            />
          </div>

          {/* Warning for certain statuses */}
          {(formData.newStatus === 'Archived' || formData.newStatus === 'Withdrawn') && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">Important</p>
                <p className="text-xs text-amber-800">
                  {formData.newStatus === 'Archived'
                    ? 'Archiving will make this student read-only and hidden from default lists. They will still be visible in reports and audit logs.'
                    : 'Marking as Withdrawn/Dropped will lock all services and notify assigned counselors.'}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-200 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-all text-sm font-semibold shadow-lg shadow-purple-900/20"
          >
            Update Status
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
