from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
from models.user import User

engine = create_engine(
    Config.CONNECTION_TO_DATABASE,
    connect_args={
        "ssl":{
            "ssl_ca":"etc/ssl/cert.pem"
        }
    }
)

Session = sessionmaker(bind=engine)

def get_users():
    session = Session()
    users = session.query(User).all()
    session.close()
    return users


def login(identifier, password):
    session = Session()

    # Check if the identifier is a username or an email
    user = session.query(User).filter((User.username == identifier) | (User.email == identifier)).first()
    rm = "Login successful."

    if user:
        # Check if the password matches
        if user.password == password:
            session.close()
        else:
            rm = "Incorrect password."
    else:
        rm = "User not found."

    session.close()
    return rm

def register(username, password, email):
    session = Session()

    rm = "Registration successful."

    # Check if username is already taken
    existing_user = session.query(User).filter(User.username == username).first()
    if existing_user:
        session.close()
        return "Username is taken."

    # Check if email is already taken
    existing_email = session.query(User).filter(User.email == email).first()
    if existing_email:
        session.close()
        return "Email is taken."

    # Check if username and email length is within limits
    if len(username) > 25:
        session.close()
        return "Username must be at most 25 characters."

    if len(email) > 100:
        session.close()
        return "Email must be at most 100 characters."

    # Create a new user
    new_user = User(username=username, password=password, email=email)
    session.add(new_user)
    session.commit()
    session.close()

    return rm


if __name__ == "__main__":
    message = register("new_username0", "password123", "emil@example.com")

    print(message)
