import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">
        <a href="/" className="nav-logo">DROOL</a>
        <nav className="nav-menu">
          <a href="/" className="nav-item">Ana Sayfa</a>
          <a href="/about" className="nav-item">Hakkında</a>
          <a href="/contact" className="nav-item">Contact</a>
          <a href="/testimonial" className="nav-item">Testimonial</a>
          <a href="/products" className="nav-item">Product</a>
          <a href="/cart" className="nav-item">Cart</a>
          <a href="/dashboard" className="nav-item">Dashboard</a>
        </nav>
        <div className="nav-search">
          <input type="search" placeholder="Ara" className="search-input" />
          <button type="submit" className="search-button"></button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
