from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from uuid import UUID

class User(BaseModel):
    uid:str
    email: EmailStr
    first_name: str
    last_name: str
    role:str
    created_at: datetime
    updated_at: datetime

class UserInviteModel(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role:str

class UserCreateModel(BaseModel):
    uid:str
    email: EmailStr
    first_name: str
    last_name: str
    role:str

class UserUpdateModel(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role:str
    updated_at: datetime

# Message Schemas
class MessageBase(BaseModel):
    role: str
    content: str
    sql_query: Optional[str] = None
    query_result: Optional[dict] = None

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: UUID
    chat_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Chat Schemas
class ChatBase(BaseModel):
    title: str

class ChatCreate(ChatBase):
    user_id: str

class Chat(ChatBase):
    id: UUID
    user_id: str
    created_at: datetime
    updated_at: datetime
    messages: List[Message] = []

    class Config:
        from_attributes = True

# Query Schemas
class QueryRequest(BaseModel):
    query: str
    view_name: str  # This will be used to fetch the correct DDL from ddl_statements.json

class QueryResponse(BaseModel):
    sql_query: Optional[str] = None
    query_result: Optional[dict] = None
    message: str

# View Schema for Database Selector

class ViewSchema(BaseModel):
    friendly_name: str
    view_name: str
    ddl: str


class AddViewRequest(BaseModel):
    view_key: str  # user-friendly key used in dropdown and file
    view_name: str  # actual DB view name
    ddl: str     # the DDL statement
