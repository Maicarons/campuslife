# CampusLife — 校园生活一站式工作站

Tauri v2 桌面应用 + Vue 3 前端 + FastAPI Python 后端。

## Project

- **Frontend**: Vue 3.5 + TypeScript 6 + Vite 8 + Element Plus 2 + Pinia 3 + UnoCSS
- **Desktop shell**: Tauri v2 (Rust), 入口 `src-tauri/src/main.rs` → `lib.rs`
- **Backend**: FastAPI (Python ≥3.11), 入口 `server/app/main.py`, SQLAlchemy 2.0 ORM + SQLite
- **Entry**: `src/main.ts` (前端), `server/app/main.py` (后端), `src-tauri/src/main.rs` (桌面)

## Commands

| 用途 | 命令 |
|------|------|
| 前端开发 | `npm run dev` (Vite, port 5173) |
| 前端构建 | `npm run build` (vue-tsc -b && vite build) |
| 预览构建 | `npm run preview` |
| 单元/组件测试 | `npm run test` (vitest run) |
| 测试 + 监听 | `npm run test:watch` |
| E2E 测试 | `npm run test:e2e` (Playwright) |
| 类型检查 | `npm run type-check` (vue-tsc --noEmit) |
| Lint | `npm run lint` / `npm run lint:fix` |
| 格式化 | `npm run format` (Prettier) |
| Tauri 开发 | `cd src-tauri && cargo tauri dev` |
| Tauri 构建 | `cd src-tauri && cargo tauri build` |
| 后端运行 | `cd server && uvicorn app.main:app --reload --port 8000` |
| 后端测试 | `cd server && pytest` |

## Architecture

```
src/                    # Vue 前端
├── api/index.ts        # Axios 实例 + 所有 API 分组
├── router/index.ts     # 路由表 (登录 + 10 个功能模块)
├── stores/             # Pinia stores (12 个模块, composition style)
├── views/              # 页面视图 (每模块一个文件夹)
├── components/         # 可复用组件 (layout/, common/)
├── composables/        # 重导出所有 stores
├── types/index.ts      # 所有 TS 类型定义
├── utils/helpers.ts    # 工具函数
├── i18n/               # vue-i18n (zh-CN.json, en.json)
├── mock/data.ts        # 前端模拟数据
└── assets/styles/      # SCSS (tokens.scss 全局注入, base.scss)
server/                 # Python FastAPI 后端
├── app/main.py         # FastAPI 入口 + 路由注册
├── app/core/           # 配置 (config.py), JWT 安全 (security.py)
├── app/models/         # SQLAlchemy 模型
├── app/schemas/        # Pydantic schemas
├── app/api/v1/         # API 路由
└── app/database.py     # DB 引擎 + session
src-tauri/              # Tauri (Rust) 桌面壳
└── src/lib.rs          # Tauri Builder (仅 log plugin)
```

10 个功能模块：助手(AI)、学业管理、校园信息、财务管理、失物招领、二手市场、问答广场、社交通讯、健康管理、志愿公益。每个模块有对应的 view、store、路由和 API。

## Conventions

- **Composition API**: `.vue` 用 `<script setup lang="ts">`，Pinia stores 用 `defineStore('name', () => { ... })` composition 写法。
- **无分号、单引号**: Prettier — `semi: false`, `singleQuote: true`, trailing commas `es5`, printWidth 100。
- **路径别名**: `@/` → `src/`, 在 tsconfig 和 vite 中配置。
- **Auto-import**: `vue`, `vue-router`, `pinia`, `@vueuse/core` 自动导入。Element Plus 组件自动注册。
- **localStorage 键前缀**: `campuslife-`（如 `campuslife-token`, `campuslife-dark`, `campuslife-lang`）。
- **API 错误处理**: 401 → 清除 token → 重定向 `/login`。Token 通过 `Authorization: Bearer <token>` 头发送。
- **ESLint**: `no-explicit-any` warn, 未用变量以 `_` 前缀忽略, `no-console` warn（允许 warn/error）。
- **SCSS**: `tokens.scss` 通过 vite 全局注入 (`@use "@/assets/styles/tokens.scss" as *;`)。
- **测试**: `tests/unit/` (单元), `tests/component/` (组件), `tests/e2e/` (端到端)。happy-dom 环境。
- **i18n**: 中文为主 (`zh-CN`), 英文为 `en`。新文案两边都要加。

## Notes

(留空 — 后续快速补充)
