from datetime import date
from sqlalchemy import create_engine, or_
from sqlalchemy.orm import sessionmaker
from config import Config
from models.user import User
from models.query import Query
from sqlalchemy.exc import SQLAlchemyError
import re
import bcrypt
import logging


engine = create_engine(
    Config.CONNECTION_TO_DATABASE,
    connect_args={
        "ssl":{
            "ssl_ca":"etc/ssl/cert.pem"
        }
    }
)

Session = sessionmaker(bind=engine)

def list():
    session = Session()
    users = session.query(User).all()
    session.close()
    return users

def get_by_id(user_id):
    session = Session()
    user = session.query(User).filter(User.id == user_id).first()
    session.close()
    return user

def login(identifier, password):
    session = Session()

    # Retrieve the user by username
    user = session.query(User).filter(or_(User.username == identifier, User.email == identifier)).first()
    if not user:
        session.close()
        return False, "Invalid username or password."

    # Verify the password
    if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        session.close()
        return True, "Login successful."
    else:
        session.close()
        return False, "Invalid username or password."



def register(username, email, password):
    session = Session()

    # Check if username or email is already taken
    existing_user = session.query(User).filter(User.username == username).first()
    if existing_user:
        session.close()
        return False, "Username is taken."

    existing_email = session.query(User).filter(User.email == email).first()
    if existing_email:
        session.close()
        return False, "Email is taken."

    # Check if username and email length is within limits
    if len(username) > 25:
        session.close()
        return False, "Username must be at most 25 characters."
    if len(email) > 100:
        session.close()
        return False, "Email must be at most 100 characters."

    # Check if the password is strong
    strong, message = strong_password(password)
    if not strong:
        session.close()
        return False, message

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Create a new user with the hashed password
    new_user = User(username=username, password=hashed_password, email=email)
    session.add(new_user)
    session.commit()
    session.close()

    return True, "User registered successfully."


def delete_by_id(user_id):
    with Session() as session:
        try:
            # Attempt to retrieve the user first to check existence
            user = session.query(User).filter(User.id == user_id).one_or_none()
            if user is None:
                return False, "User not found."

            # Delete the user's dependent data
            session.query(Query).filter(Query.user_id == user_id).delete(synchronize_session=False)

            # Delete the user
            session.delete(user)
            session.commit()
            return True, "User deleted successfully."

        except SQLAlchemyError as e:
            # Rollback in case of any SQLAlchemy errors
            session.rollback()
            logging.exception("Failed to delete user: %s", e)  # Log the exception
            return False, f"An error occurred: {e}"




def update(user_id, **kwargs):
    with Session() as session:  # Use context management for the session
        try:
            user = session.query(User).filter(User.id == user_id).one_or_none()
            if user is None:
                return False, "User not found."

            # Define a list of fields that are allowed to be updated
            allowed_updates = ['username', 'email', 'password']  # Add other fields as necessary

            for key, value in kwargs.items():
                if key in allowed_updates and hasattr(user, key):
                    if key == 'password':  # Hash the new password before storing
                        value = bcrypt.hashpw(value.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                    setattr(user, key, value)

            user.updated_at = date.today()  # Manually update the timestamp, if not automatically handled
            session.commit()
            return True, "User successfully updated."
        except SQLAlchemyError as e:
            session.rollback()  # Rollback in case of error
            logging.exception("Error updating user: %s", e)  # Log the exception for debugging
            return False, f"Error updating user: {str(e)}"


def strong_password(password):
    """Check if the password is strong."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not re.search("[a-z]", password):
        return False, "Password must contain at least one lowercase letter."
    if not re.search("[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search("[0-9]", password):
        return False, "Password must contain at least one digit."
    if not re.search("[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character."
    return True, ""


if __name__ == "__main__":

    #register("wifi", "wifi@icloud.com", "Password#872")

    user_id = 4  # Example user ID
    update_data = {
        "username": "test_user",
        "email": "new_email@example.com",
        "password": "newSecurePassword123!"
    }

    result = update(user_id, **update_data)
    print(result)