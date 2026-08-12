---
layout: home
hero:
  name: CampusLife
  text: All-in-one Campus Life Workstation
  tagline: Vue 3 + Tauri v2 + FastAPI - a full-stack campus platform spanning academics, campus life, finance, social, and health
  image:
    src: /hero.png
    alt: CampusLife
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Architecture
      link: /guide/architecture
    - theme: alt
      text: API Reference
      link: /api/

features:
  - title: Academics
    details: Course schedule, grades, assignments, exams, notes, free classrooms
  - title: Campus Life
    details: Cafeteria menus, takeout, lost & found, events, bus routes, announcements
  - title: Finance
    details: Expense tracking, scholarships, part-time jobs
  - title: AI Hub
    details: AI assistant, Agent system, Skill marketplace, MCP integration, RAG
  - title: Health
    details: Exercise, sleep, and mood tracking
  - title: Multi-platform
    details: Web frontend + Tauri desktop + Capacitor Android

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue 3.5 + TypeScript 6 + Vite 8 + Element Plus 2 + Pinia 3 + UnoCSS |
| Desktop | Tauri v2 (Rust) |
| Mobile | Capacitor (Android) |
| Backend | FastAPI (Python >=3.11) + SQLAlchemy 2.0 + SQLite / MySQL |
| Docs | VitePress |
