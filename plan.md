# CampusLife — 校园生活一站式工作站

## 总体架构

```
┌──────────────────────────────────────────────────────────────────────┐
│                           客户端 (Clients)                            │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  Web 前端     │  │  Admin 后台  │  │  桌面/移动端  │               │
│  │  (学生)      │  │  (管理员)    │  │  (Tauri/Cap) │               │
│  │  Vue 3 + EP  │  │  Vue 3 + EP  │  │  Vue 3 + EP  │               │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │
│         │                 │                 │                        │
│         │  ┌──────────────┴──────────┐      │                        │
│         │  │ DuckDB-WASM (本地存储)  │      │                        │
│         │  │ 离线可用 / 数据分析     │      │                        │
│         │  └─────────────────────────┘      │                        │
│         │                                   │                        │
│         └────────────┬──────────────────────┘                        │
│                      │ HTTP / WebSocket (在线时同步)                  │
├──────────────────────┼───────────────────────────────────────────────┤
│                      ▼                                               │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                    FastAPI 后端 (server/)                       │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │   │
│  │  │ Auth     │ │ API      │ │ WebSocket│ │ AI Proxy         │  │   │
│  │  │ (JWT)    │ │ (REST)   │ │ (实时)   │ │ (OpenAI 格式)    │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │   │
│  │  │ Sync     │ │ Storage  │ │ Points   │ │ OCR Service      │  │   │
│  │  │ (数据同步)│ │ (文件)   │ │ (积分)   │ │ (文字识别)       │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                      │                                               │
├──────────────────────┼───────────────────────────────────────────────┤
│                      ▼                                               │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                    数据层 (Data Layer)                          │   │
│  │  ┌──────────────┐  ┌────────────────────────────────────────┐ │   │
│  │  │ DuckDB (开发) │  │ MySQL 8 (生产)                        │ │   │
│  │  │ MySQL  (生产) │  │ 本地文件存储 (uploads/)               │ │   │
│  │  └──────────────┘  └────────────────────────────────────────┘ │   │
│  └───────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 组织架构 (Organization Hierarchy)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      组织层级结构                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  项目管理员 (super_admin) ← 最高权限，系统全局管理                    │
│       │                                                             │
│       ▼                                                             │
│  ┌─────────┐                                                        │
│  │  学校    │  ← 学校管理员 (school_admin)                           │
│  │ (school) │    审核: 全校共享数据 (食堂/校车/公告/活动)             │
│  └────┬────┘                                                        │
│       │                                                             │
│       ▼                                                             │
│  ┌─────────┐                                                        │
│  │  学院    │  ← 学院管理员 (college_admin)                          │
│  │(college) │    审核: 学院级数据 (奖学金/院级活动)                   │
│  └────┬────┘                                                        │
│       │                                                             │
│       ▼                                                             │
│  ┌─────────┐                                                        │
│  │  专业    │  ← 专业管理员 (major_admin)                            │
│  │ (major)  │    审核: 专业级数据 (课程/专业课考试)                   │
│  └────┬────┘                                                        │
│       │                                                             │
│       ▼                                                             │
│  ┌─────────┐                                                        │
│  │  年级    │  ← 年级管理员 (grade_admin)                            │
│  │ (grade)  │    审核: 年级级数据 (年级公共课考试)                    │
│  └────┬────┘                                                        │
│       │                                                             │
│       ▼                                                             │
│  ┌─────────┐                                                        │
│  │  班级    │  ← 班级管理员 (class_admin)                            │
│  │ (class)  │    审核: 班级级数据 (班级考试/通知/作业)                │
│  └─────────┘                                                        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                      管理员产生规则                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. 申请制: 用户主动申请成为某层级管理员                              │
│     → 由上一级管理员审批                                             │
│     → 项目管理员审批学校管理员申请                                   │
│                                                                     │
│  2. 指派制: 上一级管理员直接指派下级管理员                            │
│     → 项目管理员指派学校管理员                                       │
│     → 学校管理员指派学院管理员                                       │
│     → 以此类推                                                       │
│                                                                     │
│  3. 空缺处理: 某层级无管理员时                                       │
│     → 上一级管理员可选择:                                            │
│        a) 亲自审核该层级的数据                                       │
│        b) 设置该层级自动通过 (auto_approve)                          │
│     → 空缺时默认由上一级代管                                         │
│                                                                     │
│  4. 多管理员: 每个层级可有多个管理员，任一审核即可                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                      数据同步范围                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  上传数据时，用户选择适用范围 (scope):                                │
│                                                                     │
│  ┌──────────────┬───────────────────────────────────────────────┐   │
│  │ 数据类型      │ 可选范围                                     │   │
│  ├──────────────┼───────────────────────────────────────────────┤   │
│  │ 食堂菜单      │ 学校 (全校共享)                               │   │
│  │ 外卖/周边餐饮 │ 学校 (全校共享)                               │   │
│  │ 校车时刻      │ 学校 (全校共享)                               │   │
│  │ 空闲教室      │ 学校 / 教学楼 (全校共享)                      │   │
│  │ 校园活动      │ 学校 / 学院 (可选)                            │   │
│  │ 公告通知      │ 学校 / 学院 / 专业 / 年级 / 班级              │   │
│  │ 课程信息      │ 专业 / 班级 (同专业或同班级共享)              │   │
│  │ 考试安排      │ 班级 / 专业 / 年级 (按实际范围选)             │   │
│  │ 作业信息      │ 班级 (同班级共享)                             │   │
│  │ 奖学金信息    │ 学校 / 学院 (按级别)                          │   │
│  │ 失物招领      │ 学校 (全校可见)                               │   │
│  │ 笔记/论坛     │ 不限 (全平台可见)                             │   │
│  └──────────────┴───────────────────────────────────────────────┘   │
│                                                                     │
│  审核流程:                                                          │
│  上传 → 匹配范围对应层级的管理员审核 → 通过后同步到该范围所有用户     │
│  无管理员 → 自动通过 或 上级代审 (取决于上级设置)                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 离线优先策略 (Offline-First)

```
┌─────────────────────────────────────────────────────────────┐
│                   离线数据架构                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DuckDB-WASM (浏览器端)                                     │
│  ├── 全量用户数据本地副本                                    │
│  ├── 离线可读写，在线时双向同步                              │
│  ├── 支持复杂 SQL 查询 (成绩分析/消费统计)                   │
│  └── OPFS 持久化 (跨会话保留)                               │
│                                                             │
│  Service Worker                                             │
│  ├── 静态资源缓存 (App Shell)                               │
│  ├── API 请求离线队列                                       │
│  └── 后台同步 (Background Sync API)                         │
│                                                             │
│  同步策略:                                                   │
│  ├── 优先读本地 DuckDB → 在线时增量同步服务端               │
│  ├── 写操作先写本地 → 在线时推送服务端 (Last-Write-Wins)    │
│  ├── 冲突检测: timestamp + version 字段                     │
│  ├── 首次登录: 服务端全量拉取 → 写入本地 DuckDB             │
│  └── 按组织范围过滤: 只同步用户所属层级 + 下级可见数据      │
│                                                             │
│  离线可用功能:                                                │
│  ├── ✅ 查看课程表、成绩、笔记                              │
│  ├── ✅ 记账、写日记、编辑作业                              │
│  ├── ✅ 查看已缓存的食堂/外卖/活动/公告                     │
│  ├── ✅ 查看已缓存的组织内共享数据                          │
│  ├── ✅ 上传数据 (本地暂存，在线时提交审核)                 │
│  ├── ✅ 已安装的 Skill 浏览 (提示词离线可用)                │
│  ├── ✅ 对话历史查看 (已缓存的会话)                         │
│  ├── ❌ AI 对话 (需联网调用 API)                            │
│  ├── ❌ Agent 执行 (需联网)                                 │
│  ├── ❌ MCP 连接 (需联网)                                   │
│  ├── ❌ RAG 检索 (本地 DuckDB 离线可用)                     │
│  ├── ❌ 实时消息 (需联网)                                   │
│  └── ❌ 数据同步 (需联网)                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 项目结构 (Monorepo)

