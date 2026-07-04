# AI API

## Conversations

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/ai/conversations` | List conversations |
| POST | `/api/v1/ai/conversations` | Create conversation |
| GET | `/api/v1/ai/conversations/:id` | Get conversation (with messages) |
| PUT | `/api/v1/ai/conversations/:id` | Update (title/pin) |
| DELETE | `/api/v1/ai/conversations/:id` | Delete conversation |
| POST | `/api/v1/ai/conversations/:id/branch` | Branch from a message |

## Chat

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/ai/chat` | Send message (non-streaming) |
| POST | `/api/v1/ai/chat/stream` | Send message (SSE streaming) |
| POST | `/api/v1/ai/messages/:id/regenerate` | Regenerate response |

**Chat Body:**

```json
{
  "conversation_id": 1,
  "content": "帮我分析一下这学期的成绩趋势",
  "model": "gpt-4o",
  "stream": true
}
```

## Skills

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/ai/skills` | My skills |
| GET | `/api/v1/ai/skills/market` | Skill marketplace |
| POST | `/api/v1/ai/skills` | Create skill |
| PUT | `/api/v1/ai/skills/:id` | Update skill |
| DELETE | `/api/v1/ai/skills/:id` | Delete skill |
| POST | `/api/v1/ai/skills/:id/install` | Install skill |
| POST | `/api/v1/ai/skills/:id/rate` | Rate skill |

## MCP (Model Context Protocol)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/ai/mcp` | List MCP connections |
| POST | `/api/v1/ai/mcp` | Add connection |
| PUT | `/api/v1/ai/mcp/:id` | Update connection |
| DELETE | `/api/v1/ai/mcp/:id` | Delete connection |
| POST | `/api/v1/ai/mcp/:id/test` | Test connection |
| GET | `/api/v1/ai/mcp/:id/tools` | Get available tools |

## RAG

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/ai/rag/search` | Vector search |
| POST | `/api/v1/ai/rag/index` | Index document |
| GET | `/api/v1/ai/rag/sources` | Indexed data sources |

## Agent

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/ai/agent/execute` | Execute agent task |
| POST | `/api/v1/ai/agent/execute/stream` | Execute (streaming) |
| GET | `/api/v1/ai/agent/tools` | Available tools |

## Models

```
GET /api/v1/ai/models
```

Returns list of available AI models.
