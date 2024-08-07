// TestimonialShow.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Testimonial.css";

const TestimonialShow = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('http://localhost:5000/testimonial');
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // 5 saniye aralıklarla değişim

    return () => clearInterval(interval);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) {
    return <div>No testimonials to display.</div>;
  }

  return (
    <div className='testimonial-container'>
      <div className='testimonial-header'>
        <p className='testimonial-header-text'>What Our Members Say</p>
      </div>
      <div className='testimonial-list'>
        {testimonials.map((testimonial, index) => (
          <div key={index} className={`testimonial-item ${index === currentTestimonialIndex ? 'active' : 'inactive'}`}>
            <p className='testimonial-message'>"{testimonial.message}"</p>
            <p className='testimonial-author'>{testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialShow;
