import sqlalchemy as sa
import pandas as pd
from config import DATABASE_URL

engine = sa.create_engine(DATABASE_URL)

def execute_query(query):
    """Executes a SQL query and returns a Pandas DataFrame."""
    
    return pd.read_sql(query, engine)