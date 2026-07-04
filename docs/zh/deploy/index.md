# 部署

## Docker 部署

### 环境要求

- Docker & Docker Compose
- Git

### 快速开始

```bash
git clone https://github.com/campuslife/campuslife.git
cd campuslife/deploy

# 复制并编辑环境变量
cp ../server/.env.example ../server/.env

# 启动所有服务
docker-compose up -d
```

### 服务列表

| 服务 | 端口 | 说明 |
|------|------|------|
| frontend | 80 | Nginx 提供 Vue SPA |
| backend | 8000 | FastAPI (Uvicorn) |
| database | 3306 | MySQL 8 |

### 生产构建

```bash
cd .. && npm run build
cd deploy
docker-compose -f docker-compose.prod.yml up -d --build
```

## 手动部署

### 后端

```bash
cd server
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 前端

```bash
npm run build
# 用 Nginx 或其他静态文件服务器提供 dist/ 目录
```

### Nginx 配置

```nginx
server {
    listen 80;
    server_name campuslife.example.com;

    location / {
        root /var/www/campuslife/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|-------|------|
| `SECRET_KEY` | — | JWT 签名密钥（必填） |
| `ALGORITHM` | `HS256` | JWT 算法 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Token 过期时间（24小时） |
| `DATABASE_URL` | `sqlite:///./campuslife.db` | 数据库连接 URL |
| `UPLOAD_DIR` | `./uploads` | 文件上传目录 |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | CORS 允许来源 |
