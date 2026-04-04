export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'import';

export interface ModulePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
  import: boolean;
}

export type PermissionMap = Record<string, ModulePermission>;

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: PermissionMap;
  is_system?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserWithRole {
  id: string;
  full_name: string;
  email: string;
  role_id: string;
  role?: Role;
  permissions?: PermissionMap; // Flattened or derived permissions
}

export const DEFAULT_MODULE_PERMISSION: ModulePermission = {
  view: false,
  create: false,
  edit: false,
  delete: false,
  approve: false,
  export: false,
  import: false,
};

export const FULL_MODULE_PERMISSION: ModulePermission = {
  view: true,
  create: true,
  edit: true,
  delete: true,
  approve: true,
  export: true,
  import: true,
};
