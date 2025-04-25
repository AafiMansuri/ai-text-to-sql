from fastapi import APIRouter, HTTPException, status
from pathlib import Path
import json
from src.schemas import AddViewRequest, ViewSchema
from typing import List

router = APIRouter()

DATA_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "ddl_statements.json"

def load_views():
    with open(DATA_PATH, "r") as file:
        raw_data = json.load(file)
        return [
            {
                "friendly_name": key,
                "view_name": value["view_name"],
                "ddl": value["schema"]  # map old "schema" key to new "ddl"
            }
            for key, value in raw_data.items()
        ]   

@router.get("/views", response_model=List[ViewSchema])
async def get_views():
    try:
        views = load_views()  # Load views from the JSON file
        return views
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add-view")
def add_new_view(view_data: AddViewRequest):
    """Add a new view (DDL) to the ddl_statements.json file"""

    try:
        # Load existing views
        with open(DATA_PATH, "r") as file:
            ddl_data = json.load(file)

        # Check if the view_key already exists
        if view_data.view_key in ddl_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="View key already exists. Choose a unique key."
            )

        # Add the new view data in the correct format
        ddl_data[view_data.view_key] = {
            "view_name": view_data.view_name,
            "schema": view_data.ddl
        }

        # Save the updated data back to the file
        with open(DATA_PATH, "w") as file:
            json.dump(ddl_data, file, indent=2)

        return {"message": "View added successfully."}

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to read or decode JSON file."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error adding view: {str(e)}"
        )