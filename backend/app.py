from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
# Replace with your actual database credentials
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/wagnor'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement=True )
    title = db.Column(db.String(80), unique=True, nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    imageUrl = db.Column(db.String(200), nullable=False)
    raiting = db.Column(db.Integer,default=0 )
    category = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Integer, default=1 )

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'price': self.price,
            'description': self.description,
            'imageUrl': self.imageUrl,
            'rating': self.raiting,
            'category': self.category,
            'quantity':self.quantity
        }

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return "My flask app"

@app.route('/api/products', methods=['POST'])
def create_product():
  # Get product data from request body
  data = request.get_json()

  # Validate required fields
  if not all([data.get(field) for field in ['title', 'price', 'description', 'imageUrl', 'category', 'quantity']]):
    return jsonify({'message': 'Missing required fields'}), 400

  # Create a new product object
  new_product = Product(
      title=data['title'],
      price=data['price'],
      description=data['description'],
      imageUrl=data['imageUrl'],
      category=data['category'],
      quantity=data['quantity']
  )

  # Add the new product to the database session
  db.session.add(new_product)

  # Commit the changes to the database
  try:
    db.session.commit()
  except Exception as e:
    # Handle potential database errors
    print(f"Error creating product: {e}")
    return jsonify({'message': 'Error creating product'}), 500

  # Return the newly created product data
  return jsonify(new_product.serialize())

@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.serialize() for product in products])


@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    product = Product.query.get(product_id)
    if product is None:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify(product.serialize())


@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
  # Find the product by its ID
  product = Product.query.get(product_id)

  if product is None:
    return jsonify({'message': 'Product not found'}), 404

  # Delete the product from the database session
  db.session.delete(product)

  # Commit the changes to the database
  try:
    db.session.commit()
  except Exception as e:
    # Handle potential database errors
    print(f"Error deleting product: {e}")
    return jsonify({'message': 'Error deleting product'}), 500

  # Return a success message
  return jsonify({'message': 'Product deleted successfully'})
  
if __name__ == "__main__":
    app.run(debug=True)