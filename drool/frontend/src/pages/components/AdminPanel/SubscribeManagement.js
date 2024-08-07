import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/SubscribeManagement.css";

const SubscribeManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [newSubscriber, setNewSubscriber] = useState({ email: "" });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/subscribers");
      setSubscribers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSubscriber({ ...newSubscriber, [name]: value });
  };

  const handleAddSubscriber = async () => {
    try {
      await axios.post("http://localhost:5000/admin/subscribers", newSubscriber);
      setNewSubscriber({ email: "" });
      fetchSubscribers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSubscriber = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/subscribers/${id}`);
      fetchSubscribers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="subscribe-management">
      <h2>Subscribe Management</h2>
      <div className="add-subscriber">
        <h3>Add Subscriber</h3>
        <input
          type="email"
          name="email"
          value={newSubscriber.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <button onClick={handleAddSubscriber}>Add Subscriber</button>
      </div>
      <div className="subscriber-list">
        <br />
        <h3>Subscriber List</h3>
        <ul>
          {subscribers.map((subscriber) => (
            <li key={subscriber.id}>
              {subscriber.email}
              <button onClick={() => handleDeleteSubscriber(subscriber.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubscribeManagement;
