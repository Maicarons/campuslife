# Organization API

## Get School List

```
GET /api/v1/org/schools
```

## Get Colleges by School

```
GET /api/v1/org/schools/:schoolId/colleges
```

## Get Majors by College

```
GET /api/v1/org/colleges/:collegeId/majors
```

## Get Grades by Major

```
GET /api/v1/org/majors/:majorId/grades
```

## Get Classes by Grade

```
GET /api/v1/org/grades/:gradeId/classes
```

## Admin Endpoints (require admin role)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/admin/org/schools` | Add school |
| POST | `/api/v1/admin/org/colleges` | Add college |
| POST | `/api/v1/admin/org/majors` | Add major |
| POST | `/api/v1/admin/org/grades` | Add grade |
| POST | `/api/v1/admin/org/classes` | Add class |
| PUT | `/api/v1/admin/org/:type/:id` | Edit org node |
| DELETE | `/api/v1/admin/org/:type/:id` | Delete org node |

## Admin Management

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/org/admin-apply` | Apply to become admin |
| PUT | `/api/v1/org/admin-apply/:id` | Approve/reject application |
| POST | `/api/v1/org/admin-appoint` | Appoint admin |
| DELETE | `/api/v1/org/admins/:id` | Remove admin |
