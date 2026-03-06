import React from 'react';
import {
  GripVertical,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  ChevronRight,
  Shield,
  Lock,
  Box,
  X,
  AlertTriangle
} from 'lucide-react';
import { BlockToolbar } from './BlockToolbar';
import { BlockContent } from './BlockContent';
import { Section, Block, SectionType } from './types';
import { ModifiedSectionIndicator } from './UnpublishedChangeIndicators'; // PART 7: Change indicators
import { LockedSectionIndicator, TeamMember as CollaborationTeamMember } from './Part8CollaborationUI'; // PART 8: Locked sections

// ============================================
// SECTION ROW COMPONENT
// ============================================

interface SectionRowProps {
  section: Section;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
  onToggleVisibility: () => void;
  hasUnpublishedChanges?: boolean; // PART 7: Track unpublished changes
  lockedBy?: CollaborationTeamMember | null; // PART 8: Track locked state
}

export const SectionRow: React.FC<SectionRowProps> = ({
  section,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave,
  onToggleVisibility,
  hasUnpublishedChanges = false, // PART 7: Default to false
  lockedBy = null // PART 8: Default to null
}) => {
  const SectionIcon = section.icon;

  return (
    <div
      className={`
        group relative px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-colors
        ${isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : 'hover:bg-gray-50 border-l-2 border-transparent'}
        ${section.isRequired ? 'opacity-100' : 'opacity-100'}
      `}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Drag Handle */}
      <div className={`flex-shrink-0 ${section.isRequired ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 cursor-grab'}`}>
        <GripVertical size={16} />
      </div>

      {/* Section Icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
        }`}>
        <SectionIcon size={16} />
      </div>

      {/* Section Name & Badge */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {/* PART 7: Unpublished Change Indicator */}
          <ModifiedSectionIndicator hasChanges={hasUnpublishedChanges} />

          <span className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
            {section.name}
          </span>
          {section.isRequired && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded border border-gray-200">
              <Shield size={10} />
              Required
            </span>
          )}

          {/* Lock Indicator (shown when section is being edited by someone else) */}
          {lockedBy && (
            <LockedSectionIndicator lockedBy={lockedBy} />
          )}

          {/* Presence Indicator (shown when someone is viewing) */}
          {section.id === 'testimonials' && (
            <div className="flex items-center" title="Alex is viewing this section">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                alt="Alex"
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Visibility Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${section.isVisible ? 'text-gray-600' : 'text-gray-400'
            }`}
          title={section.isVisible ? 'Hide section' : 'Show section'}
        >
          {section.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>

        {/* Delete Button (only for optional sections) */}
        {!section.isRequired && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Delete logic here
            }}
            className="p-1.5 rounded hover:bg-red-50 hover:text-red-600 transition-colors text-gray-400 opacity-0 group-hover:opacity-100"
            title="Delete section"
          >
            <Trash2 size={14} />
          </button>
        )}

        {/* Expand Indicator */}
        <ChevronRight size={14} className={`text-gray-400 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
      </div>
    </div>
  );
};

// ============================================
// SECTION PREVIEW WITH BLOCKS
// ============================================

interface SectionPreviewWithBlocksProps {
  section: Section;
  selectedBlock: { sectionId: string; blockId: string } | null;
  hoveredBlock: { sectionId: string; blockId: string } | null;
  onBlockSelect: (sectionId: string, blockId: string) => void;
  onBlockHover: (block: { sectionId: string; blockId: string } | null) => void;
  onBlockLeave: () => void;
  onShowAddBlock: (info: { sectionId: string; position: number }) => void;
  handleDuplicateBlock: (sectionId: string, blockId: string) => void;
  handleToggleBlockVisibility: (sectionId: string, blockId: string) => void;
  setShowDeleteBlockModal: (info: { sectionId: string; blockId: string }) => void;
}

export const SectionPreviewWithBlocks: React.FC<SectionPreviewWithBlocksProps> = ({
  section,
  selectedBlock,
  hoveredBlock,
  onBlockSelect,
  onBlockHover,
  onBlockLeave,
  onShowAddBlock,
  handleDuplicateBlock,
  handleToggleBlockVisibility,
  setShowDeleteBlockModal
}) => {
  // Empty state for sections with no blocks
  if (!section.blocks || section.blocks.length === 0) {
    return (
      <div className="py-16 px-8">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Box size={24} className="text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">This section is empty</p>
            <p className="text-xs text-gray-500 mt-1">Add blocks to build your content</p>
          </div>
          <button
            onClick={() => onShowAddBlock({ sectionId: section.id, position: 0 })}
            className="flex items-center gap-2 px-4 py-2 bg-[#0e042f] text-white rounded-lg hover:bg-[#1a0a4a] transition-colors text-sm font-medium mt-2"
          >
            <Plus size={16} />
            Add a Block
          </button>
        </div>
      </div>
    );
  }

  // For sections with blocks, render editable blocks
  if (section.blocks && section.blocks.length > 0) {
    return (
      <div className="relative">
        {section.blocks.map((block, index) => {
          const isBlockSelected = selectedBlock?.sectionId === section.id && selectedBlock?.blockId === block.id;
          const isBlockHovered = hoveredBlock?.sectionId === section.id && hoveredBlock?.blockId === block.id;

          return (
            <div key={block.id} className="relative">
              {/* Add Block Button Between Blocks */}
              <div className="relative group/add">
                <div className="h-8 flex items-center justify-center opacity-0 group-hover/add:opacity-100 transition-opacity">
                  <button
                    onClick={() => onShowAddBlock({ sectionId: section.id, position: index })}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors text-xs"
                  >
                    <Plus size={12} />
                    Add Block
                  </button>
                </div>
              </div>

              {/* Block Container */}
              <div
                className={`relative transition-all ${isBlockSelected
                  ? 'ring-2 ring-green-500 ring-inset bg-green-50/30'
                  : isBlockHovered
                    ? 'ring-2 ring-dashed ring-green-300 ring-inset bg-green-50/10'
                    : ''
                  } ${!block.isVisible ? 'opacity-40' : ''}`}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  onBlockHover({ sectionId: section.id, blockId: block.id });
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  onBlockLeave();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onBlockSelect(section.id, block.id);
                }}
              >
                {/* Block Type Label (when selected) */}
                {isBlockSelected && (
                  <div className="absolute top-2 left-2 z-20">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-600/90 text-white text-xs rounded shadow-sm">
                      <block.icon size={12} />
                      <span className="font-medium">{block.name}</span>
                      {!block.isVisible && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-600 rounded text-[10px] ml-1">
                          <EyeOff size={10} />
                          Hidden on live site
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Block Hover Indicator */}
                {isBlockHovered && !isBlockSelected && (
                  <div className="absolute top-2 left-2 z-20">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/80 text-white text-xs rounded">
                      <block.icon size={10} />
                      <span>{block.name}</span>
                    </div>
                  </div>
                )}

                {/* Block Toolbar (on hover OR selection) */}
                {(isBlockHovered || isBlockSelected) && (
                  <BlockToolbar
                    block={block}
                    sectionId={section.id}
                    onDuplicate={handleDuplicateBlock}
                    onToggleVisibility={handleToggleBlockVisibility}
                    onDelete={(sid, bid) => setShowDeleteBlockModal({ sectionId: sid, blockId: bid })}
                  />
                )}

                {/* Block Content */}
                <BlockContent block={block} />
              </div>
            </div>
          );
        })}

        {/* Add Block at End */}
        <div className="relative group/add">
          <div className="h-12 flex items-center justify-center opacity-0 group-hover/add:opacity-100 transition-opacity">
            <button
              onClick={() => onShowAddBlock({ sectionId: section.id, position: section.blocks.length })}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors text-xs font-medium"
            >
              <Plus size={14} />
              Add Block
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: Render static section preview for sections without blocks
  return <StaticSectionPreview section={section} />;
};

// ============================================
// STATIC SECTION PREVIEW (Fallback)
// ============================================

export const StaticSectionPreview: React.FC<{ section: Section }> = ({ section }) => {
  switch (section.type) {
    case 'category-grid':
      return (
        <div className="px-8 py-12">
          <div className="grid grid-cols-4 gap-4">
            {['USA', 'UK', 'Canada', 'Australia'].map((country) => (
              <div key={country} className="bg-gray-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">🌍</div>
                <div className="font-semibold">{country}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'testimonial':
      return (
        <div className="px-8 py-12">
          <div className="grid grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4 italic">&quot;Amazing service! They helped me every step of the way.&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300" />
                  <div>
                    <div className="font-semibold text-sm">Student Name</div>
                    <div className="text-xs text-gray-500">Studying in USA</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'footer':
      return (
        <div className="bg-[#0e042f] text-white px-8 py-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-3">About Us</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Our Story</li>
                <li>Team</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Services</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Visa Help</li>
                <li>Banking</li>
                <li>Insurance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Countries</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>USA</li>
                <li>UK</li>
                <li>Canada</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Contact</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Email</li>
                <li>Phone</li>
                <li>Live Chat</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6 text-center text-sm opacity-60">
            © 2026 Study Visa Platform. All rights reserved.
          </div>
        </div>
      );

    default:
      return (
        <div className="px-8 py-12 bg-gray-100 text-center">
          <p className="text-gray-500">Section Preview</p>
        </div>
      );
  }
};

// ============================================
// ADD SECTION MODAL
// ============================================

interface AddSectionModalProps {
  onSelectType: (type: string) => void;
  onCancel: () => void;
  sectionTypes: SectionType[];
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({ onSelectType, onCancel, sectionTypes }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-[600px] max-h-[600px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#253154]">Add Section</h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[480px]">
          <div className="grid grid-cols-2 gap-3">
            {sectionTypes.map((sectionType) => (
              <button
                key={sectionType.id}
                onClick={() => onSelectType(sectionType.type)}
                className="flex flex-col items-start gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-[#0e042f] hover:bg-purple-50/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 group-hover:bg-[#0e042f] flex items-center justify-center transition-colors">
                  <sectionType.icon size={20} className="text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-[#253154] mb-1">{sectionType.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{sectionType.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DELETE SECTION MODAL
// ============================================

interface DeleteSectionModalProps {
  sectionName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteSectionModal: React.FC<DeleteSectionModalProps> = ({ sectionName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-[500px] p-6" onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-red-600" />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-[#253154] mb-2">Delete section?</h2>
          <p className="text-sm text-gray-600">
            <strong>{sectionName}</strong> and all its blocks will be permanently removed. This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete Section
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DELETE BLOCK MODAL
// ============================================

interface DeleteBlockModalProps {
  blockName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteBlockModal: React.FC<DeleteBlockModalProps> = ({ blockName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-[500px] p-6" onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-red-600" />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-[#253154] mb-2">Delete block?</h2>
          <p className="text-sm text-gray-600">
            <strong>{blockName}</strong> will be permanently removed. This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete Block
          </button>
        </div>
      </div>
    </div>
  );
};