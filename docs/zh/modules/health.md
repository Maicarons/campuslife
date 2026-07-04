# 健康管理

## 概览

帮助学生追踪运动、作息和心理健康数据。

## 子模块

### 🏃 运动记录
记录步数/运动数据、设定目标，AI 生成个性化运动计划。

### 😴 作息管理
睡眠追踪、提醒闹钟，AI 提供作息优化建议。

### 😊 心理健康
心情日记、压力评估，AI 情绪分析和健康建议。

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/health/exercise` | 运动记录列表 |
| POST | `/api/v1/health/exercise` | 创建运动记录 |
| GET | `/api/v1/health/sleep` | 作息记录列表 |
| POST | `/api/v1/health/sleep` | 创建作息记录 |
| GET | `/api/v1/health/mood` | 心情记录列表 |
| POST | `/api/v1/health/mood` | 创建心情记录 |
