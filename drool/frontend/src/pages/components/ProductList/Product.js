import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Product.css";

const Product = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/products'); 
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addToCart = async (product) => {
        try {
            await axios.post('http://localhost:5000/cart', { product_id: product.id });
            // Sepete ürün eklendikten sonra, ürünleri yeniden getir
            fetchProducts();
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    return (
        <div className="container">
            {products.map(product => (
                <div key={product.id} className="product-card">
                    <img src={product.image_url} alt={product.name} className="product-image" />
                    <div className="product-info">
                        <h3 className="product-title">{product.name}</h3>
                        <p className="product-price">Fiyat: ${product.price}</p>
                    </div>
                    <button className="buy-button" onClick={() => addToCart(product)}>Satın Al</button>
                </div>
            ))}
        </div>
    );
};

export default Product;
