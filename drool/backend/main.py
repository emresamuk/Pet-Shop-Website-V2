from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Drool.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app)

cart = []
subscribers = []


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200))

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    message = db.Column(db.String(500))


class Testimonial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    message = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(200))
    price = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"Product('{self.name}', '{self.price}')"
    
class TeamMember(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(200))

    def __repr__(self):
        return f"TeamMember('{self.name}', '{self.role}')"


class SliderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"SliderItem(title={self.title}, description={self.description}, image_url={self.image_url})"
    
class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return '<Subscription %r>' % self.email



@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    full_name = data['fullName']
    email = data['email']
    password = data['password']
    confirm_password = data['confirmPassword']

    if password != confirm_password:
        return jsonify({'message': 'Passwords must match'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Email already in use'}), 400

    new_user = User(full_name=full_name, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    
@app.route('/contact', methods=['POST'])
def send_contact():
    data = request.get_json()  
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({'error': 'Incomplete data provided'}), 400

    new_message = Contact(name=name, email=email, message=message)
    db.session.add(new_message)
    db.session.commit()

    return jsonify({'message': 'Message sent successfully!'}), 200


@app.route('/testimonial', methods=['GET'])
def get_testimonials():
    testimonials = Testimonial.query.order_by(Testimonial.created_at.desc()).limit(5).all()
    testimonial_list = [{'message': testimonial.message} for testimonial in testimonials]
    return jsonify(testimonial_list)

@app.route('/testimonial', methods=['POST'])
def add_testimonial():
    data = request.get_json()  
    name = data.get('name')
    message = data.get('message')

    if not name or not message:
        return jsonify({'error': 'Please provide both name and message'}), 400

    new_testimonial = Testimonial(name=name, message=message)
    db.session.add(new_testimonial)
    db.session.commit()

    return jsonify({'message': 'Testimonial added successfully!'}), 201

@app.route('/products', methods=['GET'])
def get_products():
    # Retrieve products from the database
    products = Product.query.all()
    # Serialize the products into JSON
    product_list = [{'id': product.id, 'name': product.name, 'image_url': product.image_url, 'price': product.price} for product in products]
    # Return JSON response
    return jsonify(product_list)

@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    name = data['name']
    image_url = data['image_url']
    price = data['price']
    # Create a new product
    new_product = Product(name=name, image_url=image_url, price=price)
    # Add the new product to the database
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'message': 'Product added successfully'}), 201


# Sepete ürün eklemek için POST isteği
@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    product_id = data.get('product_id')

    # Ürün ID'si gönderilmemişse hata döndür
    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400

    # Gerçek ürün var mı kontrol et
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    # Sepete ekleyelim
    cart.append(product_id)
    return jsonify({'message': 'Product added to cart successfully'}), 201

# Sepetteki ürünleri getirmek için GET isteği
@app.route('/cart', methods=['GET'])
def get_cart():
    # Sepet içeriğini döndür
    cart_products = [Product.query.get(product_id) for product_id in cart]
    cart_data = [{'id': product.id, 'name': product.name, 'image_url': product.image_url, 'price': product.price} for product in cart_products]
    return jsonify(cart_data), 200

# Sepetten ürün kaldırmak için DELETE isteği
@app.route('/cart/<int:product_id>', methods=['DELETE'])
def remove_from_cart(product_id):
    # Ürünü sepetten kaldır
    if product_id in cart:
        cart.remove(product_id)
        return jsonify({'message': 'Product removed from cart successfully'}), 200
    else:
        return jsonify({'error': 'Product not found in cart'}), 404
    
@app.route('/subscribe', methods=['POST'])
def subscribe():
    data = request.json
    email = data.get('email')

    if email:
        # E-posta adresini veritabanına kaydet
        subscription = Subscription(email=email)
        db.session.add(subscription)
        db.session.commit()
        return jsonify({'message': 'Abonelik başarıyla tamamlandı!'}), 201
    else:
        return jsonify({'error': 'E-posta adresi eksik!'}), 400


# User Management Endpoints
@app.route('/admin/users', methods=['GET'])
def get_users_for_admin():
    users = User.query.all()
    user_list = [{'id': user.id, 'full_name': user.full_name, 'email': user.email} for user in users]
    return jsonify(user_list)

@app.route('/admin/users', methods=['POST'])
def add_user_for_admin():
    data = request.get_json()
    full_name = data['full_name']
    email = data['email']
    password = data['password']
    confirm_password = data['confirmPassword']

    if password != confirm_password:
        return jsonify({'message': 'Passwords must match'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Email already in use'}), 400

    new_user = User(full_name=full_name, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User added successfully'}), 201

@app.route('/admin/users/<int:user_id>', methods=['PUT'])
def update_user_for_admin(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    user.full_name = data.get('full_name', user.full_name)
    user.email = data.get('email', user.email)

    # Yalnızca şifre boş olmadığında güncelle
    password = data.get('password')
    if password:
        user.set_password(password)

    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200


@app.route('/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user_for_admin(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404

# Contact Management Endpoints
@app.route('/admin/contacts', methods=['GET'])
def get_contacts_for_admin():
    contacts = Contact.query.all()
    contact_list = [{'id': contact.id, 'name': contact.name, 'email': contact.email, 'message': contact.message} for contact in contacts]
    return jsonify(contact_list)

@app.route('/admin/contacts', methods=['POST'])
def add_contact_for_admin():
    data = request.get_json()  
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({'error': 'Incomplete data provided'}), 400

    new_contact = Contact(name=name, email=email, message=message)
    db.session.add(new_contact)
    db.session.commit()

    return jsonify({'message': 'Contact added successfully!'}), 201

@app.route('/admin/contacts/<int:contact_id>', methods=['PUT'])
def update_contact_for_admin(contact_id):
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({'message': 'Contact not found'}), 404

    data = request.get_json()
    contact.name = data.get('name', contact.name)
    contact.email = data.get('email', contact.email)
    contact.message = data.get('message', contact.message)

    db.session.commit()

    return jsonify({'message': 'Contact updated successfully'}), 200


@app.route('/admin/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact_for_admin(contact_id):
    contact = Contact.query.get(contact_id)
    if contact:
        db.session.delete(contact)
        db.session.commit()
        return jsonify({'message': 'Contact deleted successfully'}), 200
    else:
        return jsonify({'message': 'Contact not found'}), 404
    
# Testimonial Management Endpoints
@app.route('/admin/testimonials', methods=['GET'])
def get_testimonials_for_admin():
    testimonials = Testimonial.query.all()
    testimonial_list = [{'id': testimonial.id, 'name': testimonial.name, 'message': testimonial.message, 'created_at': testimonial.created_at} for testimonial in testimonials]
    return jsonify(testimonial_list)

@app.route('/admin/testimonials', methods=['POST'])
def add_testimonial_for_admin():
    data = request.get_json()  
    name = data.get('name')
    message = data.get('message')

    if not name or not message:
        return jsonify({'error': 'Please provide both name and message'}), 400

    new_testimonial = Testimonial(name=name, message=message)
    db.session.add(new_testimonial)
    db.session.commit()

    return jsonify({'message': 'Testimonial added successfully!'}), 201

@app.route('/admin/testimonials/<int:testimonial_id>', methods=['PUT'])
def update_testimonial_for_admin(testimonial_id):
    testimonial = Testimonial.query.get(testimonial_id)
    if not testimonial:
        return jsonify({'error': 'Testimonial not found'}), 404

    data = request.get_json()
    name = data.get('name')
    message = data.get('message')

    if not name or not message:
        return jsonify({'error': 'Please provide both name and message'}), 400

    testimonial.name = name
    testimonial.message = message
    db.session.commit()

    return jsonify({'message': 'Testimonial updated successfully'}), 200


@app.route('/admin/testimonials/<int:testimonial_id>', methods=['DELETE'])
def delete_testimonial_for_admin(testimonial_id):
    testimonial = Testimonial.query.get(testimonial_id)
    if testimonial:
        db.session.delete(testimonial)
        db.session.commit()
        return jsonify({'message': 'Testimonial deleted successfully'}), 200
    else:
        return jsonify({'message': 'Testimonial not found'}), 404
    
# Define routes for managing products in admin panel
@app.route('/admin/products', methods=['GET'])
def get_products_for_admin():
    products = Product.query.all()
    product_list = [{'id': product.id, 'name': product.name, 'image_url': product.image_url, 'price': product.price} for product in products]
    return jsonify(product_list)

@app.route('/admin/products', methods=['POST'])
def add_product_for_admin():
    data = request.get_json()
    name = data.get('name')
    image_url = data.get('image_url')
    price = data.get('price')

    if not name or not price:
        return jsonify({'error': 'Name and price are required'}), 400

    new_product = Product(name=name, image_url=image_url, price=price)
    db.session.add(new_product)
    db.session.commit()

    return jsonify({'message': 'Product added successfully', 'id': new_product.id}), 201

@app.route('/admin/products/<int:product_id>', methods=['PUT'])
def update_product_for_admin(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    data = request.get_json()
    name = data.get('name')
    image_url = data.get('image_url')
    price = data.get('price')

    if not name or not price:
        return jsonify({'error': 'Name and price are required'}), 400

    product.name = name
    product.image_url = image_url
    product.price = price
    db.session.commit()

    return jsonify({'message': 'Product updated successfully'}), 200

@app.route('/admin/products/<int:product_id>', methods=['DELETE'])
def delete_product_for_admin(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully'}), 200


# Team Admin Endpoints
@app.route('/admin/team', methods=['GET'])
def get_team_members_for_admin():
    team_members = TeamMember.query.all()
    team_member_list = [{'id': member.id, 'name': member.name, 'role': member.role, 'image_url': member.image_url} for member in team_members]
    return jsonify(team_member_list)

@app.route('/admin/team', methods=['POST'])
def add_team_member_for_admin():
    data = request.get_json()
    name = data.get('name')
    role = data.get('role')
    image_url = data.get('image_url')

    if not name or not role:
        return jsonify({'error': 'Name and role are required'}), 400

    new_member = TeamMember(name=name, role=role, image_url=image_url)
    db.session.add(new_member)
    db.session.commit()

    return jsonify({'message': 'Team member added successfully', 'id': new_member.id}), 201

@app.route('/admin/team/<int:member_id>', methods=['PUT'])
def update_team_member_for_admin(member_id):
    member = TeamMember.query.get(member_id)
    if not member:
        return jsonify({'error': 'Team member not found'}), 404

    data = request.get_json()
    member.name = data.get('name', member.name)
    member.role = data.get('role', member.role)
    member.image_url = data.get('image_url', member.image_url)

    db.session.commit()

    return jsonify({'message': 'Team member updated successfully'}), 200

@app.route('/admin/team/<int:member_id>', methods=['DELETE'])
def delete_team_member_for_admin(member_id):
    member = TeamMember.query.get(member_id)
    if not member:
        return jsonify({'error': 'Team member not found'}), 404

    db.session.delete(member)
    db.session.commit()

    return jsonify({'message': 'Team member deleted successfully'}), 200


# Admin paneli için GET, POST, PUT ve DELETE istekleri
@app.route('/admin/sliders', methods=['GET', 'POST'])
def sliders():
    if request.method == 'GET':
        sliders = SliderItem.query.all()
        slider_list = [{'id': slider.id, 'title': slider.title, 'description': slider.description, 'image_url': slider.image_url} for slider in sliders]
        return jsonify(slider_list), 200
    elif request.method == 'POST':
        data = request.json
        title = data.get('title')
        description = data.get('description')
        image_url = data.get('image_url')

        if not title or not description or not image_url:
            return jsonify({'error': 'Incomplete data provided'}), 400

        new_slider = SliderItem(title=title, description=description, image_url=image_url)
        db.session.add(new_slider)
        db.session.commit()
        return jsonify({'id': new_slider.id, 'title': new_slider.title, 'description': new_slider.description, 'image_url': new_slider.image_url}), 201

@app.route('/admin/sliders/<int:slider_id>', methods=['PUT', 'DELETE'])
def slider(slider_id):
    slider = SliderItem.query.get_or_404(slider_id)
    if request.method == 'PUT':
        data = request.json
        title = data.get('title')
        description = data.get('description')
        image_url = data.get('image_url')

        if not title or not description or not image_url:
            return jsonify({'error': 'Incomplete data provided'}), 400

        slider.title = title
        slider.description = description
        slider.image_url = image_url
        db.session.commit()
        return jsonify({'id': slider.id, 'title': slider.title, 'description': slider.description, 'image_url': slider.image_url}), 200
    elif request.method == 'DELETE':
        db.session.delete(slider)
        db.session.commit()
        return jsonify({'message': 'Slider item deleted successfully'}), 200
    

@app.route('/admin/subscribers', methods=['GET'])
def get_subscribers():
    return jsonify(subscribers)

@app.route('/admin/subscribers', methods=['POST'])
def add_subscriber():
    data = request.json
    email = data.get('email')
    if email:
        subscriber = {'id': len(subscribers) + 1, 'email': email}
        subscribers.append(subscriber)
        return jsonify(subscriber), 201
    else:
        return jsonify({'error': 'Email is required!'}), 400

@app.route('/admin/subscribers/<int:subscriber_id>', methods=['DELETE'])
def delete_subscriber(subscriber_id):
    global subscribers
    subscribers = [subscriber for subscriber in subscribers if subscriber['id'] != subscriber_id]
    return jsonify({'message': 'Subscriber deleted'}), 200

    

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)