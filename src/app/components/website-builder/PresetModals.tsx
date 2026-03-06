import React, { useState } from 'react';
import {
  Plus, X, AlertTriangle, Info, Star, Copy, Trash2, Type as TypeIcon,
  RotateCcw, CheckCircle, Loader
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================
// PART 6: MODAL COMPONENTS FOR PRESETS & DEFAULTS
// ============================================

// Helper Components
const TextField: React.FC<{ label: string; placeholder: string; value?: string; onChange?: (val: string) => void }> = ({
  label, placeholder, value = '', onChange
}) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    />
  </div>
);

const TextArea: React.FC<{ label: string; placeholder: string; rows?: number; value?: string; onChange?: (val: string) => void }> = ({
  label, placeholder, rows = 3, value = '', onChange
}) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-700">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
    />
  </div>
);

// 3️⃣ APPLY PRESET MODAL (Visual Feedback)
export const ApplyPresetModal: React.FC<{
  presetName: string;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ presetName, onClose, onConfirm }) => {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      onConfirm();
      toast.success(`Preset "${presetName}" applied`, {
        description: 'Theme values updated successfully'
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#253154]">Apply Preset</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6">
          {isApplying ? (
            <div className="text-center py-8">
              <Loader size={32} className="mx-auto text-purple-600 animate-spin mb-3" />
              <p className="text-sm text-gray-600">Applying preset...</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-700 mb-4">
                Are you sure you want to apply the <strong>&quot;{presetName}&quot;</strong> preset?
              </p>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 leading-relaxed">
                  This will replace your current theme settings including colors, typography, buttons, and spacing. You can undo this action later.
                </p>
              </div>
            </>
          )}
        </div>
        {!isApplying && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Apply Preset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 3️⃣ DUPLICATE PRESET MODAL
export const DuplicatePresetModal: React.FC<{
  originalName: string;
  onClose: () => void;
  onConfirm: (name: string) => void;
}> = ({ originalName, onClose, onConfirm }) => {
  const [presetName, setPresetName] = useState(`${originalName} (Copy)`);

  const handleCreate = () => {
    if (!presetName.trim()) {
      toast.error('Please enter a preset name');
      return;
    }
    onConfirm(presetName);
    toast.success('Preset duplicated', {
      description: `Created "${presetName}"`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#253154]">Duplicate Preset</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <TextField
            label="Preset Name"
            placeholder="Enter preset name"
            value={presetName}
            onChange={setPresetName}
          />
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              This will create a copy of <strong>&quot;{originalName}&quot;</strong> with all its theme settings.
            </p>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Preset
          </button>
        </div>
      </div>
    </div>
  );
};

// 3️⃣ DELETE PRESET MODAL
export const DeletePresetModal: React.FC<{
  presetName: string;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ presetName, onClose, onConfirm }) => {
  const handleDelete = () => {
    onConfirm();
    toast.success('Preset deleted', {
      description: `"${presetName}" has been removed`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-red-600">Delete Preset</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to delete <strong>&quot;{presetName}&quot;</strong>?
          </p>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-800 leading-relaxed">
                Deleting this preset will not affect published pages. Only the preset template will be removed.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// 4️⃣ CREATE PRESET MODAL
export const CreatePresetModal: React.FC<{
  onClose: () => void;
  onConfirm: (name: string, description: string) => void;
}> = ({ onClose, onConfirm }) => {
  const [presetName, setPresetName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!presetName.trim()) {
      toast.error('Please enter a preset name');
      return;
    }
    onConfirm(presetName, description);
    toast.success('Preset created', {
      description: `"${presetName}" saved successfully`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#253154]">Create New Preset</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <TextField
            label="Preset Name"
            placeholder="e.g. Professional Blue"
            value={presetName}
            onChange={setPresetName}
          />
          <TextArea
            label="Description (Optional)"
            placeholder="Describe this theme preset..."
            rows={3}
            value={description}
            onChange={setDescription}
          />
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>This preset will capture current theme values.</strong> It will save your colors, typography, buttons, forms, and layout settings.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Preset
          </button>
        </div>
      </div>
    </div>
  );
};

// 6️⃣ RESET TO DEFAULTS MODAL
export const ResetToDefaultsModal: React.FC<{
  sectionName: string;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ sectionName, onClose, onConfirm }) => {
  const handleReset = () => {
    onConfirm();
    toast.success('Section reset to defaults', {
      description: `${sectionName} values restored`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#253154]">Reset to Defaults</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4">
            This will reset all values in <strong>{sectionName}</strong> to system defaults.
          </p>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-yellow-900 mb-1">This cannot be undone</p>
                <p className="text-xs text-yellow-700 leading-relaxed">
                  All custom values in this section will be replaced with system defaults. Other sections will not be affected.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-semibold bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// 9️⃣ EXIT WITH CHANGES MODAL
export const ExitWithChangesModal: React.FC<{
  onClose: () => void;
  onContinueEditing: () => void;
  onExit: () => void;
}> = ({ onClose, onContinueEditing, onExit }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#253154]">Unpublished Theme Changes</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4">
            You have unpublished theme changes.
          </p>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-purple-700 leading-relaxed">
                Theme changes won&apos;t be live until published. You can save them as a draft and return later.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onExit}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Exit
          </button>
          <button
            onClick={onContinueEditing}
            className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Continue Editing
          </button>
        </div>
      </div>
    </div>
  );
};
