import React from 'react';

// Website Builder Types
export interface Section {
  id: string;
  type: string;
  name: string;
  icon: React.ElementType;
  isRequired: boolean;
  isVisible: boolean;
  group: 'header' | 'content' | 'footer';
  blocks: Block[];
}

export interface Block {
  id: string;
  type: string;
  name: string;
  icon: React.ElementType;
  isVisible: boolean;
  content: any;
}

export interface BlockType {
  id: string;
  type: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

export interface SectionType {
  id: string;
  type: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

// Collaboration Types
export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'invited';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  invitedAt?: Date;
}

// Activity & History Types
export type ActivityAction =
  'created' | 'updated' | 'deleted' | 'published' | 'restored' |
  'role_changed' | 'theme_changed' | 'content_updated' |
  'app_connected' | 'app_disconnected' | 'page_published' |
  'team_member_added' | 'team_member_removed';
export type VersionStatus = 'draft' | 'published' | 'archived';

export interface ActivityItem {
  id: string;
  user: string;
  userAvatar?: string;
  action: ActivityAction;
  actionLabel: string;
  target: string;
  targetType: 'page' | 'section' | 'block' | 'setting' | 'theme' | 'user';
  timestamp: Date;
  page?: string;
}

export interface PageVersion {
  id: string;
  versionNumber: number;
  summary: string;
  editorName: string;
  editorAvatar?: string;
  timestamp: Date;
  status: VersionStatus;
  changes: VersionChange[];
}

export interface VersionChange {
  type: 'added' | 'modified' | 'removed';
  target: string;
  sectionName?: string;
  before?: any;
  after?: any;
}

export interface PublishEvent {
  id: string;
  publishedBy: string;
  publishedByAvatar?: string;
  page: string;
  versionId: string;
  timestamp: Date;
}

export interface PageLock {
  pageId: string;
  userId: string;
  userName: string;
  timestamp: Date;
}
