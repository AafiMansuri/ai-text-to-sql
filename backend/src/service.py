from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, desc
from src.schemas import UserCreateModel, UserUpdateModel
from .models import User
import httpx
from fastapi import HTTPException
from src.config import Config as c


class UserService:
    async def get_all_users(self, session:AsyncSession):
        statement = select(User).order_by(desc(User.created_at))

        result = await session.exec(statement)

        return result.all()

    async def get_user(self,user_uid:str,session:AsyncSession):
        statement = select(User).where(User.uid == user_uid)

        result = await session.exec(statement)

        user =  result.first()

        return user if user is not None else None

    async def create_user(self,user_data:UserCreateModel, session:AsyncSession):
        user_data_dict = user_data.model_dump()

        new_user = User(
            **user_data_dict
        )

        session.add(new_user)
        await session.commit()

        return new_user

    async def update_user(self, user_uid: str, update_data: UserUpdateModel, session: AsyncSession):
        user_to_update = await self.get_user(user_uid, session)

        if not user_to_update:
            return None
        
        update_data_dict = update_data.model_dump()

        try:
            for k, v in update_data_dict.items():
                setattr(user_to_update, k, v)

            clerk_metadata = {
                "first_name": update_data.first_name,
                "last_name": update_data.last_name,
                "role": update_data.role
            }

            async with httpx.AsyncClient() as client:
                headers = {
                    "Authorization": f"Bearer {c.CLERK_SECRET_KEY}",
                    "Content-Type": "application/json"
                }
                clerk_response = await client.patch(
                    f"{c.CLERK_API_URL}/users/{user_uid}",
                    json={"public_metadata": clerk_metadata},
                    headers=headers
                )

            if clerk_response.status_code != 200:
                await session.rollback()
                print("Failed to update user in Clerk")
                raise HTTPException(status_code=clerk_response.status_code, detail="Failed to update user in Clerk")

            await session.commit()
            await session.refresh(user_to_update)

            return user_to_update

        except Exception as e:
            await session.rollback()
            raise HTTPException(status_code=500, detail=str(e))


    async def delete_user(self,user_uid:str,session:AsyncSession):
        user_to_delete = await self.get_user(user_uid,session)
        
        if not user_to_delete:
            return None
        
        try:
            await session.delete(user_to_delete)

            async with httpx.AsyncClient() as client:
                headers = {
                    "Authorization": f"Bearer {c.CLERK_SECRET_KEY}",
                    "Content-Type": "application/json"
                }
                clerk_response = await client.delete(
                    f"{c.CLERK_API_URL}/users/{user_uid}",
                    headers=headers
                )

            if clerk_response.status_code != 200:
                    await session.rollback()
                    print("Failed to delete user in Clerk")
                    raise HTTPException(status_code=clerk_response.status_code, detail="Failed to delete user in Clerk")

            await session.commit()

            return True

        except Exception as e:
            await session.rollback()
            raise HTTPException(status_code=500, detail=str(e))