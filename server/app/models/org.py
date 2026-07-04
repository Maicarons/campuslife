from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class School(Base):
    __tablename__ = "schools"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    address = Column(String(500), default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    users = relationship("User", back_populates="school", foreign_keys="User.school_id")
    colleges = relationship("College", back_populates="school")


class College(Base):
    __tablename__ = "colleges"
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    school = relationship("School", back_populates="colleges")
    majors = relationship("Major", back_populates="college")


class Major(Base):
    __tablename__ = "majors"
    id = Column(Integer, primary_key=True, index=True)
    college_id = Column(Integer, ForeignKey("colleges.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    college = relationship("College", back_populates="majors")
    grades = relationship("Grade", back_populates="major")


class Grade(Base):
    __tablename__ = "grades"
    id = Column(Integer, primary_key=True, index=True)
    major_id = Column(Integer, ForeignKey("majors.id"), nullable=False)
    year = Column(Integer, nullable=False)  # enrollment year, e.g. 2022
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    major = relationship("Major", back_populates="grades")
    classes = relationship("Class", back_populates="grade")


class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    grade_id = Column(Integer, ForeignKey("grades.id"), nullable=False)
    name = Column(String(100), nullable=False)  # e.g. "计科 2201 班"
    code = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    grade = relationship("Grade", back_populates="classes")


class OrgAdmin(Base):
    __tablename__ = "org_admins"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scope_type = Column(String(20), nullable=False)  # school/college/major/grade/class
    scope_id = Column(Integer, nullable=False)
    appointed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="active")  # active / resigned
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AdminApplication(Base):
    __tablename__ = "admin_applications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scope_type = Column(String(20), nullable=False)
    scope_id = Column(Integer, nullable=False)
    reason = Column(Text, default="")
    status = Column(String(20), default="pending")  # pending/approved/rejected
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class OrgSetting(Base):
    __tablename__ = "org_settings"
    id = Column(Integer, primary_key=True, index=True)
    scope_type = Column(String(20), nullable=False)
    scope_id = Column(Integer, nullable=False)
    has_admin = Column(Boolean, default=False)
    auto_approve = Column(Boolean, default=False)
    fallback_reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
