import React from "react";
import Index from "./pages/Index";
import About from "./pages/components/AboutPage/About";
import Contact from "./pages/components/ContactPage/Contact";
import Login from "./pages/components/LoginPage/Login";
import Register from "./pages/components/RegisterPage/Register";
import TestimonialPage from "./pages/components/TestimonialPage/TestimonialPage";
import AdminPanel from "./pages/components/AdminPanel/AdminPanel";
import Product from "./pages/components/ProductList/Product";
import Cart from "./pages/components/CartPage/Cart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/testimonial" element={<TestimonialPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<AdminPanel />} />
        <Route path="/products" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
