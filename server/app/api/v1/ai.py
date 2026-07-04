from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.system import AiConversation, PointLog
from app.schemas import AiConversationCreate, AiConversationResponse, ChatRequest, PointLogResponse
from app.api.deps import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/conversations", response_model=List[AiConversationResponse])
def list_conversations(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(AiConversation).filter(AiConversation.user_id == user.id).order_by(AiConversation.created_at.desc()).all()


@router.post("/conversations", response_model=AiConversationResponse)
def create_conversation(req: AiConversationCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conv = AiConversation(user_id=user.id, **req.model_dump())
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv


@router.get("/conversations/{id}", response_model=AiConversationResponse)
def get_conversation(id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conv = db.query(AiConversation).filter(AiConversation.id == id, AiConversation.user_id == user.id).first()
    return conv


@router.delete("/conversations/{id}")
def delete_conversation(id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conv = db.query(AiConversation).filter(AiConversation.id == id, AiConversation.user_id == user.id).first()
    if conv:
        db.delete(conv)
        db.commit()
    return {"ok": True}


@router.post("/chat")
def chat(req: ChatRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Mock AI response - in production would call OpenAI-compatible API
    conversation = None
    if req.conversation_id:
        conversation = db.query(AiConversation).filter(
            AiConversation.id == req.conversation_id,
            AiConversation.user_id == user.id
        ).first()

    if not conversation:
        conversation = AiConversation(user_id=user.id, title=req.message[:50], model=req.model)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    messages = conversation.messages or []
    messages.append({"role": "user", "content": req.message})

    # Simulate AI response
    ai_response = f"你好！我是 CampusLife AI 助手。你刚才说了：「{req.message}」。这是一个模拟回复，在生产环境中会调用 AI API。"
    messages.append({"role": "assistant", "content": ai_response})

    conversation.messages = messages
    conversation.tokens_used = (conversation.tokens_used or 0) + len(req.message) + len(ai_response)
    db.commit()

    return {
        "conversation_id": conversation.id,
        "response": ai_response,
        "tokens_used": conversation.tokens_used,
    }


# Points
@router.get("/points/history", response_model=List[PointLogResponse])
def point_history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(PointLog).filter(PointLog.user_id == user.id).order_by(PointLog.created_at.desc()).all()
