# Campus API

## Dining (食堂 / 外卖 / 周边)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/campus/dining` | List dining spots (filter by type) |
| GET | `/api/v1/campus/dining/:id` | Dining spot detail (with menu + reviews) |
| GET | `/api/v1/campus/dining/:id/menu` | Menu items |
| GET | `/api/v1/campus/dining/:id/reviews` | Reviews |
| POST | `/api/v1/campus/dining` | Upload dining spot (scope=school) |
| POST | `/api/v1/campus/dining/:id/menu` | Upload menu item |
| POST | `/api/v1/campus/dining/:id/reviews` | Post review |
| PUT | `/api/v1/campus/dining/:id/review` | Admin review/approve |
| GET | `/api/v1/campus/dining/favorites` | My favorites |
| POST | `/api/v1/campus/dining/favorites` | Toggle favorite |
| GET | `/api/v1/campus/dining/recommend` | AI recommendation |

**Type filter:** `cafeteria` / `takeout` / `nearby`

## Meal Log (餐饮日记)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/campus/meal-log` | My meal logs |
| POST | `/api/v1/campus/meal-log` | Record a meal |
| GET | `/api/v1/campus/meal-log/nutrition` | Nutrition stats |
| GET | `/api/v1/campus/meal-log/spending` | Spending stats |

## Lost & Found

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/campus/lost-found` | List items (filter by status) |
| POST | `/api/v1/campus/lost-found` | Post item (scope=school) |

**Status filter:** `lost` / `found` / `claimed`

## Events

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/campus/events` | List events |
| POST | `/api/v1/campus/events` | Post event (scope=school/college) |

## Announcements

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/campus/announcements` | List announcements |
| POST | `/api/v1/campus/announcements` | Post announcement (scope=any) |

## Bus Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/campus/bus` | List bus routes |
