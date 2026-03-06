/**
 * PART 11: STATE MANAGEMENT FOUNDATION
 * Theme Store - Manages all sections, blocks, and their content
 * 
 * This store provides:
 * - Complete theme state management
 * - Section CRUD operations
 * - Block CRUD operations
 * - Content editing
 * - Visibility toggles
 * - Section reordering
 * - Change tracking
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { Section, Block } from './types';
import { 
  Layout, 
  Image as ImageIcon, 
  Grid3x3, 
  Megaphone, 
  ShoppingCart, 
  MessageSquare, 
  Menu 
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface ThemeState {
  // Core Data
  sections: Section[];
  selectedSectionId: string | null;
  selectedBlockId: string | null;
  
  // Change Tracking
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  isDirty: boolean;
  
  // Actions - Sections
  addSection: (type: string, name: string, group: Section['group']) => void;
  removeSection: (sectionId: string) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  moveSectionUp: (sectionId: string) => void;
  moveSectionDown: (sectionId: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  selectSection: (sectionId: string | null) => void;
  
  // Actions - Blocks
  addBlock: (sectionId: string, block: Omit<Block, 'id'>) => void;
  removeBlock: (sectionId: string, blockId: string) => void;
  updateBlock: (sectionId: string, blockId: string, updates: Partial<Block>) => void;
  moveBlockUp: (sectionId: string, blockId: string) => void;
  moveBlockDown: (sectionId: string, blockId: string) => void;
  toggleBlockVisibility: (sectionId: string, blockId: string) => void;
  selectBlock: (blockId: string | null) => void;
  
  // Actions - Content
  updateBlockContent: (sectionId: string, blockId: string, content: any) => void;
  
  // Actions - Save Management
  markSaved: () => void;
  markDirty: () => void;
  
  // Actions - Reset
  resetToDefaults: () => void;
  clearAll: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const getInitialSections = (): Section[] => [
  {
    id: 'header-1',
    type: 'header',
    name: 'Header',
    icon: Menu,
    isRequired: true,
    isVisible: true,
    group: 'header',
    blocks: [
      {
        id: 'header-logo-1',
        type: 'image',
        name: 'Logo',
        icon: ImageIcon,
        isVisible: true,
        content: { url: 'https://via.placeholder.com/150x50?text=Logo', alt: 'Logo' }
      },
      {
        id: 'header-nav-1',
        type: 'list',
        name: 'Navigation',
        icon: Menu,
        isVisible: true,
        content: { items: ['Home', 'About', 'Services', 'Contact'] }
      }
    ]
  },
  {
    id: 'hero-1',
    type: 'hero',
    name: 'Hero Section',
    icon: Layout,
    isRequired: false,
    isVisible: true,
    group: 'content',
    blocks: [
      {
        id: 'hero-heading-1',
        type: 'heading',
        name: 'Main Heading',
        icon: ImageIcon,
        isVisible: true,
        content: { text: 'Welcome to Our Platform', level: 1 }
      },
      {
        id: 'hero-text-1',
        type: 'text',
        name: 'Subtitle',
        icon: ImageIcon,
        isVisible: true,
        content: { text: 'Build amazing experiences with our powerful tools' }
      },
      {
        id: 'hero-button-1',
        type: 'button',
        name: 'CTA Button',
        icon: ImageIcon,
        isVisible: true,
        content: { text: 'Get Started', url: '#', variant: 'primary' }
      }
    ]
  },
  {
    id: 'features-1',
    type: 'features',
    name: 'Features',
    icon: Grid3x3,
    isRequired: false,
    isVisible: true,
    group: 'content',
    blocks: [
      {
        id: 'features-heading-1',
        type: 'heading',
        name: 'Section Heading',
        icon: ImageIcon,
        isVisible: true,
        content: { text: 'Our Features', level: 2 }
      },
      {
        id: 'features-card-1',
        type: 'card',
        name: 'Feature 1',
        icon: ImageIcon,
        isVisible: true,
        content: { 
          title: 'Fast Performance', 
          description: 'Lightning fast load times',
          icon: '⚡'
        }
      },
      {
        id: 'features-card-2',
        type: 'card',
        name: 'Feature 2',
        icon: ImageIcon,
        isVisible: true,
        content: { 
          title: 'Secure', 
          description: 'Bank-level security',
          icon: '🔒'
        }
      },
      {
        id: 'features-card-3',
        type: 'card',
        name: 'Feature 3',
        icon: ImageIcon,
        isVisible: true,
        content: { 
          title: 'Easy to Use', 
          description: 'Intuitive interface',
          icon: '✨'
        }
      }
    ]
  },
  {
    id: 'footer-1',
    type: 'footer',
    name: 'Footer',
    icon: Layout,
    isRequired: true,
    isVisible: true,
    group: 'footer',
    blocks: [
      {
        id: 'footer-text-1',
        type: 'text',
        name: 'Copyright',
        icon: ImageIcon,
        isVisible: true,
        content: { text: '© 2025 Company Name. All rights reserved.' }
      },
      {
        id: 'footer-links-1',
        type: 'list',
        name: 'Footer Links',
        icon: Menu,
        isVisible: true,
        content: { items: ['Privacy', 'Terms', 'Contact'] }
      }
    ]
  }
];

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useThemeStore = create<ThemeState>()(
  persist(
    immer((set, get) => ({
      // Initial State
      sections: getInitialSections(),
      selectedSectionId: null,
      selectedBlockId: null,
      hasUnsavedChanges: false,
      lastSaved: null,
      isDirty: false,

      // Section Actions
      addSection: (type, name, group) => {
        set((state) => {
          const newSection: Section = {
            id: `${type}-${Date.now()}`,
            type,
            name,
            icon: Layout,
            isRequired: false,
            isVisible: true,
            group,
            blocks: []
          };
          
          // Add section in appropriate position based on group
          if (group === 'header') {
            state.sections.unshift(newSection);
          } else if (group === 'footer') {
            state.sections.push(newSection);
          } else {
            // Insert before footer
            const footerIndex = state.sections.findIndex(s => s.group === 'footer');
            if (footerIndex !== -1) {
              state.sections.splice(footerIndex, 0, newSection);
            } else {
              state.sections.push(newSection);
            }
          }
          
          state.hasUnsavedChanges = true;
          state.isDirty = true;
        });
      },

      removeSection: (sectionId) => {
        set((state) => {
          const index = state.sections.findIndex(s => s.id === sectionId);
          if (index !== -1 && !state.sections[index].isRequired) {
            state.sections.splice(index, 1);
            if (state.selectedSectionId === sectionId) {
              state.selectedSectionId = null;
            }
            state.hasUnsavedChanges = true;
            state.isDirty = true;
          }
        });
      },

      updateSection: (sectionId, updates) => {
        set((state) => {
          const section = state.sections.find(s => s.id === sectionId);
          if (section) {
            Object.assign(section, updates);
            state.hasUnsavedChanges = true;
            state.isDirty = true;
          }
        });
      },

      moveSectionUp: (sectionId) => {
        set((state) => {
          const index = state.sections.findIndex(s => s.id === sectionId);
          if (index > 0) {
            const temp = state.sections[index];
            state.sections[index] = state.sections[index - 1];
            state.sections[index - 1] = temp;
            state.hasUnsavedChanges = true;
            state.isDirty = true;
          }
        });
      },

      moveSectionDown: (sectionId) => {
        set((state) => {
          const index = state.sections.findIndex(s => s.id === sectionId);
          if (index !== -1 && index < state.sections.length - 1) {
            const temp = state.sections[index];
            state.sections[index] = state.sections[index + 1];
            state.sections[index + 1] = temp;
            state.hasUnsavedChanges = true;
            state.isDirty = true;
          }
        });
      },

      toggleSectionVisibility: (sectionId) => {
        set((state) => {
          const section = state.sections.find(s => s.id === sectionId);
          if (section) {
            section.isVisible = !section.isVisible;
            state.hasUnsavedChanges = true;
            state.isDirty = true;
          }
        });
      },

      selectSection: (sectionId) => {
        set((state) => {
          state.selectedSectionId = sectionId;
          state.selectedBlockId = null;
        });
      },

      // Block Actions
      addBlock: (sectionId, block) => {
        set((state) => {
          const section = state.sections.find(s => s.id === sectionId);
          if (section) {
            const newBlock: Block = {
              ...block,
              id: `${block.type}-${Date.now()}`
            };
            section.blocks.push(newBlock);
            state.hasUnsavedChanges = true;
            state.isDirty = true;
          }
        });
      },

      removeBlock: (sectionId, blockId) => {
        set((state) => {
          const section = state.sections.find(s => s.id === sectionId);
          if (section) {
            const index = section.blocks.findIndex(b => b.id === blockId);
            if (index !== -1) {
              section.blocks.splice(index, 1);
              if (state.selectedBlockId === blockId) {
                state.selectedBlockId = null;
              }
              state.hasUnsavedChanges = true;
              state.isDirty = true;
            }
          }
        });
      },

      updateBlock: (sectionId, blockId, updates) => {
        set((state) => {
          const section = state.sections.find(s => s.id === sectionId);
          if (section) {
            const block = section.blocks.find(b => b.id === blockId);
            if (block) {
              Object.assign(block, updates);
              state.hasUnsavedChanges = true;
              state.isDirty = true;
            }
          }
        });
      },

      moveBlockUp: (sectionId, blockId) => {
        set((state) => {
          const section = state.sections.find(s => s.id === sectionId);
          if (section) {
            const index = section.blocks.findIndex(b => b.id === blockId);
            if (index > 0) {
              const temp = section.blocks[index];
              section.blocks[index] = section.blocks[index - 1];
              section.blocks[index - 1] = temp;
              state.hasUnsavedChanges = true;
              state.isDirty = true;
            }
          }
        });
      },

      moveBlockDown: (sectionId, blockId) => {
        set((state) => {
          const section = state.sections.find(s => s.id === sectionId);
          if (section) {
            const index = section.blocks.findIndex(b => b.id === blockId);
            if (index !== -1 && index < section.blocks.length - 1) {
              const temp = section.blocks[index];
              section.blocks[index] = section.blocks[index + 1];
              section.blocks[index + 1] = temp;
              state.hasUnsavedChanges = true;
              state.isDirty = true;
            }
          }
        });
      },

      toggleBlockVisibility: (sectionId, blockId) => {
        set((state) => {
          const section = state.sections.find(s => s.id === sectionId);
          if (section) {
            const block = section.blocks.find(b => b.id === blockId);
            if (block) {
              block.isVisible = !block.isVisible;
              state.hasUnsavedChanges = true;
              state.isDirty = true;
            }
          }
        });
      },

      selectBlock: (blockId) => {
        set((state) => {
          state.selectedBlockId = blockId;
        });
      },

      // Content Actions
      updateBlockContent: (sectionId, blockId, content) => {
        set((state) => {
          const section = state.sections.find(s => s.id === sectionId);
          if (section) {
            const block = section.blocks.find(b => b.id === blockId);
            if (block) {
              block.content = { ...block.content, ...content };
              state.hasUnsavedChanges = true;
              state.isDirty = true;
            }
          }
        });
      },

      // Save Management
      markSaved: () => {
        set((state) => {
          state.hasUnsavedChanges = false;
          state.isDirty = false;
          state.lastSaved = new Date();
        });
      },

      markDirty: () => {
        set((state) => {
          state.hasUnsavedChanges = true;
          state.isDirty = true;
        });
      },

      // Reset Actions
      resetToDefaults: () => {
        set((state) => {
          state.sections = getInitialSections();
          state.selectedSectionId = null;
          state.selectedBlockId = null;
          state.hasUnsavedChanges = true;
          state.isDirty = true;
        });
      },

      clearAll: () => {
        set((state) => {
          state.sections = [];
          state.selectedSectionId = null;
          state.selectedBlockId = null;
          state.hasUnsavedChanges = true;
          state.isDirty = true;
        });
      }
    })),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        sections: state.sections,
        lastSaved: state.lastSaved
      })
    }
  )
);
