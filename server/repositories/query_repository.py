from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
from models.query import Query

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
    return queries

def create_query(user_id, user_query):
    #TODO add connectivity to Llama
    #TODO acquire response from model
    response = ""
    session = Session()
    query = Query(user_id=user_id, user_query=user_query, )


if __name__ == "__main__":
    result = get_last_five_queries_by_user_id(1)
    print(result)