# Admin API

Admin endpoints require an admin role (`super_admin`, `school_admin`, `college_admin`, etc.).

## Dashboard

```
GET /api/v1/admin/dashboard
```

Returns statistics scoped to the admin's level (registration trends, activity, module usage).

## User Management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/users` | List users (within scope) |
| PUT | `/api/v1/admin/users/:id` | Update user |
| PUT | `/api/v1/admin/users/:id/ban` | Ban user |

## Content Review

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/content` | Pending items (within scope) |
| PUT | `/api/v1/admin/content/:id/approve` | Approve |
| PUT | `/api/v1/admin/content/:id/reject` | Reject |

## Correction Review

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/corrections` | Pending corrections |
| PUT | `/api/v1/admin/corrections/:id/approve` | Approve correction |
| PUT | `/api/v1/admin/corrections/:id/reject` | Reject correction |

## Points Management (super_admin only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/points/rules` | Point rules |
| PUT | `/api/v1/admin/points/rules` | Update rules |
| POST | `/api/v1/admin/points/adjust` | Manually adjust user points |

## Organization Management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/org` | Org tree with admin status |
| POST | `/api/v1/admin/org/schools` | Add school |
| POST | `/api/v1/admin/org/colleges` | Add college |
| POST | `/api/v1/admin/org/majors` | Add major |
| POST | `/api/v1/admin/org/grades` | Add grade |
| POST | `/api/v1/admin/org/classes` | Add class |
| PUT | `/api/v1/admin/org/:type/:id` | Edit |
| DELETE | `/api/v1/admin/org/:type/:id` | Delete |

## System (super_admin only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/settings` | System settings |
| PUT | `/api/v1/admin/settings` | Update settings |
| GET | `/api/v1/admin/logs` | Operation logs |
| POST | `/api/v1/admin/backup` | Create backup |
| GET | `/api/v1/admin/backup` | List backups |

## AI Config (super_admin only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/ai-config` | Platform AI config |
| PUT | `/api/v1/admin/ai-config` | Update AI config |
