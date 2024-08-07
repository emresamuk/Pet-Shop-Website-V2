import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/SliderManagement.css";

const SliderManagement = () => {
  const [sliders, setSliders] = useState([]);
  const [newSlider, setNewSlider] = useState({
    title: "",
    description: "",
    image_url: "",
  });
  const [editedSlider, setEditedSlider] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/sliders")
      .then((response) => {
        setSliders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSlider({ ...newSlider, [name]: value });
  };

  const handleAddSlider = () => {
    axios
      .post("http://localhost:5000/admin/sliders", newSlider)
      .then((response) => {
        console.log(response.data);
        setSliders([...sliders, response.data]);
        setNewSlider({ title: "", description: "", image_url: "" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateSlider = () => {
    axios
      .put(`http://localhost:5000/admin/sliders/${editedSlider.id}`, editedSlider)
      .then(() => {
        setSliders(
          sliders.map((slider) => (slider.id === editedSlider.id ? editedSlider : slider))
        );
        setEditedSlider(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteSlider = (id) => {
    axios
      .delete(`http://localhost:5000/admin/sliders/${id}`)
      .then(() => {
        setSliders(sliders.filter((slider) => slider.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditSlider = (slider) => {
    setEditedSlider(slider);
  };

  return (
    <div className="slider-management">
      <h2>Slider Management</h2>
      <div className="add-slider">
        <h3>Add Slider Item</h3>
        <input
          type="text"
          name="title"
          value={newSlider.title}
          onChange={handleInputChange}
          placeholder="Title"
        />
        <textarea
          name="description"
          value={newSlider.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="text"
          name="image_url"
          value={newSlider.image_url}
          onChange={handleInputChange}
          placeholder="Image URL"
        />
        <button onClick={handleAddSlider}>Add Slider</button>
      </div>
      <div className="slider-list">
        <br />
        <h3>Slider List</h3>
        <ul>
          {sliders.map((slider) => (
            <li key={slider.id}>
              <h4>{slider.title}</h4>
              <p>{slider.description}</p>
              <img src={slider.image_url} alt={slider.title} />
              <button onClick={() => handleEditSlider(slider)}>Edit</button>
              <button onClick={() => handleDeleteSlider(slider.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {editedSlider && (
        <div className="edit-slider">
          <h3>Edit Slider Item</h3>
          <input
            type="text"
            name="title"
            value={editedSlider.title}
            onChange={(e) => setEditedSlider({ ...editedSlider, title: e.target.value })}
            placeholder="Title"
          />
          <textarea
            name="description"
            value={editedSlider.description}
            onChange={(e) => setEditedSlider({ ...editedSlider, description: e.target.value })}
            placeholder="Description"
          />
          <input
            type="text"
            name="image_url"
            value={editedSlider.image_url}
            onChange={(e) => setEditedSlider({ ...editedSlider, image_url: e.target.value })}
            placeholder="Image URL"
          />
          <button onClick={handleUpdateSlider}>Update Slider</button>
        </div>
      )}
    </div>
  );
};

export default SliderManagement;