```
campuslife/
├── server/                        # FastAPI 后端
│   ├── app/
│   │   ├── api/                   # API 路由
│   │   │   ├── v1/
│   │   │   │   ├── auth.py        # 认证
│   │   │   │   ├── users.py       # 用户
│   │   │   │   ├── academics.py   # 学业
│   │   │   │   ├── campus.py      # 校园
│   │   │   │   ├── finance.py     # 财务
│   │   │   │   ├── social.py      # 社交
│   │   │   │   ├── health.py      # 健康
│   │   │   │   ├── ai.py          # AI 代理
│   │   │   │   ├── points.py      # 积分系统
│   │   │   │   ├── corrections.py # 纠错申请
│   │   │   │   ├── ocr.py         # OCR 识别
│   │   │   │   ├── upload.py      # 数据上传
│   │   │   │   ├── sync.py        # 数据同步
│   │   │   │   └── admin.py       # Admin 专用
│   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── models/                # SQLAlchemy 模型
│   │   ├── schemas/               # Pydantic 模型
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── base.py
│   │   │   │   ├── openai_compat.py  # OpenAI 兼容客户端
│   │   │   │   └── proxy.py          # 代理转发
│   │   │   ├── ocr.py            # OCR 服务
│   │   │   ├── points.py         # 积分服务
│   │   │   ├── storage.py        # 文件存储
│   │   │   └── sync.py           # 同步引擎
│   │   ├── middleware/
│   │   └── main.py
│   ├── alembic/                   # 数据库迁移
│   ├── tests/
│   ├── pyproject.toml
│   ├── Dockerfile
│   └── .env.example
│
├── web/                           # 用户前端 (学生)
│   ├── src/
│   │   ├── api/                   # API 封装 (axios)
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── ai/                # AI 组件
│   │   │   │   ├── ChatPanel.vue       # 主对话面板
│   │   │   │   ├── AgentPanel.vue      # Agent 执行面板
│   │   │   │   ├── SkillMarket.vue     # Skill 市场
│   │   │   │   ├── MCPConfig.vue       # MCP 配置
│   │   │   │   ├── ContextManager.vue  # 上下文管理
│   │   │   │   ├── AIInsightCard.vue   # 模块内嵌洞察
│   │   │   │   ├── SmartSuggestion.vue # 智能建议条
│   │   │   │   └── AIWritingPad.vue    # 写作辅助
│   │   │   ├── charts/            # ECharts 组件
│   │   │   ├── ocr/               # OCR 组件
│   │   │   │   ├── OCRUpload.vue      # 上传+识别
│   │   │   │   ├── OCRCamera.vue      # 摄像头拍照识别
│   │   │   │   └── OCRPreview.vue     # 识别结果预览+修正
│   │   │   ├── org/               # 组织架构组件
│   │   │   │   ├── OrgCascader.vue    # 级联选择器 (学校→班级)
│   │   │   │   ├── ScopeSelector.vue  # 上传范围选择器
│   │   │   │   └── AdminApply.vue     # 管理员申请组件
│   │   │   └── offline/           # 离线状态组件
│   │   ├── composables/
│   │   │   ├── useDuckDB.ts       # DuckDB-WASM 操作
│   │   │   ├── useOffline.ts      # 离线状态检测
│   │   │   ├── useSync.ts         # 数据同步
│   │   │   ├── useOCR.ts          # OCR 调用
│   │   │   ├── useOrg.ts          # 组织架构 (层级/管理员)
│   │   │   ├── useScope.ts        # 数据范围选择
│   │   │   ├── useAI.ts           # AI 对话 (流式/非流式)
│   │   │   ├── useAgent.ts        # Agent 执行
│   │   │   ├── useSkill.ts        # Skill 加载/触发
│   │   │   ├── useMCP.ts          # MCP 连接管理
│   │   │   ├── useContext.ts       # 上下文管理/压缩
│   │   │   └── useRAG.ts          # RAG 检索
│   │   ├── db/                    # DuckDB 本地数据库
│   │   │   ├── schema.sql         # 本地表结构
│   │   │   ├── migrations.ts      # 本地迁移
│   │   │   └── queries.ts         # 常用查询
│   │   ├── layouts/
│   │   ├── modules/
│   │   │   ├── academics/         # 学业管理
│   │   │   ├── campus-life/       # 校园生活
│   │   │   ├── finance/           # 财务管理
│   │   │   ├── social/            # 社交通讯
│   │   │   ├── health/            # 健康管理
│   │   │   └── ai-hub/            # AI 中枢
│   │   ├── router/
│   │   ├── stores/                # Pinia (UI 状态)
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── i18n/
│   │   │   ├── zh-CN/
│   │   │   └── en/
│   │   ├── App.vue
│   │   └── main.ts
│   ├── public/
│   │   └── sw.js                  # Service Worker
│   ├── package.json
│   └── vite.config.ts
│
├── admin/                         # Admin 管理后台
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── views/
│   │   │   ├── dashboard/         # 数据概览 (按 scope)
│   │   │   ├── org/               # 组织架构管理
│   │   │   │   ├── tree.vue       # 组织树 (增删改)
│   │   │   │   ├── admins.vue     # 管理员管理 (指派/审批)
│   │   │   │   └── settings.vue   # 审核设置 (自动通过等)
│   │   │   ├── users/             # 用户管理
│   │   │   ├── content/           # 内容审核 (按 scope 过滤)
│   │   │   │   ├── courses/
│   │   │   │   ├── dining/        # 餐饮管理 (食堂/外卖/周边)
│   │   │   │   ├── events/
│   │   │   │   ├── classrooms/    # 空闲教室管理
│   │   │   │   └── announcements/
│   │   │   ├── corrections/       # 纠错审核
│   │   │   ├── uploads/           # 上传审核
│   │   │   ├── points/            # 积分管理 (super_admin)
│   │   │   ├── ai/                # AI 配置 (super_admin)
│   │   │   ├── system/            # 系统设置 (super_admin)
│   │   │   └── analytics/         # 数据分析 (按 scope)
│   │   ├── router/
│   │   ├── stores/
│   │   ├── i18n/
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   └── vite.config.ts
│
├── shared/                        # 前端共享代码
│   ├── types/
│   ├── utils/
│   ├── constants/
│   └── i18n/
│
├── docs/                          # VitePress 文档
│   ├── .vitepress/
│   │   └── config.ts
│   ├── guide/
│   ├── modules/
│   ├── api/
│   ├── admin/
│   ├── zh/
│   └── index.md
│
├── deploy/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── nginx/
│
├── scripts/
│   ├── init_db.py
│   └── seed_data.py
│
├── pnpm-workspace.yaml
├── turbo.json
├── .env.example
└── README.md
```

---

## 功能模块详细规划

### 👤 0. 用户系统 (Users)

| 子模块 | Web (学生) | Admin (管理) | 说明 |
|--------|-----------|-------------|------|
| **注册/登录** | 用户名+密码/邮箱注册，选择 学校→学院→专业→年级→班级 | — | 支持离线登录 (本地缓存 token) |
| **个人资料** | 头像、昵称、组织信息 | 用户列表、搜索、封禁 | 组织层级联动，信息同步到云端 |
| **积分中心** | 查看积分、积分历史、等级 | 积分规则配置、手动调整 | 核心激励系统 |
| **云端同步** | 一键同步/自动同步 | 同步状态监控 | 按组织范围过滤同步数据 |
| **偏好设置** | 主题、语言、AI 配置 | — | 保存在本地 + 云端 |

**注册时组织选择 (级联):**
```
学校 [北京大学 ▼]
  └─ 学院 [计算机科学与技术学院 ▼]
       └─ 专业 [计算机科学与技术 ▼]
            └─ 年级 [2022 级 ▼]
                 └─ 班级 [计科 2201 班 ▼]
```
用户属于班级后，自动关联该班级所属的年级→专业→学院→学校。
组织信息影响: 看到哪些共享数据、谁来审核你上传的数据。

**积分规则:**

| 行为 | 积分 | 说明 |
|------|------|------|
| 上传课程信息 | +10 | 审核通过后发放 |
| 上传食堂菜单 | +5 | 审核通过后发放 |
| 上传外卖/周边餐饮 | +3 | 审核通过后发放 |
| 上传考试信息 | +10 | 审核通过后发放 |
| 上传失物招领 | +5 | 审核通过后发放 |
| 上传校园活动 | +8 | 审核通过后发放 |
| 上传空闲教室 | +3 | 审核通过后发放 |
| 发表餐饮评价 | +2 | 每个餐饮点首次评价 |
| 提交纠错 (被采纳) | +15 | 管理员审核通过 |
| 每日签到 | +1 | 每日一次 |
| 完善个人资料 | +20 | 一次性 |

---

### 📚 1. 学业管理 (Academics)

| 子模块 | 功能 | 同步范围 | AI 要素 | OCR | 上传积分 |
|--------|------|---------|---------|-----|---------|
| **课程表** | 周/日视图，拖拽排课，冲突检测 | 班级 / 专业 | AI 智能排课建议 | ✅ 拍照导入 | +10 |
| **成绩追踪** | GPA 计算，趋势图表，学分统计 | 个人 | AI 成绩预测 | ✅ 截图导入 | — |
| **作业管理** | 截止日期提醒，优先级，附件 | 班级 | AI 解析作业要求 | ✅ 拍照识别 | — |
| **考试安排** | 考试日历，倒计时，复习计划 | 班级 / 专业 / 年级 | AI 生成复习计划 | ✅ 拍照导入 | +10 |
| **笔记系统** | 富文本 + Markdown，标签，搜索 | 个人 / 公开 | AI 笔记摘要 | ✅ 图片转文字 | — |
| **空闲教室** | 按时间/教学楼查询空闲教室 | 学校 | — | — | +3 |

### 🍽️ 2. 校园生活 (Campus Life)

| 子模块 | 功能 | 同步范围 | AI 要素 | OCR | 上传积分 |
|--------|------|---------|---------|-----|---------|
| **食堂菜单** | 各食堂菜品展示，营养分析，收藏 | 学校 | AI 营养搭配 | ✅ 拍照识别 | +5 |
| **外卖聚合** | 校内外卖平台汇总，优惠信息，收藏店铺 | 学校 | AI 点餐推荐 | — | +3 |
| **校园周边** | 校园周边餐饮/店铺，评分，人均消费 | 学校 | AI 探店推荐 | — | +3 |
| **餐饮日记** | 每餐记录，营养统计，消费统计 | 个人 | AI 饮食分析 | ✅ 拍照记录 | — |
| **校园地图** | 交互式地图，地点搜索，路线规划 | 学校 | — | — | — |
| **失物招领** | 发布/搜索，图片上传 | 学校 | AI 图像识别 | ✅ 图片识别 | +5 |
| **校园活动** | 活动日历，报名，提醒 | 学校 / 学院 | AI 个性化推荐 | — | +8 |
| **校车时刻** | 线路查询，时刻表 | 学校 | — | — | — |
| **公告通知** | 公告列表 | 任意层级 | — | — | — |

### 💰 3. 财务管理 (Finance)

| 子模块 | 功能 | AI 要素 | OCR |
|--------|------|---------|-----|
| **记账本** | 收支记录，分类统计，预算管理 | AI 消费分析 & 省钱建议 | ✅ 小票识别记账 |
| **奖学金** | 奖学金列表，条件匹配 | AI 匹配度评估 | — |
| **兼职信息** | 兼职浏览，收入统计 | AI 时间冲突检测 | — |

