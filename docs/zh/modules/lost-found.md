# 失物招领

## 概览

失物招领模块帮助学生在校园内发布和检索遗失与招领信息。

## 功能

| 特性 | 说明 |
|------|------|
| 发布 | 发布遗失/招领信息，含照片、地点、联系方式 |
| 搜索 | 按类型、分类、地点筛选 |
| 同步范围 | 学校（全校共享） |
| AI | 图像识别辅助自动分类 |
| OCR | ✅ 图片文字识别 |
| 上传积分 | +5（审核通过后发放） |

## 数据字段

- 类型 (lost/found)
- 标题、描述
- 地点、联系方式
- 分类
- 状态 (pending/approved/resolved)

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/campus/lost-found | 失物招领列表 |
| POST | /api/v1/campus/lost-found | 发布失物招领 |
| GET | /api/v1/campus/lost-found/:id | 详情 |
| PUT | /api/v1/campus/lost-found/:id | 更新 |
| DELETE | /api/v1/campus/lost-found/:id | 删除 |
