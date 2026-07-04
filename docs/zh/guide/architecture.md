# 系统架构

## 整体架构

CampusLife 采用前后端分离架构，前端通过 HTTP/WebSocket 与后端通信。

```
┌──────────────────────────────────────────────────────┐
│                     客户端层                           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  Web 前端     │  │  Tauri 桌面端 │  │ Android    │  │
│  │  Vue 3 + EP   │  │  Rust + WV2  │  │ Capacitor  │  │
│  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │
│         └─────────────────┼────────────────┘          │
├───────────────────────────┼───────────────────────────┤
│                           ▼                           │
│              FastAPI 后端 (server/)                     │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Auth    │ │ API     │ │WebSocket │ │ AI Proxy  │  │
│  │ (JWT)   │ │ (REST)  │ │(实时通知)│ │(OpenAI)   │  │
│  └─────────┘ └─────────┘ └──────────┘ └───────────┘  │
├───────────────────────────────────────────────────────┤
│              数据层                                     │
│  ┌────────────────┐  ┌──────────────────────────────┐ │
│  │ SQLite / MySQL  │  │ 本地文件存储 (uploads/)       │ │
│  └────────────────┘  └──────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

## 前端架构 (`src/`)

```
src/
├── api/index.ts        # Axios 实例 + 所有 API 分组
├── router/index.ts     # 路由表 (登录 + 10 个功能模块)
├── stores/             # Pinia stores (12 个模块)
├── views/              # 页面视图 (每模块一个文件夹)
├── components/         # 可复用组件 (layout/, common/)
├── composables/        # 重导出所有 stores
├── types/index.ts      # TypeScript 类型定义
├── utils/helpers.ts    # 工具函数
├── i18n/               # 国际化 (zh-CN, en)
├── mock/data.ts        # 前端模拟数据
└── assets/styles/      # SCSS (tokens.scss, base.scss)
```

## 后端架构 (`server/`)

```
server/
├── app/
│   ├── main.py         # FastAPI 入口 + 路由注册
│   ├── database.py     # SQLAlchemy 引擎 + Session
│   ├── core/           # 配置 (config.py), JWT (security.py)
│   ├── models/         # SQLAlchemy 模型
│   ├── schemas/        # Pydantic schemas
│   ├── api/v1/         # API 路由 (auth/org/academics/campus/ai)
│   └── services/       # 业务逻辑层
├── tests/              # 后端测试
├── pyproject.toml      # Python 依赖
└── .env.example        # 环境变量模板
```

## 10 大功能模块

| # | 模块 | 路由路径 | 对应 Store |
|---|------|---------|-----------|
| 1 | AI 助手 | `/assistant` | `useAssistantStore` |
| 2 | 学业管理 | `/academics` | `useAcademicsStore` |
| 3 | 校园信息 | `/campus` | `useCampusStore` |
| 4 | 财务管理 | `/finance` | `useFinanceStore` |
| 5 | 失物招领 | `/lost-found` | `useLostFoundStore` |
| 6 | 二手市场 | `/marketplace` | `useMarketplaceStore` |
| 7 | 问答广场 | `/qa` | `useQAStore` |
| 8 | 社交通讯 | `/social` | `useSocialStore` |
| 9 | 健康管理 | `/health` | `useHealthStore` |
| 10 | 志愿公益 | `/volunteer` | `useVolunteerStore` |

## 认证流程

```
登录 → 服务端返回 JWT Token
     → 前端存储到 localStorage('campuslife-token')
     → 每次请求通过 Authorization: Bearer <token> 发送
     → 401 响应 → 清除 token → 重定向 /login
```

## 数据同步策略

- **上传数据** — 用户选择范围 (scope) → 对应层级管理员审核 → 通过后同步到该范围所有用户
- **离线优先** — 本地缓存已同步数据，离线可读写，联网时双向同步
- **冲突检测** — 基于 timestamp + version 字段，Last-Write-Wins 策略
