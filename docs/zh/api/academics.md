# 学业管理 API

## 课程

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/academics/courses` | 获取课程列表（含范围内共享数据） |
| POST | `/api/v1/academics/courses` | 创建课程（带 scope） |
| PUT | `/api/v1/academics/courses/:id` | 更新课程 |
| DELETE | `/api/v1/academics/courses/:id` | 删除课程 |

## 成绩

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/academics/grades` | 获取成绩列表 |
| POST | `/api/v1/academics/grades` | 创建成绩记录 |

## 作业

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/academics/assignments` | 获取作业列表 |
| POST | `/api/v1/academics/assignments` | 创建作业 |
| PUT | `/api/v1/academics/assignments/:id` | 更新作业 |
| DELETE | `/api/v1/academics/assignments/:id` | 删除作业 |

## 考试

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/academics/exams` | 获取考试列表 |
| POST | `/api/v1/academics/exams` | 创建考试安排 |

## 笔记

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/academics/notes` | 获取笔记列表 |
| POST | `/api/v1/academics/notes` | 创建笔记 |
| PUT | `/api/v1/academics/notes/:id` | 更新笔记 |
| DELETE | `/api/v1/academics/notes/:id` | 删除笔记 |

## 空闲教室

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/academics/classrooms/available` | 查询空闲教室 |
| GET | `/api/v1/academics/classrooms/buildings` | 教学楼列表 |
