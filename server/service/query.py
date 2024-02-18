from datetime import date
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
from server.models.query import Query

engine = create_engine(
    Config.CONNECTION_TO_DATABASE,
    connect_args={
        "ssl":{
            "ssl_ca":"etc/ssl/cert.pem"
        }
    }
)

Session = sessionmaker(bind=engine)

def get_all_queries():
    session = Session()
    users = session.query(Query).all()
    session.close()
    return users

def get_all_queries_by_user_id(user_id):
    session = Session()
    queries = session.query(Query).filter_by(user_id=user_id).all()
    return queries

def get_last_five_queries_by_user_id(user_id):
    session = Session()
    queries = session.query(Query).filter_by(user_id=user_id).limit(5).all()
    session.close()
    return queries


def create_query(user_id, question):
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


if __name__ == "__main__":
    result = get_last_five_queries_by_user_id(1)
    print(result)