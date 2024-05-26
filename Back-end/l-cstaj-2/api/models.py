import datetime
from typing import List, Optional
from database import Base
from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, text
from sqlalchemy.engine import Engine
from pydantic import BaseModel
from datetime import datetime

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer,primary_key=True,nullable=True)
    title = Column(String,nullable=False)
    content = Column(String,nullable=False)
    published = Column(Boolean, server_default='TRUE')
    


    def dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "published": self.published
        }