from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
from app.schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse, UserUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    user = User(
        username=req.username,
        email=req.email,
        password_hash=get_password_hash(req.password),
        nickname=req.nickname or req.username,
        school_id=req.school_id,
        college_id=req.college_id,
        major_id=req.major_id,
        grade_id=req.grade_id,
        class_id=req.class_id,
        enrollment_year=req.enrollment_year,
        points=20,  # bonus for completing profile
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)):
    return user


@router.put("/me", response_model=UserResponse)
def update_me(req: UserUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for field, value in req.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user
