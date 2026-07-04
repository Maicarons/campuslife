from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text
from datetime import datetime, timezone
from app.database import Base


class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    contact_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    group_name = Column(String(50), default="默认")
    remark = Column(String(100), default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    room_id = Column(String(100), default="")
    content = Column(Text, nullable=False)
    message_type = Column(String(20), default="text")  # text/image/file
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Club(Base):
    __tablename__ = "clubs"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, default="")
    category = Column(String(50), default="")
    logo_url = Column(String(500), default="")
    member_count = Column(Integer, default=0)
    leader_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    contact = Column(String(200), default="")
    tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ForumPost(Base):
    __tablename__ = "forum_posts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, default="")
    category = Column(String(50), default="综合")
    tags = Column(JSON, default=list)
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ForumComment(Base):
    __tablename__ = "forum_comments"
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("forum_posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    likes = Column(Integer, default=0)
    parent_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