### 🤝 4. 社交通讯 (Social)

| 子模块 | 功能 | AI 要素 |
|--------|------|---------|
| **通讯录** | 同学联系人，分组管理 | AI 智能分组 |
| **消息系统** | 私聊/群聊，WebSocket 实时 (在线) | AI 消息摘要 |
| **社团管理** | 社团页面，成员，活动 | AI 社团推荐 |
| **论坛/圈子** | 帖子发布，评论，点赞 | — |

### 🏃 5. 健康管理 (Health)

| 子模块 | 功能 | AI 要素 |
|--------|------|---------|
| **运动记录** | 步数/运动数据，目标设定 | AI 运动计划 |
| **作息管理** | 睡眠追踪，提醒闹钟 | AI 作息优化建议 |
| **心理健康** | 心情日记，压力评估 | AI 情绪分析 & 建议 |

### 🤖 6. AI 中枢 (AI Hub)

**核心能力:**

| 子模块 | 功能 | 说明 |
|--------|------|------|
| **AI 助手** | 对话式交互，整合所有模块数据 | 支持多轮对话，上下文感知 |
| **Agent 系统** | 自主执行任务，文件编辑，多步推理 | 可操作本地文件、调用工具、执行代码 |
| **Skill 库** | 可复用的技能模板 | 用户/社区创建，按场景调用 |
| **MCP 库** | Model Context Protocol 工具集成 | 连接外部服务和数据源 |
| **上下文管理** | 智能上下文管理 + 自适应压缩 | 长对话不丢失关键信息 |
| **智能问答** | 校园知识库，课程答疑 | RAG 检索增强 |
| **AI 写作** | 论文辅助，翻译，摘要，改写 | 多种写作模板 |
| **学习分析** | 学习行为分析，个性化建议 | 基于用户数据的深度分析 |
| **AI 设置** | API 配置，模型选择，用量统计 | OpenAI 兼容格式 |

**AI 配置方式 (用户自选):**

```
┌─────────────────────────────────────────────────────┐
│  AI 设置                                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  模式选择:                                           │
│  ○ 使用平台 API (需消耗积分)                         │
│  ● 自定义 API (OpenAI 兼容格式)                      │
│                                                     │
│  [自定义模式配置]                                     │
│                                                     │
│  API Base URL: [https://api.example.com/v1      ]   │
│  API Key:      [sk-**************************** ]   │
│  模型名称:     [gpt-4o                          ]   │
│  [测试连接]                                          │
│                                                     │
│  💡 支持所有 OpenAI 兼容接口:                        │
│     OpenAI / DeepSeek / 通义千问 / 本地 Ollama 等    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### ⚙️ 7. 系统管理 (Admin Only)

**各级管理员看到的管理功能取决于其 scope:**

| 子模块 | super_admin | school_admin | college~class_admin | 功能 |
|--------|------------|-------------|-------------------|------|
| **组织架构** | 全局管理 | 管理本校下级 | 管理本级下级 | 学校/学院/专业/年级/班级 CRUD，管理员指派/审批 |
| **用户管理** | 全校 | 本校 | 本范围 | 用户列表，搜索，批量导入，封禁 |
| **内容审核** | 全校 | 本校 | 本范围 | 审核本范围内的上传数据 |
| **纠错审核** | 全校 | 本校 | 本范围 | 审核本范围内的纠错申请 |
| **积分管理** | ✅ | ❌ | ❌ | 积分规则配置，手动调整，发放记录 |
| **空闲教室** | ✅ | 本校 | ❌ | 教室信息维护，课表数据导入 |
| **数据仪表盘** | 全校 | 本校 | 本范围 | 注册趋势，活跃度，模块使用率 |
| **审核设置** | ✅ | 本校 | 本范围 | 无管理员时: 亲自审核 / 自动通过 |
| **平台 AI 配置** | ✅ | ❌ | ❌ | 平台 API Key，模型，积分消耗规则 |
| **系统设置** | ✅ | ❌ | ❌ | 全局配置 |
| **数据备份** | ✅ | ❌ | ❌ | 数据库备份/恢复 |
| **操作日志** | 全校 | 本校 | 本范围 | 管理员操作审计 |

---

## 后端技术栈

```
FastAPI 后端
├── 框架: FastAPI + Uvicorn
├── ORM: SQLAlchemy 2.0 + Alembic
├── 数据库: DuckDB (开发) / MySQL 8 (生产)
├── 认证: JWT (access + refresh)
├── 文件: 本地文件存储 (uploads/)
├── OCR: PaddleOCR / Tesseract
├── WebSocket: FastAPI WebSocket
├── AI: httpx 异步 (OpenAI 兼容格式代理)
├── 测试: Pytest
└── 部署: Docker + Nginx
```

### 后端依赖 (pyproject.toml)

```toml
[project]
dependencies = [
    "fastapi>=0.115",
    "uvicorn[standard]>=0.34",
    "sqlalchemy>=2.0",
    "alembic>=1.14",
    "pydantic>=2.10",
    "pydantic-settings>=2.7",
    "python-jose[cryptography]>=3.3",
    "passlib[bcrypt]>=1.7",
    "python-multipart>=0.0.18",
    "httpx>=0.28",
    "websockets>=14.1",
    # 开发环境用 DuckDB
    "duckdb>=1.1",
    # 生产环境用 MySQL
    "pymysql>=1.1",
    "cryptography>=44.0",
    # OCR
    "paddlepaddle>=2.6",
    "paddleocr>=2.9",
    # AI
    "openai>=1.58",                # OpenAI 兼容客户端 (也用于自定义端点)
    "anthropic>=0.40",             # Claude API (可选)
    "tiktoken>=0.8",               # Token 计数
    # RAG
    "sentence-transformers>=3.0",  # 文本嵌入
    # MCP
    "mcp>=1.0",                    # MCP Python SDK
    # 工具
    "python-i18n>=0.3",
    "aiofiles>=24.1",
    "Pillow>=11.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.3",
    "pytest-asyncio>=0.24",
    "ruff>=0.8",
]
```

---

## 前端依赖清单 (web/ & admin/ 共享)

```json
{
  "dependencies": {
    "vue": "^3.5",
    "vue-router": "^4.5",
    "pinia": "^2.3",
    "element-plus": "^2.9",
    "@element-plus/icons-vue": "^2.3",
    "echarts": "^5.6",
    "vue-echarts": "^7.0",
    "@tiptap/vue-3": "^2.11",
    "vue-i18n": "^10.0",
    "axios": "^1.7",
    "dayjs": "^1.11",
    "fuse.js": "^7.0",
    "@vueuse/core": "^12.0",
    "@duckdb/duckdb-wasm": "^1.19",
    "tesseract.js": "^5.1",
    "idb-keyval": "^6.2",
    "markdown-it": "^14.0",
    "highlight.js": "^11.10",
    "katex": "^0.16"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.2",
    "@capacitor/cli": "^6.2",
    "vite": "^6.0",
    "typescript": "^5.7",
    "vitest": "^3.0",
    "playwright": "^1.49",
    "@vitejs/plugin-vue": "^5.2",
    "unplugin-auto-import": "^0.18",
    "unplugin-vue-components": "^0.27",
    "sass": "^1.83",
    "vite-plugin-pwa": "^0.21"
  }
}
```

---

## API 设计概览

```
/api/v1/
├── auth/
│   ├── POST   /register           # 注册 (选择学校/学院/专业/年级/班级)
│   ├── POST   /login              # 登录
│   ├── POST   /refresh            # 刷新 token
│   └── POST   /forgot-password    # 忘记密码
│
├── users/
│   ├── GET    /me                 # 当前用户信息
│   ├── PUT    /me                 # 更新个人信息
│   ├── GET    /me/points          # 我的积分
│   ├── GET    /me/points/history  # 积分历史
│   ├── GET    /me/org             # 我的组织信息 (含层级链)
│   ├── GET    /                   # 用户列表 (admin)
│   └── PUT    /{id}               # 更新用户 (admin)
│
├── org/                           # 组织架构
│   ├── GET    /tree               # 组织树 (完整层级)
│   ├── GET    /schools            # 学校列表
│   ├── GET    /schools/{id}/colleges       # 学校下的学院
│   ├── GET    /colleges/{id}/majors        # 学院下的专业
│   ├── GET    /majors/{id}/grades          # 专业下的年级
│   ├── GET    /grades/{id}/classes         # 年级下的班级
│   ├── GET    /{scope_type}/{scope_id}/members    # 某层级成员列表
│   ├── GET    /{scope_type}/{scope_id}/admins     # 某层级管理员列表
│   ├── POST   /admin-apply        # 申请成为管理员
│   ├── PUT    /admin-apply/{id}   # 审批管理员申请 (admin)
│   ├── POST   /admin-appoint      # 指派管理员 (admin)
│   ├── DELETE /admins/{id}        # 撤销管理员 (admin)
│   ├── PUT    /{scope_type}/{scope_id}/settings   # 审核设置 (admin)
│   └── GET    /{scope_type}/{scope_id}/settings   # 查询审核设置
│
├── academics/
│   ├── courses/                   # 课程 CRUD
│   │   ├── GET    /               # 我的课程 (含范围内共享)
│   │   ├── POST   /               # 创建/上传课程 (带 scope)
│   │   ├── PUT    /{id}           # 更新
│   │   └── DELETE /{id}           # 删除
│   ├── schedule/                  # 课表视图
│   ├── grades/                    # 成绩
│   ├── assignments/               # 作业
│   ├── exams/                     # 考试
│   │   ├── GET    /               # 我的考试 (含范围内共享)
│   │   ├── POST   /               # 上传考试信息 (带 scope)
│   │   └── PUT    /{id}/review    # 审核
│   ├── notes/                     # 笔记
│   └── classrooms/                # 空闲教室
│       ├── GET    /available      # 查询空闲教室 (按时间/教学楼)
│       ├── GET    /buildings      # 教学楼列表
│       ├── POST   /schedule       # 上传教室占用数据 (带 scope)
│       └── PUT    /schedule/{id}/review  # 审核
│
├── campus/
│   ├── dining/                    # 餐饮服务 (食堂+外卖+周边)
│   │   ├── GET    /               # 餐饮点列表 (支持 type 筛选)
│   │   ├── GET    /{id}           # 餐饮点详情 (含菜品+评价)
│   │   ├── GET    /{id}/menu      # 菜品列表
│   │   ├── GET    /{id}/reviews   # 评价列表
│   │   ├── POST   /               # 上传餐饮点 (scope=school)
│   │   ├── POST   /{id}/menu      # 上传菜品
│   │   ├── POST   /{id}/reviews   # 发表评价
│   │   ├── PUT    /{id}/review    # 审核
│   │   ├── GET    /favorites      # 我的收藏
│   │   ├── POST   /favorites      # 收藏/取消收藏
│   │   └── GET    /recommend      # AI 推荐 (基于偏好+营养)
│   ├── meal-log/                  # 餐饮日记
│   │   ├── GET    /               # 我的餐饮日记
│   │   ├── POST   /               # 记录一餐
│   │   ├── GET    /nutrition      # 营养统计
│   │   └── GET    /spending       # 餐饮消费统计
│   ├── map/                       # 地图 POI
│   ├── lost-found/                # 失物招领 (scope=school)
│   ├── events/                    # 校园活动 (scope=school/college)
│   ├── bus/                       # 校车 (scope=school)
│   └── announcements/             # 公告 (scope=任意层级)
│
├── finance/
│   ├── transactions/              # 个人收支记录
│   ├── budgets/                   # 个人预算
│   ├── scholarships/              # 奖学金 (scope=school/college)
│   └── jobs/                      # 兼职
│
├── social/
│   ├── contacts/                  # 通讯录
│   ├── chats/                     # 聊天
│   ├── clubs/                     # 社团
│   └── forum/                     # 论坛
│
├── health/
│   ├── exercise/                  # 运动
│   ├── sleep/                     # 作息
│   └── mood/                      # 心情
│
├── ai/
│   ├── conversations/             # 对话会话
│   │   ├── GET    /               # 会话列表
│   │   ├── POST   /               # 创建会话
│   │   ├── GET    /{id}           # 会话详情 (含消息)
│   │   ├── PUT    /{id}           # 更新会话 (标题/钉住)
│   │   ├── DELETE /{id}           # 删除会话
│   │   └── POST   /{id}/branch    # 从某条消息分叉
│   ├── messages/                  # 消息
│   │   ├── POST   /chat           # 发送消息 (非流式)
│   │   ├── POST   /chat/stream    # 发送消息 (SSE 流式)
│   │   ├── PUT    /{id}/pin       # 钉住/取消钉住
│   │   └── POST   /{id}/regenerate# 重新生成
│   ├── skills/                    # Skill 管理
│   │   ├── GET    /               # 我的 Skill 列表
│   │   ├── GET    /market         # Skill 市场
│   │   ├── POST   /               # 创建 Skill
│   │   ├── PUT    /{id}           # 更新 Skill
│   │   ├── DELETE /{id}           # 删除 Skill
│   │   ├── POST   /{id}/install   # 安装 Skill
│   │   └── POST   /{id}/rate      # 评分
│   ├── mcp/                       # MCP 连接管理
│   │   ├── GET    /               # 我的连接列表
│   │   ├── POST   /               # 添加连接
│   │   ├── PUT    /{id}           # 更新连接
│   │   ├── DELETE /{id}           # 删除连接
│   │   ├── POST   /{id}/test      # 测试连接
│   │   └── GET    /{id}/tools     # 获取工具列表
│   ├── context/                   # 上下文管理
│   │   ├── GET    /{conv_id}/stats    # Token 统计
│   │   ├── POST   /{conv_id}/compress # 手动压缩
│   │   └── POST   /{conv_id}/pin      # 钉住消息
│   ├── rag/                       # RAG 检索
│   │   ├── POST   /search         # 向量检索
│   │   ├── POST   /index          # 索引文档
│   │   └── GET    /sources        # 已索引数据源
│   ├── agent/                     # Agent
│   │   ├── POST   /execute        # 执行 Agent 任务
│   │   ├── POST   /execute/stream # 流式执行
│   │   └── GET    /tools          # 可用工具列表
│   └── GET    /models             # 可用模型列表
│
│
├── upload/
│   ├── POST   /image              # 上传图片
│   ├── POST   /data               # 上传结构化数据 (带 scope, 审核后积分)
│   └── POST   /ocr                # OCR 识别
│
├── corrections/
│   ├── POST   /                   # 提交纠错 (带 scope)
│   ├── GET    /                   # 我的纠错列表
│   └── PUT    /{id}/review        # 审核纠错 (scope 对应层级管理员)
│
├── sync/
│   ├── POST   /push               # 客户端推送本地变更
│   ├── POST   /pull               # 客户端拉取服务端变更 (按 scope 过滤)
│   └── GET    /status             # 同步状态
│
├── ws/
│   ├── /chat/{room_id}            # WebSocket 聊天
│   └── /notification              # WebSocket 通知
│
└── admin/
    ├── dashboard/                 # 数据概览 (按 scope 范围)
    ├── users/                     # 用户管理
    ├── content/                   # 内容审核 (按 scope 过滤待审内容)
    ├── corrections/               # 纠错审核
    ├── uploads/                   # 上传审核
    ├── points/                    # 积分管理 (super_admin)
    ├── org/                       # 组织管理
    │   ├── GET    /               # 组织树 + 管理员状态
    │   ├── POST   /schools        # 添加学校
    │   ├── POST   /colleges       # 添加学院
    │   ├── POST   /majors         # 添加专业
    │   ├── POST   /grades         # 添加年级
    │   ├── POST   /classes         # 添加班级
    │   ├── PUT    /{type}/{id}     # 编辑
    │   └── DELETE /{type}/{id}     # 删除
    ├── classrooms/                # 教室管理
    ├── ai-config/                 # 平台 AI 配置
    ├── settings/                  # 系统设置
    ├── logs/                      # 操作日志
    └── backup/                    # 备份管理
