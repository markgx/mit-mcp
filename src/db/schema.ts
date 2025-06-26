import { randomUUID } from 'crypto';

import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const mits = sqliteTable('mits', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  description: text('description').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  order: integer('order').notNull(),
  date: text('date').notNull(), // Format: YYYY-MM-DD
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date().toISOString()),
});

export type Mit = typeof mits.$inferSelect;
export type NewMit = typeof mits.$inferInsert;
