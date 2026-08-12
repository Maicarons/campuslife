# AI Hub

## Overview

The AI Hub is CampusLife's core intelligence layer, providing AI capabilities to every module.

## Core features

### AI Assistant

Conversational interaction with multi-turn dialogue, integrated across all module data, with SSE streaming responses.

### Agent System

Autonomously executes tasks with multi-step reasoning; can operate files, call APIs, and run code.

### Skill Library

Reusable skill templates; users can create and share them via a Skill Marketplace.

### MCP Library

Model Context Protocol tool integration, connecting external services and data sources.

### Context Management

Intelligently compresses long conversations, keeps key information, and supports pinning messages.

### RAG Retrieval

Retrieval-augmented Q&A over the campus knowledge base.

## AI configuration

Two modes are supported:

1. **Platform API** - uses the platform-provided API (consumes points).
2. **Custom API** - the user configures an OpenAI-compatible endpoint (OpenAI / DeepSeek / Qwen / Ollama, etc.).

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/ai/conversations | List conversations |
| POST | /api/v1/ai/conversations | Create a conversation |
| GET | /api/v1/ai/conversations/:id | Conversation detail |
| DELETE | /api/v1/ai/conversations/:id | Delete a conversation |
| POST | /api/v1/ai/chat | Send a message (non-streaming) |
| POST | /api/v1/ai/chat/stream | Send a message (SSE streaming) |
| GET | /api/v1/ai/skills | List skills |
| GET | /api/v1/ai/skills/market | Skill marketplace |
| POST | /api/v1/ai/mcp | Add an MCP connection |
| POST | /api/v1/ai/rag/search | RAG vector search |
| POST | /api/v1/ai/agent/execute | Execute an Agent task |
| GET | /api/v1/ai/models | List available models |
