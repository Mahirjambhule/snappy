import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { IoMdDownload, IoMdClose } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { sendMessageRoute, receiveMessageRoute, uploadImageRoute, deleteMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [viewImage, setViewImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (currentChat) {
        const bodyData = { from: currentUser._id };
        if (currentChat.isGroup) bodyData.groupId = currentChat._id;
        else bodyData.to = currentChat._id;

        const config = {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        };
        const response = await axios.post(receiveMessageRoute, bodyData, config);
        setMessages(response.data);
      }
    };
    fetchData();
  }, [currentChat]);

  const handleSendMsg = async (msg, file) => {
    let imageUrl = "";
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await axios.post(uploadImageRoute, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${currentUser.token}`,
          }
        });
        if (res.data.status) imageUrl = res.data.imageUrl;
      } catch (err) {
        console.error("Upload failed", err);
      }
    }

    const bodyData = { from: currentUser._id, message: msg, image: imageUrl };
    if (currentChat.isGroup) bodyData.groupId = currentChat._id;
    else bodyData.to = currentChat._id;

    const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
    await axios.post(sendMessageRoute, bodyData, config);

    if (!currentChat.isGroup) {
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        msg,
        image: imageUrl,
      });
    }

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg, image: imageUrl, sender: { username: currentUser.username } });
    setMessages(msgs);
  };

  const handleDeleteMessage = async (msgId) => {
    if (!msgId) return;

    const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
    await axios.post(deleteMessageRoute, { msgId }, config);

    setMessages((prev) => prev.filter((msg) => msg.id !== msgId));

    if (!currentChat.isGroup) {
      socket.current.emit("delete-msg", {
        to: currentChat._id,
        msgId
      });
    }
  };


  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        setArrivalMessage({
          fromSelf: false,
          message: data.msg || data,
          image: data.image || ""
        });
      });

      socket.current.on("msg-deleted", (id) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const avatarImage = currentChat.isGroup
    ? `https://robohash.org/${currentChat.name}?set=set1`
    : `https://robohash.org/${currentChat.username}?set=set4`;
  const displayName = currentChat.isGroup ? currentChat.name : currentChat.username;

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={avatarImage} alt="" />
          </div>
          <div className="username">
            <h3>{displayName}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                <div className="content">

                  {message.fromSelf && message.id && (
                    <div className="delete-icon" onClick={() => handleDeleteMessage(message.id)}>
                      <FaTrash />
                    </div>
                  )}

                  {currentChat.isGroup && !message.fromSelf && message.sender && (
                    <span className="sender-name">{message.sender.username}</span>
                  )}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="uploaded"
                      className="msg-image"
                      onClick={() => setViewImage(message.image)}
                    />
                  )}
                  {message.message && <p>{message.message}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
      {viewImage && (
        <ImageOverlay onClick={() => setViewImage(null)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <img src={viewImage} alt="Full View" />
            <div className="controls">
              <button onClick={() => downloadImage(viewImage)} title="Download"><IoMdDownload /></button>
              <button onClick={() => setViewImage(null)} title="Close"><IoMdClose /></button>
            </div>
          </div>
        </ImageOverlay>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  position: relative;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar { img { height: 3rem; } }
      .username { h3 { color: white; } }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar { width: 0.2rem; &-thumb { background-color: #ffffff39; width: 0.1rem; border-radius: 1rem; } }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        position: relative; /* Needed for delete icon positioning */

        /* DELETE ICON STYLING */
        .delete-icon {
            position: absolute;
            top: 5px;
            right: 5px;
            font-size: 0.8rem;
            color: #ff0000;
            cursor: pointer;
            display: none; /* Hidden by default */
        }

        /* Show delete icon on hover */
        &:hover .delete-icon {
            display: block;
        }

        .sender-name { font-size: 0.75rem; color: #9a86f3; font-weight: bold; margin-bottom: 2px; }
        .msg-image { 
            max-width: 200px; 
            border-radius: 10px; 
            margin-bottom: 5px; 
            cursor: pointer; 
            transition: 0.3s;
            &:hover { opacity: 0.8; }
        }
        @media screen and (min-width: 720px) and (max-width: 1080px) { max-width: 70%; }
      }
    }
    .sended { justify-content: flex-end; .content { background-color: #4f04ff21; } }
    .recieved { justify-content: flex-start; .content { background-color: #9900ff20; } }
  }
`;

const ImageOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.9);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    .overlay-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 0.5rem;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        .controls {
            margin-top: 1rem;
            display: flex;
            gap: 1rem;
            button {
                background-color: #9a86f3;
                border: none;
                color: white;
                padding: 10px;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: 0.3s;
                &:hover {
                    background-color: #4e0eff;
                    transform: scale(1.1);
                }
            }
        }
    }
`;