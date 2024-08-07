import React, { useState } from 'react';
import axios from 'axios';
import "./Testimonial.css";

const TestimonialForm = ({ addTestimonial }) => {
  const [name, setName] = useState('');
  const [newTestimonial, setNewTestimonial] = useState('');
  const [messageError, setMessageError] = useState('');
  const [nameError, setNameError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setNameError('Please enter your name.');
      return;
    }
    if (!newTestimonial.trim()) {
      setMessageError('Please enter your testimonial.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/testimonial', { name, message: newTestimonial });
      addTestimonial({ name, message: newTestimonial });
      setName('');
      setNewTestimonial('');
      setNameError('');
      setMessageError('');
    } catch (error) {
      console.error('Error adding testimonial:', error);
      // Handle error state here
    }
  };

  return (
    <div className='testimonial-form'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Your Name'
        />
        {nameError && <p className="error-message">{nameError}</p>}
        <textarea
          value={newTestimonial}
          onChange={(e) => setNewTestimonial(e.target.value)}
          placeholder='Write your testimonial...'
          rows='4'
        />
        {messageError && <p className="error-message">{messageError}</p>}
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default TestimonialForm;
