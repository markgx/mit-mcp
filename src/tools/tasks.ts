import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { taskService } from '../services/database.js';

export function registerTasksTool(server: McpServer) {
  server.registerTool(
    'list_tasks',
    {
      title: 'List all tasks or tasks for a specific date',
      description: 'List all tasks or tasks for a specific date',
      inputSchema: z.object({
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
          .optional(),
      }).shape,
    },
    async ({ date }) => {
      try {
        const tasks = date
          ? await taskService.findByDate(date)
          : await taskService.findAll();
        return {
          content: [{ type: 'text', text: JSON.stringify(tasks, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error listing tasks: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'create_task',
    {
      title: 'Create a new task',
      description: 'Create a new task',
      inputSchema: z.object({
        description: z.string().min(1, 'Description is required'),
        order: z.number().int().min(0, 'Order must be non-negative'),
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
      }).shape,
    },
    async ({ description, order, date }) => {
      try {
        const [task] = await taskService.create(description, order, date);
        return {
          content: [{ type: 'text', text: JSON.stringify(task, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating task: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'update_task',
    {
      title: 'Update a task',
      description: 'Update a task',
      inputSchema: z.object({
        id: z.string().uuid('Invalid task ID format'),
        description: z.string().min(1).optional(),
        completed: z.boolean().optional(),
        order: z.number().int().min(0).optional(),
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
      }).shape,
    },
    async ({ id, ...data }) => {
      try {
        const [task] = await taskService.update(id, data);
        if (!task) {
          return {
            content: [{ type: 'text', text: `Task with ID ${id} not found` }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(task, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating task: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'delete_task',
    {
      title: 'Delete a task',
      description: 'Delete a task',
      inputSchema: z.object({
        id: z.string().uuid('Invalid task ID format'),
      }).shape,
    },
    async ({ id }) => {
      try {
        const [task] = await taskService.delete(id);
        if (!task) {
          return {
            content: [{ type: 'text', text: `Task with ID ${id} not found` }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: `Deleted task: ${task.id}` }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting task: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
