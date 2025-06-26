import { eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { mits } from '../db/schema.js';
import type { Mit, NewMit } from '../db/schema.js';

export const mitService = {
  create: async (
    description: string,
    order: number | undefined,
    date: string,
  ): Promise<Mit[]> => {
    // If order is not provided, calculate the next sequential number
    let finalOrder = order;
    if (finalOrder === undefined) {
      const existingMits = await db
        .select()
        .from(mits)
        .where(eq(mits.date, date))
        .orderBy(mits.order);
      
      // Find the highest order number and add 1, or start with 1
      finalOrder = existingMits.length > 0 
        ? Math.max(...existingMits.map(m => m.order)) + 1 
        : 1;
    }
    
    return db.insert(mits).values({ description, order: finalOrder, date }).returning();
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
