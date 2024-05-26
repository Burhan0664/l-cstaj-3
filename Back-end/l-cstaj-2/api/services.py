import json
import os
from queue import Full
from typing import List, Optional
from sqlalchemy.orm import Session
from .models import Post
from database import SessionLocal



def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class PostService:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_posts(self) -> List[Post]:
        return self.db_session.query(Post).all()

    def get_post_by_id(self, post_id: int) -> Optional[Post]:
        return self.db_session.query(Post).filter(Post.id == post_id).first()

    def create_post(self, title: str, content: str, published: bool = True) -> Post:
        new_post = Post(title=title, content=content, published=published)
        self.db_session.add(new_post)
        self.db_session.commit()
        return new_post

    def update_post(self, post_id: int, title: str, content: str, published: bool) -> Optional[Post]:
        post = self.get_post_by_id(post_id)
        if post:
            post.title = title
            post.content = content
            post.published = published
            self.db_session.commit()
        return post

    def delete_post(self, post_id: int) -> bool:
        post = self.get_post_by_id(post_id)
        if post:
            self.db_session.delete(post)
            self.db_session.commit()
            return True
        return False 