```

---

## 数据库模型 (核心)

### 组织架构表

```
┌─────────────────┐
│    schools       │  (学校)
│─────────────────│
│ id               │
│ name             │
│ code             │  (学校代码)
│ address          │
│ created_at       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   colleges       │  (学院)
│─────────────────│
│ id               │
│ school_id        │  → FK schools
│ name             │
│ code             │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    majors        │  (专业)
│─────────────────│
│ id               │
│ college_id       │  → FK colleges
│ name             │
│ code             │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    grades        │  (年级，如 2022 级)
│─────────────────│
│ id               │
│ major_id         │  → FK majors
│ year             │  (入学年份，如 2022)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   classes        │  (班级)
│─────────────────│
│ id               │
│ grade_id         │  → FK grades
│ name             │  (如 "计科 2201 班")
│ code             │
└─────────────────┘

┌──────────────────────┐
│   org_admins          │  (组织管理员，多对多)
│──────────────────────│
│ id                    │
│ user_id               │  → FK users
│ scope_type            │  (school / college / major / grade / class)
│ scope_id              │  (对应层级的 ID)
│ appointed_by          │  → FK users (指派人，NULL 表示自申请)
│ status                │  (active / resigned)
│ created_at            │
└──────────────────────┘

┌──────────────────────────┐
│   admin_applications      │  (管理员申请)
│──────────────────────────│
│ id                        │
│ user_id                   │  → FK users
│ scope_type                │  (school / college / major / grade / class)
│ scope_id                  │
│ reason                    │  (申请理由)
│ status                    │  (pending / approved / rejected)
│ reviewer_id               │  → FK users
│ reviewed_at               │
│ created_at                │
└──────────────────────────┘

┌──────────────────────────┐
│   org_settings            │  (组织审核设置)
│──────────────────────────│
│ id                        │
│ scope_type                │
│ scope_id                  │
│ has_admin                 │  (当前是否有管理员)
│ auto_approve              │  (无管理员时是否自动通过)
│ fallback_reviewer_id      │  → FK users (无管理员时的代审人)
│ updated_at                │
└──────────────────────────┘
```

### 用户表

```
┌─────────────────┐
│     users        │
│─────────────────│
│ id               │
│ username         │
│ email            │
│ password_hash    │
│ role             │  (super_admin / student)
│ avatar           │
│ nickname         │
│ school_id        │  → FK schools
│ college_id       │  → FK colleges
│ major_id         │  → FK majors
│ grade_id         │  → FK grades
│ class_id         │  → FK classes
│ enrollment_year  │
│ points           │  (当前积分)
│ level            │  (等级)
│ ai_api_url       │  (用户自配 AI API)
│ ai_api_key       │  (加密存储)
│ ai_model         │  (用户自配模型名)
│ preferences JSON │  (主题/语言等)
│ sync_version     │  (同步版本号)
│ created_at       │
│ updated_at       │
└────────┬────────┘
         │
         ├────< courses              (课程)
         ├────< grades_record        (成绩记录)
         ├────< assignments          (作业)
         ├────< exams                (考试)
         ├────< notes                (笔记)
         ├────< transactions         (收支记录)
         ├────< contacts             (通讯录)
         ├────< exercise_logs        (运动记录)
         ├────< sleep_logs           (作息记录)
         ├────< mood_logs            (心情记录)
         ├────< chat_messages        (聊天消息)
         ├────< point_logs           (积分记录)
         ├────< corrections          (纠错提交)
         └────< uploads              (上传记录)
