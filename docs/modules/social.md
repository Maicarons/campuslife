# 社交通讯

## 概览

社交通讯模块包含论坛、问答等社交功能。

## 子模块

### 💬 论坛

| 特性 | 说明 |
|------|------|
| **功能** | 帖子发布、评论、点赞 |
| **同步范围** | 全平台可见 |

**字段：** 标题、内容、标签、作者、点赞数、浏览量、创建时间

### ❓ 问答

| 特性 | 说明 |
|------|------|
| **功能** | 提问、回答、投票、标记已解决 |

**字段：** 标题、内容、标签、回答列表、浏览量、投票数、是否已解决

## 数据模型

```typescript
interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  tags: string[]
  views: number
  votes: number
  createdAt: number
}

interface Question {
  id: string
  title: string
  content: string
  tags: string[]
  author: string
  answers: Answer[]
  views: number
  votes: number
  isResolved: boolean
  createdAt: number
}

interface Answer {
  id: string
  content: string
  author: string
  votes: number
  isAccepted: boolean
  createdAt: number
}
```

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/social/forum` | 获取帖子列表 |
| POST | `/api/v1/social/forum` | 创建帖子 |
| GET | `/api/v1/social/forum/:id` | 获取帖子详情 |
| POST | `/api/v1/social/forum/:id/comments` | 发表评论 |
| GET | `/api/v1/social/forum/:id/comments` | 获取评论列表 |
