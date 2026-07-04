# Authentication API

## Register

```
POST /api/v1/auth/register
```

**Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "nickname": "string",
  "school_id": 1,
  "college_id": 1,
  "major_id": 1,
  "grade_id": 1,
  "class_id": 1,
  "enrollment_year": 2022
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "username": "demo",
  "email": "demo@example.com",
  "role": "student",
  "points": 0,
  "level": 1
}
```

## Login

```
POST /api/v1/auth/login
```

**Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** `200 OK`

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

## Get Current User

```
GET /api/v1/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK` — User info object.

## Update Current User

```
PUT /api/v1/auth/me
```

**Body:** Partial user fields (nickname, avatar, etc.)
