# Deployment

## Docker Deployment

### Prerequisites

- Docker & Docker Compose
- Git

### Quick Start

```bash
git clone https://github.com/campuslife/campuslife.git
cd campuslife/deploy

# Copy and edit environment file
cp ../server/.env.example ../server/.env

# Start all services
docker-compose up -d
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| frontend | 80 | Nginx serving Vue SPA |
| backend | 8000 | FastAPI (Uvicorn) |
| database | 3306 | MySQL 8 |

### Production Build

```bash
# Build frontend
cd .. && npm run build

# Build and start
cd deploy
docker-compose -f docker-compose.prod.yml up -d --build
```

## Manual Deployment

### Backend

```bash
cd server
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend

```bash
npm run build
# Serve dist/ with Nginx or any static file server
```

### Nginx Config

```nginx
server {
    listen 80;
    server_name campuslife.example.com;

    # Frontend
    location / {
        root /var/www/campuslife/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket
    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | — | JWT signing key (required) |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Token expiry (24h) |
| `DATABASE_URL` | `sqlite:///./campuslife.db` | Database URL |
| `UPLOAD_DIR` | `./uploads` | File upload directory |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Allowed CORS origins |
