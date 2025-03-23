from sqlmodel import SQLModel,Field,Column
import sqlalchemy.dialects.postgresql as pg
from datetime import datetime
class User(SQLModel, table=True):
    __tablename__ = "users"

    uid:str = Field(
        sa_column=Column(
            pg.VARCHAR,
            nullable=False,
            primary_key=True,
        )
    )
    email: str
    first_name: str
    last_name: str
    role:str
    created_at:datetime = Field(sa_column=Column(pg.TIMESTAMP,default=datetime.now))
    updated_at:datetime = Field(sa_column=Column(pg.TIMESTAMP,default=datetime.now))

    def __repr__(self):
        return f"<User {self.email}>"
 