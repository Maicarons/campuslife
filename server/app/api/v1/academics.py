from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.database import get_db
from app.models.academics import Course, GradeRecord, Assignment, Exam, Note
from app.schemas import (
    CourseCreate, CourseResponse, GradeRecordCreate, GradeRecordResponse,
    AssignmentCreate, AssignmentResponse, ExamCreate, ExamResponse,
    NoteCreate, NoteResponse,
)
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/academics", tags=["academics"])


# ---- Courses ----
@router.get("/courses", response_model=List[CourseResponse])
def list_courses(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Course).filter(Course.user_id == user.id).all()


@router.post("/courses", response_model=CourseResponse)
def create_course(req: CourseCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    course = Course(user_id=user.id, uploaded_by=user.id, **req.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.put("/courses/{course_id}", response_model=CourseResponse)
def update_course(course_id: int, req: CourseCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id, Course.user_id == user.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    for k, v in req.model_dump(exclude_unset=True).items():
        setattr(course, k, v)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/courses/{course_id}")
def delete_course(course_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id, Course.user_id == user.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"ok": True}


# ---- Grades ----
@router.get("/grades", response_model=List[GradeRecordResponse])
def list_grades(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(GradeRecord).filter(GradeRecord.user_id == user.id).all()


@router.post("/grades", response_model=GradeRecordResponse)
def create_grade(req: GradeRecordCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rec = GradeRecord(user_id=user.id, **req.model_dump())
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


# ---- Assignments ----
@router.get("/assignments", response_model=List[AssignmentResponse])
def list_assignments(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Assignment).filter(Assignment.user_id == user.id).all()


@router.post("/assignments", response_model=AssignmentResponse)
def create_assignment(req: AssignmentCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    a = Assignment(user_id=user.id, **req.model_dump())
    db.add(a)
    db.commit()
    db.refresh(a)
    return a


@router.put("/assignments/{id}", response_model=AssignmentResponse)
def update_assignment(id: int, req: AssignmentCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    a = db.query(Assignment).filter(Assignment.id == id, Assignment.user_id == user.id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assignment not found")
    for k, v in req.model_dump(exclude_unset=True).items():
        setattr(a, k, v)
    db.commit()
    db.refresh(a)
    return a


@router.delete("/assignments/{id}")
def delete_assignment(id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    a = db.query(Assignment).filter(Assignment.id == id, Assignment.user_id == user.id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(a)
    db.commit()
    return {"ok": True}


# ---- Exams ----
@router.get("/exams", response_model=List[ExamResponse])
def list_exams(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Exam).filter(Exam.user_id == user.id).all()


@router.post("/exams", response_model=ExamResponse)
def create_exam(req: ExamCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    e = Exam(user_id=user.id, uploaded_by=user.id, **req.model_dump())
    db.add(e)
    db.commit()
    db.refresh(e)
    return e


# ---- Notes ----
@router.get("/notes", response_model=List[NoteResponse])
def list_notes(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Note).filter(Note.user_id == user.id).all()


@router.post("/notes", response_model=NoteResponse)
def create_note(req: NoteCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    n = Note(user_id=user.id, **req.model_dump())
    db.add(n)
    db.commit()
    db.refresh(n)
    return n


@router.put("/notes/{id}", response_model=NoteResponse)
def update_note(id: int, req: NoteCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    n = db.query(Note).filter(Note.id == id, Note.user_id == user.id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Note not found")
    for k, v in req.model_dump(exclude_unset=True).items():
        setattr(n, k, v)
    n.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(n)
    return n


@router.delete("/notes/{id}")
def delete_note(id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    n = db.query(Note).filter(Note.id == id, Note.user_id == user.id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(n)
    db.commit()
    return {"ok": True}
