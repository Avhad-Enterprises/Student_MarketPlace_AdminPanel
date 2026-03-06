import React, { useState } from 'react';
import { Plus, Shield, Star, Info } from 'lucide-react';
import { EnhancedPresetCard } from './EnhancedPresetCard';
import { CreatePresetModal } from './PresetModals';

// ============================================
// PART 6: ENHANCED PRESETS TAB COMPONENT
// ============================================

interface PresetsTabProps {
  accordionStates: Record<string, boolean>;
  toggleAccordion: (key: string) => void;
}

export const EnhancedPresetsTab: React.FC<PresetsTabProps> = ({ accordionStates, toggleAccordion }) => {
  const [showCreatePresetModal, setShowCreatePresetModal] = useState(false);
  const [appliedPresetId, setAppliedPresetId] = useState<string>('1');
  const [presetModified, setPresetModified] = useState(false);

  // Mock preset data - separated into default and custom
  const defaultPresets = [
    { 
      id: '1', 
      name: 'Default Theme', 
      description: 'System default theme', 
      isActive: appliedPresetId === '1', 
      isSystem: true, 
      isModified: presetModified && appliedPresetId === '1' 
    },
  ];

  const customPresets = [
    { 
      id: '2', 
      name: 'Professional Blue', 
      description: 'Corporate color scheme', 
      isActive: appliedPresetId === '2', 
      isSystem: false, 
      isModified: presetModified && appliedPresetId === '2' 
    },
    { 
      id: '3', 
      name: 'Vibrant Purple', 
      description: 'Bold and modern', 
      isActive: appliedPresetId === '3', 
      isSystem: false, 
      isModified: presetModified && appliedPresetId === '3' 
    },
  ];

  const handleApplyPreset = (id: string) => {
    setAppliedPresetId(id);
    setPresetModified(false); // Reset modified state when applying preset
  };

  const handleDuplicatePreset = (id: string, newName: string) => {
    // Visual only - no actual duplication
    console.log(`Duplicating preset ${id} as ${newName}`);
  };

  const handleDeletePreset = (id: string) => {
    // Visual only - no actual deletion
    console.log(`Deleting preset ${id}`);
  };

  const handleRenamePreset = (id: string, newName: string) => {
    // Visual only - no actual rename
    console.log(`Renaming preset ${id} to ${newName}`);
  };

  const handleCreatePreset = (name: string, description: string) => {
    // Visual only - no actual creation
    console.log(`Creating preset: ${name} - ${description}`);
  };

  return (
    <div>
      {/* 1️⃣ PRESETS TAB — CONCEPTUAL CLARITY */}
      {/* Header Section with Enhanced Messaging */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Theme Presets</h3>
            <p className="text-xs text-gray-500 mt-0.5">Apply a collection of theme styles at once</p>
          </div>
          <button 
            onClick={() => setShowCreatePresetModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium"
          >
            <Plus size={14} />
            Create Preset
          </button>
        </div>
        {/* Helper Text */}
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-xs text-purple-700 leading-relaxed">
            <strong>Presets override individual theme values.</strong> When you apply a preset, it replaces your current color, typography, and layout settings.
          </p>
        </div>
      </div>

      {/* Default Presets Section */}
      <div className="bg-gray-50/50">
        <div className="px-4 py-2 border-b border-gray-200 bg-white/50">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-gray-600" />
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Default Presets</h4>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {defaultPresets.map((preset) => (
            <EnhancedPresetCard 
              key={preset.id} 
              preset={preset}
              onApply={handleApplyPreset}
              onDuplicate={handleDuplicatePreset}
              onDelete={handleDeletePreset}
              onRename={handleRenamePreset}
            />
          ))}
        </div>
      </div>

      {/* Custom Presets Section */}
      <div className="bg-gray-50/50">
        <div className="px-4 py-2 border-b border-gray-200 bg-white/50">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-gray-600" />
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Custom Presets</h4>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {customPresets.length > 0 ? (
            customPresets.map((preset) => (
              <EnhancedPresetCard 
                key={preset.id} 
                preset={preset}
                onApply={handleApplyPreset}
                onDuplicate={handleDuplicatePreset}
                onDelete={handleDeletePreset}
                onRename={handleRenamePreset}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <Star size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs text-gray-500">No custom presets yet</p>
              <p className="text-xs text-gray-400 mt-1">Click &quot;Create Preset&quot; to save your current theme</p>
            </div>
          )}
        </div>
      </div>

      {/* System Info */}
      <div className="p-4 bg-blue-50 border-t border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Info size={16} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">About Presets</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              Presets save your complete theme configuration including colors, typography, buttons, and spacing. 
              System presets cannot be deleted but can be duplicated and modified.
            </p>
          </div>
        </div>
      </div>

      {/* 4️⃣ CREATE PRESET FLOW */}
      {showCreatePresetModal && (
        <CreatePresetModal 
          onClose={() => setShowCreatePresetModal(false)} 
          onConfirm={handleCreatePreset}
        />
      )}
    </div>
  );
};
