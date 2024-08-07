import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [editedUser, setEditedUser] = useState(null); // Düzenlenecek kullanıcıyı state olarak ekledik

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    axios
      .post("http://localhost:5000/admin/users", newUser)
      .then((response) => {
        console.log(response.data);
        setUsers([...users, response.data]);
        setNewUser({
          full_name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateUser = () => {
    axios
      .put(`http://localhost:5000/admin/users/${editedUser.id}`, editedUser)
      .then(() => {
        setUsers(
          users.map((user) => (user.id === editedUser.id ? editedUser : user))
        );
        setEditedUser(null); // Güncelleme işlemi bittikten sonra editedUser'ı null yapıyoruz
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteUser = (id) => {
    axios
      .delete(`http://localhost:5000/admin/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditUser = (user) => {
    setEditedUser(user); // Düzenlenecek kullanıcıyı state'e set ediyoruz
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <div className="add-user">
        <h3>Add User</h3>
        <input
          type="text"
          name="full_name"
          value={newUser.full_name}
          onChange={handleInputChange}
          placeholder="Full Name"
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleInputChange}
          placeholder="Password"
        />
        <input
          type="password"
          name="confirmPassword"
          value={newUser.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm Password"
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <div className="user-list">
        <br />
        <h3>User List</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.full_name} - {user.email}
              <button onClick={() => handleEditUser(user)}>Edit</button>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {editedUser && (
        <div className="edit-user">
          <h3>Edit User</h3>
          <input
            type="text"
            name="full_name"
            value={editedUser.full_name}
            onChange={(e) => setEditedUser({ ...editedUser, full_name: e.target.value })}
            placeholder="Full Name"
          />
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={editedUser.password}
            onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
            placeholder="Password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={editedUser.confirmPassword}
            onChange={(e) => setEditedUser({ ...editedUser, confirmPassword: e.target.value })}
            placeholder="Confirm Password"
          />
          <button onClick={handleUpdateUser}>Update User</button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
