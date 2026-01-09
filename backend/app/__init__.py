import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///sesmt.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me")

    # Allow Vite dev server
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    db.init_app(app)
    jwt.init_app(app)

    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    with app.app_context():
        from .models import User
        db.create_all()
        # Seed admin if missing
        admin_email = os.getenv("ADMIN_EMAIL", "admin@sesmt.local").lower()
        admin_pw = os.getenv("ADMIN_PASSWORD", "admin123")
        if not User.query.filter_by(email=admin_email).first():
            User.create_admin(email=admin_email, password=admin_pw)

    return app
