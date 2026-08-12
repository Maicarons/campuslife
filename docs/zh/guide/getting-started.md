# 快速开始

## 环境要求

| 工具 | 版本 | 用途 |
|------|------|------|
| Node.js | ≥18 | 前端开发 |
| npm | ≥9 | 包管理 |
| Python | ≥3.11 | 后端运行 |
| Rust | ≥1.77 | Tauri 桌面端（可选） |
| Android SDK | — | 移动端编译（可选） |

## 1. 克隆项目

```bash
git clone https://github.com/Maicarons/campuslife.git
cd campuslife
```

## 2. 安装前端依赖

```bash
npm install
```

## 3. 启动前端开发服务器

```bash
npm run dev
# → http://localhost:5173
```

## 4. 启动后端

```bash
cd server

# 安装 Python 依赖
pip install -e ".[dev]"

# 启动 FastAPI
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000/docs (Swagger UI)
```

## 5. 配置前端 API 地址

前端默认连接 `http://localhost:8000/api/v1`。如后端端口不同，通过环境变量指定：

```bash
VITE_API_URL=http://localhost:8000/api/v1 npm run dev
```

或创建 `.env` 文件：

```
VITE_API_URL=http://localhost:8000/api/v1
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run test` | 运行单元测试 (Vitest) |
| `npm run test:e2e` | 运行 E2E 测试 (Playwright) |
| `npm run type-check` | TypeScript 类型检查 |
| `npm run lint` | ESLint 检查 |
| `npm run format` | Prettier 格式化 |

## Tauri 桌面端

```bash
npx tauri dev   # 开发模式
npx tauri build # 构建安装包
```

## Capacitor Android

```bash
npm install @capacitor/core @capacitor/android
npx cap add android
npx cap sync android
cd android && JAVA_HOME=/path/to/jdk-21 ./gradlew assembleDebug
```
