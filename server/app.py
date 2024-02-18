from flask import Flask
from flask_cors import CORS
from routes.user import user_bp  # Ensure correct import path
from routes.llm import llama_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(llama_bp, url_prefix='/api/llama')

if __name__ == '__main__':
    app.run(debug=True)