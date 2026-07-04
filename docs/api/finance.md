# Finance API

## Transactions

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/finance/transactions` | List transactions |
| POST | `/api/v1/finance/transactions` | Create transaction |
| DELETE | `/api/v1/finance/transactions/:id` | Delete transaction |

**Body:**

```json
{
  "type": "expense",
  "amount": 15.5,
  "category": "餐饮",
  "description": "午餐 - 食堂二楼",
  "date": "2025-01-15"
}
```

## Scholarships

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/finance/scholarships` | List scholarships (scope=school/college) |

## Jobs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/finance/jobs` | List part-time jobs |
