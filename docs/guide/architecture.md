# Architecture

## Overview

CampusLife uses a front-end / back-end separated architecture. The frontend communicates with the backend over HTTP / WebSocket.

```
+----------------------------------------------------------+
|                       Client Layer                       |
|  +---------------+  +----------------+  +-------------+   |
|  | Web Frontend  |  | Tauri Desktop  |  | Android    |   |
|  | Vue 3 + EP    |  | Rust + WV2     |  | Capacitor  |   |
|  +------+--------+  +-------+--------+  +-----+-------+   |
|         +--------------------------+----------+          |
+------------------------------------+---------------------+
                                     |
                                     v
                       FastAPI Backend (server/)
  +---------+  +---------+  +-------------+  +-----------+
  | Auth    |  | API     |  | WebSocket   |  | AI Proxy  |
  | (JWT)   |  | (REST)  |  | (realtime)  |  | (OpenAI)  |
  +---------+  +---------+  +-------------+  +-----------+
+----------------------------------------------------------+
                     Data Layer
  +------------------+   +-------------------------------+
  | SQLite / MySQL   |   | Local file storage (uploads/) |
  +------------------+   +-------------------------------+
```

## Frontend structure (`src/`)

```
src/
+-- api/index.ts          # Axios instance + all API groups
+-- router/index.ts       # Route table (login + 10 modules)
+-- stores/               # Pinia stores (composition style)
+-- views/                # Page views (one folder per module)
+-- components/           # Reusable components (layout/, common/)
+-- composables/          # Re-exports all stores
+-- types/index.ts        # TypeScript type definitions
+-- utils/helpers.ts      # Utility functions
+-- i18n/                 # Internationalization (zh-CN, en)
+-- mock/data.ts          # Frontend mock data
+-- assets/styles/        # SCSS (tokens.scss, base.scss)
```

## Backend structure (`server/`)

```
server/
+-- app/
|   +-- main.py           # FastAPI entry + route registration
|   +-- database.py       # SQLAlchemy engine + Session
|   +-- core/             # Config (config.py), JWT (security.py)
|   +-- models/           # SQLAlchemy models
|   +-- schemas/          # Pydantic schemas
|   +-- api/v1/           # API routes (auth/org/academics/campus/ai)
|   +-- services/         # Business logic layer
+-- tests/                # Backend tests
+-- pyproject.toml        # Python dependencies
+-- .env.example          # Environment variable template
```

## The 10 functional modules

| # | Module | Route | Store |
|---|--------|-------|-------|
| 1 | AI Assistant | /assistant | useAssistantStore |
| 2 | Academics | /academics | useAcademicsStore |
| 3 | Campus Life | /campus | useCampusStore |
| 4 | Finance | /finance | useFinanceStore |
| 5 | Lost & Found | /lost-found | useLostFoundStore |
| 6 | Marketplace | /marketplace | useMarketplaceStore |
| 7 | Q&A Plaza | /qa | useQAStore |
| 8 | Social | /social | useSocialStore |
| 9 | Health | /health | useHealthStore |
| 10 | Volunteer | /volunteer | useVolunteerStore |

## Authentication flow

```
Login -> Server returns a JWT token
     -> Frontend stores it in localStorage('campuslife-token')
     -> Every request sends it via Authorization: Bearer <token>
     -> On 401 -> Clear token -> Redirect to /login
```

## Data sync strategy

- **Uploading data** - The user picks a scope -> the matching-level admin reviews it -> on approval it syncs to all users in that scope.
- **Offline-first** - Locally cached synced data; read/write works offline, bidirectional sync runs when online.
- **Conflict resolution** - Based on timestamp + version fields, using a Last-Write-Wins policy.
