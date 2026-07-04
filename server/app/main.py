from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.database import engine, Base
from app.api.v1 import auth, org, academics, campus, ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="CampusLife API",
    description="校园生活一站式工作站 API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(org.router, prefix="/api/v1")
app.include_router(academics.router, prefix="/api/v1")
app.include_router(campus.router, prefix="/api/v1")
app.include_router(ai.router, prefix="/api/v1")


@app.get("/")
def root():
    return {"name": "CampusLife API", "version": "1.0.0", "status": "running"}


@app.get("/health")
def health():
    return {"status": "ok"}
