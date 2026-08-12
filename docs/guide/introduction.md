# Introduction

**CampusLife** is an all-in-one campus life workstation for university students, spanning **10 functional modules**: AI Assistant, Academics, Campus Life, Finance, Lost & Found, Marketplace, Q&A Plaza, Social, Health, and Volunteer.

## Why CampusLife

In student life, information is scattered across many platforms: course schedules live in the academic system, cafeteria menus on bulletin boards, expense tracking in Excel, and event info in WeChat groups. CampusLife brings all of this into one place, supercharged with AI, so students can manage campus life far more efficiently.

## Core Highlights

- **Organization-aware sync** - A 5-level hierarchy (School -> College -> Major -> Grade -> Class) drives scope-based data sharing and admin review.
- **AI in every module** - Smart scheduling, nutrition analysis, spending insights, and more.
- **Offline-first** - Local storage with read/write offline and automatic sync when online.
- **Multi-platform** - Web, Tauri desktop, and Capacitor Android.
- **OCR** - Snap photos to import schedules, transcripts, and receipts.
- **Points system** - Earn points by contributing shared data, boosting community activity.

## Tech Stack at a Glance

```
Client (Vue 3 + Element Plus)
  Web / Tauri Desktop / Capacitor Android
        |  HTTP / WebSocket
        v
FastAPI Backend (server/)
  Auth - API - WebSocket - AI Proxy
        |
        v
Data Layer (SQLite / MySQL + uploads/)
```

## License

[AGPL-3.0](https://github.com/Maicarons/campuslife/blob/main/LICENSE)
