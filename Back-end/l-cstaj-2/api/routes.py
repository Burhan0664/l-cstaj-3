from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional

from .models import Post
from .services import PostService
from database import SessionLocal

router = APIRouter(prefix="/posts")

class PostBase(BaseModel):
    id: int
    title: str
    content: str
    published: bool = True

class PostCreate(BaseModel):
    title: str
    content: str
    published: bool = True

# Dependency to get the database session
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

post_service = PostService(SessionLocal())

@router.get("/", response_model=List[PostBase])
async def get_posts(db: Session = Depends(get_db)):
    return post_service.get_posts()

@router.get("/{post_id}", response_model=PostBase)
async def get_post(post_id: int, db: Session = Depends(get_db)):
    post = post_service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/", response_model=PostBase)
async def create_post(post: PostCreate, db: Session = Depends(get_db)):
    new_post = post_service.create_post(post.title, post.content, post.published)
    return new_post

@router.put("/{post_id}", response_model=PostBase)
async def update_post(post_id: int, _post: PostCreate, db: Session = Depends(get_db)):
    post = post_service.update_post(post_id, _post.title, _post.content, _post.published)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.delete("/{post_id}", response_model=dict)
async def delete_post(post_id: int, db: Session = Depends(get_db)):
    success = post_service.delete_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}