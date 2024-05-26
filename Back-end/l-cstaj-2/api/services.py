from typing import List, Optional
from sqlalchemy.orm import Session
from .models import Post
from database import SessionLocal



class PostService:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_posts(self) -> List[dict]:
        posts = self.db_session.query(Post).all()
        return [post.dict() for post in posts]

    def get_post_by_id(self, post_id: int) -> Optional[dict]:
        post = self.db_session.query(Post).filter(Post.id == post_id).first()
        return post.dict() if post else None

    def create_post(self, title: str, content: str, published: bool = True) -> dict:
        new_post = Post(title=title, content=content, published=published)
        self.db_session.add(new_post)
        self.db_session.commit()
        return new_post.dict()

    def update_post(self, post_id: int, title: str, content: str, published: bool) -> Optional[dict]:
        post = self.db_session.query(Post).get(post_id)
        if post:
            post.title = title
            post.content = content
            post.published = published
            self.db_session.commit()
        return post[dict] if post else None

    def delete_post(self, post_id: int):
        post = self.db_session.query(Post).get(post_id)
        if post:
            self.db_session.delete(post)
            self.db_session.commit()
