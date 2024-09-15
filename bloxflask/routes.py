from flask import Blueprint, request, jsonify, render_template, url_for, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token, unset_jwt_cookies
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from functools import wraps
from flask_cors import cross_origin
from models import db, User, Item, Order
import jwt


routes = Blueprint('routes', __name__)
s = URLSafeTimedSerializer("your-secret-key")

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        
        if user is None or not user.is_admin:  
            return jsonify({"msg": "Admin access required"}), 403

        return fn(*args, **kwargs)
    return wrapper

@routes.route('/admin/orders', methods=['GET'])
@admin_required
def get_all_orders():
    orders = Order.query.all()
    orders_list = [
        {
            'id': order.id,
            'username': order.username,
            'payment_method': order.payment_method,
            'phone_number': order.phone_number,
            'items': order.items,
            'total_purchase': order.total_purchase,
            'payment_status': order.payment_status,
            'order_status': order.order_status
        }
        for order in orders
    ]
    return jsonify(orders_list)

@routes.route('/admin/orders/<int:order_id>', methods=['PUT'])
@admin_required
def update_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"msg": "Order not found"}), 404

    data = request.json
    payment_status = data.get('payment_status')
    order_status = data.get('order_status')

    if payment_status:
        order.payment_status = payment_status
    if order_status:
        order.order_status = order_status

    db.session.commit()

    return jsonify({"msg": "Order updated successfully"}), 200

@routes.route('/orders/history', methods=['GET'])
@jwt_required()
def get_order_history():
    username = get_jwt_identity()  
    category = request.args.get('category')

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_id = user.id  

    if category == 'menunggu_pembayaran':
        orders = Order.query.filter(
            Order.user_id == user_id, 
            Order.payment_status.ilike('Unpaid'), 
            Order.order_status.ilike('Pending')
        ).all()
    elif category == 'menunggu_dikirim':
        orders = Order.query.filter(
            Order.user_id == user_id, 
            Order.payment_status.ilike('Paid'), 
            Order.order_status.ilike('Processing')
        ).all()
    elif category == 'selesai':
        orders = Order.query.filter(
            Order.user_id == user_id, 
            Order.payment_status.ilike('Paid'), 
            Order.order_status.ilike('Completed')
        ).all()
    else:
        return jsonify({"error": "Invalid category"}), 400


    order_list = [order.serialize() for order in orders]

    return jsonify(order_list), 200
    
@routes.route('/items/<game_name>/<category>', methods=['GET'])
def get_items_by_category(game_name, category):
    items = Item.query.filter_by(game_name=game_name, category=category).all()
    items_list = [
        {
            'id': item.id,
            'name': item.name,
            'price': item.price,
            'image': f'https://bloxflask.bloxmurah.com/static/images/{game_name}/{item.image}'
        }
        for item in items
    ]
    return jsonify(items_list)


@routes.route('/categories/<game_name>', methods=['GET'])
def get_categories(game_name):
    categories = db.session.query(Item.category).filter_by(game_name=game_name).distinct().all()
    category_list = [category[0] for category in categories] 
    return jsonify(category_list)

@routes.route('/order', methods=['POST'])
@jwt_required()
def create_order():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.json
    items = data.get('items')
    payment_method = data.get('paymentMethod')
    phone_number = data.get('phoneNumber')
    total_purchase = data.get('totalPurchase')
    username = data.get('username') 

    if not all([username, items, payment_method, phone_number, total_purchase]):
        return jsonify({"msg": "Missing order information"}), 400

    last_order = Order.query.order_by(Order.id.desc()).first()
    transaction_id = (last_order.id + 1) if last_order else 1
    unique_id = f"BM{transaction_id:07d}"

    new_order = Order(
        user_id=user.id,
        username=username, 
        items=items,
        payment_method=payment_method,
        phone_number=phone_number,
        total_purchase=total_purchase
    )

    db.session.add(new_order)
    db.session.commit()

    return jsonify({
        "msg": "Order submitted successfully",
        "order_id": unique_id
    }), 201


