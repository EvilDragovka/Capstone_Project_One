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

def get_queries():
    session = Session()
    users = session.query(Query).all()
    session.close()
    return users

if __name__ == "__main__":
    result = get_queries()
    print(result)