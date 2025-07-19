from sqlmodel import Session
import pandas as pd
from typing import Dict, Any
import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import text
from src.config import Config as c
import asyncio
from datetime import datetime, date, time
import json
from src.data.ddl_statements import get_db_url

logger = logging.getLogger(__name__)

def get_engine(database_name: str):
    """Returns the database engine based on database_name from ddl_statements.json."""
    db_url = get_db_url(database_name)
    if not db_url:
        raise ValueError(f"No db_url found for database: {database_name}")
    print(f"Connecting using the following URL: {db_url}")
    return create_async_engine(db_url)

async def execute_query(sql_query: str, database_name: str) -> Dict[str, Any]:
    """Execute a SQL query and return the results as a dictionary."""
    try:
        print(f"Executing query on database {database_name}: {sql_query}")
        engine = get_engine(database_name)
        async_session = AsyncSession(engine, expire_on_commit=False)

        # Execute the query
        async with async_session as session:
            try:
                result = await session.execute(text(sql_query))
                rows = result.fetchall()
                print(f"Query executed successfully, returned {len(rows)} rows")
            except Exception as e:
                print(f"Error executing query: {str(e)}")
                raise
        # Convert to dictionary format
        if rows:
            columns = result.keys()
            print(f"Query columns: {columns}")
            # Convert each row to a dictionary and ensure all values are JSON serializable
            serializable_rows = []
            for row in rows:
                row_dict = {}
                for col, val in zip(columns, row):
                    # Convert any non-serializable values to strings
                    if isinstance(val, (datetime, date, time)):
                        row_dict[col] = val.isoformat()
                    else:
                        row_dict[col] = str(val) if val is not None else None
                serializable_rows.append(row_dict)
            result_dict = {
                "columns": list(columns),
                "rows": serializable_rows
            }
            return result_dict
        return {"columns": [], "rows": []}
    except Exception as e:
        print(f"Error executing query: {str(e)}")
        raise 