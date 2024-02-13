from datetime import date

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
from models.user import User
from models.query import Query
from sqlalchemy.orm.exc import NoResultFound


engine = create_engine(
    Config.CONNECTION_TO_DATABASE,
    connect_args={
        "ssl":{
            "ssl_ca":"etc/ssl/cert.pem"
        }
    }
)

Session = sessionmaker(bind=engine)

def get_all_users():
    session = Session()
    users = session.query(User).all()
    session.close()
    return users

def get_user_by_id(user_id):
    session = Session()
    user = session.query(User).filter(User.id == id).first()
    session.close()
    return user


def login(identifier, password):
    session = Session()

    # Check if the identifier is a username or an email
    user = session.query(User).filter((User.username == identifier) | (User.email == identifier)).first()

    if user:
        # Check if the password matches
        if user.password == password:
            session.close()
        else:
            return False, "Wrong password."
    else:
        return False, "User not found."

    session.close()
    return True, "Login successful."

def register(username, password, email):
    session = Session()

    # Check if username is already taken
    existing_user = session.query(User).filter(User.username == username).first()
    if existing_user:
        session.close()
        return False, "Username is taken."

    # Check if email is already taken
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

    #TODO add more sanitization and hash for user password

    # Create a new user
    new_user = User(username=username, password=password, email=email)
    session.add(new_user)
    session.commit()
    session.close()

    return True, "User registered successfully."

def delete_user_by_id(user_id):
    with Session() as session:
        try:
            # Query the database to retrieve the user by user_id
            user_to_delete = session.query(User).filter(User.id == user_id).one()

            # Delete dependent data
            session.query(Query).filter(Query.user_id == user_id).delete()

            # Delete the user
            session.delete(user_to_delete)
            session.commit()
            return True, "User deleted successfully."

        except NoResultFound:
            return False, "User not found."

        except Exception as e:
            session.rollback()
            return False, f"An error occurred: {e}"


from sqlalchemy.exc import SQLAlchemyError


def update_user(user_id, **kwargs):
    session = Session()
    #TODO sanitize and hash password
    try:
        # Fetch the user by ID
        user = session.query(User).filter(User.id == user_id).first()
        if user is None:
            return False, "User not found."

        # Update fields
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)

        user.updated_at = date.today()  # Manually update the timestamp, if not automatically handled
        session.commit()
        return True, "User successfully updated."
    except SQLAlchemyError as e:
        session.rollback()
        return False, f"Error updating user: {str(e)}"
    finally:
        session.close()

if __name__ == "__main__":
    user_id = 1  # Assuming you want to update the user with id=1
    new_details = {
        "email": "newemail@example.com",
        "username": "newusername"
    }

    result = update_user(user_id, **new_details)
    print(result)