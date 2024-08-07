import React, { useState } from "react";
import { IoMdMail, IoMdPin, IoIosCall } from "react-icons/io";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      alert(data.message); 
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Bir hata oluştu!'); 
    }
  };
  
  return (
    <div className="contact-section">
      <div className="contact-card">
        <h2 className="contact-title">Contact Information</h2>
        <div className="contact-info">
          <div className="contact-item">
            <IoIosCall className="contact-icon" />
            <span className="contact-text">+90 123 456 78 90</span>
          </div>
          <div className="contact-item">
            <IoMdMail className="contact-icon" />
            <span className="contact-text">info@company.com</span>
          </div>
          <div className="contact-item">
            <IoMdPin className="contact-icon" />
            <span className="contact-text">
              Customer Street No:1, Ataşehir, Istanbul
            </span>
          </div>
        </div>
        <div className="map-container">
          <iframe
            title="company-location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.9278050772816!2d29.15511801571912!3d40.920463345917886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac6cb4d9a67d1%3A0x23d7338f4c96e190!2sOrhantepe%20Mahallesi%2C%20Turgut%20%C3%96zal%20Blv.%2C%20No%3A21%2C%2034865%20Kartal%2F%C4%B0stanbul%2C%20Turkey!5e0!3m2!1sen!2suk!4v1610222703658!5m2!1sen!2suk"
            frameBorder="0"
            style={{ border: "none", width: "100%", height: "300px" }}
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
          ></iframe>
        </div>
      </div>
      <div className="contact-form-card">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Contact Us</h2>
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              placeholder=" "
              required
              value={formData.name}
              onChange={handleChange}
            />
            <label htmlFor="name" className="form-label">
              Your Name
            </label>
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder=" "
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="email" className="form-label">
              Your Email Address
            </label>
          </div>
          <div className="form-group">
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder=" "
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <label htmlFor="message" className="form-label">
              Your Message
            </label>
          </div>
          <button type="submit" className="submit-btn">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
