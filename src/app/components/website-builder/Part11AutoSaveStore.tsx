/**
 * PART 11: STATE MANAGEMENT FOUNDATION
 * Auto-Save Store - Manages automatic saving with debouncing
 * 
 * This store provides:
 * - Auto-save with configurable interval
 * - Debouncing to prevent excessive saves
 * - Save status tracking
 * - Manual save trigger
 * - Save error handling
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import React from 'react';

// ============================================
// TYPES
// ============================================

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface AutoSaveState {
  // Status
  saveStatus: SaveStatus;
  lastSaveTime: Date | null;
  saveError: string | null;
  isSaving: boolean;
  
  // Settings
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // milliseconds
  
  // Actions
  setSaveStatus: (status: SaveStatus) => void;
  setLastSaveTime: (time: Date) => void;
  setSaveError: (error: string | null) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  setAutoSaveInterval: (interval: number) => void;
  startSaving: () => void;
  completeSave: () => void;
  failSave: (error: string) => void;
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useAutoSaveStore = create<AutoSaveState>()(
  immer((set) => ({
    // Initial State
    saveStatus: 'idle',
    lastSaveTime: null,
    saveError: null,
    isSaving: false,
    autoSaveEnabled: true,
    autoSaveInterval: 30000, // 30 seconds

    // Actions
    setSaveStatus: (status) => {
      set((state) => {
        state.saveStatus = status;
      });
    },

    setLastSaveTime: (time) => {
      set((state) => {
        state.lastSaveTime = time;
      });
    },

    setSaveError: (error) => {
      set((state) => {
        state.saveError = error;
      });
    },

    setAutoSaveEnabled: (enabled) => {
      set((state) => {
        state.autoSaveEnabled = enabled;
      });
    },

    setAutoSaveInterval: (interval) => {
      set((state) => {
        state.autoSaveInterval = interval;
      });
    },

    startSaving: () => {
      set((state) => {
        state.isSaving = true;
        state.saveStatus = 'saving';
        state.saveError = null;
      });
    },

    completeSave: () => {
      set((state) => {
        state.isSaving = false;
        state.saveStatus = 'saved';
        state.lastSaveTime = new Date();
        state.saveError = null;
      });
    },

    failSave: (error) => {
      set((state) => {
        state.isSaving = false;
        state.saveStatus = 'error';
        state.saveError = error;
      });
    }
  }))
);

// ============================================
// AUTO-SAVE HOOK
// ============================================

/**
 * Hook to handle auto-save functionality with debouncing
 */
export const useAutoSave = (
  data: any,
  onSave: () => Promise<void>,
  options: {
    enabled?: boolean;
    interval?: number;
    debounce?: number;
  } = {}
) => {
  const {
    autoSaveEnabled,
    autoSaveInterval,
    startSaving,
    completeSave,
    failSave
  } = useAutoSaveStore();

  const {
    enabled = autoSaveEnabled,
    interval = autoSaveInterval,
    debounce = 2000
  } = options;

  const dataRef = React.useRef(data);
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Update data ref
  React.useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Auto-save logic
  React.useEffect(() => {
    if (!enabled) return;

    // Clear existing timeouts
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce: wait for user to stop making changes
    debounceTimeoutRef.current = setTimeout(() => {
      // Clear existing save timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Schedule save
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          startSaving();
          await onSave();
          completeSave();
        } catch (error) {
          failSave(error instanceof Error ? error.message : 'Save failed');
        }
      }, interval);
    }, debounce);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, enabled, interval, debounce, onSave, startSaving, completeSave, failSave]);

  // Manual save function
  const manualSave = React.useCallback(async () => {
    try {
      startSaving();
      await onSave();
      completeSave();
    } catch (error) {
      failSave(error instanceof Error ? error.message : 'Save failed');
    }
  }, [onSave, startSaving, completeSave, failSave]);

  return { manualSave };
};
