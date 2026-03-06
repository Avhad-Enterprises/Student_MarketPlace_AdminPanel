import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { CustomSelect } from '../common/CustomSelect';
import { User, Bell } from 'lucide-react';

interface ChangeCounselorModalProps {
  open: boolean;
  currentCounselor: {
    name: string;
    initials: string;
  };
  studentName: string;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: {
    newCounselor: string;
    reason: string;
    notifyCounselor: boolean;
  }) => void;
}

export const ChangeCounselorModal: React.FC<ChangeCounselorModalProps> = ({
  open,
  currentCounselor,
  studentName,
  onOpenChange,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    newCounselor: '',
    reason: '',
    notifyCounselor: true,
  });

  const handleSave = () => {
    if (!formData.newCounselor) {
      alert('Please select a new counselor.');
      return;
    }
    onSave?.(formData);
    onOpenChange(false);
  };

  const counselorOptions = [
    { value: '', label: 'Select Counselor' },
    { value: 'sarah-johnson', label: 'Sarah Johnson' },
    { value: 'michael-chen', label: 'Michael Chen' },
    { value: 'priya-sharma', label: 'Priya Sharma' },
    { value: 'david-miller', label: 'David Miller' },
    { value: 'emma-wilson', label: 'Emma Wilson' },
    { value: 'raj-patel', label: 'Raj Patel' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] w-[95vw] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 shrink-0">
          <DialogTitle>Assign / Change Counselor</DialogTitle>
          <DialogDescription>
            Update the assigned counselor for {studentName}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          {/* Current Counselor Display */}
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-purple-600" />
              <label className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Current Counselor
              </label>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {currentCounselor.initials}
              </div>
              <span className="text-sm font-semibold text-purple-900">{currentCounselor.name}</span>
            </div>
          </div>

          {/* New Counselor */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              New Counselor <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              placeholder="Search and select counselor"
              value={formData.newCounselor}
              onChange={(value) => setFormData({ ...formData, newCounselor: value })}
              options={counselorOptions}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Type to search by name or use the dropdown
            </p>
          </div>

          {/* Assignment Reason */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Assignment Reason <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
              rows={3}
              placeholder="E.g., Workload redistribution, specialty match, vacation coverage..."
            />
          </div>

          {/* Notification Checkbox */}
          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.notifyCounselor}
                onChange={(e) => setFormData({ ...formData, notifyCounselor: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <div>
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    Notify both counselors
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Send email notification to the current and new counselor about this change
                </p>
              </div>
            </label>
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
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-all text-sm font-semibold shadow-lg shadow-purple-900/20"
          >
            Update Counselor
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
