# AI 中枢

## 概览

AI 中枢是 CampusLife 的核心智能层，为所有模块提供 AI 能力。

## 核心功能

### 🗣️ AI 助手

| 特性 | 说明 |
|------|------|
| **交互方式** | 对话式，支持多轮对话 |
| **数据感知** | 整合所有模块数据，上下文感知 |
| **流式输出** | SSE 流式实时响应 |
| **会话管理** | 创建/删除/重命名会话，消息分叉 |

### 🤖 Agent 系统

| 特性 | 说明 |
|------|------|
| **自主执行** | 多步推理，自主完成复杂任务 |
| **工具调用** | 可操作文件、调用 API、执行代码 |
| **流式执行** | 实时展示执行过程 |

### 🧩 Skill 库

| 特性 | 说明 |
|------|------|
| **功能** | 可复用的技能模板 |
| **来源** | 用户创建 / 社区共享 |
| **市场** | Skill 市场，支持评分和安装 |

**Skill 示例：** 论文助手、翻译、课程答疑、简历生成

### 🔌 MCP 库

| 特性 | 说明 |
|------|------|
| **协议** | Model Context Protocol |
| **功能** | 连接外部服务和数据源 |
| **管理** | 添加/测试/删除连接，获取工具列表 |

### 📚 上下文管理

| 特性 | 说明 |
|------|------|
| **智能压缩** | 长对话自动压缩，保留关键信息 |
| **Token 统计** | 实时 Token 用量统计 |
| **消息钉住** | 钉住重要消息不被压缩 |

### 🔍 RAG 检索

| 特性 | 说明 |
|------|------|
| **功能** | 基于校园知识库的检索增强问答 |
| **索引** | 支持文档索引 |
| **向量检索** | 语义搜索已索引内容 |

### ✍️ AI 写作

| 特性 | 说明 |
|------|------|
| **功能** | 论文辅助、翻译、摘要、改写 |
| **模板** | 多种写作模板 |

## AI 配置方式

用户可选择两种模式：

### 模式 1：平台 API

使用平台提供的 API，需消耗积分。

### 模式 2：自定义 API（推荐）

用户配置自己的 OpenAI 兼容接口：

```
API Base URL: https://api.example.com/v1
API Key:      sk-***
模型名称:     gpt-4o
```

**支持的兼容接口：** OpenAI / DeepSeek / 通义千问 / 本地 Ollama 等

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/ai/conversations` | 会话列表 |
| POST | `/api/v1/ai/conversations` | 创建会话 |
| GET | `/api/v1/ai/conversations/:id` | 会话详情 |
| DELETE | `/api/v1/ai/conversations/:id` | 删除会话 |
| POST | `/api/v1/ai/chat` | 发送消息（非流式） |
| POST | `/api/v1/ai/chat/stream` | 发送消息（SSE 流式） |
| POST | `/api/v1/ai/conversations/:id/branch` | 消息分叉 |
| POST | `/api/v1/ai/messages/:id/regenerate` | 重新生成 |
| GET | `/api/v1/ai/skills` | Skill 列表 |
| GET | `/api/v1/ai/skills/market` | Skill 市场 |
| POST | `/api/v1/ai/skills` | 创建 Skill |
| GET | `/api/v1/ai/mcp` | MCP 连接列表 |
| POST | `/api/v1/ai/mcp` | 添加 MCP 连接 |
| POST | `/api/v1/ai/mcp/:id/test` | 测试 MCP 连接 |
| POST | `/api/v1/ai/rag/search` | RAG 向量检索 |
| POST | `/api/v1/ai/rag/index` | 索引文档 |
| POST | `/api/v1/ai/agent/execute` | 执行 Agent 任务 |
| GET | `/api/v1/ai/models` | 可用模型列表 |
