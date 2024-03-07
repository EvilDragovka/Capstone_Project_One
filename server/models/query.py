import sqlalchemy
from sqlalchemy import Column, Integer, String, DATE
# Creating a base class for declarative models.
Base = sqlalchemy.orm.declarative_base()

# Defining the Query class which inherits from Base.
class Query(Base):
    __tablename__ = 'queries'
     # Defining the columns for the table 'queries'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    question = Column(String)
    response = Column(String)
    date = Column(DATE)
     # Method to represent the object as a string.
    def __repr__(self):
        return (f"Query:\n\t"
                f"id = '{self.id}'\n\t"
                f"user_id = '{self.user_id}'\n\t"
                f"question = '{self.question}'\n\t"
                f"response = '{self.response}'\n\t"
                f"date = {self.date}'\n\n")
    # Method to convert the object to a dictionary.
    def to_dict(self):
        date_str = self.date.isoformat() if self.date else None
        return {
            "id": self.id,
            "user_id": self.user_id,
            "question": self.question,
            "response": self.response,
            "date": date_str
        }
