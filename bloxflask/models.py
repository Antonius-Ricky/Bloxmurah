from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def hash_password(password):
        return generate_password_hash(password)

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    game_name = db.Column(db.String(50), nullable=False)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    username = db.Column(db.String(80), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    items = db.Column(db.String(500), nullable=False)
    total_purchase = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(50), default='Unpaid')  
    order_status = db.Column(db.String(50), default='Pending') 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('orders', lazy=True))


    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'payment_method': self.payment_method,
            'phone_number': self.phone_number,
            'items': self.items,
            'total_purchase': self.total_purchase,  
            'payment_status': self.payment_status,
            'order_status': self.order_status,
            'created_at': self.created_at.isoformat()
        }

