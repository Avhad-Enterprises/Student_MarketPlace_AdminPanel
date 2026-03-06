import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { CustomSelect } from '../common/CustomSelect';
import { AlertTriangle, Archive, Lock, Eye } from 'lucide-react';

interface ArchiveStudentModalProps {
  open: boolean;
  studentName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (data: {
    reason: string;
    notes: string;
  }) => void;
}

export const ArchiveStudentModal: React.FC<ArchiveStudentModalProps> = ({
  open,
  studentName,
  onOpenChange,
  onConfirm,
}) => {
  const [formData, setFormData] = useState({
    reason: '',
    notes: '',
    confirmation: '',
  });

  const handleConfirm = () => {
    if (!formData.reason) {
      alert('Please select a reason for archiving.');
      return;
    }
    if (formData.confirmation.toLowerCase() !== 'archive') {
      alert('Please type "ARCHIVE" to confirm.');
      return;
    }
    onConfirm?.({
      reason: formData.reason,
      notes: formData.notes,
    });
    onOpenChange(false);
  };

  const reasonOptions = [
    { value: '', label: 'Select Reason' },
    { value: 'Program Completed', label: 'Program Completed' },
    { value: 'Student Withdrawn', label: 'Student Withdrawn' },
    { value: 'Non-Responsive', label: 'Non-Responsive' },
    { value: 'Visa Rejected', label: 'Visa Rejected' },
    { value: 'Financial Issues', label: 'Financial Issues' },
    { value: 'Transferred to Another Agency', label: 'Transferred to Another Agency' },
    { value: 'Data Cleanup', label: 'Data Cleanup' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] w-[95vw] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-amber-900">
            <AlertTriangle size={20} className="text-amber-600" />
            Archive Student
          </DialogTitle>
          <DialogDescription>
            Archive {studentName}&apos;s profile
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          {/* Warning Box */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-amber-900">
                  Important: Understand what archiving does
                </h4>
                <div className="space-y-2 text-xs text-amber-800">
                  <div className="flex items-start gap-2">
                    <Lock size={14} className="shrink-0 mt-0.5" />
                    <p><strong>Student becomes read-only:</strong> No further edits can be made to their profile or services</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Eye size={14} className="shrink-0 mt-0.5" />
                    <p><strong>Hidden from default lists:</strong> Will not appear in the main Students table unless specifically filtered</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Archive size={14} className="shrink-0 mt-0.5" />
                    <p><strong>Services locked:</strong> All ongoing services will be automatically paused</p>
                  </div>
                </div>
                <div className="border-t border-amber-300 pt-3 mt-3">
                  <p className="text-xs text-amber-900 font-semibold">
                    ✓ Data is NOT deleted - still visible in reports, exports, and audit logs
                  </p>
                  <p className="text-xs text-amber-900 font-semibold mt-1">
                    ✓ Can be restored by system administrators if needed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Reason for Archiving <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              placeholder="Select Reason"
              value={formData.reason}
              onChange={(value) => setFormData({ ...formData, reason: value })}
              options={reasonOptions}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Additional Notes <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
              rows={3}
              placeholder="Add any additional context or notes about why this student is being archived..."
            />
          </div>

          {/* Confirmation Input */}
          <div className="border-t border-gray-200 pt-5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Type &quot;ARCHIVE&quot; to confirm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.confirmation}
              onChange={(e) => setFormData({ ...formData, confirmation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono"
              placeholder="Type ARCHIVE"
              required
            />
            <p className="text-xs text-gray-500 mt-1.5">
              This confirmation helps prevent accidental archiving
            </p>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-200 shrink-0">
          <button
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={formData.confirmation.toLowerCase() !== 'archive'}
            className="px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm font-semibold shadow-lg shadow-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Archive Student
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
