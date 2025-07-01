# Most Important Tasks (MIT) MCP Server

MIT-MCP is a Model Context Protocol (MCP) server that enables AI agents to help you manage your daily [Most Important Tasks](https://zenhabits.net/purpose-your-day-most-important-task).

## Features

- **Daily Task Limits**: Enforces a configurable 3-task limit to maintain focus
- **Date-Based Organization**: Manage tasks by date
- **Persistent Storage**: SQLite database saves your task data

## Configuration

### Environment Variables

- `DATABASE_PATH`: Custom database location (optional, defaults to platform-specific data directory)
- `MAX_MITS_PER_DAY`: Maximum tasks per day (optional, defaults to 3)

### Default Database Locations

- **Linux**: `~/.local/share/mit-mcp/data.db`
- **macOS**: `~/Library/Application Support/mit-mcp/data.db`
- **Windows**: `%LOCALAPPDATA%\mit-mcp\data.db`

### MCP Client Configuration

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "servers": {
    "mit-mcp": {
      "command": "npx",
      "args": ["-y", "@markgx/mit-mcp"]
    }
  }
}
```

## Available Tools

### `list_mits`

List MITs for today or a specific date.

**Parameters:**

- `date` (optional): Date in YYYY-MM-DD format (defaults to today)

**Example:**

```json
{
  "tool": "list_mits",
  "parameters": {
    "date": "2024-12-20"
  }
}
```

### `create_mit`

Create a new MIT for today or a future date.

**Parameters:**

- `description` (required): Task description
- `order` (optional): Display order (auto-calculated if not provided)
- `date` (optional): Target date in YYYY-MM-DD format (defaults to today)

**Example:**

```json
{
  "tool": "create_mit",
  "parameters": {
    "description": "Buy kibble for Ace",
    "order": 1
  }
}
```

### `update_mit`

Update an existing MIT.

**Parameters:**

- `id` (required): MIT identifier
- `description` (optional): New description
- `completed` (optional): Completion status
- `order` (optional): New display order
- `date` (optional): New date (must be today or future)

**Example:**

```json
{
  "tool": "update_mit",
  "parameters": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "completed": true
  }
}
```

### `delete_mit`

Delete a MIT.

**Parameters:**

- `id` (required): MIT identifier

**Example:**

```json
{
  "tool": "delete_mit",
  "parameters": {
    "id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

## Usage Examples

### Starting Your Day

```
User: What are my MITs for today?
Assistant: Let me check your Most Important Tasks for today...

[Calls list_mits tool]

You have 2 MITs for today:
1. ☐ Buy kibble for Ace
2. ☐ Walk Ace to the park

You have room for 1 more MIT today. What's the most important thing you need to accomplish?
```

### Adding a Task

```
User: Add "Give Ace a bath" as my top MIT
Assistant: I'll add that as your top priority MIT for today.

[Calls create_mit tool with order: 1]

✓ Added "Give Ace a bath" as your #1 MIT for today.
You now have 3 MITs (your daily limit) - time to focus on execution!
```

### Completing Tasks

```
User: I gave Ace a bath
Assistant: Excellent! Let me mark that as complete.

[Calls update_mit tool with completed: true]

✓ "Give Ace a bath" is now complete!
You have 2 remaining MITs for today. Keep the momentum going!
```

## License

MIT License
