import sqlalchemy
from sqlalchemy import Column, Integer, String, DATE

Base = sqlalchemy.orm.declarative_base()

class Query(Base):
    __tablename__ = 'queries'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    question = Column(String)
    response = Column(String)
    date = Column()

    def __repr__(self):
        return (f"Query:\n\t"
                f"id = '{self.id}'\n\t"
                f"user_id = '{self.user_id}'\n\t"
                f"question = '{self.question}'\n\t"
                f"response = '{self.response}'\n\t"
                f"date = {self.date}'\n\n")