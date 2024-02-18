import logging
from datetime import date
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
from models.query import Query

engine = create_engine(
    Config.CONNECTION_TO_DATABASE,
    connect_args={
        "ssl": {
            "ssl_ca": "etc/ssl/cert.pem"
        }
    }
)

Session = sessionmaker(bind=engine)


def get_all():
    session = Session()
    users = session.query(Query).all()
    session.close()
    return users


def get_by_user_id(user_id):
    session = Session()
    queries = session.query(Query).filter_by(user_id=user_id).all()
    session.close()
    return queries


def get_recent(user_id, count, offset):
    session = Session()
    queries = session.query(Query).filter_by(user_id=user_id).order_by(Query.id).limit(count).offset(offset).all()
    session.close()
    return queries


def create(user_id, question):
    # TODO add connectivity to Llama
    # TODO acquire response from model
    response = ""
    session = Session()
    try:
        new_query = Query(user_id=user_id, question=question, response=response, date=date.today())
        session.add(new_query)
        session.commit()
        return True, "Query successfully created."
    except SQLAlchemyError as e:
        session.rollback()
        return False, f"Error creating query: {str(e)}"
    finally:
        session.close()


def delete_by_id(query_id):
    with Session() as session:  # Use context manager for the session
        try:
            # Attempt to retrieve the query first to check existence
            query = session.query(Query).filter_by(id=query_id).one_or_none()
            if query is not None:
                return False, "Query not found."

            # Delete the found Query
            session.delete(query)
            session.commit()
            return True, "Query successfully deleted."
        except SQLAlchemyError as e:
            session.rollback()
            logging.exception("Failed to delete query: %s", e)  # Log the exception
            return False, f"An error occurred: {e}"
