from datetime import datetime
from pydantic import BaseModel, EmailStr
import uuid

class User(BaseModel):
    uid:uuid.UUID
    email: EmailStr
    first_name: str
    last_name: str
    role:str
    created_at: datetime
    updated_at: datetime

class UserCreateModel(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role:str

class UserUpdateModel(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role:str