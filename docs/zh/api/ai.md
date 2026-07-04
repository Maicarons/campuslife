# AI 服务 API

## 会话管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/ai/conversations` | 会话列表 |
| POST | `/api/v1/ai/conversations` | 创建会话 |
| GET | `/api/v1/ai/conversations/:id` | 会话详情（含消息） |
| DELETE | `/api/v1/ai/conversations/:id` | 删除会话 |
| POST | `/api/v1/ai/conversations/:id/branch` | 消息分叉 |

## 聊天

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/ai/chat` | 发送消息（非流式） |
| POST | `/api/v1/ai/chat/stream` | 发送消息（SSE 流式） |
| POST | `/api/v1/ai/messages/:id/regenerate` | 重新生成 |

## Skill 管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/ai/skills` | Skill 列表 |
| GET | `/api/v1/ai/skills/market` | Skill 市场 |
| POST | `/api/v1/ai/skills` | 创建 Skill |
| POST | `/api/v1/ai/skills/:id/install` | 安装 Skill |

## MCP 连接

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/ai/mcp` | 连接列表 |
| POST | `/api/v1/ai/mcp` | 添加连接 |
| POST | `/api/v1/ai/mcp/:id/test` | 测试连接 |

## RAG / Agent

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/ai/rag/search` | 向量检索 |
| POST | `/api/v1/ai/rag/index` | 索引文档 |
| POST | `/api/v1/ai/agent/execute` | 执行 Agent 任务 |
| GET | `/api/v1/ai/models` | 可用模型列表 |
