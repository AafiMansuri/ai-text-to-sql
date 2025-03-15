import requests
from fastapi import APIRouter, HTTPException
from src.schemas import User
from src.services.config import CLERK_API_URL, CLERK_SECRET_KEY

router = APIRouter()

@router.post("/invite")
def invite_user(user: User):
    headers = {
        "Authorization": f"Bearer {CLERK_SECRET_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "email_address": user.email,

        "public_metadata": {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role
        },
        "redirct_url": "http://localhost:3000",
        "expires_in_days": 1,
    }

    response = requests.post(f"{CLERK_API_URL}/invitations", json=payload, headers=headers)
    
    if response.status_code != 201:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    
    return {"message": "Invitation sent successfully."}
