# API 参考

基础 URL: `http://localhost:8059/api/v1`

## 认证

所有受保护的端点需要 Bearer Token：

```
Authorization: Bearer <jwt_token>
```

通过 `POST /api/v1/auth/login` 获取 Token。

## 响应格式

```json
{
  "id": 1,
  "name": "示例"
}
```

错误响应：

```json
{
  "detail": "错误信息"
}
```

## 端点总览

| 分组 | 前缀 | 说明 |
|------|------|------|
| 认证 | `/auth` | 登录、注册、Token 刷新 |
| 组织 | `/org` | 组织架构层级 |
| 学业 | `/academics` | 课程、成绩、考试、笔记 |
| 校园 | `/campus` | 餐饮、失物招领、活动、校车 |
| 财务 | `/finance` | 收支记录、奖学金、兼职 |
| 社交 | `/social` | 论坛、问答 |
| 健康 | `/health` | 运动、作息、心情 |
| AI | `/ai` | 对话、Skill、MCP、RAG、Agent |
| 上传 | `/upload` | 图片/数据上传、OCR |
| 纠错 | `/corrections` | 数据纠错申请 |
| 管理 | `/admin` | 管理后台 |
