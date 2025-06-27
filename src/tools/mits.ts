import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { mitService } from '../services/mitService.js';

export function registerMitsTool(server: McpServer) {
  server.registerTool(
    'list_mits',
    {
      title: 'List MITs for today or a specific date',
      description: 'List MITs for today or a specific date',
      inputSchema: z.object({
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
          .optional(),
      }).shape,
    },
    async ({ date }) => {
      try {
        // If no date provided, use today's date
        const targetDate = date || new Date().toISOString().split('T')[0];
        const mits = await mitService.findByDate(targetDate);
        return {
          content: [{ type: 'text', text: JSON.stringify(mits, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error listing MITs: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'create_mit',
    {
      title: 'Create a new MIT',
      description: 'Create a new MIT',
      inputSchema: z.object({
        description: z.string().min(1, 'Description is required'),
        order: z.number().int().min(1, 'Order must be at least 1').optional(),
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
          .optional(),
      }).shape,
    },
    async ({ description, order, date }) => {
      try {
        // If no date provided, use today's date
        const targetDate = date || new Date().toISOString().split('T')[0];
        const [mit] = await mitService.create(description, order, targetDate);
        return {
          content: [{ type: 'text', text: JSON.stringify(mit, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating MIT: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'update_mit',
    {
      title: 'Update a MIT',
      description: 'Update a MIT',
      inputSchema: z.object({
        id: z.string().uuid('Invalid MIT ID format'),
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
        const [mit] = await mitService.update(id, data);
        if (!mit) {
          return {
            content: [{ type: 'text', text: `MIT with ID ${id} not found` }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(mit, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating MIT: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    'delete_mit',
    {
      title: 'Delete a MIT',
      description: 'Delete a MIT',
      inputSchema: z.object({
        id: z.string().uuid('Invalid MIT ID format'),
      }).shape,
    },
    async ({ id }) => {
      try {
        const [mit] = await mitService.delete(id);
        if (!mit) {
          return {
            content: [{ type: 'text', text: `MIT with ID ${id} not found` }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: `Deleted MIT: ${mit.id}` }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting MIT: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