@routes.route('/order/<order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    order = Order.query.filter_by(id=int(order_id[2:]), user_id=user.id).first()
    if not order:
        return jsonify({"msg": "Order not found or access denied"}), 404

    order_data = {
        'id': order.id,
        'username': order.username,
        'payment_method': order.payment_method,
        'phone_number': order.phone_number,
        'items': order.items,
        'total_purchase': order.total_purchase,
        'payment_status': order.payment_status,
        'order_status': order.order_status        
    }

    return jsonify(order_data)

@routes.route('/')
def index():
    return render_template('home.html', title="Home")


# @routes.route('/signup', methods=['POST'])
# def signup():
#     email = request.json.get('email', None).lower()
#     username = request.json.get('username', None).lower()
#     password = request.json.get('password', None)

#     if User.query.filter(db.func.lower(User.email) == email).first():
#         return jsonify({"msg": "Email is already taken"}), 400

#     if User.query.filter(db.func.lower(User.username) == username).first():
#         return jsonify({"msg": "Username already taken"}), 400

#     token = s.dumps({'email': email, 'username': username, 'password': password}, salt='email-confirm')

#     verify_url = url_for('routes.verify_email', token=token, _external=True)

#     msg = Message('Confirm Your Email', sender=current_app.config['MAIL_USERNAME'], recipients=[email])
#     msg.body = f'Please click the following link to verify your email and activate your account: {verify_url}'

#     try:
#         from app import mail  
#         mail.send(msg)
#         return jsonify({"msg": "Please check your email to confirm your account."}), 200
#     except Exception as e:
#         return jsonify({"msg": f"Failed to send verification email: {str(e)}"}), 500

@routes.route('/signup', methods=['POST'])
def signup():
    email = request.json.get('email', None).lower()
    username = request.json.get('username', None).lower()
    password = request.json.get('password', None)

    if User.query.filter(db.func.lower(User.email) == email).first():
        return jsonify({"msg": "Email is already taken"}), 400

    if User.query.filter(db.func.lower(User.username) == username).first():
        return jsonify({"msg": "Username already taken"}), 400

    try:
        new_user = User(email=email, username=username, password_hash=User.hash_password(password))
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "Account created successfully."}), 201
    except Exception as e:
        return jsonify({"msg": f"Failed to create account: {str(e)}"}), 500


@routes.route('/verify_email/<token>', methods=['GET'])
def verify_email(token):
    try:

        data = s.loads(token, salt='email-confirm', max_age=3600)
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "Email is already verified"}), 400

        new_user = User(email=email, username=username, password_hash=User.hash_password(password))
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "Email verified successfully, account created."}), 201

    except SignatureExpired:
        return jsonify({"msg": "The verification link has expired."}), 400
    except BadSignature:
        return jsonify({"msg": "Invalid or tampered verification link."}), 400
    except Exception as e:
        return jsonify({"msg": f"An error occurred: {str(e)}"}), 400

@routes.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None).lower()
    password = request.json.get('password', None)
    user = User.query.filter(db.func.lower(User.username) == username).first()

    if not user or not user.check_password(password):
        return jsonify({"msg": "Bad username or password"}), 401

    user_agent = request.headers.get('User-Agent', 'unknown device')
    device_claims = {'device': user_agent}
    access_token = create_access_token(identity=user.username, additional_claims=device_claims)
    refresh_token = create_refresh_token(identity=user.username)
    
    return jsonify(access_token=access_token, refresh_token=refresh_token)

@routes.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    if user:
        user_profile = {
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin
        }
        response = jsonify(user_profile=user_profile)
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        return response
    else:
        return jsonify({"msg": "User not found"}), 404
@routes.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token)

@routes.route('/forgot-password', methods=['POST'])
def forgot_password():
    email = request.json.get('email', None)
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg": "Email not found"}), 404

    token = s.dumps(email, salt='email-confirm')

    link = f'https://bloxmurah.com/reset-password/{token}'

    msg = Message('Password Reset Request', 
                  sender=current_app.config['MAIL_USERNAME'], 
                  recipients=[email])
    msg.body = f'Your password reset link is: {link}'
    
    try:
        from app import mail
        mail.send(msg)
        return jsonify({"msg": "Password reset link sent"}), 200
    except Exception as e:
        return jsonify({"msg": f"Failed to send reset link: {str(e)}"}), 500

@routes.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)
    except SignatureExpired:
        return jsonify({"msg": "The token is expired"}), 400
    except BadSignature:
        return jsonify({"msg": "Invalid or tampered token"}), 400

    password = request.json.get('password', None)
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    if not password:
        return jsonify({"msg": "Password is required"}), 400

    user.password_hash = User.hash_password(password)
    db.session.commit()

    return jsonify({"msg": "Password has been reset"}), 200

@routes.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response) 
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response, 200

@routes.route('/about')
def about():
    title = 'About us'
    return render_template("about.html", title=title)