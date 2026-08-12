# 二手市场

## 概览

二手市场是学生校园二手交易平台，方便买卖闲置物品。

## 功能

| 特性 | 说明 |
|------|------|
| 发布 | 发布二手商品，含照片、价格、描述 |
| 浏览 | 分类与关键词搜索，按成色和价格筛选 |
| 沟通 | 通过社交通讯模块联系卖家 |
| 同步范围 | 学校 / 学院 |
| 上传积分 | +3（审核通过后发放） |

## 数据字段

- 标题、描述
- 价格、原价
- 分类、成色 (new/like-new/good/fair)
- 图片
- 状态 (available/reserved/sold)

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/marketplace/items | 商品列表 |
| POST | /api/v1/marketplace/items | 发布商品 |
| GET | /api/v1/marketplace/items/:id | 详情 |
| PUT | /api/v1/marketplace/items/:id | 更新 |
| DELETE | /api/v1/marketplace/items/:id | 删除 |
