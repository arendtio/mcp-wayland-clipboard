# mcp-wayland-clipboard

MCP server to write to the Wayland clipboard via `wl-copy`.

This Model Context Protocol (MCP) server allows AI models to copy text directly to your Wayland clipboard using the `wl-copy` command-line tool.

## Prerequisites

- Node.js (v18 or higher)
- `wl-copy` installed and available in PATH (usually provided by the `wl-clipboard` package)

### Installing wl-clipboard

On Arch Linux:
```bash
sudo pacman -S wl-clipboard
```

On Ubuntu/Debian:
```bash
sudo apt install wl-clipboard
```

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

This compiles the TypeScript source to JavaScript in the `dist/` directory.

## Usage

### Starting the server

After building, you can start the server using:

```bash
npx mcp-wayland-clipboard
```

Or directly with Node:

```bash
node dist/index.js
```

### Tool: `copy_to_clipboard`

The server provides a single tool called `copy_to_clipboard` that accepts a `text` parameter and copies it to your Wayland clipboard.

**Parameters:**
- `text` (string, required): The text to copy to the clipboard

**Returns:**
- Success: `{ success: true, message: "Text copied to clipboard" }`
- Error: `{ success: false, error: "error message" }`

### Example Use Case

A common use case is asking an AI to generate formulas or code snippets and have them automatically copied to your clipboard. For example:

> "Generate an Excel formula to sum cells A1 to A5 and copy it to my clipboard"

The AI can then call the `copy_to_clipboard` tool with the formula, and you can paste it directly into Excel.

## Configuration for MCP Clients

### Claude Desktop

Add the following to your Claude Desktop configuration file (typically located at `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `~/.config/Claude/claude_desktop_config.json` on Linux):

```json
{
  "mcpServers": {
    "wayland-clipboard": {
      "command": "npx",
      "args": ["-y", "mcp-wayland-clipboard"]
    }
  }
}
```

Or if you have the project installed locally:

```json
{
  "mcpServers": {
    "wayland-clipboard": {
      "command": "node",
      "args": ["/path/to/mcp-wayland-clipboard/dist/index.js"]
    }
  }
}
```

### Other MCP Clients

For other MCP clients, configure them to start the server using:
- Command: `npx` (or `node` if using local installation)
- Args: `["-y", "mcp-wayland-clipboard"]` (or `["/path/to/dist/index.js"]` for local)

## Error Handling

The server will exit with an error code if `wl-copy` is not found in your PATH during startup. Make sure `wl-clipboard` is installed before running the server.

## License

MIT
