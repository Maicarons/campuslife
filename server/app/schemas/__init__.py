from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# Auth schemas
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    nickname: Optional[str] = ""
    school_id: Optional[int] = None
    college_id: Optional[int] = None
    major_id: Optional[int] = None
    grade_id: Optional[int] = None
    class_id: Optional[int] = None
    enrollment_year: Optional[int] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    avatar: str
    nickname: str
    school_id: Optional[int] = None
    college_id: Optional[int] = None
    major_id: Optional[int] = None
    grade_id: Optional[int] = None
    class_id: Optional[int] = None
    enrollment_year: Optional[int] = None
    points: int
    level: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    nickname: Optional[str] = None
    avatar: Optional[str] = None
    school_id: Optional[int] = None
    college_id: Optional[int] = None
    major_id: Optional[int] = None
    grade_id: Optional[int] = None
    class_id: Optional[int] = None
    enrollment_year: Optional[int] = None
    ai_api_url: Optional[str] = None
    ai_api_key: Optional[str] = None
    ai_model: Optional[str] = None
    preferences: Optional[dict] = None


# Organization schemas
class OrgItemResponse(BaseModel):
    id: int
    name: str
    code: str
    class Config:
        from_attributes = True


class SchoolResponse(OrgItemResponse):
    address: str = ""


class CollegeResponse(OrgItemResponse):
    school_id: int


class MajorResponse(OrgItemResponse):
    college_id: int


class GradeResponse(BaseModel):
    id: int
    major_id: int
    year: int
    class Config:
        from_attributes = True


class ClassResponse(BaseModel):
    id: int
    grade_id: int
    name: str
    code: str
    class Config:
        from_attributes = True


# Academics schemas
class CourseCreate(BaseModel):
    name: str
    teacher: Optional[str] = ""
    credits: Optional[float] = 0
    classroom: Optional[str] = ""
    day_of_week: int
    start_period: int
    end_period: int
    semester: Optional[str] = ""
    week_range: Optional[str] = ""
    color: Optional[str] = "#409EFF"
    scope_type: Optional[str] = "class"
    scope_id: Optional[int] = None


class CourseResponse(BaseModel):
    id: int
    user_id: int
    name: str
    teacher: str
    credits: float
    classroom: str
    day_of_week: int
    start_period: int
    end_period: int
    semester: str
    week_range: str
    color: str
    status: str
    created_at: datetime
    class Config:
        from_attributes = True


class GradeRecordCreate(BaseModel):
    course_name: str
    score: float
    grade_point: Optional[float] = 0
    credits: Optional[float] = 0
    semester: Optional[str] = ""
    exam_type: Optional[str] = "期末"


class GradeRecordResponse(BaseModel):
    id: int
    user_id: int
    course_name: str
    score: float
    grade_point: float
    credits: float
    semester: str
    exam_type: str
    created_at: datetime
    class Config:
        from_attributes = True


class AssignmentCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    course_name: Optional[str] = ""
    deadline: Optional[datetime] = None
    priority: Optional[str] = "medium"
    scope_type: Optional[str] = "class"
    scope_id: Optional[int] = None


class AssignmentResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    course_name: str
    deadline: Optional[datetime]
    priority: str
    status: str
    created_at: datetime
    class Config:
        from_attributes = True


class ExamCreate(BaseModel):
    course_name: str
    exam_type: Optional[str] = "期末"
    exam_time: Optional[datetime] = None
    location: Optional[str] = ""
    seat_number: Optional[str] = ""
    notes: Optional[str] = ""
    scope_type: Optional[str] = "class"
    scope_id: Optional[int] = None


class ExamResponse(BaseModel):
    id: int
    user_id: int
    course_name: str
    exam_type: str
    exam_time: Optional[datetime]
    location: str
    seat_number: str
    notes: str
    status: str
    created_at: datetime
    class Config:
        from_attributes = True


class NoteCreate(BaseModel):
    title: str
    content: Optional[str] = ""
    tags: Optional[List[str]] = []
    course_name: Optional[str] = ""
    is_public: Optional[bool] = False


class NoteResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    tags: List[str]
    course_name: str
    is_public: bool
    created_at: datetime
    class Config:
        from_attributes = True


# Campus schemas
class DiningSpotResponse(BaseModel):
    id: int
    name: str
    type: str
    location: str
    rating: float
    price_level: str
    tags: list
    image_url: str
    created_at: datetime
    class Config:
        from_attributes = True


class LostFoundCreate(BaseModel):
    type: str
    title: str
    description: Optional[str] = ""
    location: Optional[str] = ""
    contact_info: Optional[str] = ""
    category: Optional[str] = "other"
    images: Optional[List[str]] = []


class LostFoundResponse(BaseModel):
    id: int
    type: str
    title: str
    description: str
    location: str
    contact_info: str
    category: str
    status: str
    images: list
    created_at: datetime
    class Config:
        from_attributes = True


class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    max_participants: int
    current_participants: int
    tags: list
    status: str
    created_at: datetime
    class Config:
        from_attributes = True


class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    priority: str
    pinned: bool
    scope_type: str
    created_at: datetime
    class Config:
        from_attributes = True


# Finance schemas
class TransactionCreate(BaseModel):
    type: str
    amount: float
    category: Optional[str] = "其他"
    description: Optional[str] = ""
    date: Optional[datetime] = None


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    type: str
    amount: float
    category: str
    description: str
    date: Optional[datetime]
    created_at: datetime
    class Config:
        from_attributes = True


# Health schemas
class ExerciseLogCreate(BaseModel):
    type: str
    duration: Optional[int] = 0
    calories: Optional[float] = 0
    distance: Optional[float] = 0
    steps: Optional[int] = 0
    note: Optional[str] = ""
    date: Optional[datetime] = None


class ExerciseLogResponse(BaseModel):
    id: int
    user_id: int
    type: str
    duration: int
    calories: float
    distance: float
    steps: int
    note: str
    date: Optional[datetime]
    created_at: datetime
    class Config:
        from_attributes = True


class SleepLogCreate(BaseModel):
    bed_time: Optional[datetime] = None
    wake_time: Optional[datetime] = None
    duration: Optional[float] = 0
    quality: Optional[int] = 3
    note: Optional[str] = ""
    date: Optional[datetime] = None


class SleepLogResponse(BaseModel):
    id: int
    user_id: int
    bed_time: Optional[datetime]
    wake_time: Optional[datetime]
    duration: float
    quality: int
    note: str
    date: Optional[datetime]
    created_at: datetime
    class Config:
        from_attributes = True


class MoodLogCreate(BaseModel):
    mood: Optional[int] = 3
    stress_level: Optional[int] = 3
    note: Optional[str] = ""
    tags: Optional[List[str]] = []
    date: Optional[datetime] = None


class MoodLogResponse(BaseModel):
    id: int
    user_id: int
    mood: int
    stress_level: int
    note: str
    tags: list
    date: Optional[datetime]
    created_at: datetime
    class Config:
        from_attributes = True


# Social schemas
class ForumPostCreate(BaseModel):
    title: str
    content: Optional[str] = ""
    category: Optional[str] = "综合"
    tags: Optional[List[str]] = []


class ForumPostResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    category: str
    tags: list
    views: int
    likes: int
    comment_count: int
    created_at: datetime
    class Config:
        from_attributes = True


class ForumCommentCreate(BaseModel):
    content: str
    parent_id: Optional[int] = None


class ForumCommentResponse(BaseModel):
    id: int
    post_id: int
    user_id: int
    content: str
    likes: int
    parent_id: Optional[int]
    created_at: datetime
    class Config:
        from_attributes = True


# AI schemas
class AiConversationCreate(BaseModel):
    title: Optional[str] = "新对话"
    module: Optional[str] = ""
    model: Optional[str] = ""


class AiConversationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    module: str
    model: str
    messages: list
    tokens_used: int
    created_at: datetime
    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    message: str
    model: Optional[str] = ""


# Point log
class PointLogResponse(BaseModel):
    id: int
    user_id: int
    amount: int
    action: str
    description: str
    created_at: datetime
    class Config:
        from_attributes = True
