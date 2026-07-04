from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text
from datetime import datetime, timezone
from app.database import Base


class Correction(Base):
    __tablename__ = "corrections"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_table = Column(String(50), nullable=False)
    target_id = Column(Integer, nullable=False)
    field_name = Column(String(100), nullable=False)
    original_value = Column(Text, default="")
    corrected_value = Column(Text, default="")
    reason = Column(Text, default="")
    scope_type = Column(String(20), default="")
    scope_id = Column(Integer, nullable=True)
    status = Column(String(20), default="pending")  # pending/approved/rejected
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class PointLog(Base):
    __tablename__ = "point_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    action = Column(String(50), nullable=False)
    reference_id = Column(Integer, nullable=True)
    description = Column(String(500), default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Upload(Base):
    __tablename__ = "uploads"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    data_type = Column(String(50), nullable=False)
    scope_type = Column(String(20), default="")
    scope_id = Column(Integer, nullable=True)
    data_snapshot = Column(JSON, default=dict)
    status = Column(String(20), default="pending")  # pending/approved/rejected
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    points_awarded = Column(Integer, default=0)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AiConversation(Base):
    __tablename__ = "ai_conversations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), default="新对话")
    module = Column(String(50), default="")
    model = Column(String(100), default="")
    messages = Column(JSON, default=list)
    tokens_used = Column(Integer, default=0)
    source = Column(String(20), default="platform")  # platform / custom
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
