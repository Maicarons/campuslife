# Academics

## Overview

The Academics module helps students manage their course schedule, grades, assignments, exams, and notes.

## Submodules

### Course Schedule

| Feature | Description |
|---------|-------------|
| View | Week / day view |
| Actions | Drag-to-schedule, conflict detection |
| Sync scope | Class / Major |
| AI | Smart scheduling suggestions |
| OCR | Yes - snap a photo to import the schedule |
| Upload points | +10 |

Fields: course name, teacher, credits, classroom, weekday, period, semester, week range, color.

### Grade Tracking

| Feature | Description |
|---------|-------------|
| Features | GPA calculation, trend charts, credit statistics |
| Sync scope | Personal |
| AI | Grade prediction, study advice |
| OCR | Yes - screenshot import of transcripts |

Fields: course name, score, grade point, credits, semester, exam type (final / makeup / retake).

### Assignment Management

| Feature | Description |
|---------|-------------|
| Features | Due-date reminders, priority, attachments |
| Sync scope | Class |
| AI | Parse assignment requirements, smart reminders |
| OCR | Yes - snap a photo to capture assignments |

Fields: title, description, course name, due date, priority (low / medium / high / urgent), status.

### Exam Schedule

| Feature | Description |
|---------|-------------|
| Features | Exam calendar, countdown, review plan |
| Sync scope | Class / Major / Grade |
| AI | Generate a personalized review plan |
| OCR | Yes - snap a photo to import exam notices |
| Upload points | +10 |

Fields: course name, exam type, time, location, seat number, note.

### Notes System

| Feature | Description |
|---------|-------------|
| Format | Rich text + Markdown |
| Features | Tags, search, public / private |
| AI | Note summary, keyword extraction |
| OCR | Yes - image to text |

### Free Classrooms

| Feature | Description |
|---------|-------------|
| Query | Filter by time and building |
| Sync scope | School |
| Upload points | +3 |

## Data model

```typescript
// Course
interface Course {
  id: string
  name: string
  teacher: string
  credits: number
  classroom: string
  day_of_week: number   // 1-7
  start_period: number
  end_period: number
  semester: string
  week_range: string    // "weeks 1-16"
  color: string
  shared: boolean
  scope_type: 'class' | 'major'
  scope_id: number
  status: 'pending' | 'approved' | 'rejected'
}

// Grade
interface GradeRecord {
  id: string
  course_name: string
  score: number
  grade_point: number
  credits: number
  semester: string
  exam_type: 'final' | 'makeup' | 'retake'
  ocr_image_url?: string
}
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/academics/courses | List courses |
| POST | /api/v1/academics/courses | Create a course (with scope) |
| PUT | /api/v1/academics/courses/:id | Update a course |
| DELETE | /api/v1/academics/courses/:id | Delete a course |
| GET | /api/v1/academics/grades | List grades |
| POST | /api/v1/academics/grades | Create a grade record |
| GET | /api/v1/academics/assignments | List assignments |
| POST | /api/v1/academics/assignments | Create an assignment |
| GET | /api/v1/academics/exams | List exams |
| POST | /api/v1/academics/exams | Create an exam schedule |
| GET | /api/v1/academics/notes | List notes |
| POST | /api/v1/academics/notes | Create a note |
| GET | /api/v1/academics/classrooms/available | Query free classrooms |
