import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import axios from 'axios';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/admin/subscribers", { email });
      setEmail('');
      alert('Abonelik başarıyla tamamlandı!');
    } catch (error) {
      console.error('Abonelik işlemi başarısız oldu.', error);
      alert('Abonelik işlemi başarısız oldu.');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h5>İLETİŞİM BİLGİLERİ</h5>
          <ul>
            <li><FaPhone /> +01 1234567890</li>
            <li><FaEnvelope /> demo@gmail.com</li>
          </ul>
        </div>
        <div className="footer-section">
          <h5>ÇALIŞMA SAATLERİ</h5>
          <ul>
            <li>Pazartesi - Cuma</li>
            <li>07:00 - 16:00</li>
          </ul>
        </div>
        <div className="footer-section">
          <h5>SOSYAL MEDYA</h5>
          <ul>
            <li><a href="xyz"><FaFacebookF /> Facebook</a></li>
            <li><a href="xyz"><FaTwitter /> Twitter</a></li>
            <li><a href="xyz"><FaLinkedinIn /> LinkedIn</a></li>
            <li><a href="xyz"><FaInstagram /> Instagram</a></li>
          </ul>
        </div>
        <div className="footer-section footer-newsletter">
          <h5>BÜLTENE ABONE OL</h5>
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="E-posta Adresinizi Girin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Abone Ol</button>
          </form>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
