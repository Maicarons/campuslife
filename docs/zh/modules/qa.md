# 问答广场

## 概览

问答广场是校园问答社区，学生可以提问、回答、投票，并将最佳回答标记为已解决。

## 功能

| 特性 | 说明 |
|------|------|
| 提问 | 发布问题，支持标签与话题 |
| 回答 | 文字、图片或代码回复 |
| 投票 | 为有帮助的回答点赞 |
| 解决 | 标记最佳回答为已采纳 |
| AI | 推荐相似问题、辅助起草答案 |
| 同步范围 | 全平台可见 |

## 数据字段

- 标题、正文
- 标签
- 状态 (open/resolved)

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/qa/questions | 问题列表 |
| POST | /api/v1/qa/questions | 提问 |
| GET | /api/v1/qa/questions/:id | 问题详情 |
| POST | /api/v1/qa/questions/:id/answers | 回答 |
| POST | /api/v1/qa/answers/:id/vote | 投票 |
