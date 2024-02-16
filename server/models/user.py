import sqlalchemy
from sqlalchemy import Column, Integer, String

Base = sqlalchemy.orm.declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String)
    password = Column(String)

    def __repr__(self):
        return (f"User:\n\t"
                f"id = '{self.id}'\n\t"
                f"username = '{self.username}'\n\t"
                f"email = '{self.email}'\n\t"
                f"password = '{self.password}'\n\n")

    def to_dict(self):
        return {
            "id" : self.id,
            "username" : self.username,
            "email" : self.email,
            "password" : self.password
        }