import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./css/ProductManagement.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    image_url: '',
    price: ''
  });
  const [editProductId, setEditProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = () => {
    axios
      .post('http://localhost:5000/admin/products', newProduct)
      .then((response) => {
        console.log(response.data);
        setProducts([...products, response.data]);
        setNewProduct({
          name: '',
          image_url: '',
          price: ''
        });
      })
      .catch((error) => {
        console.error('Error adding product:', error);
      });
  };

  const handleEditProduct = (id) => {
    setEditProductId(id); // Düzenlenecek ürünün id'sini state'e kaydet
  };

  const handleUpdateProduct = () => {
    // Backend'e güncelleme isteği gönderilebilir
    console.log('Update product with id:', editProductId);
    setEditProductId(null); // Düzenleme işlemi bittikten sonra editProductId'ı null yap
  };

  const handleDeleteProduct = (id) => {
    axios
      .delete(`http://localhost:5000/admin/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id)); // Silinen ürünü listeden filtrele
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  return (
    <div className="product-management">
      <h2>Product Management</h2>
      <div className="add-product">
        <h3>Add Product</h3>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Product Name"
        />
        <input
          type="text"
          name="image_url"
          value={newProduct.image_url}
          onChange={handleInputChange}
          placeholder="Image URL"
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Price"
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      <div className="product-list"><br />
        <h3>Product List</h3>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {editProductId === product.id ? (
                <div>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleInputChange({ target: { name: 'name', value: e.target.value } })}
                  />
                  <input
                    type="text"
                    value={product.image_url}
                    onChange={(e) => handleInputChange({ target: { name: 'image_url', value: e.target.value } })}
                  />
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleInputChange({ target: { name: 'price', value: e.target.value } })}
                  />
                  <button onClick={handleUpdateProduct}>Update</button>
                </div>
              ) : (
                <div>
                  {product.name} - ${product.price}
                  <button onClick={() => handleEditProduct(product.id)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductManagement;
