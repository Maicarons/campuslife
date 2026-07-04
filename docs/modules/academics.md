# 学业管理

## 概览

学业管理模块帮助学生管理课程表、成绩、作业、考试和笔记。

## 子模块

### 📅 课程表

| 特性 | 说明 |
|------|------|
| **视图** | 周视图 / 日视图 |
| **操作** | 拖拽排课、冲突检测 |
| **同步范围** | 班级 / 专业 |
| **AI** | 智能排课建议 |
| **OCR** | ✅ 拍照导入课程表 |
| **上传积分** | +10 |

**字段：** 课程名、教师、学分、教室、星期几、节次、学期、周次范围、颜色

### 📊 成绩追踪

| 特性 | 说明 |
|------|------|
| **功能** | GPA 计算、趋势图表、学分统计 |
| **同步范围** | 个人 |
| **AI** | 成绩预测、学习建议 |
| **OCR** | ✅ 截图导入成绩单 |

**字段：** 课程名、分数、绩点、学分、学期、考试类型（期末/补考/重修）

### 📝 作业管理

| 特性 | 说明 |
|------|------|
| **功能** | 截止日期提醒、优先级、附件 |
| **同步范围** | 班级 |
| **AI** | 解析作业要求、智能提醒 |
| **OCR** | ✅ 拍照识别作业 |

**字段：** 标题、描述、课程名、截止日期、优先级（low/medium/high/urgent）、状态

### 📋 考试安排

| 特性 | 说明 |
|------|------|
| **功能** | 考试日历、倒计时、复习计划 |
| **同步范围** | 班级 / 专业 / 年级 |
| **AI** | 生成个性化复习计划 |
| **OCR** | ✅ 拍照导入考试通知 |
| **上传积分** | +10 |

**字段：** 课程名、考试类型、时间、地点、座位号、备注

### 📓 笔记系统

| 特性 | 说明 |
|------|------|
| **格式** | 富文本 + Markdown |
| **功能** | 标签、搜索、公开/私密 |
| **AI** | 笔记摘要、关键词提取 |
| **OCR** | ✅ 图片转文字 |

### 🏫 空闲教室

| 特性 | 说明 |
|------|------|
| **查询** | 按时间、教学楼筛选 |
| **同步范围** | 学校 |
| **上传积分** | +3 |

## 数据模型

```typescript
// 课程
interface Course {
  id: string
  name: string
  teacher: string
  credits: number
  classroom: string
  day_of_week: number   // 1-7
  start_period: number
  end_period: number
  semester: string
  week_range: string    // "1-16周"
  color: string
  shared: boolean
  scope_type: 'class' | 'major'
  scope_id: number
  status: 'pending' | 'approved' | 'rejected'
}

// 成绩
interface GradeRecord {
  id: string
  course_name: string
  score: number
  grade_point: number
  credits: number
  semester: string
  exam_type: 'final' | 'makeup' | 'retake'
  ocr_image_url?: string
}
```

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/academics/courses` | 获取课程列表 |
| POST | `/api/v1/academics/courses` | 创建课程（带 scope） |
| PUT | `/api/v1/academics/courses/:id` | 更新课程 |
| DELETE | `/api/v1/academics/courses/:id` | 删除课程 |
| GET | `/api/v1/academics/grades` | 获取成绩列表 |
| POST | `/api/v1/academics/grades` | 创建成绩记录 |
| GET | `/api/v1/academics/assignments` | 获取作业列表 |
| POST | `/api/v1/academics/assignments` | 创建作业 |
| GET | `/api/v1/academics/exams` | 获取考试列表 |
| POST | `/api/v1/academics/exams` | 创建考试安排 |
| GET | `/api/v1/academics/notes` | 获取笔记列表 |
| POST | `/api/v1/academics/notes` | 创建笔记 |
| GET | `/api/v1/academics/classrooms/available` | 查询空闲教室 |
