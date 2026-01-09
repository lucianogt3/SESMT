from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="admin")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @staticmethod
    def create_admin(email: str, password: str):
        u = User(email=email, password_hash=generate_password_hash(password), role="admin")
        db.session.add(u)
        db.session.commit()
        return u

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    setores = db.Column(db.Text, nullable=False, default="[]")
    partesCorpo = db.Column(db.Text, nullable=False, default="[]")
    locais = db.Column(db.Text, nullable=False, default="[]")
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Notificacao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Text, nullable=False)  # store JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