```

### 共享数据表 (带同步范围)

```
┌─────────────────┐
│   classrooms     │     (教室)
│─────────────────│
│ id               │
│ school_id        │  → FK schools (全校共享)
│ building         │
│ room_number      │
│ capacity         │
│ equipment        │  (JSON: 投影仪/空调等)
│ campus           │
│ floor            │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│  class_schedule       │  (课程占用/空闲教室数据)
│──────────────────────│
│ id                    │
│ classroom_id          │
│ course_name           │
│ teacher               │
│ day_of_week           │  (1-7)
│ start_period          │  (节次)
│ end_period            │
│ semester              │
│ week_range            │  (如 "1-16周")
│ scope_type            │  (class / major / grade)
│ scope_id              │
│ uploaded_by           │  → FK users
│ status                │  (pending / approved / rejected)
│ reviewed_by           │  → FK users
│ reviewed_at           │
│ created_at            │
└──────────────────────┘

┌──────────────────────┐
│   dining_spots        │  (餐饮点 — 食堂/外卖/周边)
│──────────────────────│
│ id                    │
│ school_id             │  → FK schools (全校共享)
│ name                  │
│ type                  │  (cafeteria / takeout / nearby)
│ location              │
│ hours                 │  (JSON: 营业时间)
│ phone                 │
│ delivery_time         │  (外卖配送时间，如 "30-45min")
│ delivery_fee          │  (配送费)
│ min_order             │  (起送价)
│ rating                │  (平均评分)
│ price_level           │  (人均消费档位: $/$$/$$$)
│ image_url             │
│ tags JSON             │  (标签: 快餐/奶茶/烧烤/...)
│ platform_links JSON   │  (外卖平台链接: 美团/饿了么)
│ scope_type            │  (school — 固定)
│ scope_id              │
│ uploaded_by           │  → FK users
│ status                │  (pending / approved / rejected)
│ reviewed_by           │
│ created_at            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   menu_items          │  (菜品/餐品)
│──────────────────────│
│ id                    │
│ dining_spot_id        │  → FK dining_spots
│ name                  │
│ price                 │
│ original_price        │  (原价，用于显示折扣)
│ category              │  (主食/小炒/汤/饮品/甜品/...)
│ description           │
│ nutrition JSON        │  (卡路里/蛋白质/碳水/脂肪)
│ image_url             │
│ available_days        │  (周一至周日 / 每日)
│ spicy_level           │  (辣度: 不辣/微辣/中辣/特辣)
│ is_popular            │  (热门推荐)
│ uploaded_by           │
│ status                │
│ reviewed_by           │
└──────────────────────┘

┌──────────────────────┐
│   dining_reviews      │  (餐饮评价)
│──────────────────────│
│ id                    │
│ dining_spot_id        │  → FK dining_spots
│ user_id               │  → FK users
│ rating                │  (1-5)
│ comment               │
│ images JSON           │
│ tags JSON             │  (好吃/性价比/速度快/分量足/...)
│ created_at            │
└──────────────────────┘

┌──────────────────────┐
│   meal_logs           │  (餐饮日记)
│──────────────────────│
│ id                    │
│ user_id               │  → FK users
│ dining_spot_id        │  → FK dining_spots (可选)
│ meal_type             │  (breakfast / lunch / dinner / snack)
│ items JSON            │  (吃了什么)
│ total_price           │
│ photo_url             │
│ note                  │
│ date                  │
│ nutrition_summary JSON│  (自动计算的营养数据)
│ created_at            │
└──────────────────────┘

┌──────────────────────┐
│   lost_found          │  (失物招领)
│──────────────────────│
│ id                    │
│ school_id             │  → FK schools (全校可见)
│ type                  │  (lost / found)
│ title                 │
│ description           │
│ location              │
│ contact_info          │
│ images JSON           │
│ category              │  (证件/电子/衣物/书本/...)
│ status                │  (open / resolved / closed)
│ uploaded_by           │  → FK users
│ reviewed_by           │
│ created_at            │
│ expires_at            │
└──────────────────────┘

┌──────────────────────┐
│   events              │  (校园活动)
│──────────────────────│
│ id                    │
│ scope_type            │  (school / college)
│ scope_id              │
│ title                 │
│ description           │
│ location              │
│ start_time            │
│ end_time              │
│ registration_deadline │
│ max_participants      │
│ current_participants  │
│ images JSON           │
│ tags JSON             │
│ uploaded_by           │  → FK users
│ status                │  (pending / approved / rejected / ended)
│ reviewed_by           │
│ created_at            │
└──────────────────────┘

┌──────────────────────┐
│   announcements       │  (公告通知)
│──────────────────────│
│ id                    │
│ scope_type            │  (school / college / major / grade / class)
│ scope_id              │
│ title                 │
│ content               │  (富文本)
│ priority              │  (normal / important / urgent)
│ pinned                │
│ uploaded_by           │  → FK users
│ status                │  (pending / approved / rejected)
│ reviewed_by           │
│ created_at            │
│ expires_at            │
└──────────────────────┘

┌──────────────────────┐
│   bus_routes          │  (校车线路)
│──────────────────────│
│ id                    │
│ school_id             │  → FK schools (全校共享)
│ name                  │
│ stops JSON            │  (站点列表)
│ schedule JSON         │  (时刻表)
│ active                │
│ uploaded_by           │
│ status                │
│ reviewed_by           │
└──────────────────────┘

┌──────────────────────┐
│   scholarships        │  (奖学金)
│──────────────────────│
│ id                    │
│ scope_type            │  (school / college)
│ scope_id              │
│ name                  │
│ amount                │
│ requirements JSON     │  (申请条件)
│ deadline              │
│ description           │
│ uploaded_by           │
│ status                │
│ reviewed_by           │
└──────────────────────┘
```

### 个人数据表

```
┌──────────────────────┐
│   courses             │  (课程/课表)
│──────────────────────│
│ id                    │
│ user_id               │  (创建者)
│ scope_type            │  (class / major)
│ scope_id              │  (共享后同范围用户可见)
│ name                  │
│ teacher               │
│ credits               │
│ classroom             │
│ day_of_week           │
│ start_period          │
│ end_period            │
│ semester              │
│ week_range            │
│ color                 │  (课表显示颜色)
│ shared                │  (是否已共享到范围)
│ uploaded_by           │
│ status                │  (pending / approved / rejected)
│ reviewed_by           │
│ created_at            │
└──────────────────────┘

┌──────────────────────┐
│   grades_record       │  (成绩记录)
│──────────────────────│
│ id                    │
│ user_id               │
│ course_name           │
│ score                 │
│ grade_point           │
│ credits               │
│ semester              │
│ exam_type             │  (期末/补考/重修)
│ ocr_image_url         │  (OCR 原图)
│ created_at            │
└──────────────────────┘

┌──────────────────────┐
│   assignments         │  (作业)
│──────────────────────│
│ id                    │
│ user_id               │
│ scope_type            │  (class)
│ scope_id              │
│ title                 │
│ description           │
│ course_name           │
│ deadline              │
│ priority              │  (low / medium / high / urgent)
│ status                │  (pending / in_progress / done)
│ attachments JSON      │
│ shared                │
│ created_at            │
└──────────────────────┘

┌──────────────────────┐
│   exams               │  (考试安排)
│──────────────────────│
│ id                    │
│ user_id               │
│ scope_type            │  (class / major / grade)
│ scope_id              │
│ course_name           │
│ exam_type             │  (期末/期中/补考)
│ exam_time             │
│ location              │
│ seat_number           │
│ notes                 │
│ shared                │
│ uploaded_by           │
│ status                │  (pending / approved / rejected)
│ reviewed_by           │
│ created_at            │
└──────────────────────┘

┌──────────────────────┐
│   notes               │  (笔记)
│──────────────────────│
│ id                    │
│ user_id               │
│ title                 │
│ content               │  (富文本 / Markdown)
│ tags JSON             │
│ course_name           │
│ is_public             │  (是否公开)
│ attachments JSON      │
│ created_at            │
│ updated_at            │
└──────────────────────┘

┌──────────────────────┐
│   transactions        │  (收支记录)
│──────────────────────│
│ id                    │
│ user_id               │
│ type                  │  (income / expense)
│ amount                │
│ category              │  (餐饮/交通/娱乐/学习/...)
│ description           │
│ date                  │
│ ocr_image_url         │
│ created_at            │
└──────────────────────┘
```

### 系统表

```
┌─────────────────┐
│   corrections    │  (纠错申请)
│─────────────────│
│ id               │
│ user_id          │
│ target_table     │  (哪个表)
│ target_id        │  (哪条记录)
│ field_name       │  (哪个字段)
│ original_value   │  (原值)
│ corrected_value  │  (纠正值)
│ reason           │
│ scope_type       │  (纠错数据所在层级)
│ scope_id         │
│ status           │  (pending / approved / rejected)
│ reviewer_id      │
│ reviewed_at      │
│ created_at       │
└─────────────────┘

┌─────────────────┐
│   point_logs     │  (积分记录)
│─────────────────│
│ id               │
│ user_id          │
│ amount           │  (+/-)
│ action           │  (upload_xxx, correction_accepted, daily_checkin, ...)
│ reference_id     │
│ description      │
│ created_at       │
└─────────────────┘

┌──────────────────────┐
│  ai_conversations     │  (AI 对话记录)
│──────────────────────│
│ id                    │
│ user_id               │
│ module                │
│ messages JSON         │
│ model                 │
│ tokens_used           │
│ source                │  (platform / custom)
│ created_at            │
└──────────────────────┘

