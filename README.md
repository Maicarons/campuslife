# 🎓 CampusLife

> All-in-one campus life workstation for university students.

[English](#campuslife) | [中文](#校园生活一站式工作站)

**CampusLife** is a full-stack campus life management platform spanning 10 functional modules - Academics, Campus Life, Finance, Lost & Found, Marketplace, Q&A Plaza, Social, Health, Volunteer, and the AI Hub - built with **Vue 3 + Tauri v2 + FastAPI**.

---

## ✨ Features

| Module | Highlights |
|--------|-----------|
| 📚 **Academics** | Course schedule, grades, assignments, exams, notes, free classrooms |
| 🍽️ **Campus Life** | Cafeteria menus, takeout, lost & found, events, bus routes, announcements |
| 💰 **Finance** | Expense tracking, scholarships, part-time jobs |
| 🔍 **Lost & Found** | Publish and search lost & found items across campus |
| 🛒 **Marketplace** | Second-hand trading for students |
| ❓ **Q&A Plaza** | Campus question-and-answer community |
| 🤝 **Social** | Forum, Q&A, community interaction |
| 🏃 **Health** | Exercise, sleep, mood tracking |
| 🌟 **Volunteer** | Volunteer opportunities and public welfare |
| 🤖 **AI Hub** | AI assistant, Agent system, Skill marketplace, MCP integration, RAG |
| 🏗️ **Multi-platform** | Web + Tauri desktop + Capacitor Android |

### Core Differentiators

- **5-level org hierarchy** - School -> College -> Major -> Grade -> Class, with scope-based data sharing and admin review
- **AI in every module** - Smart scheduling, nutrition analysis, spending insights, RAG-powered Q&A
- **Offline-first** - Local storage, read/write offline, auto-sync when online
- **OCR** - Photo import for schedules, transcripts, receipts, menus
- **Points system** - Earn points by contributing shared data, boosting community activity

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vue 3.5 + TypeScript 6 + Vite 8 + Element Plus 2 + Pinia 3 + UnoCSS |
| **Desktop** | Tauri v2 (Rust) |
| **Mobile** | Capacitor (Android) |
| **Backend** | FastAPI (Python >=3.11) + SQLAlchemy 2.0 + SQLite/MySQL |
| **Docs** | VitePress (EN + 中文) |

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- Python >= 3.11

### 1. Clone & Install

```bash
git clone https://github.com/Maicarons/campuslife.git
cd campuslife
npm install
```

### 2. Start Frontend

```bash
npm run dev
# -> http://localhost:5173
```

### 3. Start Backend

```bash
cd server
pip install -e ".[dev]"
uvicorn app.main:app --reload --port 8000
# -> http://localhost:8000/docs (Swagger UI)
```

### 4. Connect Frontend to Backend

```bash
VITE_API_URL=http://localhost:8000/api/v1 npm run dev
```

## 📦 Build

| Target | Command |
|--------|---------|
| **Web (production)** | `npm run build` |
| **Desktop (Tauri)** | `npx tauri build` |
| **Android (APK)** | `npx cap sync android && cd android && ./gradlew assembleDebug` |

## 📖 Documentation

```bash
# Dev server
npx vitepress dev docs

# Build static site
npx vitepress build docs
```

Docs are available in both **English** (default) and **中文** (`/zh/`).

## 🧪 Testing

```bash
npm run test          # Unit tests (Vitest)
npm run test:e2e      # E2E tests (Playwright)
npm run type-check    # TypeScript type check
npm run lint          # ESLint
npm run format        # Prettier
```

## 📁 Project Structure

```
campuslife/
├── src/                # Vue 3 frontend
├── src-tauri/          # Tauri desktop shell (Rust)
├── server/             # FastAPI backend (Python)
├── docs/               # VitePress documentation
├── android/            # Capacitor Android project
├── tests/              # Unit, component, and E2E tests
└── dist/               # Build output
```

## 📝 License

[AGPL-3.0](LICENSE)

---

## 校园生活一站式工作站

> 面向大学生的校园生活一站式工作站。

**CampusLife** 是一款全栈校园生活管理平台，涵盖 10 大功能模块——学业管理、校园生活、财务管理、失物招领、二手市场、问答广场、社交通讯、健康管理、志愿公益，以及 AI 中枢，基于 **Vue 3 + Tauri v2 + FastAPI** 构建。

完整中文文档请见 [docs/zh](docs/zh/index.md)。
