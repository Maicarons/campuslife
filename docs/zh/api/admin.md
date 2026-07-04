# 管理后台 API

管理端点需要管理员角色（`super_admin` / `school_admin` / `college_admin` 等）。

## 仪表盘

```
GET /api/v1/admin/dashboard
```

返回管理员权限范围内的统计数据。

## 用户管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/admin/users` | 用户列表 |
| PUT | `/api/v1/admin/users/:id` | 更新用户 |

## 内容审核

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/admin/content` | 待审核内容 |
| PUT | `/api/v1/admin/content/:id/approve` | 通过 |
| PUT | `/api/v1/admin/content/:id/reject` | 驳回 |

## 纠错审核

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/admin/corrections` | 待审核纠错 |
| PUT | `/api/v1/admin/corrections/:id/approve` | 通过 |
| PUT | `/api/v1/admin/corrections/:id/reject` | 驳回 |

## 积分管理（仅 super_admin）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/admin/points/rules` | 积分规则 |
| PUT | `/api/v1/admin/points/rules` | 更新规则 |
| POST | `/api/v1/admin/points/adjust` | 手动调整积分 |

## 系统管理（仅 super_admin）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/admin/settings` | 系统设置 |
| PUT | `/api/v1/admin/settings` | 更新设置 |
| GET | `/api/v1/admin/logs` | 操作日志 |
| GET | `/api/v1/admin/ai-config` | AI 配置 |
| PUT | `/api/v1/admin/ai-config` | 更新 AI 配置 |
