from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text, Float
from datetime import datetime, timezone
from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(10), nullable=False)  # income/expense
    amount = Column(Float, nullable=False)
    category = Column(String(50), default="其他")
    description = Column(String(500), default="")
    date = Column(DateTime, nullable=True)
    ocr_image_url = Column(String(500), default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Budget(Base):
    __tablename__ = "budgets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String(50), nullable=False)
    amount = Column(Float, nullable=False)
    period = Column(String(20), default="monthly")  # weekly/monthly/yearly
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Scholarship(Base):
    __tablename__ = "scholarships"
    id = Column(Integer, primary_key=True, index=True)
    scope_type = Column(String(20), default="school")
    scope_id = Column(Integer, nullable=True)
    name = Column(String(200), nullable=False)
    amount = Column(Float, nullable=False)
    requirements = Column(JSON, default=dict)
    deadline = Column(DateTime, nullable=True)
    description = Column(Text, default="")
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="approved")
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)


class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    company = Column(String(200), default="")
    location = Column(String(200), default="")
    pay = Column(String(100), default="")
    hours = Column(String(100), default="")
    contact = Column(String(200), default="")
    tags = Column(JSON, default=list)
    active = Column(Boolean, default=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
