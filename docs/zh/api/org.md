# 组织架构 API

## 级联查询

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/org/schools` | 学校列表 |
| GET | `/api/v1/org/schools/:schoolId/colleges` | 学校下的学院 |
| GET | `/api/v1/org/colleges/:collegeId/majors` | 学院下的专业 |
| GET | `/api/v1/org/majors/:majorId/grades` | 专业下的年级 |
| GET | `/api/v1/org/grades/:gradeId/classes` | 年级下的班级 |

## 管理员管理

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/org/admin-apply` | 申请成为管理员 |
| PUT | `/api/v1/org/admin-apply/:id` | 审批申请 |
| POST | `/api/v1/org/admin-appoint` | 指派管理员 |
| DELETE | `/api/v1/org/admins/:id` | 撤销管理员 |

## 组织管理 (管理员)

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/admin/org/schools` | 添加学校 |
| POST | `/api/v1/admin/org/colleges` | 添加学院 |
| POST | `/api/v1/admin/org/majors` | 添加专业 |
| POST | `/api/v1/admin/org/grades` | 添加年级 |
| POST | `/api/v1/admin/org/classes` | 添加班级 |
| PUT | `/api/v1/admin/org/:type/:id` | 编辑 |
| DELETE | `/api/v1/admin/org/:type/:id` | 删除 |
