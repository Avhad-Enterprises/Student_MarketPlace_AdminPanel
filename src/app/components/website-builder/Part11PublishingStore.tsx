/**
 * PART 11: STATE MANAGEMENT FOUNDATION
 * Publishing Store - Manages draft vs published states
 * 
 * This store provides:
 * - Draft/Preview/Live state management
 * - Publishing workflow
 * - Version comparison
 * - Rollback functionality
 * - Publishing history
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { Section, PageVersion } from './types';

// ============================================
// TYPES
// ============================================

export type Environment = 'draft' | 'preview' | 'live';

export interface PublishingState {
  // Current Environment
  currentEnvironment: Environment;
  
  // States
  draftSections: Section[];
  publishedSections: Section[];
  
  // Versions
  versions: PageVersion[];
  currentVersionId: string | null;
  
  // Publishing Status
  isPublishing: boolean;
  lastPublished: Date | null;
  publishedBy: string | null;
  
  // Actions - Environment
  setEnvironment: (environment: Environment) => void;
  
  // Actions - Draft
  updateDraft: (sections: Section[]) => void;
  discardDraft: () => void;
  
  // Actions - Publishing
  publish: (publishedBy: string, notes?: string) => void;
  rollback: (versionId: string) => void;
  
  // Getters
  getCurrentSections: () => Section[];
  hasUnpublishedChanges: () => boolean;
  getVersionById: (versionId: string) => PageVersion | undefined;
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const usePublishingStore = create<PublishingState>()(
  persist(
    immer((set, get) => ({
      // Initial State
      currentEnvironment: 'draft',
      draftSections: [],
      publishedSections: [],
      versions: [],
      currentVersionId: null,
      isPublishing: false,
      lastPublished: null,
      publishedBy: null,

      // Environment Actions
      setEnvironment: (environment) => {
        set((state) => {
          state.currentEnvironment = environment;
        });
      },

      // Draft Actions
      updateDraft: (sections) => {
        set((state) => {
          state.draftSections = JSON.parse(JSON.stringify(sections)); // Deep clone
        });
      },

      discardDraft: () => {
        set((state) => {
          state.draftSections = JSON.parse(JSON.stringify(state.publishedSections));
        });
      },

      // Publishing Actions
      publish: (publishedBy, notes = '') => {
        set((state) => {
          state.isPublishing = true;
        });

        // Simulate async publishing
        setTimeout(() => {
          set((state) => {
            // Create new version
            const newVersion: PageVersion = {
              id: `version-${Date.now()}`,
              versionNumber: state.versions.length + 1,
              summary: notes || `Published by ${publishedBy}`,
              editorName: publishedBy,
              timestamp: new Date(),
              status: 'published',
              changes: [] // Would calculate changes here
            };

            // Update published state
            state.publishedSections = JSON.parse(JSON.stringify(state.draftSections));
            state.versions.unshift(newVersion);
            state.currentVersionId = newVersion.id;
            state.lastPublished = new Date();
            state.publishedBy = publishedBy;
            state.isPublishing = false;

            // Keep only last 20 versions
            if (state.versions.length > 20) {
              state.versions = state.versions.slice(0, 20);
            }
          });
        }, 1500);
      },

      rollback: (versionId) => {
        set((state) => {
          const version = state.versions.find(v => v.id === versionId);
          if (version) {
            // In a real implementation, would restore sections from version
            // For now, just update the current version
            state.currentVersionId = versionId;
          }
        });
      },

      // Getters
      getCurrentSections: () => {
        const state = get();
        switch (state.currentEnvironment) {
          case 'draft':
          case 'preview':
            return state.draftSections;
          case 'live':
            return state.publishedSections;
          default:
            return state.draftSections;
        }
      },

      hasUnpublishedChanges: () => {
        const state = get();
        return JSON.stringify(state.draftSections) !== JSON.stringify(state.publishedSections);
      },

      getVersionById: (versionId) => {
        return get().versions.find(v => v.id === versionId);
      }
    })),
    {
      name: 'publishing-storage',
      partialize: (state) => ({
        publishedSections: state.publishedSections,
        versions: state.versions,
        lastPublished: state.lastPublished,
        publishedBy: state.publishedBy
      })
    }
  )
);