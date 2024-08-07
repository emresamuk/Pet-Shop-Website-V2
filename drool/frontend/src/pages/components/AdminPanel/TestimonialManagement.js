import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/TestimonialManagement.css";

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    message: "",
  });
  const [editedTestimonial, setEditedTestimonial] = useState(null); 

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = () => {
    axios
      .get("http://localhost:5000/admin/testimonials")
      .then((response) => {
        setTestimonials(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTestimonial({ ...newTestimonial, [name]: value });
  };

  const handleAddTestimonial = () => {
    axios
      .post("http://localhost:5000/admin/testimonials", newTestimonial)
      .then((response) => {
        console.log(response.data);
        fetchTestimonials();
        setNewTestimonial({
          name: "",
          message: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteTestimonial = (id) => {
    axios
      .delete(`http://localhost:5000/admin/testimonials/${id}`)
      .then(() => {
        fetchTestimonials();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditTestimonial = (testimonial) => {
    setEditedTestimonial(testimonial); 
  };

  const handleUpdateTestimonial = () => {
    axios
      .put(`http://localhost:5000/testimonials/${editedTestimonial.id}`, editedTestimonial)
      .then(() => {
        fetchTestimonials();
        setEditedTestimonial(null); 
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="testimonial-management">
      <h2>Testimonial Management</h2>
      <div className="add-testimonial">
        <h3>Add Testimonial</h3>
        <input
          type="text"
          name="name"
          value={newTestimonial.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <textarea
          name="message"
          value={newTestimonial.message}
          onChange={handleInputChange}
          placeholder="Message"
        ></textarea>
        <button onClick={handleAddTestimonial}>Add Testimonial</button>
      </div>
      <div className="testimonial-list">
        <h3>Testimonial List</h3>
        <ul>
          {testimonials.map((testimonial) => (
            <li key={testimonial.id}>
              <strong>Name:</strong> {testimonial.name}
              <br />
              <strong>Message:</strong> {testimonial.message}
              <button onClick={() => handleEditTestimonial(testimonial)}>
                Edit
              </button>
              <button onClick={() => handleDeleteTestimonial(testimonial.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      {editedTestimonial && (
        <div className="edit-testimonial">
          <h3>Edit Testimonial</h3>
          <input
            type="text"
            name="name"
            value={editedTestimonial.name}
            onChange={(e) => setEditedTestimonial({ ...editedTestimonial, name: e.target.value })}
            placeholder="Name"
          />
          <textarea
            name="message"
            value={editedTestimonial.message}
            onChange={(e) => setEditedTestimonial({ ...editedTestimonial, message: e.target.value })}
            placeholder="Message"
          ></textarea>
          <button onClick={handleUpdateTestimonial}>Update Testimonial</button>
        </div>
      )}
    </div>
  );
};

export default TestimonialManagement;
