from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.campus import DiningSpot, LostFound, Event, Announcement
from app.models.finance import Transaction, Scholarship, Job
from app.models.health import ExerciseLog, SleepLog, MoodLog
from app.models.social import ForumPost, ForumComment
from app.schemas import (
    DiningSpotResponse, LostFoundCreate, LostFoundResponse, EventResponse, AnnouncementResponse,
    TransactionCreate, TransactionResponse, ExerciseLogCreate, ExerciseLogResponse,
    SleepLogCreate, SleepLogResponse, MoodLogCreate, MoodLogResponse,
    ForumPostCreate, ForumPostResponse, ForumCommentCreate, ForumCommentResponse,
)
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(tags=["campus"])


# ---- Lost & Found ----
@router.get("/campus/lost-found", response_model=List[LostFoundResponse])
def list_lost_found(status_filter: str = "", db: Session = Depends(get_db)):
    q = db.query(LostFound)
    if status_filter:
        q = q.filter(LostFound.type == status_filter)
    return q.order_by(LostFound.created_at.desc()).all()


@router.post("/campus/lost-found", response_model=LostFoundResponse)
def create_lost_found(req: LostFoundCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = LostFound(school_id=user.school_id or 1, uploaded_by=user.id, **req.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


# ---- Events ----
@router.get("/campus/events", response_model=List[EventResponse])
def list_events(db: Session = Depends(get_db)):
    return db.query(Event).order_by(Event.created_at.desc()).all()


# ---- Announcements ----
@router.get("/campus/announcements", response_model=List[AnnouncementResponse])
def list_announcements(db: Session = Depends(get_db)):
    return db.query(Announcement).order_by(Announcement.pinned.desc(), Announcement.created_at.desc()).all()


# ---- Dining ----
@router.get("/campus/dining", response_model=List[DiningSpotResponse])
def list_dining(type_filter: str = "", db: Session = Depends(get_db)):
    q = db.query(DiningSpot)
    if type_filter:
        q = q.filter(DiningSpot.type == type_filter)
    return q.all()


# ---- Finance: Transactions ----
@router.get("/finance/transactions", response_model=List[TransactionResponse])
def list_transactions(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Transaction).filter(Transaction.user_id == user.id).order_by(Transaction.created_at.desc()).all()


@router.post("/finance/transactions", response_model=TransactionResponse)
def create_transaction(req: TransactionCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    t = Transaction(user_id=user.id, **req.model_dump())
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@router.delete("/finance/transactions/{id}")
def delete_transaction(id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    t = db.query(Transaction).filter(Transaction.id == id, Transaction.user_id == user.id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(t)
    db.commit()
    return {"ok": True}


# ---- Finance: Scholarships ----
@router.get("/finance/scholarships")
def list_scholarships(db: Session = Depends(get_db)):
    return db.query(Scholarship).all()


# ---- Finance: Jobs ----
@router.get("/finance/jobs")
def list_jobs(db: Session = Depends(get_db)):
    return db.query(Job).filter(Job.active == True).all()


# ---- Health: Exercise ----
@router.get("/health/exercise", response_model=List[ExerciseLogResponse])
def list_exercise(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(ExerciseLog).filter(ExerciseLog.user_id == user.id).order_by(ExerciseLog.created_at.desc()).all()


@router.post("/health/exercise", response_model=ExerciseLogResponse)
def create_exercise(req: ExerciseLogCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log = ExerciseLog(user_id=user.id, **req.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


# ---- Health: Sleep ----
@router.get("/health/sleep", response_model=List[SleepLogResponse])
def list_sleep(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(SleepLog).filter(SleepLog.user_id == user.id).order_by(SleepLog.created_at.desc()).all()


@router.post("/health/sleep", response_model=SleepLogResponse)
def create_sleep(req: SleepLogCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log = SleepLog(user_id=user.id, **req.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


# ---- Health: Mood ----
@router.get("/health/mood", response_model=List[MoodLogResponse])
def list_mood(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(MoodLog).filter(MoodLog.user_id == user.id).order_by(MoodLog.created_at.desc()).all()


@router.post("/health/mood", response_model=MoodLogResponse)
def create_mood(req: MoodLogCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log = MoodLog(user_id=user.id, **req.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


# ---- Social: Forum ----
@router.get("/social/forum", response_model=List[ForumPostResponse])
def list_forum_posts(db: Session = Depends(get_db)):
    return db.query(ForumPost).order_by(ForumPost.created_at.desc()).all()


@router.post("/social/forum", response_model=ForumPostResponse)
def create_forum_post(req: ForumPostCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = ForumPost(user_id=user.id, **req.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get("/social/forum/{post_id}", response_model=ForumPostResponse)
def get_forum_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.views += 1
    db.commit()
    return post


@router.post("/social/forum/{post_id}/comments", response_model=ForumCommentResponse)
def create_comment(post_id: int, req: ForumCommentCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    comment = ForumComment(post_id=post_id, user_id=user.id, **req.model_dump())
    db.add(comment)
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if post:
        post.comment_count += 1
    db.commit()
    db.refresh(comment)
    return comment


@router.get("/social/forum/{post_id}/comments", response_model=List[ForumCommentResponse])
def list_comments(post_id: int, db: Session = Depends(get_db)):
    return db.query(ForumComment).filter(ForumComment.post_id == post_id).all()
