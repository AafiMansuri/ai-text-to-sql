from sqlmodel import SQLModel,Field,Column,Relationship
import sqlalchemy.dialects.postgresql as pg
from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4
from sqlalchemy import ForeignKey

class User(SQLModel, table=True):
    __tablename__ = "users"

    uid:str = Field(
        sa_column=Column(
            pg.VARCHAR,
            nullable=False,
            primary_key=True,
        )
    )
    email: str
    first_name: str
    last_name: str
    role:str
    created_at:datetime = Field(sa_column=Column(pg.TIMESTAMP,default=datetime.now))
    updated_at:datetime = Field(sa_column=Column(pg.TIMESTAMP,default=datetime.now))

    def __repr__(self):
        return f"<User {self.email}>"

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: UUID = Field(
        sa_column=Column(
            pg.UUID,
            nullable=False,
            primary_key=True,
            default=uuid4
        )
    )
    chat_id: UUID = Field(
        sa_column=Column(
            pg.UUID,
            ForeignKey("chats.id", ondelete="CASCADE"),
            nullable=False
        )
    )
    role: str = Field(sa_column=Column(pg.VARCHAR(50), nullable=False))
    content: str = Field(sa_column=Column(pg.TEXT, nullable=False))
    sql_query: Optional[str] = Field(sa_column=Column(pg.TEXT, nullable=True))
    query_result: Optional[dict] = Field(sa_column=Column(pg.JSONB, nullable=True))
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))

    # Relationship
    chat: "Chat" = Relationship(back_populates="messages")

    def __repr__(self):
        return f"<Message {self.id}>"

class Chat(SQLModel, table=True):
    __tablename__ = "chats"

    id: UUID = Field(
        sa_column=Column(
            pg.UUID,
            nullable=False,
            primary_key=True,
            default=uuid4
        )
    )
    user_id: str = Field(
        sa_column=Column(
            pg.VARCHAR,
            ForeignKey("users.uid", ondelete="CASCADE"),
            nullable=False
        )
    )   
    title: str = Field(sa_column=Column(pg.VARCHAR(255)))
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    updated_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))

    # Relationship
    messages: List[Message] = Relationship(back_populates="chat")

    def __repr__(self):
        return f"<Chat {self.title}>"
 