import sqlalchemy
from sqlalchemy import Column, Integer, String
# Creating a base class for declarative models
Base = sqlalchemy.orm.declarative_base()

# Defining the User class which inherits from Base.
class User(Base):
    __tablename__ = 'users'
    # Defining the columns for the table 'users'.
    id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String)
    password = Column(String)
    # Method to represent the object as a string.
    def __repr__(self):
        return (f"User:\n\t"
                f"id = '{self.id}'\n\t"
                f"username = '{self.username}'\n\t"
                f"email = '{self.email}'\n\t"
                f"password = '{self.password}'\n\n")
    # Method to convert the object to a dictionary.
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "password": self.password
        }
    # Method to convert the object to a dictionary without the password.
    def to_dict_no_password(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }
