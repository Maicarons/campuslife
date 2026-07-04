from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text, Float
from datetime import datetime, timezone
from app.database import Base


class ExerciseLog(Base):
    __tablename__ = "exercise_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False)  # running/walking/cycling/gym/...
    duration = Column(Integer, default=0)  # minutes
    calories = Column(Float, default=0)
    distance = Column(Float, default=0)  # km
    steps = Column(Integer, default=0)
    note = Column(Text, default="")
    date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class SleepLog(Base):
    __tablename__ = "sleep_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bed_time = Column(DateTime, nullable=True)
    wake_time = Column(DateTime, nullable=True)
    duration = Column(Float, default=0)  # hours
    quality = Column(Integer, default=3)  # 1-5
    note = Column(Text, default="")
    date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class MoodLog(Base):
    __tablename__ = "mood_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mood = Column(Integer, default=3)  # 1-5 (very bad to very good)
    stress_level = Column(Integer, default=3)  # 1-5
    note = Column(Text, default="")
    tags = Column(JSON, default=list)
    date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
