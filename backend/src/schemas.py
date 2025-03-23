from datetime import datetime
from pydantic import BaseModel, EmailStr

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