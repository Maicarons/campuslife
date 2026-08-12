# Getting Started

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | >=18 | Frontend dev |
| npm | >=9 | Package manager |
| Python | >=3.11 | Backend runtime |
| Rust | >=1.77 | Tauri desktop (optional) |
| Android SDK | - | Mobile build (optional) |

## 1. Clone

```bash
git clone https://github.com/Maicarons/campuslife.git
cd campuslife
```

## 2. Install frontend dependencies

```bash
npm install
```

## 3. Start the frontend dev server

```bash
npm run dev
# -> http://localhost:5173
```

## 4. Start the backend

```bash
cd server

# Install Python dependencies
pip install -e ".[dev]"

# Start FastAPI
uvicorn app.main:app --reload --port 8000
# -> http://localhost:8000/docs (Swagger UI)
```

## 5. Connect the frontend to the backend

The frontend connects to `http://localhost:8000/api/v1` by default. If your backend runs on a different port, set it via an environment variable:

```bash
VITE_API_URL=http://localhost:8000/api/v1 npm run dev
```

Or create a `.env` file:

```
VITE_API_URL=http://localhost:8000/api/v1
```

## Common commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run type-check` | TypeScript type check |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |

## Tauri desktop

```bash
npx tauri dev    # dev mode
npx tauri build  # build installer
```

## Capacitor Android

```bash
npm install @capacitor/core @capacitor/android
npx cap add android
npx cap sync android
cd android && JAVA_HOME=/path/to/jdk-21 ./gradlew assembleDebug
```
