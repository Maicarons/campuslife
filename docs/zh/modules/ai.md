# AI 中枢

## 概览

AI 中枢是 CampusLife 的核心智能层，为所有模块提供 AI 能力。

## 核心功能

### 🗣️ AI 助手
对话式交互，支持多轮对话，整合所有模块数据，SSE 流式实时响应。

### 🤖 Agent 系统
自主执行任务，多步推理，可操作文件、调用 API、执行代码。

### 🧩 Skill 库
可复用的技能模板，支持用户创建和社区共享，有 Skill 市场。

### 🔌 MCP 库
Model Context Protocol 工具集成，连接外部服务和数据源。

### 📚 上下文管理
智能压缩长对话，保留关键信息，支持消息钉住。

### 🔍 RAG 检索
基于校园知识库的检索增强问答。

## AI 配置

支持两种模式：
1. **平台 API** — 使用平台提供的 API，需消耗积分
2. **自定义 API** — 用户配置 OpenAI 兼容接口（支持 OpenAI / DeepSeek / 通义千问 / Ollama 等）

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/ai/conversations` | 会话列表 |
| POST | `/api/v1/ai/conversations` | 创建会话 |
| GET | `/api/v1/ai/conversations/:id` | 会话详情 |
| DELETE | `/api/v1/ai/conversations/:id` | 删除会话 |
| POST | `/api/v1/ai/chat` | 发送消息（非流式） |
| POST | `/api/v1/ai/chat/stream` | 发送消息（SSE 流式） |
| GET | `/api/v1/ai/skills` | Skill 列表 |
| GET | `/api/v1/ai/skills/market` | Skill 市场 |
| POST | `/api/v1/ai/mcp` | 添加 MCP 连接 |
| POST | `/api/v1/ai/rag/search` | RAG 向量检索 |
| POST | `/api/v1/ai/agent/execute` | 执行 Agent 任务 |
| GET | `/api/v1/ai/models` | 可用模型列表 |
