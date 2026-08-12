# API Reference

Base URL: `http://localhost:8000/api/v1`

## Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <jwt_token>
```

Obtain a token via `POST /api/v1/auth/login`.

## Response Format

```json
{
  "id": 1,
  "name": "example"
}
```

Error responses:

```json
{
  "detail": "Error message"
}
```

## Endpoints Overview

| Group | Prefix | Description |
|-------|--------|-------------|
| Auth | `/auth` | Login, register, token refresh |
| Org | `/org` | Organization hierarchy |
| Academics | `/academics` | Courses, grades, exams, notes |
| Campus | `/campus` | Dining, lost-found, events, bus |
| Finance | `/finance` | Transactions, scholarships, jobs |
| Social | `/social` | Forum, Q&A |
| Health | `/health` | Exercise, sleep, mood |
| AI | `/ai` | Chat, skills, MCP, RAG, agent |
| Upload | `/upload` | Image and data upload, OCR |
| Corrections | `/corrections` | Data correction requests |
| Admin | `/admin` | Admin dashboard and management |
