from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="student")  # super_admin / student
    avatar = Column(String(500), default="")
    nickname = Column(String(50), default="")
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    college_id = Column(Integer, ForeignKey("colleges.id"), nullable=True)
    major_id = Column(Integer, ForeignKey("majors.id"), nullable=True)
    grade_id = Column(Integer, ForeignKey("grades.id"), nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=True)
    enrollment_year = Column(Integer, nullable=True)
    points = Column(Integer, default=0)
    level = Column(Integer, default=1)
    ai_api_url = Column(String(500), default="")
    ai_api_key = Column(String(500), default="")
    ai_model = Column(String(100), default="")
    preferences = Column(JSON, default=dict)
    sync_version = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    school = relationship("School", back_populates="users", foreign_keys=[school_id])
    college = relationship("College", foreign_keys=[college_id])
    major = relationship("Major", foreign_keys=[major_id])
    grade = relationship("Grade", foreign_keys=[grade_id])
    class_ = relationship("Class", foreign_keys=[class_id])
