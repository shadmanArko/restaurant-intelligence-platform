import {
  boolean,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('identity_users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  displayName: text('display_name').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const roles = pgTable('identity_roles', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const permissions = pgTable('identity_permissions', {
  id: uuid('id').primaryKey(),
  key: text('key').notNull().unique(),
  description: text('description').notNull(),
});

export const userRoles = pgTable(
  'identity_user_roles',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })],
);

export const rolePermissions = pgTable(
  'identity_role_permissions',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);

export const branchAccess = pgTable(
  'identity_branch_access',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    branchId: uuid('branch_id').notNull(),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.branchId, table.roleId] }),
  ],
);

export const identitySchema = {
  users,
  roles,
  permissions,
  userRoles,
  rolePermissions,
  branchAccess,
};