┌──────────────────────┐
│  uploads              │  (上传记录)
│──────────────────────│
│ id                    │
│ user_id               │
│ data_type             │  (course / exam / menu / event / ...)
│ scope_type            │
│ scope_id              │
│ data_snapshot JSON    │  (上传的数据快照)
│ status                │  (pending / approved / rejected)
│ reviewer_id           │
│ points_awarded        │  (审核通过后发放的积分)
│ reviewed_at           │
│ created_at            │
└──────────────────────┘
```

---

## 权限模型 (RBAC)

```
角色类型:

  全局角色:
    super_admin (项目管理员) — 最高权限，管理全局设置和学校管理员

  组织管理员 (每个层级可有多个):
    school_admin   — 学校级管理员，审核全校共享数据
    college_admin  — 学院级管理员，审核学院级数据
    major_admin    — 专业级管理员，审核专业级数据
    grade_admin    — 年级级管理员，审核年级级数据
    class_admin    — 班级级管理员，审核班级级数据

  普通用户:
    student — 学生，可上传数据、提交纠错、使用全部功能

权限表:
  ┌──────────────────────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┐
  │ 权限                  │ super │school │college│ major │ grade │ class │ student │
  │                      │ admin │ admin │ admin │ admin │ admin │ admin │         │
  ├──────────────────────┼───────┼───────┼───────┼───────┼───────┼───────┼─────────┤
  │ 系统全局设置          │  ✅   │  ❌   │  ❌   │  ❌   │  ❌   │  ❌   │   ❌    │
  │ 平台 AI 配置          │  ✅   │  ❌   │  ❌   │  ❌   │  ❌   │  ❌   │   ❌    │
  │ 管理学校管理员        │  ✅   │  ❌   │  ❌   │  ❌   │  ❌   │  ❌   │   ❌    │
  │ 管理下级管理员        │  ❌   │  ✅   │  ✅   │  ✅   │  ✅   │  ❌   │   ❌    │
  │ 审核本级范围数据      │  ✅   │  ✅   │  ✅   │  ✅   │  ✅   │  ✅   │   ❌    │
  │ 审核下级空缺数据      │  —    │  ✅   │  ✅   │  ✅   │  ✅   │  ❌   │   ❌    │
  │ 设置下级自动通过      │  —    │  ✅   │  ✅   │  ✅   │  ✅   │  ❌   │   ❌    │
  │ 积分管理              │  ✅   │  ❌   │  ❌   │  ❌   │  ❌   │  ❌   │   ❌    │
  │ 教室数据管理          │  ✅   │  ✅   │  ❌   │  ❌   │  ❌   │  ❌   │   ❌    │
  │ 全校数据分析          │  ✅   │  ✅   │  ❌   │  ❌   │  ❌   │  ❌   │   ❌    │
  │ 本范围数据分析        │  —    │  —    │  ✅   │  ✅   │  ✅   │  ✅   │   ❌    │
  │ 上传数据              │  ✅   │  ✅   │  ✅   │  ✅   │  ✅   │  ✅   │   ✅    │
  │ 提交纠错              │  ✅   │  ✅   │  ✅   │  ✅   │  ✅   │  ✅   │   ✅    │
  │ 使用 AI               │  ✅   │  ✅   │  ✅   │  ✅   │  ✅   │  ✅   │   ✅    │
  │ 个人数据              │  ✅   │  ✅   │  ✅   │  ✅   │  ✅   │  ✅   │   ✅    │
  └──────────────────────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┘

管理员申请/指派流程:
  ┌──────────────────────────────────────────────────────────────────┐
  │                                                                  │
  │  申请流程:                                                       │
  │  用户 → 申请成为 X 层级管理员 → 上一级管理员审批                  │
  │  (用户需属于该层级，如申请班级管理员需是该班级学生)               │
  │                                                                  │
  │  指派流程:                                                       │
  │  上一级管理员 → 直接指派某用户为下级管理员                        │
  │                                                                  │
  │  空缺处理:                                                       │
  │  某层级无管理员 → 上一级管理员收到通知                            │
  │  → 选择: 亲自审核 / 设置自动通过                                  │
  │  → 可随时指派新管理员结束空缺                                     │
  │                                                                  │
  └──────────────────────────────────────────────────────────────────┘
```

---

## OCR 集成方案

```
┌─────────────────────────────────────────────────────────┐
│                    OCR 架构                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  前端 OCR (离线可用)                                      │
│  ├── Tesseract.js — 轻量级，浏览器端运行                  │
│  ├── 适用: 笔记图片转文字、简单截图识别                   │
│  └── 不需要联网，离线可用                                 │
│                                                         │
│  后端 OCR (精确识别)                                      │
│  ├── PaddleOCR — 高精度中文识别                          │
│  ├── 适用: 课表截图、成绩截图、菜单拍照、小票             │
│  └── 上传图片 → 服务端识别 → 返回结构化数据               │
│                                                         │
│  OCR 使用场景:                                            │
│  ├── 📸 课表导入: 截图 → OCR → 自动填充课程               │
│  ├── 📸 成绩导入: 截图 → OCR → 自动录入成绩               │
│  ├── 📸 菜单识别: 拍照 → OCR → 生成菜品数据               │
│  ├── 📸 小票记账: 拍照 → OCR → 自动生成收支记录           │
│  ├── 📸 作业识别: 拍照 → OCR → 提取文字内容               │
│  └── 📸 笔记扫描: 拍照 → OCR → 转为可编辑文本             │
│                                                         │
│  前端组件:                                                │
│  ├── <OCRUpload /> — 上传+识别一体化组件                  │
│  ├── <OCRCamera /> — 调用摄像头拍照识别                   │
│  └── <OCRPreview /> — 识别结果预览+手动修正               │
└─────────────────────────────────────────────────────────┘
```

---

## AI 集成策略

### 整体架构

```
┌──────────────────────────────────────────────────────────────────────┐
│                           AI 系统架构                                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─── 前端 AI 层 ────────────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  ChatPanel        — 多轮对话面板 (Markdown 渲染/代码高亮)     │   │
│  │  AgentPanel       — Agent 执行面板 (步骤展示/文件预览)         │   │
│  │  SkillMarket      — Skill 市场 (浏览/安装/管理)                │   │
│  │  MCPConfig        — MCP 连接配置面板                           │   │
│  │  ContextManager   — 上下文可视化 (Token 用量/压缩历史)        │   │
│  │  AIInsightCard    — 模块内嵌洞察卡片                           │   │
│  │  SmartSuggestion  — 智能建议条 (输入时实时建议)                │   │
│  │  AIWritingPad     — 写作辅助面板                               │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                          │                                           │
│                          ▼                                           │
│  ┌─── AI 核心引擎 (server/app/services/ai/) ─────────────────────┐   │
│  │                                                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │   │
│  │  │ Context Mgr  │  │ Agent Engine│  │ Skill Runtime       │    │   │
│  │  │ 上下文管理   │  │ Agent 引擎  │  │ Skill 运行时        │    │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘    │   │
│  │         │                │                     │               │   │
│  │         ▼                ▼                     ▼               │   │
│  │  ┌─────────────────────────────────────────────────────────┐  │   │
│  │  │              Proxy Layer (代理层)                        │  │   │
│  │  │  OpenAI 兼容格式 → 用户自定义 API / 平台 API            │  │   │
│  │  │  支持: OpenAI / DeepSeek / 通义 / Claude / 任意兼容端   │  │   │
│  │  └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │   │
│  │  │ Prompt Mgr   │  │ MCP Client  │  │ RAG Engine          │    │   │
│  │  │ 提示词管理   │  │ MCP 客户端  │  │ 检索增强            │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘    │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─── 用户 AI 配置 (users 表) ───────────────────────────────────┐   │
│  │  模式: platform (平台API, 消耗积分) / custom (自定义)          │   │
│  │  custom_api_url / custom_api_key (加密) / custom_model         │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 上下文管理系统 (Context Manager)

