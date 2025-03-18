import sqlalchemy as sa
import pandas as pd
from src.config import Config as c

def get_engine(role):
    """Returns the database engine based on user role."""
    if role == "admin" or role == "superadmin":
        return sa.create_engine(c.DB_URL_ADMIN)
    else:
        return sa.create_engine(c.DB_URL_USER)


def execute_query(query,role="user"):
    """Executes an SQL query using the correct database connection based on role."""

    engine = get_engine(role)  # Choose DB connection based on role
    return pd.read_sql(query, engine)