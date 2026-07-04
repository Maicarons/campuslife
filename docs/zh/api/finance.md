# 财务管理 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/finance/transactions` | 收支记录列表 |
| POST | `/api/v1/finance/transactions` | 创建收支记录 |
| DELETE | `/api/v1/finance/transactions/:id` | 删除记录 |
| GET | `/api/v1/finance/scholarships` | 奖学金列表 |
| GET | `/api/v1/finance/jobs` | 兼职列表 |

**创建收支记录请求体：**

```json
{
  "type": "expense",
  "amount": 15.5,
  "category": "餐饮",
  "description": "午餐 - 食堂二楼",
  "date": "2025-01-15"
}
```
