import React, { useState } from "react";
import TestimonialForm from "./TestimonialForm";
import TestimonialShow from "./TestimonialShow";
import "./Testimonial.css";

const Testimonial = () => {
  const initialTestimonials = [

  ];

  const [testimonials, setTestimonials] = useState(initialTestimonials);

  const addTestimonial = (testimonial) => {
    setTestimonials([...testimonials, testimonial]);
  };

  return (
    <div className="testimonial-page">
      <div className="testimonial-header">
        <h1>Customer Testimonials</h1>
      </div>
      <TestimonialForm addTestimonial={addTestimonial} />
      <TestimonialShow testimonials={testimonials} />
    </div>
  );
};

export default Testimonial;
