import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const CreateMitSchema = z.object({
  name: z.string().describe('Name for the new MIT'),
});

export const registerCreateMitTool = (server: McpServer) => {
  server.tool(
    'create-mit',
    'Create a new MIT',
    CreateMitSchema.shape,
    async params => {
      return {
        content: [
          {
            type: 'text',
            text: `Created MIT: ${params.name}`,
          },
        ],
      };
    },
  );
};
