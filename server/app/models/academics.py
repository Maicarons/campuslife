from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text, Float
from datetime import datetime, timezone
from app.database import Base


class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scope_type = Column(String(20), default="class")
    scope_id = Column(Integer, nullable=True)
    name = Column(String(200), nullable=False)
    teacher = Column(String(100), default="")
    credits = Column(Float, default=0)
    classroom = Column(String(100), default="")
    day_of_week = Column(Integer, nullable=False)  # 1-7
    start_period = Column(Integer, nullable=False)
    end_period = Column(Integer, nullable=False)
    semester = Column(String(20), default="")
    week_range = Column(String(50), default="")
    color = Column(String(20), default="#409EFF")
    shared = Column(Boolean, default=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="approved")
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class GradeRecord(Base):
    __tablename__ = "grades_record"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_name = Column(String(200), nullable=False)
    score = Column(Float, nullable=False)
    grade_point = Column(Float, default=0)
    credits = Column(Float, default=0)
    semester = Column(String(20), default="")
    exam_type = Column(String(20), default="期末")
    ocr_image_url = Column(String(500), default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scope_type = Column(String(20), default="class")
    scope_id = Column(Integer, nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    course_name = Column(String(200), default="")
    deadline = Column(DateTime, nullable=True)
    priority = Column(String(20), default="medium")  # low/medium/high/urgent
    status = Column(String(20), default="pending")  # pending/in_progress/done
    attachments = Column(JSON, default=list)
    shared = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scope_type = Column(String(20), default="class")
    scope_id = Column(Integer, nullable=True)
    course_name = Column(String(200), nullable=False)
    exam_type = Column(String(20), default="期末")
    exam_time = Column(DateTime, nullable=True)
    location = Column(String(200), default="")
    seat_number = Column(String(20), default="")
    notes = Column(Text, default="")
    shared = Column(Boolean, default=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="approved")
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, default="")
    tags = Column(JSON, default=list)
    course_name = Column(String(200), default="")
    is_public = Column(Boolean, default=False)
    attachments = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Classroom(Base):
    __tablename__ = "classrooms"
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    building = Column(String(100), nullable=False)
    room_number = Column(String(20), nullable=False)
    capacity = Column(Integer, default=0)
    equipment = Column(JSON, default=dict)
    campus = Column(String(100), default="")
    floor = Column(Integer, default=1)


class ClassSchedule(Base):
    __tablename__ = "class_schedule"
    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    course_name = Column(String(200), nullable=False)
    teacher = Column(String(100), default="")
    day_of_week = Column(Integer, nullable=False)
    start_period = Column(Integer, nullable=False)
    end_period = Column(Integer, nullable=False)
    semester = Column(String(20), default="")
    week_range = Column(String(50), default="")
    scope_type = Column(String(20), default="class")
    scope_id = Column(Integer, nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="pending")
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
