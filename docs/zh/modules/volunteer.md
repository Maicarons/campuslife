# 志愿公益

## 概览

志愿公益模块连接学生与校园及社区的志愿服务和公益活动。

## 功能

| 特性 | 说明 |
|------|------|
| 浏览 | 查看志愿活动的时间、地点与名额 |
| 报名 | 报名参加活动 |
| 时长 | 记录并展示志愿服务时长 |
| 证书 | 生成志愿服务证明 |
| 同步范围 | 学校 / 学院 |
| 上传积分 | +8（审核通过后发放） |

## 数据字段

- 标题、描述
- 地点、时间
- 名额、已报名
- 状态 (recruiting/ongoing/finished)

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/volunteer/activities | 活动列表 |
| POST | /api/v1/volunteer/activities | 创建活动 |
| GET | /api/v1/volunteer/activities/:id | 详情 |
| POST | /api/v1/volunteer/activities/:id/signup | 报名 |
| GET | /api/v1/volunteer/records | 我的志愿记录 |
