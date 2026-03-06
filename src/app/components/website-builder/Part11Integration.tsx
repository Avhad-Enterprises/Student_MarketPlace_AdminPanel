/**
 * PART 11: STATE MANAGEMENT FOUNDATION
 * Integration Layer - Ties all stores together
 * 
 * This file provides:
 * - Unified state management interface
 * - Store synchronization
 * - Combined hooks for common operations
 * - Middleware for cross-store communication
 */

import React from 'react';
import { useThemeStore } from './Part11ThemeStore';
import { useHistoryStore, useHistoryKeyboard } from './Part11HistoryStore';
import { usePublishingStore } from './Part11PublishingStore';
import { useAutoSaveStore, useAutoSave } from './Part11AutoSaveStore';
import { toast } from 'sonner';

// ============================================
// UNIFIED WEBSITE BUILDER HOOK
// ============================================

/**
 * Main hook that combines all stores and provides a unified interface
 */
export const useWebsiteBuilder = () => {
  // Theme Store
  const themeStore = useThemeStore();
  const historyStore = useHistoryStore();
  const publishingStore = usePublishingStore();
  const autoSaveStore = useAutoSaveStore();

  // Sync theme changes to publishing draft
  React.useEffect(() => {
    publishingStore.updateDraft(themeStore.sections);
  }, [themeStore.sections, publishingStore]);

  // Auto-save functionality
  const { manualSave } = useAutoSave(
    themeStore.sections,
    async () => {
      // Simulate save to backend
      await new Promise(resolve => setTimeout(resolve, 500));
      themeStore.markSaved();
      toast.success('Changes saved automatically');
    },
    {
      enabled: autoSaveStore.autoSaveEnabled,
      interval: autoSaveStore.autoSaveInterval,
      debounce: 2000
    }
  );

  // Undo/Redo with history tracking
  const undo = React.useCallback(() => {
    const snapshot = historyStore.undo();
    if (snapshot) {
      themeStore.sections.forEach((_, index) => {
        if (snapshot.sections[index]) {
          // Restore sections from snapshot
          themeStore.sections[index] = snapshot.sections[index];
        }
      });
      toast.info(`Undone: ${snapshot.description}`);
    } else {
      toast.error('Nothing to undo');
    }
  }, [historyStore, themeStore]);

  const redo = React.useCallback(() => {
    const snapshot = historyStore.redo();
    if (snapshot) {
      themeStore.sections.forEach((_, index) => {
        if (snapshot.sections[index]) {
          // Restore sections from snapshot
          themeStore.sections[index] = snapshot.sections[index];
        }
      });
      toast.info(`Redone: ${snapshot.description}`);
    } else {
      toast.error('Nothing to redo');
    }
  }, [historyStore, themeStore]);

  // Keyboard shortcuts for undo/redo
  useHistoryKeyboard(undo, redo);

  // Track changes in history
  React.useEffect(() => {
    if (themeStore.isDirty) {
      historyStore.pushSnapshot(themeStore.sections, 'Modified sections');
    }
  }, [themeStore.sections, themeStore.isDirty, historyStore]);

  // Publish with validation
  const publish = React.useCallback(async (publishedBy: string, notes?: string) => {
    try {
      // Validate before publishing
      if (themeStore.sections.length === 0) {
        toast.error('Cannot publish empty website');
        return false;
      }

      // Check for required sections
      const hasHeader = themeStore.sections.some(s => s.group === 'header' && s.isVisible);
      if (!hasHeader) {
        toast.warning('Publishing without a visible header section');
      }

      publishingStore.publish(publishedBy, notes);
      themeStore.markSaved();
      toast.success('Publishing changes...');
      
      return true;
    } catch (error) {
      toast.error('Failed to publish');
      return false;
    }
  }, [themeStore, publishingStore]);

  return {
    // Theme State
    sections: themeStore.sections,
    selectedSectionId: themeStore.selectedSectionId,
    selectedBlockId: themeStore.selectedBlockId,
    hasUnsavedChanges: themeStore.hasUnsavedChanges,
    
    // Theme Actions
    addSection: themeStore.addSection,
    removeSection: themeStore.removeSection,
    updateSection: themeStore.updateSection,
    moveSectionUp: themeStore.moveSectionUp,
    moveSectionDown: themeStore.moveSectionDown,
    toggleSectionVisibility: themeStore.toggleSectionVisibility,
    selectSection: themeStore.selectSection,
    
    addBlock: themeStore.addBlock,
    removeBlock: themeStore.removeBlock,
    updateBlock: themeStore.updateBlock,
    moveBlockUp: themeStore.moveBlockUp,
    moveBlockDown: themeStore.moveBlockDown,
    toggleBlockVisibility: themeStore.toggleBlockVisibility,
    selectBlock: themeStore.selectBlock,
    updateBlockContent: themeStore.updateBlockContent,
    
    // History
    undo,
    redo,
    canUndo: historyStore.canUndo(),
    canRedo: historyStore.canRedo(),
    
    // Publishing
    currentEnvironment: publishingStore.currentEnvironment,
    setEnvironment: publishingStore.setEnvironment,
    publish,
    hasUnpublishedChanges: publishingStore.hasUnpublishedChanges(),
    isPublishing: publishingStore.isPublishing,
    
    // Auto-save
    saveStatus: autoSaveStore.saveStatus,
    lastSaveTime: autoSaveStore.lastSaveTime,
    manualSave,
    
    // Reset
    resetToDefaults: themeStore.resetToDefaults,
    clearAll: themeStore.clearAll
  };
};

