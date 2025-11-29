import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
// IMPORT ROUTE
import { createGroupRoute } from "../utils/APIRoutes";

export default function CreateGroup({ contacts, currentUser, closeModal, refreshGroups }) {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleCheckboxChange = (contactId) => {
    if (selectedMembers.includes(contactId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== contactId));
    } else {
      setSelectedMembers([...selectedMembers, contactId]);
    }
  };

  const handleCreateGroup = async () => {
    if (groupName.length < 3) {
      toast.error("Group name must be at least 3 characters");
      return;
    }
    if (selectedMembers.length < 2) {
      toast.error("Select at least 2 friends for a group");
      return;
    }

    try {
      // USE IMPORTED ROUTE
      const { data } = await axios.post(createGroupRoute, {
        name: groupName,
        members: selectedMembers,
        admin: currentUser._id,
      });

      if (data.status) {
        toast.success("Group created successfully!");
        refreshGroups(); 
        closeModal(); 
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create group");
    }
  };

  return (
    <Overlay>
      <Container>
        <div className="header">
            <h3>Create New Group</h3>
            <IoMdClose onClick={closeModal} />
        </div>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="members-list">
          <h4>Select Members:</h4>
          {contacts.map((contact) => (
            <div key={contact._id} className="member-item">
              <input
                type="checkbox"
                id={contact._id}
                onChange={() => handleCheckboxChange(contact._id)}
              />
              <label htmlFor={contact._id}>{contact.username}</label>
            </div>
          ))}
        </div>
        <button onClick={handleCreateGroup}>Create Group</button>
      </Container>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const Container = styled.div`
  background-color: #131324;
  padding: 2rem;
  border-radius: 1rem;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 1px solid #9a86f3;
  .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h3 { color: white; }
      svg { color: white; font-size: 1.5rem; cursor: pointer; }
  }
  input[type="text"] {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    &:focus { border: 0.1rem solid #997af0; outline: none; }
  }
  .members-list {
    max-height: 200px;
    overflow-y: auto;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .member-item {
        display: flex;
        gap: 10px;
        align-items: center;
        background-color: #ffffff10;
        padding: 10px;
        border-radius: 0.5rem;
    }
  }
  button {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    text-transform: uppercase;
    &:hover { background-color: #4e0eff; }
  }
`;