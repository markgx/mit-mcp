import { eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { mits } from '../db/schema.js';
import type { Mit, NewMit } from '../db/schema.js';

// Get the maximum number of MITs allowed per day from environment variable
// Default to 3 if not set or invalid
const MAX_MITS_PER_DAY = Math.max(
  1,
  parseInt(process.env.MAX_MITS_PER_DAY || '3', 10) || 3,
);

export const mitService = {
  create: async (
    description: string,
    order: number | undefined,
    date: string,
  ): Promise<Mit[]> => {
    // Validate that the date is today or in the future
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      throw new Error(
        'Cannot create MITs for past dates. Only today or future dates are allowed.',
      );
    }

    // Check if there are already max number of MITs for this date
    const existingMits = await db
      .select()
      .from(mits)
      .where(eq(mits.date, date))
      .orderBy(mits.order);

    if (existingMits.length >= MAX_MITS_PER_DAY) {
      throw new Error(
        `Daily limit of ${MAX_MITS_PER_DAY} MITs reached for ${date}.`,
      );
    }

    // If order is not provided, calculate the next sequential number
    let finalOrder = order;
    if (finalOrder === undefined) {
      // Find the highest order number and add 1, or start with 1
      finalOrder =
        existingMits.length > 0
          ? Math.max(...existingMits.map(m => m.order)) + 1
          : 1;
    }

    return db
      .insert(mits)
      .values({ description, order: finalOrder, date })
      .returning();
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
