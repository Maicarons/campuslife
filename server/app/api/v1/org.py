from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.org import School, College, Major, Grade, Class
from app.schemas import SchoolResponse, CollegeResponse, MajorResponse, GradeResponse, ClassResponse

router = APIRouter(prefix="/org", tags=["organization"])


@router.get("/schools", response_model=List[SchoolResponse])
def list_schools(db: Session = Depends(get_db)):
    return db.query(School).all()


@router.get("/schools/{school_id}/colleges", response_model=List[CollegeResponse])
def list_colleges(school_id: int, db: Session = Depends(get_db)):
    return db.query(College).filter(College.school_id == school_id).all()


@router.get("/colleges/{college_id}/majors", response_model=List[MajorResponse])
def list_majors(college_id: int, db: Session = Depends(get_db)):
    return db.query(Major).filter(Major.college_id == college_id).all()


@router.get("/majors/{major_id}/grades", response_model=List[GradeResponse])
def list_grades(major_id: int, db: Session = Depends(get_db)):
    return db.query(Grade).filter(Grade.major_id == major_id).all()


@router.get("/grades/{grade_id}/classes", response_model=List[ClassResponse])
def list_classes(grade_id: int, db: Session = Depends(get_db)):
    return db.query(Class).filter(Class.grade_id == grade_id).all()
