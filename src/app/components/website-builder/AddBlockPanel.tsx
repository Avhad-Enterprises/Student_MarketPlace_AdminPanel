import React from 'react';
import { Plus } from 'lucide-react';

interface BlockType {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: any;
}

interface AddBlockPanelProps {
  blockTypes: BlockType[];
  sectionName: string;
  position: number;
  onClose: () => void;
  onSelectBlockType: (blockType: BlockType) => void;
}

export const AddBlockPanel: React.FC<AddBlockPanelProps> = ({ blockTypes, sectionName, position, onClose, onSelectBlockType }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[600px] max-h-[600px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-[#253154]">Add Block</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Plus size={20} className="rotate-45 text-gray-600" />
            </button>
          </div>
          {/* Insertion Context */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Plus size={14} className="text-green-600" />
            <span>Adding to: <strong className="text-gray-700">{sectionName}</strong></span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">Position {position + 1}</span>
          </div>
        </div>

        {/* Block Type Grid */}
        <div className="p-6 overflow-y-auto max-h-[500px]">
          <div className="grid grid-cols-3 gap-3">
            {blockTypes.map((blockType) => {
              const Icon = blockType.icon;
              return (
                <button
                  key={blockType.id}
                  onClick={() => onSelectBlockType(blockType)}
                  className="flex flex-col items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <Icon size={24} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">{blockType.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{blockType.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
