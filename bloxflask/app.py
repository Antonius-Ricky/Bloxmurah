from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from models import db
from config import Config
from routes import routes

app = Flask(__name__)
app.config.from_object(Config)


jwt = JWTManager(app)
CORS(app)
db.init_app(app)
mail = Mail(app)

app.register_blueprint(routes)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
