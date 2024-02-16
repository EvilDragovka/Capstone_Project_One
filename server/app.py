from flask import Flask
from flask_cors import CORS
from routes.user import user_bp  # Ensure correct import path


app = Flask(__name__)
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api/users')


if __name__ == '__main__':
    app.run(debug=True)