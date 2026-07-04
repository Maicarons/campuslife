from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text, Float
from datetime import datetime, timezone
from app.database import Base


class DiningSpot(Base):
    __tablename__ = "dining_spots"
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    name = Column(String(200), nullable=False)
    type = Column(String(20), default="cafeteria")  # cafeteria/takeout/nearby
    location = Column(String(300), default="")
    hours = Column(JSON, default=dict)
    phone = Column(String(20), default="")
    delivery_time = Column(String(50), default="")
    delivery_fee = Column(Float, default=0)
    min_order = Column(Float, default=0)
    rating = Column(Float, default=0)
    price_level = Column(String(10), default="$")
    image_url = Column(String(500), default="")
    tags = Column(JSON, default=list)
    platform_links = Column(JSON, default=dict)
    scope_type = Column(String(20), default="school")
    scope_id = Column(Integer, nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="approved")
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True, index=True)
    dining_spot_id = Column(Integer, ForeignKey("dining_spots.id"), nullable=False)
    name = Column(String(200), nullable=False)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    category = Column(String(50), default="主食")
    description = Column(Text, default="")
    nutrition = Column(JSON, default=dict)
    image_url = Column(String(500), default="")
    available_days = Column(String(100), default="每日")
    spicy_level = Column(String(10), default="不辣")
    is_popular = Column(Boolean, default=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="approved")
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)


class DiningReview(Base):
    __tablename__ = "dining_reviews"
    id = Column(Integer, primary_key=True, index=True)
    dining_spot_id = Column(Integer, ForeignKey("dining_spots.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, default=5)
    comment = Column(Text, default="")
    images = Column(JSON, default=list)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class MealLog(Base):
    __tablename__ = "meal_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dining_spot_id = Column(Integer, ForeignKey("dining_spots.id"), nullable=True)
    meal_type = Column(String(20), default="lunch")  # breakfast/lunch/dinner/snack
    items = Column(JSON, default=list)
    total_price = Column(Float, default=0)
    photo_url = Column(String(500), default="")
    note = Column(Text, default="")
    date = Column(DateTime, nullable=True)
    nutrition_summary = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class LostFound(Base):
    __tablename__ = "lost_found"
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    type = Column(String(10), nullable=False)  # lost/found
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    location = Column(String(200), default="")
    contact_info = Column(String(200), default="")
    images = Column(JSON, default=list)
    category = Column(String(50), default="other")
    status = Column(String(20), default="open")  # open/resolved/closed
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=True)


class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    scope_type = Column(String(20), default="school")
    scope_id = Column(Integer, nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    location = Column(String(200), default="")
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    registration_deadline = Column(DateTime, nullable=True)
    max_participants = Column(Integer, default=0)
    current_participants = Column(Integer, default=0)
    images = Column(JSON, default=list)
    tags = Column(JSON, default=list)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="approved")
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    scope_type = Column(String(20), default="school")
    scope_id = Column(Integer, nullable=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, default="")
    priority = Column(String(20), default="normal")  # normal/important/urgent
    pinned = Column(Boolean, default=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="approved")
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=True)


class BusRoute(Base):
    __tablename__ = "bus_routes"
    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    name = Column(String(100), nullable=False)
    stops = Column(JSON, default=list)
    schedule = Column(JSON, default=dict)
    active = Column(Boolean, default=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="approved")
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
