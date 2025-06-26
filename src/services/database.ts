import { eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { mits } from '../db/schema.js';
import type { Mit, NewMit } from '../db/schema.js';

export const mitService = {
  create: async (
    description: string,
    order: number,
    date: string,
  ): Promise<Mit[]> => {
    return db.insert(mits).values({ description, order, date }).returning();
  },

  findAll: async (): Promise<Mit[]> => {
    return db.select().from(mits).orderBy(mits.order);
  },

  findByDate: async (date: string): Promise<Mit[]> => {
    return db
      .select()
      .from(mits)
      .where(eq(mits.date, date))
      .orderBy(mits.order);
  },

  update: async (
    id: string,
    data: Partial<Omit<NewMit, 'id'>>,
  ): Promise<Mit[]> => {
    return db.update(mits).set(data).where(eq(mits.id, id)).returning();
  },

  delete: async (id: string): Promise<Mit[]> => {
    return db.delete(mits).where(eq(mits.id, id)).returning();
  },
};
