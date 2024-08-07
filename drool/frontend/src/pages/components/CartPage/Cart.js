import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Cart.css"; // CSS dosyasını içe aktar

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get('http://localhost:5000/cart');
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/cart/${productId}`);
            fetchCart();
        } catch (error) {
            console.error('Error removing product from cart:', error);
        }
    };

    return (
        <div className="cart-container"> 
            <h2 className="cart-header">Shopping Cart</h2> 
            <ul className="cart-list"> 
                {cart.map(product => (
                    <li key={product.id} className="cart-item"> 
                        <img src={product.image_url} alt={product.name} style={{ width: '100px' }} className="cart-item-img" /> 
                        <div className="cart-item-details"> 
                            <h3 className="cart-item-name">{product.name}</h3> 
                            <p className="cart-item-price">Price: ${product.price}</p> 
                        </div>
                        <button onClick={() => removeFromCart(product.id)} className="remove-button">Remove</button> 
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Cart;
