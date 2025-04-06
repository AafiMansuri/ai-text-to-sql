import requests
from fastapi import APIRouter, status, Depends
from fastapi.exceptions import HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.schemas import User,UserCreateModel, UserInviteModel, UserUpdateModel
from src.config import Config as c
from src.db.main import get_session
from src.service import UserService
from typing import List

router = APIRouter()
user_service = UserService()

@router.get("/",response_model=List[User])
async def get_all_users(session:AsyncSession = Depends(get_session)):
    users = await user_service.get_all_users(session)
    return users


@router.post("/",status_code=status.HTTP_201_CREATED,response_model=User)
async def create_user(user_data:UserCreateModel,session:AsyncSession = Depends(get_session)):
    new_user = await user_service.create_user(user_data,session)
    return new_user


@router.get("/{user_uid}",response_model=User)
async def get_user(user_uid: str, session: AsyncSession = Depends(get_session)):
    user = await user_service.get_user(user_uid, session)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not found")
    else:
        return user
    

@router.patch("/{user_uid}",response_model=User)
async def update_user(user_uid: str, user_update_data:UserUpdateModel, session: AsyncSession = Depends(get_session)):
    updated_user = await user_service.update_user(user_uid, user_update_data, session)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not found")
    else:
        return updated_user
    

@router.delete("/{user_uid}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_uid:str, session:AsyncSession = Depends(get_session)):
    user_to_delete = await user_service.delete_user(user_uid, session)

    if user_to_delete:
        return {"message": "User deleted successfully"}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not found")


@router.post("/invite")
def invite_user(user: UserInviteModel):
    headers = {
        "Authorization": f"Bearer {c.CLERK_SECRET_KEY}",
        "Content-Type": "application/json"
    }   
    payload = {
        "email_address": user.email,

        "public_metadata": {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role
        },
        "redirct_url": "https://charming-flounder-seriously.ngrok-free.app/chat",
        "expires_in_days": 1,
    }

    response = requests.post(f"{c.CLERK_API_URL}/invitations", json=payload, headers=headers)
    
    if response.status_code != 201:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    
    return {"message": "Invitation sent successfully."}
