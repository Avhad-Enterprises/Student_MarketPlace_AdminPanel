import React, { useState } from 'react';
import { MoreVertical, Star, Copy, Trash2, Type as TypeIcon, RotateCcw } from 'lucide-react';
import { 
  ApplyPresetModal, 
  DuplicatePresetModal, 
  DeletePresetModal 
} from './PresetModals';
import { 
  AppliedPresetBadge, 
  SystemDefaultBadge, 
  CustomPresetBadge,
  ModifiedPresetBadge 
} from './ThemeUIHelpers';

// ============================================
// 2️⃣ ENHANCED PRESET CARD WITH 4 VISUAL STATES
// ============================================

interface PresetCardProps {
  preset: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    isSystem: boolean;
    isModified?: boolean;
  };
  onApply?: (id: string) => void;
  onDuplicate?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
}

export const EnhancedPresetCard: React.FC<PresetCardProps> = ({ 
  preset, 
  onApply, 
  onDuplicate, 
  onDelete,
  onRename 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renamingValue, setRenamingValue] = useState(preset.name);

  // 4 Visual States:
  // A. Default Preset (isSystem)
  // B. Custom Preset (!isSystem)
  // C. Applied Preset (isActive && !isModified)
  // D. Modified Preset (isActive && isModified)

  const handleRename = () => {
    if (renamingValue.trim() && renamingValue !== preset.name) {
      onRename?.(preset.id, renamingValue);
    }
    setIsRenaming(false);
    setShowMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setRenamingValue(preset.name);
      setIsRenaming(false);
    }
  };

  return (
    <>
      <div className={`p-4 bg-white border-2 rounded-xl transition-all hover:shadow-md ${
        preset.isActive && !preset.isModified 
          ? 'border-purple-500 bg-purple-50/50 shadow-sm' 
          : preset.isActive && preset.isModified
          ? 'border-yellow-500 bg-yellow-50/30 shadow-sm'
          : 'border-gray-200'
      }`}>
        <div className="flex items-start gap-3">
          {/* Visual Swatch Preview */}
          <div className="flex gap-1 flex-shrink-0">
            <div className="w-3 h-12 rounded bg-[#0e042f]" />
            <div className="w-3 h-12 rounded bg-[#253154]" />
            <div className="w-3 h-12 rounded bg-[#8B5CF6]" />
          </div>

          {/* Preset Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {/* Preset Name - Editable or Static */}
              {isRenaming ? (
                <input
                  type="text"
                  value={renamingValue}
                  onChange={(e) => setRenamingValue(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="text-sm font-semibold text-gray-700 px-2 py-0.5 border-2 border-purple-500 rounded focus:outline-none"
                />
              ) : (
                <h4 className="text-sm font-semibold text-gray-700">{preset.name}</h4>
              )}

              {/* Visual State Badges */}
              {preset.isActive && preset.isModified && <ModifiedPresetBadge />}
              {preset.isActive && !preset.isModified && <AppliedPresetBadge />}
              {preset.isSystem && <SystemDefaultBadge />}
              {!preset.isSystem && !preset.isActive && <CustomPresetBadge />}
            </div>
            <p className="text-xs text-gray-500">{preset.description}</p>
            <p className="text-[10px] text-gray-400 mt-2">Last modified 2 hours ago</p>
          </div>

          {/* Actions */}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>
            
            {/* 3️⃣ PRESET ACTIONS MENU (⋯) */}
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-10 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  {/* Apply Preset */}
                  {!preset.isActive && (
                    <button 
                      onClick={() => {
                        setShowApplyModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Star size={14} />
                      Apply Preset
                    </button>
                  )}
                  
                  {/* Duplicate */}
                  <button 
                    onClick={() => {
                      setShowDuplicateModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy size={14} />
                    Duplicate
                  </button>
                  
                  {/* Rename - Only for custom presets */}
                  {!preset.isSystem && (
                    <button 
                      onClick={() => {
                        setIsRenaming(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <TypeIcon size={14} />
                      Rename
                    </button>
                  )}
                  
                  {/* Delete - Only for custom presets */}
                  {!preset.isSystem && (
                    <>
                      <div className="border-t border-gray-200 my-1" />
                      <button 
                        onClick={() => {
                          setShowDeleteModal(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </>
                  )}
                  
                  {/* Reset to System Default - Only for system presets */}
                  {preset.isSystem && (
                    <button 
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => setShowMenu(false)}
                    >
                      <RotateCcw size={14} />
                      Reset to System Default
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showApplyModal && (
        <ApplyPresetModal
          presetName={preset.name}
          onClose={() => setShowApplyModal(false)}
          onConfirm={() => onApply?.(preset.id)}
        />
      )}

      {showDuplicateModal && (
        <DuplicatePresetModal
          originalName={preset.name}
          onClose={() => setShowDuplicateModal(false)}
          onConfirm={(newName) => onDuplicate?.(preset.id, newName)}
        />
      )}

      {showDeleteModal && (
        <DeletePresetModal
          presetName={preset.name}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => onDelete?.(preset.id)}
        />
      )}
    </>
  );
};
