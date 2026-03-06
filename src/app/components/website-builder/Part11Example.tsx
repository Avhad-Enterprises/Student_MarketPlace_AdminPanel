/**
 * PART 11: STATE MANAGEMENT FOUNDATION
 * Example Component - Demonstrates usage of the state management system
 * 
 * This example shows:
 * - Using the unified hook
 * - Section management
 * - Undo/redo
 * - Save status
 * - Publishing workflow
 */

import React from 'react';
import { 
  useWebsiteBuilder, 
  useSaveState, 
  useHistoryState 
} from './Part11Integration';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Save, 
  Undo, 
  Redo, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Example: Section List with State Management
 */
export const SectionListExample: React.FC = () => {
  const {
    sections,
    selectedSectionId,
    selectSection,
    addSection,
    removeSection,
    moveSectionUp,
    moveSectionDown,
    toggleSectionVisibility
  } = useWebsiteBuilder();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sections</h3>
        <Button 
          onClick={() => addSection('custom', 'New Section', 'content')}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      <div className="space-y-1">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`
              p-3 rounded-lg border-2 cursor-pointer transition-colors
              ${selectedSectionId === section.id 
                ? 'border-[#253154] bg-[#253154]/5' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => selectSection(section.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <section.icon className="w-4 h-4" />
                <span className="font-medium">{section.name}</span>
                {section.isRequired && (
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                )}
                {!section.isVisible && (
                  <Badge variant="outline" className="text-xs">Hidden</Badge>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSectionVisibility(section.id);
                  }}
                  title={section.isVisible ? 'Hide' : 'Show'}
                >
                  {section.isVisible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSectionUp(section.id);
                  }}
                  disabled={index === 0}
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSectionDown(section.id);
                  }}
                  disabled={index === sections.length - 1}
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {!section.isRequired && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Remove this section?')) {
                        removeSection(section.id);
                        toast.success('Section removed');
                      }
                    }}
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-500">
              {section.blocks.length} blocks
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Example: Undo/Redo Toolbar
 */
export const UndoRedoToolbar: React.FC = () => {
  const { undo, redo, canUndo, canRedo } = useWebsiteBuilder();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo className="w-4 h-4" />
      </Button>

      <div className="text-xs text-gray-500">
        {canUndo && 'Can undo'} {canUndo && canRedo && '•'} {canRedo && 'Can redo'}
      </div>
    </div>
  );
};

/**
 * Example: Save Status Indicator
 */
export const SaveStatusIndicator: React.FC = () => {
  const { saveStatus, lastSaveTime, isSaving } = useSaveState();
  const { manualSave, hasUnsavedChanges } = useWebsiteBuilder();

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'saved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Save className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    if (isSaving) return 'Saving...';
    if (saveStatus === 'saved' && lastSaveTime) {
      const seconds = Math.floor((Date.now() - lastSaveTime.getTime()) / 1000);
      if (seconds < 60) return `Saved ${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      return `Saved ${minutes}m ago`;
    }
    if (saveStatus === 'error') return 'Save failed';
    return 'Not saved';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-sm text-gray-600">{getStatusText()}</span>
      </div>

      {hasUnsavedChanges && (
        <Button
          variant="outline"
          size="sm"
          onClick={manualSave}
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Now
        </Button>
      )}
    </div>
  );
};

/**
 * Example: Publishing Toolbar
 */
export const PublishingToolbar: React.FC = () => {
  const {
    currentEnvironment,
    setEnvironment,
    publish,
    hasUnpublishedChanges,
    isPublishing
  } = useWebsiteBuilder();

  const handlePublish = async () => {
    const success = await publish('Current User', 'Manual publish from toolbar');
    if (success) {
      toast.success('Published successfully!');
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Environment Switcher */}
      <div className="flex items-center gap-1 rounded-lg border p-1">
        <Button
          variant={currentEnvironment === 'draft' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setEnvironment('draft')}
          className="text-xs"
        >
          Draft
        </Button>
        <Button
          variant={currentEnvironment === 'preview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setEnvironment('preview')}
          className="text-xs"
        >
          Preview
        </Button>
        <Button
          variant={currentEnvironment === 'live' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setEnvironment('live')}
          className="text-xs"
        >
          Live
        </Button>
      </div>

      {/* Publish Button */}
      <Button
        onClick={handlePublish}
        disabled={!hasUnpublishedChanges || isPublishing}
        className="bg-[#253154] hover:bg-[#1a2340]"
      >
        {isPublishing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Publishing...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Publish Changes
          </>
        )}
      </Button>

      {hasUnpublishedChanges && !isPublishing && (
        <Badge variant="outline" className="text-orange-600 border-orange-300">
          Unpublished changes
        </Badge>
      )}
    </div>
  );
};

/**
 * Example: Complete Editor with State Management
 */
export const Part11EditorExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">Website Builder - Part 11 Example</h1>
          <p className="text-gray-600 mb-6">
            This example demonstrates the new state management system with real functionality.
          </p>

          {/* Toolbar */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-6">
              <UndoRedoToolbar />
              <SaveStatusIndicator />
            </div>
            <PublishingToolbar />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sections Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <SectionListExample />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                Select a section to edit its content
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">✨ Features Demonstrated:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Add, remove, and reorder sections</li>
            <li>• Undo/Redo with Ctrl+Z keyboard shortcuts</li>
            <li>• Auto-save every 30 seconds</li>
            <li>• Manual save button when there are unsaved changes</li>
            <li>• Draft/Preview/Live environment switching</li>
            <li>• Publish workflow with validation</li>
            <li>• Save status indicator with timestamps</li>
            <li>• Section visibility toggle</li>
            <li>• Required sections cannot be removed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Part11EditorExample;
