# 认证 API

## 注册

```
POST /api/v1/auth/register
```

**请求体：**

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

## 登录

```
POST /api/v1/auth/login
```

**请求体：** `{ "username": "string", "password": "string" }`

**响应：** `{ "access_token": "eyJ...", "token_type": "bearer" }`

## 获取当前用户

```
GET /api/v1/auth/me
```

**请求头：** `Authorization: Bearer <token>`

## 更新当前用户

```
PUT /api/v1/auth/me
```
