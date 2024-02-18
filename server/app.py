from flask import Flask
from flask_cors import CORS
from routes.query import query_bp
from routes.user import user_bp
from routes.llm import llama_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(query_bp, url_prefix='/api/queries')
app.register_blueprint(llama_bp, url_prefix='/api/llama')

if __name__ == '__main__':
    app.run(debug=True)