```
┌──────────────────────────────────────────────────────────────────────┐
│                      上下文管理架构                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─── 消息生命周期 ──────────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  新消息 → [Context Window] → 压缩/淘汰 → API 请求             │   │
│  │            ▲                     │                              │   │
│  │            │                     ▼                              │   │
│  │            └── 摘要回填 ◄── 压缩后的摘要                       │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  上下文组成 (Context Window 分配):                                    │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                                                              │    │
│  │  [System Prompt]          ~10-15%  固定                      │    │
│  │    ├── 核心人设 + 行为准则                                    │    │
│  │    ├── 当前模块上下文 (课程表/记账本/...)                     │    │
│  │    └── Skill 注入的指令                                       │    │
│  │                                                              │    │
│  │  [RAG Context]            ~15-20%  动态                      │    │
│  │    ├── 用户个人数据检索 (成绩/笔记/...)                      │    │
│  │    ├── 知识库检索 (校园FAQ/课程资料)                         │    │
│  │    └── MCP 返回的外部数据                                    │    │
│  │                                                              │    │
│  │  [Conversation History]   ~40-50%  自适应压缩                 │    │
│  │    ├── 近期消息 (原文保留)                                   │    │
│  │    ├── 中期消息 (滑动窗口摘要)                               │    │
│  │    └── 早期消息 (重度压缩/丢弃)                              │    │
│  │                                                              │    │
│  │  [Agent Scratchpad]       ~10-15%  Agent 专用                │    │
│  │    ├── 工具调用历史                                          │    │
│  │    ├── 中间推理步骤                                          │    │
│  │    └── 文件操作记录                                          │    │
│  │                                                              │    │
│  │  [Reserved for Response]  ~10-15%  留给输出                  │    │
│  │                                                              │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  自适应压缩策略:                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                                                              │    │
│  │  Level 0: 原文保留 (最近 N 条消息)                           │    │
│  │    → 完整保留最近 5-10 条消息原文                            │    │
│  │                                                              │    │
│  │  Level 1: 滑动窗口摘要 (中距离消息)                          │    │
│  │    → 每 5-10 条消息压缩为 1 段摘要                           │    │
│  │    → 保留关键实体 (人名/日期/数字)                           │    │
│  │    → 保留用户明确要求记住的内容                              │    │
│  │                                                              │    │
│  │  Level 2: 重度压缩 (远距离消息)                              │    │
│  │    → 整段对话压缩为 1-2 句话摘要                             │    │
│  │    → 仅保留核心主题和结论                                    │    │
│  │                                                              │    │
│  │  Level 3: 丢弃 (超远距离)                                    │    │
│  │    → 超出 token 预算的早期消息直接丢弃                       │    │
│  │    → 关键信息已迁移到 Level 2 摘要中                         │    │
│  │                                                              │    │
│  │  压缩触发:                                                    │    │
│  │    → Token 用量超过阈值时自动触发                            │    │
│  │    → 用户可手动 "钉住" 重要消息 (不被压缩)                   │    │
│  │    → 会话保存时自动压缩一次                                  │    │
│  │                                                              │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  上下文持久化:                                                        │
│    → 每个会话的上下文状态保存到 DuckDB (本地) / MySQL (云端)        │
│    → 压缩摘要随会话保存，下次打开可恢复                               │
│    → 支持 "会话分支" — 从某个节点分叉对话                            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Agent 系统

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Agent 系统                                     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Agent = LLM + 工具调用 + 多步推理 + 自主决策                        │
│                                                                      │
│  ┌─── Agent 能力 ────────────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  🔧 工具调用 (Function Calling)                               │   │
│  │    ├── 数据库查询: 查询课程/成绩/记账等                       │   │
│  │    ├── 文件操作: 读写本地文件 (Tauri/Desktop)                 │   │
│  │    ├── 计算器: 复杂计算 (GPA/统计)                            │   │
│  │    ├── 搜索: 搜索笔记/课程/知识库                            │   │
│  │    ├── 日程: 创建提醒/日历事件                                │   │
│  │    └── MCP 工具: 通过 MCP 调用的外部工具                      │   │
│  │                                                                │   │
│  │  📝 文件编辑 (Desktop/Tauri 环境)                             │   │
│  │    ├── 读取本地文件 (笔记/文档)                               │   │
│  │    ├── 创建/编辑文件                                          │   │
│  │    ├── 代码生成与格式化                                       │   │
│  │    └── 文件格式转换 (Markdown ↔ PDF 等)                      │   │
│  │                                                                │   │
│  │  🔄 多步推理                                                   │   │
│  │    ├── 思维链 (Chain-of-Thought) 展示                         │   │
│  │    ├── 任务分解 (将复杂任务拆为子步骤)                        │   │
│  │    ├── 自我纠错 (检测错误并重试)                              │   │
│  │    └── 进度追踪 (步骤完成状态)                                │   │
│  │                                                                │   │
│  │  🎯 自主决策                                                   │   │
│  │    ├── 根据上下文自动选择工具                                  │   │
│  │    ├── 判断是否需要用户确认                                    │   │
│  │    ├── 并行执行独立子任务                                      │   │
│  │    └── 失败时自动降级/回退                                     │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─── Agent 执行流程 ────────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  用户输入 → 意图识别 → 任务规划 → 循环执行 → 结果汇总         │   │
│  │                              │                    │             │   │
│  │                              ▼                    │             │   │
│  │                         ┌─────────┐               │             │   │
│  │                         │ 选择工具 │               │             │   │
│  │                         │ 构造参数 │               │             │   │
│  │                         │ 执行调用 │               │             │   │
│  │                         │ 解析结果 │               │             │   │
│  │                         └────┬────┘               │             │   │
│  │                              │                    │             │   │
│  │                              ▼                    │             │   │
│  │                    需要更多步骤? ──是──→ 继续循环  │             │   │
│  │                         │                         │             │   │
│  │                        否                         │             │   │
│  │                         │                         │             │   │
│  │                         ▼                         ▼             │   │
│  │                    生成最终回复 ◄──────────────────┘             │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─── Agent 安全 ────────────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  • 文件操作仅限用户授权目录 (Tauri 安全沙箱)                  │   │
│  │  • 数据库操作仅限当前用户数据                                  │   │
│  │  • 危险操作 (删除/批量修改) 需用户确认                         │   │
│  │  • Agent 执行日志完整记录，可审计                              │   │
│  │  • Token 消耗实时显示，可设置上限                              │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Skill 库 (技能系统)

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Skill 库                                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Skill = 预定义的提示词 + 工具组合 + 输出格式                        │
│  可复用、可分享、可组合                                               │
│                                                                      │
│  ┌─── 内置 Skill ────────────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  📚 学业类                                                     │   │
│  │    ├── study-planner      — 根据课程表生成学习计划             │   │
│  │    ├── exam-prep          — 考试复习要点整理                   │   │
│  │    ├── grade-predictor    — 成绩预测与提升建议                 │   │
│  │    ├── note-summarizer    — 笔记摘要与知识提取                 │   │
│  │    └── homework-helper    — 作业思路引导 (非直接给答案)        │   │
│  │                                                                │   │
│  │  🍽️ 生活类                                                     │   │
│  │    ├── meal-advisor       — 基于营养/预算/偏好推荐餐食         │   │
│  │    ├── budget-planner     — 消费分析与预算规划                 │   │
│  │    ├── schedule-optimizer — 课程/活动时间冲突检测              │   │
│  │    └── campus-guide       — 校园设施/服务指南                  │   │
│  │                                                                │   │
│  │  ✍️ 写作类                                                     │   │
│  │    ├── essay-writer       — 论文大纲生成与润色                 │   │
│  │    ├── translator         — 多语言翻译                         │   │
│  │    ├── summarizer         — 长文摘要                           │   │
│  │    ├── email-drafter      — 邮件撰写                           │   │
│  │    └── code-assistant     — 代码生成/解释/调试                 │   │
│  │                                                                │   │
│  │  🔧 工具类                                                     │   │
│  │    ├── data-analyzer      — 数据分析 (成绩/消费趋势)          │   │
│  │    ├── chart-generator    — 自然语言生成 ECharts 配置          │   │
│  │    ├── file-converter     — 文件格式转换                       │   │
│  │    └── quick-action       — 快速操作 (创建提醒/记账)           │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─── Skill 格式 ────────────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  {                                                             │   │
│  │    "id": "meal-advisor",                                       │   │
│  │    "name": { "zh": "餐饮顾问", "en": "Meal Advisor" },        │   │
│  │    "description": "基于营养需求推荐餐食",                      │   │
│  │    "trigger": "推荐|吃什么|点餐|营养",                         │   │
│  │    "system_prompt": "你是营养顾问...",                          │   │
│  │    "tools": ["query_dining", "query_meal_log"],                │   │
│  │    "context_inject": ["recent_meals", "nutrition_goals"],      │   │
│  │    "output_format": "structured_cards",                        │   │
│  │    "i18n": { "zh": {...}, "en": {...} }                        │   │
│  │  }                                                             │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─── Skill 市场 ────────────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  • 用户可创建自定义 Skill (可视化编辑器)                      │   │
│  │  • 社区分享: 导出/导入 Skill JSON                             │   │
│  │  • 评分与评论                                                  │   │
│  │  • 按场景/模块分类浏览                                         │   │
│  │  • 一键安装到个人 Skill 列表                                   │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### MCP 库 (Model Context Protocol)

```
┌──────────────────────────────────────────────────────────────────────┐
│                        MCP 库                                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  MCP = 标准化的 AI ↔ 外部工具通信协议                                │
│  让 AI 能连接任意外部服务和数据源                                     │
│                                                                      │
│  ┌─── 内置 MCP Server ───────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  📂 filesystem     — 本地文件系统读写 (Desktop)               │   │
│  │  🗄️ sqlite         — 本地 DuckDB 查询                        │   │
│  │  🔍 web-search     — 网页搜索 (可配置搜索引擎)                │   │
│  │  📅 calendar       — 系统日历集成                             │   │
│  │  🧮 code-executor  — 代码执行沙箱 (Python/JS)                 │   │
│  │  📊 chart-gen      — ECharts 图表生成                         │   │
│  │  🌐 http-client    — HTTP 请求工具                            │   │
│  │  📧 notification   — 系统通知推送                             │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─── 用户自定义 MCP Server ─────────────────────────────────────┐   │
│  │                                                                │   │
│  │  用户可配置自己的 MCP Server 连接:                             │   │
│  │                                                                │   │
│  │  ┌─────────────────────────────────────────────────────────┐  │   │
│  │  │  MCP 连接配置                                           │  │   │
│  │  │                                                         │  │   │
│  │  │  名称: [我的笔记服务                               ]    │  │   │
│  │  │  类型: ○ stdio (本地进程)  ● sse (远程 HTTP)            │  │   │
│  │  │  URL:  [https://my-mcp-server.example.com/sse      ]    │  │   │
│  │  │  认证: [Bearer Token] [****************************]    │  │   │
│  │  │                                                         │  │   │
│  │  │  工具列表 (自动发现):                                    │  │   │
│  │  │    ✅ search_notes — 搜索笔记                           │  │   │
│  │  │    ✅ create_note  — 创建笔记                           │  │   │
│  │  │    ✅ tag_manager  — 标签管理                           │  │   │
│  │  │                                                         │  │   │
│  │  │  [测试连接]  [保存]                                     │  │   │
│  │  └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                │   │
│  │  支持的 MCP 传输协议:                                          │   │
│  │    • stdio — 本地子进程通信 (Desktop/Tauri)                   │   │
│  │    • SSE   — Server-Sent Events (远程 HTTP)                   │   │
│  │    • WebSocket — 实时双向通信                                  │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─── MCP 工具注入流程 ──────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  1. 用户配置 MCP Server 连接                                  │   │
│  │  2. 客户端连接 MCP Server，获取工具列表 (tools/list)          │   │
│  │  3. 对话时，可用工具的 schema 注入到 LLM 请求的 tools 字段    │   │
│  │  4. LLM 决定调用哪个工具 → 客户端转发到 MCP Server            │   │
│  │  5. MCP Server 执行 → 返回结果 → 注入到对话上下文             │   │
│  │  6. LLM 基于结果生成回复                                      │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### RAG 检索增强

```
┌──────────────────────────────────────────────────────────────────────┐
│                        RAG 系统                                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  用户数据 + 校园知识 → 向量检索 → 注入上下文 → 增强回复质量          │
│                                                                      │
│  ┌─── 数据源 ────────────────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  个人数据:                                                     │   │
│  │    笔记内容 / 成绩记录 / 课程信息 / 消费记录 / 日记           │   │
│  │                                                                │   │
│  │  校园知识:                                                     │   │
│  │    校规校纪 / FAQ / 课程大纲 / 教师信息 / 校园服务指南         │   │
│  │                                                                │   │
│  │  共享数据:                                                     │   │
│  │    公开笔记 / 社团资料 / 活动信息                              │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─── 向量存储 ──────────────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  嵌入模型: 用户可配 (OpenAI text-embedding-3 等)              │   │
│  │  向量存储: DuckDB (本地) / MySQL + pgvector (生产)            │   │
│  │  分块策略: 按段落/标题分块，保留元数据                         │   │
│  │  索引更新: 数据变更时自动重新索引                              │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─── 检索流程 ──────────────────────────────────────────────────┐   │
│  │                                                                │   │
│  │  用户输入 → 意图分析 → 向量检索 + 关键词检索                  │   │
│  │                    → 重排序 (Re-ranking)                       │   │
│  │                    → Top-K 结果注入上下文                      │   │
│  │                                                                │   │
│  │  检索模式:                                                     │   │
│  │    • 自动: AI 判断是否需要检索                                 │   │
│  │    • 指定: 用户明确选择搜索范围 (笔记/课程/全部)               │   │
│  │    • 禁用: 纯对话模式，不检索                                  │   │
│  │                                                                │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### AI 前端组件

```
┌──────────────────────────────────────────────────────────────────────┐
│                        AI 前端组件                                     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  <ChatPanel />        主对话面板                                      │
│    ├── 多会话管理 (标签页)                                            │
│    ├── Markdown 渲染 + 代码高亮 + LaTeX                              │
│    ├── 消息操作 (复制/重新生成/编辑/钉住)                             │
│    ├── 流式输出 (SSE)                                                │
│    ├── Token 用量实时显示                                            │
│    └── 快捷键 (/ 触发 Skill, @ 触发上下文选择)                       │
│                                                                      │
│  <AgentPanel />       Agent 执行面板                                  │
│    ├── 步骤列表 (思维链可视化)                                        │
│    ├── 工具调用卡片 (输入/输出/状态)                                  │
│    ├── 文件操作预览 (diff 视图)                                       │
│    ├── 进度条 + 预估耗时                                              │
│    └── 暂停/取消/重试                                                 │
│                                                                      │
│  <SkillMarket />      Skill 市场                                      │
│    ├── 浏览/搜索/分类                                                 │
│    ├── 详情页 (描述/示例/评价)                                        │
│    ├── 一键安装/卸载                                                  │
│    └── 创建自定义 Skill                                               │
│                                                                      │
│  <MCPConfig />        MCP 配置                                        │
│    ├── 连接列表 (添加/编辑/删除)                                      │
│    ├── 连接测试 + 工具发现                                            │
│    ├── 工具权限控制                                                   │
│    └── 连接状态监控                                                   │
│                                                                      │
│  <ContextManager />   上下文管理                                      │
│    ├── Token 用量仪表盘                                               │
│    ├── 上下文组成可视化 (饼图)                                        │
│    ├── 消息压缩历史                                                   │
│    ├── 钉住/取消钉住消息                                              │
│    └── 会话分支管理                                                   │
│                                                                      │
│  <AIInsightCard />    模块内嵌洞察                                    │
│    ├── 紧凑卡片 (出现在模块页面中)                                    │
│    ├── 一键展开为完整对话                                             │
│    └── 支持忽略/反馈                                                  │
│                                                                      │
│  <AIWritingPad />     写作辅助                                        │
│    ├── 选中文本 → AI 操作 (改写/翻译/摘要/扩展)                      │
│    ├── 内联建议 (ghost text)                                         │
│    └── 写作模板库                                                     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### AI 数据库模型

```
┌──────────────────────┐
│  ai_conversations     │  (AI 对话会话)
│──────────────────────│
│ id                    │
│ user_id               │
│ title                 │  (会话标题，自动生成)
│ module                │  (关联模块: academics/finance/...)
│ model                 │  (使用的模型)
│ source                │  (platform / custom)
│ total_tokens          │  (总 token 消耗)
│ context_state JSON    │  (上下文压缩状态)
│ pinned_message_ids    │  (钉住的消息 ID 列表)
│ parent_id             │  (分支父会话)
│ created_at            │
│ updated_at            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  ai_messages          │  (AI 消息)
│──────────────────────│
│ id                    │
│ conversation_id       │
│ role                  │  (user / assistant / system / tool)
│ content               │  (消息内容)
│ compressed_content    │  (压缩后的内容，NULL 表示未压缩)
│ compression_level     │  (0=原文 1=轻度 2=重度 3=已丢弃)
│ is_pinned             │  (是否被用户钉住)
│ token_count           │  (本条 token 数)
│ tool_calls JSON       │  (工具调用记录)
│ tool_result JSON      │  (工具返回结果)
│ created_at            │
└──────────────────────┘

┌──────────────────────┐
│  ai_skills            │  (Skill 定义)
│──────────────────────│
│ id                    │
│ user_id               │  (创建者，NULL=内置)
│ name                  │
│ name_i18n JSON        │  (多语言名称)
│ description           │
│ description_i18n JSON │
│ trigger_patterns      │  (触发关键词)
│ system_prompt         │
│ tools JSON            │  (需要的工具列表)
│ context_inject JSON   │  (注入的上下文配置)
│ output_format         │
│ is_public             │  (是否公开到市场)
│ install_count         │  (安装次数)
│ rating                │  (平均评分)
│ created_at            │
└──────────────────────┘

┌──────────────────────┐
│  ai_mcp_connections   │  (MCP 连接配置)
│──────────────────────│
│ id                    │
│ user_id               │
│ name                  │
│ transport             │  (stdio / sse / websocket)
│ endpoint              │  (URL 或命令)
│ auth_type             │  (none / bearer / basic)
│ auth_data             │  (加密存储的认证信息)
│ tools_cache JSON      │  (缓存的工具列表)
│ enabled               │
│ last_connected_at     │
│ created_at            │
└──────────────────────┘

┌──────────────────────┐
│  ai_usage_logs        │  (AI 用量记录)
│──────────────────────│
│ id                    │
│ user_id               │
│ conversation_id       │
│ model                 │
│ source                │  (platform / custom)
│ prompt_tokens         │
│ completion_tokens     │
│ total_tokens          │
│ points_consumed       │  (平台模式消耗的积分)
│ latency_ms            │
│ created_at            │
└──────────────────────┘
```

---

## i18n 国际化方案

- **前端**: `vue-i18n`，语言包按模块拆分
- **后端**: `python-i18n`，API 错误消息国际化
- **文档**: VitePress 多语言路由
- **Admin**: 共享 `shared/i18n/` 语言包
- 语言文件结构:

```
shared/i18n/
├── zh-CN/
│   ├── common.json        # 通用
│   ├── auth.json          # 认证
│   ├── academics.json
│   ├── campus.json
│   ├── finance.json
│   ├── social.json
│   ├── health.json
│   ├── ai.json
│   └── points.json        # 积分系统
└── en/
    ├── common.json
    ├── auth.json
    ├── academics.json
    ├── campus.json
    ├── finance.json
    ├── social.json
    ├── health.json
    ├── ai.json
    └── points.json
```

---

## 文档方案 (VitePress)

```
docs/
├── .vitepress/
│   └── config.ts              # 中英双语导航配置
├── guide/
│   ├── index.md               # 快速开始
│   ├── installation.md        # 安装指南 (含 Docker)
│   ├── architecture.md        # 架构说明
│   ├── offline.md             # 离线使用说明
│   └── contributing.md        # 贡献指南
├── modules/
│   ├── users.md               # 用户 & 积分系统
│   ├── academics.md           # 学业管理
│   ├── campus-life.md         # 校园生活
│   ├── finance.md             # 财务管理
│   ├── social.md              # 社交通讯
│   ├── health.md              # 健康管理
│   ├── ai-hub.md              # AI 中枢
│   └── ocr.md                 # OCR 功能
├── api/
│   ├── backend.md             # 后端 REST API 文档
│   ├── websocket.md           # WebSocket 协议
│   ├── ai.md                  # AI 服务 API
│   ├── sync.md                # 数据同步协议
│   └── auth.md                # 认证流程
├── admin/
│   ├── index.md               # Admin 使用指南
│   ├── permissions.md         # 权限说明
│   └── deployment.md          # 部署指南
├── zh/                        # 中文文档 (镜像结构)
└── index.md                   # 首页
```

---

## Docker 部署

```yaml
# deploy/docker-compose.yml (生产环境)
services:
  server:
    build: ./server
    ports: ["8000:8000"]
    env_file: .env
    depends_on: [mysql]
    volumes: ["uploads:/app/uploads"]

  web:
    build: ./web
    ports: ["3000:80"]

  admin:
    build: ./admin
    ports: ["3001:80"]

  mysql:
    image: mysql:8.0
    volumes: ["mysqldata:/var/lib/mysql"]
    environment:
      MYSQL_DATABASE: campuslife
      MYSQL_USER: campus
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    ports: ["3306:3306"]

volumes:
  mysqldata:
  uploads:
```
