from flask import Flask
from flask_cors import CORS
from routes.user import user_bp
from routes.query import query_bp


app = Flask(__name__)
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(query_bp, url_prefix='/api/queries')

if __name__ == '__main__':
    app.run(debug=True)
