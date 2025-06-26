import { eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { tasks } from '../db/schema.js';
import type { Task, NewTask } from '../db/schema.js';

export const taskService = {
  create: async (
    description: string,
    order: number,
    date: string,
  ): Promise<Task[]> => {
    return db.insert(tasks).values({ description, order, date }).returning();
  },

  findAll: async (): Promise<Task[]> => {
    return db.select().from(tasks).orderBy(tasks.order);
  },

  findByDate: async (date: string): Promise<Task[]> => {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.date, date))
      .orderBy(tasks.order);
  },

  update: async (
    id: string,
    data: Partial<Omit<NewTask, 'id'>>,
  ): Promise<Task[]> => {
    return db.update(tasks).set(data).where(eq(tasks.id, id)).returning();
  },

  delete: async (id: string): Promise<Task[]> => {
    return db.delete(tasks).where(eq(tasks.id, id)).returning();
  },
};
