import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:4000");

const ChatAdmin = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [timestamp, setTimestamp] = useState("");
  const [userId, setUserId] = useState("userId-from-db"); // Lấy ID người dùng

  useEffect(() => {
    socket.emit('admin_connect');

    socket.on("receive_message", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleSendMessageToUser = async () => {
    if (message.trim()) {
      const timestamp = new Date().toLocaleString();
      const messageData = { userId, message, timestamp };

      // Gửi tin nhắn cho user
      socket.emit("send_message_to_user", messageData);
      setMessage(""); // Reset input
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded-lg ${msg.from === 'admin' ? "bg-green-100 self-end" : "bg-blue-100 self-start"} max-w-[75%]`}>
            <span>{msg.message}</span>
            <small className="text-xs text-gray-500">{msg.timestamp}</small>
          </div>
        ))}
      </div>
      <div className="p-4 flex items-center space-x-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message"
        />
        <button onClick={handleSendMessageToUser} className="px-4 py-2 bg-blue-500 text-white rounded">
          Send to User
        </button>
      </div>
    </div>
  );
};

export default ChatAdmin;
