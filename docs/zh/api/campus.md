# 校园生活 API

## 餐饮

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/campus/dining` | 餐饮点列表（支持类型筛选） |
| GET | `/api/v1/campus/dining/:id` | 餐饮点详情（含菜品+评价） |
| GET | `/api/v1/campus/dining/:id/menu` | 菜品列表 |
| GET | `/api/v1/campus/dining/:id/reviews` | 评价列表 |
| POST | `/api/v1/campus/dining` | 上传餐饮点 |
| POST | `/api/v1/campus/dining/:id/menu` | 上传菜品 |
| POST | `/api/v1/campus/dining/:id/reviews` | 发表评价 |
| GET | `/api/v1/campus/dining/recommend` | AI 推荐 |

## 失物招领

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/campus/lost-found` | 失物招领列表 |
| POST | `/api/v1/campus/lost-found` | 发布失物招领 |

## 活动

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/campus/events` | 活动列表 |
| GET | `/api/v1/campus/announcements` | 公告列表 |
| GET | `/api/v1/campus/bus` | 校车时刻 |
