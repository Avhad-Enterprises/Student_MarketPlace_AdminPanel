/**
 * LIVE CONTENT EDITOR - STATE ENGINE
 * 
 * Core state management for live editing system
 * Maintains page schema, sections, blocks, and real-time updates
 * 
 * State Tree:
 * page
 *   └─ sections[]
 *       └─ blocks[]
 *           └─ fields{}
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================
// TYPES
// ============================================

export type FieldType = 
  | 'text'
  | 'richtext'
  | 'image'
  | 'video'
  | 'button'
  | 'link'
  | 'icon'
  | 'toggle'
  | 'slider'
  | 'color'
  | 'font'
  | 'repeater';

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  value: any;
  validation?: ValidationRule[];
  isValid?: boolean;
  error?: string;
}

export interface ValidationRule {
  type: 'required' | 'maxLength' | 'minLength' | 'format' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface Block {
  id: string;
  type: string;
  name: string;
  fields: Record<string, Field>;
  isVisible: boolean;
  isLocked?: boolean;
  order: number;
}

export interface Section {
  id: string;
  name: string;
  blocks: Block[];
  isCollapsed?: boolean;
  isLocked?: boolean;
  order: number;
}

export interface Page {
  id: string;
  name: string;
  sections: Section[];
  themeOverrides?: Record<string, any>;
  metadata?: {
    lastModified: string;
    modifiedBy: string;
  };
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  previousState: any;
  currentState: any;
}

export interface ChangeItem {
  path: string;
  fieldLabel: string;
  before: any;
  after: any;
  timestamp: number;
}

export interface EditorUser {
  id: string;
  name: string;
  color: string;
  currentSection?: string;
  currentBlock?: string;
  cursorPosition?: { x: number; y: number };
}

// ============================================
// EDITOR STATE STORE
// ============================================

interface EditorState {
  // Page State
  page: Page | null;
  isDraft: boolean;
  hasUnsavedChanges: boolean;
  lastSavedAt: Date | null;
  lastAutoSaveAt: Date | null;
  
  // History State
  history: HistoryEntry[];
  historyIndex: number;
  maxHistorySize: number;
  
  // Changes Tracking
  changes: ChangeItem[];
  
  // Multi-user State
  activeUsers: EditorUser[];
  currentUser: EditorUser | null;
  
  // UI State
  selectedSection: string | null;
  selectedBlock: string | null;
  selectedField: string | null;
  highlightedBlock: string | null;
  isPreviewMode: boolean;
  
  // Performance State
  isRendering: boolean;
  lastRenderTime: number;
  pendingUpdates: string[];
  
  // Offline State
  isOnline: boolean;
  pendingSync: boolean;
  offlineChanges: any[];
  
  // Error State
  lastError: string | null;
  recoveryAvailable: boolean;
  recoveryState: any | null;
  
  // Actions
  setPage: (page: Page) => void;
  updateField: (sectionId: string, blockId: string, fieldId: string, value: any) => void;
  updateBlock: (sectionId: string, blockId: string, updates: Partial<Block>) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  addHistoryEntry: (action: string, previousState: any, currentState: any) => void;
  clearHistory: () => void;
  
  // Save Actions
  save: () => Promise<void>;
  autoSave: () => Promise<void>;
  discardChanges: () => void;
  
  // Validation
  validateField: (sectionId: string, blockId: string, fieldId: string) => boolean;
  validateBlock: (sectionId: string, blockId: string) => boolean;
  validateAll: () => boolean;
  
  // Selection
  selectSection: (sectionId: string | null) => void;
  selectBlock: (blockId: string | null) => void;
  selectField: (fieldId: string | null) => void;
  highlightBlock: (blockId: string | null, duration?: number) => void;
  
  // Multi-user
  addUser: (user: EditorUser) => void;
  removeUser: (userId: string) => void;
  updateUserCursor: (userId: string, position: { x: number; y: number }) => void;
  
  // Offline
  setOnlineStatus: (isOnline: boolean) => void;
  syncOfflineChanges: () => Promise<void>;
  
  // Recovery
  saveRecoveryPoint: () => void;
  recoverFromCrash: () => void;
}

export const useEditorStore = create<EditorState>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        // Initial State
        page: null,
        isDraft: false,
        hasUnsavedChanges: false,
        lastSavedAt: null,
        lastAutoSaveAt: null,
        
        history: [],
        historyIndex: -1,
        maxHistorySize: 50,
        
        changes: [],
        
        activeUsers: [],
        currentUser: null,
        
        selectedSection: null,
        selectedBlock: null,
        selectedField: null,
        highlightedBlock: null,
        isPreviewMode: false,
        
        isRendering: false,
        lastRenderTime: 0,
        pendingUpdates: [],
        
        isOnline: true,
        pendingSync: false,
        offlineChanges: [],
        
        lastError: null,
        recoveryAvailable: false,
        recoveryState: null,
        
        // Page Actions
        setPage: (page) => {
          set((state) => {
            state.page = page;
            state.isDraft = false;
            state.hasUnsavedChanges = false;
            state.changes = [];
          });
        },
        
        updateField: (sectionId, blockId, fieldId, value) => {
          const state = get();
          
          set((draft) => {
            const section = draft.page?.sections.find(s => s.id === sectionId);
            if (!section) return;
            
            const block = section.blocks.find(b => b.id === blockId);
            if (!block) return;
            
            const field = block.fields[fieldId];
            if (!field) return;
            
            // Track change
            draft.changes.push({
              path: `${sectionId}.${blockId}.${fieldId}`,
              fieldLabel: field.label,
              before: field.value,
              after: value,
              timestamp: Date.now(),
            });
            
            // Update value
            field.value = value;
            
            // Mark as draft
            draft.isDraft = true;
            draft.hasUnsavedChanges = true;
            
            // Add to pending updates
            if (!draft.pendingUpdates.includes(blockId)) {
              draft.pendingUpdates.push(blockId);
            }
            
            // Highlight block
            draft.highlightedBlock = blockId;
          });
          
          // Add to history
          state.addHistoryEntry(
            `Update ${fieldId}`,
            state.page,
            get().page
          );
          
          // Save recovery point
          state.saveRecoveryPoint();
        },
        
        updateBlock: (sectionId, blockId, updates) => {
          set((draft) => {
            const section = draft.page?.sections.find(s => s.id === sectionId);
            if (!section) return;
            
            const block = section.blocks.find(b => b.id === blockId);
            if (!block) return;
            
            Object.assign(block, updates);
            draft.isDraft = true;
            draft.hasUnsavedChanges = true;
          });
        },
        
        updateSection: (sectionId, updates) => {
          set((draft) => {
            const section = draft.page?.sections.find(s => s.id === sectionId);
            if (!section) return;
            
            Object.assign(section, updates);
            draft.isDraft = true;
            draft.hasUnsavedChanges = true;
          });
        },
        
        // History Actions
        undo: () => {
          set((draft) => {
            if (draft.historyIndex <= 0) return;
            
            draft.historyIndex--;
            const entry = draft.history[draft.historyIndex];
            draft.page = entry.previousState;
            draft.hasUnsavedChanges = true;
          });
        },
        
        redo: () => {
          set((draft) => {
            if (draft.historyIndex >= draft.history.length - 1) return;
            
            draft.historyIndex++;
            const entry = draft.history[draft.historyIndex];
            draft.page = entry.currentState;
            draft.hasUnsavedChanges = true;
          });
        },
        
        addHistoryEntry: (action, previousState, currentState) => {
          set((draft) => {
            // Remove future history if we're not at the end
            if (draft.historyIndex < draft.history.length - 1) {
              draft.history = draft.history.slice(0, draft.historyIndex + 1);
            }
            
            // Add new entry
            draft.history.push({
              id: `${Date.now()}-${Math.random()}`,
              timestamp: Date.now(),
              action,
              previousState: JSON.parse(JSON.stringify(previousState)),
              currentState: JSON.parse(JSON.stringify(currentState)),
            });
            
            // Limit history size
            if (draft.history.length > draft.maxHistorySize) {
              draft.history = draft.history.slice(-draft.maxHistorySize);
            }
            
            draft.historyIndex = draft.history.length - 1;
          });
        },
        
        clearHistory: () => {
          set((draft) => {
            draft.history = [];
            draft.historyIndex = -1;
          });
        },
        
        // Save Actions
        save: async () => {
          const state = get();
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((draft) => {
            draft.isDraft = false;
            draft.hasUnsavedChanges = false;
            draft.lastSavedAt = new Date();
            draft.changes = [];
            
            if (draft.page?.metadata) {
              draft.page.metadata.lastModified = new Date().toISOString();
            }
          });
        },
        
        autoSave: async () => {
          const state = get();
          if (!state.hasUnsavedChanges) return;
          
          await new Promise(resolve => setTimeout(resolve, 200));
          
          set((draft) => {
            draft.lastAutoSaveAt = new Date();
          });
        },
        
        discardChanges: () => {
          set((draft) => {
            draft.isDraft = false;
            draft.hasUnsavedChanges = false;
            draft.changes = [];
            draft.history = [];
            draft.historyIndex = -1;
          });
        },
        
        // Validation
        validateField: (sectionId, blockId, fieldId) => {
          const state = get();
          const section = state.page?.sections.find(s => s.id === sectionId);
          const block = section?.blocks.find(b => b.id === blockId);
          const field = block?.fields[fieldId];
          
          if (!field || !field.validation) return true;
          
          let isValid = true;
          let error = '';
          
          for (const rule of field.validation) {
            switch (rule.type) {
              case 'required':
                if (!field.value || field.value === '') {
                  isValid = false;
                  error = rule.message;
                }
                break;
              case 'maxLength':
                if (field.value && field.value.length > rule.value) {
                  isValid = false;
                  error = rule.message;
                }
                break;
              case 'minLength':
                if (field.value && field.value.length < rule.value) {
                  isValid = false;
                  error = rule.message;
                }
                break;
              case 'custom':
                if (rule.validator && !rule.validator(field.value)) {
                  isValid = false;
                  error = rule.message;
                }
                break;
            }
            if (!isValid) break;
          }
          
          set((draft) => {
            const section = draft.page?.sections.find(s => s.id === sectionId);
            const block = section?.blocks.find(b => b.id === blockId);
            const field = block?.fields[fieldId];
            if (field) {
              field.isValid = isValid;
              field.error = error;
            }
          });
          
          return isValid;
        },
        
        validateBlock: (sectionId, blockId) => {
          const state = get();
          const section = state.page?.sections.find(s => s.id === sectionId);
          const block = section?.blocks.find(b => b.id === blockId);
          
          if (!block) return true;
          
          let allValid = true;
          
          for (const fieldId in block.fields) {
            if (!state.validateField(sectionId, blockId, fieldId)) {
              allValid = false;
            }
          }
          
          return allValid;
        },
        
        validateAll: () => {
          const state = get();
          if (!state.page) return true;
          
          let allValid = true;
          
          for (const section of state.page.sections) {
            for (const block of section.blocks) {
              if (!state.validateBlock(section.id, block.id)) {
                allValid = false;
              }
            }
          }
          
          return allValid;
        },
        
        // Selection
        selectSection: (sectionId) => {
          set((draft) => {
            draft.selectedSection = sectionId;
            draft.selectedBlock = null;
            draft.selectedField = null;
          });
        },
        
        selectBlock: (blockId) => {
          set((draft) => {
            draft.selectedBlock = blockId;
            draft.selectedField = null;
          });
        },
        
        selectField: (fieldId) => {
          set((draft) => {
            draft.selectedField = fieldId;
          });
        },
        
        highlightBlock: (blockId, duration = 2000) => {
          set((draft) => {
            draft.highlightedBlock = blockId;
          });
          
          if (blockId && duration > 0) {
            setTimeout(() => {
              set((draft) => {
                if (draft.highlightedBlock === blockId) {
                  draft.highlightedBlock = null;
                }
              });
            }, duration);
          }
        },
        
        // Multi-user
        addUser: (user) => {
          set((draft) => {
            if (!draft.activeUsers.find(u => u.id === user.id)) {
              draft.activeUsers.push(user);
            }
          });
        },
        
        removeUser: (userId) => {
          set((draft) => {
            draft.activeUsers = draft.activeUsers.filter(u => u.id !== userId);
          });
        },
        
        updateUserCursor: (userId, position) => {
          set((draft) => {
            const user = draft.activeUsers.find(u => u.id === userId);
            if (user) {
              user.cursorPosition = position;
            }
          });
        },
        
        // Offline
        setOnlineStatus: (isOnline) => {
          set((draft) => {
            draft.isOnline = isOnline;
            if (isOnline && draft.offlineChanges.length > 0) {
              draft.pendingSync = true;
            }
          });
        },
        
        syncOfflineChanges: async () => {
          const state = get();
          if (!state.isOnline || state.offlineChanges.length === 0) return;
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((draft) => {
            draft.offlineChanges = [];
            draft.pendingSync = false;
          });
        },
        
        // Recovery
        saveRecoveryPoint: () => {
          const state = get();
          
          try {
            localStorage.setItem(
              'editor-recovery',
              JSON.stringify({
                page: state.page,
                timestamp: Date.now(),
              })
            );
            
            set((draft) => {
              draft.recoveryAvailable = true;
              draft.recoveryState = state.page;
            });
          } catch (error) {
            console.error('Failed to save recovery point:', error);
          }
        },
        
        recoverFromCrash: () => {
          try {
            const recovery = localStorage.getItem('editor-recovery');
            if (recovery) {
              const { page, timestamp } = JSON.parse(recovery);
              
              // Only recover if less than 1 hour old
              if (Date.now() - timestamp < 3600000) {
                set((draft) => {
                  draft.page = page;
                  draft.hasUnsavedChanges = true;
                  draft.recoveryAvailable = false;
                });
              }
            }
          } catch (error) {
            console.error('Failed to recover:', error);
          }
        },
      }))
    ),
    { name: 'EditorStore' }
  )
);

// ============================================
// SELECTORS
// ============================================

export const selectCurrentSection = (state: EditorState) => 
  state.page?.sections.find(s => s.id === state.selectedSection);

export const selectCurrentBlock = (state: EditorState) => {
  const section = selectCurrentSection(state);
  return section?.blocks.find(b => b.id === state.selectedBlock);
};

export const selectHasUnsavedChanges = (state: EditorState) => 
  state.hasUnsavedChanges;

export const selectCanUndo = (state: EditorState) => 
  state.historyIndex > 0;

export const selectCanRedo = (state: EditorState) => 
  state.historyIndex < state.history.length - 1;
