# Academics API

## Courses

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/academics/courses` | List courses (includes shared data within scope) |
| POST | `/api/v1/academics/courses` | Create course (with scope) |
| PUT | `/api/v1/academics/courses/:id` | Update course |
| DELETE | `/api/v1/academics/courses/:id` | Delete course |

**Create Course Body:**

```json
{
  "name": "数据结构",
  "teacher": "张教授",
  "credits": 3,
  "classroom": "教学楼A-301",
  "day_of_week": 1,
  "start_period": 1,
  "end_period": 2,
  "semester": "2024-2025-1",
  "week_range": "1-16周",
  "scope_type": "class",
  "scope_id": 1
}
```

## Grades

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/academics/grades` | List grades |
| POST | `/api/v1/academics/grades` | Create grade record |

## Assignments

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/academics/assignments` | List assignments |
| POST | `/api/v1/academics/assignments` | Create assignment |
| PUT | `/api/v1/academics/assignments/:id` | Update assignment |
| DELETE | `/api/v1/academics/assignments/:id` | Delete assignment |

## Exams

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/academics/exams` | List exams |
| POST | `/api/v1/academics/exams` | Create exam (with scope) |

## Notes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/academics/notes` | List notes |
| POST | `/api/v1/academics/notes` | Create note |
| PUT | `/api/v1/academics/notes/:id` | Update note |
| DELETE | `/api/v1/academics/notes/:id` | Delete note |

## Classrooms

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/academics/classrooms/available` | Query available classrooms |
| GET | `/api/v1/academics/classrooms/buildings` | List buildings |
