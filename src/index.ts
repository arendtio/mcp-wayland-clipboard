#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { spawn } from 'node:child_process';
import which from 'which';
import { z } from 'zod';

async function main() {
  // Startup-Validation: Check if wl-copy is available
  const wlCopyPath = await which('wl-copy').catch(() => null);
  if (!wlCopyPath) {
    console.error('Error: wl-copy not found in PATH. Please install wl-clipboard.');
    process.exit(1);
  }

  // Create MCP server
  const server = new McpServer({
    name: 'wayland-clipboard',
    version: '1.0.0',
  });

  // Register tool for copying to clipboard
  server.registerTool(
    'copy_to_clipboard',
    {
      title: 'Copy to Clipboard',
      description: 'Copy text to the Wayland clipboard using wl-copy',
      inputSchema: {
        text: z.string().describe('Text to copy to clipboard'),
      },
      outputSchema: {
        success: z.boolean(),
        message: z.string(),
      },
    },
    async ({ text }) => {
      try {
        await new Promise<void>((resolve, reject) => {
          const process = spawn(wlCopyPath, [], {
            stdio: ['pipe', 'ignore', 'ignore'],
          });

          process.stdin.write(text, 'utf8');
          process.stdin.end();

          process.on('close', (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`wl-copy exited with code ${code}`));
            }
          });

          process.on('error', (error) => {
            reject(error);
          });
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: 'Text copied to clipboard',
              }),
            },
          ],
          structuredContent: {
            success: true,
            message: 'Text copied to clipboard',
          },
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    },
  );

  // Connect to stdio transport and start server
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