// ============================================
// SELECTIVE HOOKS FOR PERFORMANCE
// ============================================

/**
 * Hook to get only section data (for section list)
 */
export const useSections = () => {
  return useThemeStore((state) => ({
    sections: state.sections,
    selectedSectionId: state.selectedSectionId,
    selectSection: state.selectSection
  }));
};

/**
 * Hook to get only block data for a specific section
 */
export const useSectionBlocks = (sectionId: string) => {
  return useThemeStore((state) => {
    const section = state.sections.find(s => s.id === sectionId);
    return {
      blocks: section?.blocks || [],
      selectedBlockId: state.selectedBlockId,
      selectBlock: state.selectBlock,
      addBlock: state.addBlock,
      removeBlock: state.removeBlock,
      updateBlock: state.updateBlock,
      toggleBlockVisibility: state.toggleBlockVisibility
    };
  });
};

/**
 * Hook to get publishing state (for toolbar)
 */
export const usePublishingState = () => {
  return usePublishingStore((state) => ({
    currentEnvironment: state.currentEnvironment,
    setEnvironment: state.setEnvironment,
    hasUnpublishedChanges: state.hasUnpublishedChanges(),
    isPublishing: state.isPublishing,
    lastPublished: state.lastPublished
  }));
};

/**
 * Hook to get save state (for auto-save indicator)
 */
export const useSaveState = () => {
  return useAutoSaveStore((state) => ({
    saveStatus: state.saveStatus,
    lastSaveTime: state.lastSaveTime,
    saveError: state.saveError,
    isSaving: state.isSaving
  }));
};

/**
 * Hook to get history state (for undo/redo buttons)
 */
export const useHistoryState = () => {
  return useHistoryStore((state) => ({
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    undo: state.undo,
    redo: state.redo
  }));
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Initialize stores with data (useful for loading saved state)
 */
export const initializeWebsiteBuilder = (initialSections: any[]) => {
  const themeStore = useThemeStore.getState();
  const publishingStore = usePublishingStore.getState();
  const historyStore = useHistoryStore.getState();
  
  // Set initial sections
  themeStore.sections = initialSections;
  
  // Set as published state
  publishingStore.updateDraft(initialSections);
  publishingStore.publishedSections = JSON.parse(JSON.stringify(initialSections));
  
  // Create initial history snapshot
  historyStore.pushSnapshot(initialSections, 'Initial state');
  
  // Mark as saved
  themeStore.markSaved();
};

/**
 * Export current state (for backup/export features)
 */
export const exportWebsiteBuilderState = () => {
  const themeStore = useThemeStore.getState();
  const publishingStore = usePublishingStore.getState();
  
  return {
    sections: themeStore.sections,
    publishedSections: publishingStore.publishedSections,
    versions: publishingStore.versions,
    lastSaved: themeStore.lastSaved,
    lastPublished: publishingStore.lastPublished
  };
};

/**
 * Get changes summary (for publishing modal)
 */
export const getChangesSummary = () => {
  const themeStore = useThemeStore.getState();
  const publishingStore = usePublishingStore.getState();
  
  const draft = themeStore.sections;
  const published = publishingStore.publishedSections;
  
  const changes = {
    added: 0,
    modified: 0,
    removed: 0,
    details: [] as string[]
  };
  
  // Compare sections
  const publishedIds = new Set(published.map(s => s.id));
  const draftIds = new Set(draft.map(s => s.id));
  
  // Find added sections
  draft.forEach(section => {
    if (!publishedIds.has(section.id)) {
      changes.added++;
      changes.details.push(`Added section: ${section.name}`);
    }
  });
  
  // Find removed sections
  published.forEach(section => {
    if (!draftIds.has(section.id)) {
      changes.removed++;
      changes.details.push(`Removed section: ${section.name}`);
    }
  });
  
  // Find modified sections (simplified comparison)
  draft.forEach(draftSection => {
    const publishedSection = published.find(s => s.id === draftSection.id);
    if (publishedSection) {
      if (JSON.stringify(draftSection) !== JSON.stringify(publishedSection)) {
        changes.modified++;
        changes.details.push(`Modified section: ${draftSection.name}`);
      }
    }
  });
  
  return changes;
};
