from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from typing import List
from uuid import UUID
from datetime import datetime
import logging
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import selectinload

from src.models import Chat, Message, User
from src.schemas import Chat as ChatSchema, ChatCreate, Message as MessageSchema, MessageCreate, QueryRequest, QueryResponse
from src.db.main import get_session
from src.services.query_generator import generate_sql
from src.services.database import execute_query
from src.data.ddl_statements import get_ddl_statement

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=List[ChatSchema])
async def get_user_chats(user_id: str, db: AsyncSession = Depends(get_session)):
    """Get all chats for a user"""
    try:
        statement = select(Chat).where(Chat.user_id == user_id).options(selectinload(Chat.messages))
        result = await db.exec(statement)
        chats = result.all()
        return chats
    except Exception as e:
        logger.error(f"Error fetching chats for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch chats"
        )

@router.get("/{chat_id}", response_model=ChatSchema)
async def get_chat(chat_id: UUID, db: AsyncSession = Depends(get_session)):
    """Get a specific chat with all its messages"""
    try:
        statement = select(Chat).where(Chat.id == chat_id).options(selectinload(Chat.messages))
        result = await db.exec(statement)
        chat = result.first()
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found"
            )
        return chat
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching chat {chat_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch chat"
        )

@router.post("/", response_model=ChatSchema)
async def create_chat(chat: ChatCreate, db: AsyncSession = Depends(get_session)):
    """Create a new chat"""
    try:
        db_chat = Chat(**chat.model_dump())
        db.add(db_chat)
        await db.commit()
        await db.refresh(db_chat)
        return db_chat
    except Exception as e:
        logger.error(f"Error creating chat: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create chat"
        )

@router.post("/{chat_id}/query", response_model=QueryResponse)
async def process_query(chat_id: UUID, query_request: QueryRequest, db: AsyncSession = Depends(get_session)):
    """Process a natural language query and store the results"""
    try:
        print(f"Processing query for chat {chat_id}")
        print(f"Query request: {query_request}")
        
        # Get chat
        statement = select(Chat).where(Chat.id == chat_id)
        result = await db.exec(statement)
        chat = result.first()
        if not chat:
            print(f"Chat not found: {chat_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found"
            )
        
        # Get the DDL statement
        print(f"Looking for DDL statement for view: {query_request.view_name}")
        ddl_statement = get_ddl_statement(query_request.view_name)
        if not ddl_statement:
            print(f"View not found: {query_request.view_name}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="View not found"
            )
        print(f"Found DDL statement: {ddl_statement[:100]}...") 
        
        # Generate SQL query
        try:
            sql_query = generate_sql(query_request.query, ddl_statement)
            print(f"Generated SQL: {sql_query}")
        except Exception as e:
            print(f"Error generating SQL: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate SQL: {str(e)}"
            )
        
        # Execute the query
        try:
            # Get user's role from the chat
            user_statement = select(User).where(User.uid == chat.user_id)
            user_result = await db.exec(user_statement)
            user = user_result.first()
            if not user:
                print(f"User not found: {chat.user_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            print(f"Executing query with user role: {user.role}")
            
            # Execute query and await the result
            query_result = await execute_query(sql_query, db, user.role)
            print(f"Query executed successfully")
        except Exception as e:
            print(f"Error executing query: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to execute query: {str(e)}"
            )
        
        # Create and add user message
        user_message = Message(
            chat_id=chat_id,
            role="user",
            content=query_request.query
        )
        db.add(user_message)
        
        # Create and add assistant message with the awaited query result
        assistant_message = Message(
            chat_id=chat_id,
            role="assistant",
            content=f"Here is the SQL query: {sql_query}",
            sql_query=sql_query,
            query_result=query_result  # This is now a serializable dictionary
        )
        db.add(assistant_message)
        
        # Update timestamp
        chat.updated_at = datetime.now()
        
        await db.commit()
        
        return QueryResponse(
            sql_query=sql_query,
            query_result=query_result,
            message="Query processed successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing query in chat {chat_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process query: {str(e)}"
        ) 