import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/TeamManagement.css";

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    image_url: "",
  });
  const [editedMember, setEditedMember] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/team")
      .then((response) => {
        setTeamMembers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleAddMember = () => {
    axios
      .post("http://localhost:5000/admin/team", newMember)
      .then((response) => {
        setTeamMembers([...teamMembers, response.data]);
        setNewMember({
          name: "",
          role: "",
          image_url: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateMember = () => {
    axios
      .put(`http://localhost:5000/admin/team/${editedMember.id}`, editedMember)
      .then(() => {
        setTeamMembers(
          teamMembers.map((member) =>
            member.id === editedMember.id ? editedMember : member
          )
        );
        setEditedMember(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteMember = (id) => {
    axios
      .delete(`http://localhost:5000/admin/team/${id}`)
      .then(() => {
        setTeamMembers(teamMembers.filter((member) => member.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditMember = (member) => {
    setEditedMember(member);
  };

  return (
    <div className="team-management-container">
      <h2>Team Management</h2>
      <div>
        <h3>Add Member</h3>
        <input
          type="text"
          name="name"
          value={newMember.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="role"
          value={newMember.role}
          onChange={handleInputChange}
          placeholder="Role"
        />
        <input
          type="text"
          name="image_url"
          value={newMember.image_url}
          onChange={handleInputChange}
          placeholder="Image URL"
        />
        <button onClick={handleAddMember}>Add Member</button>
      </div>
      <div>
        <h3>Team Member List</h3><br/>
        <ul>
          {teamMembers.map((member) => (
            <li key={member.id}>
              {member.name} - {member.role}
              <button onClick={() => handleEditMember(member)}>Edit</button>
              <button onClick={() => handleDeleteMember(member.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {editedMember && (
        <div>
          <h3>Edit Member</h3>
          <input
            type="text"
            name="name"
            value={editedMember.name}
            onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
            placeholder="Name"
          />
          <input
            type="text"
            name="role"
            value={editedMember.role}
            onChange={(e) => setEditedMember({ ...editedMember, role: e.target.value })}
            placeholder="Role"
          />
          <input
            type="text"
            name="image_url"
            value={editedMember.image_url}
            onChange={(e) => setEditedMember({ ...editedMember, image_url: e.target.value })}
            placeholder="Image URL"
          />
          <button onClick={handleUpdateMember}>Update Member</button>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
