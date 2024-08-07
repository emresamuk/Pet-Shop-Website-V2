import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/ContactManagement.css";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [editedContact, setEditedContact] = useState(null); // Düzenlenecek iletiyi state olarak ekledik

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = () => {
    axios
      .get("http://localhost:5000/admin/contacts")
      .then((response) => {
        setContacts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleAddContact = () => {
    axios
      .post("http://localhost:5000/admin/contacts", newContact)
      .then((response) => {
        console.log(response.data);
        fetchContacts();
        setNewContact({
          name: "",
          email: "",
          message: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateContact = () => {
    axios
      .put(`http://localhost:5000/admin/contacts/${editedContact.id}`, editedContact)
      .then(() => {
        setContacts(
          contacts.map((contact) => (contact.id === editedContact.id ? editedContact : contact))
        );
        setEditedContact(null); // Güncelleme işlemi bittikten sonra editedContact'ı null yapıyoruz
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteContact = (id) => {
    axios
      .delete(`http://localhost:5000/admin/contacts/${id}`)
      .then(() => {
        fetchContacts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditContact = (contact) => {
    setEditedContact(contact); // Düzenlenecek iletiyi state'e set ediyoruz
  };

  return (
    <div className="contact-management">
      <h2>Contact Management</h2>
      <div className="add-contact">
        <h3>Add Contact</h3>
        <input
          type="text"
          name="name"
          value={newContact.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={newContact.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <textarea
          name="message"
          value={newContact.message}
          onChange={handleInputChange}
          placeholder="Message"
        ></textarea>
        <button onClick={handleAddContact}>Add Contact</button>
      </div>
      <div className="contact-list">
        <br />
        <h3>Contact List</h3>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <strong>Name:</strong> {contact.name} - <strong>Email:</strong>{" "}
            {contact.email}
            <br />
            <strong>Message:</strong> {contact.message}
            <button onClick={() => handleEditContact(contact)}>Edit</button>
            <button onClick={() => handleDeleteContact(contact.id)}>Delete</button>
          </li>
        ))}
      </div>
      {editedContact && (
        <div className="edit-contact">
          <h3>Edit Contact</h3>
          <input
            type="text"
            name="name"
            value={editedContact.name}
            onChange={(e) => setEditedContact({ ...editedContact, name: e.target.value })}
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={editedContact.email}
            onChange={(e) => setEditedContact({ ...editedContact, email: e.target.value })}
            placeholder="Email"
          />
          <textarea
            name="message"
            value={editedContact.message}
            onChange={(e) => setEditedContact({ ...editedContact, message: e.target.value })}
            placeholder="Message"
          ></textarea>
          <button onClick={handleUpdateContact}>Update Contact</button>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;
