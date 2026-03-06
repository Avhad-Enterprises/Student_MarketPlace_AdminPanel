/**
 * PART 11: STATE MANAGEMENT FOUNDATION
 * History Store - Manages undo/redo with proper snapshots
 * 
 * This store provides:
 * - Undo/Redo functionality
 * - History snapshots
 * - Time travel debugging
 * - Action descriptions
 * - History limits
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Section } from './types';

// ============================================
// TYPES
// ============================================

export interface HistorySnapshot {
  id: string;
  timestamp: Date;
  sections: Section[];
  description: string;
}

export interface HistoryState {
  // History
  past: HistorySnapshot[];
  present: HistorySnapshot | null;
  future: HistorySnapshot[];
  
  // Settings
  maxHistorySize: number;
  
  // Actions
  pushSnapshot: (sections: Section[], description: string) => void;
  undo: () => HistorySnapshot | null;
  redo: () => HistorySnapshot | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
  jumpToSnapshot: (snapshotId: string) => HistorySnapshot | null;
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useHistoryStore = create<HistoryState>()(
  immer((set, get) => ({
    // Initial State
    past: [],
    present: null,
    future: [],
    maxHistorySize: 50,

    // Actions
    pushSnapshot: (sections, description) => {
      set((state) => {
        const snapshot: HistorySnapshot = {
          id: `snapshot-${Date.now()}`,
          timestamp: new Date(),
          sections: JSON.parse(JSON.stringify(sections)), // Deep clone
          description
        };

        // If we have a present state, move it to past
        if (state.present) {
          state.past.push(state.present);
          
          // Limit history size
          if (state.past.length > state.maxHistorySize) {
            state.past.shift();
          }
        }

        state.present = snapshot;
        state.future = []; // Clear future when new action is performed
      });
    },

    undo: () => {
      const state = get();
      
      if (state.past.length === 0) {
        return null;
      }

      let snapshot: HistorySnapshot | null = null;

      set((draft) => {
        const previous = draft.past.pop();
        
        if (previous && draft.present) {
          draft.future.unshift(draft.present);
          draft.present = previous;
          snapshot = previous;
        }
      });

      return snapshot;
    },

    redo: () => {
      const state = get();
      
      if (state.future.length === 0) {
        return null;
      }

      let snapshot: HistorySnapshot | null = null;

      set((draft) => {
        const next = draft.future.shift();
        
        if (next && draft.present) {
          draft.past.push(draft.present);
          draft.present = next;
          snapshot = next;
        }
      });

      return snapshot;
    },

    canUndo: () => {
      return get().past.length > 0;
    },

    canRedo: () => {
      return get().future.length > 0;
    },

    clearHistory: () => {
      set((state) => {
        state.past = [];
        state.future = [];
        state.present = null;
      });
    },

    jumpToSnapshot: (snapshotId) => {
      const state = get();
      
      // Find snapshot in past
      const pastIndex = state.past.findIndex(s => s.id === snapshotId);
      if (pastIndex !== -1) {
        const snapshot = state.past[pastIndex];
        
        set((draft) => {
          // Move everything after this snapshot to future
          if (draft.present) {
            draft.future.unshift(draft.present);
          }
          
          for (let i = draft.past.length - 1; i > pastIndex; i--) {
            draft.future.unshift(draft.past[i]);
          }
          
          draft.past = draft.past.slice(0, pastIndex);
          draft.present = snapshot;
        });
        
        return snapshot;
      }
      
      // Find snapshot in future
      const futureIndex = state.future.findIndex(s => s.id === snapshotId);
      if (futureIndex !== -1) {
        const snapshot = state.future[futureIndex];
        
        set((draft) => {
          // Move everything before this snapshot to past
          if (draft.present) {
            draft.past.push(draft.present);
          }
          
          for (let i = 0; i < futureIndex; i++) {
            draft.past.push(draft.future[i]);
          }
          
          draft.future = draft.future.slice(futureIndex + 1);
          draft.present = snapshot;
        });
        
        return snapshot;
      }
      
      return null;
    }
  }))
);

// ============================================
// HELPER HOOKS
// ============================================

/**
 * Hook to get undo/redo keyboard shortcuts
 */
export const useHistoryKeyboard = (onUndo: () => void, onRedo: () => void) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          onRedo();
        } else {
          onUndo();
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        onRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo]);
};

import React from 'react';
