import React, { useState } from 'react';
import { GripVertical, Copy, Eye, EyeOff, Trash2, MoreVertical, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';

interface Block {
  id: string;
  type: string;
  name: string;
  icon: any;
  isVisible: boolean;
  content: any;
}

interface BlockToolbarProps {
  block: Block;
  sectionId: string;
  onDuplicate: (sectionId: string, blockId: string) => void;
  onToggleVisibility: (sectionId: string, blockId: string) => void;
  onDelete: (sectionId: string, blockId: string) => void;
}

export const BlockToolbar: React.FC<BlockToolbarProps> = ({ block, sectionId, onDuplicate, onToggleVisibility, onDelete }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <div className="absolute top-0 right-0 -mt-9 mr-2 z-30">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-green-600 text-white rounded-lg shadow-lg">
        {/* Drag Handle */}
        <button 
          className="p-1 hover:bg-green-700 rounded transition-colors cursor-grab active:cursor-grabbing" 
          title="Reorder block"
        >
          <GripVertical size={14} />
        </button>
        
        <div className="w-px h-4 bg-white/30 mx-1" />
        
        {/* Duplicate */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(sectionId, block.id);
          }}
          className="p-1 hover:bg-green-700 rounded transition-colors" 
          title="Duplicate block (⌘D)"
        >
          <Copy size={14} />
        </button>
        
        {/* Visibility Toggle */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(sectionId, block.id);
          }}
          className="p-1 hover:bg-green-700 rounded transition-colors" 
          title={block.isVisible ? "Hide block" : "Show block"}
        >
          {block.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        
        {/* Delete */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(sectionId, block.id);
          }}
          className="p-1 hover:bg-green-700 rounded transition-colors" 
          title="Delete block (Del)"
        >
          <Trash2 size={14} />
        </button>
        
        <div className="w-px h-4 bg-white/30 mx-1" />
        
        {/* More Options */}
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMoreMenu(!showMoreMenu);
            }}
            className="p-1 hover:bg-green-700 rounded transition-colors" 
            title="More options"
          >
            <MoreVertical size={14} />
          </button>
          
          {/* More Options Dropdown */}
          {showMoreMenu && (
            <>
              {/* Click outside overlay */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreMenu(false);
                }}
              />
              
              {/* Dropdown Menu */}
              <div 
                className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(sectionId, block.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy size={14} />
                  Duplicate
                </button>
                
                <button 
                  className="w-full px-3 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
                  title="Not available in this version"
                  disabled
                >
                  <ChevronUp size={14} />
                  Move Up
                </button>
                
                <button 
                  className="w-full px-3 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
                  title="Not available in this version"
                  disabled
                >
                  <ChevronDown size={14} />
                  Move Down
                </button>
                
                <div className="h-px bg-gray-200 my-1" />
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(sectionId, block.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  {block.isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  {block.isVisible ? 'Hide Block' : 'Show Block'}
                </button>
                
                <button 
                  className="w-full px-3 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
                  title="Not available in this version"
                  disabled
                >
                  <RotateCcw size={14} />
                  Reset Styles
                </button>
                
                <div className="h-px bg-gray-200 my-1" />
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(sectionId, block.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
