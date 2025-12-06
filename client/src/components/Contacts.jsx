import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import CreateGroup from "./CreateGroup";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { getGroupsRoute } from "../utils/APIRoutes";

export default function Contacts({ contacts, changeChat, onlineUsers }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("chat-app-user"));
    if (data) {
      setCurrentUser(data);
      setCurrentUserName(data.username);
      setCurrentUserImage(`https://robohash.org/${data.username}?set=set4`);
      fetchGroups(data._id);
    }
  }, []);

  const fetchGroups = async (userId) => {
    try {
      const res = await axios.get(`${getGroupsRoute}/${userId}`);
      setGroups(res.data);
    } catch (err) {
      console.error("Error fetching groups", err);
    }
  };

  const changeCurrentChat = (index, contact, isGroup = false) => {
    setCurrentSelected(index);
    const chatData = { ...contact, isGroup };
    changeChat(chatData);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <h3>Snappy</h3>
          </div>
          <div className="contacts">
            <div className="section-title">
              <h4>Groups</h4>
              <FaPlus onClick={() => setShowGroupModal(true)} style={{ cursor: "pointer", color: "#9a86f3" }} />
            </div>
            {groups.map((group, index) => {
              return (
                <div
                  key={group._id}
                  className={`contact ${index + "g" === currentSelected ? "selected" : ""}`}
                  onClick={() => changeCurrentChat(index + "g", group, true)}
                >
                  <div className="avatar">
                    <img src={`https://robohash.org/${group.name}?set=set1`} alt="avatar" />
                  </div>
                  <div className="username">
                    <h3>{group.name}</h3>
                  </div>
                </div>
              );
            })}
            <div className="section-title">
              <h4>Direct Messages</h4>
            </div>
            {contacts.map((contact, index) => {
              const isOnline = onlineUsers.includes(contact._id);
              return (
                <div
                  key={contact._id}
                  className={`contact ${index === currentSelected ? "selected" : ""}`}
                  onClick={() => changeCurrentChat(index, contact, false)}
                >
                  <div className="avatar">
                    <img src={`https://robohash.org/${contact.username}?set=set4`} alt="avatar" />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                    <span className={isOnline ? "status online" : "status offline"}>
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="user-details">
              <div className="avatar">
                <img src={currentUserImage} alt="avatar" />
              </div>
              <div className="username">
                <h2>{currentUserName}</h2>
              </div>
            </div>
            <Logout />
          </div>
          {showGroupModal && (
            <CreateGroup
              contacts={contacts}
              currentUser={currentUser}
              closeModal={() => setShowGroupModal(false)}
              refreshGroups={() => fetchGroups(currentUser._id)}
            />
          )}
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    h3 { color: white; text-transform: uppercase; }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    .section-title {
        width: 90%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        h4 { color: #cfcfcf; font-size: 0.9rem; text-transform: uppercase;}
    }
    &::-webkit-scrollbar { width: 0.2rem; &-thumb { background-color: #ffffff39; width: 0.1rem; border-radius: 1rem; } }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar { img { height: 3rem; } }
      .username {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        h3 { color: white; margin: 0; }
        .status { font-size: 0.8rem; }
        .online { color: #00ff00; }
        .offline { color: #ff0000; }
      }
    }
    .selected { background-color: #9a86f3; }
  }
  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
        display: flex;
        align-items: center;
        gap: 1rem;
        .avatar { img { height: 4rem; max-inline-size: 100%; } }
        .username { h2 { color: white; } }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username { h2 { font-size: 1rem; } }
    }
  }
`;